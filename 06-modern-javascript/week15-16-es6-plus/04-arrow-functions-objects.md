# Arrow Functions and Enhanced Object Literals

## Learning Objectives

- Master arrow function syntax and understand when to use them
- Understand lexical `this` binding and its implications
- Apply enhanced object literal features effectively
- Use computed property names and method definitions
- Implement getter/setter syntax and property shorthand

## Arrow Functions

### Basic Arrow Function Syntax

```javascript
// Traditional function expression
const add = function (a, b) {
  return a + b;
};

// Arrow function equivalent
const add = (a, b) => {
  return a + b;
};

// Concise arrow function (implicit return)
const add = (a, b) => a + b;

// Single parameter (parentheses optional)
const square = (x) => x * x;
const double = (x) => x * 2; // Parentheses for clarity

// No parameters
const random = () => Math.random();
const getCurrentTime = () => new Date();

// Multiple statements (explicit return needed)
const processUser = (user) => {
  console.log(`Processing user: ${user.name}`);
  const processed = { ...user, processed: true };
  return processed;
};
```

### Arrow Functions vs Regular Functions

#### Lexical `this` Binding

```javascript
// Traditional function - `this` is dynamic
const counter = {
  count: 0,

  // Regular method
  increment: function () {
    console.log("Before:", this.count); // `this` refers to counter object

    setTimeout(function () {
      this.count++; // `this` refers to global object (or undefined in strict mode)
      console.log("Inside timeout:", this.count); // undefined or error
    }, 1000);
  },

  // Solution with arrow function
  incrementCorrect: function () {
    console.log("Before:", this.count); // `this` refers to counter object

    setTimeout(() => {
      this.count++; // `this` still refers to counter object (lexical binding)
      console.log("Inside timeout:", this.count); // Works correctly
    }, 1000);
  }
};

// Real-world example: Event handlers
class TodoList {
  constructor() {
    this.todos = [];
    this.addButton = document.getElementById("add-todo");

    // Wrong: Regular function loses `this` context
    // this.addButton.addEventListener('click', this.addTodo);

    // Correct: Arrow function preserves `this`
    this.addButton.addEventListener("click", () => this.addTodo());

    // Alternative: Bind the context
    // this.addButton.addEventListener('click', this.addTodo.bind(this));
  }

  addTodo() {
    const input = document.getElementById("todo-input");
    this.todos.push(input.value); // `this` correctly refers to TodoList instance
    this.render();
  }

  render() {
    // Arrow functions in array methods preserve outer `this`
    const todoElements = this.todos.map(
      (todo, index) => `<li onclick="this.removeTodo(${index})">${todo}</li>`
    );

    document.getElementById("todo-list").innerHTML = todoElements.join("");
  }
}
```

#### No `arguments` Object

```javascript
// Regular function has `arguments` object
function regularFunction() {
  console.log(arguments); // Arguments object available
  console.log(Array.from(arguments)); // Convert to array
}

// Arrow function doesn't have `arguments`
const arrowFunction = () => {
  // console.log(arguments); // ReferenceError: arguments is not defined
};

// Use rest parameters instead
const arrowWithRest = (...args) => {
  console.log(args); // Actual array, not arguments object
  return args.reduce((sum, num) => sum + num, 0);
};

regularFunction(1, 2, 3); // [1, 2, 3]
arrowWithRest(1, 2, 3); // [1, 2, 3], returns 6
```

#### Cannot be Used as Constructors

```javascript
// Regular function can be constructor
function Person(name) {
  this.name = name;
}

const john = new Person("John"); // Works

// Arrow function cannot be constructor
const PersonArrow = (name) => {
  this.name = name;
};

// const jane = new PersonArrow('Jane'); // TypeError: PersonArrow is not a constructor
```

### When to Use Arrow Functions

#### Good Use Cases

```javascript
// Array methods
const numbers = [1, 2, 3, 4, 5];

// Concise and readable
const doubled = numbers.map((n) => n * 2);
const evens = numbers.filter((n) => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

// Promise chains
fetch("/api/users")
  .then((response) => response.json())
  .then((users) => users.filter((user) => user.active))
  .then((activeUsers) => activeUsers.map((user) => user.name))
  .catch((error) => console.error("Error:", error));

// Event listeners (when you need to preserve `this`)
class ImageGallery {
  constructor() {
    this.images = [];
    this.currentIndex = 0;

    // Arrow functions preserve the class instance context
    document
      .getElementById("next")
      .addEventListener("click", () => this.next());
    document
      .getElementById("prev")
      .addEventListener("click", () => this.previous());
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.render();
  }
}

// Functional programming patterns
const pipe =
  (...functions) =>
  (value) =>
    functions.reduce((acc, fn) => fn(acc), value);

const processData = pipe(
  (data) => data.filter((item) => item.active),
  (data) => data.map((item) => ({ ...item, processed: true })),
  (data) => data.sort((a, b) => a.name.localeCompare(b.name))
);
```

#### When NOT to Use Arrow Functions

```javascript
// Object methods (when you need dynamic `this`)
const calculator = {
  value: 0,

  // Wrong: Arrow function doesn't bind `this` to calculator
  addWrong: (n) => {
    this.value += n; // `this` is not calculator object
    return this;
  },

  // Correct: Regular method
  add(n) {
    this.value += n; // `this` correctly refers to calculator
    return this;
  },

  // Also correct: Traditional function expression
  subtract: function (n) {
    this.value -= n;
    return this;
  }
};

// Prototype methods
function User(name) {
  this.name = name;
}

// Wrong: Arrow function doesn't work for prototype methods
User.prototype.greetWrong = () => {
  return `Hello, I'm ${this.name}`; // `this` is not the User instance
};

// Correct: Regular function
User.prototype.greet = function () {
  return `Hello, I'm ${this.name}`; // `this` correctly refers to User instance
};

// Event handlers (when you need the element as `this`)
document.querySelectorAll(".button").forEach((button) => {
  // Wrong: Arrow function doesn't bind `this` to the clicked element
  button.addEventListener("click", () => {
    this.classList.toggle("active"); // `this` is not the button
  });

  // Correct: Regular function
  button.addEventListener("click", function () {
    this.classList.toggle("active"); // `this` is the clicked button
  });
});
```

## Enhanced Object Literals

### Property Shorthand

```javascript
// Traditional object creation
const name = "John";
const age = 30;
const city = "New York";

const person = {
  name: name,
  age: age,
  city: city
};

// Enhanced shorthand (property names match variable names)
const person = { name, age, city };

// Mixed shorthand and explicit
const user = {
  name,
  age,
  email: "john@example.com", // Explicit property
  isActive: true
};

// Function parameters with destructuring and shorthand
function createUser({ name, age, email }) {
  return {
    name,
    age,
    email,
    id: Math.random(),
    createdAt: new Date()
  };
}
```

### Method Definitions

```javascript
// Traditional method definition
const calculator = {
  add: function (a, b) {
    return a + b;
  },

  subtract: function (a, b) {
    return a - b;
  }
};

// Enhanced method definition (shorthand)
const calculator = {
  add(a, b) {
    return a + b;
  },

  subtract(a, b) {
    return a - b;
  },

  // Async method
  async fetchData(url) {
    const response = await fetch(url);
    return response.json();
  },

  // Generator method
  *numbers() {
    yield 1;
    yield 2;
    yield 3;
  }
};

// Class-like object with constructor function
const UserFactory = {
  create(name, email) {
    return {
      name,
      email,
      id: this.generateId(),
      createdAt: new Date()
    };
  },

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  },

  validate(user) {
    return user.name && user.email && user.email.includes("@");
  }
};
```

### Computed Property Names

```javascript
// Dynamic property names
const prefix = "user";
const id = 123;

const user = {
  [`${prefix}_${id}`]: "John Doe",
  [`${prefix}_email`]: "john@example.com"
};
// Result: { user_123: 'John Doe', user_email: 'john@example.com' }

// Function-generated property names
function getPropertyName(type) {
  return `${type}_timestamp`;
}

const logEntry = {
  message: "User logged in",
  [getPropertyName("created")]: Date.now(),
  [getPropertyName("updated")]: Date.now()
};

// Dynamic method names
const apiVersion = "v2";
const api = {
  [`get${apiVersion}Users`]() {
    return fetch(`/api/${apiVersion}/users`);
  },

  [`create${apiVersion}User`](userData) {
    return fetch(`/api/${apiVersion}/users`, {
      method: "POST",
      body: JSON.stringify(userData)
    });
  }
};

// Using computed properties with Symbol
const PRIVATE_METHOD = Symbol("private");
const PUBLIC_API = Symbol("api");

const service = {
  [PUBLIC_API]: "v1.0",

  [PRIVATE_METHOD]() {
    return "This is private";
  },

  getVersion() {
    return this[PUBLIC_API];
  }
};
```

### Getters and Setters

```javascript
const user = {
  _firstName: "",
  _lastName: "",
  _age: 0,

  // Getter for computed property
  get fullName() {
    return `${this._firstName} ${this._lastName}`.trim();
  },

  // Setter with validation
  set fullName(value) {
    const parts = value.split(" ");
    this._firstName = parts[0] || "";
    this._lastName = parts.slice(1).join(" ") || "";
  },

  get age() {
    return this._age;
  },

  set age(value) {
    if (value < 0 || value > 150) {
      throw new Error("Invalid age");
    }
    this._age = value;
  },

  // Computed property based on other properties
  get isAdult() {
    return this._age >= 18;
  },

  // Read-only property
  get id() {
    return Math.random().toString(36).substr(2, 9);
  }
};

// Usage
user.fullName = "John Doe";
console.log(user._firstName); // 'John'
console.log(user._lastName); // 'Doe'
console.log(user.fullName); // 'John Doe'

user.age = 25;
console.log(user.isAdult); // true

// Real-world example: Configuration object
const config = {
  _environment: "development",
  _features: new Set(),

  get environment() {
    return this._environment;
  },

  set environment(env) {
    const validEnvs = ["development", "staging", "production"];
    if (!validEnvs.includes(env)) {
      throw new Error(`Invalid environment: ${env}`);
    }
    this._environment = env;
  },

  get isDevelopment() {
    return this._environment === "development";
  },

  get isProduction() {
    return this._environment === "production";
  },

  get apiUrl() {
    const urls = {
      development: "http://localhost:3000",
      staging: "https://staging-api.example.com",
      production: "https://api.example.com"
    };
    return urls[this._environment];
  },

  enableFeature(feature) {
    this._features.add(feature);
  },

  get enabledFeatures() {
    return Array.from(this._features);
  }
};
```

## Advanced Object Patterns

### Object Factory with Enhanced Literals

```javascript
function createRepository(entityName) {
  const tableName = entityName.toLowerCase() + "s";

  return {
    entityName,
    tableName,

    // Dynamic method names
    [`findAll${entityName}s`]() {
      return this.query(`SELECT * FROM ${this.tableName}`);
    },

    [`find${entityName}ById`](id) {
      return this.query(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
    },

    [`create${entityName}`](data) {
      const fields = Object.keys(data).join(", ");
      const placeholders = Object.keys(data)
        .map(() => "?")
        .join(", ");
      const values = Object.values(data);

      return this.query(
        `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`,
        values
      );
    },

    async query(sql, params = []) {
      // Mock database query
      console.log(`Executing: ${sql}`, params);
      return { success: true, data: [] };
    }
  };
}

const userRepo = createRepository("User");
const productRepo = createRepository("Product");

// Usage
userRepo.findAllUsers();
userRepo.findUserById(123);
userRepo.createUser({ name: "John", email: "john@example.com" });
```

### Mixin Pattern with Enhanced Objects

```javascript
// Mixin objects
const Timestamped = {
  updateTimestamp() {
    this.updatedAt = new Date();
  },

  get age() {
    return Date.now() - this.createdAt;
  }
};

const Validatable = {
  validate() {
    return this.errors.length === 0;
  },

  addError(field, message) {
    this.errors.push({ field, message });
  },

  get isValid() {
    return this.validate();
  }
};

const Serializable = {
  toJSON() {
    return Object.keys(this)
      .filter((key) => !key.startsWith("_"))
      .reduce((obj, key) => {
        obj[key] = this[key];
        return obj;
      }, {});
  },

  fromJSON(json) {
    Object.assign(this, json);
    return this;
  }
};

// Create objects with mixins
function createModel(data = {}) {
  return Object.assign(
    {
      createdAt: new Date(),
      updatedAt: new Date(),
      errors: [],
      ...data
    },
    Timestamped,
    Validatable,
    Serializable
  );
}

const user = createModel({
  name: "John",
  email: "john@example.com"
});

console.log(user.age); // Time since creation
user.updateTimestamp(); // Updates updatedAt
user.addError("email", "Invalid format");
console.log(user.isValid); // false
console.log(user.toJSON()); // Serialized object
```

## Best Practices

### 1. Choose the Right Function Type

```javascript
// Use arrow functions for:
// - Array methods
const processedData = data
  .filter((item) => item.active)
  .map((item) => ({ ...item, processed: true }))
  .sort((a, b) => a.name.localeCompare(b.name));

// - Preserving lexical this
class EventEmitter {
  constructor() {
    this.listeners = [];

    // Arrow function preserves `this`
    setTimeout(() => this.emit("ready"), 1000);
  }
}

// Use regular functions for:
// - Object methods
const calculator = {
  value: 0,
  add(n) {
    this.value += n;
    return this;
  }, // Needs dynamic `this`
  multiply(n) {
    this.value *= n;
    return this;
  }
};

// - Prototype methods
Array.prototype.shuffle = function () {
  // Needs `this` to refer to the array instance
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [this[i], this[j]] = [this[j], this[i]];
  }
  return this;
};
```

### 2. Use Enhanced Object Features Judiciously

```javascript
// Good: Clear and improves readability
const user = { name, age, email }; // Property shorthand

const api = {
  async getUser(id) {
    // Method shorthand
    return fetch(`/users/${id}`);
  }
};

// Good: Dynamic properties when needed
const createAction = (type, payload) => ({
  type,
  payload,
  [`${type}_TIMESTAMP`]: Date.now()
});

// Avoid: Overusing computed properties
const obj = {
  [(() => "unnecessary")()]: "value" // Unnecessarily complex
};

// Better: Keep it simple
const obj = {
  unnecessary: "value"
};
```

### 3. Consistent Property Patterns

```javascript
// Good: Consistent property access patterns
const config = {
  _private: "internal",

  get public() {
    return this._private.toUpperCase();
  },

  set public(value) {
    this._private = value.toLowerCase();
  }
};

// Avoid: Mixing access patterns
const inconsistent = {
  data: "some data", // Direct property
  get other() {
    /* ... */
  }, // Getter
  _private: "private", // "Private" property
  public: "public" // Public property
};
```

## Self-Check Questions

1. When should you use arrow functions vs regular functions?
2. How does lexical `this` binding work in arrow functions?
3. What are the benefits of enhanced object literal syntax?
4. When would you use computed property names?
5. How do getters and setters improve object design?

## Practice Exercises

### Exercise 1: Function Conversion

Convert between arrow functions and regular functions based on context.

### Exercise 2: Object Enhancement

Refactor objects to use enhanced literal syntax.

### Exercise 3: Dynamic Properties

Build objects with computed property names.

### Exercise 4: Getter/Setter Implementation

Create objects with proper encapsulation using getters/setters.

### Exercise 5: Mixin System

Build a mixin system using enhanced object features.

## Further Reading

- [MDN: Arrow Functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN: Object Initializer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)
- [ES6 In Depth: Arrow Functions](https://hacks.mozilla.org/2015/06/es6-in-depth-arrow-functions/)
