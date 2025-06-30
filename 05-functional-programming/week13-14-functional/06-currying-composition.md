# Currying and Function Composition

## Learning Objectives

- Master the concepts of currying and partial application
- Understand function composition and its benefits
- Learn to build complex functionality from simple functions
- Apply currying and composition to solve real-world problems

## What is Currying?

Currying is a technique in functional programming where a function that takes multiple arguments is transformed into a sequence of functions, each taking a single argument.

### Basic Currying Example

```javascript
// Regular function with multiple arguments
function add(a, b, c) {
  return a + b + c;
}

// Curried version
function curriedAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

// Usage
const result1 = add(1, 2, 3); // 6
const result2 = curriedAdd(1)(2)(3); // 6

// Or with arrow functions (more concise)
const curriedAddArrow = (a) => (b) => (c) => a + b + c;
```

### Manual Currying Implementation

```javascript
// Generic curry function
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
    }
  };
}

// Example usage
function multiply(a, b, c) {
  return a * b * c;
}

const curriedMultiply = curry(multiply);

console.log(curriedMultiply(2)(3)(4)); // 24
console.log(curriedMultiply(2, 3)(4)); // 24
console.log(curriedMultiply(2)(3, 4)); // 24
```

## Partial Application

Partial application is related to currying but involves fixing some arguments of a function, producing another function with fewer arguments.

```javascript
// Partial application using bind
function greet(greeting, name, punctuation) {
  return `${greeting}, ${name}${punctuation}`;
}

const sayHello = greet.bind(null, "Hello");
const sayHelloToJohn = greet.bind(null, "Hello", "John");

console.log(sayHello("Alice", "!")); // "Hello, Alice!"
console.log(sayHelloToJohn(".")); // "Hello, John."

// Custom partial function
function partial(fn, ...presetArgs) {
  return function (...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}

const add10 = partial(add, 10);
console.log(add10(5, 2)); // 17
```

## Function Composition

Function composition is the process of combining two or more functions to produce a new function.

### Basic Composition

```javascript
// Simple composition example
function double(x) {
  return x * 2;
}

function square(x) {
  return x * x;
}

function addOne(x) {
  return x + 1;
}

// Manual composition
function compose2(f, g) {
  return function (x) {
    return f(g(x));
  };
}

const doubleSquare = compose2(double, square);
console.log(doubleSquare(3)); // double(square(3)) = double(9) = 18

// Compose multiple functions (right to left)
function compose(...functions) {
  return function (input) {
    return functions.reduceRight((acc, fn) => fn(acc), input);
  };
}

const pipeline = compose(double, square, addOne);
console.log(pipeline(3)); // double(square(addOne(3))) = double(square(4)) = double(16) = 32
```

### Pipe (Left to Right Composition)

```javascript
// Pipe function (left to right composition)
function pipe(...functions) {
  return function (input) {
    return functions.reduce((acc, fn) => fn(acc), input);
  };
}

const pipeline2 = pipe(addOne, square, double);
console.log(pipeline2(3)); // double(square(addOne(3))) = double(square(4)) = double(16) = 32
```

## Advanced Currying Patterns

### Currying with Configuration

```javascript
// API request with currying
const makeRequest = curry((method, url, options, data) => {
  return fetch(url, {
    method,
    ...options,
    body: data ? JSON.stringify(data) : undefined
  });
});

// Create specialized functions
const get = makeRequest("GET");
const post = makeRequest("POST");
const apiGet = get("/api");
const apiPost = post("/api");

// Usage
apiGet("/users")({})
  .then((response) => response.json())
  .then((users) => console.log(users));

apiPost("/users")({
  headers: { "Content-Type": "application/json" }
})({ name: "John", email: "john@example.com" });
```

### Validation with Currying

```javascript
// Validation functions
const required = (fieldName) => (value) =>
  value ? null : `${fieldName} is required`;

const minLength = (min) => (fieldName) => (value) =>
  value && value.length >= min
    ? null
    : `${fieldName} must be at least ${min} characters`;

const email = (fieldName) => (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? null
    : `${fieldName} must be a valid email`;

// Compose validators
const validateField = (fieldName, value, ...validators) =>
  validators
    .map((validator) => validator(fieldName)(value))
    .filter((result) => result !== null);

// Usage
const nameValidators = [required, minLength(2)];
const emailValidators = [required, email];

const nameErrors = validateField("Name", "Jo", ...nameValidators);
const emailErrors = validateField("Email", "invalid-email", ...emailValidators);

console.log(nameErrors); // ["Name must be at least 2 characters"]
console.log(emailErrors); // ["Email must be a valid email"]
```

## Real-World Applications

### Data Processing Pipeline

```javascript
// Data transformation pipeline
const users = [
  { id: 1, name: "John Doe", age: 25, email: "john@example.com", active: true },
  {
    id: 2,
    name: "Jane Smith",
    age: 30,
    email: "jane@example.com",
    active: false
  },
  {
    id: 3,
    name: "Bob Johnson",
    age: 35,
    email: "bob@example.com",
    active: true
  }
];

// Utility functions
const prop = curry((property, obj) => obj[property]);
const filter = curry((predicate, array) => array.filter(predicate));
const map = curry((transform, array) => array.map(transform));
const sortBy = curry((property, array) =>
  [...array].sort((a, b) => (a[property] > b[property] ? 1 : -1))
);

// Predicates and transformers
const isActive = prop("active");
const getName = prop("name");
const getAge = prop("age");

// Build processing pipeline
const processUsers = pipe(
  filter(isActive),
  sortBy("age"),
  map((user) => ({
    name: user.name,
    age: user.age,
    displayName: `${user.name} (${user.age})`
  }))
);

const result = processUsers(users);
console.log(result);
// [
//   { name: 'John Doe', age: 25, displayName: 'John Doe (25)' },
//   { name: 'Bob Johnson', age: 35, displayName: 'Bob Johnson (35)' }
// ]
```

### Event Handling with Currying

```javascript
// Event handler factory
const createEventHandler = curry((eventType, selector, handler) => {
  document.addEventListener(eventType, (event) => {
    if (event.target.matches(selector)) {
      handler(event);
    }
  });
});

// Create specialized event handlers
const onClick = createEventHandler("click");
const onSubmit = createEventHandler("submit");

// Usage
onClick(".button")((event) => console.log("Button clicked!"));
onClick(".delete-btn")((event) => {
  const id = event.target.dataset.id;
  deleteItem(id);
});

onSubmit("form")((event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  handleFormSubmit(formData);
});
```

## Performance Considerations

### Memoization with Curried Functions

```javascript
// Memoized curry function
function memoizedCurry(fn) {
  const cache = new Map();

  return function curried(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    if (args.length >= fn.length) {
      const result = fn.apply(this, args);
      cache.set(key, result);
      return result;
    } else {
      const partial = function (...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      };
      cache.set(key, partial);
      return partial;
    }
  };
}

// Expensive calculation
function expensiveCalculation(a, b, c) {
  console.log("Calculating..."); // This should only log once per unique input
  return a * b * c * Math.random();
}

const memoizedCalc = memoizedCurry(expensiveCalculation);
const partialCalc = memoizedCalc(10, 20);

console.log(partialCalc(30)); // Calculates and caches
console.log(partialCalc(30)); // Uses cached result
```

## Best Practices

### 1. Use Currying for Configuration

```javascript
// Good: Currying for configuration
const logger = curry((level, message, data) => {
  console.log(`[${level}] ${message}`, data);
});

const logError = logger("ERROR");
const logInfo = logger("INFO");

logError("Database connection failed", { error: "ECONNREFUSED" });
logInfo("User logged in", { userId: 123 });
```

### 2. Compose for Readability

```javascript
// Instead of nested function calls
const result = double(square(addOne(value)));

// Use composition for clarity
const transform = pipe(addOne, square, double);
const result = transform(value);
```

### 3. Keep Functions Small and Pure

```javascript
// Good: Small, pure functions
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const isEven = (n) => n % 2 === 0;

// Compose them for complex operations
const processNumber = pipe(
  (n) => add(n, 1),
  (n) => multiply(n, 2),
  isEven
);
```

## Common Pitfalls

### 1. Over-Currying

```javascript
// Bad: Unnecessarily complex
const add = (a) => (b) => (c) => (d) => a + b + c + d;

// Better: Use when it provides real benefit
function add(a, b, c, d) {
  return a + b + c + d;
}

const curriedAdd = curry(add); // Only curry when needed
```

### 2. Performance Issues

```javascript
// Bad: Creating functions in loops
for (let i = 0; i < items.length; i++) {
  items[i] = pipe(transform1, transform2, transform3)(items[i]);
}

// Better: Create pipeline once
const transform = pipe(transform1, transform2, transform3);
for (let i = 0; i < items.length; i++) {
  items[i] = transform(items[i]);
}
```

## Self-Check Questions

1. What's the difference between currying and partial application?
2. When would you choose `pipe` over `compose`?
3. How does currying help with function reusability?
4. What are the performance implications of function composition?
5. How can memoization be combined with currying?

## Practice Exercises

### Exercise 1: Build a Curry Function

Create a curry function that can handle functions with any number of arguments.

### Exercise 2: Math Operations Pipeline

Create a math processing pipeline using composition that:

- Adds 10 to a number
- Multiplies by 2
- Subtracts 5
- Returns whether the result is even

### Exercise 3: Form Validation System

Build a form validation system using currying where you can:

- Create reusable validators
- Compose multiple validators for a field
- Return all validation errors for a form

### Exercise 4: API Client

Create an API client using currying that allows you to:

- Configure base URL, headers, and authentication
- Create specialized methods (GET, POST, etc.)
- Handle different content types

### Exercise 5: Data Processing

Build a data processing system that can:

- Filter, sort, and transform arrays
- Use curried functions for reusability
- Compose operations into readable pipelines

## Further Reading

- [Functional Programming in JavaScript](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/)
- [Currying vs Partial Application](https://javascript.info/currying-partials)
- [Function Composition in JavaScript](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-function-composition-20dfb109a1a0)
- [Ramda.js Documentation](https://ramdajs.com/) - Functional programming library
