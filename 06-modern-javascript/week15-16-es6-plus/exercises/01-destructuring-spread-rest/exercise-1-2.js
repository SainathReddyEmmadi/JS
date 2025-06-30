// Exercise 1.2: Object Destructuring with Defaults
// Objective: Master object destructuring patterns with renaming, defaults, and nested structures

// Task 1: Basic Object Destructuring
// TODO: Extract properties from user object
function extractUserInfo(user) {
  // Input: { name: 'Alice', age: 30, email: 'alice@example.com' }
  // Extract: name, age, email as separate variables
  // Your code here
  // const { name, age, email } = user;
  // return { name, age, email };
}

// Task 2: Destructuring with Renaming
// TODO: Extract properties with different variable names
function extractWithRenaming(config) {
  // Input: { apiUrl: 'https://api.com', timeout: 5000, retries: 3 }
  // Extract: apiUrl as url, timeout as delay, retries as attempts
  // Your code here
  // const { apiUrl: url, timeout: delay, retries: attempts } = config;
  // return { url, delay, attempts };
}

// Task 3: Default Values
// TODO: Extract properties with default values
function extractWithDefaults(settings) {
  // Use defaults: theme='light', notifications=true, language='en'
  // Your code here
  // const { theme = 'light', notifications = true, language = 'en' } = settings;
  // return { theme, notifications, language };
}

// Task 4: Nested Object Destructuring
// TODO: Extract nested properties
function extractNestedData(response) {
  // Input: {
  //   data: { user: { id: 1, profile: { name: 'Alice', avatar: 'pic.jpg' } } },
  //   meta: { status: 'success', timestamp: 1234567890 }
  // }
  // Extract: user id, profile name, meta status
  // Your code here
  // const {
  //   data: { user: { id, profile: { name } } },
  //   meta: { status }
  // } = response;
  // return { id, name, status };
}

// Task 5: Mixed Array and Object Destructuring
// TODO: Destructure mixed data structures
function extractMixedData(data) {
  // Input: {
  //   users: [
  //     { name: 'Alice', scores: [95, 87, 92] },
  //     { name: 'Bob', scores: [88, 94, 90] }
  //   ]
  // }
  // Extract: first user's name, first user's first score, second user's name
  // Your code here
  // const {
  //   users: [
  //     { name: firstName, scores: [firstScore] },
  //     { name: secondName }
  //   ]
  // } = data;
  // return { firstName, firstScore, secondName };
}

// Task 6: Function Parameter Destructuring
// TODO: Use destructuring in function parameters
function createUser({ name, age = 18, email, preferences = {} }) {
  // Extract name, age (default 18), email, preferences (default {}) from parameter
  // Your code here
  // const { theme = 'light', notifications = true } = preferences;
  // return {
  //   name,
  //   age,
  //   email,
  //   preferences: { theme, notifications }
  // };
}

// Task 7: Computed Property Names
// TODO: Use computed property names in destructuring
function extractDynamicProperties(obj, prop1, prop2) {
  // Extract properties using dynamic property names
  // Your code here
  // const { [prop1]: value1, [prop2]: value2 } = obj;
  // return { value1, value2 };
}

// Test Cases
console.log("=== Object Destructuring Exercise Tests ===\\n");

// Uncomment these tests once you implement the functions:

// console.log('Test 1 - Basic object destructuring:');
// const user = { name: 'Alice', age: 30, email: 'alice@example.com' };
// console.log(extractUserInfo(user));
// console.log('Expected: { name: "Alice", age: 30, email: "alice@example.com" }\\n');

// console.log('Test 2 - Destructuring with renaming:');
// const config = { apiUrl: 'https://api.com', timeout: 5000, retries: 3 };
// console.log(extractWithRenaming(config));
// console.log('Expected: { url: "https://api.com", delay: 5000, attempts: 3 }\\n');

// console.log('Test 3 - Default values:');
// console.log(extractWithDefaults({ theme: 'dark' }));
// console.log('Expected: { theme: "dark", notifications: true, language: "en" }\\n');

// console.log('Test 4 - Nested destructuring:');
// const response = {
//   data: { user: { id: 1, profile: { name: 'Alice', avatar: 'pic.jpg' } } },
//   meta: { status: 'success', timestamp: 1234567890 }
// };
// console.log(extractNestedData(response));
// console.log('Expected: { id: 1, name: "Alice", status: "success" }\\n');

// console.log('Test 5 - Mixed destructuring:');
// const mixedData = {
//   users: [
//     { name: 'Alice', scores: [95, 87, 92] },
//     { name: 'Bob', scores: [88, 94, 90] }
//   ]
// };
// console.log(extractMixedData(mixedData));
// console.log('Expected: { firstName: "Alice", firstScore: 95, secondName: "Bob" }\\n');

// console.log('Test 6 - Function parameter destructuring:');
// console.log(createUser({
//   name: 'Charlie',
//   email: 'charlie@example.com',
//   preferences: { theme: 'dark' }
// }));

// console.log('Test 7 - Computed properties:');
// const obj = { foo: 'value1', bar: 'value2', baz: 'value3' };
// console.log(extractDynamicProperties(obj, 'foo', 'baz'));
// console.log('Expected: { value1: "value1", value2: "value3" }\\n');

console.log(
  "Complete the TODOs above and uncomment the tests to verify your solutions!"
);
