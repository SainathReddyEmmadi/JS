/**
 * Exercise 4-1: Arrow Function Basics and This Binding
 *
 * Practice arrow function syntax and understand this binding differences.
 */

console.log("Starting Exercise 4-1: Arrow Function Basics and This Binding");

// TODO: Convert these regular functions to arrow functions
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function greet(name) {
  return `Hello, ${name}!`;
}

// TODO: Convert to arrow functions
// const addArrow =
// const multiplyArrow =
// const greetArrow =

// Array methods with arrow functions
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// TODO: Use arrow functions with array methods
// Filter even numbers
const evenNumbers = numbers.filter((n) => n % 2 === 0);

// Map to squares
const squares = numbers.map((n) => n * n);

// Reduce to sum
const sum = numbers.reduce((acc, n) => acc + n, 0);

console.log("Even numbers:", evenNumbers);
console.log("Squares:", squares);
console.log("Sum:", sum);

// This binding demonstration
const person = {
  name: "Alice",

  // Regular function method
  greetRegular: function () {
    console.log(`Regular function - Hello, I'm ${this.name}`);
  },

  // Arrow function method
  greetArrow: () => {
    console.log(`Arrow function - Hello, I'm ${this.name}`);
  },

  // Method that uses both
  demonstrateThis: function () {
    console.log("Inside regular method:", this.name);

    // Regular function in setTimeout
    setTimeout(function () {
      console.log("setTimeout regular function:", this.name);
    }, 100);

    // Arrow function in setTimeout
    setTimeout(() => {
      console.log("setTimeout arrow function:", this.name);
    }, 200);
  }
};

person.greetRegular();
person.greetArrow();
person.demonstrateThis();

// TODO: Create an object with methods that demonstrate this binding
const calculator = {
  value: 0,

  // TODO: Implement these methods using appropriate function types
  add(num) {
    // TODO: Regular function that adds to this.value
  },

  multiply: (num) => {
    // TODO: Arrow function - will this work as expected?
  },

  getValue() {
    // TODO: Return this.value
  }
};

// Instructions:
// 1. Convert the regular functions to arrow functions
// 2. Complete the array method exercises using arrow functions
// 3. Run the this binding demonstration and observe the differences
// 4. Complete the calculator object and test the methods
// 5. Explain why arrow functions behave differently with 'this'
