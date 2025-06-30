# Async JavaScript Best Practices 🌟

## Overview

This guide compiles production-tested best practices for writing maintainable, performant, and reliable asynchronous JavaScript code. These practices are based on real-world experience and industry standards.

## 1. Promise and Async/Await Best Practices

### 1.1 Prefer async/await over Promise chains

```javascript
// ❌ Avoid: Complex Promise chains
function fetchUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return response.json();
    })
    .then((user) => {
      return fetch(`/api/users/${userId}/preferences`)
        .then((response) => response.json())
        .then((preferences) => ({ ...user, preferences }));
    })
    .catch((error) => {
      console.error("Failed to fetch user data:", error);
      throw error;
    });
}

// ✅ Preferred: Clean async/await
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const user = await response.json();
    const preferencesResponse = await fetch(`/api/users/${userId}/preferences`);
    const preferences = await preferencesResponse.json();

    return { ...user, preferences };
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
}
```

### 1.2 Always handle Promise rejections

```javascript
// ❌ Dangerous: Unhandled rejections
async function riskyOperation() {
  const promise = fetch("/api/data");
  // If this fails, it creates an unhandled rejection
  return promise;
}

// ✅ Safe: Proper error handling
async function safeOperation() {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Operation failed:", error);
    // Re-throw or return a safe fallback
    throw new Error(`Data fetch failed: ${error.message}`);
  }
}

// ✅ Alternative: Global handler for unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging/error reporting
});
```

### 1.3 Use Promise.allSettled() for independent operations

```javascript
// ❌ Avoid: Promise.all() when operations are independent
async function fetchDashboardData() {
  try {
    const [users, products, orders] = await Promise.all([
      fetchUsers(),
      fetchProducts(),
      fetchOrders()
    ]);
    // If any one fails, all fail
    return { users, products, orders };
  } catch (error) {
    // Lost all data due to one failure
    throw error;
  }
}

// ✅ Preferred: Promise.allSettled() for resilience
async function fetchDashboardData() {
  const [usersResult, productsResult, ordersResult] = await Promise.allSettled([
    fetchUsers(),
    fetchProducts(),
    fetchOrders()
  ]);

  return {
    users: usersResult.status === "fulfilled" ? usersResult.value : [],
    products: productsResult.status === "fulfilled" ? productsResult.value : [],
    orders: ordersResult.status === "fulfilled" ? ordersResult.value : [],
    errors: [usersResult, productsResult, ordersResult]
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason)
  };
}
```

## 2. Error Handling Patterns

### 2.1 Create custom error types for better error handling

```javascript
// Define specific error types
class APIError extends Error {
  constructor(message, status, endpoint) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.endpoint = endpoint;
  }
}

class ValidationError extends Error {
  constructor(message, field, value) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
    this.value = value;
  }
}

class NetworkError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = "NetworkError";
    this.originalError = originalError;
  }
}

// Use them in async functions
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, options);

    if (!response.ok) {
      throw new APIError(
        `Request failed: ${response.statusText}`,
        response.status,
        endpoint
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError) {
      // Network error
      throw new NetworkError("Network request failed", error);
    }
    throw error; // Re-throw other errors as-is
  }
}

// Handle different error types appropriately
async function handleUserAction(userId, data) {
  try {
    await apiRequest(`/api/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 404) {
        showMessage("User not found");
      } else if (error.status >= 500) {
        showMessage("Server error, please try again later");
      }
    } else if (error instanceof NetworkError) {
      showMessage("Network error, check your connection");
    } else {
      showMessage("An unexpected error occurred");
      console.error("Unexpected error:", error);
    }
  }
}
```

### 2.2 Implement retry logic with exponential backoff

```javascript
class RetryManager {
  static async withRetry(
    operation,
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2
  ) {
    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Don't retry on certain error types
        if (
          error instanceof ValidationError ||
          (error instanceof APIError && error.status < 500)
        ) {
          throw error;
        }

        if (attempt === maxAttempts) {
          break;
        }

        const delay = Math.min(
          baseDelay * Math.pow(backoffMultiplier, attempt - 1),
          maxDelay
        );

        console.warn(
          `Attempt ${attempt} failed, retrying in ${delay}ms:`,
          error.message
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw new Error(
      `Operation failed after ${maxAttempts} attempts: ${lastError.message}`
    );
  }
}

// Usage
async function reliableApiCall(endpoint) {
  return RetryManager.withRetry(
    () => fetch(endpoint).then((r) => r.json()),
    3, // max attempts
    1000, // base delay
    5000 // max delay
  );
}
```

## 3. Performance Optimization

### 3.1 Control concurrency to avoid overwhelming resources

```javascript
class ConcurrencyManager {
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent;
    this.running = 0;
    this.queue = [];
  }

  async execute(asyncFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ asyncFn, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.running++;
    const { asyncFn, resolve, reject } = this.queue.shift();

    try {
      const result = await asyncFn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.processQueue();
    }
  }
}

// Usage: Process large datasets without overwhelming the server
async function processLargeDataset(items) {
  const concurrencyManager = new ConcurrencyManager(5); // Max 5 concurrent

  const results = await Promise.allSettled(
    items.map((item) => concurrencyManager.execute(() => processItem(item)))
  );

  return results;
}
```

### 3.2 Implement caching for expensive async operations

```javascript
class AsyncCache {
  constructor(defaultTTL = 300000) {
    // 5 minutes default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  async get(key, asyncFn, ttl = this.defaultTTL) {
    const cached = this.cache.get(key);

    if (cached && Date.now() < cached.expiry) {
      return cached.value;
    }

    // If cache is stale but we have a value, return it while refreshing
    if (cached) {
      this.refreshInBackground(key, asyncFn, ttl);
      return cached.value;
    }

    try {
      const value = await asyncFn();
      this.cache.set(key, {
        value,
        expiry: Date.now() + ttl
      });
      return value;
    } catch (error) {
      // If we have stale data, return it on error
      if (cached) {
        console.warn("Using stale cache due to error:", error.message);
        return cached.value;
      }
      throw error;
    }
  }

  async refreshInBackground(key, asyncFn, ttl) {
    try {
      const value = await asyncFn();
      this.cache.set(key, {
        value,
        expiry: Date.now() + ttl
      });
    } catch (error) {
      console.warn("Background refresh failed:", error.message);
    }
  }

  clear(key) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

// Usage
const apiCache = new AsyncCache();

async function getCachedUserData(userId) {
  return apiCache.get(
    `user-${userId}`,
    () => fetch(`/api/users/${userId}`).then((r) => r.json()),
    600000 // Cache for 10 minutes
  );
}
```

### 3.3 Use debouncing and throttling for user interactions

```javascript
class InteractionUtils {
  static debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  static asyncDebounce(func, delay) {
    let timeoutId;
    let lastPromise;

    return function (...args) {
      clearTimeout(timeoutId);

      return new Promise((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            const result = await func.apply(this, args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    };
  }
}

// Usage examples
class SearchComponent {
  constructor() {
    this.debouncedSearch = InteractionUtils.asyncDebounce(
      this.performSearch.bind(this),
      300
    );

    this.throttledScroll = InteractionUtils.throttle(
      this.handleScroll.bind(this),
      100
    );
  }

  async performSearch(query) {
    if (!query.trim()) return [];

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      return await response.json();
    } catch (error) {
      console.error("Search failed:", error);
      return [];
    }
  }

  handleScroll() {
    // Handle scroll events efficiently
    if (window.scrollY > 100) {
      this.showScrollTopButton();
    }
  }
}
```

## 4. Memory Management

### 4.1 Clean up async operations and prevent memory leaks

```javascript
class ComponentManager {
  constructor() {
    this.abortController = new AbortController();
    this.timers = new Set();
    this.eventListeners = new Map();
  }

  // Async operations with cleanup
  async fetchData(url) {
    try {
      const response = await fetch(url, {
        signal: this.abortController.signal
      });
      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request was cancelled");
        return null;
      }
      throw error;
    }
  }

  // Timer management
  setTimeout(callback, delay) {
    const timerId = setTimeout(() => {
      this.timers.delete(timerId);
      callback();
    }, delay);

    this.timers.add(timerId);
    return timerId;
  }

  setInterval(callback, interval) {
    const intervalId = setInterval(callback, interval);
    this.timers.add(intervalId);
    return intervalId;
  }

  // Event listener management
  addEventListener(element, event, listener, options) {
    element.addEventListener(event, listener, options);

    if (!this.eventListeners.has(element)) {
      this.eventListeners.set(element, []);
    }

    this.eventListeners.get(element).push({ event, listener });
  }

  // Cleanup all resources
  destroy() {
    // Cancel ongoing requests
    this.abortController.abort();

    // Clear all timers
    this.timers.forEach((timerId) => {
      clearTimeout(timerId);
      clearInterval(timerId);
    });
    this.timers.clear();

    // Remove all event listeners
    this.eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ event, listener }) => {
        element.removeEventListener(event, listener);
      });
    });
    this.eventListeners.clear();
  }
}

// Usage
class AsyncComponent {
  constructor() {
    this.manager = new ComponentManager();
    this.initializeComponent();
  }

  async initializeComponent() {
    // Fetch initial data
    const data = await this.manager.fetchData("/api/initial-data");

    // Set up periodic updates
    this.manager.setInterval(() => {
      this.updateData();
    }, 30000);

    // Set up event listeners
    this.manager.addEventListener(
      document,
      "click",
      this.handleClick.bind(this)
    );
  }

  async updateData() {
    const data = await this.manager.fetchData("/api/updates");
    // Update UI with new data
  }

  handleClick(event) {
    // Handle click events
  }

  // Clean up when component is removed
  unmount() {
    this.manager.destroy();
  }
}
```

### 4.2 Use WeakMap and WeakSet for memory-efficient caching

```javascript
class WeakCache {
  constructor() {
    this.cache = new WeakMap();
    this.metadata = new WeakMap();
  }

  set(key, value, ttl = Infinity) {
    this.cache.set(key, value);
    this.metadata.set(key, {
      created: Date.now(),
      ttl
    });
  }

  get(key) {
    if (!this.cache.has(key)) {
      return undefined;
    }

    const meta = this.metadata.get(key);
    if (meta && Date.now() - meta.created > meta.ttl) {
      this.cache.delete(key);
      this.metadata.delete(key);
      return undefined;
    }

    return this.cache.get(key);
  }

  has(key) {
    return this.get(key) !== undefined;
  }

  delete(key) {
    this.cache.delete(key);
    this.metadata.delete(key);
  }
}

// Usage: Cache expensive computations tied to objects
const computationCache = new WeakCache();

async function expensiveAsyncComputation(obj) {
  if (computationCache.has(obj)) {
    return computationCache.get(obj);
  }

  const result = await performComplexCalculation(obj);
  computationCache.set(obj, result, 300000); // Cache for 5 minutes

  return result;
}
```

## 5. Testing Async Code

### 5.1 Use proper async testing patterns

```javascript
// ✅ Proper async test patterns
describe("Async Functions", () => {
  // Test successful async operations
  test("should fetch user data successfully", async () => {
    const userData = await fetchUserData("user123");
    expect(userData).toHaveProperty("id", "user123");
    expect(userData).toHaveProperty("name");
  });

  // Test error conditions
  test("should handle network errors gracefully", async () => {
    // Mock fetch to simulate network error
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    await expect(fetchUserData("user123")).rejects.toThrow("Data fetch failed");
  });

  // Test timeout behavior
  test("should timeout long-running operations", async () => {
    const slowPromise = new Promise((resolve) => setTimeout(resolve, 5000));
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1000)
    );

    await expect(Promise.race([slowPromise, timeoutPromise])).rejects.toThrow(
      "Timeout"
    );
  });

  // Test concurrent operations
  test("should handle concurrent requests correctly", async () => {
    const promises = Array(10)
      .fill()
      .map((_, i) => fetchUserData(`user${i}`));
    const results = await Promise.allSettled(promises);

    const successful = results.filter((r) => r.status === "fulfilled");
    expect(successful.length).toBeGreaterThan(0);
  });
});
```

### 5.2 Mock async dependencies properly

```javascript
// Create testable async functions
class UserService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getUser(id) {
    try {
      const response = await this.apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch user ${id}: ${error.message}`);
    }
  }

  async updateUser(id, updates) {
    try {
      const response = await this.apiClient.put(`/users/${id}`, updates);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error(`User ${id} not found`);
      }
      throw new Error(`Failed to update user ${id}: ${error.message}`);
    }
  }
}

// Test with mocked dependencies
describe("UserService", () => {
  let userService;
  let mockApiClient;

  beforeEach(() => {
    mockApiClient = {
      get: jest.fn(),
      put: jest.fn()
    };
    userService = new UserService(mockApiClient);
  });

  test("should get user successfully", async () => {
    const userData = { id: "123", name: "John Doe" };
    mockApiClient.get.mockResolvedValue({ data: userData });

    const result = await userService.getUser("123");

    expect(mockApiClient.get).toHaveBeenCalledWith("/users/123");
    expect(result).toEqual(userData);
  });

  test("should handle API errors appropriately", async () => {
    mockApiClient.get.mockRejectedValue(new Error("Network error"));

    await expect(userService.getUser("123")).rejects.toThrow(
      "Failed to fetch user 123: Network error"
    );
  });
});
```

## 6. Production Deployment Considerations

### 6.1 Implement comprehensive logging

```javascript
class AsyncLogger {
  constructor(service) {
    this.service = service;
  }

  async logAsyncOperation(operation, operationName, context = {}) {
    const startTime = Date.now();
    const correlationId = this.generateCorrelationId();

    this.log("info", `Starting ${operationName}`, {
      correlationId,
      context,
      timestamp: new Date().toISOString()
    });

    try {
      const result = await operation();
      const duration = Date.now() - startTime;

      this.log("info", `Completed ${operationName}`, {
        correlationId,
        duration,
        success: true,
        timestamp: new Date().toISOString()
      });

      return result;
    } catch (error) {
      const duration = Date.now() - startTime;

      this.log("error", `Failed ${operationName}`, {
        correlationId,
        duration,
        success: false,
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack
        },
        timestamp: new Date().toISOString()
      });

      throw error;
    }
  }

  log(level, message, metadata) {
    const logEntry = {
      level,
      message,
      service: this.service,
      ...metadata
    };

    console.log(JSON.stringify(logEntry));

    // Send to external logging service in production
    if (process.env.NODE_ENV === "production") {
      this.sendToLoggingService(logEntry);
    }
  }

  generateCorrelationId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async sendToLoggingService(logEntry) {
    // Implementation depends on your logging service
    // e.g., CloudWatch, Datadog, etc.
  }
}

// Usage
const logger = new AsyncLogger("user-service");

async function processUserAction(userId, action) {
  return logger.logAsyncOperation(
    async () => {
      const user = await fetchUser(userId);
      const result = await performAction(user, action);
      await saveResult(result);
      return result;
    },
    "processUserAction",
    { userId, action: action.type }
  );
}
```

### 6.2 Implement health checks and monitoring

```javascript
class HealthChecker {
  constructor() {
    this.checks = new Map();
    this.lastResults = new Map();
  }

  registerCheck(name, checkFunction, timeout = 5000) {
    this.checks.set(name, { checkFunction, timeout });
  }

  async runCheck(name) {
    const check = this.checks.get(name);
    if (!check) {
      throw new Error(`Health check '${name}' not found`);
    }

    try {
      const result = await Promise.race([
        check.checkFunction(),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Health check timeout")),
            check.timeout
          )
        )
      ]);

      this.lastResults.set(name, {
        status: "healthy",
        result,
        timestamp: Date.now()
      });

      return { status: "healthy", result };
    } catch (error) {
      this.lastResults.set(name, {
        status: "unhealthy",
        error: error.message,
        timestamp: Date.now()
      });

      return { status: "unhealthy", error: error.message };
    }
  }

  async runAllChecks() {
    const checkPromises = Array.from(this.checks.keys()).map(async (name) => {
      const result = await this.runCheck(name);
      return { name, ...result };
    });

    const results = await Promise.allSettled(checkPromises);

    return {
      overall: results.every(
        (r) => r.status === "fulfilled" && r.value.status === "healthy"
      )
        ? "healthy"
        : "unhealthy",
      checks: results.map((r) =>
        r.status === "fulfilled"
          ? r.value
          : {
              name: "unknown",
              status: "unhealthy",
              error: "Health check failed to run"
            }
      ),
      timestamp: new Date().toISOString()
    };
  }

  getLastResults() {
    return Object.fromEntries(this.lastResults);
  }
}

// Usage
const healthChecker = new HealthChecker();

// Register health checks
healthChecker.registerCheck("database", async () => {
  const result = await db.query("SELECT 1");
  return { connected: true, latency: result.duration };
});

healthChecker.registerCheck("external-api", async () => {
  const response = await fetch("https://api.external-service.com/health");
  return {
    status: response.status,
    latency: response.headers.get("x-response-time")
  };
});

// Health check endpoint
app.get("/health", async (req, res) => {
  const healthStatus = await healthChecker.runAllChecks();
  res.status(healthStatus.overall === "healthy" ? 200 : 503).json(healthStatus);
});
```

## Summary Checklist

When writing async JavaScript code, always consider:

**✅ Error Handling**

- [ ] All Promises have error handlers
- [ ] Specific error types for different scenarios
- [ ] Graceful degradation strategies
- [ ] Retry logic where appropriate

**✅ Performance**

- [ ] Concurrency limits to prevent resource exhaustion
- [ ] Caching for expensive operations
- [ ] Debouncing/throttling for user interactions
- [ ] Memory cleanup for long-running operations

**✅ Reliability**

- [ ] Timeout handling for all async operations
- [ ] Proper resource cleanup (AbortController, timers, listeners)
- [ ] Health checks and monitoring
- [ ] Comprehensive logging

**✅ Testing**

- [ ] Unit tests for both success and error scenarios
- [ ] Integration tests for async workflows
- [ ] Mocked dependencies for isolated testing
- [ ] Performance tests for critical async operations

**✅ Production Readiness**

- [ ] Structured logging with correlation IDs
- [ ] Monitoring and alerting
- [ ] Circuit breakers for external dependencies
- [ ] Documentation for async behavior

Remember: Async code is inherently more complex than synchronous code. Following these best practices will help you build robust, maintainable, and performant async applications! 🚀
