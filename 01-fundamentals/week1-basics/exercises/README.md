# Week 1 Exercises 💪

Complete these exercises to reinforce your understanding of variables, data types, and operators.

## 🎯 Exercise 1: Personal Information Manager

Create a script that manages personal information using different variable types and operators.

```javascript
// TODO: Declare variables for the following using appropriate keywords (const/let)
// - Full name (string)
// - Age (number)
// - Is student (boolean)
// - Favorite colors (array)
// - Address (object with street, city, zip)

// TODO: Create a function that formats and displays the information
function displayPersonInfo() {
  // Your code here
}

// TODO: Test your function
displayPersonInfo();
```

## 🎯 Exercise 2: Type Conversion Practice

```javascript
// Predict the output of these expressions before running them:

console.log("5" + 3); // Prediction: ?
console.log("5" - 3); // Prediction: ?
console.log("5" * "2"); // Prediction: ?
console.log("hello" - 1); // Prediction: ?
console.log(true + 1); // Prediction: ?
console.log(false + 1); // Prediction: ?
console.log(null + 1); // Prediction: ?
console.log(undefined + 1); // Prediction: ?

// TODO: Write a function that converts values to different types safely
function safeConvert(value, targetType) {
  // Convert 'value' to 'targetType' ("string", "number", "boolean")
  // Handle edge cases and return appropriate defaults
  // Your code here
}

// Test cases
console.log(safeConvert("123", "number")); // Should return 123
console.log(safeConvert("abc", "number")); // Should handle gracefully
console.log(safeConvert(0, "boolean")); // Should return false
console.log(safeConvert("", "boolean")); // Should return false
```

## 🎯 Exercise 3: Calculator Challenge

```javascript
// Create a comprehensive calculator that handles edge cases
function advancedCalculator(num1, operator, num2) {
  // TODO: Implement the following:
  // 1. Support +, -, *, /, %, ** operators
  // 2. Handle division by zero
  // 3. Validate inputs (check if numbers are valid)
  // 4. Return appropriate error messages for invalid operations
  // 5. Round results to 2 decimal places when necessary
  // Your code here
}

// Test cases
console.log(advancedCalculator(10, "+", 5)); // 15
console.log(advancedCalculator(10, "/", 0)); // Handle division by zero
console.log(advancedCalculator("10", "*", 5)); // Should work with string numbers
console.log(advancedCalculator(10, "^", 5)); // Invalid operator
console.log(advancedCalculator("abc", "+", 5)); // Invalid number
```

## 🎯 Exercise 4: Age Category Classifier

```javascript
// Create a function that classifies people into age groups
function classifyAge(age) {
  // TODO: Implement age classification:
  // 0-2: "Baby"
  // 3-5: "Toddler"
  // 6-12: "Child"
  // 13-19: "Teenager"
  // 20-39: "Young Adult"
  // 40-59: "Adult"
  // 60+: "Senior"
  // Invalid age: "Invalid age"
  // Use appropriate operators and control structures
  // Your code here
}

// Test cases
console.log(classifyAge(1)); // "Baby"
console.log(classifyAge(15)); // "Teenager"
console.log(classifyAge(25)); // "Young Adult"
console.log(classifyAge(-5)); // "Invalid age"
console.log(classifyAge("abc")); // "Invalid age"
```

## 🎯 Exercise 5: Shopping Cart Calculator

```javascript
// Create a shopping cart system that calculates totals with discounts
function calculateTotal(items, discountPercent = 0, taxRate = 0.08) {
  // TODO: Implement the following:
  // 1. Calculate subtotal from items array (each item has {name, price, quantity})
  // 2. Apply discount percentage
  // 3. Calculate tax on discounted amount
  // 4. Return object with {subtotal, discount, tax, total}
  // 5. Handle edge cases (empty cart, invalid values)
  // Your code here
}

// Test data
const cartItems = [
  { name: "Laptop", price: 999.99, quantity: 1 },
  { name: "Mouse", price: 25.5, quantity: 2 },
  { name: "Keyboard", price: 75.0, quantity: 1 }
];

console.log(calculateTotal(cartItems, 10, 0.08)); // 10% discount, 8% tax
console.log(calculateTotal([], 5, 0.08)); // Empty cart
console.log(calculateTotal(cartItems, -5, 0.08)); // Invalid discount
```

## 🎯 Bonus Exercise: Variable Scope Explorer

```javascript
// Explore variable scope and hoisting
var globalVar = "I'm global";
let globalLet = "I'm also global";
const globalConst = "I'm global too";

function scopeTest() {
  console.log("Inside function:");
  // TODO: Try to access the global variables here

  if (true) {
    var functionScoped = "I'm function scoped";
    let blockScoped = "I'm block scoped";
    const alsoBlockScoped = "Me too";

    // TODO: console.log all variables here
  }

  // TODO: Try to access the variables declared in the if block
  // Which ones work and which ones don't? Why?
}

scopeTest();

// TODO: Try to access functionScoped, blockScoped, and alsoBlockScoped here
// What happens?
```

## 🏆 Solutions

Solutions will be provided in a separate file. Try to complete all exercises before checking the solutions!

## 📝 Self-Assessment

After completing these exercises, you should be able to:

- [ ] Declare variables using appropriate keywords
- [ ] Understand and predict type conversion results
- [ ] Use all types of operators correctly
- [ ] Handle edge cases in your code
- [ ] Understand variable scope concepts

## 🔗 Next Steps

Once you've completed these exercises:

1. Check your solutions against the provided answers
2. Review any concepts that were challenging
3. Move on to [Control Structures](../03-control-structures.md)
