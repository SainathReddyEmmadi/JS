# Async Fundamentals Exercises 🎯

## Overview

These exercises focus on building a solid foundation in asynchronous JavaScript concepts. Work through these progressively to master the event loop, timing functions, and basic async patterns.

## Exercise 1: Understanding the Event Loop

### 1.1 Execution Order Prediction

**Task**: Predict the output order of the following code, then run it to verify:

```javascript
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

setTimeout(() => console.log("5"), 100);

Promise.resolve().then(() => {
  console.log("6");
  setTimeout(() => console.log("7"), 0);
});

console.log("8");
```

**Expected Learning**: Understanding of call stack, task queue, and microtask queue priorities.

### 1.2 Event Loop Visualization

**Task**: Create a function that demonstrates the event loop behavior:

```javascript
function demonstrateEventLoop() {
  console.log("=== Event Loop Demo ===");

  // Your code here
  // Use setTimeout, Promise.resolve(), and synchronous code
  // to show the execution order clearly

  // Include at least:
  // - 3 synchronous console.logs
  // - 2 setTimeout calls with different delays
  // - 3 Promise.resolve().then() calls
  // - 1 nested Promise inside a setTimeout
}

demonstrateEventLoop();
```

## Exercise 2: Timer Functions Mastery

### 2.1 Debounce Implementation

**Task**: Implement a debounce function that delays execution until after a specified time has passed:

```javascript
function debounce(func, delay) {
  // Your implementation here
  // Should return a new function that delays the execution
  // of 'func' by 'delay' milliseconds
}

// Test your implementation
const debouncedLog = debounce(console.log, 1000);
debouncedLog("First call");
debouncedLog("Second call"); // Only this should execute after 1 second
```

### 2.2 Throttle Implementation

**Task**: Create a throttle function that limits how often a function can be called:

```javascript
function throttle(func, limit) {
  // Your implementation here
  // Should ensure 'func' is called at most once per 'limit' milliseconds
}

// Test with a function that logs the current time
const throttledLogger = throttle(() => console.log(Date.now()), 1000);

// This should log only every 1000ms, even if called more frequently
setInterval(throttledLogger, 100);
```

### 2.3 Custom Timer Utilities

**Task**: Create a utility library for advanced timing functions:

```javascript
class TimerUtils {
  // Delay execution by specified milliseconds
  static delay(ms) {
    // Return a Promise that resolves after 'ms' milliseconds
  }

  // Execute a function after a delay
  static delayedExecution(func, delay) {
    // Execute 'func' after 'delay' milliseconds
    // Return a Promise that resolves with the function's result
  }

  // Create a timeout that can be cancelled
  static cancellableTimeout(func, delay) {
    // Return an object with:
    // - promise: Promise that resolves when timeout completes
    // - cancel: Function to cancel the timeout
  }

  // Retry a function with delays between attempts
  static retryWithDelay(func, maxAttempts, delay) {
    // Retry 'func' up to 'maxAttempts' times
    // Wait 'delay' ms between attempts
    // Return Promise that resolves with result or rejects after all attempts
  }
}

// Test your implementations
async function testTimerUtils() {
  console.log("Testing TimerUtils...");

  // Test delay
  console.log("Before delay");
  await TimerUtils.delay(1000);
  console.log("After 1 second delay");

  // Test delayedExecution
  const result = await TimerUtils.delayedExecution(() => "Hello!", 500);
  console.log("Delayed result:", result);

  // Test cancellableTimeout
  const { promise, cancel } = TimerUtils.cancellableTimeout(
    () => "Timeout!",
    2000
  );
  setTimeout(cancel, 1000); // Cancel after 1 second

  try {
    const timeoutResult = await promise;
    console.log("Timeout completed:", timeoutResult);
  } catch (error) {
    console.log("Timeout was cancelled");
  }
}
```

## Exercise 3: Callback Patterns

### 3.1 Callback Hell Demonstration

**Task**: Create a realistic example of callback hell, then refactor it:

```javascript
// Original callback hell version
function fetchUserDataCallbackHell(userId, callback) {
  // Simulate fetching user info
  setTimeout(() => {
    const user = { id: userId, name: "John Doe", profileId: 123 };

    // Fetch user profile
    setTimeout(() => {
      const profile = { id: 123, bio: "Software Developer", postsCount: 50 };

      // Fetch user posts
      setTimeout(() => {
        const posts = [
          { id: 1, title: "First Post", likes: 10 },
          { id: 2, title: "Second Post", likes: 25 }
        ];

        // Fetch post comments
        setTimeout(() => {
          const comments = [
            { postId: 1, comment: "Great post!" },
            { postId: 2, comment: "Very informative" }
          ];

          callback(null, { user, profile, posts, comments });
        }, 300);
      }, 300);
    }, 300);
  }, 300);
}

// Refactored version - Your task
function fetchUserDataRefactored(userId) {
  // Refactor the above using better callback patterns
  // Consider using:
  // - Named functions instead of anonymous callbacks
  // - Error handling at each level
  // - Separation of concerns
}
```

### 3.2 Error-First Callback Pattern

**Task**: Implement functions following the Node.js error-first callback convention:

```javascript
// File system simulation with error-first callbacks
class FileSystemSim {
  static readFile(filename, callback) {
    // Simulate file reading with random success/failure
    // Follow error-first callback pattern: callback(error, data)

    setTimeout(() => {
      if (Math.random() < 0.8) {
        // 80% success rate
        callback(null, `Contents of ${filename}`);
      } else {
        callback(new Error(`Failed to read ${filename}`), null);
      }
    }, Math.random() * 1000);
  }

  static writeFile(filename, data, callback) {
    // Similar implementation for writing files
  }

  static deleteFile(filename, callback) {
    // Similar implementation for deleting files
  }
}

// Your task: Create a function that uses these file operations
function processFiles(filenames, callback) {
  // Read all files, process their contents, write results to new files
  // Handle errors appropriately using error-first callback pattern
  // Call the final callback with error-first convention
}

// Test the implementation
processFiles(["file1.txt", "file2.txt", "file3.txt"], (error, results) => {
  if (error) {
    console.error("Error processing files:", error);
  } else {
    console.log("Files processed successfully:", results);
  }
});
```

## Exercise 4: Basic Promise Creation

### 4.1 Promise Constructor Practice

**Task**: Create Promises using the Promise constructor for various scenarios:

```javascript
// 1. Create a Promise that resolves after a random delay (1-3 seconds)
function randomDelay() {
  // Your implementation here
}

// 2. Create a Promise that has a 50% chance of resolving or rejecting
function coinFlip() {
  // Your implementation here
  // Resolve with 'heads' or reject with 'tails'
}

// 3. Create a Promise that simulates a network request
function simulateNetworkRequest(url) {
  // Your implementation here
  // Simulate different response times and occasional failures
  // Resolve with mock data or reject with error
}

// 4. Create a Promise that times out after a specified duration
function promiseWithTimeout(promise, timeoutMs) {
  // Your implementation here
  // Return a new Promise that rejects if the original doesn't resolve in time
}

// Test your implementations
async function testPromises() {
  try {
    console.log("Testing random delay...");
    await randomDelay();
    console.log("Random delay completed");

    console.log("Testing coin flip...");
    const result = await coinFlip();
    console.log("Coin flip result:", result);

    console.log("Testing network request...");
    const data = await simulateNetworkRequest("https://api.example.com/data");
    console.log("Network data:", data);

    console.log("Testing timeout...");
    const slowPromise = new Promise((resolve) => setTimeout(resolve, 5000));
    await promiseWithTimeout(slowPromise, 2000);
  } catch (error) {
    console.error("Promise error:", error);
  }
}
```

### 4.2 Promisify Callback Functions

**Task**: Convert callback-based functions to Promise-based functions:

```javascript
// Original callback-based functions
function callbackBasedFunction(input, callback) {
  setTimeout(() => {
    if (input < 0) {
      callback(new Error("Input must be positive"), null);
    } else {
      callback(null, input * 2);
    }
  }, 1000);
}

function multipleCallbackFunction(a, b, c, callback) {
  setTimeout(() => {
    if (a + b + c > 100) {
      callback(new Error("Sum too large"), null);
    } else {
      callback(null, { sum: a + b + c, average: (a + b + c) / 3 });
    }
  }, 500);
}

// Your task: Create promisified versions
function promisify(callbackFunction) {
  // Generic promisify function
  // Should work with any error-first callback function
}

// Use your promisify function
const promisifiedFunction = promisify(callbackBasedFunction);
const promisifiedMultiple = promisify(multipleCallbackFunction);

// Test the promisified functions
async function testPromisified() {
  try {
    const result1 = await promisifiedFunction(5);
    console.log("Result 1:", result1);

    const result2 = await promisifiedMultiple(10, 20, 30);
    console.log("Result 2:", result2);
  } catch (error) {
    console.error("Promisified error:", error);
  }
}
```

## Exercise 5: Async Control Flow

### 5.1 Sequential vs Parallel Execution

**Task**: Implement functions that demonstrate different execution patterns:

```javascript
// Simulate async operations with different durations
function asyncOperation(id, duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Operation ${id} completed after ${duration}ms`);
      resolve(`Result ${id}`);
    }, duration);
  });
}

// 1. Sequential execution - operations run one after another
async function runSequentially() {
  console.log("=== Sequential Execution ===");
  const start = Date.now();

  // Your implementation here
  // Run 3 async operations sequentially
  // Each should wait for the previous to complete

  const end = Date.now();
  console.log(`Sequential execution took ${end - start}ms`);
}

// 2. Parallel execution - operations run simultaneously
async function runInParallel() {
  console.log("=== Parallel Execution ===");
  const start = Date.now();

  // Your implementation here
  // Run 3 async operations in parallel
  // All should start at the same time

  const end = Date.now();
  console.log(`Parallel execution took ${end - start}ms`);
}

// 3. Mixed execution - some sequential, some parallel
async function runMixed() {
  console.log("=== Mixed Execution ===");

  // Your implementation here
  // Run operations 1 and 2 in parallel
  // Then run operation 3 after both complete
  // Finally run operations 4 and 5 in parallel
}

// Test all patterns
async function testExecutionPatterns() {
  await runSequentially();
  await runInParallel();
  await runMixed();
}
```

### 5.2 Async Iterator Pattern

**Task**: Create an async iterator for processing data streams:

```javascript
class AsyncDataStream {
  constructor(data, delay = 1000) {
    this.data = data;
    this.delay = delay;
    this.index = 0;
  }

  // Implement async iterator protocol
  [Symbol.asyncIterator]() {
    // Your implementation here
    // Should yield each data item after a delay
  }

  // Method to get next item (for manual iteration)
  async next() {
    // Your implementation here
    // Return { value, done } object
  }
}

// Test your async iterator
async function testAsyncIterator() {
  const stream = new AsyncDataStream(["A", "B", "C", "D", "E"], 500);

  console.log("Using for-await-of loop:");
  for await (const item of stream) {
    console.log("Received:", item);
  }

  console.log("Using manual iteration:");
  const stream2 = new AsyncDataStream([1, 2, 3, 4, 5], 300);
  let result = await stream2.next();
  while (!result.done) {
    console.log("Manual:", result.value);
    result = await stream2.next();
  }
}
```

## Exercise 6: Error Handling Fundamentals

### 6.1 Promise Error Handling

**Task**: Practice different error handling patterns with Promises:

```javascript
// Functions that may succeed or fail
function unreliableAsync(successRate = 0.7) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < successRate) {
        resolve("Success!");
      } else {
        reject(new Error("Operation failed"));
      }
    }, 1000);
  });
}

// 1. Handle errors with .catch()
async function handleWithCatch() {
  console.log("=== Error Handling with .catch() ===");

  // Your implementation here
  // Use .catch() to handle errors
  // Try calling unreliableAsync() multiple times
}

// 2. Handle errors with try/catch
async function handleWithTryCatch() {
  console.log("=== Error Handling with try/catch ===");

  // Your implementation here
  // Use try/catch blocks to handle errors
  // Show how to handle multiple operations
}

// 3. Error recovery strategies
async function errorRecoveryStrategies() {
  console.log("=== Error Recovery Strategies ===");

  // Your implementation here
  // Implement retry logic
  // Implement fallback mechanisms
  // Show how to provide default values on error
}
```

### 6.2 Custom Error Types

**Task**: Create custom error types for better error handling:

```javascript
// Define custom error classes
class NetworkError extends Error {
  constructor(message, statusCode) {
    // Your implementation here
  }
}

class ValidationError extends Error {
  constructor(message, field) {
    // Your implementation here
  }
}

class TimeoutError extends Error {
  constructor(message, duration) {
    // Your implementation here
  }
}

// Functions that throw different types of errors
async function riskyOperation(input) {
  // Simulate different error conditions based on input
  // Throw appropriate custom errors

  if (typeof input !== "string") {
    throw new ValidationError("Input must be a string", "input");
  }

  if (input.length > 100) {
    throw new ValidationError("Input too long", "input");
  }

  // Simulate network request
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (Math.random() < 0.3) {
    throw new NetworkError("Request failed", 500);
  }

  return `Processed: ${input}`;
}

// Error handling with custom error types
async function handleCustomErrors(input) {
  try {
    const result = await riskyOperation(input);
    console.log("Success:", result);
    return result;
  } catch (error) {
    // Your implementation here
    // Handle different error types appropriately
    // Show specific error messages based on error type
  }
}

// Test custom error handling
async function testCustomErrors() {
  await handleCustomErrors("valid input");
  await handleCustomErrors(123); // ValidationError
  await handleCustomErrors("a".repeat(150)); // ValidationError
  await handleCustomErrors("network test"); // Possible NetworkError
}
```

## Self-Assessment Questions

After completing these exercises, you should be able to answer:

1. **Event Loop Understanding**

   - What is the difference between the task queue and microtask queue?
   - Why do Promises execute before setTimeout callbacks?
   - How does the event loop handle nested async operations?

2. **Callback Patterns**

   - What are the problems with callback hell?
   - How does the error-first callback pattern work?
   - When would you choose callbacks over Promises?

3. **Promise Fundamentals**

   - What are the three states of a Promise?
   - How do you handle errors in Promise chains?
   - What's the difference between sequential and parallel Promise execution?

4. **Error Handling**
   - How do you properly handle errors in async functions?
   - When should you use custom error types?
   - What are effective error recovery strategies?

## Next Steps

Once you've mastered these fundamentals:

1. Move on to **Promise Challenges** for more advanced Promise patterns
2. Practice **API Integration** exercises for real-world applications
3. Explore **Performance Optimization** patterns for efficient async code

Remember: Async programming is about managing time and uncertainty. These exercises build the foundation for handling both effectively! 🚀
