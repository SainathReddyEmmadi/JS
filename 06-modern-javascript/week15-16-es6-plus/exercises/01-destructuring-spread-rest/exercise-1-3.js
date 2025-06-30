// Exercise 1.3: Function Parameter Destructuring
// Objective: Master destructuring in function parameters for cleaner APIs

// Task 1: Basic Parameter Destructuring
// TODO: Create function that takes object parameter with destructuring
function greetUser({ name, age, city }) {
  // Your code here
  // return `Hello ${name}, age ${age}, from ${city}!`;
}

// Task 2: Parameter Destructuring with Defaults
// TODO: Function with default values in destructured parameters
function createPost({
  title,
  content,
  author = "Anonymous",
  published = false,
  tags = []
}) {
  // Your code here
  // return {
  //   title,
  //   content,
  //   author,
  //   published,
  //   tags,
  //   createdAt: new Date()
  // };
}

// Task 3: Nested Parameter Destructuring
// TODO: Destructure nested objects in parameters
function processOrder({
  customer: { name, email },
  items,
  shipping: { address, method = "standard" }
}) {
  // Your code here
  // return {
  //   customerName: name,
  //   customerEmail: email,
  //   itemCount: items.length,
  //   shippingAddress: address,
  //   shippingMethod: method
  // };
}

// Task 4: Array Parameter Destructuring
// TODO: Destructure array parameters
function calculateStats([first, second, third, ...rest]) {
  // Your code here
  // return {
  //   first,
  //   second,
  //   third,
  //   remaining: rest.length,
  //   total: [first, second, third, ...rest].length
  // };
}

// Task 5: Mixed Parameter Destructuring
// TODO: Combine object and array destructuring in parameters
function analyzeData(
  { dataset, options: { limit = 10, sort = "asc" } = {} },
  [filter, transform]
) {
  // Your code here
  // const filtered = dataset.filter(filter);
  // const transformed = filtered.map(transform);
  // const sorted = sort === 'asc'
  //   ? transformed.sort((a, b) => a - b)
  //   : transformed.sort((a, b) => b - a);
  // return sorted.slice(0, limit);
}

// Test Cases
console.log("=== Function Parameter Destructuring Tests ===\\n");

// console.log('Test 1 - Basic parameter destructuring:');
// console.log(greetUser({ name: 'Alice', age: 30, city: 'New York' }));

// console.log('Test 2 - Parameter defaults:');
// console.log(createPost({
//   title: 'My Post',
//   content: 'Post content',
//   tags: ['javascript', 'tutorial']
// }));

// console.log('Test 3 - Nested parameter destructuring:');
// const order = {
//   customer: { name: 'John Doe', email: 'john@example.com' },
//   items: [{ id: 1 }, { id: 2 }],
//   shipping: { address: '123 Main St', method: 'express' }
// };
// console.log(processOrder(order));

// console.log('Test 4 - Array parameter destructuring:');
// console.log(calculateStats([10, 20, 30, 40, 50, 60]));

// console.log('Test 5 - Mixed parameter destructuring:');
// const data = {
//   dataset: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
//   options: { limit: 5, sort: 'desc' }
// };
// const filters = [x => x > 3, x => x * 2];
// console.log(analyzeData(data, filters));

console.log("Complete the TODOs and uncomment tests!");
