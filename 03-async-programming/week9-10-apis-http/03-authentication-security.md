# Authentication and Security in APIs

## Learning Objectives

- Understand different authentication mechanisms (JWT, OAuth, API Keys)
- Implement secure API communication practices
- Learn about authorization patterns and security best practices
- Handle sensitive data and implement proper token management
- Understand HTTPS, CORS, and other security considerations

## Authentication vs Authorization

### Authentication

**Who are you?** - Verifying identity

### Authorization

**What can you do?** - Determining permissions

```javascript
// Authentication: User proves they are "john@example.com"
const loginResponse = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "john@example.com",
    password: "securePassword123"
  })
});

const { token, user } = await loginResponse.json();

// Authorization: Using token to access protected resources
const userDataResponse = await fetch("/api/user/profile", {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

## JWT (JSON Web Tokens)

### Understanding JWT Structure

```javascript
// JWT consists of three parts: header.payload.signature
const jwtToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

// Decode JWT (client-side inspection only - never trust without verification)
function decodeJWT(token) {
  try {
    const [header, payload, signature] = token.split(".");

    const decodedHeader = JSON.parse(atob(header));
    const decodedPayload = JSON.parse(atob(payload));

    return {
      header: decodedHeader,
      payload: decodedPayload,
      signature
    };
  } catch (error) {
    throw new Error("Invalid JWT token");
  }
}

const decoded = decodeJWT(jwtToken);
console.log(decoded.payload); // { sub: "1234567890", name: "John Doe", iat: 1516239022 }
```

### JWT Authentication Implementation

```javascript
class JWTAuthManager {
  constructor() {
    this.tokenKey = "authToken";
    this.refreshTokenKey = "refreshToken";
    this.baseURL = "https://api.example.com";
  }

  // Login and store tokens
  async login(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const { accessToken, refreshToken, user } = await response.json();

    // Store tokens securely
    this.setTokens(accessToken, refreshToken);

    return { user, accessToken };
  }

  // Store tokens (consider using secure storage in production)
  setTokens(accessToken, refreshToken) {
    localStorage.setItem(this.tokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  // Get current access token
  getAccessToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Get refresh token
  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // Check if token is expired
  isTokenExpired(token = null) {
    const tokenToCheck = token || this.getAccessToken();

    if (!tokenToCheck) return true;

    try {
      const { payload } = this.decodeJWT(tokenToCheck);
      const currentTime = Date.now() / 1000;

      // Check if token expires within next 5 minutes (300 seconds)
      return payload.exp < currentTime + 300;
    } catch {
      return true;
    }
  }

  // Refresh access token
  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) {
      this.logout(); // Clear invalid tokens
      throw new Error("Token refresh failed");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await response.json();
    this.setTokens(accessToken, newRefreshToken);

    return accessToken;
  }

  // Logout and clear tokens
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);

    // Optional: Call logout endpoint
    fetch(`${this.baseURL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.getAccessToken()}`
      }
    }).catch(() => {}); // Ignore errors during logout
  }

  // Decode JWT (for client-side use only)
  decodeJWT(token) {
    const [header, payload, signature] = token.split(".");
    return {
      header: JSON.parse(atob(header)),
      payload: JSON.parse(atob(payload)),
      signature
    };
  }

  // Get user info from token
  getCurrentUser() {
    const token = this.getAccessToken();

    if (!token || this.isTokenExpired(token)) {
      return null;
    }

    try {
      const { payload } = this.decodeJWT(token);
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        roles: payload.roles || []
      };
    } catch {
      return null;
    }
  }
}
```

### Authenticated API Client

```javascript
class AuthenticatedAPIClient {
  constructor(baseURL, authManager) {
    this.baseURL = baseURL;
    this.authManager = authManager;
  }

  async request(endpoint, options = {}) {
    let token = this.authManager.getAccessToken();

    // Refresh token if expired
    if (this.authManager.isTokenExpired(token)) {
      try {
        token = await this.authManager.refreshAccessToken();
      } catch (error) {
        // Refresh failed, redirect to login
        this.authManager.logout();
        window.location.href = "/login";
        throw new Error("Authentication required");
      }
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers
      }
    });

    // Handle auth errors
    if (response.status === 401) {
      try {
        token = await this.authManager.refreshAccessToken();

        // Retry request with new token
        return fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...options.headers
          }
        });
      } catch {
        this.authManager.logout();
        window.location.href = "/login";
        throw new Error("Authentication required");
      }
    }

    return response;
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

  async delete(endpoint) {
    return this.request(endpoint, {
      method: "DELETE"
    });
  }
}

// Usage
const authManager = new JWTAuthManager();
const apiClient = new AuthenticatedAPIClient(
  "https://api.example.com",
  authManager
);

// Login
await authManager.login({
  email: "user@example.com",
  password: "password123"
});

// Make authenticated requests
const userProfile = await apiClient.get("/user/profile");
const updateResult = await apiClient.put("/user/profile", {
  name: "Updated Name"
});
```

## OAuth 2.0 Implementation

### Authorization Code Flow

```javascript
class OAuth2Client {
  constructor(clientId, redirectUri, authServer) {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.authServer = authServer;
    this.tokenKey = "oauth_token";
  }

  // Step 1: Redirect to authorization server
  initiateOAuth() {
    const state = this.generateRandomState();
    localStorage.setItem("oauth_state", state);

    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: "read write",
      state: state
    });

    const authUrl = `${this.authServer}/oauth/authorize?${params}`;
    window.location.href = authUrl;
  }

  // Step 2: Handle authorization code callback
  async handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    const error = urlParams.get("error");

    if (error) {
      throw new Error(`OAuth error: ${error}`);
    }

    // Verify state parameter
    const storedState = localStorage.getItem("oauth_state");
    if (state !== storedState) {
      throw new Error("Invalid state parameter");
    }

    if (!code) {
      throw new Error("No authorization code received");
    }

    // Exchange code for token
    return this.exchangeCodeForToken(code);
  }

  // Step 3: Exchange authorization code for access token
  async exchangeCodeForToken(code) {
    const response = await fetch(`${this.authServer}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: this.clientId,
        code: code,
        redirect_uri: this.redirectUri
      })
    });

    if (!response.ok) {
      throw new Error("Token exchange failed");
    }

    const tokenData = await response.json();
    this.storeToken(tokenData);

    return tokenData;
  }

  // Store OAuth token
  storeToken(tokenData) {
    const tokenInfo = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenType: tokenData.token_type,
      expiresAt: Date.now() + tokenData.expires_in * 1000
    };

    localStorage.setItem(this.tokenKey, JSON.stringify(tokenInfo));
  }

  // Get current token
  getToken() {
    const tokenStr = localStorage.getItem(this.tokenKey);

    if (!tokenStr) return null;

    try {
      return JSON.parse(tokenStr);
    } catch {
      return null;
    }
  }

  // Check if token is valid
  isTokenValid() {
    const token = this.getToken();

    if (!token) return false;

    return Date.now() < token.expiresAt;
  }

  // Refresh OAuth token
  async refreshToken() {
    const token = this.getToken();

    if (!token || !token.refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${this.authServer}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
        client_id: this.clientId
      })
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const newTokenData = await response.json();
    this.storeToken(newTokenData);

    return newTokenData;
  }

  generateRandomState() {
    const array = new Uint32Array(8);
    crypto.getRandomValues(array);
    return Array.from(array, (dec) => ("0" + dec.toString(16)).substr(-2)).join(
      ""
    );
  }
}

// Usage
const oauthClient = new OAuth2Client(
  "your-client-id",
  "https://yourapp.com/oauth/callback",
  "https://auth.provider.com"
);

// On login button click
document.getElementById("loginBtn").addEventListener("click", () => {
  oauthClient.initiateOAuth();
});

// On callback page
if (window.location.pathname === "/oauth/callback") {
  oauthClient
    .handleCallback()
    .then((tokenData) => {
      console.log("OAuth login successful");
      window.location.href = "/dashboard";
    })
    .catch((error) => {
      console.error("OAuth login failed:", error);
      window.location.href = "/login?error=oauth_failed";
    });
}
```

## API Key Authentication

### Simple API Key Implementation

```javascript
class APIKeyClient {
  constructor(baseURL, apiKey, keyLocation = "header") {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
    this.keyLocation = keyLocation; // 'header', 'query', or 'body'
  }

  async request(endpoint, options = {}) {
    let url = `${this.baseURL}${endpoint}`;
    let requestOptions = { ...options };

    switch (this.keyLocation) {
      case "header":
        requestOptions.headers = {
          "X-API-Key": this.apiKey,
          ...options.headers
        };
        break;

      case "query":
        const separator = endpoint.includes("?") ? "&" : "?";
        url += `${separator}api_key=${this.apiKey}`;
        break;

      case "body":
        if (requestOptions.body) {
          const bodyData = JSON.parse(requestOptions.body);
          bodyData.api_key = this.apiKey;
          requestOptions.body = JSON.stringify(bodyData);
        }
        break;
    }

    return fetch(url, requestOptions);
  }
}

// Different API key patterns
const headerKeyClient = new APIKeyClient(
  "https://api.service1.com",
  "key123",
  "header"
);
const queryKeyClient = new APIKeyClient(
  "https://api.service2.com",
  "key456",
  "query"
);
```

### Rotating API Keys

```javascript
class RotatingAPIKeyManager {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.keys = [];
    this.currentKeyIndex = 0;
    this.keyUsageCount = new Map();
    this.maxUsagePerKey = 1000; // Rotate after 1000 uses
  }

  addAPIKey(key, priority = 1) {
    this.keys.push({ key, priority, active: true });
    this.keyUsageCount.set(key, 0);

    // Sort by priority
    this.keys.sort((a, b) => b.priority - a.priority);
  }

  getCurrentKey() {
    const activeKeys = this.keys.filter((k) => k.active);

    if (activeKeys.length === 0) {
      throw new Error("No active API keys available");
    }

    const currentKey = activeKeys[this.currentKeyIndex % activeKeys.length];
    const usage = this.keyUsageCount.get(currentKey.key);

    // Rotate if current key has reached usage limit
    if (usage >= this.maxUsagePerKey) {
      this.currentKeyIndex = (this.currentKeyIndex + 1) % activeKeys.length;
      return this.getCurrentKey();
    }

    return currentKey.key;
  }

  recordKeyUsage(key) {
    const currentUsage = this.keyUsageCount.get(key) || 0;
    this.keyUsageCount.set(key, currentUsage + 1);
  }

  deactivateKey(key) {
    const keyObj = this.keys.find((k) => k.key === key);
    if (keyObj) {
      keyObj.active = false;
    }
  }

  async request(endpoint, options = {}) {
    const maxRetries = this.keys.filter((k) => k.active).length;
    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const apiKey = this.getCurrentKey();

      try {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
          ...options,
          headers: {
            "X-API-Key": apiKey,
            ...options.headers
          }
        });

        if (response.status === 429) {
          // Rate limited - try next key
          this.currentKeyIndex++;
          continue;
        }

        if (response.status === 401 || response.status === 403) {
          // Key invalid - deactivate and try next
          this.deactivateKey(apiKey);
          continue;
        }

        // Success - record usage
        this.recordKeyUsage(apiKey);
        return response;
      } catch (error) {
        lastError = error;
        this.currentKeyIndex++;
      }
    }

    throw lastError || new Error("All API keys failed");
  }
}
```

## Security Best Practices

### Secure Token Storage

```javascript
class SecureTokenStorage {
  constructor() {
    this.storageKey = "app_tokens";
    this.encryptionKey = null;
  }

  async initializeEncryption() {
    // Generate or retrieve encryption key
    const keyData = localStorage.getItem("enc_key");

    if (keyData) {
      this.encryptionKey = await crypto.subtle.importKey(
        "raw",
        new Uint8Array(JSON.parse(keyData)),
        { name: "AES-GCM" },
        false,
        ["encrypt", "decrypt"]
      );
    } else {
      this.encryptionKey = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      const exportedKey = await crypto.subtle.exportKey(
        "raw",
        this.encryptionKey
      );
      localStorage.setItem(
        "enc_key",
        JSON.stringify(Array.from(new Uint8Array(exportedKey)))
      );
    }
  }

  async encryptData(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(JSON.stringify(data));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      this.encryptionKey,
      dataBuffer
    );

    return {
      data: Array.from(new Uint8Array(encryptedData)),
      iv: Array.from(iv)
    };
  }

  async decryptData(encryptedData) {
    const dataBuffer = new Uint8Array(encryptedData.data);
    const iv = new Uint8Array(encryptedData.iv);

    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      this.encryptionKey,
      dataBuffer
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedData));
  }

  async storeTokens(tokens) {
    if (!this.encryptionKey) {
      await this.initializeEncryption();
    }

    const encryptedTokens = await this.encryptData(tokens);
    sessionStorage.setItem(this.storageKey, JSON.stringify(encryptedTokens));
  }

  async getTokens() {
    if (!this.encryptionKey) {
      await this.initializeEncryption();
    }

    const encryptedData = sessionStorage.getItem(this.storageKey);

    if (!encryptedData) return null;

    try {
      const parsedData = JSON.parse(encryptedData);
      return await this.decryptData(parsedData);
    } catch {
      return null;
    }
  }

  clearTokens() {
    sessionStorage.removeItem(this.storageKey);
  }
}
```

### HTTPS and Request Security

```javascript
class SecurityEnhancedAPIClient {
  constructor(baseURL) {
    // Ensure HTTPS
    if (!baseURL.startsWith("https://")) {
      throw new Error("API base URL must use HTTPS");
    }

    this.baseURL = baseURL;
    this.tokenStorage = new SecureTokenStorage();
  }

  async request(endpoint, options = {}) {
    // Add security headers
    const secureOptions = {
      ...options,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        ...options.headers
      }
    };

    // Add CSRF token if available
    const csrfToken = this.getCSRFToken();
    if (csrfToken) {
      secureOptions.headers["X-CSRF-Token"] = csrfToken;
    }

    // Add authentication token
    const tokens = await this.tokenStorage.getTokens();
    if (tokens && tokens.accessToken) {
      secureOptions.headers["Authorization"] = `Bearer ${tokens.accessToken}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, secureOptions);

    // Check for security headers in response
    this.validateSecurityHeaders(response);

    return response;
  }

  getCSRFToken() {
    // Get CSRF token from meta tag or cookie
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    return metaTag ? metaTag.getAttribute("content") : null;
  }

  validateSecurityHeaders(response) {
    const requiredHeaders = [
      "strict-transport-security",
      "content-security-policy",
      "x-frame-options"
    ];

    const warnings = [];

    requiredHeaders.forEach((header) => {
      if (!response.headers.get(header)) {
        warnings.push(`Missing security header: ${header}`);
      }
    });

    if (warnings.length > 0) {
      console.warn("Security warnings:", warnings);
    }
  }

  // Input sanitization
  sanitizeInput(input) {
    if (typeof input !== "string") return input;

    return input
      .replace(/[<>]/g, "") // Remove potential HTML tags
      .trim()
      .substring(0, 1000); // Limit length
  }

  // Prepare data with sanitization
  prepareRequestData(data) {
    if (typeof data !== "object" || data === null) {
      return data;
    }

    const sanitized = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") {
        sanitized[key] = this.sanitizeInput(value);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map((item) =>
          typeof item === "string" ? this.sanitizeInput(item) : item
        );
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}
```

### Rate Limiting and Security

```javascript
class RateLimitedSecureClient {
  constructor(baseURL, rateLimit = { requests: 100, window: 60000 }) {
    this.baseURL = baseURL;
    this.rateLimit = rateLimit;
    this.requestLog = [];
    this.blockedUntil = null;
  }

  checkRateLimit() {
    const now = Date.now();

    // Remove old requests outside the window
    this.requestLog = this.requestLog.filter(
      (timestamp) => now - timestamp < this.rateLimit.window
    );

    // Check if blocked
    if (this.blockedUntil && now < this.blockedUntil) {
      throw new Error(
        `Rate limited. Try again after ${new Date(this.blockedUntil)}`
      );
    }

    // Check rate limit
    if (this.requestLog.length >= this.rateLimit.requests) {
      this.blockedUntil = now + this.rateLimit.window;
      throw new Error("Rate limit exceeded");
    }

    // Log this request
    this.requestLog.push(now);
  }

  async request(endpoint, options = {}) {
    this.checkRateLimit();

    // Add request fingerprint
    const fingerprint = await this.generateRequestFingerprint(options);

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        "X-Request-ID": fingerprint,
        ...options.headers
      }
    });

    // Handle rate limit responses
    if (response.status === 429) {
      const retryAfter = response.headers.get("Retry-After");
      if (retryAfter) {
        this.blockedUntil = Date.now() + parseInt(retryAfter) * 1000;
      }
    }

    return response;
  }

  async generateRequestFingerprint(options) {
    const data = JSON.stringify({
      method: options.method || "GET",
      headers: options.headers || {},
      body: options.body || "",
      timestamp: Date.now()
    });

    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}
```

## Self-Check Questions

1. What are the differences between authentication and authorization?
2. How do JWT tokens work and what are their security considerations?
3. What is OAuth 2.0 and when would you use it over other auth methods?
4. How do you securely store authentication tokens in the browser?
5. What security headers should you validate in API responses?

## Practice Exercises

1. **JWT Implementation**: Build a complete JWT authentication system with refresh tokens
2. **OAuth Client**: Implement OAuth 2.0 authorization code flow
3. **Secure Storage**: Create encrypted token storage for sensitive data
4. **Rate Limiting**: Build a client-side rate limiting system
5. **Security Audit**: Audit an existing API client for security vulnerabilities

## Next Steps

- Learn about advanced OAuth flows (PKCE, device flow)
- Study API security testing and penetration testing
- Explore multi-factor authentication implementations
- Practice with real-world authentication providers (Auth0, Firebase Auth)
