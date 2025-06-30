/**
 * Exercise 13: Pure Functions
 *
 * Practice writing and identifying pure functions - functions that always
 * return the same output for the same input and have no side effects.
 */

console.log("Starting Exercise 13: Pure Functions");

// Examples of pure functions
console.log("\n=== Pure Function Examples ===");

// TODO: Pure function - always returns same output for same input
function add(a, b) {
  return a + b;
}

console.log("Pure add(2, 3):", add(2, 3)); // Always returns 5
console.log("Pure add(2, 3) again:", add(2, 3)); // Always returns 5

// TODO: Pure function - mathematical operations
function square(x) {
  return x * x;
}

function multiply(a, b) {
  return a * b;
}

console.log("Square of 4:", square(4));
console.log("Multiply 3 * 7:", multiply(3, 7));

// TODO: Pure function - string manipulation
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function reverse(str) {
  return str.split("").reverse().join("");
}

console.log('Capitalize "hello":', capitalize("hello"));
console.log('Reverse "world":', reverse("world"));

// TODO: Pure function - array operations (returning new arrays)
function doubleArray(arr) {
  return arr.map((x) => x * 2);
}

function filterEven(arr) {
  return arr.filter((x) => x % 2 === 0);
}

const numbers = [1, 2, 3, 4, 5];
console.log("Original array:", numbers);
console.log("Doubled array:", doubleArray(numbers));
console.log("Original unchanged:", numbers);
console.log("Even numbers:", filterEven(numbers));

// Examples of impure functions
console.log("\n=== Impure Function Examples ===");

let globalCounter = 0;

// TODO: Impure function - modifies global state
function impureIncrement() {
  globalCounter++; // Side effect: modifies global variable
  return globalCounter;
}

console.log("Impure increment:", impureIncrement()); // 1
console.log("Impure increment:", impureIncrement()); // 2 - different output for same call

// TODO: Impure function - depends on external state
function getCurrentTime() {
  return new Date().toISOString(); // Depends on current time
}

console.log("Current time 1:", getCurrentTime());
setTimeout(() => {
  console.log("Current time 2:", getCurrentTime()); // Different output
}, 10);

// TODO: Impure function - console.log is a side effect
function impureLog(message) {
  console.log(message); // Side effect: outputs to console
  return message;
}

// TODO: Impure function - modifies input
function impurePush(arr, item) {
  arr.push(item); // Side effect: modifies input array
  return arr;
}

// Converting impure to pure functions
console.log("\n=== Converting Impure to Pure ===");

// TODO: Pure version of increment using parameters
function pureIncrement(currentValue) {
  return currentValue + 1;
}

let counter = 0;
console.log("Pure increment from 0:", pureIncrement(counter));
console.log("Pure increment from 5:", pureIncrement(5));

// TODO: Pure version of push (returns new array)
function purePush(arr, item) {
  return [...arr, item]; // Returns new array instead of modifying
}

const originalArray = [1, 2, 3];
const newArray = purePush(originalArray, 4);
console.log("Original array:", originalArray);
console.log("New array:", newArray);

// TODO: Pure function for updating objects
function updateUser(user, updates) {
  return {
    ...user,
    ...updates
  };
}

const user = { name: "Alice", age: 30, city: "New York" };
const updatedUser = updateUser(user, { age: 31 });
console.log("Original user:", user);
console.log("Updated user:", updatedUser);

// Complex pure functions
console.log("\n=== Complex Pure Functions ===");

// TODO: Pure function for calculating statistics
function calculateStats(numbers) {
  if (numbers.length === 0) {
    return { count: 0, sum: 0, average: 0, min: 0, max: 0 };
  }

  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const count = numbers.length;
  const average = sum / count;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  return { count, sum, average, min, max };
}

console.log("Stats for [1,2,3,4,5]:", calculateStats([1, 2, 3, 4, 5]));
console.log("Stats for empty array:", calculateStats([]));

// TODO: Pure function for sorting array of objects
function sortByProperty(array, property, ascending = true) {
  return [...array].sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];

    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
}

const users = [
  { name: "Alice", age: 30 },
  { name: "Bob", age: 25 },
  { name: "Charlie", age: 35 }
];

console.log("Original users:", users);
console.log("Sorted by age:", sortByProperty(users, "age"));
console.log("Sorted by name (desc):", sortByProperty(users, "name", false));

// TODO: Pure function for data transformation
function transformData(data, transformations) {
  return data.map((item) => {
    let transformed = { ...item };

    transformations.forEach((transform) => {
      transformed = transform(transformed);
    });

    return transformed;
  });
}

const products = [
  { name: "Laptop", price: 1000 },
  { name: "Mouse", price: 25 },
  { name: "Keyboard", price: 75 }
];

const addTax = (product) => ({ ...product, priceWithTax: product.price * 1.1 });
const addCategory = (product) => ({ ...product, category: "Electronics" });

const transformedProducts = transformData(products, [addTax, addCategory]);
console.log("Original products:", products);
console.log("Transformed products:", transformedProducts);

// Pure function composition
console.log("\n=== Pure Function Composition ===");

// TODO: Compose pure functions
function compose(...functions) {
  return function (value) {
    return functions.reduceRight((acc, fn) => fn(acc), value);
  };
}

const addOne = (x) => x + 1;
const multiplyByTwo = (x) => x * 2;
const subtractThree = (x) => x - 3;

const composedFunction = compose(subtractThree, multiplyByTwo, addOne);
console.log("Composed function (5):", composedFunction(5)); // (5+1)*2-3 = 9

// TODO: Pure function pipeline
function pipe(...functions) {
  return function (value) {
    return functions.reduce((acc, fn) => fn(acc), value);
  };
}

const pipelineFunction = pipe(addOne, multiplyByTwo, subtractThree);
console.log("Pipeline function (5):", pipelineFunction(5)); // Same result

// Testing pure functions
console.log("\n=== Testing Pure Functions ===");

// TODO: Simple test helper for pure functions
function testPureFunction(fn, inputs, expectedOutput, description) {
  const output = fn(...inputs);
  const passed = JSON.stringify(output) === JSON.stringify(expectedOutput);

  console.log(`Test: ${description}`);
  console.log(`  Input: ${JSON.stringify(inputs)}`);
  console.log(`  Expected: ${JSON.stringify(expectedOutput)}`);
  console.log(`  Actual: ${JSON.stringify(output)}`);
  console.log(`  Result: ${passed ? "PASS" : "FAIL"}\n`);

  return passed;
}

// Test pure functions
testPureFunction(add, [2, 3], 5, "Addition function");
testPureFunction(capitalize, ["hello"], "Hello", "Capitalize function");
testPureFunction(doubleArray, [[1, 2, 3]], [2, 4, 6], "Double array function");

// Referential transparency examples
console.log("\n=== Referential Transparency ===");

// TODO: Demonstrate referential transparency
function pureFunction(x, y) {
  return x * 2 + y;
}

// These expressions can be replaced with their return values
const result1 = pureFunction(3, 4); // Can be replaced with 10
const result2 = pureFunction(3, 4); // Can be replaced with 10
const expression = pureFunction(3, 4) + pureFunction(3, 4); // Can be replaced with 10 + 10

console.log("Result 1:", result1);
console.log("Result 2:", result2);
console.log("Expression:", expression);

// Common pitfalls and how to avoid them
console.log("\n=== Common Pitfalls ===");

// TODO: Pitfall 1 - Hidden mutations
function safeConcatenate(arr1, arr2) {
  // WRONG: return arr1.concat(arr2); // concat is pure, but could be confusing
  // BETTER: Be explicit about returning new array
  return [...arr1, ...arr2];
}

// TODO: Pitfall 2 - Date dependencies
function formatCurrentDate() {
  // IMPURE: depends on current time
  return new Date().toISOString();
}

function formatDate(date) {
  // PURE: takes date as parameter
  return date.toISOString();
}

// TODO: Pitfall 3 - Random number generation
function generateRandomId() {
  // IMPURE: uses Math.random()
  return Math.random().toString(36).substr(2, 9);
}

function generateId(seed) {
  // PURE: uses seed parameter (though this is a simple example)
  return (seed * 9301 + 49297) % 233280;
}

console.log("Safe concatenate:", safeConcatenate([1, 2], [3, 4]));
console.log("Format specific date:", formatDate(new Date("2023-01-01")));
console.log("Generate ID with seed:", generateId(12345));

// Benefits of pure functions
console.log("\n=== Benefits of Pure Functions ===");

// TODO: Easier testing
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
}

// Easy to test - no setup needed
console.log("Palindrome tests:");
console.log('  "racecar":', isPalindrome("racecar"));
console.log('  "hello":', isPalindrome("hello"));
console.log(
  '  "A man a plan a canal Panama":',
  isPalindrome("A man a plan a canal Panama")
);

// TODO: Easier reasoning and debugging
function processOrder(order, discountRate) {
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = subtotal * discountRate;
  const total = subtotal - discount;

  return {
    ...order,
    subtotal,
    discount,
    total
  };
}

const sampleOrder = {
  id: "123",
  items: [
    { name: "Item 1", price: 10, quantity: 2 },
    { name: "Item 2", price: 15, quantity: 1 }
  ]
};

console.log("Processed order:", processOrder(sampleOrder, 0.1));

// Instructions:
// 1. Understand the definition of pure functions
// 2. Practice identifying pure vs impure functions
// 3. Convert impure functions to pure versions
// 4. Use pure functions for data transformations
// 5. Compose pure functions for complex operations
// 6. Test pure functions easily without mocking
// 7. Understand the benefits of referential transparency
// 8. Avoid common pitfalls that break purity
