# Week 9-10 Exercises: APIs and HTTP

## Learning Objectives

By completing these exercises, you will:

- Master HTTP protocols and RESTful API design
- Build robust and secure API clients
- Implement advanced patterns like authentication, caching, and error handling
- Create production-ready API integration solutions

---

## Exercise 1: HTTP Methods and Status Codes

### Part A: HTTP Method Implementation

Create a comprehensive API client that properly uses all HTTP methods.

```javascript
// Starter code
class HTTPMethodsClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // TODO: Implement all HTTP methods with proper usage
  async get(endpoint, params = {}) {
    // Your implementation here
  }

  async post(endpoint, data) {
    // Your implementation here
  }

  async put(endpoint, data) {
    // Your implementation here
  }

  async patch(endpoint, data) {
    // Your implementation here
  }

  async delete(endpoint) {
    // Your implementation here
  }

  async head(endpoint) {
    // Your implementation here
  }

  async options(endpoint) {
    // Your implementation here
  }
}
```

**Tasks:**

1. Implement all HTTP methods with appropriate headers
2. Add query parameter handling for GET requests
3. Implement proper content-type handling for different data types
4. Add response validation and status code handling

### Part B: Status Code Handler

Create a comprehensive status code handler.

```javascript
// TODO: Create a status code handler that:
// - Categorizes responses (success, client error, server error)
// - Provides meaningful error messages
// - Handles specific status codes appropriately
// - Implements retry logic for appropriate status codes

class StatusCodeHandler {
  handleResponse(response) {
    // Your implementation here
  }
}
```

**Expected Output:**

- Proper handling of 2xx, 4xx, and 5xx status codes
- Meaningful error messages for different scenarios
- Retry logic for temporary failures

---

## Exercise 2: RESTful API Design and Implementation

### Part A: Resource-Based API Client

Design and implement a RESTful API client following proper REST conventions.

```javascript
// TODO: Complete the RESTful API client
class RESTfulAPIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.resources = new Map();
  }

  // Resource management
  resource(name) {
    // Return a resource manager for the given resource
    // Example: api.resource('users').getAll()
  }

  // TODO: Implement nested resource handling
  // Example: api.resource('users').resource('posts')
}

class ResourceManager {
  constructor(client, resourceName, parentResource = null) {
    this.client = client;
    this.resourceName = resourceName;
    this.parentResource = parentResource;
  }

  // TODO: Implement CRUD operations
  async getAll(filters = {}) {
    // Your implementation
  }

  async getById(id) {
    // Your implementation
  }

  async create(data) {
    // Your implementation
  }

  async update(id, data) {
    // Your implementation
  }

  async partialUpdate(id, data) {
    // Your implementation
  }

  async delete(id) {
    // Your implementation
  }

  // TODO: Support for nested resources
  resource(name) {
    // Return nested resource manager
  }
}
```

### Part B: API Versioning

Implement different API versioning strategies.

```javascript
// TODO: Implement versioning strategies
class VersionedAPIClient {
  constructor(baseURL, versionStrategy = "url") {
    this.baseURL = baseURL;
    this.versionStrategy = versionStrategy;
    this.version = "v1";
  }

  setVersion(version) {
    // Your implementation
  }

  // TODO: Implement different versioning approaches:
  // - URL path versioning (/api/v1/users)
  // - Header versioning (Accept: application/vnd.api+json;version=1)
  // - Query parameter versioning (?version=1)
}
```

**Tasks:**

1. Create a blog API client with resources: posts, comments, authors
2. Implement nested resource access (author's posts, post's comments)
3. Add filtering, sorting, and pagination support
4. Implement all three versioning strategies

---

## Exercise 3: JWT Authentication System

### Part A: JWT Token Management

Build a complete JWT authentication system.

```javascript
// TODO: Complete the JWT authentication manager
class JWTAuthManager {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
  }

  async login(credentials) {
    // TODO: Implement login with token storage
  }

  async refreshAccessToken() {
    // TODO: Implement token refresh logic
  }

  isTokenExpired() {
    // TODO: Check if token is expired (with buffer time)
  }

  decodeToken(token) {
    // TODO: Decode JWT token safely
  }

  logout() {
    // TODO: Clear tokens and notify server
  }

  getCurrentUser() {
    // TODO: Extract user info from token
  }
}
```

### Part B: Authenticated API Client

Create an API client that automatically handles authentication.

```javascript
// TODO: Complete the authenticated API client
class AuthenticatedAPIClient {
  constructor(baseURL, authManager) {
    this.baseURL = baseURL;
    this.auth = authManager;
  }

  async request(endpoint, options = {}) {
    // TODO: Implement automatic token refresh and retry logic
    // 1. Check if token is expired, refresh if needed
    // 2. Add authorization header
    // 3. Handle 401 responses with token refresh and retry
    // 4. Handle other authentication errors appropriately
  }

  // TODO: Add convenience methods (get, post, put, delete)
}
```

**Tasks:**

1. Implement secure token storage (consider encryption)
2. Add automatic token refresh with exponential backoff
3. Handle concurrent requests during token refresh
4. Implement logout with server notification
5. Add role-based access control

---

## Exercise 4: Advanced Error Handling and Resilience

### Part A: Circuit Breaker Implementation

Build a circuit breaker pattern for API resilience.

```javascript
// TODO: Complete the circuit breaker implementation
class CircuitBreaker {
  constructor(apiCall, options = {}) {
    this.apiCall = apiCall;
    this.failureThreshold = options.failureThreshold || 5;
    this.recoveryTimeout = options.recoveryTimeout || 60000;
    this.monitoringPeriod = options.monitoringPeriod || 10000;

    // TODO: Initialize state management
    this.state = "CLOSED"; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.successCount = 0;
    this.requestCount = 0;
  }

  async execute(...args) {
    // TODO: Implement circuit breaker logic
    // 1. Check current state
    // 2. Handle OPEN state with timeout check
    // 3. Handle HALF_OPEN state with success tracking
    // 4. Execute request and handle failures
    // 5. Update state based on results
  }

  recordSuccess() {
    // TODO: Handle successful request
  }

  recordFailure() {
    // TODO: Handle failed request
  }

  canAttemptRequest() {
    // TODO: Determine if request should be attempted
  }

  getMetrics() {
    // TODO: Return circuit breaker metrics
  }
}
```

### Part B: Comprehensive Error Recovery

Implement sophisticated error handling with retry and fallback mechanisms.

```javascript
// TODO: Complete the resilient API client
class ResilientAPIClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.circuitBreakers = new Map();
    this.retryConfig = options.retry || {};
    this.fallbackStrategies = new Map();
  }

  async request(endpoint, options = {}) {
    // TODO: Implement comprehensive error handling:
    // 1. Circuit breaker protection
    // 2. Retry with exponential backoff
    // 3. Fallback mechanisms
    // 4. Error categorization and handling
  }

  addFallbackStrategy(endpoint, fallbackFn) {
    // TODO: Add fallback strategy for endpoint
  }

  async executeWithRetry(fn, retryConfig) {
    // TODO: Implement retry logic with exponential backoff
  }

  categorizeError(error) {
    // TODO: Categorize errors (network, server, client, timeout)
  }
}
```

**Tasks:**

1. Implement circuit breaker with configurable thresholds
2. Add retry logic with jitter and exponential backoff
3. Create fallback strategies (cache, default values, alternative endpoints)
4. Build comprehensive error reporting and monitoring
5. Add request/response logging and debugging tools

---

## Exercise 5: Performance Optimization

### Part A: Request Batching and Caching

Implement advanced performance optimization techniques.

```javascript
// TODO: Complete the performance-optimized API client
class PerformantAPIClient {
  constructor(baseURL, options = {}) {
    this.baseURL = baseURL;
    this.cache = new Map();
    this.batchQueue = new Map();
    this.requestDeduplication = new Map();

    // Configuration
    this.cacheConfig = options.cache || {};
    this.batchConfig = options.batch || {};
  }

  async get(endpoint, params = {}, options = {}) {
    // TODO: Implement with caching and request deduplication
    // 1. Check cache first
    // 2. Deduplicate identical requests
    // 3. Return cached or fresh data
  }

  async batchGet(endpoints) {
    // TODO: Implement request batching
    // 1. Queue requests
    // 2. Send batch request after delay or when queue is full
    // 3. Distribute responses to individual promises
  }

  // TODO: Implement cache management
  setCacheEntry(key, data, ttl) {
    // Your implementation
  }

  getCacheEntry(key) {
    // Your implementation
  }

  invalidateCache(pattern) {
    // Your implementation
  }

  // TODO: Implement request deduplication
  deduplicateRequest(key, promiseFactory) {
    // Your implementation
  }
}
```

### Part B: Connection Pooling and Request Optimization

Implement advanced networking optimizations.

```javascript
// TODO: Complete the optimized networking client
class OptimizedNetworkClient {
  constructor(options = {}) {
    this.connectionPool = new Map();
    this.requestPipeline = [];
    this.compressionEnabled = options.compression !== false;
    this.http2Enabled = options.http2 !== false;
  }

  // TODO: Implement connection reuse
  async getConnection(baseURL) {
    // Your implementation
  }

  // TODO: Implement request pipelining
  async pipelineRequests(requests) {
    // Your implementation
  }

  // TODO: Implement response compression handling
  async handleCompression(response) {
    // Your implementation
  }

  // TODO: Add performance monitoring
  getPerformanceMetrics() {
    // Your implementation
  }
}
```

**Tasks:**

1. Implement intelligent caching with TTL and LRU eviction
2. Build request batching system with configurable delays
3. Add request deduplication for identical concurrent requests
4. Implement response compression handling
5. Create performance monitoring and metrics collection

---

## Exercise 6: Real-World API Integration

### Part A: Multi-Service Integration

Build a system that integrates with multiple APIs.

```javascript
// TODO: Complete the multi-service integration
class ServiceOrchestrator {
  constructor() {
    this.services = new Map();
    this.serviceRegistry = new ServiceRegistry();
    this.eventBus = new EventBus();
  }

  registerService(name, config) {
    // TODO: Register service with configuration
    // Include: baseURL, authentication, rate limits, circuit breaker config
  }

  async executeWorkflow(workflowName, data) {
    // TODO: Execute multi-service workflow
    // 1. Load workflow definition
    // 2. Execute services in sequence or parallel
    // 3. Handle failures and rollbacks
    // 4. Return aggregated results
  }

  async aggregateData(serviceRequests) {
    // TODO: Make parallel requests and aggregate results
  }

  handleServiceFailure(serviceName, error) {
    // TODO: Handle service-specific failures
  }
}
```

### Part B: Real-Time Data Synchronization

Implement real-time data sync with fallback to REST APIs.

```javascript
// TODO: Complete the real-time sync system
class RealTimeDataSync {
  constructor(config) {
    this.config = config;
    this.websocket = null;
    this.restClient = new AuthenticatedAPIClient(config.restEndpoint);
    this.localCache = new Map();
    this.syncQueue = [];
  }

  async connect() {
    // TODO: Establish WebSocket connection with fallback to polling
  }

  async subscribe(channel, callback) {
    // TODO: Subscribe to real-time updates
  }

  async syncData(resource, localData) {
    // TODO: Sync local data with server
    // 1. Try WebSocket first
    // 2. Fallback to REST API
    // 3. Handle conflicts
    // 4. Update local cache
  }

  handleConflict(localData, serverData) {
    // TODO: Implement conflict resolution strategies
  }

  async offlineSync() {
    // TODO: Sync queued changes when connection is restored
  }
}
```

**Tasks:**

1. Build a social media dashboard that integrates multiple APIs
2. Implement real-time notifications with WebSocket and REST fallback
3. Create a data synchronization system with conflict resolution
4. Add offline capability with sync queue
5. Build comprehensive error handling for multi-service failures

---

## Exercise 7: API Security Implementation

### Part A: Comprehensive Security Client

Build a security-focused API client.

```javascript
// TODO: Complete the secure API client
class SecureAPIClient {
  constructor(baseURL, securityConfig = {}) {
    this.baseURL = baseURL;
    this.securityConfig = securityConfig;
    this.tokenStorage = new SecureTokenStorage();
    this.requestSigner = new RequestSigner(securityConfig.signingKey);
  }

  async secureRequest(endpoint, options = {}) {
    // TODO: Implement comprehensive security measures:
    // 1. Input validation and sanitization
    // 2. Request signing
    // 3. Token management
    // 4. CSRF protection
    // 5. Rate limiting
    // 6. Security header validation
  }

  validateInput(data) {
    // TODO: Implement input validation
  }

  sanitizeInput(data) {
    // TODO: Implement input sanitization
  }

  signRequest(url, method, body, timestamp) {
    // TODO: Implement request signing
  }

  validateSecurityHeaders(response) {
    // TODO: Validate security headers in response
  }
}

class SecureTokenStorage {
  constructor() {
    // TODO: Implement secure token storage with encryption
  }

  async store(key, value) {
    // TODO: Encrypt and store token
  }

  async retrieve(key) {
    // TODO: Decrypt and retrieve token
  }
}
```

### Part B: OAuth 2.0 Implementation

Implement OAuth 2.0 with PKCE flow.

```javascript
// TODO: Complete OAuth 2.0 implementation
class OAuth2Client {
  constructor(clientId, redirectUri, authServerURL) {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.authServerURL = authServerURL;
  }

  async initiateOAuth(scopes = []) {
    // TODO: Implement OAuth 2.0 with PKCE
    // 1. Generate code verifier and challenge
    // 2. Build authorization URL
    // 3. Handle state parameter for security
    // 4. Redirect to authorization server
  }

  async handleCallback(authorizationCode, state) {
    // TODO: Handle OAuth callback
    // 1. Validate state parameter
    // 2. Exchange authorization code for tokens
    // 3. Store tokens securely
    // 4. Return user information
  }

  generateCodeVerifier() {
    // TODO: Generate PKCE code verifier
  }

  generateCodeChallenge(verifier) {
    // TODO: Generate PKCE code challenge
  }

  async exchangeCodeForTokens(authorizationCode, codeVerifier) {
    // TODO: Exchange authorization code for access token
  }
}
```

**Tasks:**

1. Implement request signing with HMAC
2. Add comprehensive input validation and sanitization
3. Build secure token storage with encryption
4. Implement OAuth 2.0 with PKCE for security
5. Add security header validation and CSRF protection

---

## Exercise 8: API Testing and Monitoring

### Part A: API Testing Framework

Build a comprehensive testing framework for APIs.

```javascript
// TODO: Complete the API testing framework
class APITestFramework {
  constructor() {
    this.testSuites = [];
    this.mockServices = new Map();
    this.testResults = [];
  }

  describe(suiteName, testFn) {
    // TODO: Create test suite
  }

  it(testName, testFn) {
    // TODO: Create individual test
  }

  beforeEach(setupFn) {
    // TODO: Setup before each test
  }

  afterEach(teardownFn) {
    // TODO: Cleanup after each test
  }

  async runTests() {
    // TODO: Execute all tests and collect results
  }

  createMockService(serviceName, endpoints) {
    // TODO: Create mock service for testing
  }

  expect(actual) {
    // TODO: Create assertion methods
    return {
      toBe: (expected) => {},
      toEqual: (expected) => {},
      toContain: (expected) => {},
      toThrow: () => {},
      toBeCalledWith: (...args) => {}
    };
  }
}
```

### Part B: API Monitoring and Metrics

Implement comprehensive monitoring and alerting.

```javascript
// TODO: Complete the monitoring system
class APIMonitor {
  constructor(options = {}) {
    this.metrics = new Map();
    this.alerts = [];
    this.thresholds = options.thresholds || {};
    this.metricsHistory = [];
  }

  recordMetric(name, value, tags = {}) {
    // TODO: Record metric with timestamp and tags
  }

  recordRequest(endpoint, duration, status, error = null) {
    // TODO: Record API request metrics
  }

  checkThresholds() {
    // TODO: Check if any metrics exceed thresholds
  }

  generateAlert(type, message, severity = "warning") {
    // TODO: Generate alert and notify
  }

  getMetrics(timeRange = "1h") {
    // TODO: Get metrics for specified time range
  }

  generateReport() {
    // TODO: Generate comprehensive performance report
  }

  async healthCheck(services) {
    // TODO: Perform health checks on all services
  }
}
```

**Tasks:**

1. Build a complete test suite for your API clients
2. Implement mocking and stubbing for external services
3. Create performance and load testing capabilities
4. Build real-time monitoring with alerting
5. Generate comprehensive reports and dashboards

---

## Final Project: E-Commerce API Integration

Build a complete e-commerce system that demonstrates all learned concepts.

### Requirements:

1. **Multi-Service Architecture**: Integrate with multiple services (products, orders, payments, inventory)
2. **Authentication**: Implement JWT with refresh tokens and role-based access
3. **Real-Time Features**: WebSocket for live inventory updates and order tracking
4. **Performance**: Implement caching, batching, and request optimization
5. **Security**: Full security implementation with input validation and encryption
6. **Resilience**: Circuit breakers, retry logic, and fallback mechanisms
7. **Monitoring**: Comprehensive metrics, logging, and health checking
8. **Testing**: Unit tests, integration tests, and mocking

### Deliverables:

```javascript
// Main application structure
class ECommerceAPI {
  constructor(config) {
    this.auth = new JWTAuthManager(config.auth);
    this.products = new ProductService(config.products);
    this.orders = new OrderService(config.orders);
    this.payments = new PaymentService(config.payments);
    this.inventory = new InventoryService(config.inventory);
    this.notifications = new NotificationService(config.notifications);
    this.monitor = new APIMonitor(config.monitoring);
  }

  // TODO: Implement complete e-commerce workflow
  async purchaseWorkflow(customerId, items) {
    // 1. Authenticate customer
    // 2. Check inventory availability
    // 3. Calculate pricing and taxes
    // 4. Process payment
    // 5. Create order
    // 6. Update inventory
    // 7. Send notifications
    // 8. Handle any failures with rollback
  }
}
```

### Evaluation Criteria:

- **Code Quality**: Clean, maintainable, and well-documented code
- **Error Handling**: Comprehensive error handling and recovery
- **Performance**: Optimized for speed and efficiency
- **Security**: Proper security implementations
- **Testing**: Thorough test coverage
- **Documentation**: Clear API documentation and usage examples

---

## Self-Assessment Checklist

Before moving on, ensure you can:

### HTTP and REST APIs

- [ ] Implement all HTTP methods correctly
- [ ] Handle status codes appropriately
- [ ] Design RESTful URL structures
- [ ] Implement proper resource relationships
- [ ] Handle different data formats (JSON, FormData, etc.)

### Authentication and Security

- [ ] Implement JWT authentication with refresh tokens
- [ ] Build OAuth 2.0 flows with PKCE
- [ ] Secure token storage and management
- [ ] Input validation and sanitization
- [ ] Request signing and verification

### Advanced Patterns

- [ ] Circuit breaker implementation
- [ ] Retry logic with exponential backoff
- [ ] Request batching and caching
- [ ] Service discovery and load balancing
- [ ] Error categorization and handling

### Performance and Monitoring

- [ ] Response caching strategies
- [ ] Request deduplication
- [ ] Performance metrics collection
- [ ] Health checking and monitoring
- [ ] Load testing and optimization

### Real-World Integration

- [ ] Multi-service orchestration
- [ ] Real-time data synchronization
- [ ] Offline capabilities
- [ ] Conflict resolution
- [ ] Comprehensive testing strategies

---

## Additional Challenges

### Challenge 1: GraphQL Integration

Extend your API clients to support GraphQL in addition to REST.

### Challenge 2: API Gateway

Build a simple API gateway that routes requests to multiple backend services.

### Challenge 3: Rate Limiting Server

Implement server-side rate limiting and corresponding client-side handling.

### Challenge 4: API Documentation Generator

Create a tool that automatically generates API documentation from your client code.

### Challenge 5: Real-Time Analytics

Build a real-time analytics dashboard for API usage and performance.

---

## Resources for Further Learning

1. **HTTP Specifications**: RFC 7230-7237 series
2. **REST API Design**: REST API Design Rulebook by Mark Masse
3. **OAuth 2.0**: OAuth 2.0 in Action by Justin Richer
4. **API Security**: API Security in Action by Neil Madden
5. **Microservices**: Building Microservices by Sam Newman

Remember to test your implementations thoroughly and consider edge cases in all your solutions!
