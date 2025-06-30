# Real-World API Integration Patterns

## Learning Objectives

- Master advanced API integration patterns and architectures
- Implement robust error handling and retry strategies
- Learn about API testing, monitoring, and performance optimization
- Understand microservices communication patterns
- Build scalable and maintainable API integrations

## API Client Architecture Patterns

### Repository Pattern for API Access

```javascript
// Base repository class
class BaseRepository {
  constructor(apiClient, resourceName) {
    this.api = apiClient;
    this.resourceName = resourceName;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async findById(id, useCache = true) {
    const cacheKey = `${this.resourceName}:${id}`;

    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    const response = await this.api.get(`/${this.resourceName}/${id}`);
    const data = await response.json();

    this.cache.set(cacheKey, { data, timestamp: Date.now() });
    return data;
  }

  async findAll(filters = {}, useCache = false) {
    const cacheKey = `${this.resourceName}:all:${JSON.stringify(filters)}`;

    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    const response = await this.api.get(`/${this.resourceName}`, filters);
    const data = await response.json();

    if (useCache) {
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
    }

    return data;
  }

  async create(item) {
    const response = await this.api.post(`/${this.resourceName}`, item);
    const data = await response.json();

    // Invalidate cache
    this.invalidateCache();

    return data;
  }

  async update(id, item) {
    const response = await this.api.put(`/${this.resourceName}/${id}`, item);
    const data = await response.json();

    // Update cache
    const cacheKey = `${this.resourceName}:${id}`;
    this.cache.set(cacheKey, { data, timestamp: Date.now() });

    return data;
  }

  async delete(id) {
    await this.api.delete(`/${this.resourceName}/${id}`);

    // Remove from cache
    const cacheKey = `${this.resourceName}:${id}`;
    this.cache.delete(cacheKey);

    return true;
  }

  invalidateCache() {
    this.cache.clear();
  }
}

// Specific repository implementations
class UserRepository extends BaseRepository {
  constructor(apiClient) {
    super(apiClient, "users");
  }

  async findByEmail(email) {
    const response = await this.api.get("/users/search", { email });
    return response.json();
  }

  async updateProfile(id, profileData) {
    const response = await this.api.patch(`/users/${id}/profile`, profileData);
    return response.json();
  }

  async changePassword(id, passwordData) {
    const response = await this.api.post(
      `/users/${id}/change-password`,
      passwordData
    );
    return response.json();
  }
}

class OrderRepository extends BaseRepository {
  constructor(apiClient) {
    super(apiClient, "orders");
  }

  async findByUserId(userId) {
    const response = await this.api.get(`/users/${userId}/orders`);
    return response.json();
  }

  async updateStatus(orderId, status) {
    const response = await this.api.patch(`/orders/${orderId}/status`, {
      status
    });
    return response.json();
  }

  async getOrderItems(orderId) {
    const response = await this.api.get(`/orders/${orderId}/items`);
    return response.json();
  }
}
```

### Service Layer Pattern

```javascript
class APIService {
  constructor() {
    this.httpClient = new HTTPClient("https://api.example.com");
    this.userRepo = new UserRepository(this.httpClient);
    this.orderRepo = new OrderRepository(this.httpClient);
  }
}

class UserService {
  constructor(userRepository, orderRepository) {
    this.userRepo = userRepository;
    this.orderRepo = orderRepository;
  }

  async getUserProfile(userId) {
    try {
      const user = await this.userRepo.findById(userId);
      const orders = await this.orderRepo.findByUserId(userId);

      return {
        ...user,
        orderCount: orders.length,
        lastOrderDate: orders.length > 0 ? orders[0].createdAt : null
      };
    } catch (error) {
      throw new Error(`Failed to get user profile: ${error.message}`);
    }
  }

  async updateUserProfile(userId, updates) {
    const validation = this.validateProfileUpdates(updates);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    try {
      const updatedUser = await this.userRepo.updateProfile(userId, updates);

      // Emit event for other parts of the application
      this.emitEvent("user:profile:updated", { userId, updates });

      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }
  }

  validateProfileUpdates(updates) {
    const errors = [];

    if (updates.email && !this.isValidEmail(updates.email)) {
      errors.push("Invalid email format");
    }

    if (updates.phone && !this.isValidPhone(updates.phone)) {
      errors.push("Invalid phone format");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidPhone(phone) {
    return /^\+?[\d\s-()]+$/.test(phone);
  }

  emitEvent(eventName, data) {
    // Event emission logic
    console.log(`Event: ${eventName}`, data);
  }
}
```

## Advanced Error Handling Patterns

### Circuit Breaker Pattern

```javascript
class CircuitBreaker {
  constructor(apiCall, options = {}) {
    this.apiCall = apiCall;
    this.failureThreshold = options.failureThreshold || 5;
    this.recoveryTimeout = options.recoveryTimeout || 60000; // 1 minute
    this.monitoringPeriod = options.monitoringPeriod || 10000; // 10 seconds

    this.state = "CLOSED"; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.successCount = 0;
  }

  async execute(...args) {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime >= this.recoveryTimeout) {
        this.state = "HALF_OPEN";
        this.successCount = 0;
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await this.apiCall(...args);

      if (this.state === "HALF_OPEN") {
        this.successCount++;
        if (this.successCount >= 3) {
          this.reset();
        }
      } else {
        this.reset();
      }

      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.failureThreshold) {
      this.state = "OPEN";
    }
  }

  reset() {
    this.state = "CLOSED";
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = null;
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
class ResilientAPIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.circuitBreakers = new Map();
  }

  getCircuitBreaker(endpoint) {
    if (!this.circuitBreakers.has(endpoint)) {
      const apiCall = async (...args) => {
        return fetch(`${this.baseURL}${endpoint}`, ...args);
      };

      this.circuitBreakers.set(endpoint, new CircuitBreaker(apiCall));
    }

    return this.circuitBreakers.get(endpoint);
  }

  async request(endpoint, options = {}) {
    const circuitBreaker = this.getCircuitBreaker(endpoint);

    try {
      return await circuitBreaker.execute(options);
    } catch (error) {
      console.error(`Circuit breaker error for ${endpoint}:`, error.message);
      throw error;
    }
  }
}
```

### Retry with Exponential Backoff

```javascript
class RetryableAPIClient {
  constructor(baseURL, retryConfig = {}) {
    this.baseURL = baseURL;
    this.maxRetries = retryConfig.maxRetries || 3;
    this.baseDelay = retryConfig.baseDelay || 1000;
    this.maxDelay = retryConfig.maxDelay || 30000;
    this.retryableErrors = retryConfig.retryableErrors || [
      408, 429, 500, 502, 503, 504
    ];
  }

  async request(endpoint, options = {}) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries + 1; attempt++) {
      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, options);

        if (response.ok || !this.isRetryableError(response.status)) {
          return response;
        }

        lastError = new Error(
          `HTTP ${response.status}: ${response.statusText}`
        );

        if (attempt <= this.maxRetries) {
          await this.delay(this.calculateDelay(attempt));
        }
      } catch (error) {
        lastError = error;

        if (attempt <= this.maxRetries && this.isNetworkError(error)) {
          await this.delay(this.calculateDelay(attempt));
        } else {
          throw error;
        }
      }
    }

    throw lastError;
  }

  isRetryableError(status) {
    return this.retryableErrors.includes(status);
  }

  isNetworkError(error) {
    return error.name === "TypeError" || error.message.includes("network");
  }

  calculateDelay(attempt) {
    const delay = this.baseDelay * Math.pow(2, attempt - 1);
    const jitter = Math.random() * 1000; // Add jitter to prevent thundering herd
    return Math.min(delay + jitter, this.maxDelay);
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

## API Performance Optimization

### Request Batching and Debouncing

```javascript
class BatchingAPIClient {
  constructor(baseURL, batchConfig = {}) {
    this.baseURL = baseURL;
    this.batchDelay = batchConfig.delay || 50;
    this.maxBatchSize = batchConfig.maxSize || 10;
    this.batchQueues = new Map();
  }

  async batchRequest(endpoint, requests) {
    const response = await fetch(`${this.baseURL}${endpoint}/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requests })
    });

    return response.json();
  }

  async get(endpoint, id) {
    return new Promise((resolve, reject) => {
      if (!this.batchQueues.has(endpoint)) {
        this.batchQueues.set(endpoint, []);

        // Schedule batch processing
        setTimeout(() => this.processBatch(endpoint), this.batchDelay);
      }

      const queue = this.batchQueues.get(endpoint);
      queue.push({ id, resolve, reject });

      // Process immediately if batch is full
      if (queue.length >= this.maxBatchSize) {
        this.processBatch(endpoint);
      }
    });
  }

  async processBatch(endpoint) {
    const queue = this.batchQueues.get(endpoint);
    if (!queue || queue.length === 0) return;

    this.batchQueues.set(endpoint, []); // Clear queue

    try {
      const ids = queue.map((item) => item.id);
      const results = await this.batchRequest(endpoint, ids);

      // Map results back to individual promises
      queue.forEach(({ id, resolve }) => {
        const result = results.find((r) => r.id === id);
        resolve(result || null);
      });
    } catch (error) {
      queue.forEach(({ reject }) => reject(error));
    }
  }
}

// Debounced search
class DebouncedSearchClient {
  constructor(baseURL, debounceMs = 300) {
    this.baseURL = baseURL;
    this.debounceMs = debounceMs;
    this.searchTimeouts = new Map();
  }

  async search(query, endpoint = "/search") {
    return new Promise((resolve, reject) => {
      // Clear existing timeout for this endpoint
      if (this.searchTimeouts.has(endpoint)) {
        clearTimeout(this.searchTimeouts.get(endpoint));
      }

      // Set new timeout
      const timeoutId = setTimeout(async () => {
        try {
          const response = await fetch(
            `${this.baseURL}${endpoint}?q=${encodeURIComponent(query)}`
          );
          const results = await response.json();
          resolve(results);
        } catch (error) {
          reject(error);
        }

        this.searchTimeouts.delete(endpoint);
      }, this.debounceMs);

      this.searchTimeouts.set(endpoint, timeoutId);
    });
  }
}
```

### Response Caching Strategies

```javascript
class CachingAPIClient {
  constructor(baseURL, cacheConfig = {}) {
    this.baseURL = baseURL;
    this.cache = new Map();
    this.defaultTTL = cacheConfig.defaultTTL || 300000; // 5 minutes
    this.maxCacheSize = cacheConfig.maxCacheSize || 100;
  }

  async request(endpoint, options = {}) {
    const cacheKey = this.generateCacheKey(endpoint, options);
    const cached = this.cache.get(cacheKey);

    // Check cache validity
    if (cached && Date.now() < cached.expiresAt) {
      return {
        ...cached.response.clone(),
        fromCache: true
      };
    }

    // Make request
    const response = await fetch(`${this.baseURL}${endpoint}`, options);

    // Cache successful responses
    if (response.ok && options.method !== "POST") {
      this.setCacheEntry(cacheKey, response.clone(), options.cacheTTL);
    }

    return response;
  }

  generateCacheKey(endpoint, options) {
    const method = options.method || "GET";
    const body = options.body || "";
    const params = new URLSearchParams(endpoint.split("?")[1] || "").toString();

    return `${method}:${endpoint.split("?")[0]}:${params}:${body}`;
  }

  setCacheEntry(key, response, ttl = null) {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    const expiresAt = Date.now() + (ttl || this.defaultTTL);

    this.cache.set(key, {
      response,
      expiresAt,
      createdAt: Date.now()
    });
  }

  invalidateCache(pattern = null) {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const regex = new RegExp(pattern);

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  getCacheStats() {
    const entries = Array.from(this.cache.values());
    const now = Date.now();

    return {
      totalEntries: entries.length,
      validEntries: entries.filter((entry) => now < entry.expiresAt).length,
      expiredEntries: entries.filter((entry) => now >= entry.expiresAt).length,
      memoryUsage: JSON.stringify(Array.from(this.cache.entries())).length
    };
  }
}
```

## API Testing Patterns

### Mock API Client for Testing

```javascript
class MockAPIClient {
  constructor(mockData = {}, options = {}) {
    this.mockData = mockData;
    this.delay = options.delay || 100;
    this.failureRate = options.failureRate || 0;
    this.requestLog = [];
  }

  async request(endpoint, options = {}) {
    // Log request for assertions
    this.requestLog.push({
      endpoint,
      options,
      timestamp: Date.now()
    });

    // Simulate network delay
    await this.delay(this.delay);

    // Simulate random failures
    if (Math.random() < this.failureRate) {
      throw new Error("Simulated network failure");
    }

    const method = options.method || "GET";
    const mockKey = `${method} ${endpoint}`;

    if (this.mockData[mockKey]) {
      const mockResponse = this.mockData[mockKey];

      return {
        ok: mockResponse.status >= 200 && mockResponse.status < 300,
        status: mockResponse.status || 200,
        json: async () => mockResponse.data,
        text: async () => JSON.stringify(mockResponse.data)
      };
    }

    // Default 404 response
    return {
      ok: false,
      status: 404,
      json: async () => ({ error: "Not found" }),
      text: async () => '{"error":"Not found"}'
    };
  }

  getRequestLog() {
    return this.requestLog;
  }

  clearRequestLog() {
    this.requestLog = [];
  }
}

// Test helper
class APITestHelper {
  static createMockClient(scenarios = {}) {
    const mockData = {
      "GET /users": {
        status: 200,
        data: [
          { id: 1, name: "John Doe", email: "john@example.com" },
          { id: 2, name: "Jane Smith", email: "jane@example.com" }
        ]
      },
      "GET /users/1": {
        status: 200,
        data: { id: 1, name: "John Doe", email: "john@example.com" }
      },
      "POST /users": {
        status: 201,
        data: { id: 3, name: "New User", email: "new@example.com" }
      },
      ...scenarios
    };

    return new MockAPIClient(mockData);
  }

  static async testAPIFlow(client, operations) {
    const results = [];

    for (const operation of operations) {
      try {
        const result = await client.request(
          operation.endpoint,
          operation.options
        );
        results.push({
          operation,
          success: true,
          result
        });
      } catch (error) {
        results.push({
          operation,
          success: false,
          error: error.message
        });
      }
    }

    return results;
  }
}

// Usage in tests
async function testUserService() {
  const mockClient = APITestHelper.createMockClient({
    "GET /users/999": {
      status: 404,
      data: { error: "User not found" }
    }
  });

  const userRepo = new UserRepository(mockClient);

  // Test successful case
  const user = await userRepo.findById(1);
  console.assert(user.id === 1, "Should return user with ID 1");

  // Test error case
  try {
    await userRepo.findById(999);
    console.assert(false, "Should throw error for non-existent user");
  } catch (error) {
    console.assert(
      error.message.includes("not found"),
      "Should throw not found error"
    );
  }

  console.log("All tests passed!");
}
```

## Microservices Communication Patterns

### Service Discovery and Load Balancing

```javascript
class ServiceRegistry {
  constructor() {
    this.services = new Map();
    this.healthChecks = new Map();
  }

  registerService(name, instances) {
    this.services.set(
      name,
      instances.map((instance) => ({
        ...instance,
        healthy: true,
        lastCheck: Date.now()
      }))
    );

    // Start health checking
    this.startHealthCheck(name);
  }

  getServiceInstance(name, strategy = "round-robin") {
    const instances = this.services.get(name);

    if (!instances || instances.length === 0) {
      throw new Error(`Service ${name} not found`);
    }

    const healthyInstances = instances.filter((instance) => instance.healthy);

    if (healthyInstances.length === 0) {
      throw new Error(`No healthy instances for service ${name}`);
    }

    switch (strategy) {
      case "round-robin":
        return this.roundRobinSelection(healthyInstances);
      case "random":
        return healthyInstances[
          Math.floor(Math.random() * healthyInstances.length)
        ];
      case "least-connections":
        return healthyInstances.reduce((min, instance) =>
          instance.connections < min.connections ? instance : min
        );
      default:
        return healthyInstances[0];
    }
  }

  roundRobinSelection(instances) {
    const serviceName = this.getServiceNameByInstances(instances);

    if (!this.lastUsedIndex) {
      this.lastUsedIndex = new Map();
    }

    const lastIndex = this.lastUsedIndex.get(serviceName) || 0;
    const nextIndex = (lastIndex + 1) % instances.length;

    this.lastUsedIndex.set(serviceName, nextIndex);

    return instances[nextIndex];
  }

  async startHealthCheck(serviceName) {
    const checkInterval = 30000; // 30 seconds

    const healthCheckInterval = setInterval(async () => {
      const instances = this.services.get(serviceName);

      if (!instances) {
        clearInterval(healthCheckInterval);
        return;
      }

      for (const instance of instances) {
        try {
          const response = await fetch(`${instance.url}/health`, {
            timeout: 5000
          });

          instance.healthy = response.ok;
          instance.lastCheck = Date.now();
        } catch (error) {
          instance.healthy = false;
          instance.lastCheck = Date.now();
        }
      }
    }, checkInterval);

    this.healthChecks.set(serviceName, healthCheckInterval);
  }
}

class MicroserviceClient {
  constructor(serviceRegistry) {
    this.registry = serviceRegistry;
    this.circuitBreakers = new Map();
  }

  async callService(serviceName, endpoint, options = {}) {
    const instance = this.registry.getServiceInstance(serviceName);
    const url = `${instance.url}${endpoint}`;

    // Get or create circuit breaker for this instance
    const breakerKey = `${serviceName}:${instance.url}`;

    if (!this.circuitBreakers.has(breakerKey)) {
      this.circuitBreakers.set(
        breakerKey,
        new CircuitBreaker(async (url, options) => fetch(url, options))
      );
    }

    const circuitBreaker = this.circuitBreakers.get(breakerKey);

    try {
      instance.connections = (instance.connections || 0) + 1;

      const response = await circuitBreaker.execute(url, {
        ...options,
        headers: {
          "X-Service-Name": serviceName,
          "X-Request-ID": this.generateRequestId(),
          ...options.headers
        }
      });

      return response;
    } finally {
      instance.connections = Math.max(0, (instance.connections || 1) - 1);
    }
  }

  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Usage
const registry = new ServiceRegistry();

// Register services
registry.registerService("user-service", [
  { url: "https://user-service-1.example.com" },
  { url: "https://user-service-2.example.com" }
]);

registry.registerService("order-service", [
  { url: "https://order-service-1.example.com" },
  { url: "https://order-service-2.example.com" }
]);

const microserviceClient = new MicroserviceClient(registry);

// Make calls to microservices
const userResponse = await microserviceClient.callService(
  "user-service",
  "/users/123"
);
const orderResponse = await microserviceClient.callService(
  "order-service",
  "/orders",
  {
    method: "POST",
    body: JSON.stringify(orderData)
  }
);
```

## API Monitoring and Metrics

### Request Tracking and Metrics

```javascript
class APIMetrics {
  constructor() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      responseTimeHistory: [],
      errorsByType: new Map(),
      requestsByEndpoint: new Map()
    };
  }

  recordRequest(endpoint, duration, success, error = null) {
    this.metrics.totalRequests++;

    if (success) {
      this.metrics.successfulRequests++;
    } else {
      this.metrics.failedRequests++;

      if (error) {
        const errorType = error.constructor.name;
        this.metrics.errorsByType.set(
          errorType,
          (this.metrics.errorsByType.get(errorType) || 0) + 1
        );
      }
    }

    // Update response time metrics
    this.metrics.responseTimeHistory.push(duration);
    if (this.metrics.responseTimeHistory.length > 100) {
      this.metrics.responseTimeHistory.shift();
    }

    const totalTime = this.metrics.responseTimeHistory.reduce(
      (sum, time) => sum + time,
      0
    );
    this.metrics.averageResponseTime =
      totalTime / this.metrics.responseTimeHistory.length;

    // Update endpoint metrics
    const endpointMetrics = this.metrics.requestsByEndpoint.get(endpoint) || {
      count: 0,
      averageTime: 0,
      totalTime: 0
    };

    endpointMetrics.count++;
    endpointMetrics.totalTime += duration;
    endpointMetrics.averageTime =
      endpointMetrics.totalTime / endpointMetrics.count;

    this.metrics.requestsByEndpoint.set(endpoint, endpointMetrics);
  }

  getMetrics() {
    return {
      ...this.metrics,
      successRate:
        this.metrics.totalRequests > 0
          ? this.metrics.successfulRequests / this.metrics.totalRequests
          : 0,
      errorRate:
        this.metrics.totalRequests > 0
          ? this.metrics.failedRequests / this.metrics.totalRequests
          : 0
    };
  }

  getTopSlowEndpoints(limit = 5) {
    return Array.from(this.metrics.requestsByEndpoint.entries())
      .sort(([, a], [, b]) => b.averageTime - a.averageTime)
      .slice(0, limit)
      .map(([endpoint, metrics]) => ({ endpoint, ...metrics }));
  }

  reset() {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      responseTimeHistory: [],
      errorsByType: new Map(),
      requestsByEndpoint: new Map()
    };
  }
}

class MonitoredAPIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.metrics = new APIMetrics();
  }

  async request(endpoint, options = {}) {
    const startTime = Date.now();
    let success = false;
    let error = null;

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      success = response.ok;

      if (!response.ok) {
        error = new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response;
    } catch (err) {
      error = err;
      throw err;
    } finally {
      const duration = Date.now() - startTime;
      this.metrics.recordRequest(endpoint, duration, success, error);
    }
  }

  getMetrics() {
    return this.metrics.getMetrics();
  }

  logMetrics() {
    const metrics = this.getMetrics();

    console.log("API Client Metrics:");
    console.log(`Total Requests: ${metrics.totalRequests}`);
    console.log(`Success Rate: ${(metrics.successRate * 100).toFixed(2)}%`);
    console.log(
      `Average Response Time: ${metrics.averageResponseTime.toFixed(2)}ms`
    );

    const slowEndpoints = this.metrics.getTopSlowEndpoints();
    if (slowEndpoints.length > 0) {
      console.log("Slowest Endpoints:");
      slowEndpoints.forEach(({ endpoint, averageTime, count }) => {
        console.log(
          `  ${endpoint}: ${averageTime.toFixed(2)}ms (${count} requests)`
        );
      });
    }
  }
}
```

## Self-Check Questions

1. How do repository and service patterns improve API code organization?
2. What is the circuit breaker pattern and when should you use it?
3. How do you implement effective caching strategies for API responses?
4. What are the benefits of request batching and when is it appropriate?
5. How do you design a microservices communication layer?

## Practice Exercises

1. **Repository Pattern**: Implement a complete repository layer for a blogging platform
2. **Circuit Breaker**: Build a circuit breaker with different failure scenarios
3. **API Metrics**: Create a comprehensive metrics and monitoring system
4. **Service Discovery**: Implement a service registry with health checking
5. **Performance Testing**: Build tools to test API performance and reliability

## Next Steps

- Learn about API gateway patterns and implementation
- Study distributed tracing and observability
- Explore event-driven architectures and message queues
- Practice with containerized microservices deployment
