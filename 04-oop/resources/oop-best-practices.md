# OOP Best Practices

This guide covers best practices for writing maintainable and effective object-oriented JavaScript code.

## 🎯 Design Principles

### 1. Single Responsibility Principle (SRP)

Each class should have only one reason to change.

```javascript
// ❌ Bad: Multiple responsibilities
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  save() {
    // Database logic
    console.log("Saving to database...");
  }

  sendEmail() {
    // Email logic
    console.log("Sending email...");
  }

  validateEmail() {
    // Validation logic
    return this.email.includes("@");
  }
}

// ✅ Good: Separated responsibilities
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  getName() {
    return this.name;
  }

  getEmail() {
    return this.email;
  }
}

class UserRepository {
  save(user) {
    console.log("Saving to database...");
  }
}

class EmailService {
  send(email, message) {
    console.log("Sending email...");
  }
}

class EmailValidator {
  static isValid(email) {
    return email.includes("@");
  }
}
```

### 2. Open/Closed Principle (OCP)

Classes should be open for extension but closed for modification.

```javascript
// ✅ Good: Extensible design
class Shape {
  area() {
    throw new Error("area() method must be implemented");
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius * this.radius;
  }
}

class AreaCalculator {
  static calculate(shapes) {
    return shapes.reduce((total, shape) => total + shape.area(), 0);
  }
}
```

### 3. Liskov Substitution Principle (LSP)

Derived classes must be substitutable for their base classes.

```javascript
// ✅ Good: Proper inheritance
class Bird {
  fly() {
    console.log("Flying...");
  }
}

class Sparrow extends Bird {
  fly() {
    console.log("Sparrow flying at low altitude");
  }
}

class Eagle extends Bird {
  fly() {
    console.log("Eagle soaring high");
  }
}

// Can substitute any bird type
function makeBirdFly(bird) {
  bird.fly(); // Works with any Bird subclass
}
```

## 🏗️ Class Design Best Practices

### 1. Use Clear and Descriptive Names

```javascript
// ❌ Bad: Unclear names
class D {
  constructor(n, a) {
    this.n = n;
    this.a = a;
  }

  calc() {
    return this.a * 365;
  }
}

// ✅ Good: Clear names
class SalaryCalculator {
  constructor(employeeName, annualSalary) {
    this.employeeName = employeeName;
    this.annualSalary = annualSalary;
  }

  calculateDailySalary() {
    return this.annualSalary / 365;
  }
}
```

### 2. Favor Composition over Inheritance

```javascript
// ❌ Bad: Deep inheritance
class Animal {
  move() {
    console.log("Moving...");
  }
}

class Mammal extends Animal {
  breathe() {
    console.log("Breathing air...");
  }
}

class Dog extends Mammal {
  bark() {
    console.log("Woof!");
  }
}

// ✅ Good: Composition
class MovementBehavior {
  move() {
    console.log("Moving...");
  }
}

class BreathingBehavior {
  breathe() {
    console.log("Breathing air...");
  }
}

class SoundBehavior {
  makeSound() {
    console.log("Making sound...");
  }
}

class Dog {
  constructor() {
    this.movement = new MovementBehavior();
    this.breathing = new BreathingBehavior();
    this.sound = new SoundBehavior();
  }

  move() {
    this.movement.move();
  }

  breathe() {
    this.breathing.breathe();
  }

  bark() {
    console.log("Woof!");
  }
}
```

### 3. Use Private Fields and Methods

```javascript
class BankAccount {
  #balance = 0;
  #accountNumber;

  constructor(accountNumber) {
    this.#accountNumber = accountNumber;
  }

  deposit(amount) {
    if (this.#isValidAmount(amount)) {
      this.#balance += amount;
      return true;
    }
    return false;
  }

  withdraw(amount) {
    if (this.#isValidAmount(amount) && this.#hasSufficientFunds(amount)) {
      this.#balance -= amount;
      return true;
    }
    return false;
  }

  getBalance() {
    return this.#balance;
  }

  #isValidAmount(amount) {
    return amount > 0 && typeof amount === "number";
  }

  #hasSufficientFunds(amount) {
    return this.#balance >= amount;
  }
}
```

## 🔄 Design Patterns Best Practices

### 1. Module Pattern for Namespace Management

```javascript
const UserModule = (function () {
  // Private variables
  let users = [];
  let currentId = 1;

  // Private methods
  function generateId() {
    return currentId++;
  }

  function validateUser(user) {
    return user.name && user.email;
  }

  // Public API
  return {
    addUser(name, email) {
      const user = {
        id: generateId(),
        name,
        email
      };

      if (validateUser(user)) {
        users.push(user);
        return user;
      }

      throw new Error("Invalid user data");
    },

    getUser(id) {
      return users.find((user) => user.id === id);
    },

    getAllUsers() {
      return [...users]; // Return copy
    }
  };
})();
```

### 2. Observer Pattern for Event Handling

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data));
    }
  }
}

// Usage
class UserService extends EventEmitter {
  createUser(userData) {
    const user = new User(userData);
    this.emit("userCreated", user);
    return user;
  }
}

const userService = new UserService();
userService.on("userCreated", (user) => {
  console.log("New user created:", user);
});
```

## 📝 Code Organization

### 1. File Structure

```
src/
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── services/
│   ├── UserService.js
│   ├── ProductService.js
│   └── OrderService.js
├── utils/
│   ├── Validator.js
│   └── Logger.js
└── index.js
```

### 2. Import/Export Best Practices

```javascript
// User.js
export default class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
}

export class UserValidator {
    static isValid(user) {
        return user.name && user.email;
    }
}

// UserService.js
import User, { UserValidator } from './models/User.js';

export default class UserService {
    createUser(userData) {
        if (UserValidator.isValid(userData)) {
            return new User(userData.name, userData.email);
        }
        throw new Error('Invalid user data');
    }
}
```

## 🧪 Testing Best Practices

### 1. Write Testable Classes

```javascript
class Calculator {
  add(a, b) {
    return a + b;
  }

  multiply(a, b) {
    return a * b;
  }

  calculate(expression) {
    // Parse and calculate expression
    const parts = expression.split(" ");
    const a = parseFloat(parts[0]);
    const operator = parts[1];
    const b = parseFloat(parts[2]);

    switch (operator) {
      case "+":
        return this.add(a, b);
      case "*":
        return this.multiply(a, b);
      default:
        throw new Error("Unsupported operator");
    }
  }
}

// Easy to test individual methods
const calc = new Calculator();
console.assert(calc.add(2, 3) === 5);
console.assert(calc.multiply(4, 5) === 20);
console.assert(calc.calculate("2 + 3") === 5);
```

### 2. Dependency Injection for Testing

```javascript
class EmailService {
  send(to, message) {
    // Send email implementation
  }
}

class UserService {
  constructor(emailService) {
    this.emailService = emailService;
  }

  createUser(userData) {
    const user = new User(userData);
    this.emailService.send(user.email, "Welcome!");
    return user;
  }
}

// Easy to mock for testing
class MockEmailService {
  send(to, message) {
    console.log(`Mock: Sending "${message}" to ${to}`);
  }
}

// Testing
const mockEmailService = new MockEmailService();
const userService = new UserService(mockEmailService);
```

## 🚀 Performance Considerations

### 1. Avoid Creating Unnecessary Objects

```javascript
// ❌ Bad: Creating objects in loops
class DataProcessor {
  processItems(items) {
    return items.map((item) => {
      return new ProcessedItem(item); // Creates many objects
    });
  }
}

// ✅ Good: Reuse objects when possible
class DataProcessor {
  constructor() {
    this.processedItem = new ProcessedItem();
  }

  processItems(items) {
    return items.map((item) => {
      this.processedItem.reset();
      this.processedItem.process(item);
      return this.processedItem.getResult();
    });
  }
}
```

### 2. Use Object Pooling for Expensive Objects

```javascript
class ObjectPool {
  constructor(createFn, maxSize = 10) {
    this.createFn = createFn;
    this.pool = [];
    this.maxSize = maxSize;
  }

  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.createFn();
  }

  release(obj) {
    if (this.pool.length < this.maxSize) {
      obj.reset(); // Reset object state
      this.pool.push(obj);
    }
  }
}

// Usage
const particlePool = new ObjectPool(() => new Particle(), 100);
```

## 📋 Checklist for Good OOP Code

- [ ] Classes have single responsibility
- [ ] Methods are small and focused
- [ ] Private data is properly encapsulated
- [ ] Inheritance hierarchies are shallow
- [ ] Composition is preferred over inheritance
- [ ] Code is easy to test
- [ ] Dependencies are injected, not hardcoded
- [ ] Error handling is consistent
- [ ] Performance considerations are addressed
- [ ] Code follows naming conventions

## 🎯 Remember

1. **KISS** - Keep It Simple, Stupid
2. **DRY** - Don't Repeat Yourself
3. **YAGNI** - You Aren't Gonna Need It
4. **Fail Fast** - Detect and report errors early
5. **Code for Readability** - Code is read more than written
