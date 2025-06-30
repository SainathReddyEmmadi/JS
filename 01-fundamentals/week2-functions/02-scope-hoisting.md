# Scope and Hoisting Deep Dive 🔍

## 🎯 Learning Objectives

- Master the different types of scope in JavaScript
- Understand hoisting behavior for variables and functions
- Learn the intricacies of the `this` keyword
- Practice debugging scope-related issues
- Build mental models for how JavaScript executes code

## 🌐 Understanding Scope

Scope determines where variables and functions are accessible in your code. Think of scope as "visibility rules" for your variables.

### The Scope Chain Visualization

```javascript
// Global Scope (Level 0)
const globalVar = "I'm global";

function outerFunction() {
  // Function Scope (Level 1)
  const outerVar = "I'm in outer function";

  function innerFunction() {
    // Function Scope (Level 2)
    const innerVar = "I'm in inner function";

    // JavaScript looks for variables in this order:
    // 1. Current scope (innerVar)
    // 2. Parent scope (outerVar)
    // 3. Global scope (globalVar)
    console.log(innerVar); // Found in Level 2
    console.log(outerVar); // Found in Level 1
    console.log(globalVar); // Found in Level 0
  }

  innerFunction();
}

outerFunction();
```

### Global Scope: The Outer Layer

```javascript
// Everything declared at the top level is global
var globalVar = "Global with var";
let globalLet = "Global with let";
const globalConst = "Global with const";

// In browsers, var creates properties on window object
console.log(window.globalVar); // "Global with var" (browser only)
console.log(window.globalLet); // undefined (let doesn't create window properties)

// Global variables are accessible everywhere
function accessGlobals() {
  console.log(globalVar); // ✅ Accessible
  console.log(globalLet); // ✅ Accessible
  console.log(globalConst); // ✅ Accessible
}

accessGlobals();
```

### Function Scope: The Traditional Container

```javascript
function demonstrateFunctionScope() {
  // These variables are only accessible within this function
  var functionVar = "Function scoped";
  let functionLet = "Also function scoped";
  const functionConst = "Also function scoped";

  // Nested function can access parent function's variables
  function nested() {
    console.log(functionVar); // ✅ Works
    console.log(functionLet); // ✅ Works
    console.log(functionConst); // ✅ Works
  }

  nested();
}

demonstrateFunctionScope();
// console.log(functionVar); // ❌ ReferenceError: not defined
```

### Block Scope: The Modern Container

```javascript
function demonstrateBlockScope() {
  // Block scope examples
  if (true) {
    var blockVar = "var ignores block scope";
    let blockLet = "let respects block scope";
    const blockConst = "const respects block scope";

    console.log(blockVar); // ✅ Works
    console.log(blockLet); // ✅ Works
    console.log(blockConst); // ✅ Works
  }

  console.log(blockVar); // ✅ Works (var ignores block scope)
  // console.log(blockLet);   // ❌ ReferenceError
  // console.log(blockConst); // ❌ ReferenceError

  // Other block scope examples
  for (let i = 0; i < 3; i++) {
    // i is only accessible within this loop
    console.log(i);
  }
  // console.log(i); // ❌ ReferenceError

  // Switch statements create block scope
  const value = "test";
  switch (value) {
    case "test":
      let caseVariable = "I'm block scoped to this case";
      console.log(caseVariable);
      break;
  }
  // console.log(caseVariable); // ❌ ReferenceError
}

demonstrateBlockScope();
```

### Module Scope (ES6 Modules)

```javascript
// In a module file (e.g., utils.js)

// Module-scoped variables (not global, but accessible within the module)
const moduleSecret = "Only accessible within this module";

// Exported functions can access module-scoped variables
export function getSecret() {
  return moduleSecret;
}

// Private helper function (not exported)
function privateHelper() {
  return "I'm private to this module";
}

export function publicFunction() {
  return privateHelper(); // Can access private functions
}
```

## 🚀 Hoisting: JavaScript's Hidden Behavior

Hoisting is JavaScript's behavior of moving declarations to the top of their scope during compilation.

### Variable Hoisting with `var`

```javascript
// What you write:
function hoistingExample() {
  console.log(x); // undefined (not an error!)
  var x = 5;
  console.log(x); // 5
}

// What JavaScript sees:
function hoistingExampleActual() {
  var x; // Declaration hoisted to top
  console.log(x); // undefined
  x = 5; // Assignment stays in place
  console.log(x); // 5
}

hoistingExample();
```

### Let and Const: Temporal Dead Zone

```javascript
function temporalDeadZoneDemo() {
  // Temporal Dead Zone starts

  // console.log(letVar); // ❌ ReferenceError: Cannot access before initialization
  // console.log(constVar); // ❌ ReferenceError: Cannot access before initialization

  // Variables are hoisted but not initialized
  let letVar = "I'm let";
  const constVar = "I'm const";

  // Temporal Dead Zone ends
  console.log(letVar); // ✅ "I'm let"
  console.log(constVar); // ✅ "I'm const"
}

temporalDeadZoneDemo();
```

### Function Hoisting

```javascript
// Function declarations are fully hoisted
console.log(hoistedFunction()); // ✅ "I'm hoisted!"

function hoistedFunction() {
  return "I'm hoisted!";
}

// Function expressions are not hoisted
// console.log(notHoisted()); // ❌ TypeError: notHoisted is not a function

var notHoisted = function () {
  return "I'm not hoisted";
};

// Arrow functions are not hoisted either
// console.log(alsoNotHoisted()); // ❌ TypeError: alsoNotHoisted is not a function

var alsoNotHoisted = () => {
  return "I'm also not hoisted";
};
```

### Complex Hoisting Example

```javascript
function complexHoisting() {
  // What gets hoisted:
  // var a, b; (declarations)
  // function c() { return "function c"; } (entire function)

  console.log(a); // undefined
  console.log(b); // undefined
  console.log(c()); // "function c"
  // console.log(d()); // ❌ TypeError: d is not a function

  var a = 1;

  if (true) {
    var b = 2; // var ignores block scope, so it's hoisted to function level
  }

  function c() {
    return "function c";
  }

  var d = function () {
    return "function d";
  };

  console.log(a); // 1
  console.log(b); // 2
  console.log(c()); // "function c"
  console.log(d()); // "function d"
}

complexHoisting();
```

## 🎯 The `this` Keyword: Context Matters

The `this` keyword refers to the object that is executing the current function. Its value depends on HOW a function is called, not WHERE it's defined.

### Global Context

```javascript
// In global scope, 'this' refers to the global object
console.log(this); // Window object (browser) or global object (Node.js)

function globalFunction() {
  console.log(this); // Window/global in non-strict mode, undefined in strict mode
}

globalFunction();

// Strict mode changes behavior
("use strict");
function strictFunction() {
  console.log(this); // undefined
}

strictFunction();
```

### Object Method Context

```javascript
const person = {
  name: "Alice",
  age: 30,

  // Regular method - 'this' refers to the object
  greet: function () {
    console.log(`Hello, I'm ${this.name} and I'm ${this.age} years old`);
    console.log(this); // The person object
  },

  // Arrow method - 'this' refers to global/parent context
  arrowGreet: () => {
    console.log(`Arrow: Hello, I'm ${this.name}`); // this.name is undefined
    console.log(this); // Global object or undefined
  },

  // Method with nested function
  complexGreet: function () {
    console.log("Outer this:", this.name); // "Alice"

    function innerFunction() {
      console.log("Inner this:", this.name); // undefined (lost context)
    }

    const arrowFunction = () => {
      console.log("Arrow this:", this.name); // "Alice" (inherits from parent)
    };

    innerFunction();
    arrowFunction();
  }
};

person.greet(); // Works as expected
person.arrowGreet(); // 'this' is not the person object
person.complexGreet(); // Shows different 'this' contexts
```

### Constructor Function Context

```javascript
function Person(name, age) {
  // 'this' refers to the new object being created
  this.name = name;
  this.age = age;

  this.greet = function () {
    console.log(`Hello, I'm ${this.name}`);
  };

  // Arrow functions don't work well as methods in constructors
  this.arrowGreet = () => {
    console.log(`Arrow: Hello, I'm ${this.name}`);
  };
}

const alice = new Person("Alice", 30);
const bob = new Person("Bob", 25);

alice.greet(); // "Hello, I'm Alice"
bob.greet(); // "Hello, I'm Bob"

// The arrow function maintains 'this' from constructor context
alice.arrowGreet(); // "Arrow: Hello, I'm Alice"
```

### Explicit Binding: call, apply, bind

```javascript
const person1 = { name: "Alice", age: 30 };
const person2 = { name: "Bob", age: 25 };

function introduce(greeting, punctuation) {
  console.log(
    `${greeting}, I'm ${this.name} and I'm ${this.age} years old${punctuation}`
  );
}

// call() - invoke function with specific 'this' and individual arguments
introduce.call(person1, "Hello", "!"); // "Hello, I'm Alice and I'm 30 years old!"
introduce.call(person2, "Hi", "."); // "Hi, I'm Bob and I'm 25 years old."

// apply() - same as call but takes array of arguments
introduce.apply(person1, ["Greetings", "!!"]); // "Greetings, I'm Alice and I'm 30 years old!!"

// bind() - creates new function with fixed 'this'
const boundIntroduce = introduce.bind(person1);
boundIntroduce("Hey", "?"); // "Hey, I'm Alice and I'm 30 years old?"

// Partial application with bind
const greetAlice = introduce.bind(person1, "Hello");
greetAlice("!"); // "Hello, I'm Alice and I'm 30 years old!"
```

### Event Handler Context

```javascript
// In a browser environment
const button = document.createElement("button");
button.textContent = "Click me";

const handler = {
  message: "Button clicked!",

  // Regular function - 'this' will be the button element
  handleClick: function (event) {
    console.log(this); // The button element
    console.log(this.message); // undefined
  },

  // Arrow function - 'this' will be the handler object
  handleClickArrow: (event) => {
    console.log(this); // The handler object
    console.log(this.message); // "Button clicked!"
  },

  // Bound function - 'this' will be the handler object
  handleClickBound: function (event) {
    console.log(this); // The handler object
    console.log(this.message); // "Button clicked!"
  }
};

// Different ways to bind event handlers
button.addEventListener("click", handler.handleClick); // 'this' = button
button.addEventListener("click", handler.handleClickArrow); // 'this' = handler
button.addEventListener("click", handler.handleClickBound.bind(handler)); // 'this' = handler
```

## 🐛 Common Scope and `this` Pitfalls

### Pitfall 1: Loop Variable Scope

```javascript
// ❌ Common mistake with var
console.log("❌ With var:");
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // Prints 3 three times
  }, 100);
}

// ✅ Solution with let
console.log("✅ With let:");
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // Prints 0, 1, 2
  }, 200);
}

// ✅ Alternative solution with closure
console.log("✅ With closure:");
for (var i = 0; i < 3; i++) {
  (function (index) {
    setTimeout(() => {
      console.log(index); // Prints 0, 1, 2
    }, 300);
  })(i);
}
```

### Pitfall 2: Method Assignment

```javascript
const calculator = {
  value: 0,
  add: function (x) {
    this.value += x;
    console.log(`Added ${x}, total: ${this.value}`);
    return this;
  }
};

// ❌ Assigning method to variable loses 'this' context
const addFunction = calculator.add;
// addFunction(5); // Error: Cannot read property 'value' of undefined

// ✅ Solutions:
// Option 1: Use bind
const boundAdd = calculator.add.bind(calculator);
boundAdd(5); // Works!

// Option 2: Use arrow function wrapper
const wrappedAdd = (x) => calculator.add(x);
wrappedAdd(10); // Works!

// Option 3: Use call/apply
addFunction.call(calculator, 15); // Works!
```

### Pitfall 3: Callback Function Context

```javascript
const timer = {
  seconds: 0,

  start: function () {
    // ❌ 'this' context is lost in callback
    setInterval(function () {
      this.seconds++; // 'this' is not the timer object
      console.log(this.seconds);
    }, 1000);
  },

  startFixed: function () {
    // ✅ Solution 1: Store 'this' in variable
    const self = this;
    setInterval(function () {
      self.seconds++;
      console.log(self.seconds);
    }, 1000);
  },

  startArrow: function () {
    // ✅ Solution 2: Use arrow function
    setInterval(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  },

  startBound: function () {
    // ✅ Solution 3: Use bind
    setInterval(
      function () {
        this.seconds++;
        console.log(this.seconds);
      }.bind(this),
      1000
    );
  }
};
```

## 🧪 Advanced Scope Concepts

### Closures: Functions Remember Their Environment

```javascript
function createCounter() {
  let count = 0; // Private variable

  return function () {
    count++; // Accesses variable from outer scope
    return count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 (separate closure)
console.log(counter1()); // 3
```

### Module Pattern with Closures

```javascript
const BankAccount = (function () {
  // Private variables and functions
  let balance = 0;
  let transactionHistory = [];

  function logTransaction(type, amount) {
    transactionHistory.push({
      type: type,
      amount: amount,
      timestamp: new Date(),
      balance: balance
    });
  }

  // Public API
  return {
    deposit: function (amount) {
      if (amount > 0) {
        balance += amount;
        logTransaction("deposit", amount);
        console.log(`Deposited $${amount}. New balance: $${balance}`);
      }
    },

    withdraw: function (amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        logTransaction("withdrawal", amount);
        console.log(`Withdrew $${amount}. New balance: $${balance}`);
      } else {
        console.log("Insufficient funds or invalid amount");
      }
    },

    getBalance: function () {
      return balance;
    },

    getHistory: function () {
      return [...transactionHistory]; // Return copy to prevent mutation
    }
  };
})();

BankAccount.deposit(100);
BankAccount.withdraw(30);
console.log(BankAccount.getBalance()); // 70
// console.log(balance); // ❌ Error: balance is not accessible
```

## 🎯 Practical Debugging Tips

### Debugging Scope Issues

```javascript
function debugScope() {
  const localVar = "I'm local";

  // Technique 1: Use console.log to trace variable access
  console.log("Local variable:", localVar);

  // Technique 2: Use debugger statement
  debugger; // Browser will pause here if DevTools is open

  // Technique 3: Check what 'this' refers to
  console.log("'this' context:", this);

  // Technique 4: Use console.trace to see call stack
  console.trace("Call stack trace");
}

debugScope();
```

### Scope Visualization Exercise

```javascript
// Try to predict the output before running
let globalScope = "global";

function outer() {
  let outerScope = "outer";
  console.log("1:", globalScope); // ?
  console.log("2:", outerScope); // ?

  function inner() {
    let innerScope = "inner";
    outerScope = "modified outer"; // Modifying parent scope
    console.log("3:", globalScope); // ?
    console.log("4:", outerScope); // ?
    console.log("5:", innerScope); // ?
  }

  inner();
  console.log("6:", outerScope); // ?
}

outer();
console.log("7:", globalScope); // ?
```

## 🏃‍♂️ Practice Exercises

### Exercise 1: Scope Detective

```javascript
// Fix the scope issues in this code
var message = "Global message";

function createMessenger() {
  var message = "Function message";

  return {
    getMessage: function () {
      return message;
    },
    setMessage: function (newMessage) {
      message = newMessage;
    }
  };
}

var messenger1 = createMessenger();
var messenger2 = createMessenger();

// Test the messengers
console.log(messenger1.getMessage()); // Should be "Function message"
messenger1.setMessage("New message 1");
console.log(messenger1.getMessage()); // Should be "New message 1"
console.log(messenger2.getMessage()); // Should still be "Function message"
```

### Exercise 2: Fix the `this` Context

```javascript
// Fix the 'this' context issues in this object
const gameCharacter = {
  name: "Hero",
  health: 100,

  takeDamage: function (damage) {
    this.health -= damage;
    console.log(`${this.name} took ${damage} damage. Health: ${this.health}`);

    if (this.health <= 0) {
      this.die();
    }
  },

  die: () => {
    // Fix this arrow function
    console.log(`${this.name} has died!`);
  },

  heal: function (amount) {
    this.health += amount;
    console.log(`${this.name} healed ${amount} HP. Health: ${this.health}`);
  },

  startRegeneration: function () {
    // Fix the context loss in setInterval
    setInterval(function () {
      if (this.health < 100) {
        this.heal(1);
      }
    }, 1000);
  }
};

// Test the character
gameCharacter.takeDamage(50);
gameCharacter.startRegeneration();
```

### Exercise 3: Hoisting Challenge

```javascript
// Predict the output and explain why
function hoistingChallenge() {
  console.log("1:", a); // ?
  console.log("2:", b); // ?
  // console.log("3:", c); // ?
  console.log("4:", d()); // ?

  var a = 1;
  let b = 2;
  const c = 3;

  function d() {
    return "Function d";
  }

  var e = function () {
    return "Function e";
  };

  console.log("5:", a); // ?
  console.log("6:", b); // ?
  console.log("7:", c); // ?
  console.log("8:", e()); // ?
}

hoistingChallenge();
```

## 🔗 Next Steps

Master these concepts by:

1. Working through the comprehensive exercises
2. Building projects that use different scope patterns
3. Practicing with closures and the module pattern
4. Moving on to [Arrays and Objects](../week3-data-structures/)

## 📚 Additional Resources

- [MDN: Scope](https://developer.mozilla.org/en-US/docs/Glossary/Scope)
- [MDN: Hoisting](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting)
- [MDN: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [JavaScript.info: Variable scope, closure](https://javascript.info/closure)
