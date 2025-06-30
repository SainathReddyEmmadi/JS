// Exercise 1.4: Spread Operator Applications
// Objective: Master the spread operator for arrays, objects, and function calls

// Task 1: Array Spreading
// TODO: Use spread operator for array operations
function combineArrays(arr1, arr2, arr3) {
  // Combine all arrays into one
  // Your code here
  // return [...arr1, ...arr2, ...arr3];
}

function insertElements(originalArray, newElements, position) {
  // Insert newElements at specified position in originalArray
  // Your code here
  // return [
  //   ...originalArray.slice(0, position),
  //   ...newElements,
  //   ...originalArray.slice(position)
  // ];
}

// Task 2: Object Spreading
// TODO: Use spread operator for object operations
function mergeUserProfiles(baseProfile, updates) {
  // Merge updates into baseProfile, with updates taking precedence
  // Your code here
  // return { ...baseProfile, ...updates };
}

function updateNestedSettings(settings, userPreferences) {
  // Update nested settings object while preserving existing values
  // Input: settings = { ui: { theme: 'light', lang: 'en' }, privacy: { cookies: true } }
  // userPreferences = { ui: { theme: 'dark' } }
  // Your code here
  // return {
  //   ...settings,
  //   ui: { ...settings.ui, ...userPreferences.ui },
  //   privacy: { ...settings.privacy, ...userPreferences.privacy }
  // };
}

// Task 3: Function Call Spreading
// TODO: Use spread operator in function calls
function findMinMax(numbers) {
  // Find min and max from array using Math.min/Math.max
  // Your code here
  // return {
  //   min: Math.min(...numbers),
  //   max: Math.max(...numbers)
  // };
}

function logWithTimestamp(level, ...messages) {
  // Create logging function that accepts level and multiple message arguments
  // Your code here
  // const timestamp = new Date().toISOString();
  // console.log(`[${timestamp}] ${level.toUpperCase()}:`, ...messages);
}

// Task 4: Converting Iterables
// TODO: Use spread to convert different iterables
function processString(str) {
  // Convert string to array of characters, remove duplicates, and sort
  // Your code here
  // const chars = [...str];
  // const unique = [...new Set(chars)];
  // return unique.sort();
}

function convertNodeListToArray(nodeList) {
  // Convert NodeList to regular array (simulate with array-like object)
  // Your code here
  // return [...nodeList];
}

// Task 5: Cloning and Copying
// TODO: Use spread for shallow cloning
function createBackup(originalData) {
  // Create shallow copies of arrays and objects
  // Input: { users: [{ name: 'Alice' }], settings: { theme: 'dark' } }
  // Your code here
  // return {
  //   users: [...originalData.users],
  //   settings: { ...originalData.settings }
  // };
}

// Task 6: Advanced Spreading Patterns
// TODO: Complex spreading scenarios
function transformDataStructure(data) {
  // Input: { items: [1, 2, 3], metadata: { count: 3, type: 'numbers' } }
  // Output: { ...metadata, items: [...items, newItem], processed: true }
  // Your code here
  // return {
  //   ...data.metadata,
  //   items: [...data.items, 'newItem'],
  //   processed: true
  // };
}

// Test Cases
console.log("=== Spread Operator Exercise Tests ===\\n");

// console.log('Test 1 - Array combining:');
// console.log(combineArrays([1, 2], [3, 4], [5, 6]));
// console.log(insertElements([1, 2, 5, 6], [3, 4], 2));

// console.log('Test 2 - Object merging:');
// const base = { name: 'John', age: 30, city: 'NY' };
// const updates = { age: 31, country: 'USA' };
// console.log(mergeUserProfiles(base, updates));

// const settings = {
//   ui: { theme: 'light', lang: 'en' },
//   privacy: { cookies: true }
// };
// const prefs = { ui: { theme: 'dark' } };
// console.log(updateNestedSettings(settings, prefs));

// console.log('Test 3 - Function call spreading:');
// console.log(findMinMax([5, 2, 8, 1, 9, 3]));
// logWithTimestamp('info', 'User logged in', 'Session started');

// console.log('Test 4 - Converting iterables:');
// console.log(processString('hello world'));
// const arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
// console.log(convertNodeListToArray(arrayLike));

// console.log('Test 5 - Cloning:');
// const original = {
//   users: [{ name: 'Alice' }],
//   settings: { theme: 'dark' }
// };
// console.log(createBackup(original));

// console.log('Test 6 - Advanced patterns:');
// const complexData = {
//   items: [1, 2, 3],
//   metadata: { count: 3, type: 'numbers' }
// };
// console.log(transformDataStructure(complexData));

console.log("Complete the TODOs and uncomment tests!");
