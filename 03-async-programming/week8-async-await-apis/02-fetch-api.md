# Working with APIs and Fetch

## Learning Objectives

By the end of this lesson, you should be able to:

- Understand HTTP methods and status codes
- Use the Fetch API to make HTTP requests
- Handle different types of API responses (JSON, text, blobs)
- Implement proper error handling for API calls
- Work with request headers and authentication
- Handle API rate limiting and retries
- Build robust API client classes

## Introduction to APIs

**API (Application Programming Interface)** is a set of rules and protocols that allows different software applications to communicate with each other. Web APIs typically use HTTP(S) protocol and exchange data in formats like JSON.

### Common HTTP Methods

```javascript
// GET - Retrieve data (read-only)
fetch("/api/users"); // Get all users
fetch("/api/users/123"); // Get specific user

// POST - Create new resources
fetch("/api/users", {
  method: "POST",
  body: JSON.stringify(newUser)
});

// PUT - Update/replace entire resource
fetch("/api/users/123", {
  method: "PUT",
  body: JSON.stringify(updatedUser)
});

// PATCH - Update part of a resource
fetch("/api/users/123", {
  method: "PATCH",
  body: JSON.stringify(partialUpdate)
});

// DELETE - Remove a resource
fetch("/api/users/123", {
  method: "DELETE"
});
```

### HTTP Status Codes

```javascript
// 2xx Success
200; // OK - Request successful
201; // Created - Resource created successfully
204; // No Content - Success but no response body

// 3xx Redirection
301; // Moved Permanently
302; // Found (temporary redirect)

// 4xx Client Errors
400; // Bad Request - Invalid request syntax
401; // Unauthorized - Authentication required
403; // Forbidden - Access denied
404; // Not Found - Resource doesn't exist
429; // Too Many Requests - Rate limit exceeded

// 5xx Server Errors
500; // Internal Server Error
502; // Bad Gateway
503; // Service Unavailable
```

## The Fetch API

The Fetch API provides a modern, Promise-based way to make HTTP requests. It's built into modern browsers and returns Promises.

### Basic Fetch Syntax

```javascript
// Basic GET request
fetch("/api/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));

// With async/await
async function fetchData() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

### Fetch Options

```javascript
const options = {
  method: "POST", // HTTP method
  headers: {
    // Request headers
    "Content-Type": "application/json",
    Authorization: "Bearer token123",
    "X-API-Key": "your-api-key"
  },
  body: JSON.stringify({
    // Request body
    name: "John Doe",
    email: "john@example.com"
  }),
  mode: "cors", // CORS mode
  cache: "no-cache", // Cache mode
  credentials: "include", // Include cookies
  redirect: "follow", // Redirect handling
  referrerPolicy: "no-referrer"
};

fetch("/api/users", options);
```

## Making Different Types of Requests

### 1. GET Requests

```javascript
// Simple GET request
async function getUsers() {
  try {
    const response = await fetch("/api/users");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
}

// GET with query parameters
async function searchUsers(query, page = 1, limit = 10) {
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    limit: limit.toString()
  });

  try {
    const response = await fetch(`/api/users/search?${params}`);

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Search failed:", error);
    throw error;
  }
}
```

### 2. POST Requests (Creating Data)

```javascript
async function createUser(userData) {
  try {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      // Handle different error types
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(`Validation error: ${errorData.message}`);
      } else if (response.status === 409) {
        throw new Error("User already exists");
      } else {
        throw new Error(`Failed to create user: ${response.status}`);
      }
    }

    const newUser = await response.json();
    console.log("User created:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Usage
const newUser = {
  name: "Alice Johnson",
  email: "alice@example.com",
  role: "user"
};

createUser(newUser)
  .then((user) => console.log("Created:", user))
  .catch((error) => console.error("Creation failed:", error));
```

### 3. PUT/PATCH Requests (Updating Data)

```javascript
// PUT - Replace entire resource
async function updateUser(userId, userData) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`Update failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Update failed:", error);
    throw error;
  }
}

// PATCH - Update partial resource
async function updateUserPartial(userId, updates) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updates)
    });

    if (!response.ok) {
      throw new Error(`Partial update failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Partial update failed:", error);
    throw error;
  }
}

// Usage
updateUserPartial(123, { email: "newemail@example.com" });
```

### 4. DELETE Requests

```javascript
async function deleteUser(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User not found");
      } else if (response.status === 403) {
        throw new Error("Not authorized to delete this user");
      } else {
        throw new Error(`Delete failed: ${response.status}`);
      }
    }

    // Some APIs return 204 (No Content) for successful deletes
    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
}
```

## Handling Different Response Types

### 1. JSON Responses

```javascript
async function fetchJSON(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if response is actually JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Response is not JSON");
    }

    return await response.json();
  } catch (error) {
    console.error("JSON fetch failed:", error);
    throw error;
  }
}
```

### 2. Text Responses

```javascript
async function fetchText(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error("Text fetch failed:", error);
    throw error;
  }
}
```

### 3. Binary Data (Blobs)

```javascript
async function downloadFile(url, filename) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Download failed: ${response.status}`);
    }

    const blob = await response.blob();

    // Create download link
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    link.click();

    // Clean up
    window.URL.revokeObjectURL(downloadUrl);

    return blob;
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
}
```

### 4. Streaming Responses

```javascript
async function fetchWithProgress(url, onProgress) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentLength = response.headers.get("content-length");
    const total = parseInt(contentLength, 10);
    let loaded = 0;

    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      loaded += value.length;

      if (onProgress && total) {
        onProgress(loaded, total);
      }
    }

    // Combine chunks
    const allChunks = new Uint8Array(loaded);
    let offset = 0;
    for (const chunk of chunks) {
      allChunks.set(chunk, offset);
      offset += chunk.length;
    }

    return allChunks;
  } catch (error) {
    console.error("Streaming fetch failed:", error);
    throw error;
  }
}

// Usage
fetchWithProgress("/api/large-file", (loaded, total) => {
  const percentage = Math.round((loaded / total) * 100);
  console.log(`Progress: ${percentage}%`);
});
```

## Authentication and Headers

### 1. API Key Authentication

```javascript
class ApiClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const config = {
      ...options,
      headers: {
        "X-API-Key": this.apiKey,
        "Content-Type": "application/json",
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }
}

const api = new ApiClient("/api", "your-api-key-here");
```

### 2. Bearer Token Authentication

```javascript
class AuthenticatedApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const config = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        // Token might be expired
        throw new Error("Authentication required");
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async login(username, password) {
    try {
      const response = await this.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });

      this.setToken(response.token);
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }
}
```

### 3. Custom Headers

```javascript
async function fetchWithCustomHeaders(url, customHeaders = {}) {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "MyApp/1.0",
    "X-Requested-With": "XMLHttpRequest"
  };

  try {
    const response = await fetch(url, {
      headers: {
        ...defaultHeaders,
        ...customHeaders
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}
```

## Error Handling Strategies

### 1. Comprehensive Error Handler

```javascript
class ApiError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }
}

async function handleApiResponse(response) {
  if (response.ok) {
    return response;
  }

  let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
  let errorData = null;

  try {
    // Try to parse error response as JSON
    errorData = await response.json();
    if (errorData.message) {
      errorMessage = errorData.message;
    }
  } catch (parseError) {
    // If JSON parsing fails, try to get text
    try {
      const textError = await response.text();
      if (textError) {
        errorMessage = textError;
      }
    } catch (textError) {
      // Use default error message
    }
  }

  throw new ApiError(errorMessage, response.status, errorData);
}

async function robustFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    await handleApiResponse(response);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      // Handle API errors
      console.error("API Error:", error.message, error.status);
    } else {
      // Handle network errors, etc.
      console.error("Network Error:", error.message);
    }
    throw error;
  }
}
```

### 2. Retry Mechanism

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Only retry on server errors (5xx) or network errors
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000;
      console.log(`Attempt ${attempt} failed, retrying in ${delay}ms...`);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}
```

### 3. Circuit Breaker Pattern

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = "CLOSED"; // CLOSED, OPEN, HALF_OPEN
  }

  async execute(fetchFunction) {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = "HALF_OPEN";
      } else {
        throw new Error("Circuit breaker is OPEN");
      }
    }

    try {
      const result = await fetchFunction();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = "CLOSED";
  }

  onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.threshold) {
      this.state = "OPEN";
    }
  }
}

// Usage
const circuitBreaker = new CircuitBreaker(3, 30000);

async function resilientFetch(url) {
  return circuitBreaker.execute(() => fetch(url));
}
```

## Rate Limiting and Throttling

### 1. Simple Rate Limiter

```javascript
class RateLimiter {
  constructor(requestsPerSecond = 10) {
    this.requestsPerSecond = requestsPerSecond;
    this.requests = [];
  }

  async acquire() {
    const now = Date.now();

    // Remove requests older than 1 second
    this.requests = this.requests.filter((time) => now - time < 1000);

    if (this.requests.length >= this.requestsPerSecond) {
      // Wait until we can make another request
      const oldestRequest = this.requests[0];
      const waitTime = 1000 - (now - oldestRequest);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      return this.acquire(); // Retry
    }

    this.requests.push(now);
  }
}

const rateLimiter = new RateLimiter(5); // 5 requests per second

async function rateLimitedFetch(url, options) {
  await rateLimiter.acquire();
  return fetch(url, options);
}
```

### 2. Request Queue

```javascript
class RequestQueue {
  constructor(concurrency = 3, delayBetweenRequests = 100) {
    this.concurrency = concurrency;
    this.delayBetweenRequests = delayBetweenRequests;
    this.queue = [];
    this.running = 0;
  }

  async add(fetchFunction) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fetchFunction, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    this.running++;
    const { fetchFunction, resolve, reject } = this.queue.shift();

    try {
      await new Promise((r) => setTimeout(r, this.delayBetweenRequests));
      const result = await fetchFunction();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.process(); // Process next item
    }
  }
}

const requestQueue = new RequestQueue(3, 200);

async function queuedFetch(url, options) {
  return requestQueue.add(() => fetch(url, options));
}
```

## Real-World API Client Example

```javascript
class ModernApiClient {
  constructor(config = {}) {
    this.baseUrl = config.baseUrl || "";
    this.defaultHeaders = config.headers || {};
    this.timeout = config.timeout || 10000;
    this.maxRetries = config.maxRetries || 3;
    this.rateLimiter = new RateLimiter(config.requestsPerSecond || 10);
    this.circuitBreaker = new CircuitBreaker(5, 60000);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    const config = {
      method: "GET",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
        ...options.headers
      }
    };

    // Apply rate limiting
    await this.rateLimiter.acquire();

    // Use circuit breaker
    return this.circuitBreaker.execute(async () => {
      return this.fetchWithRetry(url, config);
    });
  }

  async fetchWithRetry(url, config) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new ApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            response
          );
        }

        return await this.parseResponse(response);
      } catch (error) {
        lastError = error;

        if (attempt === this.maxRetries || !this.shouldRetry(error)) {
          break;
        }

        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  }

  shouldRetry(error) {
    // Retry on network errors or server errors (5xx)
    return !error.status || error.status >= 500;
  }

  async parseResponse(response) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return response.json();
    } else if (contentType.includes("text/")) {
      return response.text();
    } else {
      return response.blob();
    }
  }

  // Convenience methods
  async get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }

  async patch(endpoint, data) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data)
    });
  }

  async delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE"
    });
  }
}

// Usage
const api = new ModernApiClient({
  baseUrl: "/api",
  headers: {
    Authorization: "Bearer token123"
  },
  timeout: 5000,
  maxRetries: 3,
  requestsPerSecond: 5
});

// Examples
async function examples() {
  try {
    // GET request
    const users = await api.get("/users", { page: 1, limit: 10 });

    // POST request
    const newUser = await api.post("/users", {
      name: "John Doe",
      email: "john@example.com"
    });

    // PUT request
    const updatedUser = await api.put(`/users/${newUser.id}`, {
      name: "John Smith",
      email: "john.smith@example.com"
    });

    // DELETE request
    await api.delete(`/users/${newUser.id}`);
  } catch (error) {
    console.error("API operation failed:", error);
  }
}
```

## Best Practices

### 1. Always Handle Errors

```javascript
// Good: Proper error handling
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    // Return default or re-throw based on your needs
    return null;
  }
}
```

### 2. Use Appropriate HTTP Methods

```javascript
// Good: Use correct HTTP methods
await api.get("/users"); // Fetch data
await api.post("/users", userData); // Create new user
await api.put("/users/123", userData); // Replace user
await api.patch("/users/123", { email: "new@email.com" }); // Update part
await api.delete("/users/123"); // Delete user
```

### 3. Validate Responses

```javascript
function validateApiResponse(data, schema) {
  // Basic validation example
  if (!data || typeof data !== "object") {
    throw new Error("Invalid response: not an object");
  }

  for (const field of schema.required || []) {
    if (!(field in data)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return data;
}
```

### 4. Use Loading States

```javascript
class DataManager {
  constructor() {
    this.loading = false;
    this.error = null;
    this.data = null;
  }

  async fetchData(url) {
    this.loading = true;
    this.error = null;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      this.data = await response.json();
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }
}
```

## Summary

Working with APIs using the Fetch API and async/await provides:

- **Modern syntax** for HTTP requests
- **Promise-based** error handling
- **Flexible configuration** for different request types
- **Built-in support** for different response formats
- **Easy integration** with authentication systems

Key principles:

- Always handle errors appropriately
- Use correct HTTP methods for different operations
- Validate API responses
- Implement retry logic for reliability
- Add rate limiting to respect API limits
- Use proper authentication methods

## Next Steps

In the next lesson, we'll explore **Error Handling and Recovery Patterns** for building resilient applications that gracefully handle network failures and API errors.
