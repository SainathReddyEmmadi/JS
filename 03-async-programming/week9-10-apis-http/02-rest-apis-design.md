# REST APIs and Design Patterns

## Learning Objectives

- Master REST API design principles and conventions
- Understand resource modeling and URL structure
- Learn about API versioning and pagination strategies
- Implement authentication and authorization patterns
- Explore advanced API patterns and best practices

## REST API Fundamentals

REST (Representational State Transfer) is an architectural style for designing networked applications. It provides a set of constraints and principles for creating scalable web services.

### REST Principles

#### 1. Stateless Communication

Each request must contain all information needed to process it.

```javascript
// Bad: Relies on server-side session
fetch("/api/get-current-user-data"); // Assumes server knows who "current user" is

// Good: Explicitly identifies the user
fetch("/api/users/123", {
  headers: {
    Authorization: "Bearer " + userToken
  }
});
```

#### 2. Resource-Based Architecture

Everything is a resource with a unique identifier.

```javascript
// Resources and their URLs
const apiEndpoints = {
  // Users
  users: "/api/users",
  user: "/api/users/{id}",
  userProfile: "/api/users/{id}/profile",

  // Posts
  posts: "/api/posts",
  post: "/api/posts/{id}",
  postComments: "/api/posts/{id}/comments",

  // Comments
  comments: "/api/comments",
  comment: "/api/comments/{id}"
};
```

#### 3. HTTP Methods as Verbs

Use HTTP methods to indicate the action to perform.

```javascript
class UserAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // GET - Retrieve resources
  async getUsers(params = {}) {
    const query = new URLSearchParams(params);
    const response = await fetch(`${this.baseURL}/users?${query}`);
    return response.json();
  }

  async getUser(id) {
    const response = await fetch(`${this.baseURL}/users/${id}`);
    return response.json();
  }

  // POST - Create new resource
  async createUser(userData) {
    const response = await fetch(`${this.baseURL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  // PUT - Replace entire resource
  async updateUser(id, userData) {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    return response.json();
  }

  // PATCH - Partial update
  async updateUserPartial(id, changes) {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes)
    });
    return response.json();
  }

  // DELETE - Remove resource
  async deleteUser(id) {
    const response = await fetch(`${this.baseURL}/users/${id}`, {
      method: "DELETE"
    });
    return response.ok;
  }
}
```

## Resource Design Patterns

### Hierarchical Resources

```javascript
// Blog platform example
const blogAPI = {
  // Authors
  authors: "/api/authors",
  author: "/api/authors/{authorId}",

  // Author's posts
  authorPosts: "/api/authors/{authorId}/posts",
  authorPost: "/api/authors/{authorId}/posts/{postId}",

  // Post comments
  postComments: "/api/posts/{postId}/comments",
  postComment: "/api/posts/{postId}/comments/{commentId}",

  // Comment replies (nested comments)
  commentReplies: "/api/comments/{commentId}/replies"
};

// Usage examples
class BlogAPIClient {
  async getAuthorPosts(authorId, options = {}) {
    const params = new URLSearchParams(options);
    const response = await fetch(`/api/authors/${authorId}/posts?${params}`);
    return response.json();
  }

  async addCommentToPost(postId, commentData) {
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData)
    });
    return response.json();
  }
}
```

### Collection and Item Resources

```javascript
class ResourceManager {
  constructor(resourceName, baseURL) {
    this.resourceName = resourceName;
    this.baseURL = baseURL;
  }

  // Collection endpoints
  async getCollection(filters = {}, pagination = {}) {
    const params = new URLSearchParams({
      ...filters,
      ...pagination
    });

    const response = await fetch(
      `${this.baseURL}/${this.resourceName}?${params}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch ${this.resourceName}`);
    }

    return {
      data: await response.json(),
      pagination: this.extractPaginationInfo(response.headers)
    };
  }

  async createItem(itemData) {
    const response = await fetch(`${this.baseURL}/${this.resourceName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create ${this.resourceName} item`);
    }

    return response.json();
  }

  // Item endpoints
  async getItem(id) {
    const response = await fetch(`${this.baseURL}/${this.resourceName}/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`${this.resourceName} not found`);
      }
      throw new Error(`Failed to fetch ${this.resourceName}`);
    }

    return response.json();
  }

  async updateItem(id, itemData) {
    const response = await fetch(`${this.baseURL}/${this.resourceName}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData)
    });

    if (!response.ok) {
      throw new Error(`Failed to update ${this.resourceName}`);
    }

    return response.json();
  }

  async deleteItem(id) {
    const response = await fetch(`${this.baseURL}/${this.resourceName}/${id}`, {
      method: "DELETE"
    });

    return response.ok;
  }

  extractPaginationInfo(headers) {
    return {
      totalCount: parseInt(headers.get("X-Total-Count") || "0"),
      pageSize: parseInt(headers.get("X-Page-Size") || "10"),
      currentPage: parseInt(headers.get("X-Current-Page") || "1")
    };
  }
}

// Usage
const userManager = new ResourceManager("users", "https://api.example.com");
const postManager = new ResourceManager("posts", "https://api.example.com");
```

## API Versioning Strategies

### URL Path Versioning

```javascript
class VersionedAPIClient {
  constructor(baseURL, version = "v1") {
    this.baseURL = baseURL;
    this.version = version;
  }

  getEndpoint(resource) {
    return `${this.baseURL}/${this.version}/${resource}`;
  }

  async getUsers() {
    // GET /api/v1/users
    const response = await fetch(this.getEndpoint("users"));
    return response.json();
  }

  // Easy version switching
  async getUsersV2() {
    const v2Endpoint = `${this.baseURL}/v2/users`;
    const response = await fetch(v2Endpoint);
    return response.json();
  }
}
```

### Header-Based Versioning

```javascript
class HeaderVersionedAPI {
  constructor(baseURL, version = "1.0") {
    this.baseURL = baseURL;
    this.version = version;
  }

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        "API-Version": this.version,
        Accept: "application/json",
        ...options.headers
      }
    });

    return response.json();
  }

  async getUsers() {
    return this.request("/users");
  }
}
```

## Pagination Patterns

### Offset-Based Pagination

```javascript
class PaginatedAPI {
  async getUsers(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString()
    });

    const response = await fetch(`/api/users?${params}`);
    const data = await response.json();

    return {
      users: data.users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(data.totalCount / limit),
        totalItems: data.totalCount,
        hasNext: page * limit < data.totalCount,
        hasPrev: page > 1
      }
    };
  }

  async getAllUsers() {
    const allUsers = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const result = await this.getUsers(page, 100);
      allUsers.push(...result.users);
      hasMore = result.pagination.hasNext;
      page++;
    }

    return allUsers;
  }
}
```

### Cursor-Based Pagination

```javascript
class CursorPaginatedAPI {
  async getUsers(cursor = null, limit = 10) {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) {
      params.append("cursor", cursor);
    }

    const response = await fetch(`/api/users?${params}`);
    const data = await response.json();

    return {
      users: data.users,
      nextCursor: data.nextCursor,
      hasMore: !!data.nextCursor
    };
  }

  async *userIterator(limit = 10) {
    let cursor = null;

    do {
      const result = await this.getUsers(cursor, limit);

      for (const user of result.users) {
        yield user;
      }

      cursor = result.nextCursor;
    } while (cursor);
  }

  // Usage: for await (const user of api.userIterator()) { ... }
}
```

## Authentication Patterns

### JWT Token Authentication

```javascript
class AuthenticatedAPI {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem("authToken");
    this.refreshToken = localStorage.getItem("refreshToken");
  }

  async request(endpoint, options = {}) {
    let token = this.token;

    // Check if token needs refresh
    if (this.isTokenExpired(token)) {
      token = await this.refreshAccessToken();
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers
      }
    });

    if (response.status === 401) {
      // Token invalid, try to refresh
      token = await this.refreshAccessToken();

      // Retry request with new token
      return fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          ...options.headers
        }
      });
    }

    return response;
  }

  isTokenExpired(token) {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Date.now() / 1000;
      return payload.exp < now;
    } catch {
      return true;
    }
  }

  async refreshAccessToken() {
    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: this.refreshToken })
    });

    if (!response.ok) {
      // Refresh failed, redirect to login
      this.logout();
      throw new Error("Authentication failed");
    }

    const { accessToken, refreshToken } = await response.json();
    this.token = accessToken;
    this.refreshToken = refreshToken;

    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    return accessToken;
  }

  logout() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    // Redirect to login page
    window.location.href = "/login";
  }
}
```

### API Key Authentication

```javascript
class APIKeyClient {
  constructor(baseURL, apiKey) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  async request(endpoint, options = {}) {
    return fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        "X-API-Key": this.apiKey,
        "Content-Type": "application/json",
        ...options.headers
      }
    });
  }
}
```

## Error Handling Patterns

### Comprehensive Error Handler

```javascript
class APIError extends Error {
  constructor(message, status, code, details = null) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

class RobustAPIClient {
  async handleResponse(response) {
    const contentType = response.headers.get("content-type");
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      throw new APIError(
        data.message || `HTTP ${response.status}`,
        response.status,
        data.code || "UNKNOWN_ERROR",
        data.details
      );
    }

    return data;
  }

  async request(endpoint, options = {}) {
    try {
      const response = await fetch(endpoint, options);
      return await this.handleResponse(response);
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      // Network or other errors
      throw new APIError(
        "Network error or server unavailable",
        0,
        "NETWORK_ERROR",
        { originalError: error.message }
      );
    }
  }

  async requestWithRetry(endpoint, options = {}, maxRetries = 3) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.request(endpoint, options);
      } catch (error) {
        lastError = error;

        // Don't retry client errors (4xx)
        if (error.status >= 400 && error.status < 500) {
          throw error;
        }

        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError;
  }
}
```

## Advanced Patterns

### Batch Operations

```javascript
class BatchAPIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.batchQueue = [];
    this.batchDelay = 100; // ms
    this.maxBatchSize = 10;
  }

  async batchGet(ids) {
    const response = await fetch(`${this.baseURL}/users/batch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids })
    });

    return response.json();
  }

  async getUser(id) {
    return new Promise((resolve, reject) => {
      this.batchQueue.push({ id, resolve, reject });

      // Process batch after delay
      setTimeout(() => this.processBatch(), this.batchDelay);
    });
  }

  async processBatch() {
    if (this.batchQueue.length === 0) return;

    const batch = this.batchQueue.splice(0, this.maxBatchSize);
    const ids = batch.map((item) => item.id);

    try {
      const users = await this.batchGet(ids);
      const userMap = new Map(users.map((user) => [user.id, user]));

      batch.forEach(({ id, resolve }) => {
        resolve(userMap.get(id) || null);
      });
    } catch (error) {
      batch.forEach(({ reject }) => reject(error));
    }
  }
}
```

### GraphQL-style Field Selection

```javascript
class FieldSelectableAPI {
  async getUser(id, fields = []) {
    const params = new URLSearchParams();
    if (fields.length > 0) {
      params.append("fields", fields.join(","));
    }

    const response = await fetch(`/api/users/${id}?${params}`);
    return response.json();
  }

  async getUsers(options = {}) {
    const { fields = [], include = [], exclude = [] } = options;
    const params = new URLSearchParams();

    if (fields.length > 0) params.append("fields", fields.join(","));
    if (include.length > 0) params.append("include", include.join(","));
    if (exclude.length > 0) params.append("exclude", exclude.join(","));

    const response = await fetch(`/api/users?${params}`);
    return response.json();
  }
}

// Usage
const api = new FieldSelectableAPI();

// Get only specific fields
const basicUser = await api.getUser(123, ["id", "name", "email"]);

// Get users with related data
const usersWithPosts = await api.getUsers({
  include: ["posts", "profile"],
  exclude: ["passwordHash", "internalNotes"]
});
```

## Best Practices Summary

### 1. Consistent URL Structure

```javascript
// Good patterns
/api/v1/users              // Collection
/api/v1/users/123          // Specific resource
/api/v1/users/123/posts    // Nested resources
/api/v1/search/users       // Special operations

// Avoid
/api/v1/getUsers
/api/v1/user-posts-list
/api/v1/deleteUserById
```

### 2. Proper HTTP Method Usage

- **GET**: Retrieve data (safe, idempotent)
- **POST**: Create new resources
- **PUT**: Replace entire resource (idempotent)
- **PATCH**: Partial updates
- **DELETE**: Remove resources (idempotent)

### 3. Meaningful Status Codes

```javascript
const STATUS_CODES = {
  // Success
  OK: 200, // GET success
  CREATED: 201, // POST success
  NO_CONTENT: 204, // DELETE success

  // Client errors
  BAD_REQUEST: 400, // Invalid request
  UNAUTHORIZED: 401, // Authentication required
  FORBIDDEN: 403, // Access denied
  NOT_FOUND: 404, // Resource not found
  CONFLICT: 409, // Resource conflict

  // Server errors
  INTERNAL_ERROR: 500, // Server error
  SERVICE_UNAVAILABLE: 503 // Temporary unavailable
};
```

### 4. Comprehensive Documentation

```javascript
/**
 * User API Client
 *
 * @example
 * const userAPI = new UserAPI('https://api.example.com');
 *
 * // Get paginated users
 * const users = await userAPI.getUsers({ page: 1, limit: 10 });
 *
 * // Create new user
 * const newUser = await userAPI.createUser({
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * });
 */
```

## Self-Check Questions

1. What are the key principles of REST architecture?
2. How do you design URLs for nested resources?
3. What are the differences between PUT and PATCH methods?
4. How do you implement effective error handling in API clients?
5. What are the pros and cons of different pagination strategies?

## Practice Exercises

1. **REST API Client**: Build a complete REST API client with all CRUD operations
2. **Authentication Flow**: Implement JWT token refresh logic
3. **Batch Operations**: Create a system that automatically batches multiple requests
4. **Error Recovery**: Build resilient API calls with retry and fallback mechanisms
5. **API Documentation**: Document your API client with examples and error codes

## Next Steps

- Explore GraphQL as an alternative to REST
- Learn about API testing and mocking
- Study API security and rate limiting
- Practice with real-world API integrations
