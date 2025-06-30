# Modern Async Patterns

## Table of Contents

1. [Enhanced Promise Patterns](#enhanced-promise-patterns)
2. [Async/Await Best Practices](#asyncawait-best-practices)
3. [Error Handling in Async Code](#error-handling-in-async-code)
4. [Parallel and Sequential Execution](#parallel-and-sequential-execution)
5. [Async Iterators and Generators](#async-iterators-and-generators)
6. [Promise Combinators](#promise-combinators)
7. [Modern Fetch Patterns](#modern-fetch-patterns)
8. [Async Performance Optimization](#async-performance-optimization)
9. [Best Practices](#best-practices)
10. [Practice Exercises](#practice-exercises)

## Enhanced Promise Patterns

Modern JavaScript provides powerful patterns for working with asynchronous code beyond basic Promise usage.

### Promise Creation Patterns

```javascript
// Promise constructor with proper error handling
function createTimedPromise(delay, shouldReject = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) {
        reject(new Error(`Promise rejected after ${delay}ms`));
      } else {
        resolve(`Promise resolved after ${delay}ms`);
      }
    }, delay);
  });
}

// Promise.resolve for immediate resolution
const immediateValue = Promise.resolve("Immediate value");

// Promise.reject for immediate rejection
const immediateError = Promise.reject(new Error("Immediate error"));

// Converting callback-based APIs to Promises
function promisify(callbackFunction) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      callbackFunction(...args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
}

// Example: Promisifying setTimeout
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Usage
delay(1000).then(() => console.log("1 second passed"));
```

### Promise Chaining with Error Recovery

```javascript
class APIClient {
  constructor(baseURL, retryCount = 3) {
    this.baseURL = baseURL;
    this.retryCount = retryCount;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    return this.requestWithRetry(url, options, this.retryCount)
      .then((response) => this.handleResponse(response))
      .catch((error) => this.handleError(error));
  }

  async requestWithRetry(url, options, attemptsLeft) {
    try {
      const response = await fetch(url, options);
      if (!response.ok && attemptsLeft > 1) {
        console.log(`Request failed, ${attemptsLeft - 1} attempts remaining`);
        await delay(1000); // Wait before retry
        return this.requestWithRetry(url, options, attemptsLeft - 1);
      }
      return response;
    } catch (error) {
      if (attemptsLeft > 1) {
        console.log(`Network error, ${attemptsLeft - 1} attempts remaining`);
        await delay(1000);
        return this.requestWithRetry(url, options, attemptsLeft - 1);
      }
      throw error;
    }
  }

  handleResponse(response) {
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  handleError(error) {
    console.error("API Request failed:", error);
    throw new Error(`API Error: ${error.message}`);
  }
}

// Usage with error recovery
const api = new APIClient("https://api.example.com");

api
  .request("/users/1")
  .then((user) => console.log("User:", user))
  .catch((error) => {
    console.error("Failed to fetch user:", error);
    // Fallback to cached data or show error message
    return { id: 1, name: "Cached User" };
  })
  .then((user) => {
    // This runs whether we got real data or fallback
    console.log("Final user data:", user);
  });
```

## Async/Await Best Practices

### Basic Async/Await Patterns

```javascript
// Converting Promise chains to async/await
class UserService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  // Promise chain version
  getUserWithPosts_PromiseChain(userId) {
    return this.apiClient
      .get(`/users/${userId}`)
      .then((user) => {
        return this.apiClient.get(`/users/${userId}/posts`).then((posts) => ({
          ...user,
          posts: posts
        }));
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        throw error;
      });
  }

  // Async/await version (cleaner)
  async getUserWithPosts(userId) {
    try {
      const user = await this.apiClient.get(`/users/${userId}`);
      const posts = await this.apiClient.get(`/users/${userId}/posts`);

      return {
        ...user,
        posts: posts
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }

  // Parallel execution with async/await
  async getUserWithPostsParallel(userId) {
    try {
      const [user, posts] = await Promise.all([
        this.apiClient.get(`/users/${userId}`),
        this.apiClient.get(`/users/${userId}/posts`)
      ]);

      return {
        ...user,
        posts: posts
      };
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }
}
```

### Advanced Async Patterns

```javascript
class DataProcessor {
  constructor() {
    this.cache = new Map();
    this.processing = new Map(); // Track ongoing operations
  }

  // Async method with caching and deduplication
  async processData(id) {
    // Return cached result if available
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    // If already processing, wait for existing operation
    if (this.processing.has(id)) {
      return this.processing.get(id);
    }

    // Start new processing operation
    const processingPromise = this.performProcessing(id);
    this.processing.set(id, processingPromise);

    try {
      const result = await processingPromise;
      this.cache.set(id, result);
      return result;
    } finally {
      this.processing.delete(id);
    }
  }

  async performProcessing(id) {
    console.log(`Processing data for ${id}`);
    await delay(2000); // Simulate processing time
    return `Processed data for ${id}`;
  }

  // Async method with timeout
  async processWithTimeout(id, timeoutMs = 5000) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Operation timed out")), timeoutMs);
    });

    return Promise.race([this.processData(id), timeoutPromise]);
  }

  // Batch processing with concurrency control
  async processBatch(ids, concurrency = 3) {
    const results = [];
    const executing = [];

    for (const id of ids) {
      const promise = this.processData(id).then((result) => {
        results.push({ id, result });
        return result;
      });

      executing.push(promise);

      if (executing.length >= concurrency) {
        await Promise.race(executing);
        // Remove completed promises
        executing.splice(
          0,
          executing.findIndex((p) => p.fulfilled !== undefined)
        );
      }
    }

    // Wait for remaining operations
    await Promise.all(executing);
    return results;
  }
}

// Usage
const processor = new DataProcessor();

// These will be deduplicated (only one actual processing)
Promise.all([
  processor.processData("item1"),
  processor.processData("item1"),
  processor.processData("item1")
]).then((results) => {
  console.log("All results:", results);
});
```

## Error Handling in Async Code

### Comprehensive Error Handling Strategies

```javascript
class RobustAsyncHandler {
  constructor() {
    this.errorHandlers = new Map();
    this.globalErrorHandler = this.defaultErrorHandler.bind(this);
  }

  // Register error handlers for specific error types
  registerErrorHandler(errorType, handler) {
    this.errorHandlers.set(errorType, handler);
  }

  // Default error handler
  defaultErrorHandler(error, context) {
    console.error(`Unhandled error in ${context}:`, error);
    // Log to external service, show user notification, etc.
  }

  // Wrapper for async operations with comprehensive error handling
  async safeExecute(operation, context = "unknown", retryCount = 0) {
    let lastError;

    for (let attempt = 0; attempt <= retryCount; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Check for specific error handlers
        const handler = this.errorHandlers.get(error.constructor.name);
        if (handler) {
          const result = await handler(error, context, attempt);
          if (result !== undefined) {
            return result; // Handler provided a fallback
          }
        }

        // If this is not the last attempt, log and continue
        if (attempt < retryCount) {
          console.warn(
            `Attempt ${attempt + 1} failed, retrying:`,
            error.message
          );
          await delay(Math.pow(2, attempt) * 1000); // Exponential backoff
          continue;
        }

        // Last attempt failed, call global error handler
        this.globalErrorHandler(error, context);
        throw error;
      }
    }
  }

  // Async function with multiple error types
  async complexOperation(url, data) {
    return this.safeExecute(
      async () => {
        // Validation errors
        if (!url) {
          throw new ValidationError("URL is required");
        }

        if (!data || typeof data !== "object") {
          throw new ValidationError("Data must be a valid object");
        }

        // Network operation
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          if (response.status >= 500) {
            throw new ServerError(`Server error: ${response.status}`);
          } else if (response.status >= 400) {
            throw new ClientError(`Client error: ${response.status}`);
          } else {
            throw new NetworkError(`Network error: ${response.status}`);
          }
        }

        return response.json();
      },
      "complexOperation",
      2
    ); // Retry up to 2 times
  }
}

// Custom error classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = "NetworkError";
  }
}

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "ServerError";
  }
}

class ClientError extends Error {
  constructor(message) {
    super(message);
    this.name = "ClientError";
  }
}

// Setup error handlers
const handler = new RobustAsyncHandler();

handler.registerErrorHandler("ValidationError", async (error, context) => {
  console.warn(`Validation error in ${context}:`, error.message);
  // Return default data or show user-friendly message
  return { error: "Invalid input provided" };
});

handler.registerErrorHandler(
  "NetworkError",
  async (error, context, attempt) => {
    console.warn(
      `Network error in ${context}, attempt ${attempt + 1}:`,
      error.message
    );
    // Don't provide fallback, let it retry
    return undefined;
  }
);

handler.registerErrorHandler("ServerError", async (error, context) => {
  console.error(`Server error in ${context}:`, error.message);
  // Provide cached data or offline functionality
  return { error: "Service temporarily unavailable" };
});

// Usage
handler
  .complexOperation("https://api.example.com/data", { name: "test" })
  .then((result) => console.log("Success:", result))
  .catch((error) => console.error("Final error:", error));
```

## Parallel and Sequential Execution

### Controlling Async Execution Flow

```javascript
class AsyncFlowController {
  // Execute operations sequentially
  static async sequential(operations) {
    const results = [];
    for (const operation of operations) {
      try {
        const result = await operation();
        results.push({ success: true, result });
      } catch (error) {
        results.push({ success: false, error });
      }
    }
    return results;
  }

  // Execute operations in parallel
  static async parallel(operations) {
    const promises = operations.map(async (operation) => {
      try {
        const result = await operation();
        return { success: true, result };
      } catch (error) {
        return { success: false, error };
      }
    });

    return Promise.all(promises);
  }

  // Execute with limited concurrency
  static async limitedParallel(operations, concurrency = 3) {
    const results = [];
    const executing = [];

    for (let i = 0; i < operations.length; i++) {
      const operation = operations[i];

      const promise = (async () => {
        try {
          const result = await operation();
          return { index: i, success: true, result };
        } catch (error) {
          return { index: i, success: false, error };
        }
      })();

      executing.push(promise);

      if (executing.length >= concurrency) {
        const completed = await Promise.race(executing);
        results.push(completed);

        // Remove completed promise from executing array
        const completedIndex = executing.findIndex((p) => p === promise);
        if (completedIndex !== -1) {
          executing.splice(completedIndex, 1);
        }
      }
    }

    // Wait for remaining operations
    const remaining = await Promise.all(executing);
    results.push(...remaining);

    // Sort by original index
    return results.sort((a, b) => a.index - b.index);
  }

  // Execute with fail-fast behavior
  static async failFast(operations) {
    return Promise.all(operations.map((op) => op()));
  }

  // Execute with success-first behavior (first success wins)
  static async raceToSuccess(operations) {
    return new Promise((resolve, reject) => {
      let completed = 0;
      let errors = [];

      operations.forEach(async (operation, index) => {
        try {
          const result = await operation();
          resolve({ index, result });
        } catch (error) {
          errors.push({ index, error });
          completed++;

          if (completed === operations.length) {
            reject(new Error("All operations failed"));
          }
        }
      });
    });
  }
}

// Example operations
const createOperation =
  (id, delay, shouldFail = false) =>
  async () => {
    await new Promise((resolve) => setTimeout(resolve, delay));
    if (shouldFail) {
      throw new Error(`Operation ${id} failed`);
    }
    return `Result from operation ${id}`;
  };

// Test different execution patterns
async function testExecutionPatterns() {
  const operations = [
    createOperation(1, 1000),
    createOperation(2, 500),
    createOperation(3, 1500),
    createOperation(4, 800),
    createOperation(5, 200)
  ];

  console.time("Sequential");
  const sequentialResults = await AsyncFlowController.sequential(operations);
  console.timeEnd("Sequential");
  console.log("Sequential results:", sequentialResults);

  console.time("Parallel");
  const parallelResults = await AsyncFlowController.parallel(operations);
  console.timeEnd("Parallel");
  console.log("Parallel results:", parallelResults);

  console.time("Limited Parallel (2)");
  const limitedResults = await AsyncFlowController.limitedParallel(
    operations,
    2
  );
  console.timeEnd("Limited Parallel (2)");
  console.log("Limited results:", limitedResults);
}

testExecutionPatterns();
```

## Async Iterators and Generators

### Creating and Using Async Iterators

```javascript
// Async generator for paginated API data
async function* fetchPaginatedData(baseUrl, pageSize = 10) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await fetch(`${baseUrl}?page=${page}&size=${pageSize}`);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        yield* data.items; // Yield each item individually
        page++;
        hasMore = data.hasMore || data.items.length === pageSize;
      } else {
        hasMore = false;
      }
    } catch (error) {
      console.error(`Error fetching page ${page}:`, error);
      hasMore = false;
    }
  }
}

// Using async iterator
async function processAllData() {
  const dataIterator = fetchPaginatedData("https://api.example.com/items");

  for await (const item of dataIterator) {
    console.log("Processing item:", item);

    // Process each item
    await processItem(item);

    // Break early if needed
    if (shouldStop(item)) {
      break;
    }
  }
}

// Async generator for real-time data streams
async function* streamData(source) {
  let buffer = [];
  let isRunning = true;

  // Set up data source listener
  source.onData = (data) => {
    buffer.push(data);
  };

  source.onEnd = () => {
    isRunning = false;
  };

  while (isRunning || buffer.length > 0) {
    if (buffer.length > 0) {
      yield buffer.shift();
    } else {
      // Wait for new data
      await delay(100);
    }
  }
}

// Custom async iterator class
class AsyncRange {
  constructor(start, end, step = 1, delay = 100) {
    this.start = start;
    this.end = end;
    this.step = step;
    this.delay = delay;
  }

  async *[Symbol.asyncIterator]() {
    for (let i = this.start; i < this.end; i += this.step) {
      await delay(this.delay);
      yield i;
    }
  }

  // Convert to array
  async toArray() {
    const result = [];
    for await (const value of this) {
      result.push(value);
    }
    return result;
  }

  // Map operation
  async *map(fn) {
    for await (const value of this) {
      yield await fn(value);
    }
  }

  // Filter operation
  async *filter(predicate) {
    for await (const value of this) {
      if (await predicate(value)) {
        yield value;
      }
    }
  }

  // Take first n items
  async *take(n) {
    let count = 0;
    for await (const value of this) {
      if (count >= n) break;
      yield value;
      count++;
    }
  }
}

// Usage examples
async function useAsyncIterators() {
  // Basic async range
  const range = new AsyncRange(1, 10, 1, 200);

  for await (const num of range) {
    console.log("Number:", num);
  }

  // Chained operations
  const doubled = range.map(async (x) => x * 2);
  const evens = doubled.filter(async (x) => x % 4 === 0);
  const firstThree = evens.take(3);

  const result = await firstThree.toArray();
  console.log("Final result:", result);
}
```

## Promise Combinators

Modern JavaScript provides several Promise combinators for different scenarios.

```javascript
class PromiseCombinators {
  // Wait for all promises to resolve
  static async allSettled(promises) {
    return Promise.allSettled(promises);
  }

  // Wait for first promise to resolve
  static async any(promises) {
    return Promise.any(promises);
  }

  // Custom combinator: resolve when X out of N promises resolve
  static async some(promises, count) {
    return new Promise((resolve, reject) => {
      let resolved = 0;
      let rejected = 0;
      const results = [];
      const errors = [];

      if (count > promises.length) {
        reject(new Error("Count cannot be greater than number of promises"));
        return;
      }

      promises.forEach(async (promise, index) => {
        try {
          const result = await promise;
          results[index] = result;
          resolved++;

          if (resolved >= count) {
            resolve(results.filter((r) => r !== undefined));
          }
        } catch (error) {
          errors[index] = error;
          rejected++;

          if (rejected > promises.length - count) {
            reject(new Error("Too many promises rejected"));
          }
        }
      });
    });
  }

  // Custom combinator: timeout for promises
  static timeout(promise, ms) {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(
        () => reject(new Error(`Promise timed out after ${ms}ms`)),
        ms
      );
    });

    return Promise.race([promise, timeoutPromise]);
  }

  // Custom combinator: retry with exponential backoff
  static async retry(promiseFactory, maxAttempts = 3, baseDelay = 1000) {
    let lastError;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await promiseFactory();
      } catch (error) {
        lastError = error;

        if (attempt === maxAttempts) {
          throw error;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`Attempt ${attempt} failed, retrying in ${delay}ms`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // Custom combinator: waterfall execution
  static async waterfall(tasks, initialValue) {
    let result = initialValue;

    for (const task of tasks) {
      result = await task(result);
    }

    return result;
  }
}

// Usage examples
async function demonstrateCombiners() {
  const fastPromise = delay(100).then(() => "fast");
  const mediumPromise = delay(500).then(() => "medium");
  const slowPromise = delay(1000).then(() => "slow");
  const failingPromise = delay(300).then(() => {
    throw new Error("failed");
  });

  // Promise.allSettled - wait for all, get results and errors
  const allResults = await PromiseCombinators.allSettled([
    fastPromise,
    mediumPromise,
    slowPromise,
    failingPromise
  ]);
  console.log("All settled:", allResults);

  // Promise.any - first successful result
  try {
    const anyResult = await PromiseCombinators.any([
      failingPromise,
      mediumPromise,
      slowPromise
    ]);
    console.log("Any result:", anyResult);
  } catch (error) {
    console.error("All promises failed:", error);
  }

  // Custom some combinator - wait for 2 out of 3
  try {
    const someResults = await PromiseCombinators.some(
      [fastPromise, mediumPromise, slowPromise],
      2
    );
    console.log("Some results:", someResults);
  } catch (error) {
    console.error("Not enough promises resolved:", error);
  }

  // Timeout combinator
  try {
    const timeoutResult = await PromiseCombinators.timeout(
      slowPromise,
      800 // Will timeout before slow promise resolves
    );
    console.log("Timeout result:", timeoutResult);
  } catch (error) {
    console.error("Promise timed out:", error.message);
  }

  // Retry combinator
  let attempts = 0;
  const unreliableOperation = () => {
    attempts++;
    if (attempts < 3) {
      return Promise.reject(new Error(`Attempt ${attempts} failed`));
    }
    return Promise.resolve(`Success on attempt ${attempts}`);
  };

  try {
    const retryResult = await PromiseCombinators.retry(unreliableOperation);
    console.log("Retry result:", retryResult);
  } catch (error) {
    console.error("All retry attempts failed:", error);
  }

  // Waterfall combinator
  const waterfallTasks = [
    async (value) => {
      await delay(100);
      return value * 2;
    },
    async (value) => {
      await delay(100);
      return value + 10;
    },
    async (value) => {
      await delay(100);
      return value.toString();
    }
  ];

  const waterfallResult = await PromiseCombinators.waterfall(waterfallTasks, 5);
  console.log("Waterfall result:", waterfallResult); // "20"
}

demonstrateCombiners();
```

## Modern Fetch Patterns

### Advanced Fetch Usage with Error Handling

```javascript
class ModernFetchClient {
  constructor(baseURL = "", defaultOptions = {}) {
    this.baseURL = baseURL;
    this.defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        ...defaultOptions.headers
      },
      ...defaultOptions
    };
    this.interceptors = {
      request: [],
      response: []
    };
  }

  // Add request interceptor
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  // Add response interceptor
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  // Apply request interceptors
  async applyRequestInterceptors(url, options) {
    let modifiedUrl = url;
    let modifiedOptions = { ...options };

    for (const interceptor of this.interceptors.request) {
      const result = await interceptor(modifiedUrl, modifiedOptions);
      if (result) {
        modifiedUrl = result.url || modifiedUrl;
        modifiedOptions = result.options || modifiedOptions;
      }
    }

    return { url: modifiedUrl, options: modifiedOptions };
  }

  // Apply response interceptors
  async applyResponseInterceptors(response) {
    let modifiedResponse = response;

    for (const interceptor of this.interceptors.response) {
      const result = await interceptor(modifiedResponse);
      if (result) {
        modifiedResponse = result;
      }
    }

    return modifiedResponse;
  }

  // Main fetch method with all features
  async fetch(url, options = {}) {
    const fullUrl = url.startsWith("http") ? url : `${this.baseURL}${url}`;
    const mergedOptions = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers
      }
    };

    // Apply request interceptors
    const { url: finalUrl, options: finalOptions } =
      await this.applyRequestInterceptors(fullUrl, mergedOptions);

    try {
      const response = await fetch(finalUrl, finalOptions);

      // Apply response interceptors
      const interceptedResponse = await this.applyResponseInterceptors(
        response
      );

      if (!interceptedResponse.ok) {
        throw new FetchError(
          `HTTP Error: ${interceptedResponse.status}`,
          interceptedResponse.status,
          interceptedResponse
        );
      }

      return interceptedResponse;
    } catch (error) {
      if (error instanceof FetchError) {
        throw error;
      }
      throw new NetworkError("Network request failed", error);
    }
  }

  // Convenience methods
  async get(url, options = {}) {
    return this.fetch(url, { ...options, method: "GET" });
  }

  async post(url, data, options = {}) {
    return this.fetch(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(data)
    });
  }

  async put(url, data, options = {}) {
    return this.fetch(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data)
    });
  }

  async delete(url, options = {}) {
    return this.fetch(url, { ...options, method: "DELETE" });
  }

  // Upload with progress
  async upload(url, file, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress?.(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Upload failed"));
      });

      xhr.open("POST", `${this.baseURL}${url}`);
      xhr.send(formData);
    });
  }

  // Streaming response
  async stream(url, onChunk, options = {}) {
    const response = await this.fetch(url, options);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        await onChunk(chunk);
      }
    } finally {
      reader.releaseLock();
    }
  }
}

// Custom error classes
class FetchError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = "FetchError";
    this.status = status;
    this.response = response;
  }
}

class NetworkError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = "NetworkError";
    this.originalError = originalError;
  }
}

// Usage example with interceptors
const client = new ModernFetchClient("https://api.example.com");

// Add authentication interceptor
client.addRequestInterceptor(async (url, options) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }
  return { url, options };
});

// Add response logging interceptor
client.addResponseInterceptor(async (response) => {
  console.log(`Response: ${response.status} ${response.url}`);
  return response;
});

// Add retry interceptor for specific errors
client.addResponseInterceptor(async (response) => {
  if (response.status === 401) {
    // Try to refresh token
    const newToken = await refreshAuthToken();
    if (newToken) {
      localStorage.setItem("auth_token", newToken);
      // Retry the original request
      return client.fetch(response.url, { headers: response.headers });
    }
  }
  return response;
});

// Usage
async function useModernFetch() {
  try {
    // Simple GET request
    const response = await client.get("/users/1");
    const user = await response.json();
    console.log("User:", user);

    // POST request with data
    const newUser = await client.post("/users", {
      name: "John Doe",
      email: "john@example.com"
    });
    console.log("Created user:", await newUser.json());

    // File upload with progress
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput?.files[0]) {
      await client.upload("/upload", fileInput.files[0], (progress) => {
        console.log(`Upload progress: ${progress}%`);
      });
    }

    // Streaming response
    await client.stream("/events", (chunk) => {
      console.log("Received chunk:", chunk);
    });
  } catch (error) {
    if (error instanceof FetchError) {
      console.error(`API Error ${error.status}:`, error.message);
    } else if (error instanceof NetworkError) {
      console.error("Network Error:", error.message);
    } else {
      console.error("Unknown Error:", error);
    }
  }
}
```

## Async Performance Optimization

### Optimization Techniques and Patterns

```javascript
class PerformanceOptimizer {
  constructor() {
    this.cache = new Map();
    this.pendingRequests = new Map();
  }

  // Memoization for async functions
  memoizeAsync(fn, keyFn = (...args) => JSON.stringify(args)) {
    return async (...args) => {
      const key = keyFn(...args);

      if (this.cache.has(key)) {
        return this.cache.get(key);
      }

      // Prevent duplicate requests
      if (this.pendingRequests.has(key)) {
        return this.pendingRequests.get(key);
      }

      const promise = fn(...args);
      this.pendingRequests.set(key, promise);

      try {
        const result = await promise;
        this.cache.set(key, result);
        return result;
      } finally {
        this.pendingRequests.delete(key);
      }
    };
  }

  // Debounced async operations
  debounceAsync(fn, delay = 300) {
    let timeoutId;
    let lastPromise;

    return (...args) => {
      return new Promise((resolve, reject) => {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(async () => {
          try {
            const result = await fn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    };
  }

  // Throttled async operations
  throttleAsync(fn, interval = 1000) {
    let lastExecution = 0;
    let pendingArgs = null;
    let pendingResolvers = [];

    return async (...args) => {
      return new Promise((resolve, reject) => {
        pendingArgs = args;
        pendingResolvers.push({ resolve, reject });

        const now = Date.now();
        const timeSinceLastExecution = now - lastExecution;

        if (timeSinceLastExecution >= interval) {
          this.executeThrottled(fn, pendingArgs, pendingResolvers);
          lastExecution = now;
          pendingArgs = null;
          pendingResolvers = [];
        } else {
          const remainingTime = interval - timeSinceLastExecution;
          setTimeout(() => {
            if (pendingArgs) {
              this.executeThrottled(fn, pendingArgs, pendingResolvers);
              lastExecution = Date.now();
              pendingArgs = null;
              pendingResolvers = [];
            }
          }, remainingTime);
        }
      });
    };
  }

  async executeThrottled(fn, args, resolvers) {
    try {
      const result = await fn(...args);
      resolvers.forEach(({ resolve }) => resolve(result));
    } catch (error) {
      resolvers.forEach(({ reject }) => reject(error));
    }
  }

  // Batch operations
  batchAsync(fn, batchSize = 10, delay = 100) {
    let batch = [];
    let timeoutId;

    return (item) => {
      return new Promise((resolve, reject) => {
        batch.push({ item, resolve, reject });

        clearTimeout(timeoutId);

        if (batch.length >= batchSize) {
          this.executeBatch(fn, batch);
          batch = [];
        } else {
          timeoutId = setTimeout(() => {
            if (batch.length > 0) {
              this.executeBatch(fn, batch);
              batch = [];
            }
          }, delay);
        }
      });
    };
  }

  async executeBatch(fn, batch) {
    try {
      const items = batch.map((b) => b.item);
      const results = await fn(items);

      batch.forEach((b, index) => {
        b.resolve(results[index]);
      });
    } catch (error) {
      batch.forEach((b) => b.reject(error));
    }
  }

  // Preload resources
  async preloadResources(urls, priority = "low") {
    const preloadPromises = urls.map((url) => {
      return new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "preload";
        link.href = url;
        link.onload = () => resolve(url);
        link.onerror = () => reject(new Error(`Failed to preload ${url}`));

        if (priority !== "low") {
          link.setAttribute("importance", priority);
        }

        document.head.appendChild(link);
      });
    });

    return Promise.allSettled(preloadPromises);
  }
}

// Usage examples
const optimizer = new PerformanceOptimizer();

// Memoized API call
const fetchUser = optimizer.memoizeAsync(async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

// Debounced search
const searchUsers = optimizer.debounceAsync(async (query) => {
  const response = await fetch(`/api/search?q=${query}`);
  return response.json();
});

// Throttled analytics
const trackEvent = optimizer.throttleAsync(async (event) => {
  await fetch("/api/analytics", {
    method: "POST",
    body: JSON.stringify(event)
  });
});

// Batched operations
const updateUserBatch = optimizer.batchAsync(async (users) => {
  const response = await fetch("/api/users/batch", {
    method: "PUT",
    body: JSON.stringify(users)
  });
  return response.json();
});
```

## Best Practices

### 1. Always Handle Errors Properly

```javascript
// Good: Comprehensive error handling
async function robustAsyncFunction() {
  try {
    const result = await riskyOperation();
    return result;
  } catch (error) {
    console.error("Operation failed:", error);
    // Provide fallback or rethrow with context
    throw new Error(`Failed to complete operation: ${error.message}`);
  }
}

// Avoid: Silent failures
async function fragileAsyncFunction() {
  const result = await riskyOperation(); // No error handling
  return result;
}
```

### 2. Use Proper Async Patterns

```javascript
// Good: Parallel execution when possible
async function fetchUserData(userId) {
  const [user, posts, comments] = await Promise.all([
    fetchUser(userId),
    fetchUserPosts(userId),
    fetchUserComments(userId)
  ]);

  return { user, posts, comments };
}

// Avoid: Unnecessary sequential execution
async function fetchUserDataSlow(userId) {
  const user = await fetchUser(userId);
  const posts = await fetchUserPosts(userId);
  const comments = await fetchUserComments(userId);

  return { user, posts, comments };
}
```

### 3. Implement Proper Cleanup

```javascript
class ResourceManager {
  constructor() {
    this.resources = new Set();
    this.abortController = new AbortController();
  }

  async fetchWithCleanup(url) {
    const response = await fetch(url, {
      signal: this.abortController.signal
    });

    this.resources.add(response);
    return response;
  }

  cleanup() {
    this.abortController.abort();
    this.resources.clear();
  }
}
```

## Self-Check Questions

1. When should you use `Promise.all()` vs `Promise.allSettled()`?
2. How do async generators differ from regular generators?
3. What are the benefits of using async/await over Promise chains?
4. How can you implement timeout functionality for async operations?
5. What are the performance implications of different async patterns?
6. How do you handle errors in async iterator chains?
7. When should you use request deduplication patterns?
8. How can you implement proper cancellation for async operations?

## Practice Exercises

### Exercise 1: Build an Async Task Queue

Create a task queue system that:

- Executes tasks with limited concurrency
- Supports task prioritization
- Provides progress tracking
- Handles task failures with retry logic

### Exercise 2: Implement a Cache with TTL

Build a caching system that:

- Supports async operations
- Implements time-to-live (TTL) for entries
- Prevents cache stampede with request deduplication
- Provides cache statistics

### Exercise 3: Create a Data Streaming Pipeline

Implement a streaming data processor that:

- Uses async generators for data transformation
- Supports backpressure handling
- Implements error recovery mechanisms
- Provides real-time processing metrics

### Exercise 4: Build a Resilient API Client

Create an API client that:

- Implements automatic retries with exponential backoff
- Supports request/response interceptors
- Handles rate limiting gracefully
- Provides comprehensive error reporting

These exercises will help you master modern async patterns and build robust, performant asynchronous applications.
