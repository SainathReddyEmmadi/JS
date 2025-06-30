# OOP Quick Reference Cheat Sheet

## 📋 Object Creation Patterns

### Object Literals

```javascript
const obj = {
  property: "value",
  method() {
    return this.property;
  }
};
```

### Constructor Functions

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

const person = new Person("John", 30);
```

### ES6 Classes

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }

  static species() {
    return "Homo sapiens";
  }
}
```

### Factory Functions

```javascript
function createPerson(name, age) {
  return {
    name,
    age,
    greet() {
      return `Hello, I'm ${this.name}`;
    }
  };
}
```

## 🔗 Inheritance Patterns

### Class Inheritance

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks`;
  }
}
```

### Prototypal Inheritance

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function () {
  return `${this.name} barks`;
};
```

## 🔒 Encapsulation

### Private Fields (ES2022)

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
    }
  }

  #isValidAmount(amount) {
    return amount > 0;
  }

  getBalance() {
    return this.#balance;
  }
}
```

### WeakMap Pattern

```javascript
const _private = new WeakMap();

class SecureClass {
  constructor(secret) {
    _private.set(this, { secret });
  }

  getSecret() {
    return _private.get(this).secret;
  }
}
```

### Closure Pattern

```javascript
function createCounter() {
  let count = 0;

  return {
    increment() {
      count++;
    },

    decrement() {
      count--;
    },

    getCount() {
      return count;
    }
  };
}
```

## 🎨 Design Patterns

### Singleton

```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }

    Singleton.instance = this;
    return this;
  }

  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}
```

### Factory

```javascript
class ShapeFactory {
  static createShape(type, ...args) {
    switch (type) {
      case "circle":
        return new Circle(...args);
      case "rectangle":
        return new Rectangle(...args);
      default:
        throw new Error(`Unknown shape: ${type}`);
    }
  }
}
```

### Observer

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

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data));
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }
}
```

### Strategy

```javascript
class PaymentProcessor {
  constructor(strategy) {
    this.strategy = strategy;
  }

  processPayment(amount) {
    return this.strategy.process(amount);
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }
}

class CreditCardStrategy {
  process(amount) {
    return `Processing $${amount} via Credit Card`;
  }
}

class PayPalStrategy {
  process(amount) {
    return `Processing $${amount} via PayPal`;
  }
}
```

## 🧩 Mixins

### Object Mixin

```javascript
const flyingMixin = {
  fly() {
    return `${this.name} is flying`;
  },

  land() {
    return `${this.name} has landed`;
  }
};

const swimmingMixin = {
  swim() {
    return `${this.name} is swimming`;
  }
};

class Duck {
  constructor(name) {
    this.name = name;
  }
}

Object.assign(Duck.prototype, flyingMixin, swimmingMixin);
```

### Function Mixin

```javascript
function withFlying(Base) {
  return class extends Base {
    fly() {
      return `${this.name} is flying`;
    }
  };
}

function withSwimming(Base) {
  return class extends Base {
    swim() {
      return `${this.name} is swimming`;
    }
  };
}

class Animal {
  constructor(name) {
    this.name = name;
  }
}

class Duck extends withSwimming(withFlying(Animal)) {}
```

## 🔧 Property Descriptors

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
    if (value < -273.15) {
      throw new Error("Temperature below absolute zero");
    }
    this._celsius = value;
  }

  get fahrenheit() {
    return (this._celsius * 9) / 5 + 32;
  }

  set fahrenheit(value) {
    this.celsius = ((value - 32) * 5) / 9;
  }
}
```

### Object.defineProperty

```javascript
const obj = {};

Object.defineProperty(obj, "name", {
  value: "John",
  writable: true,
  enumerable: true,
  configurable: true
});

Object.defineProperty(obj, "age", {
  get() {
    return this._age;
  },
  set(value) {
    if (value < 0) throw new Error("Age cannot be negative");
    this._age = value;
  },
  enumerable: true,
  configurable: true
});
```

## 🧪 Common Patterns

### Method Chaining

```javascript
class QueryBuilder {
  constructor() {
    this.query = "";
  }

  select(columns) {
    this.query += `SELECT ${columns} `;
    return this;
  }

  from(table) {
    this.query += `FROM ${table} `;
    return this;
  }

  where(condition) {
    this.query += `WHERE ${condition} `;
    return this;
  }

  build() {
    return this.query.trim();
  }
}

// Usage: new QueryBuilder().select('*').from('users').where('age > 18').build()
```

### Prototype Extension

```javascript
// Extend built-in prototypes (use carefully)
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

Array.prototype.unique = function () {
  return [...new Set(this)];
};
```

## 🔍 Object Inspection

### Property Enumeration

```javascript
// Get own properties
Object.keys(obj); // enumerable properties
Object.getOwnPropertyNames(obj); // all properties
Object.getOwnPropertySymbols(obj); // symbol properties

// Check properties
obj.hasOwnProperty("prop"); // own property check
"prop" in obj; // inherited properties too
Object.prototype.hasOwnProperty.call(obj, "prop"); // safer version
```

### Prototype Chain

```javascript
Object.getPrototypeOf(obj); // get prototype
Object.setPrototypeOf(obj, proto); // set prototype (avoid in production)
obj instanceof Constructor; // instanceof check
Constructor.prototype.isPrototypeOf(obj); // prototype check
```

### Property Descriptors

```javascript
Object.getOwnPropertyDescriptor(obj, "prop"); // single property
Object.getOwnPropertyDescriptors(obj); // all properties
Object.defineProperty(obj, "prop", descriptor); // define single
Object.defineProperties(obj, descriptors); // define multiple
```

## 🛠️ Utility Functions

### Deep Clone

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map((item) => deepClone(item));
  if (typeof obj === "object") {
    const cloned = {};
    Object.keys(obj).forEach((key) => {
      cloned[key] = deepClone(obj[key]);
    });
    return cloned;
  }
}
```

### Extend/Merge

```javascript
function extend(target, ...sources) {
  sources.forEach((source) => {
    Object.keys(source).forEach((key) => {
      if (source[key] && typeof source[key] === "object") {
        target[key] = extend(target[key] || {}, source[key]);
      } else {
        target[key] = source[key];
      }
    });
  });
  return target;
}
```

### Type Checking

```javascript
function getType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}

function isPlainObject(obj) {
  return getType(obj) === "object" && obj.constructor === Object;
}

function isFunction(obj) {
  return typeof obj === "function";
}
```

## 📝 ES6+ Features

### Destructuring

```javascript
// Object destructuring
const { name, age } = person;
const { name: userName, age: userAge } = person;

// Array destructuring
const [first, second, ...rest] = array;

// Parameter destructuring
function greet({ name, age }) {
  return `Hello ${name}, you are ${age}`;
}
```

### Spread/Rest

```javascript
// Spread object
const newObj = { ...oldObj, newProp: "value" };

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
```

### Template Literals

```javascript
const message = `Hello ${name}, you are ${age} years old`;

// Tagged templates
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    return result + string + (values[i] ? `<mark>${values[i]}</mark>` : "");
  }, "");
}

const highlighted = highlight`Hello ${name}!`;
```

## 🎯 Quick Tips

- Use `class` for cleaner syntax
- Prefer composition over inheritance
- Keep inheritance hierarchies shallow
- Use private fields for true encapsulation
- Implement proper error handling
- Write testable, single-responsibility classes
- Use design patterns appropriately
- Profile performance for optimization
- Document complex inheritance chains
- Follow consistent naming conventions
