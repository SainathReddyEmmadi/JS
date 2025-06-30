# HTTP Fundamentals and Web Communication

## Learning Objectives

- Understand HTTP protocol and its role in web communication
- Master HTTP methods, status codes, and headers
- Learn about request/response lifecycle
- Understand REST API principles and design patterns
- Work with different data formats (JSON, XML, FormData)

## What is HTTP?

HTTP (HyperText Transfer Protocol) is the foundation of data communication on the World Wide Web. It's a request-response protocol between clients and servers.

### Key Characteristics

- **Stateless**: Each request is independent
- **Text-based**: Human-readable protocol
- **Client-Server**: Clear separation of concerns
- **Cacheable**: Responses can be cached for performance

## HTTP Request Structure

```
GET /api/users/123 HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
User-Agent: Mozilla/5.0...

{
  "include": ["profile", "preferences"]
}
```

### Components:

1. **Method**: GET, POST, PUT, DELETE, etc.
2. **URL**: Resource identifier
3. **Headers**: Metadata about the request
4. **Body**: Data payload (optional)

## HTTP Methods

### GET - Retrieve Data

```javascript
// Fetch user data
fetch("/api/users/123")
  .then((response) => response.json())
  .then((user) => console.log(user));
```

### POST - Create New Resource

```javascript
// Create new user
fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com"
  })
});
```

### PUT - Update Entire Resource

```javascript
// Update user completely
fetch("/api/users/123", {
  method: "PUT",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    id: 123,
    name: "John Smith",
    email: "johnsmith@example.com",
    active: true
  })
});
```

### PATCH - Partial Update

```javascript
// Update only user's email
fetch("/api/users/123", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: "newemail@example.com"
  })
});
```

### DELETE - Remove Resource

```javascript
// Delete user
fetch("/api/users/123", {
  method: "DELETE"
});
```

## HTTP Status Codes

### Success (2xx)

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **204 No Content**: Success with no response body

### Client Errors (4xx)

- **400 Bad Request**: Invalid request syntax
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource doesn't exist
- **429 Too Many Requests**: Rate limit exceeded

### Server Errors (5xx)

- **500 Internal Server Error**: Generic server error
- **502 Bad Gateway**: Invalid response from upstream server
- **503 Service Unavailable**: Server temporarily unavailable

### Handling Status Codes

```javascript
async function handleResponse(response) {
  if (response.ok) {
    return await response.json();
  }

  switch (response.status) {
    case 400:
      throw new Error("Bad request - check your data");
    case 401:
      throw new Error("Authentication required");
    case 403:
      throw new Error("Access forbidden");
    case 404:
      throw new Error("Resource not found");
    case 429:
      throw new Error("Too many requests - please wait");
    case 500:
      throw new Error("Server error - please try again later");
    default:
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
}
```

## HTTP Headers

### Common Request Headers

```javascript
const headers = {
  // Content type
  "Content-Type": "application/json",

  // Authentication
  Authorization: "Bearer " + token,

  // Accept formats
  Accept: "application/json, text/plain, */*",

  // Custom headers
  "X-API-Key": "your-api-key",
  "X-Client-Version": "1.0.0"
};
```

### Common Response Headers

```javascript
// Reading response headers
fetch("/api/data").then((response) => {
  console.log(response.headers.get("Content-Type"));
  console.log(response.headers.get("X-RateLimit-Remaining"));
  return response.json();
});
```

## Data Formats

### JSON (JavaScript Object Notation)

```javascript
// Sending JSON
const userData = {
  name: "Alice",
  age: 30,
  preferences: {
    theme: "dark",
    notifications: true
  }
};

fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(userData)
});

// Receiving JSON
const response = await fetch("/api/users/123");
const user = await response.json();
```

### FormData for File Uploads

```javascript
const formData = new FormData();
formData.append("file", fileInput.files[0]);
formData.append("description", "Profile picture");

fetch("/api/upload", {
  method: "POST",
  body: formData // Don't set Content-Type header - browser will set it
});
```

### URL Encoded Data

```javascript
const params = new URLSearchParams();
params.append("username", "alice");
params.append("password", "secret123");

fetch("/api/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  body: params
});
```

## CORS (Cross-Origin Resource Sharing)

### Understanding CORS

CORS allows servers to specify which origins can access their resources.

```javascript
// This might fail due to CORS
fetch("https://api.external-service.com/data")
  .then((response) => response.json())
  .catch((error) => {
    if (error.message.includes("CORS")) {
      console.log("CORS error - server must allow this origin");
    }
  });
```

### Handling CORS in Development

```javascript
// Using a proxy server or CORS-enabled endpoint
const proxyUrl = "https://api.allorigins.win/raw?url=";
const targetUrl = "https://api.external-service.com/data";

fetch(proxyUrl + encodeURIComponent(targetUrl)).then((response) =>
  response.json()
);
```

## REST API Principles

### Resource-Based URLs

```javascript
// Good RESTful URLs
GET / api / users; // Get all users
GET / api / users / 123; // Get specific user
POST / api / users; // Create new user
PUT / api / users / 123; // Update user
DELETE / api / users / 123; // Delete user

// Nested resources
GET / api / users / 123 / posts; // Get user's posts
POST / api / users / 123 / posts; // Create post for user
```

### Consistent Response Structure

```javascript
// Success response
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "name": "John Doe"
    }
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00Z"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": {
      "field": "email",
      "constraint": "required"
    }
  }
}
```

## Practical Examples

### Building a Generic API Client

```javascript
class APIClient {
  constructor(baseURL, defaultHeaders = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...this.defaultHeaders,
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      throw new Error(`Network error: ${error.message}`);
    }
  }

  async handleResponse(response) {
    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${data.message || response.statusText}`
      );
    }

    return data;
  }

  // Convenience methods
  get(endpoint, params = {}) {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${endpoint}?${query}` : endpoint;
    return this.request(url);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data)
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE"
    });
  }
}

// Usage
const api = new APIClient("https://api.example.com", {
  Authorization: "Bearer " + localStorage.getItem("token")
});

// Get users with pagination
const users = await api.get("/users", { page: 1, limit: 10 });

// Create new user
const newUser = await api.post("/users", {
  name: "Jane Doe",
  email: "jane@example.com"
});
```

### Handling Rate Limiting

```javascript
class RateLimitedAPIClient extends APIClient {
  constructor(baseURL, defaultHeaders = {}, rateLimitDelay = 1000) {
    super(baseURL, defaultHeaders);
    this.rateLimitDelay = rateLimitDelay;
    this.requestQueue = [];
    this.isProcessing = false;
  }

  async request(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ endpoint, options, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.requestQueue.length > 0) {
      const { endpoint, options, resolve, reject } = this.requestQueue.shift();

      try {
        const result = await super.request(endpoint, options);
        resolve(result);
      } catch (error) {
        if (error.message.includes("429")) {
          // Rate limited - put request back in queue
          this.requestQueue.unshift({ endpoint, options, resolve, reject });
          await this.delay(this.rateLimitDelay * 2);
        } else {
          reject(error);
        }
      }

      await this.delay(this.rateLimitDelay);
    }

    this.isProcessing = false;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

## Best Practices

### 1. Always Handle Errors

```javascript
try {
  const response = await fetch("/api/data");

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
} catch (error) {
  console.error("API request failed:", error);
  // Handle error appropriately
  throw error;
}
```

### 2. Use Appropriate HTTP Methods

```javascript
// Don't do this
fetch("/api/deleteUser?id=123"); // Wrong method

// Do this
fetch("/api/users/123", { method: "DELETE" }); // Correct
```

### 3. Include Proper Headers

```javascript
const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: "Bearer " + token
};
```

### 4. Validate Data Before Sending

```javascript
function validateUserData(userData) {
  const errors = [];

  if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
    errors.push("Valid email is required");
  }

  if (!userData.name || userData.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  return errors;
}

// Before making API call
const errors = validateUserData(userData);
if (errors.length > 0) {
  throw new Error("Validation failed: " + errors.join(", "));
}
```

## Self-Check Questions

1. What are the main differences between GET, POST, PUT, and PATCH methods?
2. How do you handle different HTTP status codes in your application?
3. What is CORS and how does it affect API requests?
4. How would you implement retry logic for failed API requests?
5. What are the benefits of using a consistent API client class?

## Practice Exercises

1. **Status Code Handler**: Create a function that handles all common HTTP status codes
2. **API Client**: Build a reusable API client with error handling and retry logic
3. **Data Validator**: Implement client-side validation before API calls
4. **File Upload**: Create a file upload system with progress tracking
5. **Rate Limiting**: Implement a rate-limited API client

## Next Steps

- Learn about GraphQL and other API architectures
- Explore WebSocket connections for real-time communication
- Study API security and authentication methods
- Practice with different API testing tools
