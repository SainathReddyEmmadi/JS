# ES6 Classes in JavaScript

## Table of Contents

1. [Introduction to ES6 Classes](#introduction-to-es6-classes)
2. [Class Declaration and Expression](#class-declaration-and-expression)
3. [Constructor Method](#constructor-method)
4. [Instance Methods](#instance-methods)
5. [Static Methods and Properties](#static-methods-and-properties)
6. [Getters and Setters](#getters-and-setters)
7. [Private Fields and Methods](#private-fields-and-methods)
8. [Class vs Constructor Functions](#class-vs-constructor-functions)
9. [Best Practices](#best-practices)
10. [Common Patterns](#common-patterns)
11. [Self-Check Questions](#self-check-questions)
12. [Practice Exercises](#practice-exercises)

## Introduction to ES6 Classes

ES6 (ES2015) introduced the `class` syntax as syntactic sugar over JavaScript's existing prototype-based inheritance. While classes don't add new functionality, they provide a cleaner, more familiar syntax for object-oriented programming.

### Why Use Classes?

```javascript
// Traditional constructor function
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

// ES6 Class - cleaner syntax
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }
}
```

## Class Declaration and Expression

### Class Declaration

```javascript
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
}

const rect = new Rectangle(10, 5);
console.log(rect.getArea()); // 50
```

### Class Expression

```javascript
// Named class expression
const Rectangle = class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }
};

// Anonymous class expression
const Circle = class {
  constructor(radius) {
    this.radius = radius;
  }

  getArea() {
    return Math.PI * this.radius ** 2;
  }
};
```

### Important Notes

```javascript
// Classes are not hoisted
console.log(MyClass); // ReferenceError: Cannot access 'MyClass' before initialization

class MyClass {
  constructor() {}
}

// Classes are functions under the hood
class Person {}
console.log(typeof Person); // "function"
console.log(Person instanceof Function); // true
```

## Constructor Method

The `constructor` method is a special method that runs when a new instance is created.

```javascript
class User {
  constructor(username, email) {
    // Validate inputs
    if (!username || !email) {
      throw new Error("Username and email are required");
    }

    this.username = username;
    this.email = email;
    this.createdAt = new Date();
    this.isActive = true;

    // Call initialization method
    this.initialize();
  }

  initialize() {
    console.log(`User ${this.username} created successfully`);
  }
}

const user = new User("john_doe", "john@example.com");
```

### Constructor with Default Parameters

```javascript
class Product {
  constructor(name, price = 0, category = "general") {
    this.name = name;
    this.price = price;
    this.category = category;
    this.id = this.generateId();
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

const product1 = new Product("Laptop", 999, "electronics");
const product2 = new Product("Book"); // Uses default price and category
```

## Instance Methods

Instance methods are available on every instance of the class.

```javascript
class BankAccount {
  constructor(accountNumber, initialBalance = 0) {
    this.accountNumber = accountNumber;
    this.balance = initialBalance;
    this.transactions = [];
  }

  deposit(amount) {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive");
    }

    this.balance += amount;
    this.transactions.push({
      type: "deposit",
      amount,
      date: new Date(),
      balance: this.balance
    });

    return this.balance;
  }

  withdraw(amount) {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive");
    }

    if (amount > this.balance) {
      throw new Error("Insufficient funds");
    }

    this.balance -= amount;
    this.transactions.push({
      type: "withdrawal",
      amount,
      date: new Date(),
      balance: this.balance
    });

    return this.balance;
  }

  getStatement() {
    return {
      accountNumber: this.accountNumber,
      currentBalance: this.balance,
      transactionHistory: this.transactions
    };
  }
}

const account = new BankAccount("12345", 1000);
account.deposit(500);
account.withdraw(200);
console.log(account.getStatement());
```

## Static Methods and Properties

Static methods and properties belong to the class itself, not to instances.

```javascript
class MathUtils {
  static PI = 3.14159;
  static E = 2.71828;

  static add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }

  static circleArea(radius) {
    return this.PI * radius ** 2;
  }

  static factorial(n) {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }
}

// Usage - called on the class, not instances
console.log(MathUtils.add(5, 3)); // 8
console.log(MathUtils.PI); // 3.14159
console.log(MathUtils.circleArea(5)); // 78.53975
console.log(MathUtils.factorial(5)); // 120

// Cannot call on instances
const math = new MathUtils();
// math.add(1, 2); // TypeError: math.add is not a function
```

### Static vs Instance Methods

```javascript
class Counter {
  static totalCounters = 0;

  constructor(name) {
    this.name = name;
    this.count = 0;
    Counter.totalCounters++; // Increment static property
  }

  // Instance method
  increment() {
    this.count++;
    return this.count;
  }

  // Static method
  static getTotalCounters() {
    return Counter.totalCounters;
  }

  // Static method that creates instances
  static createNamedCounter(name) {
    return new Counter(name);
  }
}

const counter1 = new Counter("Timer 1");
const counter2 = new Counter("Timer 2");

console.log(Counter.getTotalCounters()); // 2
console.log(counter1.increment()); // 1

const counter3 = Counter.createNamedCounter("Timer 3");
console.log(Counter.getTotalCounters()); // 3
```

## Getters and Setters

Getters and setters allow you to define methods that are accessed like properties.

```javascript
class Temperature {
  constructor(celsius = 0) {
    this._celsius = celsius; // Use underscore for "private" properties
  }

  // Getter for Celsius
  get celsius() {
    return this._celsius;
  }

  // Setter for Celsius
  set celsius(value) {
    if (typeof value !== "number") {
      throw new Error("Temperature must be a number");
    }
    this._celsius = value;
  }

  // Getter for Fahrenheit (computed property)
  get fahrenheit() {
    return (this._celsius * 9) / 5 + 32;
  }

  // Setter for Fahrenheit
  set fahrenheit(value) {
    if (typeof value !== "number") {
      throw new Error("Temperature must be a number");
    }
    this._celsius = ((value - 32) * 5) / 9;
  }

  // Getter for Kelvin
  get kelvin() {
    return this._celsius + 273.15;
  }

  set kelvin(value) {
    if (typeof value !== "number") {
      throw new Error("Temperature must be a number");
    }
    this._celsius = value - 273.15;
  }
}

const temp = new Temperature(25);
console.log(temp.celsius); // 25
console.log(temp.fahrenheit); // 77
console.log(temp.kelvin); // 298.15

temp.fahrenheit = 100;
console.log(temp.celsius); // 37.777...
```

### Validation with Setters

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age; // This will trigger the setter
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error("Name must be a non-empty string");
    }
    this._name = value.trim();
  }

  get age() {
    return this._age;
  }

  set age(value) {
    if (typeof value !== "number" || value < 0 || value > 150) {
      throw new Error("Age must be a number between 0 and 150");
    }
    this._age = value;
  }

  get isAdult() {
    return this._age >= 18;
  }

  get ageGroup() {
    if (this._age < 13) return "child";
    if (this._age < 18) return "teenager";
    if (this._age < 65) return "adult";
    return "senior";
  }
}

const person = new Person("John Doe", 25);
console.log(person.name); // "John Doe"
console.log(person.isAdult); // true
console.log(person.ageGroup); // "adult"

// person.age = -5; // Error: Age must be a number between 0 and 150
```

## Private Fields and Methods

ES2022 introduced private fields and methods using the `#` syntax.

```javascript
class SecureBankAccount {
  // Private fields
  #accountNumber;
  #balance;
  #pin;
  #transactions = [];

  constructor(accountNumber, initialBalance, pin) {
    this.#accountNumber = accountNumber;
    this.#balance = initialBalance;
    this.#pin = pin;
  }

  // Private method
  #validatePin(pin) {
    return pin === this.#pin;
  }

  #addTransaction(type, amount) {
    this.#transactions.push({
      type,
      amount,
      date: new Date(),
      balance: this.#balance
    });
  }

  // Public methods
  deposit(amount, pin) {
    if (!this.#validatePin(pin)) {
      throw new Error("Invalid PIN");
    }

    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    this.#balance += amount;
    this.#addTransaction("deposit", amount);
    return this.#balance;
  }

  withdraw(amount, pin) {
    if (!this.#validatePin(pin)) {
      throw new Error("Invalid PIN");
    }

    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    if (amount > this.#balance) {
      throw new Error("Insufficient funds");
    }

    this.#balance -= amount;
    this.#addTransaction("withdrawal", amount);
    return this.#balance;
  }

  getBalance(pin) {
    if (!this.#validatePin(pin)) {
      throw new Error("Invalid PIN");
    }
    return this.#balance;
  }

  // Static private method
  static #generateAccountNumber() {
    return Math.random().toString().substr(2, 10);
  }

  static createAccount(initialBalance, pin) {
    const accountNumber = this.#generateAccountNumber();
    return new SecureBankAccount(accountNumber, initialBalance, pin);
  }
}

const account = SecureBankAccount.createAccount(1000, "1234");
console.log(account.getBalance("1234")); // 1000
account.deposit(500, "1234");

// These will not work - private fields are truly private
// console.log(account.#balance); // SyntaxError
// account.#validatePin('1234'); // SyntaxError
```

## Class vs Constructor Functions

### Similarities

```javascript
// Both create objects with methods
class ClassVersion {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}`;
  }
}

function FunctionVersion(name) {
  this.name = name;
}

FunctionVersion.prototype.greet = function () {
  return `Hello, ${this.name}`;
};

// Both work the same way
const obj1 = new ClassVersion("Alice");
const obj2 = new FunctionVersion("Bob");

console.log(obj1.greet()); // "Hello, Alice"
console.log(obj2.greet()); // "Hello, Bob"
```

### Key Differences

```javascript
// 1. Classes cannot be called without 'new'
function RegularFunction() {
  this.value = 42;
}

class RegularClass {
  constructor() {
    this.value = 42;
  }
}

// This works
const obj1 = RegularFunction(); // Returns undefined, but doesn't error

// This throws an error
// const obj2 = RegularClass(); // TypeError: Class constructor cannot be invoked without 'new'

// 2. Class methods are non-enumerable by default
const funcObj = new FunctionVersion("Test");
const classObj = new ClassVersion("Test");

FunctionVersion.prototype.extraMethod = function () {};
ClassVersion.prototype.extraMethod = function () {};

console.log(Object.getOwnPropertyNames(FunctionVersion.prototype)); // ['constructor', 'greet', 'extraMethod']
console.log(Object.getOwnPropertyNames(ClassVersion.prototype)); // ['constructor', 'greet', 'extraMethod']

// But enumerable property is different
for (let prop in funcObj) {
  console.log(prop); // Will show 'greet' and 'extraMethod'
}

for (let prop in classObj) {
  console.log(prop); // Will only show 'extraMethod' (greet is non-enumerable)
}
```

## Best Practices

### 1. Use Meaningful Class Names

```javascript
// Good
class UserAccount {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }
}

// Better
class UserAccountManager {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }
}
```

### 2. Initialize All Properties in Constructor

```javascript
class GamePlayer {
  constructor(name) {
    this.name = name;
    this.score = 0; // Initialize with default
    this.level = 1; // Initialize with default
    this.powerUps = []; // Initialize empty array
    this.isActive = true; // Initialize boolean
    this.lastSeen = new Date(); // Initialize with current date
  }
}
```

### 3. Use Getters for Computed Properties

```javascript
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  get area() {
    return this.width * this.height;
  }

  get perimeter() {
    return 2 * (this.width + this.height);
  }

  get isSquare() {
    return this.width === this.height;
  }
}
```

### 4. Validate Input in Setters

```javascript
class Circle {
  constructor(radius) {
    this.radius = radius; // Will use setter validation
  }

  get radius() {
    return this._radius;
  }

  set radius(value) {
    if (typeof value !== "number" || value <= 0) {
      throw new Error("Radius must be a positive number");
    }
    this._radius = value;
  }

  get area() {
    return Math.PI * this._radius ** 2;
  }
}
```

## Common Patterns

### 1. Builder Pattern with Classes

```javascript
class QueryBuilder {
  constructor() {
    this.query = "";
    this.conditions = [];
    this.orderBy = "";
    this.limitValue = null;
  }

  select(fields) {
    this.query = `SELECT ${fields}`;
    return this; // Return this for chaining
  }

  from(table) {
    this.query += ` FROM ${table}`;
    return this;
  }

  where(condition) {
    this.conditions.push(condition);
    return this;
  }

  order(field, direction = "ASC") {
    this.orderBy = ` ORDER BY ${field} ${direction}`;
    return this;
  }

  limit(count) {
    this.limitValue = ` LIMIT ${count}`;
    return this;
  }

  build() {
    let sql = this.query;

    if (this.conditions.length > 0) {
      sql += ` WHERE ${this.conditions.join(" AND ")}`;
    }

    sql += this.orderBy;

    if (this.limitValue) {
      sql += this.limitValue;
    }

    return sql;
  }
}

// Usage
const query = new QueryBuilder()
  .select("name, email")
  .from("users")
  .where("age > 18")
  .where('status = "active"')
  .order("name")
  .limit(10)
  .build();

console.log(query);
// "SELECT name, email FROM users WHERE age > 18 AND status = "active" ORDER BY name ASC LIMIT 10"
```

### 2. Factory Pattern with Static Methods

```javascript
class Shape {
  constructor(type) {
    this.type = type;
  }

  static createRectangle(width, height) {
    const rect = new Shape("rectangle");
    rect.width = width;
    rect.height = height;
    rect.getArea = () => width * height;
    return rect;
  }

  static createCircle(radius) {
    const circle = new Shape("circle");
    circle.radius = radius;
    circle.getArea = () => Math.PI * radius ** 2;
    return circle;
  }

  static createTriangle(base, height) {
    const triangle = new Shape("triangle");
    triangle.base = base;
    triangle.height = height;
    triangle.getArea = () => (base * height) / 2;
    return triangle;
  }
}

const rect = Shape.createRectangle(10, 5);
const circle = Shape.createCircle(3);
const triangle = Shape.createTriangle(6, 4);

console.log(rect.getArea()); // 50
console.log(circle.getArea()); // 28.27...
console.log(triangle.getArea()); // 12
```

### 3. Singleton Pattern

```javascript
class DatabaseConnection {
  static instance = null;

  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    this.connected = false;
    this.host = "localhost";
    this.port = 5432;

    DatabaseConnection.instance = this;
  }

  connect() {
    if (!this.connected) {
      console.log(`Connecting to ${this.host}:${this.port}`);
      this.connected = true;
    }
    return this;
  }

  disconnect() {
    if (this.connected) {
      console.log("Disconnecting from database");
      this.connected = false;
    }
    return this;
  }

  static getInstance() {
    if (!DatabaseConnection.instance) {
      new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }
}

const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();
const db3 = DatabaseConnection.getInstance();

console.log(db1 === db2); // true
console.log(db2 === db3); // true
```

## Self-Check Questions

1. What is the difference between a class declaration and a class expression?
2. When is the constructor method called?
3. What happens if you don't define a constructor in a class?
4. How do static methods differ from instance methods?
5. Can you call a static method on an instance of a class?
6. What are getters and setters used for?
7. How do private fields work in ES2022?
8. What are the main differences between classes and constructor functions?
9. Why are class methods non-enumerable by default?
10. How would you implement method chaining in a class?

## Practice Exercises

### Exercise 1: Book Library System

Create a `Book` class with the following requirements:

```javascript
class Book {
  // Properties: title, author, isbn, pages, isAvailable
  // Constructor should validate that all required fields are provided
  // Methods:
  //   - borrow() - marks book as unavailable
  //   - return() - marks book as available
  //   - getInfo() - returns formatted book information
  //   - static method createFromString(bookString) - creates book from "title|author|isbn|pages"
}

// Test your implementation
const book1 = new Book("1984", "George Orwell", "978-0-452-28423-4", 328);
const book2 = Book.createFromString(
  "To Kill a Mockingbird|Harper Lee|978-0-06-112008-4|281"
);

console.log(book1.getInfo());
book1.borrow();
console.log(book1.isAvailable); // false
book1.return();
console.log(book1.isAvailable); // true
```

### Exercise 2: Temperature Converter

Create a `Temperature` class that can convert between Celsius, Fahrenheit, and Kelvin:

```javascript
class Temperature {
  // Use getters and setters for celsius, fahrenheit, and kelvin
  // Include validation (Kelvin cannot be below 0)
  // Add methods: toString(), equals(otherTemp), compare(otherTemp)
  // Static methods: fromFahrenheit(f), fromKelvin(k)
}

// Test your implementation
const temp1 = new Temperature(25); // 25°C
console.log(temp1.fahrenheit); // Should show Fahrenheit equivalent
temp1.kelvin = 300;
console.log(temp1.celsius); // Should show new Celsius value

const temp2 = Temperature.fromFahrenheit(100);
console.log(temp2.celsius); // Should be approximately 37.78
```

### Exercise 3: Shopping Cart

Create a `ShoppingCart` class with private fields and methods:

```javascript
class ShoppingCart {
  // Private fields: #items, #taxRate
  // Constructor: accepts taxRate (default 0.08)
  // Methods:
  //   - addItem(name, price, quantity = 1)
  //   - removeItem(name)
  //   - updateQuantity(name, quantity)
  //   - getSubtotal()
  //   - getTax()
  //   - getTotal()
  //   - getItems() - returns copy of items
  //   - clear()
  // Private methods: #findItem(name), #calculateItemTotal(item)
}

// Test your implementation
const cart = new ShoppingCart(0.1); // 10% tax
cart.addItem("Laptop", 999.99, 1);
cart.addItem("Mouse", 29.99, 2);
console.log(cart.getTotal()); // Should include tax
```

---

**Next**: Continue with [04-inheritance-polymorphism.md](./04-inheritance-polymorphism.md) to learn about class inheritance and polymorphism.
