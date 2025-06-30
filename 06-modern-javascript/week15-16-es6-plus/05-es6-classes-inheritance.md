# ES6 Classes and Modern Inheritance

## Table of Contents

1. [ES6 Class Syntax](#es6-class-syntax)
2. [Class Methods and Properties](#class-methods-and-properties)
3. [Static Methods and Properties](#static-methods-and-properties)
4. [Private Fields and Methods](#private-fields-and-methods)
5. [Inheritance with extends and super](#inheritance-with-extends-and-super)
6. [Class Expressions and Dynamic Classes](#class-expressions-and-dynamic-classes)
7. [Mixins and Composition](#mixins-and-composition)
8. [Performance Considerations](#performance-considerations)
9. [Best Practices](#best-practices)
10. [Practice Exercises](#practice-exercises)

## ES6 Class Syntax

ES6 introduced a more familiar class syntax that provides syntactic sugar over JavaScript's prototypal inheritance.

### Basic Class Declaration

```javascript
// ES6 Class
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }

  get info() {
    return `${this.name} is ${this.age} years old`;
  }

  set age(value) {
    if (value < 0) throw new Error("Age cannot be negative");
    this._age = value;
  }

  get age() {
    return this._age;
  }
}

const person = new Person("Alice", 30);
console.log(person.greet()); // "Hello, I'm Alice"
console.log(person.info); // "Alice is 30 years old"
```

### Comparison with Constructor Functions

```javascript
// Traditional Constructor Function
function PersonOld(name, age) {
  this.name = name;
  this.age = age;
}

PersonOld.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

// ES6 Class (equivalent)
class PersonNew {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

// Both create the same prototype chain
console.log(PersonNew.prototype.greet === PersonOld.prototype.greet); // false (different functions)
console.log(typeof PersonNew); // "function"
```

## Class Methods and Properties

### Instance Methods

```javascript
class Calculator {
  constructor(value = 0) {
    this.value = value;
    this.history = [];
  }

  add(num) {
    this.history.push(`${this.value} + ${num}`);
    this.value += num;
    return this; // Enable method chaining
  }

  subtract(num) {
    this.history.push(`${this.value} - ${num}`);
    this.value -= num;
    return this;
  }

  multiply(num) {
    this.history.push(`${this.value} * ${num}`);
    this.value *= num;
    return this;
  }

  getResult() {
    return this.value;
  }

  getHistory() {
    return [...this.history]; // Return copy
  }

  reset() {
    this.value = 0;
    this.history = [];
    return this;
  }
}

const calc = new Calculator(10);
const result = calc.add(5).multiply(2).subtract(3).getResult();
console.log(result); // 27
console.log(calc.getHistory()); // ['10 + 5', '15 * 2', '30 - 3']
```

### Getters and Setters

```javascript
class Temperature {
  constructor(celsius = 0) {
    this._celsius = celsius;
  }

  get celsius() {
    return this._celsius;
  }

  set celsius(value) {
    if (typeof value !== "number") {
      throw new TypeError("Temperature must be a number");
    }
    this._celsius = value;
  }

  get fahrenheit() {
    return (this._celsius * 9) / 5 + 32;
  }

  set fahrenheit(value) {
    if (typeof value !== "number") {
      throw new TypeError("Temperature must be a number");
    }
    this._celsius = ((value - 32) * 5) / 9;
  }

  get kelvin() {
    return this._celsius + 273.15;
  }

  set kelvin(value) {
    if (typeof value !== "number") {
      throw new TypeError("Temperature must be a number");
    }
    this._celsius = value - 273.15;
  }
}

const temp = new Temperature(25);
console.log(temp.fahrenheit); // 77
console.log(temp.kelvin); // 298.15

temp.fahrenheit = 86;
console.log(temp.celsius); // 30
```

## Static Methods and Properties

Static methods and properties belong to the class itself, not to instances.

```javascript
class MathUtils {
  static PI = 3.14159;
  static E = 2.71828;

  static square(x) {
    return x * x;
  }

  static cube(x) {
    return x * x * x;
  }

  static factorial(n) {
    if (n <= 1) return 1;
    return n * MathUtils.factorial(n - 1);
  }

  static degToRad(degrees) {
    return degrees * (MathUtils.PI / 180);
  }

  static radToDeg(radians) {
    return radians * (180 / MathUtils.PI);
  }

  // Static method to create instances with validation
  static createPoint(x, y) {
    if (typeof x !== "number" || typeof y !== "number") {
      throw new Error("Coordinates must be numbers");
    }
    return new Point(x, y);
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  distanceFrom(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(MathUtils.square(dx) + MathUtils.square(dy));
  }
}

console.log(MathUtils.square(5)); // 25
console.log(MathUtils.factorial(5)); // 120
console.log(MathUtils.degToRad(90)); // 1.5708

const p1 = MathUtils.createPoint(0, 0);
const p2 = MathUtils.createPoint(3, 4);
console.log(p1.distanceFrom(p2)); // 5
```

## Private Fields and Methods

ES2022 introduced true private fields and methods using the `#` syntax.

```javascript
class BankAccount {
  // Private fields
  #balance = 0;
  #accountNumber;
  #transactions = [];

  constructor(accountNumber, initialBalance = 0) {
    this.#accountNumber = accountNumber;
    this.#balance = initialBalance;
    this.#addTransaction("Initial deposit", initialBalance);
  }

  // Private method
  #addTransaction(type, amount) {
    this.#transactions.push({
      type,
      amount,
      balance: this.#balance,
      timestamp: new Date()
    });
  }

  // Private method for validation
  #validateAmount(amount) {
    if (typeof amount !== "number" || amount <= 0) {
      throw new Error("Amount must be a positive number");
    }
  }

  // Public methods
  deposit(amount) {
    this.#validateAmount(amount);
    this.#balance += amount;
    this.#addTransaction("Deposit", amount);
    return this.#balance;
  }

  withdraw(amount) {
    this.#validateAmount(amount);
    if (amount > this.#balance) {
      throw new Error("Insufficient funds");
    }
    this.#balance -= amount;
    this.#addTransaction("Withdrawal", -amount);
    return this.#balance;
  }

  getBalance() {
    return this.#balance;
  }

  getAccountNumber() {
    return this.#accountNumber;
  }

  getTransactionHistory() {
    // Return copy to prevent external modification
    return this.#transactions.map((t) => ({ ...t }));
  }

  // Static private method
  static #generateAccountNumber() {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  static createAccount(initialBalance = 0) {
    const accountNumber = BankAccount.#generateAccountNumber();
    return new BankAccount(accountNumber, initialBalance);
  }
}

const account = BankAccount.createAccount(1000);
console.log(account.getBalance()); // 1000

account.deposit(500);
account.withdraw(200);
console.log(account.getBalance()); // 1300

// These will throw errors:
// console.log(account.#balance); // SyntaxError
// account.#addTransaction('Hack', 1000); // SyntaxError
```

## Inheritance with extends and super

ES6 classes support inheritance using `extends` and `super` keywords.

```javascript
class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
    this.energy = 100;
  }

  eat(food) {
    console.log(`${this.name} is eating ${food}`);
    this.energy += 10;
    return this;
  }

  sleep() {
    console.log(`${this.name} is sleeping`);
    this.energy += 20;
    return this;
  }

  move() {
    console.log(`${this.name} is moving`);
    this.energy -= 5;
    return this;
  }

  getInfo() {
    return `${this.name} is a ${this.species} with ${this.energy} energy`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name, "Dog"); // Call parent constructor
    this.breed = breed;
    this.tricks = [];
  }

  bark() {
    console.log(`${this.name} says Woof!`);
    this.energy -= 2;
    return this;
  }

  learnTrick(trick) {
    this.tricks.push(trick);
    console.log(`${this.name} learned ${trick}`);
    return this;
  }

  performTrick(trick) {
    if (this.tricks.includes(trick)) {
      console.log(`${this.name} performs ${trick}`);
      this.energy -= 5;
    } else {
      console.log(`${this.name} doesn't know ${trick}`);
    }
    return this;
  }

  // Override parent method
  move() {
    console.log(`${this.name} runs around`);
    this.energy -= 3; // Dogs are more efficient
    return this;
  }

  // Extend parent method
  getInfo() {
    const baseInfo = super.getInfo();
    return `${baseInfo}. Breed: ${this.breed}. Knows ${this.tricks.length} tricks.`;
  }
}

class Bird extends Animal {
  constructor(name, canFly = true) {
    super(name, "Bird");
    this.canFly = canFly;
    this.altitude = 0;
  }

  fly(height = 10) {
    if (!this.canFly) {
      console.log(`${this.name} cannot fly`);
      return this;
    }
    this.altitude += height;
    console.log(`${this.name} flies to ${this.altitude}m altitude`);
    this.energy -= height * 0.5;
    return this;
  }

  land() {
    if (this.altitude > 0) {
      console.log(`${this.name} lands from ${this.altitude}m`);
      this.altitude = 0;
    }
    return this;
  }

  move() {
    if (this.canFly && this.altitude === 0) {
      return this.fly();
    } else if (!this.canFly) {
      console.log(`${this.name} hops around`);
      this.energy -= 2;
    }
    return this;
  }
}

// Usage
const dog = new Dog("Buddy", "Golden Retriever");
dog
  .eat("kibble")
  .learnTrick("sit")
  .learnTrick("rollover")
  .bark()
  .performTrick("sit")
  .move();

console.log(dog.getInfo());
// "Buddy is a Dog with 113 energy. Breed: Golden Retriever. Knows 2 tricks."

const bird = new Bird("Tweety");
bird.eat("seeds").fly(20).land().move();
console.log(bird.getInfo());
```

## Class Expressions and Dynamic Classes

Classes can also be defined as expressions and created dynamically.

```javascript
// Class expression
const Rectangle = class {
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
};

// Named class expression
const Circle = class CircleClass {
  constructor(radius) {
    this.radius = radius;
  }

  get area() {
    return Math.PI * this.radius ** 2;
  }

  get circumference() {
    return 2 * Math.PI * this.radius;
  }
};

// Dynamic class creation
function createShapeClass(shapeType) {
  switch (shapeType) {
    case "rectangle":
      return class extends Rectangle {
        getType() {
          return "Rectangle";
        }
      };
    case "circle":
      return class extends Circle {
        getType() {
          return "Circle";
        }
      };
    default:
      return class {
        getType() {
          return "Unknown Shape";
        }
      };
  }
}

const DynamicRectangle = createShapeClass("rectangle");
const rect = new DynamicRectangle(5, 3);
console.log(rect.area); // 15
console.log(rect.getType()); // "Rectangle"
```

## Mixins and Composition

JavaScript doesn't support multiple inheritance, but we can achieve similar functionality using mixins.

```javascript
// Mixin functions
const Flyable = (Base) =>
  class extends Base {
    fly() {
      console.log(`${this.name} is flying`);
      return this;
    }

    land() {
      console.log(`${this.name} has landed`);
      return this;
    }
  };

const Swimmable = (Base) =>
  class extends Base {
    swim() {
      console.log(`${this.name} is swimming`);
      return this;
    }

    dive(depth = 1) {
      console.log(`${this.name} dives ${depth}m deep`);
      return this;
    }
  };

const Walkable = (Base) =>
  class extends Base {
    walk() {
      console.log(`${this.name} is walking`);
      return this;
    }

    run() {
      console.log(`${this.name} is running`);
      return this;
    }
  };

// Base class
class Creature {
  constructor(name) {
    this.name = name;
  }
}

// Compose different abilities
class Duck extends Swimmable(Flyable(Walkable(Creature))) {
  constructor(name) {
    super(name);
  }

  quack() {
    console.log(`${this.name} says quack!`);
    return this;
  }
}

class Fish extends Swimmable(Creature) {
  constructor(name) {
    super(name);
  }

  bubble() {
    console.log(`${this.name} makes bubbles`);
    return this;
  }
}

class Bird extends Flyable(Walkable(Creature)) {
  constructor(name) {
    super(name);
  }

  chirp() {
    console.log(`${this.name} chirps`);
    return this;
  }
}

// Usage
const duck = new Duck("Donald");
duck.walk().swim().fly().land().quack();

const fish = new Fish("Nemo");
fish.swim().dive(5).bubble();

const bird = new Bird("Tweety");
bird.walk().fly().land().chirp();

// Mixin factory for reusable behaviors
const mixins = {
  Timestamped: (Base) =>
    class extends Base {
      constructor(...args) {
        super(...args);
        this.createdAt = new Date();
        this.updatedAt = new Date();
      }

      touch() {
        this.updatedAt = new Date();
        return this;
      }

      getAge() {
        return Date.now() - this.createdAt.getTime();
      }
    },

  Serializable: (Base) =>
    class extends Base {
      toJSON() {
        const obj = {};
        for (const key of Object.getOwnPropertyNames(this)) {
          if (typeof this[key] !== "function") {
            obj[key] = this[key];
          }
        }
        return obj;
      }

      fromJSON(json) {
        Object.assign(this, json);
        return this;
      }
    }
};

// Apply multiple mixins
class User extends mixins.Serializable(mixins.Timestamped(Creature)) {
  constructor(name, email) {
    super(name);
    this.email = email;
  }

  updateEmail(email) {
    this.email = email;
    this.touch();
    return this;
  }
}

const user = new User("Alice", "alice@example.com");
setTimeout(() => {
  user.updateEmail("alice.smith@example.com");
  console.log(user.toJSON());
  console.log(`User age: ${user.getAge()}ms`);
}, 100);
```

## Performance Considerations

### Class vs Constructor Function Performance

```javascript
// Performance comparison
class ClassVersion {
  constructor(value) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

function FunctionVersion(value) {
  this.value = value;
}

FunctionVersion.prototype.getValue = function () {
  return this.value;
};

// Both have similar performance characteristics
// Classes are slightly slower in some engines due to additional checks

// Memory usage comparison
const instances = 1000000;

console.time("Class creation");
const classInstances = Array.from(
  { length: instances },
  (_, i) => new ClassVersion(i)
);
console.timeEnd("Class creation");

console.time("Function creation");
const functionInstances = Array.from(
  { length: instances },
  (_, i) => new FunctionVersion(i)
);
console.timeEnd("Function creation");

// Method call performance
console.time("Class method calls");
classInstances.forEach((instance) => instance.getValue());
console.timeEnd("Class method calls");

console.time("Function method calls");
functionInstances.forEach((instance) => instance.getValue());
console.timeEnd("Function method calls");
```

### Optimization Tips

```javascript
class OptimizedClass {
  constructor(data) {
    // Pre-allocate properties to maintain hidden class
    this.prop1 = data.prop1 || null;
    this.prop2 = data.prop2 || null;
    this.prop3 = data.prop3 || null;

    // Bind methods that will be passed as callbacks
    this.boundMethod = this.expensiveMethod.bind(this);
  }

  // Use static methods for utilities to avoid instance overhead
  static utility(value) {
    return value * 2;
  }

  // Cache expensive computations
  expensiveMethod() {
    if (!this._cache) {
      this._cache = this.computeExpensiveValue();
    }
    return this._cache;
  }

  computeExpensiveValue() {
    // Expensive computation
    return Math.random() * 1000;
  }

  // Clear cache when data changes
  updateData(newData) {
    this.prop1 = newData.prop1;
    this._cache = null; // Invalidate cache
  }
}
```

## Best Practices

### 1. Use Clear and Descriptive Names

```javascript
// Good
class UserAuthenticationService {
  constructor(apiClient, tokenStorage) {
    this.apiClient = apiClient;
    this.tokenStorage = tokenStorage;
  }

  async authenticateUser(credentials) {
    // Implementation
  }
}

// Avoid
class UAService {
  constructor(api, storage) {
    this.a = api;
    this.s = storage;
  }

  auth(creds) {
    // Implementation
  }
}
```

### 2. Implement Proper Error Handling

```javascript
class SafeDataProcessor {
  constructor(validator) {
    if (!validator || typeof validator.validate !== "function") {
      throw new TypeError("Validator must have a validate method");
    }
    this.validator = validator;
  }

  processData(data) {
    try {
      this.validator.validate(data);
      return this.transform(data);
    } catch (error) {
      console.error("Data processing failed:", error);
      throw new Error(`Processing failed: ${error.message}`);
    }
  }

  transform(data) {
    if (!data || typeof data !== "object") {
      throw new Error("Data must be a valid object");
    }
    // Transformation logic
    return { ...data, processed: true };
  }
}
```

### 3. Use Composition Over Inheritance

```javascript
// Instead of deep inheritance hierarchies
class DatabaseConnection {
  connect() {
    /* ... */
  }
  disconnect() {
    /* ... */
  }
}

class QueryBuilder {
  constructor() {
    this.query = "";
  }

  select(fields) {
    this.query += `SELECT ${fields} `;
    return this;
  }

  from(table) {
    this.query += `FROM ${table} `;
    return this;
  }

  build() {
    return this.query.trim();
  }
}

// Compose functionality
class UserRepository {
  constructor(connection, queryBuilder) {
    this.connection = connection;
    this.queryBuilder = queryBuilder;
  }

  async findById(id) {
    const query = this.queryBuilder.select("*").from("users").build();

    return this.connection.execute(query, { id });
  }
}
```

### 4. Implement Proper Encapsulation

```javascript
class SecureCounter {
  #count = 0;
  #maxValue;

  constructor(maxValue = 100) {
    this.#maxValue = maxValue;
  }

  increment() {
    if (this.#count >= this.#maxValue) {
      throw new Error("Counter at maximum value");
    }
    this.#count++;
    return this.#count;
  }

  get value() {
    return this.#count;
  }

  reset() {
    this.#count = 0;
  }
}
```

## Self-Check Questions

1. What is the difference between ES6 classes and constructor functions?
2. How do static methods differ from instance methods?
3. What are private fields and how do they improve encapsulation?
4. When should you use `super()` and what does it do?
5. How can you implement multiple inheritance patterns in JavaScript?
6. What are the performance implications of using classes vs constructor functions?
7. How do mixins help with code reusability?
8. What are the benefits of class expressions over class declarations?

## Practice Exercises

### Exercise 1: Vehicle Management System

Create a vehicle management system with the following requirements:

- Base `Vehicle` class with common properties (make, model, year)
- `Car` class extending Vehicle with passenger capacity
- `Truck` class extending Vehicle with cargo capacity
- Static methods for vehicle validation
- Private fields for engine details

### Exercise 2: Task Management with Mixins

Build a task management system using mixins:

- `Timestamped` mixin for creation/update times
- `Assignable` mixin for user assignment
- `Prioritizable` mixin for priority levels
- `Task` class that combines all mixins

### Exercise 3: Database ORM Pattern

Implement a simple ORM pattern:

- Base `Model` class with CRUD operations
- `User` and `Post` models extending Model
- Class expressions for dynamic model creation
- Private methods for query building

### Exercise 4: Game Character System

Create a game character system:

- Base `Character` class with health, experience
- Specific character classes (Warrior, Mage, Archer)
- Ability mixins (Healable, Magical, Stealthy)
- Static factory methods for character creation

These exercises will help you master ES6 classes, inheritance patterns, and modern object-oriented programming techniques in JavaScript.
