# Higher-Order Functions

Higher-order functions are functions that either take other functions as arguments or return functions as results. They're one of the most powerful concepts in functional programming and enable elegant, reusable code patterns.

## 🎯 Learning Objectives

- Understand what makes a function "higher-order"
- Learn to write functions that accept other functions as parameters
- Master creating functions that return other functions
- Apply higher-order functions for code abstraction
- Build reusable function utilities

## 📚 Core Concepts

### What Are Higher-Order Functions?

A higher-order function is a function that:

1. **Takes one or more functions as arguments**, OR
2. **Returns a function as its result**

```javascript
// Example 1: Function that takes another function as argument
function greetWith(greetingFunction, name) {
  return greetingFunction(name);
}

const sayHello = (name) => `Hello, ${name}!`;
const sayGoodbye = (name) => `Goodbye, ${name}!`;

console.log(greetWith(sayHello, "Alice")); // "Hello, Alice!"
console.log(greetWith(sayGoodbye, "Bob")); // "Goodbye, Bob!"

// Example 2: Function that returns another function
function createMultiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(4)); // 12
```

### Built-in Higher-Order Functions

JavaScript arrays come with many built-in higher-order functions:

```javascript
const numbers = [1, 2, 3, 4, 5];

// map - transforms each element
const doubled = numbers.map((x) => x * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter - selects elements based on condition
const evens = numbers.filter((x) => x % 2 === 0);
console.log(evens); // [2, 4]

// reduce - accumulates values
const sum = numbers.reduce((acc, x) => acc + x, 0);
console.log(sum); // 15

// forEach - performs action on each element
numbers.forEach((x) => console.log(`Number: ${x}`));

// find - finds first matching element
const firstEven = numbers.find((x) => x % 2 === 0);
console.log(firstEven); // 2
```

## 🛠️ Creating Higher-Order Functions

### Pattern 1: Functions That Accept Functions

```javascript
// Generic retry function
function retry(fn, maxAttempts, delay = 1000) {
  return async function (...args) {
    let attempts = 0;

    while (attempts < maxAttempts) {
      try {
        return await fn(...args);
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw error;
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  };
}

// Usage
const fetchData = (url) => fetch(url).then((r) => r.json());
const reliableFetch = retry(fetchData, 3, 2000);

// Generic timing function
function timeFunction(fn, label = "Function") {
  return function (...args) {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`${label} took ${end - start} milliseconds`);
    return result;
  };
}

// Usage
const slowCalculation = (n) => {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += Math.sqrt(i);
  }
  return sum;
};

const timedCalculation = timeFunction(slowCalculation, "Math calculation");
console.log(timedCalculation(1000000));
```

### Pattern 2: Functions That Return Functions

```javascript
// Configuration-based function creation
function createLogger(level) {
  const levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
  const currentLevel = levels[level.toUpperCase()] || 0;

  return function (message, messageLevel = "INFO") {
    const msgLevel = levels[messageLevel.toUpperCase()] || 1;
    if (msgLevel >= currentLevel) {
      console.log(`[${messageLevel}] ${new Date().toISOString()}: ${message}`);
    }
  };
}

const logger = createLogger("WARN");
logger("Debug message", "DEBUG"); // Won't log (DEBUG < WARN)
logger("Warning message", "WARN"); // Will log
logger("Error message", "ERROR"); // Will log

// Validator factory
function createValidator(rules) {
  return function (data) {
    const errors = [];

    for (const [field, rule] of Object.entries(rules)) {
      if (typeof rule === "function") {
        if (!rule(data[field])) {
          errors.push(`${field} is invalid`);
        }
      } else if (rule.required && !data[field]) {
        errors.push(`${field} is required`);
      } else if (rule.validate && !rule.validate(data[field])) {
        errors.push(rule.message || `${field} is invalid`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };
}

// Usage
const userValidator = createValidator({
  email: {
    required: true,
    validate: (email) => email.includes("@"),
    message: "Email must be valid"
  },
  age: {
    required: true,
    validate: (age) => age >= 18,
    message: "Must be 18 or older"
  }
});

console.log(userValidator({ email: "test@example.com", age: 25 }));
// { isValid: true, errors: [] }
```

### Pattern 3: Function Decorators

```javascript
// Memoization decorator
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log("Cache hit!");
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Expensive fibonacci calculation
const fibonacci = memoize(function (n) {
  console.log(`Calculating fibonacci(${n})`);
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(10)); // Calculates and caches
console.log(fibonacci(10)); // Uses cache

// Throttle decorator
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

// Usage
const expensiveOperation = () => console.log("Expensive operation performed");
const throttledOperation = throttle(expensiveOperation, 1000);

// Only runs once per second, no matter how often called
throttledOperation(); // Runs
throttledOperation(); // Ignored
setTimeout(() => throttledOperation(), 1500); // Runs after delay
```

## 🧩 Advanced Higher-Order Patterns

### Function Composition

```javascript
// Basic compose function (right to left)
function compose(...functions) {
  return function (value) {
    return functions.reduceRight((acc, fn) => fn(acc), value);
  };
}

// Pipe function (left to right)
function pipe(...functions) {
  return function (value) {
    return functions.reduce((acc, fn) => fn(acc), value);
  };
}

// Example functions
const addOne = (x) => x + 1;
const double = (x) => x * 2;
const square = (x) => x * x;

// Composition (right to left: square(double(addOne(x))))
const transform1 = compose(square, double, addOne);
console.log(transform1(3)); // ((3 + 1) * 2)² = 64

// Pipe (left to right: square(double(addOne(x))))
const transform2 = pipe(addOne, double, square);
console.log(transform2(3)); // ((3 + 1) * 2)² = 64

// More complex example
const processText = pipe(
  (text) => text.toLowerCase(),
  (text) => text.trim(),
  (text) => text.replace(/\s+/g, "-"),
  (text) => text.substring(0, 20)
);

console.log(processText("  Hello World  ")); // "hello-world"
```

### Partial Application

```javascript
// Generic partial application
function partial(fn, ...args1) {
  return function (...args2) {
    return fn(...args1, ...args2);
  };
}

// Example usage
function multiply(a, b, c) {
  return a * b * c;
}

const multiplyBy2 = partial(multiply, 2);
const multiplyBy2And3 = partial(multiply, 2, 3);

console.log(multiplyBy2(3, 4)); // 2 * 3 * 4 = 24
console.log(multiplyBy2And3(4)); // 2 * 3 * 4 = 24

// Practical example: API caller
function apiCall(baseUrl, endpoint, method, data) {
  return fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

const userApi = partial(apiCall, "https://api.example.com", "/users");
const getUserById = partial(userApi, "GET");
const createUser = partial(userApi, "POST");

// Usage
getUserById({ id: 123 });
createUser({ name: "John", email: "john@example.com" });
```

### Currying

```javascript
// Manual currying
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

// Example
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6

// Practical currying example
const createApiEndpoint = curry((baseUrl, endpoint, method, data) => {
  return fetch(`${baseUrl}${endpoint}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
});

const apiBase = createApiEndpoint("https://api.example.com");
const usersEndpoint = apiBase("/users");
const getUsers = usersEndpoint("GET");
const postUsers = usersEndpoint("POST");

// Usage
getUsers({});
postUsers({ name: "John" });
```

## 🧪 Practical Examples

### Example 1: Event Handler Manager

```javascript
function createEventManager() {
  const handlers = new Map();

  return {
    on: (event, handler) => {
      if (!handlers.has(event)) {
        handlers.set(event, []);
      }
      handlers.get(event).push(handler);
    },

    emit: (event, data) => {
      if (handlers.has(event)) {
        handlers.get(event).forEach((handler) => handler(data));
      }
    },

    off: (event, handler) => {
      if (handlers.has(event)) {
        const eventHandlers = handlers.get(event);
        const index = eventHandlers.indexOf(handler);
        if (index > -1) {
          eventHandlers.splice(index, 1);
        }
      }
    },

    // Higher-order function: create specialized emitter
    createEmitter: (eventName) => {
      return (data) => {
        if (handlers.has(eventName)) {
          handlers.get(eventName).forEach((handler) => handler(data));
        }
      };
    }
  };
}

// Usage
const eventManager = createEventManager();

eventManager.on("user-login", (user) => console.log(`${user.name} logged in`));
eventManager.on("user-login", (user) => console.log(`Welcome, ${user.name}!`));

const emitLogin = eventManager.createEmitter("user-login");
emitLogin({ name: "Alice" });
```

### Example 2: Data Processing Pipeline

```javascript
// Higher-order functions for data processing
function createProcessor(processors) {
  return function (data) {
    return processors.reduce((result, processor) => {
      if (typeof processor === "function") {
        return processor(result);
      } else if (processor.condition && processor.transform) {
        return processor.condition(result)
          ? processor.transform(result)
          : result;
      }
      return result;
    }, data);
  };
}

// Processor functions
const processors = [
  // Remove null/undefined values
  (data) => data.filter((item) => item != null),

  // Conditional processing: only process if array has items
  {
    condition: (data) => data.length > 0,
    transform: (data) =>
      data.map((item) => ({
        ...item,
        processed: true,
        timestamp: Date.now()
      }))
  },

  // Sort by a property
  (data) => data.sort((a, b) => a.name.localeCompare(b.name)),

  // Limit results
  (data) => data.slice(0, 10)
];

const processUserData = createProcessor(processors);

const userData = [
  { name: "Charlie", age: 25 },
  null,
  { name: "Alice", age: 30 },
  { name: "Bob", age: 35 },
  undefined
];

console.log(processUserData(userData));
```

## 🧪 Practice Exercises

### Exercise 1: Generic Array Utilities

```javascript
// Create higher-order functions for array processing

// 1. Create a function that generates array processors
function createArrayProcessor(operation) {
  // Should return a function that applies the operation to arrays
  // Operations: 'double', 'square', 'uppercase', etc.
}

// Usage:
const doubler = createArrayProcessor("double");
console.log(doubler([1, 2, 3])); // [2, 4, 6]

// 2. Create a conditional filter function
function createConditionalFilter(condition, transform) {
  // Should return a function that filters and optionally transforms
}

// Usage:
const processAdults = createConditionalFilter(
  (person) => person.age >= 18,
  (person) => ({ ...person, status: "adult" })
);
```

### Exercise 2: Function Combinators

```javascript
// Create function combinators

// 1. Create a 'not' combinator
function not(predicate) {
  // Should return the opposite of the predicate function
}

const isEven = (n) => n % 2 === 0;
const isOdd = not(isEven);

// 2. Create an 'and' combinator
function and(predicate1, predicate2) {
  // Should return a function that returns true only if both predicates are true
}

// 3. Create an 'or' combinator
function or(predicate1, predicate2) {
  // Should return a function that returns true if either predicate is true
}

// Usage:
const isPositive = (n) => n > 0;
const isSmall = (n) => n < 100;
const isPositiveAndSmall = and(isPositive, isSmall);
```

### Exercise 3: Advanced Decorators

```javascript
// Create function decorators

// 1. Rate limiting decorator
function rateLimit(fn, maxCalls, timeWindow) {
  // Should limit function calls to maxCalls per timeWindow (ms)
}

// 2. Cache decorator with TTL
function cacheWithTTL(fn, ttl) {
  // Should cache results for ttl milliseconds
}

// 3. Retry decorator with exponential backoff
function retryWithBackoff(fn, maxRetries, baseDelay) {
  // Should retry with increasing delays: baseDelay, baseDelay*2, baseDelay*4, etc.
}
```

## 🔍 Self-Check Questions

1. **Definition**: What makes a function a "higher-order" function?

2. **Patterns**: What are the two main patterns of higher-order functions?

3. **Benefits**: What advantages do higher-order functions provide?

4. **Composition**: How does function composition help with code organization?

5. **Currying vs Partial**: What's the difference between currying and partial application?

## 💡 Best Practices

### 1. Keep Functions Pure

```javascript
// ❌ Impure higher-order function
let globalCounter = 0;
function impureMap(array, fn) {
  globalCounter++;
  return array.map(fn);
}

// ✅ Pure higher-order function
function pureMap(array, fn) {
  return array.map(fn);
}
```

### 2. Use Descriptive Names

```javascript
// ❌ Unclear naming
const fn = createThing((x) => x * 2);

// ✅ Clear naming
const createNumberTransformer = (fn) => (array) => array.map(fn);
const doubleNumbers = createNumberTransformer((x) => x * 2);
```

### 3. Handle Edge Cases

```javascript
function safePipe(...functions) {
  return function (value) {
    return functions.reduce((acc, fn) => {
      if (typeof fn !== "function") {
        throw new Error("All arguments must be functions");
      }
      try {
        return fn(acc);
      } catch (error) {
        console.error("Error in pipeline:", error);
        return acc; // Return unchanged value on error
      }
    }, value);
  };
}
```

## 🔗 What's Next?

With higher-order functions mastered, you're ready to explore:

- **Closures** - Advanced scoping and state management
- **Function Composition** - Building complex operations
- **Functional Patterns** - Common FP design patterns

Higher-order functions are the backbone of functional programming, enabling you to write more abstract, reusable, and elegant code!

## 📝 Summary

Key takeaways:

- ✅ Higher-order functions take functions as arguments or return functions
- ✅ They enable powerful abstractions and code reuse
- ✅ Built-in array methods are examples of higher-order functions
- ✅ Decorators, composition, and currying are advanced HOF patterns
- ✅ They're essential for functional programming style
