# Operators in JavaScript ⚙️

## 🎯 Learning Objectives

- Master arithmetic, comparison, and logical operators
- Understand operator precedence and associativity
- Learn assignment operators and shortcuts
- Practice with real-world examples

## 🧮 Arithmetic Operators

### Basic Arithmetic

```javascript
let a = 10;
let b = 3;

console.log(a + b); // 13 (Addition)
console.log(a - b); // 7  (Subtraction)
console.log(a * b); // 30 (Multiplication)
console.log(a / b); // 3.333... (Division)
console.log(a % b); // 1  (Modulus - remainder)
console.log(a ** b); // 1000 (Exponentiation - ES2016)
```

### Unary Operators

```javascript
let x = 5;

// Increment/Decrement
console.log(++x); // 6 (Pre-increment: increment then return)
console.log(x++); // 6 (Post-increment: return then increment)
console.log(x); // 7

console.log(--x); // 6 (Pre-decrement: decrement then return)
console.log(x--); // 6 (Post-decrement: return then decrement)
console.log(x); // 5

// Unary plus and minus
let str = "5";
console.log(+str); // 5 (converts to number)
console.log(-str); // -5 (converts to negative number)
```

## 📊 Comparison Operators

### Equality Operators

```javascript
// Loose equality (==) - performs type coercion
console.log(5 == "5"); // true
console.log(true == 1); // true
console.log(null == undefined); // true

// Strict equality (===) - no type coercion
console.log(5 === "5"); // false
console.log(true === 1); // false
console.log(null === undefined); // false

// Inequality
console.log(5 != "5"); // false (loose)
console.log(5 !== "5"); // true (strict)
```

### Relational Operators

```javascript
let a = 10;
let b = 5;

console.log(a > b); // true (greater than)
console.log(a < b); // false (less than)
console.log(a >= b); // true (greater than or equal)
console.log(a <= b); // false (less than or equal)

// String comparison (lexicographical)
console.log("apple" < "banana"); // true
console.log("10" < "9"); // true (string comparison!)
console.log(10 < 9); // false (number comparison)
```

## 🧠 Logical Operators

### Basic Logical Operators

```javascript
let a = true;
let b = false;

// AND (&&) - returns true if both operands are true
console.log(a && b); // false
console.log(true && true); // true

// OR (||) - returns true if at least one operand is true
console.log(a || b); // true
console.log(false || false); // false

// NOT (!) - reverses the boolean value
console.log(!a); // false
console.log(!b); // true
console.log(!!a); // true (double negation)
```

### Short-Circuit Evaluation

```javascript
// AND (&&) - stops at first falsy value
console.log(0 && "hello"); // 0
console.log("hello" && "world"); // "world"
console.log("" && "hello"); // ""

// OR (||) - stops at first truthy value
console.log(0 || "hello"); // "hello"
console.log("hello" || "world"); // "hello"
console.log("" || 0 || "default"); // "default"

// Practical use cases
function greet(name) {
  name = name || "Guest"; // Default value
  console.log("Hello, " + name);
}

// Nullish coalescing operator (??) - ES2020
let user = null;
let defaultUser = "Guest";
console.log(user ?? defaultUser); // "Guest"
console.log("" ?? defaultUser); // "" (empty string is not nullish)
```

## 📝 Assignment Operators

### Basic Assignment

```javascript
let x = 10; // Basic assignment

// Compound assignment operators
x += 5; // x = x + 5;  (15)
x -= 3; // x = x - 3;  (12)
x *= 2; // x = x * 2;  (24)
x /= 4; // x = x / 4;  (6)
x %= 4; // x = x % 4;  (2)
x **= 3; // x = x ** 3; (8)

console.log(x); // 8
```

### Destructuring Assignment (ES6+)

```javascript
// Array destructuring
const numbers = [1, 2, 3];
const [first, second, third] = numbers;
console.log(first); // 1
console.log(second); // 2

// Object destructuring
const person = { name: "John", age: 30 };
const { name, age } = person;
console.log(name); // "John"
console.log(age); // 30
```

## 🔄 Other Operators

### Ternary Operator (Conditional)

```javascript
const age = 18;
const canVote = age >= 18 ? "Yes" : "No";
console.log(canVote); // "Yes"

// Nested ternary (use sparingly)
const score = 85;
const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F";
console.log(grade); // "B"
```

### typeof Operator

```javascript
console.log(typeof 42); // "number"
console.log(typeof "hello"); // "string"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof null); // "object" (quirk!)
console.log(typeof {}); // "object"
console.log(typeof []); // "object"
```

### instanceof Operator

```javascript
const date = new Date();
const arr = [1, 2, 3];
const obj = {};

console.log(date instanceof Date); // true
console.log(arr instanceof Array); // true
console.log(obj instanceof Object); // true
console.log(arr instanceof Object); // true (arrays are objects)
```

## 📈 Operator Precedence

Higher numbers = higher precedence (evaluated first):

```javascript
// Precedence example
let result = 2 + 3 * 4; // 14, not 20 (multiplication first)

// Use parentheses for clarity
let result2 = (2 + 3) * 4; // 20

// Common precedence order (simplified):
// 1. () - Parentheses
// 2. ++ -- - Increment/Decrement
// 3. ** - Exponentiation
// 4. * / % - Multiplication, Division, Modulus
// 5. + - - Addition, Subtraction
// 6. < <= > >= - Relational
// 7. == != === !== - Equality
// 8. && - Logical AND
// 9. || - Logical OR
// 10. ?: - Ternary
// 11. = += -= *= /= %= - Assignment
```

## 💡 Best Practices

1. **Use strict equality (`===`) over loose equality (`==`)**
2. **Use parentheses for complex expressions**
3. **Prefer `??` over `||` for default values when you want to keep falsy values like 0 or ""**
4. **Use meaningful variable names in complex expressions**

```javascript
// ✅ Good
const isAdult = age >= 18;
const hasPermission = isLoggedIn && isAdult;
const displayName = userName ?? "Anonymous";

// ❌ Avoid
const x = a >= 18;
const y = b && x;
const z = c || "Anonymous";
```

## 🎯 Common Mistakes

```javascript
// 1. Assignment vs Equality
let x = 5;
if ((x = 10)) {
  // ❌ Assignment instead of comparison
  console.log("This will always run!");
}

if (x === 10) {
  // ✅ Correct comparison
  console.log("This is correct");
}

// 2. Floating point precision
console.log(0.1 + 0.2 === 0.3); // false!
console.log(0.1 + 0.2); // 0.30000000000000004

// Better approach for floating point comparison
function isEqual(a, b, precision = 0.0001) {
  return Math.abs(a - b) < precision;
}
console.log(isEqual(0.1 + 0.2, 0.3)); // true

// 3. Truthy/Falsy confusion
const items = [];
if (items) {
  // ✅ This is true (empty array is truthy)
  console.log("Array exists");
}

if (items.length) {
  // ✅ This is false (length is 0)
  console.log("Array has items");
}
```

## 🏃‍♂️ Quick Exercises

### Exercise 1: Calculator

```javascript
// Create a simple calculator function
function calculate(num1, operator, num2) {
  // Your code here...
  // Handle +, -, *, /, %
  // Return the result or "Invalid operator"
}

console.log(calculate(10, "+", 5)); // 15
console.log(calculate(10, "/", 0)); // Handle division by zero
```

### Exercise 2: Age Validator

```javascript
// Create an age validation function
function validateAge(age) {
  // Your code here...
  // Return "child" (<13), "teen" (13-17), "adult" (18-64), "senior" (65+)
  // Handle invalid inputs
}

console.log(validateAge(10)); // "child"
console.log(validateAge(16)); // "teen"
console.log(validateAge(25)); // "adult"
console.log(validateAge("abc")); // "invalid"
```

### Exercise 3: Default Values

```javascript
// Create a user profile function with default values
function createProfile(name, age, email) {
  // Use appropriate operators to set defaults:
  // name: "Anonymous" if falsy
  // age: 0 if null/undefined (but keep 0 if explicitly passed)
  // email: "No email provided" if falsy
  // Your code here...
}

console.log(createProfile("John", 25, "john@email.com"));
console.log(createProfile("", null, undefined));
console.log(createProfile("Jane", 0, ""));
```

## 🔗 Next Steps

Ready for the next topic?

- [Control Structures](./03-control-structures.md)

## 📚 Additional Resources

- [MDN: Expressions and operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators)
- [JavaScript.info: Operators](https://javascript.info/operators)
- [JavaScript.info: Comparisons](https://javascript.info/comparison)
