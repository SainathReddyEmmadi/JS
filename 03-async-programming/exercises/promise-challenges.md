# Promise Challenges 🎪

## Overview

These advanced Promise exercises will challenge your understanding of Promise patterns, error handling, and complex async flows. Each challenge builds upon previous concepts and introduces more sophisticated scenarios.

## Challenge 1: Promise Utilities Library

### 1.1 Advanced Promise.all Variants

**Task**: Implement enhanced versions of Promise utility methods:

```javascript
class PromiseUtils {
  // Promise.all that resolves with partial results on some failures
  static allSettledWithDetails(promises) {
    // Your implementation here
    // Return an object with:
    // - fulfilled: array of successful results
    // - rejected: array of error details with indices
    // - results: complete array with successes and failures marked
  }

  // Promise.all with a limit on concurrent executions
  static allWithConcurrencyLimit(promises, limit) {
    // Your implementation here
    // Execute promises with maximum 'limit' concurrent operations
    // Return array of results in original order
  }

  // Promise.race with timeout and cancellation
  static raceWithTimeout(promises, timeoutMs) {
    // Your implementation here
    // Race the promises but timeout after timeoutMs
    // Return object: { result, winner: 'promise'|'timeout', index? }
  }

  // Promise.all that fails fast but continues others
  static allContinueOnError(promises) {
    // Your implementation here
    // If any promise fails, immediately reject but let others continue
    // Clean up pending promises appropriately
  }
}

// Test your implementations
async function testPromiseUtils() {
  const fastPromise = () =>
    new Promise((resolve) => setTimeout(() => resolve("fast"), 100));
  const slowPromise = () =>
    new Promise((resolve) => setTimeout(() => resolve("slow"), 2000));
  const failingPromise = () =>
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("failed")), 500)
    );

  console.log("=== Testing Promise Utilities ===");

  // Test allSettledWithDetails
  try {
    const result1 = await PromiseUtils.allSettledWithDetails([
      fastPromise(),
      failingPromise(),
      slowPromise()
    ]);
    console.log("allSettledWithDetails:", result1);
  } catch (error) {
    console.error("Error in allSettledWithDetails:", error);
  }

  // Test allWithConcurrencyLimit
  try {
    console.log("Testing concurrency limit (max 2 concurrent)...");
    const start = Date.now();
    const promises = Array(5)
      .fill()
      .map(
        (_, i) => () =>
          new Promise((resolve) =>
            setTimeout(() => {
              console.log(`Promise ${i} completed at ${Date.now() - start}ms`);
              resolve(i);
            }, 1000)
          )
      );

    const result2 = await PromiseUtils.allWithConcurrencyLimit(promises, 2);
    console.log("Concurrency limited result:", result2);
  } catch (error) {
    console.error("Error in allWithConcurrencyLimit:", error);
  }

  // Test raceWithTimeout
  try {
    const result3 = await PromiseUtils.raceWithTimeout(
      [slowPromise(), fastPromise()],
      1500
    );
    console.log("raceWithTimeout:", result3);
  } catch (error) {
    console.error("Error in raceWithTimeout:", error);
  }
}
```

### 1.2 Promise Retry Mechanisms

**Task**: Create sophisticated retry logic with different strategies:

```javascript
class RetryUtils {
  // Basic retry with exponential backoff
  static async retryWithBackoff(
    operation,
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000
  ) {
    // Your implementation here
    // Retry 'operation' with exponentially increasing delays
    // Cap delay at maxDelay
    // Return result or throw after all attempts fail
  }

  // Retry with jitter to avoid thundering herd
  static async retryWithJitter(operation, maxAttempts = 3, baseDelay = 1000) {
    // Your implementation here
    // Add random jitter to delays: delay = baseDelay * attempt + random(0, 1000)
    // Helps distribute load when multiple clients retry simultaneously
  }

  // Conditional retry based on error type
  static async retryConditional(
    operation,
    shouldRetry,
    maxAttempts = 3,
    delay = 1000
  ) {
    // Your implementation here
    // Only retry if shouldRetry(error) returns true
    // shouldRetry is a function that takes an error and returns boolean
  }

  // Retry with circuit breaker pattern
  static createCircuitBreaker(
    operation,
    failureThreshold = 5,
    timeoutMs = 60000
  ) {
    // Your implementation here
    // Return a function that:
    // - Tracks failure count
    // - Opens circuit after failureThreshold failures
    // - Prevents calls when circuit is open
    // - Allows test calls after timeout
    // - Closes circuit on successful test call

    let failureCount = 0;
    let lastFailureTime = 0;
    let circuitOpen = false;

    return async function circuitBreakerOperation(...args) {
      // Implement circuit breaker logic here
    };
  }
}

// Error types for testing
class RetryableError extends Error {
  constructor(message) {
    super(message);
    this.name = "RetryableError";
    this.retryable = true;
  }
}

class NonRetryableError extends Error {
  constructor(message) {
    super(message);
    this.name = "NonRetryableError";
    this.retryable = false;
  }
}

// Test operations
function unreliableOperation(successRate = 0.3) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < successRate) {
        resolve("Operation succeeded!");
      } else {
        const isRetryable = Math.random() < 0.7;
        reject(
          isRetryable
            ? new RetryableError("Temporary failure")
            : new NonRetryableError("Permanent failure")
        );
      }
    }, 200);
  });
}

// Test retry mechanisms
async function testRetryMechanisms() {
  console.log("=== Testing Retry Mechanisms ===");

  // Test basic retry with backoff
  try {
    console.log("Testing retry with backoff...");
    const result1 = await RetryUtils.retryWithBackoff(
      () => unreliableOperation(0.4),
      4,
      500
    );
    console.log("Backoff retry succeeded:", result1);
  } catch (error) {
    console.log("Backoff retry failed after all attempts:", error.message);
  }

  // Test conditional retry
  try {
    console.log("Testing conditional retry...");
    const result2 = await RetryUtils.retryConditional(
      () => unreliableOperation(0.4),
      (error) => error.retryable, // Only retry RetryableErrors
      3,
      1000
    );
    console.log("Conditional retry succeeded:", result2);
  } catch (error) {
    console.log("Conditional retry failed:", error.message);
  }

  // Test circuit breaker
  console.log("Testing circuit breaker...");
  const circuitBreakerOp = RetryUtils.createCircuitBreaker(
    () => unreliableOperation(0.1), // Very low success rate
    3, // Open after 3 failures
    5000 // Test again after 5 seconds
  );

  // Make multiple calls to test circuit breaker behavior
  for (let i = 0; i < 10; i++) {
    try {
      const result = await circuitBreakerOp();
      console.log(`Circuit breaker call ${i} succeeded:`, result);
    } catch (error) {
      console.log(`Circuit breaker call ${i} failed:`, error.message);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}
```

## Challenge 2: Async Data Processing Pipeline

### 2.1 Stream Processing with Promises

**Task**: Create a data processing pipeline that handles async transformations:

```javascript
class AsyncPipeline {
  constructor() {
    this.steps = [];
  }

  // Add a processing step to the pipeline
  pipe(asyncFunction) {
    // Your implementation here
    // asyncFunction should be: (data) => Promise<transformedData>
    this.steps.push(asyncFunction);
    return this; // For method chaining
  }

  // Add a parallel processing step
  pipeParallel(asyncFunctions) {
    // Your implementation here
    // Run all functions in parallel with the same input
    // Combine results into an array
    return this;
  }

  // Add a conditional step
  pipeIf(condition, asyncFunction) {
    // Your implementation here
    // Only execute asyncFunction if condition(data) returns true
    return this;
  }

  // Add error handling step
  pipeError(errorHandler) {
    // Your implementation here
    // errorHandler: (error, data) => Promise<recoveredData>
    return this;
  }

  // Execute the pipeline
  async process(initialData) {
    // Your implementation here
    // Process data through all steps
    // Handle errors appropriately
    // Return final result
  }

  // Process multiple data items concurrently
  async processAll(dataArray, concurrencyLimit = 3) {
    // Your implementation here
    // Process each item through the pipeline
    // Limit concurrent processing
    // Return array of results
  }
}

// Example processing functions
async function fetchUserData(userId) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 200));
  if (Math.random() < 0.1) throw new Error("User not found");
  return {
    id: userId,
    name: `User ${userId}`,
    email: `user${userId}@example.com`
  };
}

async function validateUser(user) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  if (!user.email.includes("@")) throw new Error("Invalid email");
  return { ...user, validated: true };
}

async function enrichUserData(user) {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return {
    ...user,
    preferences: { theme: "dark", language: "en" },
    lastLogin: new Date()
  };
}

async function calculateUserScore(user) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { ...user, score: Math.floor(Math.random() * 100) };
}

// Test the pipeline
async function testAsyncPipeline() {
  console.log("=== Testing Async Pipeline ===");

  const pipeline = new AsyncPipeline()
    .pipe(fetchUserData)
    .pipe(validateUser)
    .pipeIf((user) => user.validated, enrichUserData)
    .pipe(calculateUserScore)
    .pipeError(async (error, data) => {
      console.log("Pipeline error handled:", error.message);
      return { error: error.message, originalData: data };
    });

  // Test single item processing
  try {
    console.log("Processing single user...");
    const result = await pipeline.process(1);
    console.log("Single user result:", result);
  } catch (error) {
    console.error("Pipeline error:", error);
  }

  // Test batch processing
  try {
    console.log("Processing multiple users...");
    const userIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const results = await pipeline.processAll(userIds, 3);
    console.log("Batch processing results:", results.length, "users processed");
    console.log("Sample results:", results.slice(0, 3));
  } catch (error) {
    console.error("Batch processing error:", error);
  }
}
```

### 2.2 Async Data Aggregation

**Task**: Build a system that aggregates data from multiple async sources:

```javascript
class DataAggregator {
  constructor() {
    this.sources = new Map();
    this.cache = new Map();
    this.cacheTimeout = 60000; // 1 minute
  }

  // Register a data source
  registerSource(name, fetchFunction, options = {}) {
    // Your implementation here
    // fetchFunction: () => Promise<data>
    // options: { cacheable: boolean, timeout: number, retries: number }
    this.sources.set(name, { fetchFunction, options });
  }

  // Fetch data from a specific source
  async fetchFromSource(sourceName) {
    // Your implementation here
    // Handle caching, timeouts, retries based on source options
    // Return { source: string, data: any, timestamp: number, fromCache: boolean }
  }

  // Fetch data from multiple sources in parallel
  async fetchFromSources(sourceNames, options = {}) {
    // Your implementation here
    // options: { timeout: number, allowPartialResults: boolean }
    // Return map of results with source names as keys
  }

  // Aggregate data with custom aggregation function
  async aggregate(sourceNames, aggregateFunction, options = {}) {
    // Your implementation here
    // Fetch from all sources, then apply aggregateFunction
    // aggregateFunction: (dataMap) => aggregatedResult
    // Handle cases where some sources fail
  }

  // Stream aggregated data with periodic updates
  async *streamAggregatedData(
    sourceNames,
    aggregateFunction,
    intervalMs = 5000
  ) {
    // Your implementation here
    // Yield aggregated data periodically
    // Handle source failures gracefully
    // Allow cancellation
  }
}

// Mock data sources
async function fetchStockPrices() {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (Math.random() < 0.05) throw new Error("Stock API unavailable");
  return {
    AAPL: 150 + Math.random() * 10,
    GOOGL: 2800 + Math.random() * 100,
    MSFT: 300 + Math.random() * 20
  };
}

async function fetchCurrencyRates() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (Math.random() < 0.1) throw new Error("Currency API timeout");
  return {
    EUR: 1.1 + Math.random() * 0.1,
    GBP: 1.3 + Math.random() * 0.1,
    JPY: 0.009 + Math.random() * 0.001
  };
}

async function fetchCryptoPrices() {
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (Math.random() < 0.08) throw new Error("Crypto API rate limited");
  return {
    BTC: 45000 + Math.random() * 5000,
    ETH: 3000 + Math.random() * 500,
    ADA: 1.2 + Math.random() * 0.3
  };
}

async function fetchMarketNews() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    headlines: [
      "Market opens higher",
      "Tech stocks surge",
      "Economic indicators positive"
    ],
    sentiment: Math.random() > 0.5 ? "positive" : "negative"
  };
}

// Test the aggregator
async function testDataAggregator() {
  console.log("=== Testing Data Aggregator ===");

  const aggregator = new DataAggregator();

  // Register sources
  aggregator.registerSource("stocks", fetchStockPrices, {
    cacheable: true,
    timeout: 1000,
    retries: 2
  });
  aggregator.registerSource("currencies", fetchCurrencyRates, {
    cacheable: true,
    timeout: 2000,
    retries: 3
  });
  aggregator.registerSource("crypto", fetchCryptoPrices, {
    cacheable: false,
    timeout: 1500,
    retries: 1
  });
  aggregator.registerSource("news", fetchMarketNews, {
    cacheable: true,
    timeout: 500,
    retries: 1
  });

  // Test single source fetch
  try {
    console.log("Fetching from single source...");
    const stockData = await aggregator.fetchFromSource("stocks");
    console.log("Stock data:", stockData);
  } catch (error) {
    console.error("Single source error:", error);
  }

  // Test multiple source fetch
  try {
    console.log("Fetching from multiple sources...");
    const multiData = await aggregator.fetchFromSources([
      "stocks",
      "currencies",
      "crypto"
    ]);
    console.log("Multi-source data keys:", Object.keys(multiData));
  } catch (error) {
    console.error("Multi-source error:", error);
  }

  // Test aggregation
  try {
    console.log("Testing aggregation...");
    const marketSummary = await aggregator.aggregate(
      ["stocks", "currencies", "crypto", "news"],
      (dataMap) => {
        return {
          totalAssets:
            Object.keys(dataMap.stocks?.data || {}).length +
            Object.keys(dataMap.currencies?.data || {}).length +
            Object.keys(dataMap.crypto?.data || {}).length,
          sentiment: dataMap.news?.data?.sentiment || "unknown",
          timestamp: new Date(),
          sources: Object.keys(dataMap)
        };
      }
    );
    console.log("Market summary:", marketSummary);
  } catch (error) {
    console.error("Aggregation error:", error);
  }

  // Test streaming (run for 15 seconds)
  console.log("Testing streaming aggregation...");
  const stream = aggregator.streamAggregatedData(
    ["stocks", "crypto"],
    (dataMap) => ({
      avgStockPrice:
        Object.values(dataMap.stocks?.data || {}).reduce((a, b) => a + b, 0) /
        3,
      avgCryptoPrice:
        Object.values(dataMap.crypto?.data || {}).reduce((a, b) => a + b, 0) /
        3,
      timestamp: new Date()
    }),
    3000 // Update every 3 seconds
  );

  const streamTimeout = setTimeout(() => {
    console.log("Stopping stream...");
    stream.return(); // Close the async generator
  }, 15000);

  try {
    for await (const aggregatedData of stream) {
      console.log("Streamed data:", aggregatedData);
    }
  } catch (error) {
    console.error("Streaming error:", error);
  } finally {
    clearTimeout(streamTimeout);
  }
}
```

## Challenge 3: Advanced Error Recovery

### 3.1 Sophisticated Error Handling Patterns

**Task**: Implement advanced error recovery mechanisms:

```javascript
class ErrorRecoveryManager {
  constructor() {
    this.recoveryStrategies = new Map();
    this.fallbackChains = new Map();
    this.errorHistory = [];
  }

  // Register a recovery strategy for specific error types
  registerStrategy(errorPattern, recoveryFunction) {
    // Your implementation here
    // errorPattern: function that returns true if error matches
    // recoveryFunction: async function that attempts recovery
    this.recoveryStrategies.set(errorPattern, recoveryFunction);
  }

  // Register a fallback chain for operations
  registerFallbackChain(operationName, fallbackFunctions) {
    // Your implementation here
    // fallbackFunctions: array of async functions to try in order
    this.fallbackChains.set(operationName, fallbackFunctions);
  }

  // Execute operation with automatic error recovery
  async executeWithRecovery(operation, context = {}) {
    // Your implementation here
    // Try operation, if it fails, attempt recovery strategies
    // Log errors and recovery attempts
    // Return { result, recoveryAttempted, errors }
  }

  // Execute with fallback chain
  async executeWithFallbacks(operationName, initialArgs) {
    // Your implementation here
    // Try main operation, then fallbacks in order
    // Return first successful result
    // Throw only if all options fail
  }

  // Analyze error patterns and suggest optimizations
  analyzeErrorPatterns() {
    // Your implementation here
    // Return insights about common errors and recovery success rates
  }
}

// Example error types and operations
class NetworkError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "NetworkError";
    this.statusCode = statusCode;
  }
}

class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

class RateLimitError extends Error {
  constructor(message, retryAfter) {
    super(message);
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

// Mock operations that might fail
async function primaryDataFetch(query) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const random = Math.random();

  if (random < 0.3) {
    throw new NetworkError("Primary service unavailable", 503);
  } else if (random < 0.4) {
    throw new RateLimitError("Rate limit exceeded", 5000);
  } else if (random < 0.5) {
    throw new ValidationError("Invalid query format", "query");
  }

  return {
    source: "primary",
    data: `Results for: ${query}`,
    timestamp: Date.now()
  };
}

async function secondaryDataFetch(query) {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (Math.random() < 0.2) {
    throw new NetworkError("Secondary service timeout", 408);
  }
  return {
    source: "secondary",
    data: `Backup results for: ${query}`,
    timestamp: Date.now()
  };
}

async function cachedDataFetch(query) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return {
    source: "cache",
    data: `Cached results for: ${query}`,
    timestamp: Date.now() - 3600000
  };
}

// Test error recovery
async function testErrorRecovery() {
  console.log("=== Testing Error Recovery ===");

  const recoveryManager = new ErrorRecoveryManager();

  // Register recovery strategies
  recoveryManager.registerStrategy(
    (error) => error instanceof RateLimitError,
    async (error, operation, context) => {
      console.log(`Rate limited, waiting ${error.retryAfter}ms...`);
      await new Promise((resolve) => setTimeout(resolve, error.retryAfter));
      return await operation(context.args);
    }
  );

  recoveryManager.registerStrategy(
    (error) => error instanceof NetworkError && error.statusCode >= 500,
    async (error, operation, context) => {
      console.log("Server error, trying with exponential backoff...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await operation(context.args);
    }
  );

  recoveryManager.registerStrategy(
    (error) => error instanceof ValidationError,
    async (error, operation, context) => {
      console.log("Validation error, sanitizing input...");
      const sanitizedArgs = context.args.replace(/[^a-zA-Z0-9\s]/g, "");
      return await operation(sanitizedArgs);
    }
  );

  // Register fallback chain
  recoveryManager.registerFallbackChain("dataFetch", [
    primaryDataFetch,
    secondaryDataFetch,
    cachedDataFetch
  ]);

  // Test recovery mechanisms
  for (let i = 0; i < 5; i++) {
    try {
      console.log(`\n--- Test ${i + 1} ---`);

      // Test with recovery
      const result1 = await recoveryManager.executeWithRecovery(
        primaryDataFetch,
        { args: "test query!" }
      );
      console.log("Recovery result:", result1);

      // Test with fallbacks
      const result2 = await recoveryManager.executeWithFallbacks(
        "dataFetch",
        "test query"
      );
      console.log("Fallback result:", result2);
    } catch (error) {
      console.error("All recovery attempts failed:", error.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Analyze patterns
  console.log("\n--- Error Pattern Analysis ---");
  const analysis = recoveryManager.analyzeErrorPatterns();
  console.log("Error analysis:", analysis);
}
```

## Challenge 4: Promise-Based State Management

### 4.1 Async State Machine

**Task**: Create a Promise-based state machine for complex async workflows:

```javascript
class AsyncStateMachine {
  constructor(initialState, states) {
    this.currentState = initialState;
    this.states = states; // Map of state definitions
    this.history = [initialState];
    this.listeners = new Map();
    this.context = {};
  }

  // Define a state with transitions and handlers
  defineState(stateName, definition) {
    // Your implementation here
    // definition: {
    //   onEnter: async (context) => void,
    //   onExit: async (context) => void,
    //   transitions: Map<event, targetState | function>
    // }
    this.states.set(stateName, definition);
  }

  // Trigger a state transition
  async transition(event, data = {}) {
    // Your implementation here
    // Find valid transition for current state and event
    // Execute onExit for current state
    // Execute onEnter for new state
    // Update context with data
    // Notify listeners
    // Return transition result
  }

  // Add state change listener
  onStateChange(listener) {
    // Your implementation here
    const id = Date.now() + Math.random();
    this.listeners.set(id, listener);
    return () => this.listeners.delete(id); // Return unsubscribe function
  }

  // Get current state info
  getState() {
    return {
      current: this.currentState,
      context: { ...this.context },
      history: [...this.history]
    };
  }

  // Execute a workflow (sequence of events)
  async executeWorkflow(events) {
    // Your implementation here
    // Execute events in sequence
    // Handle errors and allow rollback
    // Return workflow execution result
  }
}

// Example: Order processing state machine
async function testOrderStateMachine() {
  console.log("=== Testing Order Processing State Machine ===");

  const orderStateMachine = new AsyncStateMachine("pending", new Map());

  // Define states
  orderStateMachine.defineState("pending", {
    onEnter: async (context) => {
      console.log("Order created:", context.orderId);
    },
    transitions: new Map([
      ["validate", "validating"],
      ["cancel", "cancelled"]
    ])
  });

  orderStateMachine.defineState("validating", {
    onEnter: async (context) => {
      console.log("Validating order:", context.orderId);
      // Simulate validation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (Math.random() < 0.8) {
        context.validationResult = "success";
      } else {
        context.validationResult = "failed";
        throw new Error("Validation failed");
      }
    },
    transitions: new Map([
      ["validation_success", "processing"],
      ["validation_failed", "rejected"]
    ])
  });

  orderStateMachine.defineState("processing", {
    onEnter: async (context) => {
      console.log("Processing payment for order:", context.orderId);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (Math.random() < 0.9) {
        context.paymentResult = "success";
      } else {
        throw new Error("Payment failed");
      }
    },
    transitions: new Map([
      ["payment_success", "fulfilled"],
      ["payment_failed", "payment_retry"]
    ])
  });

  orderStateMachine.defineState("fulfilled", {
    onEnter: async (context) => {
      console.log("Order fulfilled successfully:", context.orderId);
      context.fulfillmentTime = new Date();
    },
    transitions: new Map()
  });

  orderStateMachine.defineState("rejected", {
    onEnter: async (context) => {
      console.log("Order rejected:", context.orderId, context.rejectionReason);
    },
    transitions: new Map()
  });

  orderStateMachine.defineState("cancelled", {
    onEnter: async (context) => {
      console.log("Order cancelled:", context.orderId);
    },
    transitions: new Map()
  });

  // Add state change listener
  const unsubscribe = orderStateMachine.onStateChange(
    (oldState, newState, context) => {
      console.log(`State changed: ${oldState} -> ${newState}`);
    }
  );

  // Test order processing workflow
  try {
    // Set initial context
    orderStateMachine.context = {
      orderId: "ORD-123",
      items: ["item1", "item2"]
    };

    // Execute workflow
    await orderStateMachine.transition("validate");

    if (orderStateMachine.context.validationResult === "success") {
      await orderStateMachine.transition("validation_success");

      if (orderStateMachine.context.paymentResult === "success") {
        await orderStateMachine.transition("payment_success");
      } else {
        await orderStateMachine.transition("payment_failed");
      }
    } else {
      await orderStateMachine.transition("validation_failed", {
        rejectionReason: "Invalid items"
      });
    }

    console.log("Final state:", orderStateMachine.getState());
  } catch (error) {
    console.error("Workflow error:", error.message);
    console.log("Current state:", orderStateMachine.getState());
  } finally {
    unsubscribe();
  }
}
```

## Self-Assessment Questions

After completing these challenges, you should be able to answer:

1. **Advanced Promise Patterns**

   - How do you implement Promise.all with concurrency limits?
   - What's the difference between Promise.allSettled and custom error handling?
   - How do circuit breakers improve system resilience?

2. **Async Data Processing**

   - How do you build composable async pipelines?
   - What strategies exist for handling partial failures in data aggregation?
   - How do you implement backpressure in async streams?

3. **Error Recovery**

   - What are effective patterns for automatic error recovery?
   - How do you implement progressive fallback strategies?
   - When should you use custom error types vs. generic errors?

4. **State Management**
   - How do you manage complex async state transitions?
   - What are the benefits of state machines in async workflows?
   - How do you handle race conditions in stateful async operations?

## Next Steps

These challenges prepare you for:

1. **API Integration** exercises with real-world complexity
2. **Performance Optimization** patterns for production systems
3. **Advanced async patterns** in frameworks and libraries

Remember: These patterns are the building blocks of robust, scalable async applications. Master them to handle any async scenario with confidence! 🚀
