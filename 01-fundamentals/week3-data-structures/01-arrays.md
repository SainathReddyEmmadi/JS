# Arrays: JavaScript's Swiss Army Knife 🔧

## 🎯 Learning Objectives

- Master array creation and basic manipulation
- Understand essential array methods and when to use them
- Learn array iteration techniques and patterns
- Practice with real-world array scenarios
- Build confidence with array transformations

## 📝 What are Arrays?

Arrays are ordered collections of data. Think of them as lists that can hold any type of values.

```javascript
// Arrays can hold different types of data
const mixedArray = [1, "hello", true, null, { name: "Alice" }, [1, 2, 3]];

// But typically, arrays hold similar types of data
const numbers = [1, 2, 3, 4, 5];
const names = ["Alice", "Bob", "Charlie"];
const products = [
  { name: "Laptop", price: 999 },
  { name: "Phone", price: 599 },
  { name: "Tablet", price: 399 }
];
```

## 🏗️ Creating Arrays

### Array Literal (Most Common)

```javascript
// Empty array
const emptyArray = [];

// Array with initial values
const fruits = ["apple", "banana", "orange"];

// Array with numbers
const numbers = [1, 2, 3, 4, 5];

// Multi-dimensional array
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
```

### Array Constructor

```javascript
// Empty array with specific length
const arrayWithLength = new Array(5); // [empty × 5]
console.log(arrayWithLength.length); // 5

// Array with initial values
const fruits2 = new Array("apple", "banana", "orange");

// Be careful with single number argument!
const confusing = new Array(3); // Creates array with 3 empty slots
const notConfusing = [3]; // Creates array with one element: 3
```

### Array.from() and Array.of()

```javascript
// Array.from() - creates array from array-like objects
const stringArray = Array.from("hello"); // ["h", "e", "l", "l", "o"]
const rangeArray = Array.from({ length: 5 }, (_, i) => i + 1); // [1, 2, 3, 4, 5]

// Array.of() - creates array from arguments
const numbers1 = Array.of(1, 2, 3); // [1, 2, 3]
const numbers2 = Array.of(5); // [5] (not empty array with 5 slots)
```

## 🔧 Basic Array Properties and Methods

### Length Property

```javascript
const fruits = ["apple", "banana", "orange"];
console.log(fruits.length); // 3

// Changing length affects the array
fruits.length = 2;
console.log(fruits); // ["apple", "banana"]

fruits.length = 5;
console.log(fruits); // ["apple", "banana", empty × 3]
```

### Adding Elements

```javascript
const fruits = ["apple", "banana"];

// push() - add to end (returns new length)
const newLength = fruits.push("orange");
console.log(fruits); // ["apple", "banana", "orange"]
console.log(newLength); // 3

// unshift() - add to beginning (returns new length)
fruits.unshift("grape");
console.log(fruits); // ["grape", "apple", "banana", "orange"]

// Using index assignment
fruits[fruits.length] = "kiwi"; // Add to end
console.log(fruits); // ["grape", "apple", "banana", "orange", "kiwi"]
```

### Removing Elements

```javascript
const fruits = ["grape", "apple", "banana", "orange", "kiwi"];

// pop() - remove from end (returns removed element)
const lastFruit = fruits.pop();
console.log(lastFruit); // "kiwi"
console.log(fruits); // ["grape", "apple", "banana", "orange"]

// shift() - remove from beginning (returns removed element)
const firstFruit = fruits.shift();
console.log(firstFruit); // "grape"
console.log(fruits); // ["apple", "banana", "orange"]

// delete operator (creates hole - avoid this!)
delete fruits[1];
console.log(fruits); // ["apple", empty, "orange"]
console.log(fruits.length); // 3 (length unchanged!)
```

### Splice Method - The Swiss Army Knife

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];

// splice(start, deleteCount, ...itemsToAdd)
// Remove elements
const removed = numbers.splice(2, 3); // Remove 3 elements starting at index 2
console.log(removed); // [3, 4, 5]
console.log(numbers); // [1, 2, 6, 7, 8]

// Add elements without removing
numbers.splice(2, 0, "a", "b"); // Add "a", "b" at index 2
console.log(numbers); // [1, 2, "a", "b", 6, 7, 8]

// Replace elements
numbers.splice(2, 2, "x", "y", "z"); // Replace 2 elements with 3 new ones
console.log(numbers); // [1, 2, "x", "y", "z", 6, 7, 8]
```

## 🔍 Array Search Methods

### indexOf and lastIndexOf

```javascript
const numbers = [1, 2, 3, 2, 4, 2, 5];

console.log(numbers.indexOf(2)); // 1 (first occurrence)
console.log(numbers.lastIndexOf(2)); // 5 (last occurrence)
console.log(numbers.indexOf(99)); // -1 (not found)

// includes() - returns boolean
console.log(numbers.includes(3)); // true
console.log(numbers.includes(99)); // false
```

### Find Methods

```javascript
const products = [
  { id: 1, name: "Laptop", price: 999, category: "Electronics" },
  { id: 2, name: "Phone", price: 599, category: "Electronics" },
  { id: 3, name: "Book", price: 29, category: "Education" },
  { id: 4, name: "Tablet", price: 399, category: "Electronics" }
];

// find() - returns first matching element
const expensiveProduct = products.find((product) => product.price > 500);
console.log(expensiveProduct); // { id: 1, name: "Laptop", price: 999, category: "Electronics" }

// findIndex() - returns index of first matching element
const bookIndex = products.findIndex(
  (product) => product.category === "Education"
);
console.log(bookIndex); // 2

// some() - returns true if any element matches
const hasExpensiveProducts = products.some((product) => product.price > 800);
console.log(hasExpensiveProducts); // true

// every() - returns true if all elements match
const allElectronics = products.every(
  (product) => product.category === "Electronics"
);
console.log(allElectronics); // false
```

## 🔄 Array Iteration

### Traditional Loops

```javascript
const fruits = ["apple", "banana", "orange", "grape"];

// for loop
for (let i = 0; i < fruits.length; i++) {
  console.log(`${i}: ${fruits[i]}`);
}

// for...of loop (ES6)
for (const fruit of fruits) {
  console.log(fruit);
}

// for...in loop (gets indices, not recommended for arrays)
for (const index in fruits) {
  console.log(`${index}: ${fruits[index]}`);
}
```

### Array Methods for Iteration

```javascript
const numbers = [1, 2, 3, 4, 5];

// forEach() - execute function for each element
numbers.forEach((number, index, array) => {
  console.log(`Index ${index}: ${number}`);
});

// map() - create new array with transformed elements
const doubled = numbers.map((number) => number * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// filter() - create new array with elements that pass test
const evenNumbers = numbers.filter((number) => number % 2 === 0);
console.log(evenNumbers); // [2, 4]

// reduce() - reduce array to single value
const sum = numbers.reduce((accumulator, current) => accumulator + current, 0);
console.log(sum); // 15

// reduceRight() - same as reduce but from right to left
const concatenated = ["a", "b", "c"].reduceRight((acc, curr) => acc + curr, "");
console.log(concatenated); // "cba"
```

## 🎯 Practical Array Examples

### Example 1: Shopping Cart

```javascript
const shoppingCart = [
  { id: 1, name: "Laptop", price: 999, quantity: 1 },
  { id: 2, name: "Mouse", price: 25, quantity: 2 },
  { id: 3, name: "Keyboard", price: 75, quantity: 1 },
  { id: 4, name: "Monitor", price: 299, quantity: 1 }
];

// Calculate total price
const totalPrice = shoppingCart.reduce((total, item) => {
  return total + item.price * item.quantity;
}, 0);
console.log(`Total: $${totalPrice}`); // Total: $1423

// Get items over $50
const expensiveItems = shoppingCart.filter((item) => item.price > 50);
console.log(expensiveItems);

// Update quantities
const updatedCart = shoppingCart.map((item) => {
  if (item.name === "Mouse") {
    return { ...item, quantity: 3 };
  }
  return item;
});

// Check if cart has specific item
const hasLaptop = shoppingCart.some((item) => item.name === "Laptop");
console.log(`Has laptop: ${hasLaptop}`); // true
```

### Example 2: Student Grade Management

```javascript
const students = [
  { name: "Alice", grades: [85, 92, 78, 96] },
  { name: "Bob", grades: [76, 84, 89, 72] },
  { name: "Charlie", grades: [94, 87, 91, 89] },
  { name: "Diana", grades: [68, 72, 75, 71] }
];

// Calculate average grade for each student
const studentsWithAverages = students.map((student) => {
  const average =
    student.grades.reduce((sum, grade) => sum + grade, 0) /
    student.grades.length;
  return {
    ...student,
    average: Math.round(average * 100) / 100 // Round to 2 decimal places
  };
});

console.log(studentsWithAverages);

// Find top performer
const topStudent = studentsWithAverages.reduce((top, current) => {
  return current.average > top.average ? current : top;
});
console.log(`Top student: ${topStudent.name} (${topStudent.average}%)`);

// Students who passed (average >= 80)
const passingStudents = studentsWithAverages.filter(
  (student) => student.average >= 80
);
console.log(`${passingStudents.length} students passed`);
```

### Example 3: Data Processing Pipeline

```javascript
const rawData = [
  "  Alice,25,Engineer  ",
  "Bob,30,Designer",
  "  Charlie,28,Developer  ",
  "Diana,22,Student",
  "Eve,35,Manager"
];

// Process the data: clean, parse, and transform
const processedData = rawData
  .map((line) => line.trim()) // Remove whitespace
  .map((line) => line.split(",")) // Split into array
  .map(([name, age, profession]) => ({
    // Destructure and create object
    name: name.trim(),
    age: parseInt(age),
    profession: profession.trim(),
    isAdult: parseInt(age) >= 21
  }))
  .filter((person) => person.age >= 25) // Filter adults 25+
  .sort((a, b) => a.age - b.age); // Sort by age

console.log(processedData);
```

## 🔄 Array Transformation Patterns

### Chaining Methods

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const result = numbers
  .filter((n) => n % 2 === 0) // Get even numbers: [2, 4, 6, 8, 10]
  .map((n) => n * n) // Square them: [4, 16, 36, 64, 100]
  .reduce((sum, n) => sum + n, 0); // Sum them up: 220

console.log(result); // 220
```

### Flattening Arrays

```javascript
const nestedArray = [
  [1, 2],
  [3, 4],
  [5, 6]
];

// flat() method (ES2019)
const flattened = nestedArray.flat();
console.log(flattened); // [1, 2, 3, 4, 5, 6]

// Deep flattening
const deepNested = [1, [2, [3, [4, 5]]]];
const deepFlattened = deepNested.flat(Infinity);
console.log(deepFlattened); // [1, 2, 3, 4, 5]

// flatMap() - map then flatten
const sentences = ["Hello world", "How are you"];
const words = sentences.flatMap((sentence) => sentence.split(" "));
console.log(words); // ["Hello", "world", "How", "are", "you"]
```

### Grouping Data

```javascript
const products = [
  { name: "Laptop", category: "Electronics", price: 999 },
  { name: "Phone", category: "Electronics", price: 599 },
  { name: "Book", category: "Education", price: 29 },
  { name: "Pen", category: "Education", price: 5 },
  { name: "Tablet", category: "Electronics", price: 399 }
];

// Group by category
const groupedProducts = products.reduce((groups, product) => {
  const category = product.category;
  if (!groups[category]) {
    groups[category] = [];
  }
  groups[category].push(product);
  return groups;
}, {});

console.log(groupedProducts);
// {
//   Electronics: [Laptop, Phone, Tablet],
//   Education: [Book, Pen]
// }
```

## 🚨 Common Array Pitfalls

### Modifying Arrays During Iteration

```javascript
const numbers = [1, 2, 3, 4, 5];

// ❌ Don't modify array while iterating
numbers.forEach((num, index) => {
  if (num % 2 === 0) {
    numbers.splice(index, 1); // This causes issues!
  }
});

// ✅ Better approach - filter to new array
const oddNumbers = numbers.filter((num) => num % 2 !== 0);

// ✅ Or iterate backwards if you must modify original
for (let i = numbers.length - 1; i >= 0; i--) {
  if (numbers[i] % 2 === 0) {
    numbers.splice(i, 1);
  }
}
```

### Reference vs Value

```javascript
const original = [1, 2, 3];
const reference = original; // Same array reference
const copy = [...original]; // New array (shallow copy)

reference.push(4);
console.log(original); // [1, 2, 3, 4] - modified!
console.log(reference); // [1, 2, 3, 4]

copy.push(5);
console.log(original); // [1, 2, 3, 4] - unchanged
console.log(copy); // [1, 2, 3, 5]
```

### Sparse Arrays

```javascript
const sparse = [1, , , 4]; // Has holes
console.log(sparse.length); // 4
console.log(sparse[1]); // undefined

// Different methods handle sparse arrays differently
console.log(sparse.map((x) => x * 2)); // [2, empty × 2, 8]
console.log(sparse.filter((x) => true)); // [1, 4] - holes removed!
```

## 🏃‍♂️ Quick Practice Exercises

### Exercise 1: Array Utilities

```javascript
// Create utility functions for common array operations

function removeDuplicates(array) {
  // Remove duplicate values from array
  // Your code here
}

function chunk(array, size) {
  // Split array into chunks of specified size
  // chunk([1,2,3,4,5], 2) should return [[1,2], [3,4], [5]]
  // Your code here
}

function shuffle(array) {
  // Randomly shuffle array elements (don't modify original)
  // Your code here
}

// Test your functions
console.log(removeDuplicates([1, 2, 2, 3, 3, 4])); // [1, 2, 3, 4]
console.log(chunk([1, 2, 3, 4, 5, 6, 7], 3)); // [[1,2,3], [4,5,6], [7]]
console.log(shuffle([1, 2, 3, 4, 5])); // Random order
```

### Exercise 2: Data Analysis

```javascript
const salesData = [
  { product: "Laptop", month: "Jan", sales: 1200 },
  { product: "Phone", month: "Jan", sales: 800 },
  { product: "Laptop", month: "Feb", sales: 1500 },
  { product: "Phone", month: "Feb", sales: 900 },
  { product: "Tablet", month: "Jan", sales: 600 },
  { product: "Tablet", month: "Feb", sales: 750 }
];

// TODO: Implement these analysis functions
function getTotalSales(data) {
  // Return total sales across all products and months
}

function getSalesByProduct(data) {
  // Return object with total sales per product
}

function getBestSellingProduct(data) {
  // Return the product with highest total sales
}

function getMonthlySales(data) {
  // Return object with total sales per month
}

// Test your functions
console.log(getTotalSales(salesData));
console.log(getSalesByProduct(salesData));
console.log(getBestSellingProduct(salesData));
console.log(getMonthlySales(salesData));
```

## 🔗 Next Steps

After mastering arrays:

- Learn about [Objects and Object Methods](./02-objects.md)
- Practice with comprehensive exercises
- Build projects that combine arrays and objects

## 📚 Additional Resources

- [MDN: Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [JavaScript.info: Arrays](https://javascript.info/array)
- [JavaScript.info: Array methods](https://javascript.info/array-methods)
