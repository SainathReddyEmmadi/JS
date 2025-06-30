/**
 * Exercise 06: Custom Higher-Order Functions
 *
 * Create your own higher-order functions that accept other functions as arguments
 * or return functions, demonstrating functional programming principles.
 */

console.log("Starting Exercise 06: Custom Higher-Order Functions");

// Basic higher-order function examples
console.log("\n=== Basic Higher-Order Functions ===");

// TODO: Create a function that applies an operation twice
function twice(fn) {
  return function (value) {
    return fn(fn(value));
  };
}

// Test twice function
const addOne = (x) => x + 1;
const addTwo = twice(addOne);
console.log("Add one twice to 5:", addTwo(5)); // Should be 7

const double = (x) => x * 2;
const quadruple = twice(double);
console.log("Double twice 3:", quadruple(3)); // Should be 12

// TODO: Create a function that repeats an operation n times
function repeat(n, fn) {
  return function (value) {
    let result = value;
    for (let i = 0; i < n; i++) {
      result = fn(result);
    }
    return result;
  };
}

const addOneThreeTimes = repeat(3, addOne);
console.log("Add one three times to 10:", addOneThreeTimes(10)); // Should be 13

// TODO: Create a conditional application function
function when(predicate, fn) {
  return function (value) {
    return predicate(value) ? fn(value) : value;
  };
}

const doubleIfEven = when(
  (x) => x % 2 === 0,
  (x) => x * 2
);
console.log("Double if even - 4:", doubleIfEven(4)); // Should be 8
console.log("Double if even - 5:", doubleIfEven(5)); // Should be 5

// Array processing higher-order functions
console.log("\n=== Array Processing HOFs ===");

// TODO: Create a custom map implementation
function myMap(array, transformFn) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(transformFn(array[i], i, array));
  }
  return result;
}

const numbers = [1, 2, 3, 4, 5];
const doubled = myMap(numbers, (x) => x * 2);
console.log("Custom map - doubled:", doubled);

// TODO: Create a custom filter implementation
function myFilter(array, predicateFn) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (predicateFn(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}

const evens = myFilter(numbers, (x) => x % 2 === 0);
console.log("Custom filter - evens:", evens);

// TODO: Create a custom reduce implementation
function myReduce(array, reducerFn, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;

  if (accumulator === undefined) {
    accumulator = array[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < array.length; i++) {
    accumulator = reducerFn(accumulator, array[i], i, array);
  }

  return accumulator;
}

const sum = myReduce(numbers, (acc, num) => acc + num, 0);
console.log("Custom reduce - sum:", sum);

// TODO: Create a function that finds elements by multiple criteria
function findBy(array, ...predicates) {
  return array.filter((item) =>
    predicates.every((predicate) => predicate(item))
  );
}

const users = [
  { name: "Alice", age: 30, active: true, role: "admin" },
  { name: "Bob", age: 25, active: false, role: "user" },
  { name: "Charlie", age: 35, active: true, role: "user" },
  { name: "Diana", age: 28, active: true, role: "admin" }
];

const activeAdmins = findBy(
  users,
  (user) => user.active,
  (user) => user.role === "admin"
);
console.log(
  "Active admins:",
  activeAdmins.map((u) => u.name)
);

// Composition higher-order functions
console.log("\n=== Function Composition HOFs ===");

// TODO: Create a pipe function (left to right composition)
function pipe(...functions) {
  return function (value) {
    return functions.reduce((acc, fn) => fn(acc), value);
  };
}

const processNumber = pipe(
  (x) => x + 1,
  (x) => x * 2,
  (x) => x - 3
);

console.log("Pipe result for 5:", processNumber(5)); // (5+1)*2-3 = 9

// TODO: Create a compose function (right to left composition)
function compose(...functions) {
  return function (value) {
    return functions.reduceRight((acc, fn) => fn(acc), value);
  };
}

const processNumberCompose = compose(
  (x) => x - 3,
  (x) => x * 2,
  (x) => x + 1
);

console.log("Compose result for 5:", processNumberCompose(5)); // Same as pipe: 9

// TODO: Create a function that applies multiple functions to the same input
function applyAll(...functions) {
  return function (value) {
    return functions.map((fn) => fn(value));
  };
}

const multipleOperations = applyAll(
  (x) => x * 2,
  (x) => x + 10,
  (x) => x / 2
);

console.log("Apply all to 6:", multipleOperations(6)); // [12, 16, 3]

// Utility higher-order functions
console.log("\n=== Utility HOFs ===");

// TODO: Create a memoization function
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`Cache hit for ${key}`);
      return cache.get(key);
    }

    console.log(`Computing ${key}`);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Expensive fibonacci function
const fibonacci = memoize(function (n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log("Fibonacci 10:", fibonacci(10));
console.log("Fibonacci 10 again:", fibonacci(10)); // Should use cache

// TODO: Create a throttle function
function throttle(fn, delay) {
  let lastCall = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

const throttledLog = throttle((message) => {
  console.log(`Throttled: ${message} at ${Date.now()}`);
}, 1000);

// TODO: Create a debounce function
function debounce(fn, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const debouncedLog = debounce((message) => {
  console.log(`Debounced: ${message}`);
}, 300);

// TODO: Create a retry function
function retry(fn, maxAttempts = 3, delay = 1000) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      function attempt() {
        attempts++;

        try {
          const result = fn.apply(this, args);
          resolve(result);
        } catch (error) {
          if (attempts >= maxAttempts) {
            reject(error);
          } else {
            console.log(`Attempt ${attempts} failed, retrying...`);
            setTimeout(attempt, delay);
          }
        }
      }

      attempt();
    });
  };
}

// Array transformation higher-order functions
console.log("\n=== Array Transformation HOFs ===");

// TODO: Create a function that groups array elements
function groupBy(array, keyFn) {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}

const usersByRole = groupBy(users, (user) => user.role);
console.log("Users by role:", usersByRole);

// TODO: Create a function that partitions an array
function partition(array, predicateFn) {
  return array.reduce(
    (acc, item) => {
      const index = predicateFn(item) ? 0 : 1;
      acc[index].push(item);
      return acc;
    },
    [[], []]
  );
}

const [activeUsers, inactiveUsers] = partition(users, (user) => user.active);
console.log(
  "Active users:",
  activeUsers.map((u) => u.name)
);
console.log(
  "Inactive users:",
  inactiveUsers.map((u) => u.name)
);

// TODO: Create a function that chunks an array
function chunk(array, size) {
  return function (transformFn = (x) => x) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      const chunk = array.slice(i, i + size);
      chunks.push(transformFn(chunk));
    }
    return chunks;
  };
}

const chunkNumbers = chunk(numbers, 2);
const numberChunks = chunkNumbers((chunk) =>
  chunk.reduce((sum, n) => sum + n, 0)
);
console.log("Chunked and summed:", numberChunks);

// Validation higher-order functions
console.log("\n=== Validation HOFs ===");

// TODO: Create a validation composer
function validate(...validators) {
  return function (value) {
    const errors = [];

    for (const validator of validators) {
      const result = validator(value);
      if (result !== true) {
        errors.push(result);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      value
    };
  };
}

// Individual validators
const required = (value) =>
  (value != null && value !== "") || "This field is required";
const minLength = (min) => (value) =>
  (value && value.length >= min) || `Minimum length is ${min}`;
const maxLength = (max) => (value) =>
  (value && value.length <= max) || `Maximum length is ${max}`;
const email = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email format";

// Compose validators
const validateEmail = validate(required, email);
const validateName = validate(required, minLength(2), maxLength(50));

console.log("Email validation:", validateEmail("test@example.com"));
console.log("Invalid email:", validateEmail("invalid"));
console.log("Name validation:", validateName("Alice"));
console.log("Short name:", validateName("A"));

// Performance measurement HOF
console.log("\n=== Performance Measurement HOF ===");

// TODO: Create a timing function
function measureTime(fn, label = "Function") {
  return function (...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    console.log(`${label} took ${(end - start).toFixed(2)} milliseconds`);
    return result;
  };
}

const timedFibonacci = measureTime(function (n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}, "Fibonacci calculation");

// Advanced: Function middleware pattern
console.log("\n=== Middleware Pattern ===");

// TODO: Create a middleware system
function createMiddleware() {
  const middlewares = [];

  return {
    use(middleware) {
      middlewares.push(middleware);
      return this;
    },

    execute(initialValue) {
      return middlewares.reduce((value, middleware) => {
        return middleware(value);
      }, initialValue);
    }
  };
}

const processor = createMiddleware()
  .use((x) => {
    console.log("Middleware 1: Input received:", x);
    return x * 2;
  })
  .use((x) => {
    console.log("Middleware 2: Processing:", x);
    return x + 10;
  })
  .use((x) => {
    console.log("Middleware 3: Final processing:", x);
    return x / 2;
  });

const middlewareResult = processor.execute(5);
console.log("Middleware final result:", middlewareResult);

// Instructions:
// 1. Understand how higher-order functions enable code reuse and abstraction
// 2. Practice creating functions that accept or return other functions
// 3. Build utility functions like memoization, throttling, and debouncing
// 4. Create custom array processing functions
// 5. Implement function composition and pipeline patterns
// 6. Build validation systems using function composition
// 7. Use middleware patterns for processing pipelines
// 8. Understand the power of functional abstraction
