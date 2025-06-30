// Exercise 21: Basic Currying
// Difficulty: 🟡 Intermediate
// Topic: Understanding and implementing currying

console.log("=== Exercise 21: Basic Currying ===\n");

// TODO 1: Manual Currying - Addition
// Convert this regular function into a curried version
// function add(a, b, c) { return a + b + c; }

// Your code here:

// TODO 2: Manual Currying - String Formatting
// Create a curried function for string formatting
// formatString(template)(value1)(value2)
// Example: formatString("Hello {0}, welcome to {1}")("John")("our site")

// Your code here:

// TODO 3: Generic Curry Function
// Implement a generic curry function that can curry any function
// It should work with functions of any arity (number of parameters)

// Your code here:

// TODO 4: Curried Array Operations
// Create curried versions of common array operations

// Your code here:

// TODO 5: Curried Validation Functions
// Create curried validation functions for form inputs

// Your code here:

// TODO 6: Curried Configuration Function
// Create a curried function for API requests that allows pre-configuration

// Your code here:

// TODO 7: Curried Math Operations
// Create a set of curried mathematical functions

// Your code here:

// TODO 8: Auto-Currying with Variable Arguments
// Create a curry function that works with functions having variable arguments

// Your code here:

// ==================== TESTS ====================

function runTests() {
  console.log("Running tests...\n");

  try {
    // Test 1: Manual Currying - Addition
    console.log("Test 1 - Curried Addition:");
    console.log(curriedAdd(1)(2)(3)); // Expected: 6
    console.log(curriedAdd(5)(10)(15)); // Expected: 30

    // Test 2: String Formatting
    console.log("\nTest 2 - String Formatting:");
    const greetUser = formatString("Hello {0}, welcome to {1}");
    console.log(greetUser("Alice")("our website"));

    // Test 3: Generic Curry
    console.log("\nTest 3 - Generic Curry:");
    const multiply = (a, b, c) => a * b * c;
    const curriedMultiply = curry(multiply);
    console.log(curriedMultiply(2)(3)(4)); // Expected: 24
    console.log(curriedMultiply(2, 3)(4)); // Expected: 24
    console.log(curriedMultiply(2)(3, 4)); // Expected: 24

    // Test 4: Curried Array Operations
    console.log("\nTest 4 - Curried Array Operations:");
    const numbers = [1, 2, 3, 4, 5];
    const doubleFilter = curriedFilter((x) => x % 2 === 0);
    const doubleMap = curriedMap((x) => x * 2);

    console.log(doubleFilter(numbers)); // Expected: [2, 4]
    console.log(doubleMap(numbers)); // Expected: [2, 4, 6, 8, 10]

    // Test 5: Curried Validation
    console.log("\nTest 5 - Curried Validation:");
    const validateName = validateRequired("Name");
    const validateEmail = validateEmail("Email");

    console.log(validateName("")); // Expected: error message
    console.log(validateName("John")); // Expected: null or success
    console.log(validateEmail("invalid")); // Expected: error message
    console.log(validateEmail("john@example.com")); // Expected: null or success

    // Test 6: API Configuration
    console.log("\nTest 6 - API Configuration:");
    const apiGet = makeApiRequest("GET")("https://api.example.com");
    const userEndpoint = apiGet("/users");
    console.log("API request configured for:", userEndpoint.toString());

    // Test 7: Curried Math
    console.log("\nTest 7 - Curried Math:");
    const powerOf2 = power(2);
    const powerOf3 = power(3);
    console.log(powerOf2(4)); // Expected: 16
    console.log(powerOf3(2)); // Expected: 8

    const calculateDiscount = percentage(10);
    console.log(calculateDiscount(100)); // Expected: 10

    // Test 8: Variable Arguments
    console.log("\nTest 8 - Variable Arguments:");
    const sumAll = (...args) => args.reduce((a, b) => a + b, 0);
    const curriedSumAll = autoCurry(sumAll, 3); // Specify expected arity
    console.log(curriedSumAll(1)(2)(3)); // Expected: 6

    console.log("\n✅ All tests completed!");
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

// Uncomment the line below to run tests
// runTests();

// ==================== BONUS CHALLENGES ====================

// BONUS 1: Implement currying with named parameters
// Create a function that allows currying with named parameters instead of positional

// Your code here:

// BONUS 2: Create a curry function that can be "uncurried"
// Implement both curry and uncurry functions

// Your code here:

// BONUS 3: Implement partial application vs full currying
// Show the difference and create both implementations

// Your code here:

// BONUS 4: Create a curry function that works with async functions

// Your code here:

// ==================== PRACTICAL EXAMPLES ====================

// Example 1: Building a logging system with currying
function createLoggerExample() {
  // Your implementation here
}

// Example 2: Creating reusable database query functions
function createDatabaseExample() {
  // Your implementation here
}

// Example 3: Form validation pipeline
function createValidationExample() {
  // Your implementation here
}

// ==================== LEARNING NOTES ====================
/*
Key Concepts to Remember:

1. Currying Basics:
   - Transform f(a, b, c) into f(a)(b)(c)
   - Each function call returns another function until all arguments are provided
   - Enables partial application and function reuse

2. Manual vs Generic Currying:
   - Manual: Write curried versions by hand
   - Generic: Use a curry utility to transform any function

3. Benefits of Currying:
   - Function reusability and composition
   - Configuration and specialization
   - Point-free programming style
   - Better function composition

4. Currying vs Partial Application:
   - Currying: Always returns single-argument functions
   - Partial Application: Can accept multiple arguments at once

5. Practical Applications:
   - Configuration functions
   - Validation pipelines
   - API request builders
   - Event handlers
   - Mathematical operations

6. Performance Considerations:
   - Curried functions create more function objects
   - Consider memoization for expensive operations
   - Use judiciously in performance-critical code

Common Patterns:
- Configuration: config(setting1)(setting2)(data)
- Validation: validate(rules)(field)(value)
- API: request(method)(url)(headers)(data)
- Math: operation(operand1)(operand2)
*/
