# Error Handling and Recovery Patterns

## Learning Objectives

By the end of this lesson, you should be able to:

- Implement comprehensive error handling strategies
- Build resilient applications that recover from failures
- Design fallback mechanisms and graceful degradation
- Handle different types of errors appropriately
- Implement monitoring and logging for error tracking
- Create user-friendly error experiences

## Types of Errors in Async Operations

### 1. Network Errors

```javascript
// Network connectivity issues
try {
  const response = await fetch("/api/data");
} catch (error) {
  if (error.name === "TypeError" && error.message.includes("fetch")) {
    console.error("Network error - user might be offline");
    // Handle offline scenario
  }
}
```

### 2. HTTP Errors

```javascript
async function handleHttpErrors(response) {
  if (!response.ok) {
    switch (response.status) {
      case 400:
        throw new Error("Bad Request - Invalid data sent");
      case 401:
        throw new Error("Unauthorized - Authentication required");
      case 403:
        throw new Error("Forbidden - Access denied");
      case 404:
        throw new Error("Not Found - Resource does not exist");
      case 429:
        throw new Error("Too Many Requests - Rate limit exceeded");
      case 500:
        throw new Error("Internal Server Error");
      case 502:
        throw new Error("Bad Gateway - Upstream server error");
      case 503:
        throw new Error("Service Unavailable - Server temporarily down");
      default:
        throw new Error(
          `HTTP Error ${response.status}: ${response.statusText}`
        );
    }
  }
  return response;
}
```

### 3. Timeout Errors

```javascript
class TimeoutError extends Error {
  constructor(message, timeout) {
    super(message);
    this.name = "TimeoutError";
    this.timeout = timeout;
  }
}

async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new TimeoutError(`Request timed out after ${timeout}ms`, timeout);
    }
    throw error;
  }
}
```

### 4. Parsing Errors

```javascript
async function safeJsonParse(response) {
  try {
    return await response.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      const text = await response.text();
      throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
    }
    throw error;
  }
}
```

## Error Recovery Strategies

### 1. Retry with Exponential Backoff

```javascript
class RetryManager {
  constructor(maxRetries = 3, baseDelay = 1000, maxDelay = 30000) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
    this.maxDelay = maxDelay;
  }

  async execute(asyncOperation, shouldRetry = this.defaultShouldRetry) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await asyncOperation();
      } catch (error) {
        lastError = error;

        if (attempt === this.maxRetries || !shouldRetry(error, attempt)) {
          break;
        }

        const delay = this.calculateDelay(attempt);
        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);

        await this.sleep(delay);
      }
    }

    throw new Error(
      `Operation failed after ${this.maxRetries} attempts: ${lastError.message}`
    );
  }

  calculateDelay(attempt) {
    // Exponential backoff with jitter
    const exponentialDelay = this.baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 1000; // Add randomness to prevent thundering herd
    return Math.min(exponentialDelay + jitter, this.maxDelay);
  }

  defaultShouldRetry(error, attempt) {
    // Retry on network errors and server errors (5xx)
    if (error.name === "TypeError" || error.name === "TimeoutError") {
      return true;
    }

    if (error.status && error.status >= 500) {
      return true;
    }

    // Don't retry on client errors (4xx)
    return false;
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Usage
const retryManager = new RetryManager(3, 1000, 10000);

async function resilientFetch(url, options) {
  return retryManager.execute(async () => {
    const response = await fetchWithTimeout(url, options, 5000);
    await handleHttpErrors(response);
    return response;
  });
}
```

### 2. Circuit Breaker Pattern

```javascript
class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.recoveryTimeout = options.recoveryTimeout || 60000;
    this.monitoringPeriod = options.monitoringPeriod || 10000;

    this.state = "CLOSED"; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.successCount = 0;
  }

  async execute(operation) {
    if (this.state === "OPEN") {
      if (this.shouldAttemptReset()) {
        this.state = "HALF_OPEN";
        console.log("Circuit breaker state: HALF_OPEN");
      } else {
        throw new Error("Circuit breaker is OPEN - operation not allowed");
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  shouldAttemptReset() {
    return Date.now() - this.lastFailureTime > this.recoveryTimeout;
  }

  onSuccess() {
    this.failureCount = 0;

    if (this.state === "HALF_OPEN") {
      this.successCount++;

      // Reset to CLOSED after a few successful calls
      if (this.successCount >= 3) {
        this.state = "CLOSED";
        this.successCount = 0;
        console.log("Circuit breaker state: CLOSED");
      }
    }
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
      console.log("Circuit breaker state: OPEN");
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime
    };
  }
}

// Usage
const circuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  recoveryTimeout: 30000
});

async function protectedApiCall(url) {
  return circuitBreaker.execute(async () => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  });
}
```

### 3. Fallback Mechanisms

```javascript
class FallbackManager {
  constructor() {
    this.fallbacks = new Map();
  }

  addFallback(operation, fallbackFunction) {
    this.fallbacks.set(operation, fallbackFunction);
  }

  async executeWithFallback(operationName, primaryOperation, ...args) {
    try {
      return await primaryOperation(...args);
    } catch (primaryError) {
      console.warn(
        `Primary operation '${operationName}' failed:`,
        primaryError.message
      );

      const fallback = this.fallbacks.get(operationName);
      if (fallback) {
        try {
          console.log(`Executing fallback for '${operationName}'`);
          return await fallback(...args);
        } catch (fallbackError) {
          console.error(
            `Fallback for '${operationName}' also failed:`,
            fallbackError.message
          );
          throw new Error(
            `Both primary and fallback operations failed for '${operationName}'`
          );
        }
      }

      throw primaryError;
    }
  }
}

// Usage example: User data with cache fallback
const fallbackManager = new FallbackManager();

// Primary operation: fetch from API
async function fetchUserFromApi(userId) {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

// Fallback operation: get from local cache
async function getUserFromCache(userId) {
  const cached = localStorage.getItem(`user_${userId}`);
  if (!cached) {
    throw new Error("No cached data available");
  }
  return JSON.parse(cached);
}

// Setup fallback
fallbackManager.addFallback("fetchUser", getUserFromCache);

// Use with fallback
async function getUser(userId) {
  return fallbackManager.executeWithFallback(
    "fetchUser",
    fetchUserFromApi,
    userId
  );
}
```

## Graceful Degradation

### 1. Partial Data Loading

```javascript
class PartialDataLoader {
  constructor() {
    this.results = {};
    this.errors = {};
  }

  async loadMultipleResources(resources) {
    const promises = resources.map(async (resource) => {
      try {
        const data = await this.loadResource(resource.url, resource.options);
        this.results[resource.name] = data;
        return { name: resource.name, success: true, data };
      } catch (error) {
        this.errors[resource.name] = error;
        console.warn(`Failed to load ${resource.name}:`, error.message);

        // Try to use fallback data if available
        if (resource.fallback) {
          try {
            const fallbackData = await resource.fallback();
            this.results[resource.name] = fallbackData;
            return {
              name: resource.name,
              success: true,
              data: fallbackData,
              isFallback: true
            };
          } catch (fallbackError) {
            console.warn(
              `Fallback for ${resource.name} also failed:`,
              fallbackError.message
            );
          }
        }

        return { name: resource.name, success: false, error };
      }
    });

    const results = await Promise.allSettled(
      promises.map((p) => p.catch((e) => e))
    );
    return this.processResults(results);
  }

  async loadResource(url, options = {}) {
    const response = await fetchWithTimeout(url, options, 5000);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  }

  processResults(results) {
    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    );
    const failed = results.filter(
      (r) => r.status === "rejected" || !r.value.success
    );

    return {
      data: this.results,
      errors: this.errors,
      summary: {
        total: results.length,
        successful: successful.length,
        failed: failed.length,
        partialSuccess: successful.length > 0 && failed.length > 0
      }
    };
  }
}

// Usage
const loader = new PartialDataLoader();

async function loadDashboard() {
  const resources = [
    {
      name: "userData",
      url: "/api/user",
      fallback: () => ({ name: "Guest", email: "guest@example.com" })
    },
    {
      name: "userPosts",
      url: "/api/posts",
      fallback: () => []
    },
    {
      name: "userStats",
      url: "/api/stats",
      fallback: () => ({ posts: 0, likes: 0, followers: 0 })
    },
    {
      name: "notifications",
      url: "/api/notifications"
      // No fallback - optional data
    }
  ];

  const result = await loader.loadMultipleResources(resources);

  if (result.summary.partialSuccess) {
    console.warn("Some data could not be loaded, showing partial dashboard");
  }

  return result.data;
}
```

### 2. Progressive Enhancement

```javascript
class ProgressiveLoader {
  constructor() {
    this.loadingStates = new Map();
    this.data = new Map();
  }

  async loadWithPriorities(resources) {
    // Sort by priority (lower number = higher priority)
    const sortedResources = resources.sort((a, b) => a.priority - b.priority);

    // Load critical resources first
    const critical = sortedResources.filter((r) => r.priority === 1);
    const enhanced = sortedResources.filter((r) => r.priority > 1);

    // Load critical data immediately
    const criticalResults = await this.loadResourceGroup(critical, "critical");

    // Load enhanced features in background
    this.loadResourceGroup(enhanced, "enhanced").catch((error) => {
      console.warn("Enhanced features failed to load:", error);
    });

    return criticalResults;
  }

  async loadResourceGroup(resources, groupName) {
    this.loadingStates.set(groupName, "loading");

    try {
      const results = await Promise.allSettled(
        resources.map((resource) => this.loadSingleResource(resource))
      );

      const successful = results.filter((r) => r.status === "fulfilled");

      if (successful.length === 0) {
        throw new Error(
          `No resources in ${groupName} group loaded successfully`
        );
      }

      this.loadingStates.set(groupName, "loaded");
      return successful.map((r) => r.value);
    } catch (error) {
      this.loadingStates.set(groupName, "error");
      throw error;
    }
  }

  async loadSingleResource(resource) {
    try {
      const response = await fetchWithTimeout(
        resource.url,
        resource.options,
        5000
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      this.data.set(resource.name, data);

      // Notify UI that this resource is available
      if (resource.onLoad) {
        resource.onLoad(data);
      }

      return { name: resource.name, data };
    } catch (error) {
      console.warn(`Failed to load ${resource.name}:`, error.message);

      // Use fallback if available
      if (resource.fallback) {
        const fallbackData = resource.fallback();
        this.data.set(resource.name, fallbackData);
        if (resource.onLoad) {
          resource.onLoad(fallbackData, true);
        }
        return { name: resource.name, data: fallbackData, isFallback: true };
      }

      throw error;
    }
  }
}

// Usage
const progressiveLoader = new ProgressiveLoader();

async function loadAppWithPriorities() {
  const resources = [
    {
      name: "userAuth",
      url: "/api/auth/check",
      priority: 1, // Critical
      onLoad: (data) => updateUserUI(data)
    },
    {
      name: "coreData",
      url: "/api/core",
      priority: 1, // Critical
      onLoad: (data) => renderMainContent(data)
    },
    {
      name: "recommendations",
      url: "/api/recommendations",
      priority: 2, // Enhanced
      onLoad: (data) => showRecommendations(data),
      fallback: () => []
    },
    {
      name: "analytics",
      url: "/api/analytics",
      priority: 3, // Nice to have
      onLoad: (data) => initAnalytics(data)
    }
  ];

  try {
    // App becomes usable after critical resources load
    await progressiveLoader.loadWithPriorities(resources);
    console.log("Core app loaded, enhanced features loading in background");
  } catch (error) {
    console.error("Failed to load critical app resources:", error);
    showErrorMessage("App failed to load properly");
  }
}
```

## User Experience Patterns

### 1. Loading States with Timeouts

```javascript
class LoadingStateManager {
  constructor() {
    this.loadingStates = new Map();
    this.timeouts = new Map();
  }

  startLoading(operationId, timeoutMs = 10000) {
    this.loadingStates.set(operationId, {
      isLoading: true,
      startTime: Date.now(),
      hasTimedOut: false
    });

    // Set timeout for showing "taking longer than expected" message
    const timeoutId = setTimeout(() => {
      const state = this.loadingStates.get(operationId);
      if (state && state.isLoading) {
        state.hasTimedOut = true;
        this.onTimeout(operationId);
      }
    }, timeoutMs);

    this.timeouts.set(operationId, timeoutId);
    this.onLoadingStart(operationId);
  }

  finishLoading(operationId, success = true, error = null) {
    const timeoutId = this.timeouts.get(operationId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(timeoutId);
    }

    const state = this.loadingStates.get(operationId);
    if (state) {
      state.isLoading = false;
      state.endTime = Date.now();
      state.duration = state.endTime - state.startTime;
      state.success = success;
      state.error = error;
    }

    this.onLoadingEnd(operationId, success, error);
  }

  getLoadingState(operationId) {
    return this.loadingStates.get(operationId);
  }

  // Override these methods to update UI
  onLoadingStart(operationId) {
    console.log(`Loading started: ${operationId}`);
    // Update UI to show loading indicator
  }

  onTimeout(operationId) {
    console.log(`Loading timeout: ${operationId}`);
    // Show "taking longer than expected" message
  }

  onLoadingEnd(operationId, success, error) {
    if (success) {
      console.log(`Loading completed: ${operationId}`);
    } else {
      console.log(`Loading failed: ${operationId}`, error);
    }
    // Hide loading indicator, show result or error
  }
}

// Usage
const loadingManager = new LoadingStateManager();

async function loadUserDataWithUI(userId) {
  const operationId = `loadUser_${userId}`;

  try {
    loadingManager.startLoading(operationId, 5000);

    const userData = await resilientFetch(`/api/users/${userId}`);
    const data = await userData.json();

    loadingManager.finishLoading(operationId, true);
    return data;
  } catch (error) {
    loadingManager.finishLoading(operationId, false, error);
    throw error;
  }
}
```

### 2. Error Notification System

```javascript
class ErrorNotificationSystem {
  constructor() {
    this.errorQueue = [];
    this.maxQueueSize = 10;
    this.errorCounts = new Map();
  }

  reportError(error, context = {}) {
    const errorInfo = {
      id: this.generateErrorId(),
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      severity: this.classifyError(error),
      userMessage: this.generateUserMessage(error)
    };

    this.addToQueue(errorInfo);
    this.trackErrorFrequency(error);
    this.notifyUser(errorInfo);
    this.logError(errorInfo);

    return errorInfo.id;
  }

  classifyError(error) {
    if (error.name === "TimeoutError") return "warning";
    if (error.status >= 500) return "error";
    if (error.status >= 400) return "warning";
    if (error.name === "TypeError") return "error";
    return "info";
  }

  generateUserMessage(error) {
    if (error.name === "TimeoutError") {
      return "The request is taking longer than expected. Please try again.";
    }

    if (error.status === 401) {
      return "Your session has expired. Please log in again.";
    }

    if (error.status === 403) {
      return "You don't have permission to perform this action.";
    }

    if (error.status === 404) {
      return "The requested resource was not found.";
    }

    if (error.status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }

    if (error.status >= 500) {
      return "A server error occurred. Our team has been notified.";
    }

    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return "Network connection problem. Please check your internet connection.";
    }

    return "An unexpected error occurred. Please try again.";
  }

  addToQueue(errorInfo) {
    this.errorQueue.push(errorInfo);

    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift(); // Remove oldest error
    }
  }

  trackErrorFrequency(error) {
    const key = `${error.name}_${error.message}`;
    const count = this.errorCounts.get(key) || 0;
    this.errorCounts.set(key, count + 1);

    // If same error occurs frequently, escalate
    if (count >= 3) {
      this.escalateError(error, count);
    }
  }

  escalateError(error, count) {
    console.warn(`Error occurred ${count} times:`, error.message);
    // Could send to monitoring service, show persistent notification, etc.
  }

  notifyUser(errorInfo) {
    // Show user-friendly notification
    this.showNotification(errorInfo.userMessage, errorInfo.severity);
  }

  showNotification(message, severity) {
    // Implementation depends on your UI framework
    console.log(`[${severity.toUpperCase()}] ${message}`);

    // Example: Create a toast notification
    const notification = document.createElement("div");
    notification.className = `notification notification--${severity}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }

  logError(errorInfo) {
    console.error("Error logged:", errorInfo);

    // Send to logging service
    // this.sendToLoggingService(errorInfo);
  }

  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getErrorHistory() {
    return [...this.errorQueue];
  }

  clearErrors() {
    this.errorQueue = [];
    this.errorCounts.clear();
  }
}

// Usage
const errorSystem = new ErrorNotificationSystem();

async function robustOperation() {
  try {
    const result = await someAsyncOperation();
    return result;
  } catch (error) {
    const errorId = errorSystem.reportError(error, {
      operation: "robustOperation",
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    });

    // Still throw the error if needed by calling code
    throw error;
  }
}
```

### 3. Offline Handling

```javascript
class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.pendingRequests = new Map();
    this.offlineStorage = new Map();

    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.processPendingRequests();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.notifyOffline();
    });
  }

  async executeRequest(requestId, requestFunction, options = {}) {
    if (!this.isOnline) {
      return this.handleOfflineRequest(requestId, requestFunction, options);
    }

    try {
      const result = await requestFunction();

      // Cache successful responses if caching is enabled
      if (options.cache) {
        this.offlineStorage.set(requestId, {
          data: result,
          timestamp: Date.now()
        });
      }

      return result;
    } catch (error) {
      if (this.isNetworkError(error)) {
        this.isOnline = false;
        return this.handleOfflineRequest(requestId, requestFunction, options);
      }
      throw error;
    }
  }

  handleOfflineRequest(requestId, requestFunction, options) {
    // Try to serve from cache first
    if (options.cache) {
      const cached = this.offlineStorage.get(requestId);
      if (cached && this.isCacheValid(cached, options.cacheMaxAge)) {
        console.log("Serving from offline cache:", requestId);
        return cached.data;
      }
    }

    // Queue request for when online
    if (options.queueWhenOffline) {
      this.pendingRequests.set(requestId, {
        requestFunction,
        options,
        timestamp: Date.now()
      });

      console.log("Request queued for when online:", requestId);
      return Promise.reject(
        new Error("Request queued - will execute when online")
      );
    }

    // Return offline fallback if available
    if (options.offlineFallback) {
      console.log("Using offline fallback for:", requestId);
      return options.offlineFallback();
    }

    throw new Error("Currently offline and no cached data available");
  }

  async processPendingRequests() {
    console.log("Back online, processing pending requests...");

    const requests = Array.from(this.pendingRequests.entries());
    this.pendingRequests.clear();

    for (const [requestId, { requestFunction, options }] of requests) {
      try {
        const result = await requestFunction();

        if (options.cache) {
          this.offlineStorage.set(requestId, {
            data: result,
            timestamp: Date.now()
          });
        }

        console.log("Pending request completed:", requestId);
      } catch (error) {
        console.error("Pending request failed:", requestId, error);

        // Re-queue if still having network issues
        if (this.isNetworkError(error)) {
          this.pendingRequests.set(requestId, {
            requestFunction,
            options,
            timestamp: Date.now()
          });
        }
      }
    }
  }

  isNetworkError(error) {
    return (
      error.name === "TypeError" &&
      (error.message.includes("fetch") || error.message.includes("Network"))
    );
  }

  isCacheValid(cached, maxAge = 300000) {
    // 5 minutes default
    return Date.now() - cached.timestamp < maxAge;
  }

  notifyOffline() {
    console.warn("Application is offline - limited functionality available");
    // Show offline notification to user
  }

  clearCache() {
    this.offlineStorage.clear();
  }

  getCacheSize() {
    return this.offlineStorage.size;
  }
}

// Usage
const offlineManager = new OfflineManager();

async function fetchUserData(userId) {
  return offlineManager.executeRequest(
    `user_${userId}`,
    () => fetch(`/api/users/${userId}`).then((r) => r.json()),
    {
      cache: true,
      cacheMaxAge: 300000, // 5 minutes
      queueWhenOffline: true,
      offlineFallback: () => ({ name: "Offline User", id: userId })
    }
  );
}
```

## Monitoring and Observability

### 1. Performance Monitoring

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.thresholds = {
      slow: 2000, // 2 seconds
      timeout: 10000 // 10 seconds
    };
  }

  async measureOperation(operationName, operation) {
    const startTime = performance.now();
    const startMark = `${operationName}_start`;
    const endMark = `${operationName}_end`;

    performance.mark(startMark);

    try {
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;

      performance.mark(endMark);
      performance.measure(operationName, startMark, endMark);

      this.recordMetric(operationName, {
        success: true,
        duration,
        timestamp: Date.now()
      });

      if (duration > this.thresholds.slow) {
        console.warn(
          `Slow operation detected: ${operationName} took ${duration}ms`
        );
      }

      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;

      this.recordMetric(operationName, {
        success: false,
        duration,
        error: error.message,
        timestamp: Date.now()
      });

      throw error;
    }
  }

  recordMetric(operationName, metric) {
    if (!this.metrics.has(operationName)) {
      this.metrics.set(operationName, []);
    }

    const metrics = this.metrics.get(operationName);
    metrics.push(metric);

    // Keep only last 100 measurements
    if (metrics.length > 100) {
      metrics.shift();
    }
  }

  getOperationStats(operationName) {
    const metrics = this.metrics.get(operationName) || [];
    const successful = metrics.filter((m) => m.success);
    const failed = metrics.filter((m) => !m.success);

    if (metrics.length === 0) {
      return null;
    }

    const durations = successful.map((m) => m.duration);

    return {
      totalOperations: metrics.length,
      successfulOperations: successful.length,
      failedOperations: failed.length,
      successRate: (successful.length / metrics.length) * 100,
      averageDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      p95Duration: this.calculatePercentile(durations, 95)
    };
  }

  calculatePercentile(sortedArray, percentile) {
    const index = Math.ceil(sortedArray.length * (percentile / 100)) - 1;
    return sortedArray.sort((a, b) => a - b)[index];
  }

  getAllStats() {
    const allStats = {};
    for (const [operationName] of this.metrics) {
      allStats[operationName] = this.getOperationStats(operationName);
    }
    return allStats;
  }
}

// Usage
const performanceMonitor = new PerformanceMonitor();

async function monitoredApiCall(url) {
  return performanceMonitor.measureOperation(
    `api_call_${url.replace(/[^a-zA-Z0-9]/g, "_")}`,
    () => fetch(url).then((r) => r.json())
  );
}
```

## Best Practices Summary

1. **Layer Your Error Handling**: Use multiple levels (network, application, UI)
2. **Fail Fast, Recover Gracefully**: Detect errors early, provide fallbacks
3. **Be Specific with Error Messages**: Help users understand what went wrong
4. **Monitor and Learn**: Track errors to improve reliability
5. **Plan for Offline**: Always consider network connectivity issues
6. **Use Circuit Breakers**: Prevent cascade failures
7. **Implement Retries Wisely**: Not all errors should be retried
8. **Cache for Resilience**: Store data for offline or fallback scenarios

## Summary

Robust error handling and recovery patterns enable applications to:

- **Handle failures gracefully** without crashing
- **Provide meaningful feedback** to users
- **Recover automatically** from transient issues
- **Maintain functionality** even with partial failures
- **Learn from errors** to improve reliability

These patterns are essential for building production-ready applications that provide excellent user experiences even when things go wrong.

## Next Steps

In the next lesson, we'll explore **Real-world Async Patterns** and build practical examples that combine all the concepts we've learned to create robust, real-world applications.
