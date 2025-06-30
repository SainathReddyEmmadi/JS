# Encapsulation and Abstraction in JavaScript

## Table of Contents

1. [Introduction to Encapsulation](#introduction-to-encapsulation)
2. [Data Hiding Techniques](#data-hiding-techniques)
3. [Private Fields and Methods](#private-fields-and-methods)
4. [Property Descriptors](#property-descriptors)
5. [Closures for Encapsulation](#closures-for-encapsulation)
6. [Introduction to Abstraction](#introduction-to-abstraction)
7. [Abstract Classes and Interfaces](#abstract-classes-and-interfaces)
8. [Information Hiding](#information-hiding)
9. [Access Modifiers Simulation](#access-modifiers-simulation)
10. [Real-World Applications](#real-world-applications)
11. [Best Practices](#best-practices)
12. [Common Patterns](#common-patterns)
13. [Self-Check Questions](#self-check-questions)
14. [Practice Exercises](#practice-exercises)

## Introduction to Encapsulation

Encapsulation is the bundling of data (properties) and methods that operate on that data within a single unit (class), while restricting direct access to some of the object's components. This is a fundamental principle of object-oriented programming.

### Key Benefits of Encapsulation

1. **Data Protection**: Prevents unauthorized access to internal state
2. **Maintainability**: Changes to internal implementation don't affect external code
3. **Validation**: Control how data is modified through setter methods
4. **Debugging**: Easier to track how and where data is modified

### Basic Example

```javascript
// Without encapsulation - direct property access
class UserBad {
  constructor(name, email) {
    this.name = name;
    this.email = email;
    this.isActive = true;
  }
}

const user1 = new UserBad("John", "john@example.com");
user1.email = "invalid-email"; // No validation!
user1.isActive = "maybe"; // Wrong data type!

// With encapsulation - controlled access
class UserGood {
  constructor(name, email) {
    this._name = name;
    this._email = email;
    this._isActive = true;
  }

  // Getter for name
  get name() {
    return this._name;
  }

  // Setter for name with validation
  set name(value) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error("Name must be a non-empty string");
    }
    this._name = value.trim();
  }

  // Getter for email
  get email() {
    return this._email;
  }

  // Setter for email with validation
  set email(value) {
    if (!this._isValidEmail(value)) {
      throw new Error("Invalid email format");
    }
    this._email = value;
  }

  // Private method for email validation
  _isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Controlled method for status change
  activate() {
    this._isActive = true;
  }

  deactivate() {
    this._isActive = false;
  }

  isActive() {
    return this._isActive;
  }
}

const user2 = new UserGood("John", "john@example.com");
// user2.email = 'invalid'; // Throws error
user2.email = "john.doe@example.com"; // Works
console.log(user2.email); // "john.doe@example.com"
```

## Data Hiding Techniques

### 1. Underscore Convention

The underscore prefix is a widely-used convention to indicate private members, though they remain technically accessible.

```javascript
class BankAccount {
  constructor(accountNumber, initialBalance) {
    this._accountNumber = accountNumber;
    this._balance = initialBalance;
    this._transactions = [];
    this._isLocked = false;
  }

  // Public interface
  deposit(amount) {
    if (this._isLocked) {
      throw new Error("Account is locked");
    }

    this._validateAmount(amount);
    this._balance += amount;
    this._addTransaction("deposit", amount);
    return this._balance;
  }

  withdraw(amount) {
    if (this._isLocked) {
      throw new Error("Account is locked");
    }

    this._validateAmount(amount);

    if (amount > this._balance) {
      throw new Error("Insufficient funds");
    }

    this._balance -= amount;
    this._addTransaction("withdrawal", amount);
    return this._balance;
  }

  getBalance() {
    return this._balance;
  }

  getStatement() {
    return {
      accountNumber: this._accountNumber,
      balance: this._balance,
      transactions: [...this._transactions] // Return copy
    };
  }

  // "Private" methods (by convention)
  _validateAmount(amount) {
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Amount must be a positive number");
    }
  }

  _addTransaction(type, amount) {
    this._transactions.push({
      type,
      amount,
      date: new Date(),
      balance: this._balance
    });
  }

  _lockAccount() {
    this._isLocked = true;
  }

  _unlockAccount() {
    this._isLocked = false;
  }
}

const account = new BankAccount("12345", 1000);
console.log(account.getBalance()); // 1000
account.deposit(500); // 1500
account.withdraw(200); // 1300

// These work but violate the intended interface
console.log(account._balance); // 1300 (should be private)
account._balance = 10000; // Direct modification (bad!)
```

### 2. Symbol-based Privacy

Using Symbols provides a stronger form of privacy as they're not enumerable and require explicit access.

```javascript
const _balance = Symbol("balance");
const _accountNumber = Symbol("accountNumber");
const _validateAmount = Symbol("validateAmount");

class SecureBankAccount {
  constructor(accountNumber, initialBalance) {
    this[_accountNumber] = accountNumber;
    this[_balance] = initialBalance;
  }

  deposit(amount) {
    this[_validateAmount](amount);
    this[_balance] += amount;
    return this[_balance];
  }

  withdraw(amount) {
    this[_validateAmount](amount);

    if (amount > this[_balance]) {
      throw new Error("Insufficient funds");
    }

    this[_balance] -= amount;
    return this[_balance];
  }

  getBalance() {
    return this[_balance];
  }

  [_validateAmount](amount) {
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Amount must be a positive number");
    }
  }
}

const secureAccount = new SecureBankAccount("12345", 1000);
console.log(secureAccount.getBalance()); // 1000

// These won't work - symbols are not accessible externally
// console.log(secureAccount[_balance]); // ReferenceError
// console.log(secureAccount._balance);  // undefined

// Symbols are not enumerable
console.log(Object.keys(secureAccount)); // []
console.log(Object.getOwnPropertyNames(secureAccount)); // []

// But symbols can still be accessed if you know them
const symbols = Object.getOwnPropertySymbols(secureAccount);
console.log(secureAccount[symbols[0]]); // Can access if symbol is known
```

## Private Fields and Methods

ES2022 introduced true private fields and methods using the `#` syntax.

### Private Fields

```javascript
class Counter {
    // Private fields
    #count = 0;
    #maxCount;
    #step;

    constructor(maxCount = 100, step = 1) {
        this.#maxCount = maxCount;
        this.#step = step;
    }

    increment() {
        if (this.#count + this.#step <= this.#maxCount) {
            this.#count += this.#step;
        } else {
            throw new Error(`Cannot exceed maximum count of ${this.#maxCount}`);
        }
        return this.#count;
    }

    decrement() {
        if (this.#count - this.#step >= 0) {
            this.#count -= this.#step;
        } else {
            throw new Error('Cannot go below zero');
        }
        return this.#count;
    }

    get value() {
        return this.#count;
    }

    reset() {
        this.#count = 0;
    }

    // Static private field
    static #instanceCount = 0;

    static getInstanceCount() {
        return Counter.#instanceCount;
    }

    constructor(...args) {
        Counter.#instanceCount++;
        // ... rest of constructor
    }
}

const counter = new Counter(10, 2);
console.log(counter.value);  // 0
counter.increment();         // 2
counter.increment();         // 4

// These will cause syntax errors - truly private
// console.log(counter.#count);    // SyntaxError
// counter.#count = 100;           // SyntaxError
```

### Private Methods

```javascript
class UserManager {
  #users = new Map();
  #salt = "random_salt_string";

  constructor() {
    this.#initializeDefaultUsers();
  }

  // Private method
  #hashPassword(password) {
    // Simple hash simulation (use proper hashing in real apps)
    let hash = 0;
    const combined = password + this.#salt;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }

  // Private method
  #validatePassword(password) {
    if (typeof password !== "string" || password.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    if (!/[A-Z]/.test(password)) {
      throw new Error("Password must contain at least one uppercase letter");
    }

    if (!/[0-9]/.test(password)) {
      throw new Error("Password must contain at least one number");
    }
  }

  // Private method
  #initializeDefaultUsers() {
    this.registerUser("admin", "AdminPass123", "admin");
  }

  // Public methods
  registerUser(username, password, role = "user") {
    if (this.#users.has(username)) {
      throw new Error("Username already exists");
    }

    this.#validatePassword(password);

    const hashedPassword = this.#hashPassword(password);

    this.#users.set(username, {
      username,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      lastLogin: null
    });

    return { username, role };
  }

  authenticateUser(username, password) {
    const user = this.#users.get(username);
    if (!user) {
      throw new Error("User not found");
    }

    const hashedInput = this.#hashPassword(password);
    if (hashedInput !== user.password) {
      throw new Error("Invalid password");
    }

    user.lastLogin = new Date();
    return { username: user.username, role: user.role };
  }

  getUserCount() {
    return this.#users.size;
  }

  // Cannot access private methods from outside
  // exposeHash(password) {
  //     return this.#hashPassword(password); // This works from inside
  // }
}

const userManager = new UserManager();
console.log(userManager.getUserCount()); // 1 (admin user)

userManager.registerUser("john", "SecurePass123");
const auth = userManager.authenticateUser("john", "SecurePass123");
console.log(auth); // { username: 'john', role: 'user' }

// These will cause syntax errors
// userManager.#hashPassword('test');     // SyntaxError
// console.log(userManager.#users);       // SyntaxError
```

### Private Static Methods

```javascript
class MathUtils {
  static #PI_PRECISION = 10;

  // Private static method
  static #roundToPrecision(value, precision) {
    const factor = Math.pow(10, precision);
    return Math.round(value * factor) / factor;
  }

  // Private static method for validation
  static #validateNumber(value) {
    if (typeof value !== "number" || isNaN(value)) {
      throw new Error("Value must be a valid number");
    }
  }

  // Public static methods
  static circleArea(radius) {
    this.#validateNumber(radius);
    if (radius < 0) {
      throw new Error("Radius cannot be negative");
    }

    const area = Math.PI * radius * radius;
    return this.#roundToPrecision(area, this.#PI_PRECISION);
  }

  static sphereVolume(radius) {
    this.#validateNumber(radius);
    if (radius < 0) {
      throw new Error("Radius cannot be negative");
    }

    const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
    return this.#roundToPrecision(volume, this.#PI_PRECISION);
  }

  static factorial(n) {
    this.#validateNumber(n);
    if (n < 0 || !Number.isInteger(n)) {
      throw new Error("Factorial requires a non-negative integer");
    }

    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }
}

console.log(MathUtils.circleArea(5)); // 78.5398163397
console.log(MathUtils.sphereVolume(3)); // 113.0973355292
console.log(MathUtils.factorial(5)); // 120

// These will cause syntax errors
// MathUtils.#roundToPrecision(3.14159, 2); // SyntaxError
// console.log(MathUtils.#PI_PRECISION);     // SyntaxError
```

## Property Descriptors

Property descriptors provide fine-grained control over property behavior.

### Configuring Property Access

```javascript
class Product {
  constructor(name, price, category) {
    // Regular properties
    this._name = name;
    this._price = price;
    this._category = category;
    this._sales = 0;

    // Configure read-only properties
    Object.defineProperty(this, "id", {
      value: Math.random().toString(36).substr(2, 9),
      writable: false, // Cannot be changed
      enumerable: true, // Shows in Object.keys()
      configurable: false // Cannot be deleted or reconfigured
    });

    Object.defineProperty(this, "createdAt", {
      value: new Date(),
      writable: false,
      enumerable: true,
      configurable: false
    });

    // Configure computed property
    Object.defineProperty(this, "revenue", {
      get: function () {
        return this._price * this._sales;
      },
      enumerable: true,
      configurable: false
    });

    // Configure property with validation
    Object.defineProperty(this, "price", {
      get: function () {
        return this._price;
      },
      set: function (value) {
        if (typeof value !== "number" || value < 0) {
          throw new Error("Price must be a non-negative number");
        }
        this._price = value;
      },
      enumerable: true,
      configurable: true
    });
  }

  sell(quantity = 1) {
    if (quantity <= 0) {
      throw new Error("Quantity must be positive");
    }
    this._sales += quantity;
    return this.revenue;
  }

  getInfo() {
    return {
      id: this.id,
      name: this._name,
      price: this.price,
      sales: this._sales,
      revenue: this.revenue,
      createdAt: this.createdAt
    };
  }
}

const product = new Product("Laptop", 999, "Electronics");

console.log(product.id); // Generated ID
console.log(product.price); // 999
console.log(product.revenue); // 0

product.sell(5);
console.log(product.revenue); // 4995

// These will work
product.price = 1199;
console.log(product.price); // 1199

// These will fail
try {
  product.id = "new-id"; // Cannot change read-only property
} catch (e) {
  console.log("Cannot change ID");
}

try {
  product.price = -100; // Validation error
} catch (e) {
  console.log("Invalid price");
}

// Property enumeration
console.log(Object.keys(product)); // Shows enumerable properties
```

### Multiple Properties Configuration

```javascript
class ConfigurableClass {
  constructor() {
    Object.defineProperties(this, {
      // Read-only property
      version: {
        value: "1.0.0",
        writable: false,
        enumerable: true,
        configurable: false
      },

      // Hidden property (not enumerable)
      _secret: {
        value: "hidden-value",
        writable: true,
        enumerable: false,
        configurable: true
      },

      // Computed property
      timestamp: {
        get: () => new Date().toISOString(),
        enumerable: true,
        configurable: false
      },

      // Property with getter and setter
      _count: {
        value: 0,
        writable: true,
        enumerable: false,
        configurable: true
      },

      count: {
        get: function () {
          return this._count;
        },
        set: function (value) {
          if (typeof value === "number" && value >= 0) {
            this._count = value;
          }
        },
        enumerable: true,
        configurable: true
      }
    });
  }
}

const obj = new ConfigurableClass();
console.log(obj.version); // "1.0.0"
console.log(obj.timestamp); // Current timestamp
console.log(obj.count); // 0

obj.count = 10;
console.log(obj.count); // 10

// Hidden from enumeration
console.log(Object.keys(obj)); // ['version', 'timestamp', 'count']
```

## Closures for Encapsulation

Closures provide another way to achieve true privacy in JavaScript.

### Function Factory Pattern

```javascript
function createBankAccount(accountNumber, initialBalance) {
  // Private variables in closure
  let balance = initialBalance;
  let transactions = [];
  let isLocked = false;

  // Private functions
  function validateAmount(amount) {
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Amount must be a positive number");
    }
  }

  function addTransaction(type, amount) {
    transactions.push({
      type,
      amount,
      date: new Date(),
      balance: balance
    });
  }

  // Return public interface
  return {
    deposit(amount) {
      if (isLocked) {
        throw new Error("Account is locked");
      }

      validateAmount(amount);
      balance += amount;
      addTransaction("deposit", amount);
      return balance;
    },

    withdraw(amount) {
      if (isLocked) {
        throw new Error("Account is locked");
      }

      validateAmount(amount);

      if (amount > balance) {
        throw new Error("Insufficient funds");
      }

      balance -= amount;
      addTransaction("withdrawal", amount);
      return balance;
    },

    getBalance() {
      return balance;
    },

    getAccountNumber() {
      return accountNumber;
    },

    getTransactionHistory() {
      return [...transactions]; // Return copy
    },

    lock() {
      isLocked = true;
    },

    unlock() {
      isLocked = false;
    },

    isAccountLocked() {
      return isLocked;
    }
  };
}

const account = createBankAccount("12345", 1000);

console.log(account.getBalance()); // 1000
account.deposit(500); // 1500
account.withdraw(200); // 1300

// These variables are truly private - no way to access them
// console.log(account.balance);     // undefined
// console.log(account.transactions); // undefined

console.log(account.getTransactionHistory()); // Shows transaction history
```

### Module Pattern with Closures

```javascript
const UserModule = (function () {
  // Private static variables
  let users = new Map();
  let currentUser = null;
  let sessionTimeout = 30 * 60 * 1000; // 30 minutes

  // Private static functions
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function hashPassword(password) {
    // Simple hash simulation
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  function createSession(username) {
    return {
      username,
      loginTime: new Date(),
      expiresAt: new Date(Date.now() + sessionTimeout)
    };
  }

  // Public API
  return {
    register(username, email, password) {
      if (users.has(username)) {
        throw new Error("Username already exists");
      }

      if (!validateEmail(email)) {
        throw new Error("Invalid email format");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      users.set(username, {
        username,
        email,
        password: hashPassword(password),
        createdAt: new Date(),
        isActive: true
      });

      return { username, email };
    },

    login(username, password) {
      const user = users.get(username);
      if (!user || !user.isActive) {
        throw new Error("Invalid username or password");
      }

      if (hashPassword(password) !== user.password) {
        throw new Error("Invalid username or password");
      }

      currentUser = createSession(username);
      return { username, loginTime: currentUser.loginTime };
    },

    logout() {
      if (!currentUser) {
        throw new Error("No user logged in");
      }

      const username = currentUser.username;
      currentUser = null;
      return { message: `${username} logged out successfully` };
    },

    getCurrentUser() {
      if (!currentUser) {
        return null;
      }

      if (new Date() > currentUser.expiresAt) {
        currentUser = null;
        return null;
      }

      return {
        username: currentUser.username,
        loginTime: currentUser.loginTime,
        expiresAt: currentUser.expiresAt
      };
    },

    getUserCount() {
      return users.size;
    },

    // Configuration methods
    setSessionTimeout(minutes) {
      sessionTimeout = minutes * 60 * 1000;
    }
  };
})();

// Usage
UserModule.register("john", "john@example.com", "password123");
UserModule.register("jane", "jane@example.com", "secure456");

console.log("User count:", UserModule.getUserCount()); // 2

UserModule.login("john", "password123");
console.log("Current user:", UserModule.getCurrentUser());

UserModule.logout();
console.log("Current user:", UserModule.getCurrentUser()); // null

// Private variables are completely inaccessible
// console.log(UserModule.users);        // undefined
// console.log(UserModule.currentUser);  // undefined
```

## Introduction to Abstraction

Abstraction is the concept of hiding complex implementation details while exposing only the essential features of an object. It focuses on what an object does rather than how it does it.

### Levels of Abstraction

```javascript
// Low-level abstraction - Database operations
class DatabaseConnection {
  constructor(connectionString) {
    this.connectionString = connectionString;
    this.isConnected = false;
  }

  connect() {
    // Complex connection logic hidden
    console.log("Establishing database connection...");
    this.isConnected = true;
  }

  executeQuery(sql, params) {
    if (!this.isConnected) {
      this.connect();
    }

    // Complex query execution logic hidden
    console.log(`Executing: ${sql} with params:`, params);
    return { success: true, data: [] };
  }

  disconnect() {
    console.log("Closing database connection...");
    this.isConnected = false;
  }
}

// Medium-level abstraction - Repository pattern
class UserRepository {
  constructor(dbConnection) {
    this.db = dbConnection;
  }

  create(userData) {
    // Abstract away SQL details
    const sql = "INSERT INTO users (name, email, created_at) VALUES (?, ?, ?)";
    const params = [userData.name, userData.email, new Date()];
    return this.db.executeQuery(sql, params);
  }

  findById(id) {
    const sql = "SELECT * FROM users WHERE id = ?";
    return this.db.executeQuery(sql, [id]);
  }

  findByEmail(email) {
    const sql = "SELECT * FROM users WHERE email = ?";
    return this.db.executeQuery(sql, [email]);
  }

  update(id, userData) {
    const sql = "UPDATE users SET name = ?, email = ? WHERE id = ?";
    const params = [userData.name, userData.email, id];
    return this.db.executeQuery(sql, params);
  }

  delete(id) {
    const sql = "DELETE FROM users WHERE id = ?";
    return this.db.executeQuery(sql, [id]);
  }
}

// High-level abstraction - Service layer
class UserService {
  constructor(userRepository) {
    this.userRepo = userRepository;
  }

  // Abstract business logic
  registerUser(name, email) {
    // Hide validation, duplicate checking, etc.
    if (!this.isValidEmail(email)) {
      throw new Error("Invalid email format");
    }

    const existingUser = this.userRepo.findByEmail(email);
    if (existingUser.data.length > 0) {
      throw new Error("Email already registered");
    }

    return this.userRepo.create({ name, email });
  }

  updateUserProfile(userId, profileData) {
    // Hide complex update logic
    const user = this.userRepo.findById(userId);
    if (user.data.length === 0) {
      throw new Error("User not found");
    }

    return this.userRepo.update(userId, profileData);
  }

  // Private implementation details
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Usage - Client code doesn't need to know implementation details
const db = new DatabaseConnection("mongodb://localhost:27017/myapp");
const userRepo = new UserRepository(db);
const userService = new UserService(userRepo);

// Simple, abstract interface
userService.registerUser("John Doe", "john@example.com");
userService.updateUserProfile(1, { name: "John Smith" });
```

## Abstract Classes and Interfaces

### Abstract Base Classes

```javascript
class AbstractShape {
  constructor(color) {
    // Prevent direct instantiation
    if (this.constructor === AbstractShape) {
      throw new Error("Cannot instantiate abstract class");
    }

    this.color = color;
    this.created = new Date();
  }

  // Concrete method - implemented in base class
  getColor() {
    return this.color;
  }

  setColor(color) {
    this.color = color;
  }

  getAge() {
    return Date.now() - this.created.getTime();
  }

  // Abstract methods - must be implemented by subclasses
  getArea() {
    throw new Error("getArea() must be implemented by subclass");
  }

  getPerimeter() {
    throw new Error("getPerimeter() must be implemented by subclass");
  }

  draw() {
    throw new Error("draw() must be implemented by subclass");
  }

  // Template method - defines algorithm structure
  render() {
    console.log(`Rendering ${this.constructor.name}:`);
    console.log(`Color: ${this.color}`);
    console.log(`Area: ${this.getArea()}`);
    console.log(`Perimeter: ${this.getPerimeter()}`);
    this.draw();
    console.log("Rendering complete\n");
  }
}

class Circle extends AbstractShape {
  constructor(radius, color) {
    super(color);
    this.radius = radius;
  }

  getArea() {
    return Math.PI * this.radius ** 2;
  }

  getPerimeter() {
    return 2 * Math.PI * this.radius;
  }

  draw() {
    console.log(`Drawing circle with radius ${this.radius}`);
    console.log("    ○");
  }
}

class Rectangle extends AbstractShape {
  constructor(width, height, color) {
    super(color);
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }

  getPerimeter() {
    return 2 * (this.width + this.height);
  }

  draw() {
    console.log(`Drawing rectangle ${this.width}x${this.height}`);
    console.log("    ▭");
  }
}

// Usage
const shapes = [new Circle(5, "red"), new Rectangle(4, 6, "blue")];

shapes.forEach((shape) => shape.render());

// This would throw an error:
// const shape = new AbstractShape('green'); // Error: Cannot instantiate abstract class
```

### Interface Simulation

```javascript
// Interface definition using functions
function Drawable() {
  throw new Error("Drawable is an interface and cannot be instantiated");
}

Drawable.prototype.draw = function () {
  throw new Error("draw() method must be implemented");
};

function Resizable() {
  throw new Error("Resizable is an interface and cannot be instantiated");
}

Resizable.prototype.resize = function (factor) {
  throw new Error("resize() method must be implemented");
};

Resizable.prototype.getSize = function () {
  throw new Error("getSize() method must be implemented");
};

// Helper function to implement interfaces
function implementInterface(target, ...interfaces) {
  interfaces.forEach((Interface) => {
    Object.getOwnPropertyNames(Interface.prototype).forEach((method) => {
      if (
        method !== "constructor" &&
        typeof Interface.prototype[method] === "function"
      ) {
        if (typeof target.prototype[method] !== "function") {
          throw new Error(
            `Class ${target.name} must implement ${method}() from ${Interface.name}`
          );
        }
      }
    });
  });
}

// Class implementing multiple interfaces
class Square {
  constructor(side) {
    this.side = side;
  }

  // Implement Drawable interface
  draw() {
    console.log(`Drawing square with side ${this.side}`);
    console.log("    ■");
  }

  // Implement Resizable interface
  resize(factor) {
    this.side *= factor;
    console.log(`Square resized to side ${this.side}`);
  }

  getSize() {
    return { width: this.side, height: this.side, area: this.side ** 2 };
  }

  // Additional methods
  getArea() {
    return this.side ** 2;
  }
}

// Verify interface implementation
implementInterface(Square, Drawable, Resizable);

const square = new Square(5);
square.draw(); // Drawing square with side 5
console.log(square.getSize()); // { width: 5, height: 5, area: 25 }
square.resize(2); // Square resized to side 10
console.log(square.getSize()); // { width: 10, height: 10, area: 100 }
```

## Information Hiding

Information hiding is about exposing only what's necessary and keeping implementation details private.

### API Design with Information Hiding

```javascript
class HTTPClient {
  #baseUrl;
  #defaultHeaders;
  #timeout;
  #retryCount;

  constructor(baseUrl, options = {}) {
    this.#baseUrl = baseUrl;
    this.#defaultHeaders = {
      "Content-Type": "application/json",
      ...options.headers
    };
    this.#timeout = options.timeout || 5000;
    this.#retryCount = options.retries || 3;
  }

  // Public API - simple and clean
  async get(path, params = {}) {
    const url = this.#buildUrl(path, params);
    return this.#makeRequest("GET", url);
  }

  async post(path, data = {}) {
    const url = this.#buildUrl(path);
    return this.#makeRequest("POST", url, data);
  }

  async put(path, data = {}) {
    const url = this.#buildUrl(path);
    return this.#makeRequest("PUT", url, data);
  }

  async delete(path) {
    const url = this.#buildUrl(path);
    return this.#makeRequest("DELETE", url);
  }

  // Private implementation details
  #buildUrl(path, params = {}) {
    const url = new URL(path, this.#baseUrl);

    Object.keys(params).forEach((key) => {
      url.searchParams.append(key, params[key]);
    });

    return url.toString();
  }

  async #makeRequest(method, url, data = null) {
    const options = {
      method,
      headers: { ...this.#defaultHeaders },
      timeout: this.#timeout
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    return this.#makeRequestWithRetry(url, options);
  }

  async #makeRequestWithRetry(url, options, attempt = 1) {
    try {
      console.log(
        `Making ${options.method} request to ${url} (attempt ${attempt})`
      );

      // Simulate HTTP request
      const response = await this.#simulateHttpRequest(url, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.data;
    } catch (error) {
      if (attempt < this.#retryCount) {
        console.log(
          `Request failed, retrying... (${attempt}/${this.#retryCount})`
        );
        await this.#delay(1000 * attempt); // Exponential backoff
        return this.#makeRequestWithRetry(url, options, attempt + 1);
      }

      throw error;
    }
  }

  async #simulateHttpRequest(url, options) {
    // Simulate network delay
    await this.#delay(Math.random() * 1000);

    // Simulate success/failure
    const success = Math.random() > 0.2; // 80% success rate

    if (success) {
      return {
        ok: true,
        status: 200,
        data: { message: "Success", url, method: options.method }
      };
    } else {
      return {
        ok: false,
        status: 500,
        statusText: "Internal Server Error"
      };
    }
  }

  async #delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Usage - client code doesn't need to know about retries, URL building, etc.
const api = new HTTPClient("https://api.example.com", {
  timeout: 3000,
  retries: 2
});

async function example() {
  try {
    const users = await api.get("/users", { page: 1, limit: 10 });
    console.log("Users:", users);

    const newUser = await api.post("/users", {
      name: "John Doe",
      email: "john@example.com"
    });
    console.log("Created user:", newUser);
  } catch (error) {
    console.error("API Error:", error.message);
  }
}

example();
```

## Access Modifiers Simulation

JavaScript doesn't have built-in access modifiers like other OOP languages, but we can simulate them.

### Simulating Public, Protected, and Private

```javascript
class AccessModifiersExample {
  constructor(name) {
    // Public - accessible everywhere
    this.publicProperty = "I am public";

    // Protected - accessible in class and subclasses (by convention)
    this._protectedProperty = "I am protected";

    // Private - only accessible within this class
    this.#privateProperty = "I am private";

    this.name = name;
  }

  // Public method
  publicMethod() {
    console.log("This is a public method");
    console.log("Can access all properties:");
    console.log("- Public:", this.publicProperty);
    console.log("- Protected:", this._protectedProperty);
    console.log("- Private:", this.#privateProperty);
  }

  // Protected method (by convention)
  _protectedMethod() {
    console.log("This is a protected method");
    return this.#privateMethod();
  }

  // Private method
  #privateMethod() {
    console.log("This is a private method");
    return "private result";
  }

  // Public method that uses protected and private
  doSomething() {
    console.log(`${this.name} is doing something...`);
    const result = this._protectedMethod();
    console.log("Result:", result);
  }
}

class SubClass extends AccessModifiersExample {
  constructor(name, type) {
    super(name);
    this.type = type;
  }

  subClassMethod() {
    console.log("In subclass:");
    console.log("- Can access public:", this.publicProperty);
    console.log("- Can access protected:", this._protectedProperty);

    // This would cause an error:
    // console.log('- Cannot access private:', this.#privateProperty);

    // Can call protected method
    this._protectedMethod();

    // Cannot call private method:
    // this.#privateMethod(); // SyntaxError
  }

  // Override protected method
  _protectedMethod() {
    console.log("Overridden protected method in subclass");
    return super._protectedMethod();
  }
}

// Usage
const obj = new AccessModifiersExample("Parent");
obj.publicMethod(); // Works
obj._protectedMethod(); // Works but not recommended
// obj.#privateMethod();         // SyntaxError

const sub = new SubClass("Child", "Extended");
sub.publicMethod(); // Inherited public method
sub.subClassMethod(); // Can access public and protected
sub.doSomething(); // Uses overridden protected method
```

## Real-World Applications

### Complete Example: E-commerce Shopping Cart

```javascript
class ShoppingCart {
  #items = new Map();
  #customerId;
  #discountCodes = new Set();
  #taxRate = 0.08;

  constructor(customerId) {
    this.#customerId = customerId;
  }

  // Public interface
  addItem(productId, quantity = 1, price = 0) {
    this.#validateProductInput(productId, quantity, price);

    if (this.#items.has(productId)) {
      const existingItem = this.#items.get(productId);
      existingItem.quantity += quantity;
    } else {
      this.#items.set(productId, {
        productId,
        quantity,
        price,
        addedAt: new Date()
      });
    }

    return this.getItemCount();
  }

  removeItem(productId) {
    if (!this.#items.has(productId)) {
      throw new Error("Item not found in cart");
    }

    this.#items.delete(productId);
    return this.getItemCount();
  }

  updateQuantity(productId, quantity) {
    this.#validateQuantity(quantity);

    if (!this.#items.has(productId)) {
      throw new Error("Item not found in cart");
    }

    if (quantity === 0) {
      return this.removeItem(productId);
    }

    const item = this.#items.get(productId);
    item.quantity = quantity;

    return this.getItemCount();
  }

  applyDiscountCode(code) {
    if (this.#discountCodes.has(code)) {
      throw new Error("Discount code already applied");
    }

    if (!this.#isValidDiscountCode(code)) {
      throw new Error("Invalid discount code");
    }

    this.#discountCodes.add(code);
    return this.getTotal();
  }

  getItems() {
    return Array.from(this.#items.values()).map((item) => ({
      ...item,
      total: item.price * item.quantity
    }));
  }

  getItemCount() {
    return Array.from(this.#items.values()).reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  getSubtotal() {
    return Array.from(this.#items.values()).reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  getDiscountAmount() {
    const subtotal = this.getSubtotal();
    return Array.from(this.#discountCodes).reduce(
      (total, code) => total + this.#calculateDiscount(code, subtotal),
      0
    );
  }

  getTaxAmount() {
    const taxableAmount = this.getSubtotal() - this.getDiscountAmount();
    return taxableAmount * this.#taxRate;
  }

  getTotal() {
    return this.getSubtotal() - this.getDiscountAmount() + this.getTaxAmount();
  }

  clear() {
    this.#items.clear();
    this.#discountCodes.clear();
  }

  // Private methods - implementation details hidden
  #validateProductInput(productId, quantity, price) {
    if (!productId || typeof productId !== "string") {
      throw new Error("Valid product ID required");
    }

    this.#validateQuantity(quantity);

    if (typeof price !== "number" || price < 0) {
      throw new Error("Price must be a non-negative number");
    }
  }

  #validateQuantity(quantity) {
    if (
      typeof quantity !== "number" ||
      quantity < 0 ||
      !Number.isInteger(quantity)
    ) {
      throw new Error("Quantity must be a non-negative integer");
    }
  }

  #isValidDiscountCode(code) {
    // Simulate discount code validation
    const validCodes = ["SAVE10", "SAVE20", "FIRSTTIME"];
    return validCodes.includes(code);
  }

  #calculateDiscount(code, subtotal) {
    const discounts = {
      SAVE10: subtotal * 0.1,
      SAVE20: subtotal * 0.2,
      FIRSTTIME: Math.min(subtotal * 0.15, 50) // 15% up to $50
    };

    return discounts[code] || 0;
  }
}

// Usage
const cart = new ShoppingCart("customer123");

cart.addItem("laptop", 1, 999.99);
cart.addItem("mouse", 2, 29.99);
cart.addItem("keyboard", 1, 79.99);

console.log("Items in cart:", cart.getItemCount());
console.log("Subtotal:", cart.getSubtotal());

cart.applyDiscountCode("SAVE10");
console.log("After discount:", cart.getTotal());

console.log("Cart items:", cart.getItems());

// Private methods are completely inaccessible
// cart.#validateProductInput('test', 1, 10); // SyntaxError
// console.log(cart.#items);                  // SyntaxError
```

## Best Practices

### 1. Design Clear Public Interfaces

```javascript
class FileProcessor {
  // Clear, simple public interface
  async processFile(filePath) {
    try {
      const data = await this.#readFile(filePath);
      const processed = this.#transformData(data);
      const result = await this.#saveProcessedData(processed);
      return result;
    } catch (error) {
      throw new Error(`Failed to process file: ${error.message}`);
    }
  }

  // Hide complex implementation details
  #readFile(path) {
    /* ... */
  }
  #transformData(data) {
    /* ... */
  }
  #saveProcessedData(data) {
    /* ... */
  }
}
```

### 2. Use Meaningful Names

```javascript
class UserSession {
  #sessionData;
  #expirationTime;
  #isAuthenticated = false;

  // Clear, descriptive method names
  authenticateUser(credentials) {
    /* ... */
  }
  refreshSession() {
    /* ... */
  }
  invalidateSession() {
    /* ... */
  }

  // Private methods with clear purposes
  #validateCredentials(credentials) {
    /* ... */
  }
  #updateLastActivity() {
    /* ... */
  }
  #checkSessionExpiry() {
    /* ... */
  }
}
```

### 3. Minimize Public Surface

```javascript
class DatabaseManager {
  // Only expose what's necessary
  async findUser(id) {
    /* ... */
  }
  async createUser(userData) {
    /* ... */
  }
  async updateUser(id, userData) {
    /* ... */
  }
  async deleteUser(id) {
    /* ... */
  }

  // Keep implementation details private
  #openConnection() {
    /* ... */
  }
  #executeQuery(sql, params) {
    /* ... */
  }
  #closeConnection() {
    /* ... */
  }
  #handleError(error) {
    /* ... */
  }
}
```

## Common Patterns

### 1. Facade Pattern

```javascript
class DatabaseFacade {
  #userRepo;
  #orderRepo;
  #productRepo;

  constructor() {
    this.#userRepo = new UserRepository();
    this.#orderRepo = new OrderRepository();
    this.#productRepo = new ProductRepository();
  }

  // Simple interface hiding complex subsystem
  async getUserOrderHistory(userId) {
    const user = await this.#userRepo.findById(userId);
    const orders = await this.#orderRepo.findByUserId(userId);

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const products = await Promise.all(
          order.items.map((item) => this.#productRepo.findById(item.productId))
        );
        return { ...order, products };
      })
    );

    return { user, orders: enrichedOrders };
  }
}
```

### 2. Template Method Pattern

```javascript
class DataProcessor {
  // Public template method
  async processData(data) {
    this.#validateInput(data);
    const prepared = await this.#prepareData(data);
    const processed = await this.process(prepared);
    const formatted = this.#formatOutput(processed);
    return formatted;
  }

  // Abstract method to be implemented by subclasses
  async process(data) {
    throw new Error("process method must be implemented");
  }

  // Private template steps
  #validateInput(data) {
    /* ... */
  }
  #prepareData(data) {
    /* ... */
  }
  #formatOutput(data) {
    /* ... */
  }
}
```

## Self-Check Questions

1. What is the difference between encapsulation and information hiding?
2. How do private fields (#) differ from underscore conventions?
3. When should you use property descriptors?
4. What are the benefits of using closures for encapsulation?
5. How do you create abstract classes in JavaScript?
6. What is the purpose of abstraction in OOP?
7. How can you simulate access modifiers in JavaScript?
8. What are the trade-offs between different privacy techniques?
9. When should you expose internal state through getters/setters?
10. How do you design a good public API for a class?

## Practice Exercises

### Exercise 1: Bank Account System

Create a comprehensive bank account system with proper encapsulation:

```javascript
class BankAccount {
  // Use private fields for sensitive data
  // Implement proper validation
  // Hide complex transaction logic
  // Provide clear public interface
}

class SavingsAccount extends BankAccount {
  // Add interest calculation
  // Limit withdrawal frequency
  // Minimum balance requirements
}

class CheckingAccount extends BankAccount {
  // Overdraft protection
  // Check writing functionality
  // Monthly fee calculation
}

// Requirements:
// - Account numbers should be read-only
// - Balance should only be modified through transactions
// - Transaction history should be maintained
// - Interest/fees should be calculated automatically
// - All sensitive operations should be logged
```

### Exercise 2: Task Management System

Create a task management system with proper abstraction:

```javascript
class AbstractTask {
  // Define common interface for all tasks
  // Abstract methods: execute(), validate(), getProgress()
  // Template method for task lifecycle
}

class EmailTask extends AbstractTask {
  // Send email implementation
  // Email validation
  // Retry logic for failures
}

class DataProcessingTask extends AbstractTask {
  // Process data files
  // Progress tracking
  // Error recovery
}

class TaskScheduler {
  // Manage task queue
  // Handle task dependencies
  // Monitor task execution
  // Hide scheduling complexity
}

// Requirements:
// - Tasks should have consistent lifecycle
// - Scheduler should handle task priorities
// - Error handling should be abstracted
// - Progress reporting should be unified
// - Task dependencies should be managed automatically
```

### Exercise 3: API Client Library

Design an HTTP client library with clean abstraction:

```javascript
class HTTPClient {
  // Hide HTTP implementation details
  // Handle authentication automatically
  // Manage request/response transformation
  // Implement retry logic
  // Cache responses when appropriate
}

class APIEndpoint {
  // Abstract individual API endpoints
  // Handle endpoint-specific logic
  // Validate parameters
  // Transform responses
}

class RESTClient extends HTTPClient {
  // RESTful API patterns
  // Resource-based operations
  // Standard HTTP methods
}

// Requirements:
// - Simple interface for common operations
// - Automatic error handling and retries
// - Request/response middleware support
// - Authentication should be transparent
// - Caching should be configurable but hidden
// - Rate limiting should be handled automatically
```

---

**Next**: Continue with [06-design-patterns.md](./06-design-patterns.md) to learn about common OOP design patterns in JavaScript.
