// Exercise 1.1: Array Destructuring Patterns
// Objective: Master array destructuring syntax including nested patterns, default values, and rest elements

// Task 1: Basic Array Destructuring
// TODO: Extract first, second, and third elements from the array
function getFirstThreeElements(arr) {
  // Your code here
  // const [first, second, third] = arr;
  // return { first, second, third };
}

// Task 2: Skipping Elements
// TODO: Extract first and third elements, skipping the second
function getFirstAndThird(arr) {
  // Your code here
  // const [first, , third] = arr;
  // return { first, third };
}

// Task 3: Default Values
// TODO: Extract elements with default values
function getWithDefaults(arr) {
  // Use defaults: name='Anonymous', age=0, city='Unknown'
  // Your code here
  // const [name = 'Anonymous', age = 0, city = 'Unknown'] = arr;
  // return { name, age, city };
}

// Task 4: Rest Elements
// TODO: Extract first element and collect rest
function separateFirstFromRest(arr) {
  // Your code here
  // const [first, ...rest] = arr;
  // return { first, rest };
}

// Task 5: Nested Destructuring
// TODO: Destructure nested arrays
function processNestedArrays(arr) {
  // Input: [[1, 2], [3, 4], [5, 6]]
  // Extract: firstPair's first element, secondPair's second element
  // Your code here
  // const [[firstOfFirst], [, secondOfSecond]] = arr;
  // return { firstOfFirst, secondOfSecond };
}

// Task 6: Swapping Variables
// TODO: Swap two variables using destructuring
function swapValues(a, b) {
  // Your code here
  // [a, b] = [b, a];
  // return { a, b };
}

// Bonus Challenge: Complex Data Structure
// TODO: Extract data from a complex nested structure
function processComplexData(data) {
  // Input: [
  //   { coords: [10, 20], info: { name: 'Point A', active: true } },
  //   { coords: [30, 40], info: { name: 'Point B', active: false } }
  // ]
  // Extract: first point's x coordinate, second point's name
  // Your code here
  // const [{ coords: [firstX] }, { info: { name: secondName } }] = data;
  // return { firstX, secondName };
}

// Test Cases
console.log("=== Array Destructuring Exercise Tests ===\n");

// Uncomment these tests once you implement the functions:

// console.log('Test 1 - Basic destructuring:');
// console.log(getFirstThreeElements([1, 2, 3, 4, 5]));
// console.log('Expected: { first: 1, second: 2, third: 3 }\n');

// console.log('Test 2 - Skipping elements:');
// console.log(getFirstAndThird([10, 20, 30, 40]));
// console.log('Expected: { first: 10, third: 30 }\n');

// console.log('Test 3 - Default values:');
// console.log(getWithDefaults(['Alice', 25]));
// console.log('Expected: { name: "Alice", age: 25, city: "Unknown" }\n');

// console.log('Test 4 - Rest elements:');
// console.log(separateFirstFromRest([1, 2, 3, 4, 5]));
// console.log('Expected: { first: 1, rest: [2, 3, 4, 5] }\n');

// console.log('Test 5 - Nested destructuring:');
// console.log(processNestedArrays([[1, 2], [3, 4], [5, 6]]));
// console.log('Expected: { firstOfFirst: 1, secondOfSecond: 4 }\n');

// console.log('Test 6 - Swapping values:');
// console.log(swapValues(10, 20));
// console.log('Expected: { a: 20, b: 10 }\n');

// console.log('Bonus - Complex data:');
// const complexData = [
//     { coords: [10, 20], info: { name: 'Point A', active: true } },
//     { coords: [30, 40], info: { name: 'Point B', active: false } }
// ];
// console.log(processComplexData(complexData));
// console.log('Expected: { firstX: 10, secondName: "Point B" }\n');

console.log(
  "Complete the TODOs above and uncomment the tests to verify your solutions!"
);
