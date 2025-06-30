// Exercise 02: First-Class Functions
// Difficulty: 🟢 Beginner
// Topic: Functions as values, arguments, and return values

console.log("=== Exercise 02: First-Class Functions ===\n");

// TODO 1: Assign Function to Variable
// Create a function that doubles a number and assign it to a variable
// Then create another variable that references the same function

// Your code here:

// TODO 2: Function as Object Property
// Create an object that stores different utility functions as properties

// Your code here:

// TODO 3: Function as Array Element
// Create an array of functions that process strings in different ways
// (uppercase, lowercase, reverse, length)

// Your code here:

// TODO 4: Pass Function as Argument
// Create a function 'processNumber' that takes a number and a function
// Apply the function to the number and return the result

// Your code here:

// TODO 5: Return Function from Function
// Create a function 'createMultiplier' that takes a number and returns
// a function that multiplies its input by that number

// Your code here:

// TODO 6: Function that Returns Multiple Functions
// Create a function 'createMathOperations' that returns an object
// containing add, subtract, multiply, and divide functions

// Your code here:

// TODO 7: Higher-Order Function with Callback
// Create a function 'repeat' that takes a function and a number,
// then calls the function that many times

// Your code here:

// TODO 8: Function Factory with Closure
// Create a function 'createCounter' that returns a function
// The returned function should increment and return a count each time it's called

// Your code here:

// ==================== TESTS ====================

function runTests() {
  console.log("Running tests...\n");

  try {
    // Test 1: Function Variables
    console.log("Test 1 - Function Variables:");
    console.log(double(5)); // Expected: 10
    console.log(doubleAlias(5)); // Expected: 10
    console.log(double === doubleAlias); // Expected: true

    // Test 2: Function as Object Property
    console.log("\nTest 2 - Function as Object Property:");
    console.log(utilities.formatCurrency(1234.56)); // Expected: "$1,234.56"
    console.log(utilities.capitalizeWords("hello world")); // Expected: "Hello World"

    // Test 3: Function as Array Element
    console.log("\nTest 3 - Functions in Array:");
    const text = "Hello World";
    stringProcessors.forEach((processor, index) => {
      console.log(`Processor ${index + 1}:`, processor(text));
    });

    // Test 4: Pass Function as Argument
    console.log("\nTest 4 - Function as Argument:");
    console.log(processNumber(10, (x) => x * x)); // Expected: 100
    console.log(processNumber(8, (x) => x / 2)); // Expected: 4

    // Test 5: Return Function from Function
    console.log("\nTest 5 - Return Function:");
    const multiplyBy3 = createMultiplier(3);
    const multiplyBy5 = createMultiplier(5);
    console.log(multiplyBy3(4)); // Expected: 12
    console.log(multiplyBy5(6)); // Expected: 30

    // Test 6: Function Returning Multiple Functions
    console.log("\nTest 6 - Multiple Function Return:");
    const mathOps = createMathOperations(10);
    console.log(mathOps.add(5)); // Expected: 15
    console.log(mathOps.subtract(3)); // Expected: 7
    console.log(mathOps.multiply(4)); // Expected: 40
    console.log(mathOps.divide(2)); // Expected: 5

    // Test 7: Higher-Order Function with Callback
    console.log("\nTest 7 - Repeat Function:");
    repeat(() => console.log("Hello!"), 3); // Expected: prints "Hello!" 3 times

    // Test 8: Function Factory with Closure
    console.log("\nTest 8 - Counter Factory:");
    const counter1 = createCounter();
    const counter2 = createCounter();
    console.log(counter1()); // Expected: 1
    console.log(counter1()); // Expected: 2
    console.log(counter2()); // Expected: 1
    console.log(counter1()); // Expected: 3

    console.log("\n✅ All tests completed!");
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

// Uncomment the line below to run tests
// runTests();

// ==================== BONUS CHALLENGES ====================

// BONUS 1: Create a function 'pipe' that takes multiple functions as arguments
// and returns a function that applies them in sequence
// Example: pipe(add1, multiply2, subtract3)(5) = ((5+1)*2)-3 = 9

// Your code here:

// BONUS 2: Create a function 'memoize' that takes a function and returns
// a memoized version that caches results for previously seen inputs

// Your code here:

// BONUS 3: Create a function 'throttle' that limits how often a function can be called
// It should take a function and a delay, returning a throttled version

// Your code here:

// BONUS 4: Create a function composition utility that works with async functions

// Your code here:

// ==================== LEARNING NOTES ====================
/*
Key Concepts to Remember:

1. First-Class Functions:
   - Functions can be assigned to variables
   - Functions can be passed as arguments
   - Functions can be returned from other functions
   - Functions can be stored in data structures

2. Function References:
   - When you assign a function to a variable, you're creating a reference
   - Multiple variables can reference the same function

3. Callbacks:
   - Functions passed as arguments to other functions
   - Allow for customizable behavior

4. Factory Functions:
   - Functions that create and return other functions
   - Often use closures to maintain state

5. Higher-Order Functions:
   - Functions that operate on other functions
   - Either take functions as arguments or return functions

6. Closures:
   - Inner functions have access to outer function's variables
   - Variables persist even after outer function returns
*/
