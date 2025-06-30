/**
 * Exercise 05: Array Higher-Order Functions
 *
 * Master the built-in array methods: map, filter, reduce, forEach, find, some, every
 * and understand their functional programming principles.
 */

console.log("Starting Exercise 05: Array Higher-Order Functions");

// Sample data for exercises
const products = [
  {
    id: 1,
    name: "Laptop",
    price: 999.99,
    category: "Electronics",
    inStock: true
  },
  {
    id: 2,
    name: "Coffee Mug",
    price: 12.99,
    category: "Kitchen",
    inStock: true
  },
  { id: 3, name: "Book", price: 24.99, category: "Education", inStock: false },
  {
    id: 4,
    name: "Smartphone",
    price: 699.99,
    category: "Electronics",
    inStock: true
  },
  {
    id: 5,
    name: "Desk Chair",
    price: 199.99,
    category: "Furniture",
    inStock: false
  },
  { id: 6, name: "Notebook", price: 8.99, category: "Education", inStock: true }
];

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const words = ["apple", "banana", "cherry", "date", "elderberry", "fig"];

// Map - Transform each element
console.log("\n=== Array.map() Examples ===");

// TODO: Transform numbers to their squares
const squares = numbers.map((num) => num * num);
console.log("Squares:", squares);

// TODO: Extract product names
const productNames = products.map((product) => product.name);
console.log("Product names:", productNames);

// TODO: Add tax to prices (8% tax)
const productsWithTax = products.map((product) => ({
  ...product,
  priceWithTax: (product.price * 1.08).toFixed(2)
}));
console.log("Products with tax:", productsWithTax);

// TODO: Transform words to uppercase with length
const wordInfo = words.map((word) => ({
  original: word,
  uppercase: word.toUpperCase(),
  length: word.length
}));
console.log("Word info:", wordInfo);

// Filter - Select elements that meet criteria
console.log("\n=== Array.filter() Examples ===");

// TODO: Filter even numbers
const evenNumbers = numbers.filter((num) => num % 2 === 0);
console.log("Even numbers:", evenNumbers);

// TODO: Filter products in stock
const inStockProducts = products.filter((product) => product.inStock);
console.log(
  "In stock products:",
  inStockProducts.map((p) => p.name)
);

// TODO: Filter expensive products (> $100)
const expensiveProducts = products.filter((product) => product.price > 100);
console.log(
  "Expensive products:",
  expensiveProducts.map((p) => `${p.name}: $${p.price}`)
);

// TODO: Filter electronics category
const electronics = products.filter(
  (product) => product.category === "Electronics"
);
console.log(
  "Electronics:",
  electronics.map((p) => p.name)
);

// TODO: Filter words longer than 5 characters
const longWords = words.filter((word) => word.length > 5);
console.log("Long words:", longWords);

// Reduce - Combine elements into a single value
console.log("\n=== Array.reduce() Examples ===");

// TODO: Sum all numbers
const sum = numbers.reduce((total, num) => total + num, 0);
console.log("Sum of numbers:", sum);

// TODO: Find maximum number
const max = numbers.reduce((maximum, num) => Math.max(maximum, num), -Infinity);
console.log("Maximum number:", max);

// TODO: Calculate total value of all products
const totalValue = products.reduce(
  (total, product) => total + product.price,
  0
);
console.log("Total product value:", totalValue.toFixed(2));

// TODO: Group products by category
const productsByCategory = products.reduce((groups, product) => {
  const category = product.category;
  if (!groups[category]) {
    groups[category] = [];
  }
  groups[category].push(product);
  return groups;
}, {});
console.log("Products by category:", productsByCategory);

// TODO: Count items by stock status
const stockCount = products.reduce((count, product) => {
  const key = product.inStock ? "inStock" : "outOfStock";
  count[key] = (count[key] || 0) + 1;
  return count;
}, {});
console.log("Stock count:", stockCount);

// TODO: Create a string from words
const sentence = words.reduce((text, word, index) => {
  return text + word + (index < words.length - 1 ? ", " : "");
}, "Fruits: ");
console.log("Sentence:", sentence);

// Find - Get first element that matches
console.log("\n=== Array.find() Examples ===");

// TODO: Find first number greater than 5
const firstLargeNumber = numbers.find((num) => num > 5);
console.log("First number > 5:", firstLargeNumber);

// TODO: Find product by ID
const productById = products.find((product) => product.id === 3);
console.log("Product with ID 3:", productById);

// TODO: Find first out of stock product
const outOfStockProduct = products.find((product) => !product.inStock);
console.log("First out of stock:", outOfStockProduct?.name);

// TODO: Find word that contains 'err'
const wordWithErr = words.find((word) => word.includes("err"));
console.log('Word containing "err":', wordWithErr);

// Some - Check if any element matches
console.log("\n=== Array.some() Examples ===");

// TODO: Check if any number is greater than 8
const hasLargeNumber = numbers.some((num) => num > 8);
console.log("Has number > 8:", hasLargeNumber);

// TODO: Check if any product is expensive (> $500)
const hasExpensiveProduct = products.some((product) => product.price > 500);
console.log("Has expensive product:", hasExpensiveProduct);

// TODO: Check if any product is out of stock
const hasOutOfStock = products.some((product) => !product.inStock);
console.log("Has out of stock items:", hasOutOfStock);

// Every - Check if all elements match
console.log("\n=== Array.every() Examples ===");

// TODO: Check if all numbers are positive
const allPositive = numbers.every((num) => num > 0);
console.log("All numbers positive:", allPositive);

// TODO: Check if all products have names
const allHaveNames = products.every(
  (product) => product.name && product.name.length > 0
);
console.log("All products have names:", allHaveNames);

// TODO: Check if all words start with lowercase
const allLowercase = words.every((word) => word[0] === word[0].toLowerCase());
console.log("All words start lowercase:", allLowercase);

// ForEach - Execute function for each element (side effects)
console.log("\n=== Array.forEach() Examples ===");

// TODO: Log each number with its index
console.log("Numbers with indices:");
numbers.forEach((num, index) => {
  console.log(`Index ${index}: ${num}`);
});

// TODO: Log product information
console.log("\nProduct information:");
products.forEach((product, index) => {
  const status = product.inStock ? "In Stock" : "Out of Stock";
  console.log(`${index + 1}. ${product.name} - $${product.price} (${status})`);
});

// Chaining array methods
console.log("\n=== Method Chaining Examples ===");

// TODO: Chain multiple operations
const result1 = numbers
  .filter((num) => num % 2 === 0) // Get even numbers
  .map((num) => num * num) // Square them
  .reduce((sum, num) => sum + num, 0); // Sum them

console.log("Sum of squares of even numbers:", result1);

// TODO: Complex product processing
const cheapElectronics = products
  .filter((product) => product.category === "Electronics")
  .filter((product) => product.price < 800)
  .map((product) => ({
    name: product.name,
    discountPrice: (product.price * 0.9).toFixed(2)
  }));

console.log("Cheap electronics with 10% discount:", cheapElectronics);

// TODO: Word processing chain
const processedWords = words
  .filter((word) => word.length >= 5)
  .map((word) => word.toUpperCase())
  .map((word) => `${word}!`)
  .sort();

console.log("Processed words:", processedWords);

// Advanced exercises
console.log("\n=== Advanced Exercises ===");

// TODO: Implement custom map function
function customMap(array, callback) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(callback(array[i], i, array));
  }
  return result;
}

const customMapped = customMap(numbers, (x) => x * 2);
console.log("Custom map result:", customMapped);

// TODO: Implement custom filter function
function customFilter(array, callback) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}

const customFiltered = customFilter(numbers, (x) => x > 5);
console.log("Custom filter result:", customFiltered);

// TODO: Implement custom reduce function
function customReduce(array, callback, initialValue) {
  let accumulator = initialValue;
  let startIndex = 0;

  if (initialValue === undefined) {
    accumulator = array[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < array.length; i++) {
    accumulator = callback(accumulator, array[i], i, array);
  }

  return accumulator;
}

const customSum = customReduce(numbers, (sum, num) => sum + num, 0);
console.log("Custom reduce sum:", customSum);

// TODO: Statistics calculator using array methods
function calculateStats(numbers) {
  const count = numbers.length;
  const sum = numbers.reduce((total, num) => total + num, 0);
  const mean = sum / count;
  const sorted = [...numbers].sort((a, b) => a - b);
  const median =
    count % 2 === 0
      ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
      : sorted[Math.floor(count / 2)];
  const min = numbers.reduce(
    (minimum, num) => Math.min(minimum, num),
    Infinity
  );
  const max = numbers.reduce(
    (maximum, num) => Math.max(maximum, num),
    -Infinity
  );

  return { count, sum, mean, median, min, max };
}

const stats = calculateStats(numbers);
console.log("Number statistics:", stats);

// TODO: Data analysis with products
function analyzeProducts(products) {
  const analysis = {
    total: products.length,
    inStock: products.filter((p) => p.inStock).length,
    categories: [...new Set(products.map((p) => p.category))],
    averagePrice:
      products.reduce((sum, p) => sum + p.price, 0) / products.length,
    priceRange: {
      min: products.reduce((min, p) => Math.min(min, p.price), Infinity),
      max: products.reduce((max, p) => Math.max(max, p.price), -Infinity)
    }
  };

  return analysis;
}

const productAnalysis = analyzeProducts(products);
console.log("Product analysis:", productAnalysis);

// Instructions:
// 1. Master each array method and understand when to use them
// 2. Practice method chaining for complex data transformations
// 3. Understand the difference between map/filter/reduce and forEach
// 4. Learn to avoid side effects in functional array methods
// 5. Implement custom versions to understand the underlying mechanics
// 6. Use array methods for real-world data analysis scenarios
// 7. Compare performance characteristics of different approaches
