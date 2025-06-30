// Exercise 1.5: Rest Parameters in Practice
// Objective: Master rest parameters for flexible function signatures

// Task 1: Basic Rest Parameters
// TODO: Create functions using rest parameters
function sum(...numbers) {
  // Calculate sum of any number of arguments
  // Your code here
  // return numbers.reduce((total, num) => total + num, 0);
}

function createList(title, ...items) {
  // Create a list with title and variable number of items
  // Your code here
  // return {
  //   title,
  //   items,
  //   count: items.length
  // };
}

// Task 2: Rest with Destructuring
// TODO: Combine rest parameters with destructuring
function processUserData({ name, email }, ...additionalInfo) {
  // Process user data with additional variable information
  // Your code here
  // return {
  //   name,
  //   email,
  //   additionalInfo,
  //   hasAdditionalInfo: additionalInfo.length > 0
  // };
}

function extractFirstAndRest([first, ...rest]) {
  // Extract first element and rest using array destructuring with rest
  // Your code here
  // return {
  //   first,
  //   rest,
  //   restCount: rest.length
  // };
}

// Task 3: Advanced Rest Patterns
// TODO: More complex rest parameter scenarios
function logMessage(level, timestamp, ...messageParts) {
  // Create logging function with level, timestamp, and variable message parts
  // Your code here
  // const message = messageParts.join(' ');
  // return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
}

function calculateStatistics(operation, ...values) {
  // Perform different statistical operations on variable number of values
  // Your code here
  // switch (operation) {
  //   case 'mean':
  //     return values.reduce((sum, val) => sum + val, 0) / values.length;
  //   case 'min':
  //     return Math.min(...values);
  //   case 'max':
  //     return Math.max(...values);
  //   case 'count':
  //     return values.length;
  //   default:
  //     return null;
  // }
}

// Task 4: Rest in Object Destructuring
// TODO: Use rest in object destructuring
function separateUserFields({ id, name, ...otherFields }) {
  // Separate essential fields from other fields
  // Your code here
  // return {
  //   essentialFields: { id, name },
  //   otherFields,
  //   hasOtherFields: Object.keys(otherFields).length > 0
  // };
}

// Task 5: Middleware Pattern with Rest
// TODO: Create middleware pattern using rest parameters
function createMiddleware(finalHandler, ...middlewares) {
  // Create a middleware chain that processes data through multiple functions
  // Your code here
  // return function(data) {
  //   let result = data;
  //   for (const middleware of middlewares) {
  //     result = middleware(result);
  //   }
  //   return finalHandler(result);
  // };
}

// Task 6: Validation with Rest
// TODO: Create validation functions using rest parameters
function validateAll(value, ...validators) {
  // Run value through multiple validator functions
  // Your code here
  // const results = validators.map(validator => {
  //   try {
  //     return { valid: validator(value), error: null };
  //   } catch (error) {
  //     return { valid: false, error: error.message };
  //   }
  // });
  //
  // return {
  //   isValid: results.every(result => result.valid),
  //   results
  // };
}

// Helper functions for tests
const isString = (val) => typeof val === "string";
const isNotEmpty = (val) => val && val.length > 0;
const isEmail = (val) => val.includes("@");

// Test Cases
console.log("=== Rest Parameters Exercise Tests ===\\n");

// console.log('Test 1 - Basic rest parameters:');
// console.log(sum(1, 2, 3, 4, 5)); // 15
// console.log(createList('Shopping List', 'Milk', 'Bread', 'Eggs'));

// console.log('Test 2 - Rest with destructuring:');
// const user = { name: 'Alice', email: 'alice@example.com' };
// console.log(processUserData(user, 'age: 30', 'city: NY', 'status: active'));
// console.log(extractFirstAndRest([1, 2, 3, 4, 5]));

// console.log('Test 3 - Advanced rest patterns:');
// console.log(logMessage('error', '2023-01-01T10:00:00Z', 'Database', 'connection', 'failed'));
// console.log(calculateStatistics('mean', 10, 20, 30, 40)); // 25
// console.log(calculateStatistics('max', 5, 15, 8, 22, 3)); // 22

// console.log('Test 4 - Rest in object destructuring:');
// const userData = {
//   id: 1,
//   name: 'John',
//   age: 30,
//   city: 'NY',
//   occupation: 'Developer'
// };
// console.log(separateUserFields(userData));

// console.log('Test 5 - Middleware pattern:');
// const addOne = x => x + 1;
// const double = x => x * 2;
// const square = x => x * x;
// const process = createMiddleware(x => `Result: ${x}`, addOne, double, square);
// console.log(process(2)); // Result: 36 ((2+1)*2)^2

// console.log('Test 6 - Validation:');
// console.log(validateAll('test@example.com', isString, isNotEmpty, isEmail));
// console.log(validateAll('', isString, isNotEmpty, isEmail));

console.log("Complete the TODOs and uncomment tests!");
