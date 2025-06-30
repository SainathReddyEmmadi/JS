# Week 7 Exercises: Callbacks and Promises

## Exercise 1: Understanding Asynchronous Execution

### Task

Create a demonstration that shows the difference between synchronous and asynchronous execution.

### Requirements

1. Create a function `demonstrateSync()` that performs a blocking operation
2. Create a function `demonstrateAsync()` that performs the same operation asynchronously
3. Show how they affect the execution order of other code
4. Measure and compare execution times

### Starter Code

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Async vs Sync Demo</title>
  </head>
  <body>
    <div id="output"></div>
    <button onclick="runSyncDemo()">Run Sync Demo</button>
    <button onclick="runAsyncDemo()">Run Async Demo</button>

    <script>
      function log(message) {
        const output = document.getElementById("output");
        output.innerHTML += `<p>${new Date().toISOString()}: ${message}</p>`;
      }

      // Your implementation here
      function demonstrateSync() {
        // TODO: Implement blocking operation
      }

      function demonstrateAsync(callback) {
        // TODO: Implement non-blocking operation
      }

      function runSyncDemo() {
        // TODO: Show sync execution order
      }

      function runAsyncDemo() {
        // TODO: Show async execution order
      }
    </script>
  </body>
</html>
```

### Expected Output

- Sync demo should block the UI and show operations in sequence
- Async demo should not block the UI and show interleaved execution

---

## Exercise 2: Callback Implementation

### Task

Build a simple task scheduler that manages callback-based operations.

### Requirements

1. Create a `TaskScheduler` class that can queue and execute tasks
2. Tasks should be functions that accept a callback
3. Support priority levels (high, medium, low)
4. Execute tasks in priority order
5. Handle errors gracefully

### Starter Code

```javascript
class TaskScheduler {
  constructor() {
    // TODO: Initialize scheduler
  }

  addTask(task, priority = "medium") {
    // TODO: Add task to appropriate queue
  }

  start() {
    // TODO: Start processing tasks
  }

  stop() {
    // TODO: Stop processing tasks
  }
}

// Example tasks
function downloadFile(filename, callback) {
  console.log(`Starting download: ${filename}`);
  setTimeout(() => {
    if (Math.random() > 0.2) {
      callback(null, `Downloaded: ${filename}`);
    } else {
      callback(new Error(`Failed to download: ${filename}`));
    }
  }, Math.random() * 2000 + 500);
}

function processData(data, callback) {
  console.log(`Processing: ${data}`);
  setTimeout(() => {
    callback(null, `Processed: ${data}`);
  }, 1000);
}

// Usage example
const scheduler = new TaskScheduler();

scheduler.addTask((callback) => downloadFile("file1.txt", callback), "high");
scheduler.addTask((callback) => downloadFile("file2.txt", callback), "low");
scheduler.addTask((callback) => processData("data1", callback), "medium");

scheduler.start();
```

### Expected Behavior

- High priority tasks execute first
- Errors are handled without crashing the scheduler
- Tasks execute in sequence (not concurrently for this exercise)

---

## Exercise 3: Promise Creation and Chaining

### Task

Create a user authentication and profile loading system using Promises.

### Requirements

1. Create `authenticate(username, password)` function that returns a Promise
2. Create `loadUserProfile(userId)` function that returns a Promise
3. Create `loadUserPosts(userId)` function that returns a Promise
4. Chain these operations together
5. Handle authentication failures and network errors

### Starter Code

```javascript
// Mock data
const users = [
  { id: 1, username: "alice", password: "password123", name: "Alice Johnson" },
  { id: 2, username: "bob", password: "secret456", name: "Bob Smith" }
];

const posts = [
  { id: 1, userId: 1, title: "My First Post", content: "Hello world!" },
  { id: 2, userId: 1, title: "Another Post", content: "Learning promises" },
  { id: 3, userId: 2, title: "Bob's Post", content: "Promises are cool!" }
];

function authenticate(username, password) {
  // TODO: Return a Promise that resolves with user ID if credentials are valid
  // Simulate network delay of 1-2 seconds
  // Reject if credentials are invalid
}

function loadUserProfile(userId) {
  // TODO: Return a Promise that resolves with user profile
  // Simulate network delay of 0.5-1.5 seconds
  // Reject if user not found
}

function loadUserPosts(userId) {
  // TODO: Return a Promise that resolves with user's posts
  // Simulate network delay of 0.8-1.2 seconds
  // Return empty array if no posts found
}

// Usage example - implement this flow:
function loginAndLoadData(username, password) {
  // TODO: Chain the promises to:
  // 1. Authenticate user
  // 2. Load user profile
  // 3. Load user posts
  // 4. Return combined data
  // 5. Handle all possible errors
}

// Test the implementation
loginAndLoadData("alice", "password123")
  .then((result) => {
    console.log("Login successful:", result);
  })
  .catch((error) => {
    console.error("Login failed:", error.message);
  });
```

### Expected Behavior

- Successful login returns user profile and posts
- Invalid credentials reject with appropriate error
- Network errors are handled gracefully
- Chain executes in correct order

---

## Exercise 4: Promise Utilities

### Task

Implement custom Promise utility functions similar to Promise.all(), Promise.race(), etc.

### Requirements

1. Implement `myPromiseAll(promises)` - waits for all to resolve or any to reject
2. Implement `myPromiseRace(promises)` - resolves/rejects with first settled promise
3. Implement `myPromiseAllSettled(promises)` - waits for all to settle
4. Implement `myPromiseAny(promises)` - resolves with first resolved promise
5. Add comprehensive error handling and edge cases

### Starter Code

```javascript
function myPromiseAll(promises) {
  // TODO: Implement Promise.all() equivalent
  // Should resolve with array of results in same order
  // Should reject immediately if any promise rejects
}

function myPromiseRace(promises) {
  // TODO: Implement Promise.race() equivalent
  // Should resolve/reject with first settled promise
}

function myPromiseAllSettled(promises) {
  // TODO: Implement Promise.allSettled() equivalent
  // Should always resolve with array of settlement results
}

function myPromiseAny(promises) {
  // TODO: Implement Promise.any() equivalent
  // Should resolve with first resolved promise
  // Should reject only if all promises reject
}

// Test utilities
function createPromise(value, delay, shouldReject = false) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) {
        reject(new Error(`Error: ${value}`));
      } else {
        resolve(value);
      }
    }, delay);
  });
}

// Test cases
const testPromises = [
  createPromise("A", 1000),
  createPromise("B", 1500),
  createPromise("C", 800)
];

const mixedPromises = [
  createPromise("Success 1", 1000),
  createPromise("Error 1", 1200, true),
  createPromise("Success 2", 800)
];

// TODO: Test all your implementations
console.log("Testing myPromiseAll...");
// Add test cases here
```

### Expected Behavior

- `myPromiseAll` behaves exactly like `Promise.all`
- `myPromiseRace` behaves exactly like `Promise.race`
- `myPromiseAllSettled` behaves exactly like `Promise.allSettled`
- `myPromiseAny` behaves exactly like `Promise.any`
- Handle edge cases (empty array, non-promise values, etc.)

---

## Exercise 5: Advanced Error Handling

### Task

Build a robust data fetching system with multiple error handling strategies.

### Requirements

1. Create a `DataFetcher` class with retry, timeout, and fallback mechanisms
2. Support different types of errors (network, timeout, server, validation)
3. Implement exponential backoff for retries
4. Add circuit breaker pattern for failing services
5. Provide fallback data sources

### Starter Code

```javascript
class DataFetcher {
  constructor(options = {}) {
    this.baseUrl = options.baseUrl || "/api";
    this.timeout = options.timeout || 5000;
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 1000;
    // TODO: Initialize circuit breaker state
  }

  async fetchWithRetry(endpoint, options = {}) {
    // TODO: Implement retry logic with exponential backoff
    // Should retry on network/timeout errors but not on client errors (4xx)
  }

  async fetchWithTimeout(endpoint, timeoutMs) {
    // TODO: Implement timeout wrapper
    // Should reject if request takes longer than timeout
  }

  async fetchWithFallback(endpoint, fallbackData) {
    // TODO: Implement fallback mechanism
    // Should return fallback data if all retry attempts fail
  }

  async fetchWithCircuitBreaker(endpoint) {
    // TODO: Implement circuit breaker pattern
    // Should "open" circuit after too many failures
    // Should "close" circuit after successful requests
  }

  // Simulate different types of API responses
  simulateApiCall(endpoint, behavior = "success") {
    return new Promise((resolve, reject) => {
      const delay = Math.random() * 1000 + 200;

      setTimeout(() => {
        switch (behavior) {
          case "success":
            resolve({ data: `Data from ${endpoint}`, status: 200 });
            break;
          case "network_error":
            reject(new Error("Network error"));
            break;
          case "timeout":
            // Don't resolve or reject (simulates timeout)
            break;
          case "server_error":
            reject(new Error("Internal server error"));
            break;
          case "not_found":
            reject(new Error("Not found"));
            break;
          default:
            resolve({ data: "Default data", status: 200 });
        }
      }, delay);
    });
  }
}

// Usage examples
const fetcher = new DataFetcher({
  timeout: 2000,
  maxRetries: 3,
  retryDelay: 500
});

// TODO: Test different scenarios
async function testErrorHandling() {
  try {
    // Test successful request
    const result1 = await fetcher.fetchWithRetry("/users");
    console.log("Success:", result1);

    // Test retry mechanism
    const result2 = await fetcher.fetchWithRetry("/flaky-endpoint");
    console.log("Retry success:", result2);

    // Test fallback
    const result3 = await fetcher.fetchWithFallback("/failing-endpoint", {
      data: "fallback"
    });
    console.log("Fallback result:", result3);
  } catch (error) {
    console.error("Test failed:", error.message);
  }
}

testErrorHandling();
```

### Expected Behavior

- Successful requests return data immediately
- Retryable errors trigger retry with exponential backoff
- Non-retryable errors (4xx) fail immediately
- Circuit breaker prevents requests to failing services
- Fallback data is returned when all else fails

---

## Exercise 6: Promise-based Animation System

### Task

Create a smooth animation system using Promises for sequencing and coordination.

### Requirements

1. Create animation functions that return Promises
2. Support chaining animations in sequence
3. Support running animations in parallel
4. Add easing functions for smooth motion
5. Handle animation cancellation

### Starter Code

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Promise Animation System</title>
    <style>
      .box {
        width: 50px;
        height: 50px;
        background-color: blue;
        position: absolute;
        transition: none;
      }
      .container {
        position: relative;
        width: 800px;
        height: 400px;
        border: 2px solid #ccc;
        margin: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="box" id="box1"></div>
      <div
        class="box"
        id="box2"
        style="background-color: red; top: 100px;"
      ></div>
      <div
        class="box"
        id="box3"
        style="background-color: green; top: 200px;"
      ></div>
    </div>

    <button onclick="runSequentialAnimation()">Sequential Animation</button>
    <button onclick="runParallelAnimation()">Parallel Animation</button>
    <button onclick="runComplexAnimation()">Complex Animation</button>
    <button onclick="cancelAllAnimations()">Cancel All</button>

    <script>
      class PromiseAnimator {
        constructor() {
          this.activeAnimations = new Set();
        }

        // Animate a CSS property over time
        animate(
          element,
          property,
          fromValue,
          toValue,
          duration,
          easing = "linear"
        ) {
          // TODO: Return a Promise that resolves when animation completes
          // Should update the CSS property smoothly over the duration
          // Should support cancellation
          // Should use requestAnimationFrame for smooth animation
        }

        // Move element to coordinates
        moveTo(element, x, y, duration) {
          // TODO: Animate left and top properties simultaneously
          // Return Promise that resolves when both complete
        }

        // Scale element
        scale(element, fromScale, toScale, duration) {
          // TODO: Animate transform scale property
        }

        // Fade element
        fade(element, fromOpacity, toOpacity, duration) {
          // TODO: Animate opacity property
        }

        // Cancel all active animations
        cancelAll() {
          // TODO: Cancel all running animations
        }

        // Easing functions
        easeInOut(t) {
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }

        easeOut(t) {
          return 1 - Math.pow(1 - t, 3);
        }
      }

      const animator = new PromiseAnimator();

      async function runSequentialAnimation() {
        const box1 = document.getElementById("box1");

        try {
          // TODO: Chain animations in sequence
          // 1. Move right
          // 2. Move down
          // 3. Scale up
          // 4. Fade out
          // 5. Reset position and fade in

          console.log("Sequential animation complete!");
        } catch (error) {
          console.log("Animation cancelled:", error.message);
        }
      }

      async function runParallelAnimation() {
        const box1 = document.getElementById("box1");
        const box2 = document.getElementById("box2");
        const box3 = document.getElementById("box3");

        try {
          // TODO: Run animations in parallel using Promise.all()
          // All boxes should animate simultaneously

          console.log("Parallel animation complete!");
        } catch (error) {
          console.log("Animation cancelled:", error.message);
        }
      }

      async function runComplexAnimation() {
        // TODO: Create a complex choreographed animation
        // Mix sequential and parallel animations
        // Use different easing functions
        // Create a visually interesting pattern
      }

      function cancelAllAnimations() {
        animator.cancelAll();
      }
    </script>
  </body>
</html>
```

### Expected Behavior

- Smooth 60fps animations using requestAnimationFrame
- Promises resolve when animations complete
- Animations can be cancelled and Promises reject appropriately
- Sequential animations wait for each step to complete
- Parallel animations run simultaneously
- Different easing functions create varied motion

---

## Bonus Challenge: Data Processing Pipeline

### Task

Build a complete data processing pipeline using Promises for a real-world scenario.

### Requirements

1. Fetch data from multiple sources (simulate APIs)
2. Validate and clean the data
3. Transform data into required format
4. Aggregate results from multiple sources
5. Handle partial failures gracefully
6. Implement progress tracking
7. Add caching for expensive operations

### Scenario

You're building a dashboard that displays:

- User statistics from user API
- Sales data from sales API
- System metrics from monitoring API
- Weather data from weather API

### Starter Code

```javascript
class DashboardDataProcessor {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  // TODO: Implement all required methods

  async fetchUserStats() {
    // Simulate fetching user statistics
  }

  async fetchSalesData() {
    // Simulate fetching sales data
  }

  async fetchSystemMetrics() {
    // Simulate fetching system metrics
  }

  async fetchWeatherData() {
    // Simulate fetching weather data
  }

  async validateData(data, schema) {
    // Validate data against schema
  }

  async transformData(data, transformer) {
    // Transform data using provided transformer function
  }

  async aggregateData(datasets) {
    // Combine multiple datasets into dashboard format
  }

  async processDashboardData(progressCallback) {
    // Main pipeline that orchestrates everything
    // Should call progressCallback with completion percentage
    // Should handle partial failures (some APIs might be down)
    // Should use caching for performance
    // Should return dashboard data even if some sources fail
  }
}

// Usage
const processor = new DashboardDataProcessor();

processor
  .processDashboardData((progress) => {
    console.log(`Processing: ${progress}% complete`);
  })
  .then((dashboardData) => {
    console.log("Dashboard data ready:", dashboardData);
    displayDashboard(dashboardData);
  })
  .catch((error) => {
    console.error("Failed to load dashboard:", error);
    showErrorMessage("Unable to load dashboard data");
  });

function displayDashboard(data) {
  // TODO: Display the dashboard
}

function showErrorMessage(message) {
  console.error(message);
}
```

### Expected Features

- Progress tracking from 0% to 100%
- Graceful handling of failed API calls
- Caching prevents redundant API calls
- Data validation ensures data quality
- Transformation normalizes data from different sources
- Aggregation combines everything for the dashboard

---

## Testing Your Solutions

For each exercise, make sure to test:

1. **Happy path** - Everything works as expected
2. **Error cases** - Network failures, invalid data, etc.
3. **Edge cases** - Empty arrays, null values, timeouts
4. **Performance** - Large datasets, many concurrent operations
5. **Cancellation** - User can cancel long-running operations

### Testing Framework Template

```javascript
class SimpleTestFramework {
  constructor() {
    this.tests = [];
    this.results = [];
  }

  test(name, testFunction) {
    this.tests.push({ name, testFunction });
  }

  async runAll() {
    console.log(`Running ${this.tests.length} tests...\n`);

    for (const test of this.tests) {
      try {
        const start = Date.now();
        await test.testFunction();
        const duration = Date.now() - start;

        this.results.push({ name: test.name, passed: true, duration });
        console.log(`✅ ${test.name} (${duration}ms)`);
      } catch (error) {
        this.results.push({
          name: test.name,
          passed: false,
          error: error.message
        });
        console.log(`❌ ${test.name}: ${error.message}`);
      }
    }

    this.printSummary();
  }

  printSummary() {
    const passed = this.results.filter((r) => r.passed).length;
    const total = this.results.length;

    console.log(`\n=== Test Summary ===`);
    console.log(`${passed}/${total} tests passed`);

    if (passed < total) {
      console.log("\nFailed tests:");
      this.results
        .filter((r) => !r.passed)
        .forEach((r) => console.log(`- ${r.name}: ${r.error}`));
    }
  }
}

// Example usage
const testFramework = new SimpleTestFramework();

testFramework.test("Promise creation", async () => {
  const promise = new Promise((resolve) => resolve("test"));
  const result = await promise;
  if (result !== "test") throw new Error('Expected "test"');
});

testFramework.runAll();
```

## Submission Guidelines

1. Complete all 6 exercises
2. Test your solutions thoroughly
3. Add comments explaining your implementation choices
4. Include error handling in all solutions
5. Optimize for readability and maintainability

Good luck with your Promise adventures! 🚀
