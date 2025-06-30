# API Integration Resources

## Popular APIs for Practice

### Free APIs (No Authentication Required)

#### JSONPlaceholder

- **URL**: https://jsonplaceholder.typicode.com/
- **Purpose**: Fake REST API for testing and prototyping
- **Endpoints**: Posts, comments, albums, photos, todos, users
- **Features**: Supports all HTTP methods, CORS enabled

```javascript
// Example usage
const response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
const post = await response.json();
```

#### Dog API

- **URL**: https://dog.ceo/dog-api/
- **Purpose**: Random dog images and breed information
- **Features**: Random images, breed lists, sub-breed support

```javascript
const response = await fetch("https://dog.ceo/api/breeds/image/random");
const dogData = await response.json();
```

#### Cat Facts API

- **URL**: https://catfact.ninja/
- **Purpose**: Random cat facts
- **Features**: Pagination support, fact length filtering

#### Quote APIs

- **Quotable**: https://quotable.io/
- **Quotegarden**: https://quotegarden.herokuapp.com/
- **Features**: Random quotes, author filtering, category support

### APIs Requiring Registration (Free Tier Available)

#### OpenWeather API

- **URL**: https://openweathermap.org/api
- **Purpose**: Weather data, forecasts, maps
- **Free Tier**: 1,000 calls/day, current weather, 5-day forecast
- **Features**: Multiple data formats, geocoding, weather maps

```javascript
const apiKey = "your-api-key";
const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${apiKey}`
);
```

#### GitHub API

- **URL**: https://docs.github.com/en/rest
- **Purpose**: Repository data, user information, issues
- **Free Tier**: 60 requests/hour (unauthenticated), 5,000/hour (authenticated)
- **Features**: Repository search, user profiles, issue tracking

```javascript
const response = await fetch("https://api.github.com/users/octocat");
const userData = await response.json();
```

#### NewsAPI

- **URL**: https://newsapi.org/
- **Purpose**: News articles from various sources
- **Free Tier**: 1,000 requests/day, developer plan only
- **Features**: Source filtering, keyword search, date range

#### REST Countries

- **URL**: https://restcountries.com/
- **Purpose**: Country information and data
- **Features**: Search by name, capital, region, language
- **No API key required**

```javascript
const response = await fetch("https://restcountries.com/v3.1/name/france");
const countries = await response.json();
```

### Testing and Mock APIs

#### Mockapi.io

- **URL**: https://mockapi.io/
- **Purpose**: Create custom fake APIs
- **Features**: Custom endpoints, data relationships, authentication simulation

#### Reqres

- **URL**: https://reqres.in/
- **Purpose**: Test API with realistic response times
- **Features**: User management simulation, delayed responses, error scenarios

#### httpbin

- **URL**: https://httpbin.org/
- **Purpose**: HTTP testing service
- **Features**: Request inspection, response formatting, authentication testing

## Authentication Examples

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

// Usage
const client = new APIKeyClient("https://api.example.com", "your-api-key");
const response = await client.request("/users");
```

### Bearer Token Authentication

```javascript
class BearerTokenClient {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    return fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
        ...options.headers
      }
    });
  }
}
```

### Basic Authentication

```javascript
class BasicAuthClient {
  constructor(baseURL, username, password) {
    this.baseURL = baseURL;
    this.credentials = btoa(`${username}:${password}`);
  }

  async request(endpoint, options = {}) {
    return fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Basic ${this.credentials}`,
        "Content-Type": "application/json",
        ...options.headers
      }
    });
  }
}
```

## Common HTTP Patterns

### Pagination Handling

```javascript
class PaginatedAPIClient {
  async getAllPages(endpoint, options = {}) {
    const allData = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetch(
        `${endpoint}?page=${page}&limit=10`,
        options
      );
      const data = await response.json();

      allData.push(...data.items);
      hasMore = data.hasMore || data.items.length === 10;
      page++;
    }

    return allData;
  }
}
```

### Rate Limiting with Retry

```javascript
class RateLimitedClient {
  async requestWithRetry(url, options = {}, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);

        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After") || 1;
          await this.delay(retryAfter * 1000);
          continue;
        }

        return response;
      } catch (error) {
        if (attempt === maxRetries) throw error;
        await this.delay(1000 * attempt); // Exponential backoff
      }
    }
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

### Error Handling Wrapper

```javascript
class ErrorHandlingClient {
  async safeRequest(url, options = {}) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new APIError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          await response.text()
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }

      // Network or other errors
      throw new APIError("Network error", 0, error.message);
    }
  }
}

class APIError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.details = details;
  }
}
```

## Development Tools

### Browser Extensions

- **JSON Viewer**: Pretty-print JSON responses
- **REST Client**: Test APIs directly in VS Code
- **Postman**: Comprehensive API testing tool
- **Insomnia**: Alternative API testing client

### Online Tools

- **Hoppscotch**: Online API testing (https://hoppscotch.io/)
- **httpie**: Command-line HTTP client
- **curl**: Universal command-line tool
- **Postman Echo**: API testing service

### Code Tools

```javascript
// Utility for logging requests/responses
class LoggingAPIClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(endpoint, options = {}) {
    const startTime = Date.now();

    console.group(`🌐 API Request: ${options.method || "GET"} ${endpoint}`);
    console.log("URL:", `${this.baseURL}${endpoint}`);
    console.log("Options:", options);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, options);
      const duration = Date.now() - startTime;

      console.log(
        `✅ Response (${duration}ms):`,
        response.status,
        response.statusText
      );
      console.groupEnd();

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;

      console.log(`❌ Error (${duration}ms):`, error.message);
      console.groupEnd();

      throw error;
    }
  }
}
```

## Testing Patterns

### Mock API Response

```javascript
class MockAPIClient {
  constructor(mockData = {}) {
    this.mockData = mockData;
  }

  async request(endpoint, options = {}) {
    const method = options.method || "GET";
    const key = `${method} ${endpoint}`;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (this.mockData[key]) {
      return {
        ok: true,
        status: 200,
        json: async () => this.mockData[key]
      };
    }

    return {
      ok: false,
      status: 404,
      json: async () => ({ error: "Not found" })
    };
  }
}

// Usage in tests
const mockClient = new MockAPIClient({
  "GET /users": [{ id: 1, name: "John" }],
  "POST /users": { id: 2, name: "Jane" }
});
```

### API Testing Helper

```javascript
class APITestHelper {
  static async testEndpoint(client, endpoint, expectedStatus = 200) {
    try {
      const response = await client.request(endpoint);

      if (response.status !== expectedStatus) {
        throw new Error(`Expected ${expectedStatus}, got ${response.status}`);
      }

      console.log(`✅ ${endpoint} - Status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`❌ ${endpoint} - Error:`, error.message);
      throw error;
    }
  }

  static async testWorkflow(tests) {
    const results = [];

    for (const test of tests) {
      try {
        const result = await this.testEndpoint(
          test.client,
          test.endpoint,
          test.expectedStatus
        );
        results.push({ test: test.name, success: true, result });
      } catch (error) {
        results.push({ test: test.name, success: false, error: error.message });
      }
    }

    return results;
  }
}
```

## Performance Optimization

### Request Deduplication

```javascript
class DeduplicatedClient {
  constructor() {
    this.pendingRequests = new Map();
  }

  async request(url, options = {}) {
    const key = `${options.method || "GET"}:${url}:${JSON.stringify(
      options.body || {}
    )}`;

    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    const promise = fetch(url, options);
    this.pendingRequests.set(key, promise);

    try {
      const response = await promise;
      return response;
    } finally {
      this.pendingRequests.delete(key);
    }
  }
}
```

### Cached API Client

```javascript
class CachedAPIClient {
  constructor(cacheDuration = 5 * 60 * 1000) {
    // 5 minutes
    this.cache = new Map();
    this.cacheDuration = cacheDuration;
  }

  async get(url) {
    const cached = this.cache.get(url);

    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.response.clone();
    }

    const response = await fetch(url);

    if (response.ok) {
      this.cache.set(url, {
        response: response.clone(),
        timestamp: Date.now()
      });
    }

    return response;
  }
}
```

## Security Considerations

### Input Sanitization

```javascript
function sanitizeInput(input) {
  if (typeof input !== "string") return input;

  return input
    .replace(/[<>]/g, "") // Remove HTML tags
    .trim()
    .substring(0, 1000); // Limit length
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### Secure Token Storage

```javascript
class SecureTokenStorage {
  static setToken(key, token) {
    // Use sessionStorage for temporary storage
    sessionStorage.setItem(key, token);
  }

  static getToken(key) {
    return sessionStorage.getItem(key);
  }

  static removeToken(key) {
    sessionStorage.removeItem(key);
  }

  static clearAllTokens() {
    sessionStorage.clear();
  }
}
```

Remember to:

- Never expose API keys in client-side code for production
- Use HTTPS for all API communications
- Validate and sanitize all user inputs
- Implement proper error handling
- Consider rate limiting and abuse prevention
- Keep authentication tokens secure
- Log security events for monitoring
