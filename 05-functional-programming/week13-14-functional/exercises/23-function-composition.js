/**
 * Exercise 23: Function Composition
 *
 * Master function composition techniques to build complex operations
 * from simple, reusable functions.
 */

console.log("Starting Exercise 23: Function Composition");

// Basic composition examples
console.log("\n=== Basic Function Composition ===");

// Simple functions to compose
const add1 = (x) => x + 1;
const multiply2 = (x) => x * 2;
const subtract3 = (x) => x - 3;

// TODO: Manual composition (right to left)
function manualCompose(x) {
  return subtract3(multiply2(add1(x)));
}

console.log("Manual composition (5):", manualCompose(5)); // (5+1)*2-3 = 9

// TODO: Create a compose function
function compose(...functions) {
  return function (value) {
    return functions.reduceRight((acc, fn) => fn(acc), value);
  };
}

const composedFunction = compose(subtract3, multiply2, add1);
console.log("Composed function (5):", composedFunction(5)); // Same result: 9

// TODO: Create a pipe function (left to right)
function pipe(...functions) {
  return function (value) {
    return functions.reduce((acc, fn) => fn(acc), value);
  };
}

const pipedFunction = pipe(add1, multiply2, subtract3);
console.log("Piped function (5):", pipedFunction(5)); // Same result: 9

// String processing composition
console.log("\n=== String Processing Composition ===");

// TODO: String transformation functions
const toLowerCase = (str) => str.toLowerCase();
const removeSpaces = (str) => str.replace(/\s+/g, "");
const addPrefix = (prefix) => (str) => `${prefix}${str}`;
const addSuffix = (suffix) => (str) => `${str}${suffix}`;
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Compose string processors
const createSlug = pipe(
  toLowerCase,
  (str) => str.replace(/[^a-z0-9\s-]/g, ""), // Remove special chars
  (str) => str.replace(/\s+/g, "-"), // Replace spaces with hyphens
  (str) => str.replace(/-+/g, "-"), // Remove multiple hyphens
  (str) => str.replace(/^-|-$/g, "") // Remove leading/trailing hyphens
);

const createTitle = pipe(
  toLowerCase,
  (str) => str.split(" "),
  (words) => words.map(capitalize),
  (words) => words.join(" ")
);

console.log('Slug from "Hello World! 123":', createSlug("Hello World! 123"));
console.log('Title from "hello world":', createTitle("hello world"));

// Array processing composition
console.log("\n=== Array Processing Composition ===");

// TODO: Array transformation functions
const filterEven = (arr) => arr.filter((x) => x % 2 === 0);
const filterOdd = (arr) => arr.filter((x) => x % 2 === 1);
const mapDouble = (arr) => arr.map((x) => x * 2);
const mapSquare = (arr) => arr.map((x) => x * x);
const sum = (arr) => arr.reduce((acc, x) => acc + x, 0);
const sort = (arr) => [...arr].sort((a, b) => a - b);

const numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];

// Compose array processors
const processEvenNumbers = pipe(filterEven, mapSquare, sort);

const sumOfDoubledOdds = pipe(filterOdd, mapDouble, sum);

console.log("Original numbers:", numbers);
console.log("Processed even numbers:", processEvenNumbers(numbers));
console.log("Sum of doubled odds:", sumOfDoubledOdds(numbers));

// Object transformation composition
console.log("\n=== Object Transformation Composition ===");

// TODO: Object transformation functions
const addTax = (rate) => (obj) => ({ ...obj, tax: obj.price * rate });
const addDiscount = (percent) => (obj) => ({
  ...obj,
  discountedPrice: obj.price * (1 - percent)
});
const addCategory = (category) => (obj) => ({ ...obj, category });
const addTimestamp = (obj) => ({ ...obj, createdAt: new Date().toISOString() });

const product = { name: "Laptop", price: 1000 };

const processProduct = pipe(
  addCategory("Electronics"),
  addTax(0.08),
  addDiscount(0.1),
  addTimestamp
);

console.log("Original product:", product);
console.log("Processed product:", processProduct(product));

// Validation composition
console.log("\n=== Validation Composition ===");

// TODO: Validation functions that return validation objects
const required = (field) => (value) => ({
  isValid: value != null && value !== "",
  field,
  rule: "required",
  message: value != null && value !== "" ? null : `${field} is required`
});

const minLength = (field, min) => (value) => ({
  isValid: value && value.length >= min,
  field,
  rule: "minLength",
  message:
    value && value.length >= min
      ? null
      : `${field} must be at least ${min} characters`
});

const email = (field) => (value) => ({
  isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  field,
  rule: "email",
  message: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? null
    : `${field} must be a valid email`
});

// TODO: Compose validators
function validateField(field, value, ...validators) {
  const results = validators.map((validator) => validator(field)(value));
  const errors = results.filter((result) => !result.isValid);

  return {
    field,
    value,
    isValid: errors.length === 0,
    errors: errors.map((error) => error.message)
  };
}

function validateObject(obj, validationRules) {
  const results = Object.keys(validationRules).map((field) => {
    const value = obj[field];
    const validators = validationRules[field];
    return validateField(field, value, ...validators);
  });

  return {
    isValid: results.every((result) => result.isValid),
    fields: results,
    errors: results.filter((result) => !result.isValid)
  };
}

const userValidation = {
  name: [required, minLength("name", 2)],
  email: [required, email],
  age: [required]
};

const validUser = { name: "Alice", email: "alice@example.com", age: 30 };
const invalidUser = { name: "A", email: "invalid", age: null };

console.log(
  "Valid user validation:",
  validateObject(validUser, userValidation)
);
console.log(
  "Invalid user validation:",
  validateObject(invalidUser, userValidation)
);

// Async composition
console.log("\n=== Async Function Composition ===");

// TODO: Async transformation functions
const delay = (ms) => (value) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));
const asyncAddOne = async (x) => x + 1;
const asyncMultiplyTwo = async (x) => x * 2;
const asyncLog = async (x) => {
  console.log("Async result:", x);
  return x;
};

// TODO: Compose async functions
function composeAsync(...functions) {
  return async function (value) {
    let result = value;
    for (const fn of functions.reverse()) {
      result = await fn(result);
    }
    return result;
  };
}

function pipeAsync(...functions) {
  return async function (value) {
    let result = value;
    for (const fn of functions) {
      result = await fn(result);
    }
    return result;
  };
}

const asyncPipeline = pipeAsync(
  asyncAddOne,
  delay(100),
  asyncMultiplyTwo,
  asyncLog
);

// Test async composition
asyncPipeline(5).then((result) => {
  console.log("Final async result:", result);
});

// Point-free style composition
console.log("\n=== Point-Free Style ===");

// TODO: Point-free functions (no explicit parameters)
const increment = add1;
const double = multiply2;
const isEven = (x) => x % 2 === 0;
const isPositive = (x) => x > 0;

// Point-free composition
const processNumber = pipe(increment, double);
const isEvenAndPositive = (x) => isEven(x) && isPositive(x);

console.log("Process number (5):", processNumber(5));
console.log("Is 4 even and positive:", isEvenAndPositive(4));
console.log("Is -2 even and positive:", isEvenAndPositive(-2));

// TODO: Point-free array processing
const sumOfSquaredEvens = pipe(filterEven, mapSquare, sum);

console.log("Sum of squared evens:", sumOfSquaredEvens([1, 2, 3, 4, 5, 6]));

// Real-world example: Data processing pipeline
console.log("\n=== Data Processing Pipeline ===");

// TODO: Real-world data transformation
const rawData = [
  {
    name: "alice johnson",
    email: "ALICE@EXAMPLE.COM",
    age: "30",
    salary: "50000"
  },
  { name: "bob smith", email: "bob@invalid", age: "invalid", salary: "60000" },
  {
    name: "charlie brown",
    email: "charlie@example.com",
    age: "25",
    salary: "45000"
  }
];

// Transformation functions
const normalizeEmail = (obj) => ({ ...obj, email: obj.email.toLowerCase() });
const capitalizeName = (obj) => ({ ...obj, name: createTitle(obj.name) });
const parseAge = (obj) => ({ ...obj, age: parseInt(obj.age) || 0 });
const parseSalary = (obj) => ({ ...obj, salary: parseInt(obj.salary) || 0 });
const validateEmail = (obj) => ({
  ...obj,
  validEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(obj.email)
});
const addFullName = (obj) => ({ ...obj, fullName: obj.name });

// Data processing pipeline
const processUserData = (data) =>
  data.map(
    pipe(
      normalizeEmail,
      capitalizeName,
      parseAge,
      parseSalary,
      validateEmail,
      addFullName
    )
  );

const processedData = processUserData(rawData);
console.log("Processed data:", processedData);

// Advanced: Conditional composition
console.log("\n=== Conditional Composition ===");

// TODO: Conditional function application
const when = (predicate, fn) => (value) => predicate(value) ? fn(value) : value;
const unless = (predicate, fn) => (value) =>
  !predicate(value) ? fn(value) : value;

const processIfPositive = when((x) => x > 0, double);
const makePositiveIfNegative = unless(
  (x) => x >= 0,
  (x) => Math.abs(x)
);

console.log("Process if positive (5):", processIfPositive(5)); // 10
console.log("Process if positive (-3):", processIfPositive(-3)); // -3
console.log("Make positive if negative (-5):", makePositiveIfNegative(-5)); // 5

// TODO: Branching composition
function branch(predicate, trueFn, falseFn) {
  return (value) => (predicate(value) ? trueFn(value) : falseFn(value));
}

const processNumber2 = branch(
  (x) => x > 0,
  pipe(double, add1), // For positive numbers
  pipe((x) => Math.abs(x), multiply2) // For negative numbers
);

console.log("Branch process (5):", processNumber2(5)); // (5*2)+1 = 11
console.log("Branch process (-3):", processNumber2(-3)); // |-3|*2 = 6

// Instructions:
// 1. Understand compose vs pipe (right-to-left vs left-to-right)
// 2. Practice composing functions for string and array processing
// 3. Build object transformation pipelines
// 4. Create validation systems using composition
// 5. Handle async functions in composition
// 6. Use point-free style for cleaner code
// 7. Build real-world data processing pipelines
// 8. Use conditional composition for branching logic
