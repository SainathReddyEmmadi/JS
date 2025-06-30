/**
 * Exercise 07: Function Decorators
 *
 * Decorators are higher-order functions that take a function and return
 * an enhanced version of it. They're used to add functionality without
 * modifying the original function.
 *
 * Difficulty: 🟡 Intermediate
 */

// ==========================================
// EXERCISE 1: Basic Timer Decorator
// ==========================================

/**
 * TODO: Create a decorator that measures execution time
 *
 * The decorator should:
 * - Accept a function as parameter
 * - Return a new function that logs execution time
 * - Preserve the original function's behavior
 *
 * Example usage:
 * const timedAdd = withTimer((a, b) => a + b);
 * timedAdd(5, 3); // Should log execution time and return 8
 */
function withTimer(fn) {
  // TODO: Implement timer decorator
}

// Test the timer decorator
const slowFunction = withTimer((n) => {
  let sum = 0;
  for (let i = 0; i < n * 100000; i++) {
    sum += i;
  }
  return sum;
});

// TODO: Test slowFunction(1000) and observe timing

// ==========================================
// EXERCISE 2: Logging Decorator
// ==========================================

/**
 * TODO: Create a decorator that logs function calls
 *
 * The decorator should:
 * - Log the function name and arguments before execution
 * - Log the result after execution
 * - Handle functions with different numbers of arguments
 */
function withLogging(fn) {
  // TODO: Implement logging decorator
}

// Test functions
const add = withLogging(function add(a, b) {
  return a + b;
});

const multiply = withLogging(function multiply(x, y, z = 1) {
  return x * y * z;
});

// TODO: Test add(5, 3) and multiply(2, 4, 3)

// ==========================================
// EXERCISE 3: Caching Decorator (Memoization)
// ==========================================

/**
 * TODO: Create a decorator that caches function results
 *
 * The decorator should:
 * - Cache results based on function arguments
 * - Return cached results for repeated calls
 * - Work with functions that have multiple arguments
 */
function withCache(fn) {
  // TODO: Implement caching decorator
  // Hint: Use JSON.stringify for complex argument serialization
}

// Test with expensive function
const fibonacci = withCache(function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

// TODO: Test fibonacci(40) multiple times and observe speed difference

// ==========================================
// EXERCISE 4: Retry Decorator
// ==========================================

/**
 * TODO: Create a decorator that retries failed operations
 *
 * The decorator should:
 * - Retry the function up to maxAttempts times
 * - Wait between retries (optional delay)
 * - Throw error if all attempts fail
 */
function withRetry(fn, maxAttempts = 3, delay = 0) {
  // TODO: Implement retry decorator
}

// Test function that randomly fails
const unreliableFunction = withRetry(function () {
  if (Math.random() < 0.7) {
    throw new Error("Random failure");
  }
  return "Success!";
}, 5);

// TODO: Test unreliableFunction() multiple times

// ==========================================
// EXERCISE 5: Validation Decorator
// ==========================================

/**
 * TODO: Create a decorator that validates function arguments
 *
 * The decorator should:
 * - Accept validation functions for each argument
 * - Throw descriptive errors for invalid arguments
 * - Allow the original function to execute if all validations pass
 */
function withValidation(fn, validators) {
  // TODO: Implement validation decorator
  // validators should be an array of validation functions
}

// Validation functions
const isNumber = (value) => {
  if (typeof value !== "number") {
    throw new Error(`Expected number, got ${typeof value}`);
  }
};

const isPositive = (value) => {
  if (value <= 0) {
    throw new Error("Expected positive number");
  }
};

const isString = (value) => {
  if (typeof value !== "string") {
    throw new Error(`Expected string, got ${typeof value}`);
  }
};

// Test function
const divide = withValidation(
  function (a, b) {
    return a / b;
  },
  [
    isNumber,
    (b) => {
      isNumber(b);
      isPositive(b);
    }
  ]
);

// TODO: Test divide(10, 2), divide(10, 0), divide('10', 2)

// ==========================================
// EXERCISE 6: Rate Limiting Decorator
// ==========================================

/**
 * TODO: Create a decorator that limits function call frequency
 *
 * The decorator should:
 * - Allow only one call per specified interval
 * - Return the last result for calls within the interval
 * - Reset the timer after each successful call
 */
function withRateLimit(fn, intervalMs) {
  // TODO: Implement rate limiting decorator
}

// Test function
const limitedLog = withRateLimit(function (message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
  return message;
}, 1000); // 1 second limit

// TODO: Test rapid calls to limitedLog('Hello')

// ==========================================
// EXERCISE 7: Composable Decorators
// ==========================================

/**
 * TODO: Create a utility to compose multiple decorators
 *
 * The function should:
 * - Accept multiple decorators and apply them in order
 * - Allow easy combination of decorator functionality
 * - Maintain proper function composition order
 */
function compose(...decorators) {
  // TODO: Implement decorator composition
  // Should apply decorators from right to left (like function composition)
}

// Example usage
const enhancedFunction = compose(
  withLogging,
  withTimer,
  withCache
)(function expensiveCalculation(n) {
  let result = 0;
  for (let i = 0; i < n * 1000; i++) {
    result += Math.sqrt(i);
  }
  return result;
});

// TODO: Test enhancedFunction(1000) and observe all decorators working together

// ==========================================
// EXERCISE 8: Conditional Decorator
// ==========================================

/**
 * TODO: Create a decorator that applies conditionally
 *
 * The decorator should:
 * - Accept a condition function
 * - Apply the decorator only when condition is true
 * - Pass through the original function when condition is false
 */
function withCondition(decorator, conditionFn) {
  // TODO: Implement conditional decorator application
}

// Example: Only log in development mode
const isDevelopment = () => process.env.NODE_ENV === "development";
const conditionalLogging = withCondition(withLogging, isDevelopment);

const debugFunction = conditionalLogging(function (data) {
  return data.toUpperCase();
});

// TODO: Test debugFunction('hello') in different environments

// ==========================================
// REAL-WORLD EXAMPLES
// ==========================================

/**
 * TODO: Create a complete example using multiple decorators
 *
 * Create an API client function and enhance it with:
 * - Retry logic for failed requests
 * - Caching for GET requests
 * - Logging for debugging
 * - Rate limiting to avoid hitting API limits
 */

// Mock API function
async function fetchUserData(userId) {
  // Simulate API call
  if (Math.random() < 0.3) {
    throw new Error("Network error");
  }
  return {
    id: userId,
    name: `User ${userId}`,
    email: `user${userId}@example.com`
  };
}

// TODO: Apply appropriate decorators to create a robust API client
const robustFetchUserData = fetchUserData; // Apply your decorators here

// Test the enhanced function
// TODO: Test robustFetchUserData with various scenarios

console.log("Function Decorators exercises loaded. Implement the TODOs above!");
