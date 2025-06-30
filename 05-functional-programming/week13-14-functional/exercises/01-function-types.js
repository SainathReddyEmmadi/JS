// Exercise 01: Function Types and Declarations
// Difficulty: 🟢 Beginner
// Topic: Understanding different ways to create and use functions

console.log("=== Exercise 01: Function Types ===\n");

// TODO 1: Function Declaration
// Create a function declaration named 'greet' that takes a name parameter
// and returns "Hello, [name]!"

// Your code here:

// TODO 2: Function Expression
// Create a function expression stored in a variable named 'farewell'
// that takes a name parameter and returns "Goodbye, [name]!"

// Your code here:

// TODO 3: Arrow Function (Single Parameter)
// Create an arrow function named 'shout' that takes a message parameter
// and returns the message in uppercase with exclamation marks

// Your code here:

// TODO 4: Arrow Function (Multiple Parameters)
// Create an arrow function named 'calculateArea' that takes width and height
// and returns their product

// Your code here:

// TODO 5: Arrow Function (No Parameters)
// Create an arrow function named 'getCurrentTime' that returns the current timestamp

// Your code here:

// TODO 6: Method in Object
// Create an object named 'calculator' with methods add, subtract, multiply, divide
// Each method should take two parameters and return the result

// Your code here:

// TODO 7: Function Constructor (Advanced)
// Create a function constructor 'Person' that takes name and age parameters
// Add a method 'introduce' that returns "Hi, I'm [name] and I'm [age] years old"

// Your code here:

// TODO 8: Anonymous Function in Array
// Create an array of anonymous functions that perform different math operations
// Each function should take two numbers and return a result

// Your code here:

// ==================== TESTS ====================
// Do not modify the test section

function runTests() {
  console.log("Running tests...\n");

  try {
    // Test 1: Function Declaration
    console.log("Test 1 - Function Declaration:");
    console.log(greet("Alice")); // Expected: "Hello, Alice!"

    // Test 2: Function Expression
    console.log("\nTest 2 - Function Expression:");
    console.log(farewell("Bob")); // Expected: "Goodbye, Bob!"

    // Test 3: Arrow Function (Single Parameter)
    console.log("\nTest 3 - Arrow Function (Single):");
    console.log(shout("hello world")); // Expected: "HELLO WORLD!!!"

    // Test 4: Arrow Function (Multiple Parameters)
    console.log("\nTest 4 - Arrow Function (Multiple):");
    console.log(calculateArea(5, 3)); // Expected: 15

    // Test 5: Arrow Function (No Parameters)
    console.log("\nTest 5 - Arrow Function (No Parameters):");
    console.log(typeof getCurrentTime()); // Expected: "number"

    // Test 6: Method in Object
    console.log("\nTest 6 - Object Methods:");
    console.log(calculator.add(5, 3)); // Expected: 8
    console.log(calculator.subtract(10, 4)); // Expected: 6
    console.log(calculator.multiply(4, 3)); // Expected: 12
    console.log(calculator.divide(15, 3)); // Expected: 5

    // Test 7: Function Constructor
    console.log("\nTest 7 - Function Constructor:");
    const john = new Person("John", 30);
    console.log(john.introduce()); // Expected: "Hi, I'm John and I'm 30 years old"

    // Test 8: Anonymous Functions in Array
    console.log("\nTest 8 - Anonymous Functions:");
    console.log(mathOperations[0](10, 5)); // Expected: 15 (addition)
    console.log(mathOperations[1](10, 5)); // Expected: 5 (subtraction)
    console.log(mathOperations[2](10, 5)); // Expected: 50 (multiplication)
    console.log(mathOperations[3](10, 5)); // Expected: 2 (division)

    console.log("\n✅ All tests completed!");
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

// Uncomment the line below to run tests
// runTests();

// ==================== BONUS CHALLENGES ====================

// BONUS 1: Create a function that accepts any number of arguments and returns their sum
// Hint: Use rest parameters (...)

// Your code here:

// BONUS 2: Create a function that returns different types based on the parameter type
// If number: return square, if string: return uppercase, if array: return length

// Your code here:

// BONUS 3: Create a recursive function to calculate factorial

// Your code here:

// ==================== LEARNING NOTES ====================
/*
Key Concepts to Remember:

1. Function Declaration vs Expression:
   - Declarations are hoisted, expressions are not
   - Declarations create named functions, expressions can be anonymous

2. Arrow Functions:
   - Shorter syntax for simple functions
   - Don't have their own 'this' binding
   - Cannot be used as constructors

3. Methods:
   - Functions defined as object properties
   - Have access to 'this' context

4. Function Constructors:
   - Used to create object instances
   - Convention: capitalize the name
   - Use 'new' keyword to invoke

5. Anonymous Functions:
   - Functions without names
   - Often used as callbacks or in arrays/objects
*/
