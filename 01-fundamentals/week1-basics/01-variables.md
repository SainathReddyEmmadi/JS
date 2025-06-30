# Variables and Data Types 📦

## 🎯 Learning Objectives

- Understand the difference between `var`, `let`, and `const`
- Learn about JavaScript's primitive data types
- Master type conversion and coercion
- Practice variable declaration and assignment

## 📖 Variables in JavaScript

Variables are containers that store data values. JavaScript has three ways to declare variables:

### 1. `var` (Legacy - Avoid in modern JavaScript)

```javascript
var name = "John";
var age = 25;
```

### 2. `let` (Block-scoped, can be reassigned)

```javascript
let name = "John";
let age = 25;
name = "Jane"; // ✅ This works
```

### 3. `const` (Block-scoped, cannot be reassigned)

```javascript
const name = "John";
const age = 25;
// name = "Jane"; // ❌ This will cause an error
```

## 🔤 Data Types

JavaScript has 7 primitive data types + Objects:

### 1. Number

```javascript
let integer = 42;
let decimal = 3.14;
let negative = -10;
let infinity = Infinity;
let notANumber = NaN;

console.log(typeof integer); // "number"
```

### 2. String

```javascript
let singleQuotes = "Hello";
let doubleQuotes = "World";
let templateLiteral = `Hello ${singleQuotes}`;
let multiLine = `This is a
multi-line string`;

console.log(typeof singleQuotes); // "string"
```

### 3. Boolean

```javascript
let isTrue = true;
let isFalse = false;
let isActive = Boolean(1); // true

console.log(typeof isTrue); // "boolean"
```

### 4. Undefined

```javascript
let notDefined;
let explicitUndefined = undefined;

console.log(typeof notDefined); // "undefined"
```

### 5. Null

```javascript
let empty = null;

console.log(typeof empty); // "object" (this is a known quirk!)
console.log(empty === null); // true
```

### 6. Symbol (ES6+)

```javascript
let sym1 = Symbol("id");
let sym2 = Symbol("id");

console.log(sym1 === sym2); // false (symbols are unique)
console.log(typeof sym1); // "symbol"
```

### 7. BigInt (ES2020+)

```javascript
let bigNumber = 1234567890123456789012345678901234567890n;
let anotherBig = BigInt(123456789012345678901234567890);

console.log(typeof bigNumber); // "bigint"
```

### 8. Object (Non-primitive)

```javascript
let person = {
  name: "John",
  age: 30
};

let numbers = [1, 2, 3, 4, 5];
let today = new Date();

console.log(typeof person); // "object"
console.log(typeof numbers); // "object"
console.log(typeof today); // "object"
```

## 🔄 Type Conversion

### Implicit Conversion (Coercion)

```javascript
// String + Number = String
console.log("5" + 3); // "53"

// String - Number = Number
console.log("5" - 3); // 2

// Boolean to Number
console.log(true + 1); // 2
console.log(false + 1); // 1

// Null and Undefined
console.log(null + 1); // 1
console.log(undefined + 1); // NaN
```

### Explicit Conversion

```javascript
// To String
let num = 123;
let str1 = String(num); // "123"
let str2 = num.toString(); // "123"
let str3 = "" + num; // "123"

// To Number
let str = "123";
let num1 = Number(str); // 123
let num2 = parseInt(str); // 123
let num3 = parseFloat("123.45"); // 123.45
let num4 = +str; // 123

// To Boolean
let value = "hello";
let bool1 = Boolean(value); // true
let bool2 = !!value; // true

// Falsy values: false, 0, "", null, undefined, NaN
console.log(Boolean(0)); // false
console.log(Boolean("")); // false
console.log(Boolean(null)); // false
```

## 🧪 Type Checking

```javascript
// typeof operator
console.log(typeof 42); // "number"
console.log(typeof "hello"); // "string"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof null); // "object" (quirk!)
console.log(typeof {}); // "object"
console.log(typeof []); // "object"
console.log(typeof function () {}); // "function"

// Better array checking
console.log(Array.isArray([])); // true
console.log(Array.isArray({})); // false

// Better null checking
function isNull(value) {
  return value === null;
}

// Check for specific object types
console.log([] instanceof Array); // true
console.log({} instanceof Object); // true
console.log(new Date() instanceof Date); // true
```

## 💡 Best Practices

1. **Use `const` by default**, `let` when you need to reassign, avoid `var`
2. **Use descriptive variable names**
3. **Use camelCase for variable names**
4. **Initialize variables when declaring them**
5. **Use strict equality (`===`) instead of loose equality (`==`)**

```javascript
// ✅ Good
const userName = "john_doe";
const userAge = 25;
const isLoggedIn = true;

// ❌ Avoid
var x = "john_doe";
let a = 25;
const flag = true;
```

## 🎯 Common Pitfalls

```javascript
// 1. Hoisting with var
console.log(x); // undefined (not an error!)
var x = 5;

// 2. Block scope with let/const
if (true) {
  let blockScoped = "I'm only available in this block";
  var functionScoped = "I'm available in the entire function";
}
// console.log(blockScoped); // ❌ ReferenceError
console.log(functionScoped); // ✅ Works

// 3. Const with objects/arrays
const obj = { name: "John" };
obj.name = "Jane"; // ✅ This works (modifying property)
obj.age = 30; // ✅ This works (adding property)
// obj = {}; // ❌ This fails (reassigning the variable)

const arr = [1, 2, 3];
arr.push(4); // ✅ This works (modifying array)
// arr = []; // ❌ This fails (reassigning the variable)
```

## 🏃‍♂️ Quick Exercises

Try these in your browser console or a JavaScript file:

### Exercise 1: Variable Declaration

```javascript
// Declare variables for a user profile
// Use appropriate variable types (const/let)
// Include: name, age, email, isActive, hobbies (array)

// Your code here...
```

### Exercise 2: Type Conversion

```javascript
// Convert these values and predict the output
console.log("10" + 5);
console.log("10" - 5);
console.log("10" * 5);
console.log("10" / 5);
console.log(Boolean(""));
console.log(Boolean("hello"));
console.log(Number("123abc"));
```

### Exercise 3: Type Checking

```javascript
// Create a function that checks the type of a value
// and returns a descriptive string
function getValueType(value) {
  // Your code here...
  // Handle special cases like null and arrays
}

// Test with different values
console.log(getValueType(42));
console.log(getValueType("hello"));
console.log(getValueType([]));
console.log(getValueType(null));
```

## 🔗 Next Steps

After mastering variables and data types, move on to:

- [Operators](./02-operators.md)
- [Control Structures](./03-control-structures.md)

## 📚 Additional Resources

- [MDN: JavaScript data types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures)
- [MDN: Variables](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/First_steps/Variables)
- [JavaScript.info: Variables](https://javascript.info/variables)
- [JavaScript.info: Data types](https://javascript.info/types)
