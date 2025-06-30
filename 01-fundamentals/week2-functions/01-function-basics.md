# Functions and Scope 🔧

## 🎯 Learning Objectives

- Master different ways to create and use functions
- Understand function declarations vs expressions vs arrow functions
- Learn about parameters, arguments, and return values
- Grasp scope concepts and the `this` keyword
- Understand hoisting and its implications
- Practice with real-world function examples

## 📖 What are Functions?

Functions are reusable blocks of code that perform specific tasks. They're one of the fundamental building blocks of JavaScript.

```javascript
// Think of a function like a recipe
function makeCoffee(type, size) {
  console.log(`Making a ${size} ${type} coffee...`);
  return `Your ${size} ${type} is ready! ☕`;
}

const myOrder = makeCoffee("latte", "large");
console.log(myOrder); // "Your large latte is ready! ☕"
```

## 🏗️ Function Declarations

### Basic Function Declaration

```javascript
// Function declaration - can be called before it's defined (hoisting)
console.log(greet("Alice")); // Works! "Hello, Alice!"

function greet(name) {
  return `Hello, ${name}!`;
}

// Function with multiple parameters
function calculateArea(length, width) {
  const area = length * width;
  return area;
}

console.log(calculateArea(5, 3)); // 15
```

### Function with Default Parameters (ES6+)

```javascript
function greetWithDefault(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log(greetWithDefault()); // "Hello, Guest!"
console.log(greetWithDefault("Bob")); // "Hello, Bob!"
console.log(greetWithDefault("Charlie", "Hi")); // "Hi, Charlie!"
```

### Rest Parameters

```javascript
function sum(...numbers) {
  let total = 0;
  for (const num of numbers) {
    total += num;
  }
  return total;
}

console.log(sum(1, 2, 3)); // 6
console.log(sum(1, 2, 3, 4, 5)); // 15
console.log(sum()); // 0
```

## 📝 Function Expressions

### Basic Function Expression

```javascript
// Function expression - cannot be called before it's defined
// console.log(sayHello("Alice")); // ❌ Error: Cannot access before initialization

const sayHello = function (name) {
  return `Hello, ${name}!`;
};

console.log(sayHello("Alice")); // ✅ "Hello, Alice!"
```

### Named Function Expression

```javascript
const factorial = function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1); // Can reference itself using 'fact'
};

console.log(factorial(5)); // 120
// console.log(fact(5)); // ❌ Error: fact is not defined outside
```

### Function Expression vs Declaration

```javascript
// Declaration - hoisted (available before definition)
console.log(declared(5)); // Works! Returns 25

function declared(x) {
  return x * x;
}

// Expression - not hoisted
// console.log(expressed(5)); // ❌ Error: Cannot access before initialization

const expressed = function (x) {
  return x * x;
};

console.log(expressed(5)); // ✅ Works! Returns 25
```

## 🏹 Arrow Functions (ES6+)

### Basic Arrow Function Syntax

```javascript
// Traditional function expression
const add = function (a, b) {
  return a + b;
};

// Arrow function - concise syntax
const addArrow = (a, b) => {
  return a + b;
};

// Even more concise (implicit return)
const addConcise = (a, b) => a + b;

// Single parameter (parentheses optional)
const square = (x) => x * x;
const squareExplicit = (x) => x * x; // Both work

// No parameters
const greetWorld = () => "Hello, World!";

console.log(addConcise(3, 4)); // 7
console.log(square(5)); // 25
console.log(greetWorld()); // "Hello, World!"
```

### Arrow Functions with Objects

```javascript
// Returning an object (wrap in parentheses)
const createPerson = (name, age) => ({
  name: name,
  age: age,
  greet() {
    return `Hi, I'm ${this.name}`;
  }
});

// Using shorthand property syntax
const createPersonShort = (name, age) => ({ name, age });

const person = createPerson("Alice", 30);
console.log(person); // { name: "Alice", age: 30, greet: [Function] }
```

### When NOT to Use Arrow Functions

```javascript
// ❌ Avoid for object methods (this binding issues)
const calculator = {
  value: 0,
  add: function (x) {
    this.value += x;
    return this;
  },
  // Don't use arrow function here
  subtract: (x) => {
    // this.value -= x; // ❌ 'this' doesn't refer to calculator
    return this; // 'this' is undefined or global object
  }
};

// ❌ Avoid for event handlers when you need 'this'
document.addEventListener("click", function () {
  console.log(this); // 'this' refers to document
});

document.addEventListener("click", () => {
  console.log(this); // 'this' refers to global object/undefined
});
```

## 📊 Parameters and Arguments

### Understanding the Difference

```javascript
// Parameters are the variables in the function definition
function processOrder(customerName, itemName, quantity) {
  // customerName, itemName, quantity are parameters
  console.log(`Processing order for ${customerName}`);
  console.log(`Item: ${itemName}, Quantity: ${quantity}`);
}

// Arguments are the actual values passed to the function
processOrder("Alice", "Laptop", 1); // "Alice", "Laptop", 1 are arguments
```

### The Arguments Object (Traditional Functions)

```javascript
function showArguments() {
  console.log(arguments); // Array-like object
  console.log(arguments.length);
  console.log(arguments[0]); // First argument
}

showArguments("hello", 42, true);
// Arguments object: { 0: "hello", 1: 42, 2: true, length: 3 }

// ❌ Arrow functions don't have arguments object
const arrowFunc = () => {
  // console.log(arguments); // Error: arguments is not defined
};
```

### Destructuring Parameters

```javascript
// Object destructuring
function processUser({ name, age, email }) {
  console.log(`User: ${name}, Age: ${age}, Email: ${email}`);
}

const user = { name: "Bob", age: 25, email: "bob@email.com" };
processUser(user);

// Array destructuring
function processCoordinates([x, y, z = 0]) {
  console.log(`X: ${x}, Y: ${y}, Z: ${z}`);
}

processCoordinates([10, 20]); // Z defaults to 0
processCoordinates([10, 20, 30]);
```

## 🔄 Return Statements

### Basic Returns

```javascript
function add(a, b) {
  return a + b; // Explicit return
}

function greet(name) {
  if (!name) {
    return "Hello, Guest!"; // Early return
  }
  return `Hello, ${name}!`;
}

function doSomething() {
  console.log("Doing something...");
  // No explicit return - returns undefined
}

console.log(add(3, 4)); // 7
console.log(greet()); // "Hello, Guest!"
console.log(doSomething()); // undefined
```

### Returning Functions (Higher-Order Functions)

```javascript
function createMultiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(4)); // 12

// Arrow function version
const createMultiplierArrow = (factor) => (number) => number * factor;
const quadruple = createMultiplierArrow(4);
console.log(quadruple(3)); // 12
```

### Returning Multiple Values

```javascript
// Using arrays
function getNameParts(fullName) {
  const parts = fullName.split(" ");
  return [parts[0], parts[parts.length - 1]]; // [firstName, lastName]
}

const [firstName, lastName] = getNameParts("John Doe Smith");
console.log(firstName, lastName); // "John", "Smith"

// Using objects
function analyzeText(text) {
  return {
    length: text.length,
    words: text.split(" ").length,
    uppercase: text.toUpperCase(),
    lowercase: text.toLowerCase()
  };
}

const analysis = analyzeText("Hello World");
console.log(analysis.words); // 2
```

## 🌐 Scope Concepts

### Global vs Local Scope

```javascript
// Global scope
let globalVar = "I'm global";
const globalConst = "I'm also global";

function demonstrateScope() {
  // Local scope
  let localVar = "I'm local";
  const localConst = "I'm also local";

  console.log(globalVar); // ✅ Can access global
  console.log(localVar); // ✅ Can access local

  // Modifying global from local
  globalVar = "Modified from function";
}

demonstrateScope();
console.log(globalVar); // "Modified from function"
// console.log(localVar); // ❌ Error: localVar is not defined
```

### Function Scope vs Block Scope

```javascript
function scopeDemo() {
  var functionScoped = "I'm function scoped";
  let blockScoped = "I'm block scoped";
  const alsoBlockScoped = "Me too";

  if (true) {
    var innerFunction = "Still function scoped";
    let innerBlock = "Block scoped to this if";
    const innerBlockConst = "Also block scoped to this if";

    console.log(functionScoped); // ✅ Works
    console.log(blockScoped); // ✅ Works
    console.log(innerFunction); // ✅ Works
    console.log(innerBlock); // ✅ Works
  }

  console.log(innerFunction); // ✅ Works (var is function scoped)
  // console.log(innerBlock); // ❌ Error (let is block scoped)
  // console.log(innerBlockConst); // ❌ Error (const is block scoped)
}

scopeDemo();
```

### Scope Chain

```javascript
const outerVar = "outer";

function outerFunction() {
  const middleVar = "middle";

  function innerFunction() {
    const innerVar = "inner";

    // Can access all variables in the scope chain
    console.log(innerVar); // "inner" - local scope
    console.log(middleVar); // "middle" - parent scope
    console.log(outerVar); // "outer" - global scope
  }

  innerFunction();
  // console.log(innerVar); // ❌ Error - can't access child scope
}

outerFunction();
```

## 🔄 Hoisting Explained

### Function Declaration Hoisting

```javascript
// This works because function declarations are hoisted
console.log(hoistedFunction()); // "I'm hoisted!"

function hoistedFunction() {
  return "I'm hoisted!";
}

// Variable hoisting with var
console.log(hoistedVar); // undefined (not an error!)
var hoistedVar = "Now I have a value";
console.log(hoistedVar); // "Now I have a value"
```

### Let and Const Hoisting (Temporal Dead Zone)

```javascript
// console.log(letVar); // ❌ ReferenceError: Cannot access before initialization
// console.log(constVar); // ❌ ReferenceError: Cannot access before initialization

let letVar = "I'm a let variable";
const constVar = "I'm a const variable";

// Function expressions are not hoisted
// console.log(notHoisted()); // ❌ TypeError: notHoisted is not a function

var notHoisted = function () {
  return "I'm not hoisted";
};
```

### Practical Hoisting Example

```javascript
// What actually happens behind the scenes:
// var myVar; // hoisted declaration
// function myFunction() { return "hoisted"; } // hoisted function

console.log(myVar); // undefined
console.log(myFunction()); // "hoisted"

var myVar = "Hello";

function myFunction() {
  return "hoisted";
}
```

## 🎯 The `this` Keyword Basics

### `this` in Regular Functions

```javascript
// Global context
console.log(this); // Window object (browser) or global object (Node.js)

function regularFunction() {
  console.log(this); // Window/global in non-strict mode, undefined in strict mode
}

// Object method
const person = {
  name: "Alice",
  age: 30,
  greet: function () {
    console.log(this); // The person object
    console.log(`Hello, I'm ${this.name}`);
  }
};

person.greet(); // "Hello, I'm Alice"
```

### `this` in Arrow Functions

```javascript
const obj = {
  name: "Bob",
  regularMethod: function () {
    console.log("Regular method this:", this.name); // "Bob"

    const arrowFunction = () => {
      console.log("Arrow function this:", this.name); // "Bob" (inherits from parent)
    };

    arrowFunction();
  },

  arrowMethod: () => {
    console.log("Arrow method this:", this.name); // undefined (global context)
  }
};

obj.regularMethod();
obj.arrowMethod();
```

### Binding `this` Explicitly

```javascript
const person1 = { name: "Alice" };
const person2 = { name: "Bob" };

function introduce() {
  console.log(`Hi, I'm ${this.name}`);
}

// Call with different contexts
introduce.call(person1); // "Hi, I'm Alice"
introduce.call(person2); // "Hi, I'm Bob"

// Bind creates a new function with fixed 'this'
const boundIntroduce = introduce.bind(person1);
boundIntroduce(); // "Hi, I'm Alice"
```

## 🎯 Practical Examples

### Example 1: Calculator with Methods

```javascript
const calculator = {
  result: 0,

  add: function (value) {
    this.result += value;
    return this; // Enable method chaining
  },

  subtract: function (value) {
    this.result -= value;
    return this;
  },

  multiply: function (value) {
    this.result *= value;
    return this;
  },

  divide: function (value) {
    if (value !== 0) {
      this.result /= value;
    }
    return this;
  },

  clear: function () {
    this.result = 0;
    return this;
  },

  getValue: function () {
    return this.result;
  }
};

// Method chaining
const result = calculator.clear().add(10).multiply(3).subtract(5).getValue();

console.log(result); // 25
```

### Example 2: User Management System

```javascript
function createUserManager() {
  const users = [];

  return {
    addUser: function (name, email) {
      const user = {
        id: users.length + 1,
        name: name,
        email: email,
        createdAt: new Date()
      };
      users.push(user);
      return user;
    },

    findUser: function (id) {
      return users.find((user) => user.id === id);
    },

    getAllUsers: function () {
      return [...users]; // Return a copy
    },

    updateUser: function (id, updates) {
      const user = this.findUser(id);
      if (user) {
        Object.assign(user, updates);
        return user;
      }
      return null;
    },

    deleteUser: function (id) {
      const index = users.findIndex((user) => user.id === id);
      if (index !== -1) {
        return users.splice(index, 1)[0];
      }
      return null;
    }
  };
}

const userManager = createUserManager();
userManager.addUser("Alice", "alice@email.com");
userManager.addUser("Bob", "bob@email.com");
console.log(userManager.getAllUsers());
```

## 🏃‍♂️ Quick Practice Exercises

### Exercise 1: Function Conversion

```javascript
// Convert this function declaration to:
// 1. Function expression
// 2. Arrow function
// 3. Arrow function with implicit return (if possible)

function calculateTip(billAmount, tipPercent = 15) {
  const tip = (billAmount * tipPercent) / 100;
  return {
    billAmount: billAmount,
    tipPercent: tipPercent,
    tipAmount: tip,
    totalAmount: billAmount + tip
  };
}

// Your conversions here...
```

### Exercise 2: Scope Challenge

```javascript
// Predict the output of this code:
var a = 1;
let b = 2;
const c = 3;

function testScope() {
  console.log(a, b, c); // ?

  if (true) {
    var a = 4;
    let b = 5;
    const c = 6;
    console.log(a, b, c); // ?
  }

  console.log(a, b, c); // ?
}

testScope();
console.log(a, b, c); // ?
```

### Exercise 3: `this` Context

```javascript
// Fix the arrow function issue in this object:
const counter = {
  count: 0,
  increment: () => {
    this.count++; // This doesn't work as expected
    console.log(this.count);
  },

  decrement: function () {
    this.count--;
    console.log(this.count);
  }
};

// How would you fix the increment method?
```

## 🔗 Next Steps

After mastering functions and scope:

- Practice with the comprehensive exercises in the exercises folder
- Move on to [Arrays and Objects](../week3-data-structures/)
- Build a mini-project using functions

## 📚 Additional Resources

- [MDN: Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN: Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [JavaScript.info: Functions](https://javascript.info/function-basics)
