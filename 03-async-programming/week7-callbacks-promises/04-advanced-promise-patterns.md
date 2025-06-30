# Advanced Promise Patterns

## Learning Objectives

By the end of this lesson, you should be able to:

- Implement advanced Promise patterns and techniques
- Handle complex error scenarios and recovery
- Build retry mechanisms with Promises
- Create custom Promise utilities
- Optimize Promise performance
- Understand Promise scheduling and microtasks

## Error Recovery Patterns

### 1. Fallback Chains

```javascript
function fetchFromPrimary() {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("Primary service down")), 1000);
  });
}

function fetchFromSecondary() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("Data from secondary"), 800);
  });
}

function fetchFromCache() {
  return Promise.resolve("Cached data");
}

// Fallback chain: try primary, then secondary, then cache
fetchFromPrimary()
  .catch(() => {
    console.log("Primary failed, trying secondary...");
    return fetchFromSecondary();
  })
  .catch(() => {
    console.log("Secondary failed, using cache...");
    return fetchFromCache();
  })
  .then((data) => {
    console.log("Final result:", data);
  })
  .catch((error) => {
    console.error("All sources failed:", error);
  });
```

### 2. Conditional Error Recovery

```javascript
function smartFetch(url, retries = 3) {
  return new Promise((resolve, reject) => {
    // Simulate different types of errors
    const errorTypes = ["network", "timeout", "server", "success"];
    const result = errorTypes[Math.floor(Math.random() * errorTypes.length)];

    setTimeout(() => {
      if (result === "success") {
        resolve(`Data from ${url}`);
      } else {
        const error = new Error(`${result} error`);
        error.type = result;
        reject(error);
      }
    }, 500);
  }).catch((error) => {
    // Retry logic based on error type
    if (retries > 0 && (error.type === "network" || error.type === "timeout")) {
      console.log(
        `Retrying due to ${error.type} error. Retries left: ${retries}`
      );
      return smartFetch(url, retries - 1);
    }
    throw error; // Re-throw if not retryable or no retries left
  });
}

// Usage
smartFetch("/api/data")
  .then((data) => console.log("Success:", data))
  .catch((error) => console.error("Final error:", error.message));
```

## Retry Patterns

### 1. Simple Retry

```javascript
function retry(promiseFactory, maxAttempts = 3, delay = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    function attempt() {
      attempts++;

      promiseFactory()
        .then(resolve)
        .catch((error) => {
          if (attempts >= maxAttempts) {
            reject(
              new Error(
                `Failed after ${maxAttempts} attempts: ${error.message}`
              )
            );
          } else {
            console.log(
              `Attempt ${attempts} failed, retrying in ${delay}ms...`
            );
            setTimeout(attempt, delay);
          }
        });
    }

    attempt();
  });
}

// Usage
retry(() => fetch("/api/unreliable-endpoint"), 3, 1000)
  .then((response) => response.json())
  .then((data) => console.log("Success:", data))
  .catch((error) => console.error("All retries failed:", error));
```

### 2. Exponential Backoff

```javascript
function retryWithBackoff(
  promiseFactory,
  maxAttempts = 3,
  initialDelay = 1000
) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    function attempt() {
      attempts++;

      promiseFactory()
        .then(resolve)
        .catch((error) => {
          if (attempts >= maxAttempts) {
            reject(
              new Error(
                `Failed after ${maxAttempts} attempts: ${error.message}`
              )
            );
          } else {
            const delay = initialDelay * Math.pow(2, attempts - 1);
            console.log(
              `Attempt ${attempts} failed, retrying in ${delay}ms...`
            );
            setTimeout(attempt, delay);
          }
        });
    }

    attempt();
  });
}

// Usage with exponential backoff: 1s, 2s, 4s delays
retryWithBackoff(() => apiCall("/flaky-endpoint"), 3, 1000)
  .then((data) => console.log("Success:", data))
  .catch((error) => console.error("Failed with backoff:", error));
```

### 3. Retry with Jitter

```javascript
function retryWithJitter(promiseFactory, maxAttempts = 3, baseDelay = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    function attempt() {
      attempts++;

      promiseFactory()
        .then(resolve)
        .catch((error) => {
          if (attempts >= maxAttempts) {
            reject(
              new Error(
                `Failed after ${maxAttempts} attempts: ${error.message}`
              )
            );
          } else {
            // Add jitter to prevent thundering herd
            const jitter = Math.random() * 1000;
            const delay = baseDelay * attempts + jitter;
            console.log(
              `Attempt ${attempts} failed, retrying in ${Math.round(
                delay
              )}ms...`
            );
            setTimeout(attempt, delay);
          }
        });
    }

    attempt();
  });
}
```

## Timeout Patterns

### 1. Promise Timeout

```javascript
function withTimeout(
  promise,
  timeoutMs,
  timeoutMessage = "Operation timed out"
) {
  const timeoutPromise = new Promise((_, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(timeoutMessage));
    }, timeoutMs);

    // Clean up timeout if main promise resolves first
    promise.finally(() => clearTimeout(timeoutId));
  });

  return Promise.race([promise, timeoutPromise]);
}

// Usage
const slowOperation = new Promise((resolve) =>
  setTimeout(() => resolve("Slow result"), 5000)
);

withTimeout(slowOperation, 2000, "Request took too long")
  .then((result) => console.log("Result:", result))
  .catch((error) => console.error("Error:", error.message));
```

### 2. Timeout with Cleanup

```javascript
function withTimeoutAndCleanup(promiseFactory, timeoutMs, cleanup) {
  let timeoutId;
  let isResolved = false;

  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      if (!isResolved) {
        isResolved = true;
        if (cleanup) cleanup();
        reject(new Error("Operation timed out"));
      }
    }, timeoutMs);
  });

  const mainPromise = promiseFactory()
    .then((result) => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeoutId);
        return result;
      }
    })
    .catch((error) => {
      if (!isResolved) {
        isResolved = true;
        clearTimeout(timeoutId);
        throw error;
      }
    });

  return Promise.race([mainPromise, timeoutPromise]);
}
```

## Batching and Rate Limiting

### 1. Batch Processing

```javascript
function processBatch(items, batchSize, processor, delayBetweenBatches = 0) {
  const batches = [];

  // Split items into batches
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  return batches.reduce((promise, batch, index) => {
    return promise.then((results) => {
      console.log(`Processing batch ${index + 1}/${batches.length}`);

      // Process all items in this batch concurrently
      const batchPromises = batch.map(processor);

      return Promise.all(batchPromises).then((batchResults) => {
        const allResults = [...results, ...batchResults];

        // Add delay between batches if specified
        if (delayBetweenBatches > 0 && index < batches.length - 1) {
          return new Promise((resolve) => {
            setTimeout(() => resolve(allResults), delayBetweenBatches);
          });
        }

        return allResults;
      });
    });
  }, Promise.resolve([]));
}

// Usage
const urls = Array.from({ length: 20 }, (_, i) => `/api/item/${i}`);

processBatch(
  urls,
  5, // Process 5 at a time
  (url) => fetch(url).then((r) => r.json()),
  1000 // Wait 1s between batches
)
  .then((results) => console.log("All results:", results))
  .catch((error) => console.error("Batch processing failed:", error));
```

### 2. Rate Limiter

```javascript
class RateLimiter {
  constructor(maxConcurrent = 3, delayBetweenRequests = 100) {
    this.maxConcurrent = maxConcurrent;
    this.delayBetweenRequests = delayBetweenRequests;
    this.queue = [];
    this.running = 0;
    this.lastRequestTime = 0;
  }

  async execute(promiseFactory) {
    return new Promise((resolve, reject) => {
      this.queue.push({ promiseFactory, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const { promiseFactory, resolve, reject } = this.queue.shift();
    this.running++;

    // Ensure minimum delay between requests
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.delayBetweenRequests) {
      await new Promise((r) =>
        setTimeout(r, this.delayBetweenRequests - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();

    try {
      const result = await promiseFactory();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.processQueue(); // Process next item
    }
  }
}

// Usage
const limiter = new RateLimiter(3, 500); // Max 3 concurrent, 500ms between requests

const requests = Array.from({ length: 10 }, (_, i) =>
  limiter.execute(() => fetch(`/api/item/${i}`).then((r) => r.json()))
);

Promise.all(requests)
  .then((results) => console.log("All requests completed:", results))
  .catch((error) => console.error("Some requests failed:", error));
```

## Promise Composition Patterns

### 1. Pipeline

```javascript
function pipeline(...functions) {
  return function (input) {
    return functions.reduce((promise, func) => {
      return promise.then(func);
    }, Promise.resolve(input));
  };
}

// Usage
const processData = pipeline(
  (data) => {
    console.log("Step 1: Validating...");
    return Promise.resolve({ ...data, validated: true });
  },
  (data) => {
    console.log("Step 2: Transforming...");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...data, transformed: true });
      }, 500);
    });
  },
  (data) => {
    console.log("Step 3: Saving...");
    return Promise.resolve({ ...data, saved: true });
  }
);

processData({ id: 1, name: "Test" })
  .then((result) => console.log("Pipeline result:", result))
  .catch((error) => console.error("Pipeline failed:", error));
```

### 2. Map with Concurrency Control

```javascript
async function mapWithConcurrency(items, asyncMapper, concurrency = 3) {
  const results = [];
  const executing = [];

  for (const [index, item] of items.entries()) {
    const promise = asyncMapper(item, index).then((result) => {
      results[index] = result;
      return result;
    });

    executing.push(promise);

    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex((p) => p.isFulfilled),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}

// Usage
const items = Array.from({ length: 10 }, (_, i) => i);

mapWithConcurrency(
  items,
  async (item) => {
    await new Promise((r) => setTimeout(r, 1000)); // Simulate async work
    return item * 2;
  },
  3 // Max 3 concurrent operations
).then((results) => console.log("Mapped results:", results));
```

## Memory and Performance Patterns

### 1. Promise Caching

```javascript
class PromiseCache {
  constructor(ttl = 60000) {
    // 1 minute default TTL
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key, promiseFactory) {
    const cached = this.cache.get(key);

    if (cached && Date.now() - cached.timestamp < this.ttl) {
      console.log("Cache hit for:", key);
      return cached.promise;
    }

    console.log("Cache miss for:", key);
    const promise = promiseFactory().catch((error) => {
      // Remove failed promises from cache
      this.cache.delete(key);
      throw error;
    });

    this.cache.set(key, {
      promise,
      timestamp: Date.now()
    });

    return promise;
  }

  clear() {
    this.cache.clear();
  }

  delete(key) {
    this.cache.delete(key);
  }
}

// Usage
const cache = new PromiseCache(30000); // 30 second TTL

function fetchUser(id) {
  return cache.get(`user:${id}`, () =>
    fetch(`/api/users/${id}`).then((r) => r.json())
  );
}

// First call - cache miss
fetchUser(1).then((user) => console.log("First call:", user));

// Second call - cache hit
setTimeout(() => {
  fetchUser(1).then((user) => console.log("Second call:", user));
}, 1000);
```

### 2. Lazy Promise Execution

```javascript
class LazyPromise {
  constructor(executor) {
    this.executor = executor;
    this.promise = null;
  }

  then(onFulfilled, onRejected) {
    if (!this.promise) {
      console.log("Lazy promise executing...");
      this.promise = new Promise(this.executor);
    }
    return this.promise.then(onFulfilled, onRejected);
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (value) => Promise.resolve(onFinally()).then(() => value),
      (reason) =>
        Promise.resolve(onFinally()).then(() => Promise.reject(reason))
    );
  }
}

// Usage
const lazyApiCall = new LazyPromise((resolve, reject) => {
  console.log("Expensive operation starting...");
  setTimeout(() => {
    resolve("Expensive result");
  }, 2000);
});

console.log("Lazy promise created (not executed yet)");

// Promise only executes when .then() is called
setTimeout(() => {
  lazyApiCall.then((result) => console.log("Result:", result));
}, 3000);
```

## Testing Promise Patterns

### 1. Promise Testing Utilities

```javascript
// Utility to create promises that resolve/reject after delay
function delayedResolve(value, delay = 100) {
  return new Promise((resolve) => setTimeout(() => resolve(value), delay));
}

function delayedReject(error, delay = 100) {
  return new Promise((_, reject) => setTimeout(() => reject(error), delay));
}

// Test helper for timing
async function measurePromise(promise) {
  const start = Date.now();
  try {
    const result = await promise;
    const duration = Date.now() - start;
    return { success: true, result, duration };
  } catch (error) {
    const duration = Date.now() - start;
    return { success: false, error, duration };
  }
}

// Usage in tests
async function testRetryFunction() {
  let attempts = 0;

  const flaky = () => {
    attempts++;
    if (attempts < 3) {
      return delayedReject(new Error("Network error"), 100);
    }
    return delayedResolve("Success!", 100);
  };

  const result = await measurePromise(retry(flaky, 5));
  console.log("Test result:", result);
  console.log("Attempts made:", attempts);
}

testRetryFunction();
```

## Common Anti-Patterns to Avoid

### 1. The Promise Constructor Anti-Pattern

```javascript
// Bad: Wrapping promises in promises
function fetchData() {
  return new Promise((resolve, reject) => {
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

// Good: Return the existing promise
function fetchData() {
  return fetch("/api/data").then((response) => response.json());
}
```

### 2. Not Handling Errors

```javascript
// Bad: Silent failures
fetchData()
  .then((data) => processData(data))
  .then((result) => displayResult(result));

// Good: Always handle errors
fetchData()
  .then((data) => processData(data))
  .then((result) => displayResult(result))
  .catch((error) => {
    console.error("Error in data pipeline:", error);
    showErrorMessage("Failed to load data");
  });
```

### 3. Creating Promises in Loops

```javascript
// Bad: Creating promises in sequence
async function processItems(items) {
  const results = [];
  for (const item of items) {
    const result = await processItem(item); // Waits for each one
    results.push(result);
  }
  return results;
}

// Good: Create all promises first, then wait
async function processItems(items) {
  const promises = items.map((item) => processItem(item));
  return Promise.all(promises);
}
```

## Practice Exercises

### Exercise 1: Robust API Client

Create an API client with retry, timeout, and fallback:

```javascript
class RobustApiClient {
  constructor(baseUrl, options = {}) {
    // Your implementation here
    // Should support retry, timeout, caching
  }

  async get(endpoint) {
    // Your implementation here
  }
}

// Usage
const client = new RobustApiClient("/api", {
  timeout: 5000,
  retries: 3,
  cacheTime: 60000
});
```

### Exercise 2: Promise Queue

Implement a queue that processes promises sequentially:

```javascript
class PromiseQueue {
  constructor() {
    // Your implementation here
  }

  add(promiseFactory) {
    // Your implementation here
    // Should return a promise that resolves when the operation completes
  }
}
```

### Exercise 3: Circuit Breaker Pattern

Implement a circuit breaker for promise-based operations:

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    // Your implementation here
  }

  async execute(promiseFactory) {
    // Your implementation here
    // Should track failures and open/close circuit
  }
}
```

## Summary

Advanced Promise patterns enable you to build robust, performant applications that handle complex asynchronous scenarios gracefully. Key takeaways:

- **Error Recovery**: Implement fallbacks and conditional retries
- **Performance**: Use batching, rate limiting, and caching
- **Composition**: Build complex flows from simple patterns
- **Testing**: Create utilities to test asynchronous code
- **Anti-patterns**: Avoid common mistakes that lead to bugs

These patterns prepare you for real-world application development where reliable asynchronous handling is crucial.

## Next Steps

Next, we'll move to **Week 8** and explore **async/await syntax**, which provides an even more elegant way to work with Promises, and learn about working with APIs and handling real-world asynchronous scenarios.
