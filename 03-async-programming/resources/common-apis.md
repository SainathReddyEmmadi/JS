# Common APIs for Async Practice 🌐

## Overview

This resource provides a curated list of public APIs perfect for practicing asynchronous JavaScript patterns. All APIs are free to use and don't require authentication (unless noted), making them ideal for learning and experimentation.

## 1. Simple Data APIs (No Auth Required)

### JSONPlaceholder - Fake REST API

**Base URL**: `https://jsonplaceholder.typicode.com`

**Endpoints**:

```javascript
// Posts
GET / posts; // Get all posts
GET / posts / { id }; // Get specific post
POST / posts; // Create new post
PUT / posts / { id }; // Update post
DELETE / posts / { id }; // Delete post

// Users
GET / users; // Get all users
GET / users / { id }; // Get specific user
GET / users / { id } / posts; // Get user's posts

// Comments
GET / comments; // Get all comments
GET / posts / { id } / comments; // Get post comments

// Albums and Photos
GET / albums; // Get all albums
GET / photos; // Get all photos
```

**Example Usage**:

```javascript
// Fetch all posts
async function fetchPosts() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

// Create a new post
async function createPost(title, body, userId) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        body,
        userId
      })
    });

    const newPost = await response.json();
    return newPost;
  } catch (error) {
    console.error("Failed to create post:", error);
    throw error;
  }
}
```

### Lorem Picsum - Random Images

**Base URL**: `https://picsum.photos`

**Endpoints**:

```javascript
// Random images
GET /200/300           // 200x300 random image
GET /id/{id}/200/300   // Specific image by ID
GET /200/300?grayscale // Grayscale image
GET /200/300?blur=2    // Blurred image

// Image list
GET /v2/list?page=1&limit=10  // List of available images
```

**Example Usage**:

```javascript
// Load random images with loading states
async function loadRandomImages(count = 5) {
  const images = [];

  for (let i = 0; i < count; i++) {
    try {
      const imageUrl = `https://picsum.photos/300/200?random=${Date.now()}-${i}`;

      // Create promise that resolves when image loads
      const imageLoadPromise = new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () =>
          resolve({ url: imageUrl, width: img.width, height: img.height });
        img.onerror = () =>
          reject(new Error(`Failed to load image: ${imageUrl}`));
        img.src = imageUrl;
      });

      images.push(imageLoadPromise);
    } catch (error) {
      console.error(`Error creating image ${i}:`, error);
    }
  }

  // Wait for all images to load
  const results = await Promise.allSettled(images);

  return {
    successful: results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value),
    failed: results.filter((r) => r.status === "rejected").map((r) => r.reason)
  };
}
```

### Cat Facts API

**Base URL**: `https://catfact.ninja`

**Endpoints**:

```javascript
GET /fact              // Random cat fact
GET /facts?limit=10    // Multiple facts
GET /breeds            // Cat breeds
```

**Example Usage**:

```javascript
// Fetch random cat facts with retry logic
async function fetchCatFacts(count = 3, maxRetries = 3) {
  const facts = [];

  for (let i = 0; i < count; i++) {
    let attempts = 0;

    while (attempts < maxRetries) {
      try {
        const response = await fetch("https://catfact.ninja/fact");
        const data = await response.json();
        facts.push(data.fact);
        break; // Success, exit retry loop
      } catch (error) {
        attempts++;
        if (attempts === maxRetries) {
          console.error(
            `Failed to fetch fact ${i} after ${maxRetries} attempts`
          );
          facts.push("Failed to load cat fact");
        } else {
          // Wait before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempts));
        }
      }
    }
  }

  return facts;
}
```

## 2. APIs Requiring Free Registration

### OpenWeatherMap API

**Base URL**: `https://api.openweathermap.org/data/2.5`
**Registration**: https://openweathermap.org/api

**Endpoints**:

```javascript
GET /weather?q={city}&appid={API_KEY}           // Current weather
GET /forecast?q={city}&appid={API_KEY}          // 5-day forecast
GET /weather?lat={lat}&lon={lon}&appid={API_KEY} // Weather by coordinates
```

**Example Usage**:

```javascript
class WeatherAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = "https://api.openweathermap.org/data/2.5";
  }

  async getCurrentWeather(city) {
    const url = `${this.baseURL}/weather?q=${city}&appid=${this.apiKey}&units=metric`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`City "${city}" not found`);
        } else if (response.status === 401) {
          throw new Error("Invalid API key");
        } else {
          throw new Error(`Weather API error: ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error("Weather fetch failed:", error);
      throw error;
    }
  }

  async getMultipleCitiesWeather(cities) {
    // Demonstrate concurrent API calls
    const weatherPromises = cities.map((city) =>
      this.getCurrentWeather(city).catch((error) => ({
        city,
        error: error.message
      }))
    );

    const results = await Promise.allSettled(weatherPromises);

    return results.map((result, index) => ({
      city: cities[index],
      status: result.status,
      data: result.status === "fulfilled" ? result.value : null,
      error: result.status === "rejected" ? result.reason.message : null
    }));
  }
}

// Usage
const weather = new WeatherAPI("YOUR_API_KEY");
const citiesWeather = await weather.getMultipleCitiesWeather([
  "London",
  "New York",
  "Tokyo"
]);
```

### GitHub API

**Base URL**: `https://api.github.com`
**Authentication**: Optional for basic usage (rate limited)

**Endpoints**:

```javascript
GET / users / { username }; // User information
GET / users / { username } / repos; // User repositories
GET / repos / { owner } / { repo }; // Repository details
GET / repos / { owner } / { repo } / issues; // Repository issues
```

**Example Usage**:

```javascript
class GitHubAPI {
  constructor(token = null) {
    this.token = token;
    this.baseURL = "https://api.github.com";
    this.rateLimit = {
      remaining: null,
      reset: null
    };
  }

  async makeRequest(endpoint) {
    const headers = {
      Accept: "application/vnd.github.v3+json"
    };

    if (this.token) {
      headers["Authorization"] = `token ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, { headers });

      // Update rate limit info
      this.rateLimit.remaining = parseInt(
        response.headers.get("x-ratelimit-remaining")
      );
      this.rateLimit.reset = new Date(
        response.headers.get("x-ratelimit-reset") * 1000
      );

      if (!response.ok) {
        if (response.status === 403 && this.rateLimit.remaining === 0) {
          throw new Error(
            `Rate limit exceeded. Resets at ${this.rateLimit.reset}`
          );
        } else if (response.status === 404) {
          throw new Error("Resource not found");
        } else {
          throw new Error(`GitHub API error: ${response.status}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error("GitHub API request failed:", error);
      throw error;
    }
  }

  async getUserRepos(username) {
    return this.makeRequest(`/users/${username}/repos`);
  }

  async getRepoDetails(owner, repo) {
    return this.makeRequest(`/repos/${owner}/${repo}`);
  }

  getRateLimit() {
    return this.rateLimit;
  }
}
```

## 3. Real-time and Streaming APIs

### WebSocket Echo Test

**URL**: `wss://echo.websocket.org`

**Example Usage**:

```javascript
class WebSocketTester {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.messageHandlers = new Set();
    this.connectionPromise = null;
  }

  async connect() {
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      const connectTimeout = setTimeout(() => {
        reject(new Error("WebSocket connection timeout"));
      }, 5000);

      this.ws.onopen = () => {
        clearTimeout(connectTimeout);
        console.log("WebSocket connected");
        resolve();
      };

      this.ws.onerror = (error) => {
        clearTimeout(connectTimeout);
        reject(new Error("WebSocket connection failed"));
      };

      this.ws.onmessage = (event) => {
        this.messageHandlers.forEach((handler) => {
          try {
            handler(event.data);
          } catch (error) {
            console.error("Message handler error:", error);
          }
        });
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        this.connectionPromise = null;
      };
    });

    return this.connectionPromise;
  }

  async sendMessage(message) {
    await this.connect();

    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      throw new Error("WebSocket not connected");
    }
  }

  onMessage(handler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

// Usage
const wsTester = new WebSocketTester("wss://echo.websocket.org");

// Set up message handler
const unsubscribe = wsTester.onMessage((message) => {
  console.log("Received:", message);
});

// Send messages
await wsTester.sendMessage("Hello WebSocket!");
await wsTester.sendMessage(
  JSON.stringify({ type: "test", data: "async data" })
);

// Clean up
setTimeout(() => {
  unsubscribe();
  wsTester.disconnect();
}, 10000);
```

## 4. Practice Exercises with APIs

### Exercise 1: API Data Aggregation

```javascript
// Combine data from multiple APIs
async function createUserDashboard(username) {
  try {
    console.log("Loading dashboard data...");

    const [userInfo, posts, weather] = await Promise.allSettled([
      // Simulated user info from JSONPlaceholder
      fetch(`https://jsonplaceholder.typicode.com/users/1`).then((r) =>
        r.json()
      ),

      // User posts
      fetch(`https://jsonplaceholder.typicode.com/users/1/posts`).then((r) =>
        r.json()
      ),

      // Weather for user's city (you'll need an API key)
      // fetch(`https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY`)
      //     .then(r => r.json())
      Promise.resolve({ weather: "sunny", temp: 22 }) // Mock for demo
    ]);

    return {
      user: userInfo.status === "fulfilled" ? userInfo.value : null,
      posts: posts.status === "fulfilled" ? posts.value : [],
      weather: weather.status === "fulfilled" ? weather.value : null,
      errors: [userInfo, posts, weather]
        .filter((result) => result.status === "rejected")
        .map((result) => result.reason.message)
    };
  } catch (error) {
    console.error("Dashboard creation failed:", error);
    throw error;
  }
}
```

### Exercise 2: Image Gallery with Lazy Loading

```javascript
class AsyncImageGallery {
  constructor(container) {
    this.container = container;
    this.loading = false;
    this.page = 1;
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    });
  }

  async loadImage(img) {
    const imageId = img.dataset.imageId;
    const imageUrl = `https://picsum.photos/300/200?random=${imageId}`;

    try {
      // Show loading state
      img.style.backgroundColor = "#f0f0f0";
      img.innerHTML = "Loading...";

      // Load actual image
      await new Promise((resolve, reject) => {
        const actualImg = new Image();
        actualImg.onload = () => {
          img.src = actualImg.src;
          img.innerHTML = "";
          img.style.backgroundColor = "transparent";
          resolve();
        };
        actualImg.onerror = reject;
        actualImg.src = imageUrl;
      });
    } catch (error) {
      img.innerHTML = "❌ Failed to load";
      img.style.backgroundColor = "#ffebee";
    }
  }

  async loadBatch() {
    if (this.loading) return;

    this.loading = true;

    try {
      // Create placeholder images
      for (let i = 0; i < 10; i++) {
        const imageId = (this.page - 1) * 10 + i;
        const imgElement = document.createElement("img");
        imgElement.dataset.imageId = imageId;
        imgElement.style.width = "300px";
        imgElement.style.height = "200px";
        imgElement.style.margin = "10px";
        imgElement.style.display = "block";

        this.container.appendChild(imgElement);
        this.observer.observe(imgElement);
      }

      this.page++;
    } finally {
      this.loading = false;
    }
  }
}

// Usage
const gallery = new AsyncImageGallery(document.getElementById("gallery"));
gallery.loadBatch();
```

### Exercise 3: Real-time Data Polling

```javascript
class DataPoller {
  constructor(endpoint, interval = 5000) {
    this.endpoint = endpoint;
    this.interval = interval;
    this.isPolling = false;
    this.data = null;
    this.listeners = new Set();
    this.errorCount = 0;
    this.maxErrors = 3;
  }

  async fetchData() {
    try {
      const response = await fetch(this.endpoint);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const newData = await response.json();

      // Check if data has changed
      if (JSON.stringify(newData) !== JSON.stringify(this.data)) {
        this.data = newData;
        this.notifyListeners(newData);
      }

      this.errorCount = 0; // Reset error count on success
    } catch (error) {
      this.errorCount++;
      console.error(
        `Data fetch failed (${this.errorCount}/${this.maxErrors}):`,
        error
      );

      if (this.errorCount >= this.maxErrors) {
        this.stop();
        this.notifyListeners(
          null,
          new Error("Max errors reached, polling stopped")
        );
      }
    }
  }

  start() {
    if (this.isPolling) return;

    this.isPolling = true;
    this.errorCount = 0;

    // Initial fetch
    this.fetchData();

    // Set up polling
    this.pollInterval = setInterval(() => {
      this.fetchData();
    }, this.interval);

    console.log(`Started polling ${this.endpoint} every ${this.interval}ms`);
  }

  stop() {
    if (!this.isPolling) return;

    this.isPolling = false;
    clearInterval(this.pollInterval);
    console.log("Stopped polling");
  }

  onUpdate(listener) {
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }

  notifyListeners(data, error = null) {
    this.listeners.forEach((listener) => {
      try {
        listener(data, error);
      } catch (err) {
        console.error("Listener error:", err);
      }
    });
  }
}

// Usage
const poller = new DataPoller("https://jsonplaceholder.typicode.com/posts/1");

const unsubscribe = poller.onUpdate((data, error) => {
  if (error) {
    console.error("Polling error:", error);
  } else {
    console.log("Data updated:", data?.title);
  }
});

poller.start();

// Stop after 30 seconds
setTimeout(() => {
  poller.stop();
  unsubscribe();
}, 30000);
```

## 5. API Testing and Error Handling

### Simulate Different Network Conditions

```javascript
class NetworkSimulator {
  constructor() {
    this.conditions = {
      fast: { delay: 100, errorRate: 0.01 },
      slow: { delay: 2000, errorRate: 0.05 },
      unstable: { delay: 1000, errorRate: 0.3 },
      offline: { delay: 0, errorRate: 1 }
    };
    this.currentCondition = "fast";
  }

  setCondition(condition) {
    if (this.conditions[condition]) {
      this.currentCondition = condition;
      console.log(`Network condition set to: ${condition}`);
    }
  }

  async simulateRequest(url, options = {}) {
    const condition = this.conditions[this.currentCondition];

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, condition.delay));

    // Simulate network errors
    if (Math.random() < condition.errorRate) {
      throw new Error(
        `Simulated network error (${this.currentCondition} network)`
      );
    }

    // Make actual request
    return fetch(url, options);
  }
}

// Usage
const networkSim = new NetworkSimulator();

async function testNetworkConditions() {
  const conditions = ["fast", "slow", "unstable", "offline"];

  for (const condition of conditions) {
    networkSim.setCondition(condition);

    try {
      console.log(`Testing with ${condition} network...`);
      const startTime = Date.now();

      const response = await networkSim.simulateRequest(
        "https://jsonplaceholder.typicode.com/posts/1"
      );
      const data = await response.json();

      const endTime = Date.now();
      console.log(`✅ Success in ${endTime - startTime}ms:`, data.title);
    } catch (error) {
      console.log(`❌ Failed:`, error.message);
    }

    console.log("---");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
```

## API Practice Projects

### 1. Weather Dashboard

Combine OpenWeatherMap API with location services to create a comprehensive weather dashboard.

### 2. GitHub Profile Viewer

Use GitHub API to create a profile viewer that shows user info, repositories, and activity.

### 3. Image Gallery with Search

Combine Lorem Picsum with a search API to create a searchable image gallery.

### 4. Real-time Chat Simulator

Use WebSocket APIs to create a real-time chat application with multiple users.

### 5. Data Visualization Dashboard

Aggregate data from multiple APIs to create an interactive dashboard with charts and graphs.

Remember: Always respect API rate limits and terms of service. Use API keys securely and never commit them to public repositories! 🔐
