# Constructor Functions and Prototypes

## Learning Objectives

- Understand constructor functions and the `new` keyword
- Master JavaScript's prototype chain and inheritance model
- Learn to add methods to prototypes efficiently
- Explore prototype-based inheritance patterns
- Understand the relationship between constructor, prototype, and instances

## Constructor Functions

Constructor functions are special functions used to create and initialize objects. They serve as blueprints for creating multiple instances of similar objects.

### Basic Constructor Function

```javascript
function Person(name, age, city) {
  // Properties are assigned to 'this'
  this.name = name;
  this.age = age;
  this.city = city;

  // Methods defined directly on instance (not recommended)
  this.greet = function () {
    return `Hello, I'm ${this.name}`;
  };
}

// Creating instances using 'new' keyword
const alice = new Person("Alice", 30, "New York");
const bob = new Person("Bob", 25, "Los Angeles");

console.log(alice.name); // 'Alice'
console.log(bob.greet()); // 'Hello, I'm Bob'

// Each instance has its own copy of methods (inefficient)
console.log(alice.greet === bob.greet); // false
```

### The `new` Keyword

When you call a function with `new`, JavaScript:

1. Creates a new empty object
2. Sets the object's prototype to the constructor's prototype
3. Binds `this` to the new object
4. Executes the constructor function
5. Returns the new object (unless the constructor explicitly returns something else)

```javascript
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}

// What happens when you call: new Car('Toyota', 'Camry', 2022)
/*
1. const newCar = {}; // Create empty object
2. newCar.__proto__ = Car.prototype; // Set prototype
3. Car.call(newCar, 'Toyota', 'Camry', 2022); // Call constructor with 'this' bound
4. return newCar; // Return the new object
*/

const myCar = new Car("Toyota", "Camry", 2022);
console.log(myCar instanceof Car); // true
```

### Constructor Function Conventions

```javascript
// Convention: Constructor functions start with capital letter
function BankAccount(accountNumber, initialBalance = 0) {
  // Validate input
  if (typeof accountNumber !== "string" || accountNumber.length === 0) {
    throw new Error("Valid account number required");
  }

  if (typeof initialBalance !== "number" || initialBalance < 0) {
    throw new Error("Initial balance must be a non-negative number");
  }

  // Private-like properties (convention: prefix with _)
  this._accountNumber = accountNumber;
  this._balance = initialBalance;
  this._transactions = [];

  // Public properties
  this.createdAt = new Date();
  this.isActive = true;
}

// Adding methods to prototype (recommended)
BankAccount.prototype.deposit = function (amount) {
  if (amount <= 0) {
    throw new Error("Deposit amount must be positive");
  }

  this._balance += amount;
  this._transactions.push({
    type: "deposit",
    amount: amount,
    timestamp: new Date(),
    balance: this._balance
  });

  return this._balance;
};

BankAccount.prototype.withdraw = function (amount) {
  if (amount <= 0) {
    throw new Error("Withdrawal amount must be positive");
  }

  if (amount > this._balance) {
    throw new Error("Insufficient funds");
  }

  this._balance -= amount;
  this._transactions.push({
    type: "withdrawal",
    amount: amount,
    timestamp: new Date(),
    balance: this._balance
  });

  return this._balance;
};

BankAccount.prototype.getBalance = function () {
  return this._balance;
};

BankAccount.prototype.getTransactionHistory = function () {
  return [...this._transactions]; // Return copy
};

// Usage
const account = new BankAccount("ACC123456", 1000);
account.deposit(500);
account.withdraw(200);
console.log(account.getBalance()); // 1300
```

## Understanding Prototypes

Every function in JavaScript has a `prototype` property, which is an object that becomes the prototype of all instances created by that constructor.

### Prototype Chain

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

Animal.prototype.sleep = function () {
  return `${this.name} is sleeping`;
};

const dog = new Animal("Rex");

console.log(dog.speak()); // 'Rex makes a sound'

// Prototype chain lookup
console.log(dog.hasOwnProperty("name")); // true (own property)
console.log(dog.hasOwnProperty("speak")); // false (inherited from prototype)

// Check prototype chain
console.log(dog.__proto__ === Animal.prototype); // true
console.log(Animal.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null (end of chain)
```

### Prototype vs Instance Properties

```javascript
function Product(name, price) {
  this.name = name;
  this.price = price;
}

// Prototype properties/methods (shared by all instances)
Product.prototype.category = "General";
Product.prototype.getTotalPrice = function (quantity = 1) {
  return this.price * quantity;
};

Product.prototype.getInfo = function () {
  return `${this.name}: $${this.price} (Category: ${this.category})`;
};

const laptop = new Product("Laptop", 999);
const phone = new Product("Phone", 599);

// Instance properties override prototype properties
laptop.category = "Electronics";

console.log(laptop.getInfo()); // 'Laptop: $999 (Category: Electronics)'
console.log(phone.getInfo()); // 'Phone: $599 (Category: General)'

// Adding methods to prototype affects all instances
Product.prototype.discount = function (percentage) {
  this.price = this.price * (1 - percentage / 100);
  return this.price;
};

console.log(laptop.discount(10)); // 899.1
console.log(phone.discount(15)); // 509.15
```

## Prototype-Based Inheritance

JavaScript implements inheritance through the prototype chain, allowing objects to inherit properties and methods from other objects.

### Basic Inheritance Pattern

```javascript
// Parent constructor
function Vehicle(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
  this.isRunning = false;
}

Vehicle.prototype.start = function () {
  this.isRunning = true;
  return `${this.make} ${this.model} is starting...`;
};

Vehicle.prototype.stop = function () {
  this.isRunning = false;
  return `${this.make} ${this.model} is stopping...`;
};

Vehicle.prototype.getInfo = function () {
  return `${this.year} ${this.make} ${this.model}`;
};

// Child constructor
function Car(make, model, year, doors) {
  // Call parent constructor
  Vehicle.call(this, make, model, year);
  this.doors = doors;
  this.type = "car";
}

// Set up inheritance
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

// Add car-specific methods
Car.prototype.honk = function () {
  return `${this.make} ${this.model} is honking: Beep! Beep!`;
};

Car.prototype.getInfo = function () {
  // Call parent method and extend it
  return Vehicle.prototype.getInfo.call(this) + ` (${this.doors} doors)`;
};

// Another child constructor
function Motorcycle(make, model, year, engineSize) {
  Vehicle.call(this, make, model, year);
  this.engineSize = engineSize;
  this.type = "motorcycle";
}

Motorcycle.prototype = Object.create(Vehicle.prototype);
Motorcycle.prototype.constructor = Motorcycle;

Motorcycle.prototype.rev = function () {
  return `${this.make} ${this.model} is revving: Vroom! Vroom!`;
};

// Usage
const myCar = new Car("Toyota", "Camry", 2022, 4);
const myBike = new Motorcycle("Harley-Davidson", "Street 750", 2021, 750);

console.log(myCar.start()); // 'Toyota Camry is starting...'
console.log(myCar.honk()); // 'Toyota Camry is honking: Beep! Beep!'
console.log(myCar.getInfo()); // '2022 Toyota Camry (4 doors)'

console.log(myBike.start()); // 'Harley-Davidson Street 750 is starting...'
console.log(myBike.rev()); // 'Harley-Davidson Street 750 is revving: Vroom! Vroom!'

// Check inheritance
console.log(myCar instanceof Car); // true
console.log(myCar instanceof Vehicle); // true
console.log(myBike instanceof Motorcycle); // true
console.log(myBike instanceof Vehicle); // true
```

### Inheritance Helper Function

```javascript
function inherit(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}

// Usage
function Shape(color) {
  this.color = color;
}

Shape.prototype.getColor = function () {
  return this.color;
};

function Rectangle(color, width, height) {
  Shape.call(this, color);
  this.width = width;
  this.height = height;
}

inherit(Rectangle, Shape);

Rectangle.prototype.getArea = function () {
  return this.width * this.height;
};

Rectangle.prototype.getPerimeter = function () {
  return 2 * (this.width + this.height);
};

function Circle(color, radius) {
  Shape.call(this, color);
  this.radius = radius;
}

inherit(Circle, Shape);

Circle.prototype.getArea = function () {
  return Math.PI * this.radius * this.radius;
};

Circle.prototype.getCircumference = function () {
  return 2 * Math.PI * this.radius;
};
```

## Advanced Prototype Patterns

### Mixin Pattern with Prototypes

```javascript
// Mixin objects
const EventEmitter = {
  on(event, callback) {
    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(callback);
  },

  emit(event, data) {
    if (!this._events || !this._events[event]) return;
    this._events[event].forEach((callback) => callback(data));
  },

  off(event, callback) {
    if (!this._events || !this._events[event]) return;
    this._events[event] = this._events[event].filter((cb) => cb !== callback);
  }
};

const Serializable = {
  toJSON() {
    const obj = {};
    for (const key in this) {
      if (this.hasOwnProperty(key) && !key.startsWith("_")) {
        obj[key] = this[key];
      }
    }
    return obj;
  },

  fromJSON(json) {
    Object.assign(this, json);
    return this;
  }
};

// Apply mixins to prototype
function User(name, email) {
  this.name = name;
  this.email = email;
  this.createdAt = new Date();
}

Object.assign(User.prototype, EventEmitter, Serializable);

User.prototype.updateEmail = function (newEmail) {
  const oldEmail = this.email;
  this.email = newEmail;
  this.emit("emailChanged", { oldEmail, newEmail });
};

// Usage
const user = new User("Alice", "alice@example.com");

user.on("emailChanged", (data) => {
  console.log(`Email changed from ${data.oldEmail} to ${data.newEmail}`);
});

user.updateEmail("alice.smith@example.com");
console.log(JSON.stringify(user.toJSON())); // Serialized user data
```

### Factory Pattern with Prototypes

```javascript
const AnimalFactory = {
  // Shared prototype methods
  animalMethods: {
    eat(food) {
      return `${this.name} is eating ${food}`;
    },

    sleep() {
      return `${this.name} is sleeping`;
    },

    getInfo() {
      return `${this.name} is a ${this.species}`;
    }
  },

  // Factory method
  create(type, name, ...args) {
    const animal = Object.create(this.animalMethods);
    animal.name = name;
    animal.species = type;

    // Type-specific initialization
    switch (type) {
      case "dog":
        animal.breed = args[0] || "Mixed";
        animal.bark = function () {
          return `${this.name} barks: Woof! Woof!`;
        };
        break;

      case "cat":
        animal.breed = args[0] || "Mixed";
        animal.meow = function () {
          return `${this.name} meows: Meow! Meow!`;
        };
        break;

      case "bird":
        animal.canFly = args[0] !== false;
        animal.chirp = function () {
          return `${this.name} chirps: Tweet! Tweet!`;
        };
        break;
    }

    return animal;
  }
};

// Usage
const dog = AnimalFactory.create("dog", "Rex", "German Shepherd");
const cat = AnimalFactory.create("cat", "Whiskers", "Persian");
const bird = AnimalFactory.create("bird", "Tweety", true);

console.log(dog.bark()); // 'Rex barks: Woof! Woof!'
console.log(cat.meow()); // 'Whiskers meows: Meow! Meow!'
console.log(bird.chirp()); // 'Tweety chirps: Tweet! Tweet!'
```

## Prototype Chain Debugging

### Inspecting the Prototype Chain

```javascript
function DebugObject() {}
DebugObject.prototype.debugMethod = function () {
  return "Debug method called";
};

const obj = new DebugObject();

// Methods to inspect prototype chain
function inspectPrototypeChain(obj) {
  const chain = [];
  let current = obj;

  while (current !== null) {
    chain.push({
      constructor: current.constructor?.name || "Unknown",
      isPrototype: current === obj.__proto__,
      ownProperties: Object.getOwnPropertyNames(current),
      methods: Object.getOwnPropertyNames(current).filter(
        (prop) => typeof current[prop] === "function"
      )
    });
    current = Object.getPrototypeOf(current);
  }

  return chain;
}

console.log(inspectPrototypeChain(obj));

// Check property location in chain
function findPropertyInChain(obj, property) {
  let current = obj;
  let level = 0;

  while (current !== null) {
    if (current.hasOwnProperty(property)) {
      return {
        found: true,
        level: level,
        location: level === 0 ? "own property" : `prototype level ${level}`
      };
    }
    current = Object.getPrototypeOf(current);
    level++;
  }

  return { found: false };
}

console.log(findPropertyInChain(obj, "debugMethod"));
```

## Common Patterns and Best Practices

### Module Pattern with Constructor

```javascript
const Calculator = (function () {
  // Private static methods
  function isNumber(value) {
    return typeof value === "number" && !isNaN(value);
  }

  function validateNumbers(...numbers) {
    return numbers.every(isNumber);
  }

  // Constructor
  function Calculator(precision = 2) {
    this.precision = precision;
    this.history = [];
  }

  // Public prototype methods
  Calculator.prototype.add = function (a, b) {
    if (!validateNumbers(a, b)) {
      throw new Error("Invalid numbers provided");
    }

    const result = parseFloat((a + b).toFixed(this.precision));
    this.history.push(`${a} + ${b} = ${result}`);
    return result;
  };

  Calculator.prototype.subtract = function (a, b) {
    if (!validateNumbers(a, b)) {
      throw new Error("Invalid numbers provided");
    }

    const result = parseFloat((a - b).toFixed(this.precision));
    this.history.push(`${a} - ${b} = ${result}`);
    return result;
  };

  Calculator.prototype.getHistory = function () {
    return [...this.history];
  };

  Calculator.prototype.clearHistory = function () {
    this.history = [];
  };

  // Static methods
  Calculator.isValidNumber = isNumber;

  return Calculator;
})();

// Usage
const calc = new Calculator(3);
console.log(calc.add(5.555, 3.333)); // 8.888
console.log(calc.getHistory()); // ['5.555 + 3.333 = 8.888']
```

### Namespace Pattern with Constructors

```javascript
const MyApp = {
  Models: {},
  Utils: {},
  Constants: {
    MAX_NAME_LENGTH: 50,
    MIN_AGE: 0,
    MAX_AGE: 150
  }
};

// Model constructors
MyApp.Models.Person = function (name, age) {
  if (name.length > MyApp.Constants.MAX_NAME_LENGTH) {
    throw new Error("Name too long");
  }

  if (age < MyApp.Constants.MIN_AGE || age > MyApp.Constants.MAX_AGE) {
    throw new Error("Invalid age");
  }

  this.name = name;
  this.age = age;
  this.id = MyApp.Utils.generateId();
};

MyApp.Models.Person.prototype.toString = function () {
  return `Person(${this.id}): ${this.name}, age ${this.age}`;
};

// Utility functions
MyApp.Utils.generateId = function () {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

MyApp.Utils.validateEmail = function (email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Usage
const person = new MyApp.Models.Person("Alice", 30);
console.log(person.toString());
```

## Performance Considerations

### Method Definitions: Instance vs Prototype

```javascript
// Inefficient: Methods on instance (each instance gets its own copy)
function SlowPerson(name) {
  this.name = name;

  // Each instance gets its own copy of this method
  this.greet = function () {
    return `Hello, I'm ${this.name}`;
  };
}

// Efficient: Methods on prototype (shared across all instances)
function FastPerson(name) {
  this.name = name;
}

FastPerson.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

// Memory usage comparison
const slowPeople = [];
const fastPeople = [];

for (let i = 0; i < 1000; i++) {
  slowPeople.push(new SlowPerson(`Person${i}`));
  fastPeople.push(new FastPerson(`Person${i}`));
}

// SlowPerson instances use more memory due to duplicate methods
console.log("SlowPerson instances have duplicate methods");
console.log("FastPerson instances share prototype methods");
```

### Prototype Pollution Prevention

```javascript
// Dangerous: Modifying built-in prototypes
// DON'T DO THIS in production code
Object.prototype.badMethod = function () {
  return "This affects all objects!";
};

// Better: Create your own base objects
function BaseObject() {}

BaseObject.prototype.clone = function () {
  return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
};

BaseObject.prototype.equals = function (other) {
  return JSON.stringify(this) === JSON.stringify(other);
};

// Use inheritance from your base object
function SafeUser(name) {
  BaseObject.call(this);
  this.name = name;
}

SafeUser.prototype = Object.create(BaseObject.prototype);
SafeUser.prototype.constructor = SafeUser;
```

## Practical Examples

### Event System with Constructor Functions

```javascript
function EventBus() {
  this._events = {};
  this._maxListeners = 10;
}

EventBus.prototype.on = function (event, listener) {
  if (typeof listener !== "function") {
    throw new Error("Listener must be a function");
  }

  this._events[event] = this._events[event] || [];

  if (this._events[event].length >= this._maxListeners) {
    console.warn(
      `Max listeners (${this._maxListeners}) exceeded for event '${event}'`
    );
  }

  this._events[event].push(listener);
  return this; // Allow chaining
};

EventBus.prototype.off = function (event, listener) {
  if (!this._events[event]) return this;

  if (listener) {
    this._events[event] = this._events[event].filter((l) => l !== listener);
  } else {
    delete this._events[event];
  }

  return this;
};

EventBus.prototype.emit = function (event, ...args) {
  if (!this._events[event]) return this;

  this._events[event].forEach((listener) => {
    try {
      listener(...args);
    } catch (error) {
      console.error(`Error in event listener for '${event}':`, error);
    }
  });

  return this;
};

EventBus.prototype.once = function (event, listener) {
  const onceWrapper = (...args) => {
    this.off(event, onceWrapper);
    listener(...args);
  };

  return this.on(event, onceWrapper);
};

// Usage
const eventBus = new EventBus();

const userLoginHandler = (user) => {
  console.log(`User ${user.name} logged in`);
};

eventBus
  .on("userLogin", userLoginHandler)
  .on("userLogin", (user) => {
    console.log(`Welcome ${user.name}!`);
  })
  .once("userLogout", (user) => {
    console.log(`Goodbye ${user.name}!`);
  });

eventBus.emit("userLogin", { name: "Alice" });
eventBus.emit("userLogout", { name: "Alice" });
eventBus.emit("userLogout", { name: "Alice" }); // Won't trigger (once only)
```

### Data Store with Constructor Functions

```javascript
function DataStore(name) {
  this.name = name;
  this._data = new Map();
  this._subscribers = new Map();
  this._version = 0;
}

DataStore.prototype.set = function (key, value) {
  const oldValue = this._data.get(key);
  this._data.set(key, value);
  this._version++;

  // Notify subscribers
  this._notifySubscribers(key, value, oldValue);

  return this;
};

DataStore.prototype.get = function (key) {
  return this._data.get(key);
};

DataStore.prototype.has = function (key) {
  return this._data.has(key);
};

DataStore.prototype.delete = function (key) {
  const existed = this._data.has(key);
  const oldValue = this._data.get(key);
  const result = this._data.delete(key);

  if (existed) {
    this._version++;
    this._notifySubscribers(key, undefined, oldValue);
  }

  return result;
};

DataStore.prototype.subscribe = function (key, callback) {
  if (!this._subscribers.has(key)) {
    this._subscribers.set(key, []);
  }

  this._subscribers.get(key).push(callback);

  // Return unsubscribe function
  return () => {
    const callbacks = this._subscribers.get(key);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  };
};

DataStore.prototype._notifySubscribers = function (key, newValue, oldValue) {
  const callbacks = this._subscribers.get(key);
  if (callbacks) {
    callbacks.forEach((callback) => {
      try {
        callback(newValue, oldValue, key);
      } catch (error) {
        console.error("Error in DataStore subscriber:", error);
      }
    });
  }
};

DataStore.prototype.getSnapshot = function () {
  return {
    name: this.name,
    version: this._version,
    data: Object.fromEntries(this._data),
    size: this._data.size
  };
};

// Usage
const userStore = new DataStore("users");

const unsubscribe = userStore.subscribe("currentUser", (newUser, oldUser) => {
  console.log("Current user changed:", { newUser, oldUser });
});

userStore.set("currentUser", { name: "Alice", id: 1 });
userStore.set("currentUser", { name: "Bob", id: 2 });

console.log(userStore.getSnapshot());
```

## Self-Check Questions

1. What happens when you call a function with the `new` keyword?
2. How does the prototype chain work in JavaScript?
3. What's the difference between instance properties and prototype properties?
4. How do you implement inheritance with constructor functions?
5. Why is it better to add methods to the prototype rather than the instance?
6. How can you check if an object is an instance of a particular constructor?
7. What are the potential security issues with prototype pollution?

## Practice Exercises

1. **Basic Constructors**: Create constructor functions for different entities
2. **Inheritance Hierarchy**: Build a multi-level inheritance chain
3. **Method Overriding**: Override parent methods in child constructors
4. **Mixin Implementation**: Create and apply mixins to constructor prototypes
5. **Performance Comparison**: Compare instance vs prototype method performance

## Next Steps

- Learn about ES6 classes and modern syntax
- Explore advanced inheritance patterns
- Study encapsulation and data hiding techniques
- Master design patterns with constructor functions
