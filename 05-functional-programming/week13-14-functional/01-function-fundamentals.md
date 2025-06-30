# Function Fundamentals

Understanding functions as first-class citizens is the foundation of functional programming in JavaScript. This module covers the essential concepts that make functional programming possible.

## 🎯 Learning Objectives

- Understand functions as first-class citizens
- Master different function declaration styles
- Learn function expressions and their uses
- Understand the difference between declarations and expressions
- Practice with arrow functions in functional contexts

## 📚 Core Concepts

### Functions as First-Class Citizens

In JavaScript, functions are first-class citizens, meaning they can be:

- Assigned to variables
- Passed as arguments to other functions
- Returned from functions
- Stored in data structures (arrays, objects)

```javascript
// Function assigned to variable
const greet = function (name) {
  return `Hello, ${name}!`;
};

// Function stored in array
const operations = [
  function (a, b) {
    return a + b;
  },
  function (a, b) {
    return a - b;
  },
  function (a, b) {
    return a * b;
  }
];

// Function as object property
const calculator = {
  add: function (a, b) {
    return a + b;
  },
  subtract: function (a, b) {
    return a - b;
  }
};
```

### Function Declarations vs Expressions

**Function Declarations:**

```javascript
// Hoisted - can be called before declaration
console.log(add(2, 3)); // Works! Returns 5

function add(a, b) {
  return a + b;
}
```

**Function Expressions:**

```javascript
// Not hoisted - cannot be called before assignment
// console.log(multiply(2, 3)); // Error!

const multiply = function (a, b) {
  return a * b;
};

console.log(multiply(2, 3)); // Works! Returns 6
```

**Named Function Expressions:**

```javascript
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};

// 'fact' is only available inside the function
console.log(factorial(5)); // 120
// console.log(fact(5)); // Error! fact is not defined
```

### Arrow Functions in Functional Programming

Arrow functions provide concise syntax and lexical `this` binding:

```javascript
// Traditional function expression
const square = function (x) {
  return x * x;
};

// Arrow function - single expression
const square = (x) => x * x;

// Arrow function - multiple parameters
const add = (a, b) => a + b;

// Arrow function - multiple statements
const processData = (data) => {
  const cleaned = data.filter((item) => item != null);
  const transformed = cleaned.map((item) => item.toString());
  return transformed;
};

// Arrow function - returning object (wrap in parentheses)
const createUser = (name, age) => ({
  name: name,
  age: age,
  isAdult: age >= 18
});
```

### Immediately Invoked Function Expressions (IIFE)

IIFEs are useful for creating isolated scopes:

```javascript
// Traditional IIFE
(function () {
  const secret = "This is private";
  console.log("IIFE executed");
})();

// Arrow function IIFE
(() => {
  const config = { debug: true };
  // Configuration logic here
})();

// IIFE with parameters
((name) => {
  console.log(`Hello, ${name}!`);
})("Functional Programming");

// IIFE returning a value
const moduleAPI = (() => {
  let counter = 0;

  return {
    increment: () => ++counter,
    decrement: () => --counter,
    getCount: () => counter
  };
})();
```

## 🛠️ Practical Examples

### Example 1: Function Factory

```javascript
// Function that returns other functions
function createMultiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

// Create specialized functions
const double = createMultiplier(2);
const triple = createMultiplier(3);
const tenTimes = createMultiplier(10);

console.log(double(5)); // 10
console.log(triple(4)); // 12
console.log(tenTimes(3)); // 30

// Arrow function version
const createMultiplier = (factor) => (number) => number * factor;
```

### Example 2: Function Composition Basics

```javascript
// Simple function composition
const addOne = (x) => x + 1;
const multiplyByTwo = (x) => x * 2;
const square = (x) => x * x;

// Manual composition
const transform1 = (x) => multiplyByTwo(addOne(x));
const transform2 = (x) => square(multiplyByTwo(addOne(x)));

console.log(transform1(3)); // (3 + 1) * 2 = 8
console.log(transform2(3)); // ((3 + 1) * 2)² = 64

// Using compose helper (we'll build this later)
const compose = (f, g) => (x) => f(g(x));
const transform3 = compose(square, compose(multiplyByTwo, addOne));
```

### Example 3: Conditional Function Selection

```javascript
// Function selection based on conditions
const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => (b !== 0 ? a / b : null)
};

function calculate(operation, a, b) {
  const fn = operations[operation];
  return fn ? fn(a, b) : "Invalid operation";
}

console.log(calculate("add", 5, 3)); // 8
console.log(calculate("divide", 10, 2)); // 5
console.log(calculate("modulo", 10, 3)); // "Invalid operation"

// More functional approach
const calculate = (operation) => (a, b) => {
  const fn = operations[operation];
  return fn ? fn(a, b) : "Invalid operation";
};

const adder = calculate("add");
console.log(adder(5, 3)); // 8
```

### Example 4: Function Array Processing

```javascript
// Array of functions for data processing
const processors = [
  (data) => data.filter((x) => x > 0), // Remove negatives
  (data) => data.map((x) => x * 2), // Double values
  (data) => data.reduce((sum, x) => sum + x, 0) // Sum all
];

function processData(data, processors) {
  return processors.reduce((result, processor) => processor(result), data);
}

const numbers = [-2, 1, 3, -1, 4, 0, 5];
const result = processData(numbers, processors);
console.log(result); // (1 + 3 + 4 + 5) * 2 = 26

// More functional version
const pipe =
  (...functions) =>
  (data) =>
    functions.reduce((result, fn) => fn(result), data);

const pipeline = pipe(
  (data) => data.filter((x) => x > 0),
  (data) => data.map((x) => x * 2),
  (data) => data.reduce((sum, x) => sum + x, 0)
);
```

## 🧪 Practice Exercises

### Exercise 1: Function Creation Patterns

```javascript
// TODO: Create these functions using different styles

// 1. Function declaration
function calculateArea(length, width) {
  // Your implementation here
}

// 2. Function expression
const calculatePerimeter = function (length, width) {
  // Your implementation here
};

// 3. Arrow function
const calculateDiagonal = (length, width) => {
  // Your implementation here
};

// 4. IIFE that returns an object with all three functions
const geometryCalculator = (() => {
  // Your implementation here
})();
```

### Exercise 2: Function Factories

```javascript
// Create a function factory for validators
function createValidator(validationFn, errorMessage) {
  // Return a function that validates input
  // Should return { isValid: boolean, error: string }
}

// Usage examples:
const emailValidator = createValidator(
  (email) => email.includes("@") && email.includes("."),
  "Invalid email format"
);

const passwordValidator = createValidator(
  (password) => password.length >= 8,
  "Password must be at least 8 characters"
);

// Test your validators
console.log(emailValidator("test@example.com")); // { isValid: true, error: '' }
console.log(passwordValidator("123")); // { isValid: false, error: 'Password must be at least 8 characters' }
```

### Exercise 3: Conditional Functions

```javascript
// Create a function that returns different operations based on conditions
function createOperation(type) {
  // Return appropriate function based on type
  // Types: 'math', 'string', 'array'
}

// Should work like this:
const mathOp = createOperation("math");
const stringOp = createOperation("string");
const arrayOp = createOperation("array");

console.log(mathOp.add(2, 3)); // 5
console.log(stringOp.concat("Hello", " World")); // 'Hello World'
console.log(arrayOp.merge([1, 2], [3, 4])); // [1, 2, 3, 4]
```

## 🔍 Self-Check Questions

1. **Function Types**: What's the difference between function declarations and function expressions in terms of hoisting?

2. **First-Class Citizens**: Give three examples of treating functions as first-class citizens.

3. **Arrow Functions**: When would you prefer arrow functions over regular functions?

4. **IIFE Usage**: What are the main use cases for Immediately Invoked Function Expressions?

5. **Function Factories**: How do function factories help with code reusability?

## 💡 Best Practices

### 1. Choose Appropriate Function Style

```javascript
// Use function declarations for main program functions
function main() {
  // Primary application logic
}

// Use function expressions for event handlers
const handleClick = function (event) {
  // Event handling logic
};

// Use arrow functions for short transformations
const double = (x) => x * 2;
const isEven = (n) => n % 2 === 0;
```

### 2. Name Functions Descriptively

```javascript
// ❌ Poor naming
const fn1 = (x) => x * 2;
const proc = (data) => data.filter((x) => x > 0);

// ✅ Good naming
const doubleValue = (x) => x * 2;
const filterPositiveNumbers = (data) => data.filter((x) => x > 0);
```

### 3. Use Function Composition

```javascript
// ❌ Nested function calls
const result = processC(processB(processA(data)));

// ✅ Function composition
const pipeline = compose(processC, processB, processA);
const result = pipeline(data);
```

### 4. Prefer Pure Functions

```javascript
// ❌ Impure function (modifies external state)
let total = 0;
function addToTotal(value) {
  total += value;
  return total;
}

// ✅ Pure function
function add(a, b) {
  return a + b;
}
```

## 🔗 What's Next?

Now that you understand function fundamentals, you're ready to explore:

- **Higher-Order Functions** - Functions that operate on other functions
- **Closures** - Advanced scoping and state management
- **Pure Functions** - Writing predictable, testable code

Function fundamentals are the building blocks of all functional programming concepts. Master these concepts, and you'll be well-prepared for the advanced techniques ahead!

## 📝 Summary

Key takeaways from this module:

- ✅ Functions are first-class citizens in JavaScript
- ✅ Different function styles serve different purposes
- ✅ Arrow functions provide concise syntax for functional programming
- ✅ IIFEs create isolated scopes and can return APIs
- ✅ Function factories enable code reusability and specialization
- ✅ Proper function naming and organization improve code readability
