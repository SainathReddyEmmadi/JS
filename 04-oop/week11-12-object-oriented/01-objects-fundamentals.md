# Object Fundamentals in JavaScript

## Learning Objectives

- Understand JavaScript objects and their properties
- Master object creation, manipulation, and iteration
- Learn about property descriptors and getters/setters
- Explore object composition and mixins
- Understand the `this` keyword in object context

## What are Objects?

Objects in JavaScript are collections of key-value pairs that represent entities with properties and behaviors. They are the foundation of JavaScript's object-oriented programming capabilities.

```javascript
// Simple object literal
const person = {
  name: "Alice",
  age: 30,
  city: "New York",
  greet: function () {
    return `Hello, I'm ${this.name}`;
  }
};

console.log(person.name); // 'Alice'
console.log(person.greet()); // 'Hello, I'm Alice'
```

## Object Creation Methods

### 1. Object Literals

The most common and straightforward way to create objects.

```javascript
const book = {
  title: "JavaScript: The Good Parts",
  author: "Douglas Crockford",
  pages: 176,
  published: 2008,

  getInfo() {
    return `${this.title} by ${this.author} (${this.published})`;
  },

  isLong() {
    return this.pages > 300;
  }
};

// Adding properties after creation
book.isbn = "978-0596517748";
book.genre = "Programming";
```

### 2. Object() Constructor

Creating objects using the built-in Object constructor.

```javascript
const car = new Object();
car.make = "Toyota";
car.model = "Camry";
car.year = 2022;
car.start = function () {
  return `${this.make} ${this.model} is starting...`;
};

console.log(car.start()); // 'Toyota Camry is starting...'
```

### 3. Object.create()

Creating objects with a specific prototype.

```javascript
// Create an object with specific prototype
const vehiclePrototype = {
  start() {
    return `${this.type} is starting...`;
  },
  stop() {
    return `${this.type} is stopping...`;
  }
};

const motorcycle = Object.create(vehiclePrototype);
motorcycle.type = "Motorcycle";
motorcycle.brand = "Harley-Davidson";

console.log(motorcycle.start()); // 'Motorcycle is starting...'
```

### 4. Factory Functions

Functions that return new objects.

```javascript
function createPerson(name, age, occupation) {
  return {
    name,
    age,
    occupation,
    introduce() {
      return `Hi, I'm ${this.name}, a ${this.age}-year-old ${this.occupation}`;
    },

    haveBirthday() {
      this.age++;
      return `Happy birthday! Now I'm ${this.age}`;
    }
  };
}

const alice = createPerson("Alice", 28, "Developer");
const bob = createPerson("Bob", 32, "Designer");

console.log(alice.introduce()); // 'Hi, I'm Alice, a 28-year-old Developer'
console.log(bob.haveBirthday()); // 'Happy birthday! Now I'm 33'
```

## Property Access and Manipulation

### Dot Notation vs Bracket Notation

```javascript
const user = {
  firstName: "John",
  lastName: "Doe",
  age: 30,
  "favorite-color": "blue",
  123: "numeric property"
};

// Dot notation
console.log(user.firstName); // 'John'
user.email = "john@example.com";

// Bracket notation
console.log(user["lastName"]); // 'Doe'
console.log(user["favorite-color"]); // 'blue' (can't use dot notation)
console.log(user[123]); // 'numeric property'

// Dynamic property access
const prop = "age";
console.log(user[prop]); // 30

// Computed property names
const key = "phone";
user[key] = "555-1234";
```

### Property Existence and Enumeration

```javascript
const product = {
  name: "Laptop",
  price: 999,
  category: "Electronics",
  inStock: true
};

// Check if property exists
console.log("name" in product); // true
console.log("color" in product); // false
console.log(product.hasOwnProperty("price")); // true

// Get all property names
const keys = Object.keys(product);
console.log(keys); // ['name', 'price', 'category', 'inStock']

// Get all property values
const values = Object.values(product);
console.log(values); // ['Laptop', 999, 'Electronics', true]

// Get key-value pairs
const entries = Object.entries(product);
console.log(entries);
// [['name', 'Laptop'], ['price', 999], ['category', 'Electronics'], ['inStock', true]]
```

### Property Deletion

```javascript
const temp = {
  a: 1,
  b: 2,
  c: 3
};

delete temp.b;
console.log(temp); // { a: 1, c: 3 }

// Alternative: setting to undefined (property still exists)
temp.c = undefined;
console.log("c" in temp); // true
console.log(temp.c); // undefined
```

## Property Descriptors

JavaScript properties have attributes that control their behavior.

```javascript
const obj = {};

// Define property with descriptor
Object.defineProperty(obj, "name", {
  value: "JavaScript",
  writable: true, // Can be changed
  enumerable: true, // Shows up in for...in loops
  configurable: true // Can be deleted or reconfigured
});

// Get property descriptor
const descriptor = Object.getOwnPropertyDescriptor(obj, "name");
console.log(descriptor);
// { value: 'JavaScript', writable: true, enumerable: true, configurable: true }

// Define multiple properties
Object.defineProperties(obj, {
  version: {
    value: "ES2024",
    writable: false, // Read-only
    enumerable: true
  },

  internal: {
    value: "secret",
    enumerable: false // Won't show in for...in or Object.keys()
  }
});

// Trying to change read-only property
obj.version = "ES2025"; // Silent failure in non-strict mode
console.log(obj.version); // Still 'ES2024'

// Property won't show in enumeration
console.log(Object.keys(obj)); // ['name', 'version'] (no 'internal')
```

## Getters and Setters

Getters and setters allow you to define object properties that look like simple values but actually execute functions.

```javascript
const circle = {
  _radius: 0,

  // Getter
  get radius() {
    return this._radius;
  },

  // Setter
  set radius(value) {
    if (value < 0) {
      throw new Error("Radius cannot be negative");
    }
    this._radius = value;
  },

  // Computed property using getter
  get area() {
    return Math.PI * this._radius * this._radius;
  },

  get circumference() {
    return 2 * Math.PI * this._radius;
  }
};

circle.radius = 5;
console.log(circle.radius); // 5
console.log(circle.area); // 78.54
console.log(circle.circumference); // 31.42

// circle.radius = -1; // Error: Radius cannot be negative
```

### Computed Properties with Getters/Setters

```javascript
const rectangle = {
  _width: 0,
  _height: 0,

  get width() {
    return this._width;
  },
  set width(value) {
    if (value >= 0) this._width = value;
  },

  get height() {
    return this._height;
  },
  set height(value) {
    if (value >= 0) this._height = value;
  },

  get area() {
    return this._width * this._height;
  },

  get perimeter() {
    return 2 * (this._width + this._height);
  },

  get isSquare() {
    return this._width === this._height && this._width > 0;
  }
};

rectangle.width = 10;
rectangle.height = 10;
console.log(rectangle.area); // 100
console.log(rectangle.isSquare); // true
```

## The `this` Keyword

The `this` keyword refers to the object that is executing the current function.

### Method Context

```javascript
const person = {
  name: "Alice",
  age: 30,

  greet() {
    return `Hello, I'm ${this.name} and I'm ${this.age} years old`;
  },

  introduce: function () {
    return `My name is ${this.name}`;
  },

  // Arrow function - 'this' is lexically bound
  arrowGreet: () => {
    return `Hello from ${this.name}`; // 'this' refers to global object!
  }
};

console.log(person.greet()); // 'Hello, I'm Alice and I'm 30 years old'
console.log(person.arrowGreet()); // 'Hello from undefined' (in browser: global object)
```

### Method Borrowing

```javascript
const person1 = {
  name: "Alice",
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

const person2 = {
  name: "Bob"
};

// Borrowing method
person2.greet = person1.greet;
console.log(person2.greet()); // 'Hello, I'm Bob'

// Using call/apply/bind
console.log(person1.greet.call(person2)); // 'Hello, I'm Bob'
console.log(person1.greet.apply(person2)); // 'Hello, I'm Bob'

const boundGreet = person1.greet.bind(person2);
console.log(boundGreet()); // 'Hello, I'm Bob'
```

### Context Loss and Solutions

```javascript
const counter = {
  count: 0,

  increment() {
    this.count++;
    console.log(`Count: ${this.count}`);
  },

  delayedIncrement() {
    // 'this' is lost in setTimeout
    setTimeout(function () {
      this.increment(); // Error: this.increment is not a function
    }, 1000);
  },

  fixedDelayedIncrement() {
    // Solution 1: Store reference to 'this'
    const self = this;
    setTimeout(function () {
      self.increment();
    }, 1000);
  },

  arrowDelayedIncrement() {
    // Solution 2: Use arrow function
    setTimeout(() => {
      this.increment(); // Arrow function preserves 'this'
    }, 1000);
  },

  boundDelayedIncrement() {
    // Solution 3: Use bind
    setTimeout(
      function () {
        this.increment();
      }.bind(this),
      1000
    );
  }
};
```

## Object Composition and Mixins

### Composition over Inheritance

```javascript
// Behavior objects
const canEat = {
  eat(food) {
    return `${this.name} is eating ${food}`;
  }
};

const canWalk = {
  walk() {
    return `${this.name} is walking`;
  }
};

const canSwim = {
  swim() {
    return `${this.name} is swimming`;
  }
};

const canFly = {
  fly() {
    return `${this.name} is flying`;
  }
};

// Factory function using composition
function createAnimal(name, behaviors = []) {
  const animal = { name };

  // Compose behaviors
  behaviors.forEach((behavior) => {
    Object.assign(animal, behavior);
  });

  return animal;
}

// Create different animals with different capabilities
const dog = createAnimal("Rex", [canEat, canWalk, canSwim]);
const bird = createAnimal("Tweety", [canEat, canWalk, canFly]);
const fish = createAnimal("Nemo", [canEat, canSwim]);

console.log(dog.walk()); // 'Rex is walking'
console.log(bird.fly()); // 'Tweety is flying'
console.log(fish.swim()); // 'Nemo is swimming'
```

### Mixin Pattern

```javascript
// Mixin for event handling
const EventMixin = {
  addEventListener(event, callback) {
    this._events = this._events || {};
    this._events[event] = this._events[event] || [];
    this._events[event].push(callback);
  },

  removeEventListener(event, callback) {
    if (!this._events || !this._events[event]) return;
    this._events[event] = this._events[event].filter((cb) => cb !== callback);
  },

  emit(event, data) {
    if (!this._events || !this._events[event]) return;
    this._events[event].forEach((callback) => callback(data));
  }
};

// Mixin for validation
const ValidationMixin = {
  validate() {
    const errors = [];

    if (this.rules) {
      for (const [field, rule] of Object.entries(this.rules)) {
        if (!rule(this[field])) {
          errors.push(`${field} is invalid`);
        }
      }
    }

    return errors;
  },

  isValid() {
    return this.validate().length === 0;
  }
};

// User object with mixins
function createUser(name, email) {
  const user = {
    name,
    email,

    rules: {
      name: (value) => typeof value === "string" && value.length > 0,
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }
  };

  // Apply mixins
  Object.assign(user, EventMixin, ValidationMixin);

  return user;
}

const user = createUser("Alice", "alice@example.com");

// Use event functionality
user.addEventListener("update", (data) => {
  console.log("User updated:", data);
});

// Use validation functionality
console.log(user.isValid()); // true
user.email = "invalid-email";
console.log(user.validate()); // ['email is invalid']
```

## Object Iteration

### for...in Loop

```javascript
const person = {
  name: "Alice",
  age: 30,
  city: "New York"
};

// Iterate over enumerable properties
for (const key in person) {
  console.log(`${key}: ${person[key]}`);
}
// name: Alice
// age: 30
// city: New York

// Include inherited properties check
for (const key in person) {
  if (person.hasOwnProperty(key)) {
    console.log(`Own property ${key}: ${person[key]}`);
  }
}
```

### Object Methods for Iteration

```javascript
const product = {
  name: "Laptop",
  price: 999,
  category: "Electronics"
};

// Iterate over keys
Object.keys(product).forEach((key) => {
  console.log(`Key: ${key}`);
});

// Iterate over values
Object.values(product).forEach((value) => {
  console.log(`Value: ${value}`);
});

// Iterate over entries
Object.entries(product).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

// Transform object to array of formatted strings
const formatted = Object.entries(product).map(([key, value]) => {
  return `${key.toUpperCase()}: ${value}`;
});
console.log(formatted); // ['NAME: Laptop', 'PRICE: 999', 'CATEGORY: Electronics']
```

## Object Cloning and Copying

### Shallow Copy

```javascript
const original = {
  name: "Alice",
  age: 30,
  address: {
    street: "123 Main St",
    city: "New York"
  }
};

// Method 1: Object.assign()
const copy1 = Object.assign({}, original);

// Method 2: Spread operator
const copy2 = { ...original };

// Method 3: Object.fromEntries() with Object.entries()
const copy3 = Object.fromEntries(Object.entries(original));

// Shallow copy issue
copy1.name = "Bob"; // Doesn't affect original
copy1.address.city = "Boston"; // Affects original!

console.log(original.address.city); // 'Boston' (modified!)
```

### Deep Copy

```javascript
// Method 1: JSON methods (limited - no functions, dates, etc.)
function deepCopyJSON(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// Method 2: Recursive deep copy
function deepCopy(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepCopy(item));
  }

  if (typeof obj === "object") {
    const copy = {};
    Object.keys(obj).forEach((key) => {
      copy[key] = deepCopy(obj[key]);
    });
    return copy;
  }
}

const original2 = {
  name: "Alice",
  age: 30,
  address: {
    street: "123 Main St",
    city: "New York"
  },
  hobbies: ["reading", "swimming"]
};

const deepCopied = deepCopy(original2);
deepCopied.address.city = "Boston";
deepCopied.hobbies.push("coding");

console.log(original2.address.city); // 'New York' (unchanged)
console.log(original2.hobbies); // ['reading', 'swimming'] (unchanged)
```

## Object Comparison

```javascript
// Primitive comparison
console.log(5 === 5); // true
console.log("hello" === "hello"); // true

// Object comparison (reference equality)
const obj1 = { name: "Alice" };
const obj2 = { name: "Alice" };
const obj3 = obj1;

console.log(obj1 === obj2); // false (different objects)
console.log(obj1 === obj3); // true (same reference)

// Deep equality function
function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (obj1 == null || obj2 == null) return false;

  if (typeof obj1 !== "object" || typeof obj2 !== "object") {
    return obj1 === obj2;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

console.log(deepEqual(obj1, obj2)); // true (same content)
```

## Practical Examples

### Configuration Object Pattern

```javascript
function createAPIClient(config = {}) {
  const defaults = {
    baseURL: "https://api.example.com",
    timeout: 5000,
    retries: 3,
    headers: {
      "Content-Type": "application/json"
    }
  };

  // Merge configuration with defaults
  const settings = {
    ...defaults,
    ...config,
    headers: {
      ...defaults.headers,
      ...config.headers
    }
  };

  return {
    get(endpoint) {
      return `GET ${settings.baseURL}${endpoint}`;
    },

    post(endpoint, data) {
      return `POST ${settings.baseURL}${endpoint} with data: ${JSON.stringify(
        data
      )}`;
    },

    getConfig() {
      return { ...settings }; // Return copy
    }
  };
}

const api = createAPIClient({
  baseURL: "https://myapi.com",
  headers: {
    Authorization: "Bearer token123"
  }
});
```

### State Management Object

```javascript
function createState(initialState = {}) {
  let state = { ...initialState };
  const listeners = [];

  return {
    getState() {
      return { ...state }; // Return copy to prevent mutation
    },

    setState(updates) {
      const newState = { ...state, ...updates };
      const oldState = state;
      state = newState;

      // Notify listeners
      listeners.forEach((listener) => {
        listener(newState, oldState);
      });
    },

    subscribe(listener) {
      listeners.push(listener);

      // Return unsubscribe function
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    }
  };
}

const appState = createState({
  user: null,
  isLoggedIn: false,
  theme: "light"
});

const unsubscribe = appState.subscribe((newState, oldState) => {
  console.log("State changed:", { newState, oldState });
});

appState.setState({ user: { name: "Alice" }, isLoggedIn: true });
```

## Best Practices

### 1. Use Descriptive Property Names

```javascript
// Bad
const u = {
  n: "Alice",
  a: 30,
  e: "alice@example.com"
};

// Good
const user = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};
```

### 2. Group Related Methods

```javascript
const calculator = {
  // Basic operations
  add(a, b) {
    return a + b;
  },
  subtract(a, b) {
    return a - b;
  },
  multiply(a, b) {
    return a * b;
  },
  divide(a, b) {
    return b !== 0 ? a / b : null;
  },

  // Advanced operations
  power(base, exponent) {
    return Math.pow(base, exponent);
  },
  sqrt(number) {
    return Math.sqrt(number);
  },

  // Utility methods
  isEven(number) {
    return number % 2 === 0;
  },
  isOdd(number) {
    return number % 2 !== 0;
  }
};
```

### 3. Use Consistent Naming Conventions

```javascript
const userAccount = {
  // Properties: nouns
  userId: 123,
  userName: "alice",
  isActive: true,
  lastLoginDate: new Date(),

  // Methods: verbs
  activate() {
    this.isActive = true;
  },
  deactivate() {
    this.isActive = false;
  },
  updateLastLogin() {
    this.lastLoginDate = new Date();
  },

  // Boolean methods: is/has/can prefix
  isLoggedIn() {
    return this.lastLoginDate > new Date(Date.now() - 3600000);
  },
  hasPermission(permission) {
    return this.permissions.includes(permission);
  },
  canAccess(resource) {
    return this.isActive && this.hasPermission(resource);
  }
};
```

## Self-Check Questions

1. What are the different ways to create objects in JavaScript?
2. How do property descriptors control object property behavior?
3. What is the difference between getters/setters and regular methods?
4. How does the `this` keyword work in object methods?
5. What are mixins and how do they promote code reuse?
6. What's the difference between shallow and deep copying?
7. How can you iterate over object properties effectively?

## Practice Exercises

1. **Object Creation**: Create objects using different methods and compare them
2. **Property Descriptors**: Experiment with different property configurations
3. **Getters/Setters**: Build objects with computed properties
4. **Mixins**: Create reusable behavior objects and compose them
5. **Object Utilities**: Build helper functions for object manipulation

## Next Steps

- Learn about constructor functions and prototypes
- Explore ES6 classes and modern syntax
- Study inheritance and polymorphism
- Master design patterns and architectural concepts
