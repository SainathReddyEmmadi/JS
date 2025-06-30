# Objects: JavaScript's Data Powerhouse 🏗️

## 🎯 Learning Objectives

- Master object creation and property access patterns
- Understand dot notation vs bracket notation
- Learn object methods and built-in object utilities
- Practice object manipulation and transformation
- Build real-world object-based applications

## 📝 What are Objects?

Objects are collections of key-value pairs (properties) that represent real-world entities or abstract concepts.

```javascript
// Objects represent things with properties and behaviors
const person = {
  name: "Alice", // property: value
  age: 30, // property: value
  isEmployed: true, // property: value
  address: {
    // nested object
    street: "123 Main St",
    city: "Boston",
    zipCode: "02101"
  },
  greet: function () {
    // method (function property)
    return `Hello, I'm ${this.name}`;
  }
};
```

## 🏗️ Creating Objects

### Object Literal (Most Common)

```javascript
// Empty object
const emptyObject = {};

// Object with properties
const car = {
  brand: "Toyota",
  model: "Camry",
  year: 2023,
  color: "blue",
  features: ["GPS", "Bluetooth", "Backup Camera"]
};

// Object with methods
const calculator = {
  result: 0,
  add: function (x) {
    this.result += x;
    return this;
  },
  subtract: function (x) {
    this.result -= x;
    return this;
  },
  getValue: function () {
    return this.result;
  }
};
```

### Object Constructor

```javascript
// Using Object constructor
const person = new Object();
person.name = "Bob";
person.age = 25;

// Constructor function (traditional way)
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.greet = function () {
    return `Hello, I'm ${this.name}`;
  };
}

const alice = new Person("Alice", 30);
const bob = new Person("Bob", 25);
```

### Object.create()

```javascript
// Create object with specific prototype
const personPrototype = {
  greet: function () {
    return `Hello, I'm ${this.name}`;
  },
  getAge: function () {
    return this.age;
  }
};

const person = Object.create(personPrototype);
person.name = "Charlie";
person.age = 28;

console.log(person.greet()); // "Hello, I'm Charlie"
```

## 🔧 Property Access and Manipulation

### Dot Notation vs Bracket Notation

```javascript
const user = {
  name: "Alice",
  age: 30,
  "favorite-color": "blue", // Property name with hyphen
  123: "numeric property" // Numeric property name
};

// Dot notation (most common)
console.log(user.name); // "Alice"
console.log(user.age); // 30

// Bracket notation (more flexible)
console.log(user["name"]); // "Alice"
console.log(user["favorite-color"]); // "blue" (can't use dot notation)
console.log(user[123]); // "numeric property"
console.log(user["123"]); // "numeric property" (same as above)

// Dynamic property access
const propertyName = "age";
console.log(user[propertyName]); // 30

// Computed property names (ES6)
const dynamicKey = "email";
const userInfo = {
  name: "Bob",
  [dynamicKey]: "bob@email.com",
  [`${dynamicKey}Verified`]: true
};
console.log(userInfo); // { name: "Bob", email: "bob@email.com", emailVerified: true }
```

### Adding and Modifying Properties

```javascript
const product = {
  name: "Laptop",
  price: 999
};

// Adding properties
product.brand = "Dell";
product["category"] = "Electronics";
product.specs = {
  ram: "16GB",
  storage: "512GB SSD"
};

// Modifying properties
product.price = 899;
product.specs.ram = "32GB";

console.log(product);
```

### Deleting Properties

```javascript
const user = {
  name: "Alice",
  age: 30,
  email: "alice@email.com",
  tempProperty: "temporary"
};

// Delete property
delete user.tempProperty;
console.log(user.tempProperty); // undefined

// Check if property exists
console.log("email" in user); // true
console.log("tempProperty" in user); // false
console.log(user.hasOwnProperty("name")); // true
```

## 🔍 Object Methods and Utilities

### Object.keys(), Object.values(), Object.entries()

```javascript
const student = {
  name: "Alice",
  age: 20,
  major: "Computer Science",
  gpa: 3.8
};

// Get all property names
const keys = Object.keys(student);
console.log(keys); // ["name", "age", "major", "gpa"]

// Get all property values
const values = Object.values(student);
console.log(values); // ["Alice", 20, "Computer Science", 3.8]

// Get key-value pairs
const entries = Object.entries(student);
console.log(entries);
// [["name", "Alice"], ["age", 20], ["major", "Computer Science"], ["gpa", 3.8]]

// Practical use with forEach
Object.entries(student).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});
```

### Object.assign() and Spread Operator

```javascript
const defaults = {
  theme: "light",
  language: "en",
  notifications: true
};

const userPreferences = {
  theme: "dark",
  fontSize: "large"
};

// Object.assign() - merge objects (modifies target)
const settings1 = Object.assign({}, defaults, userPreferences);
console.log(settings1);
// { theme: "dark", language: "en", notifications: true, fontSize: "large" }

// Spread operator (ES6) - cleaner syntax
const settings2 = { ...defaults, ...userPreferences };
console.log(settings2); // Same result as above

// Overriding specific properties
const finalSettings = {
  ...defaults,
  ...userPreferences,
  version: "1.0",
  theme: "auto" // This overrides userPreferences.theme
};
```

### Object.freeze(), Object.seal(), Object.preventExtensions()

```javascript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
};

// Object.freeze() - completely immutable
const frozenConfig = Object.freeze({ ...config });
// frozenConfig.apiUrl = "new url"; // Fails silently (throws error in strict mode)

// Object.seal() - can modify existing properties, can't add/delete
const sealedConfig = Object.seal({ ...config });
sealedConfig.timeout = 10000; // ✅ Works
// sealedConfig.newProperty = "value"; // ❌ Fails

// Object.preventExtensions() - can modify/delete, can't add
const restrictedConfig = Object.preventExtensions({ ...config });
restrictedConfig.timeout = 8000; // ✅ Works
delete restrictedConfig.retries; // ✅ Works
// restrictedConfig.newProperty = "value"; // ❌ Fails

// Check object state
console.log(Object.isFrozen(frozenConfig)); // true
console.log(Object.isSealed(sealedConfig)); // true
console.log(Object.isExtensible(restrictedConfig)); // false
```

## 🎯 Object Methods and `this`

### Method Definition

```javascript
const calculator = {
  value: 0,

  // Method shorthand (ES6)
  add(x) {
    this.value += x;
    return this; // Enable method chaining
  },

  // Traditional method definition
  subtract: function (x) {
    this.value -= x;
    return this;
  },

  // Arrow function - be careful with 'this'!
  multiply: (x) => {
    // this.value *= x; // ❌ 'this' doesn't refer to the object
    return "Arrow functions don't have their own 'this'";
  },

  // Getter
  get result() {
    return this.value;
  },

  // Setter
  set result(newValue) {
    this.value = newValue;
  }
};

// Method chaining
calculator.add(10).subtract(3).add(5);
console.log(calculator.result); // 12

// Using getters and setters
calculator.result = 20; // Uses setter
console.log(calculator.result); // Uses getter
```

### Context Binding Issues and Solutions

```javascript
const user = {
  name: "Alice",
  greet: function () {
    console.log(`Hello, I'm ${this.name}`);
  },

  greetAfterDelay: function () {
    // ❌ Context lost in setTimeout
    setTimeout(function () {
      console.log(`Delayed: Hello, I'm ${this.name}`); // 'this' is undefined/window
    }, 1000);
  },

  greetAfterDelayFixed: function () {
    // ✅ Solution 1: Arrow function
    setTimeout(() => {
      console.log(`Fixed: Hello, I'm ${this.name}`);
    }, 1000);
  },

  greetAfterDelayBound: function () {
    // ✅ Solution 2: bind()
    setTimeout(
      function () {
        console.log(`Bound: Hello, I'm ${this.name}`);
      }.bind(this),
      1000
    );
  }
};

user.greet(); // Works fine
user.greetAfterDelayFixed(); // Works fine
user.greetAfterDelayBound(); // Works fine
```

## 🔄 Object Iteration and Transformation

### Iterating Over Objects

```javascript
const inventory = {
  laptops: 15,
  phones: 23,
  tablets: 8,
  accessories: 45
};

// for...in loop
for (const item in inventory) {
  console.log(`${item}: ${inventory[item]}`);
}

// Object.entries() with for...of
for (const [item, quantity] of Object.entries(inventory)) {
  console.log(`${item}: ${quantity}`);
}

// Object.keys() with forEach
Object.keys(inventory).forEach((item) => {
  console.log(`${item}: ${inventory[item]}`);
});
```

### Object Transformation Patterns

```javascript
const products = {
  laptop: { price: 999, category: "electronics" },
  book: { price: 29, category: "education" },
  phone: { price: 599, category: "electronics" },
  pen: { price: 5, category: "education" }
};

// Transform object values
const discountedProducts = Object.fromEntries(
  Object.entries(products).map(([name, details]) => [
    name,
    { ...details, price: details.price * 0.9 } // 10% discount
  ])
);

// Filter object properties
const electronicsOnly = Object.fromEntries(
  Object.entries(products).filter(
    ([name, details]) => details.category === "electronics"
  )
);

// Reduce object to single value
const totalValue = Object.values(products).reduce(
  (total, product) => total + product.price,
  0
);

console.log(discountedProducts);
console.log(electronicsOnly);
console.log(totalValue); // 1632
```

## 🧩 Destructuring Objects

### Basic Destructuring

```javascript
const person = {
  name: "Alice",
  age: 30,
  email: "alice@email.com",
  address: {
    street: "123 Main St",
    city: "Boston",
    zipCode: "02101"
  }
};

// Basic destructuring
const { name, age, email } = person;
console.log(name); // "Alice"

// Renaming variables
const { name: fullName, age: yearsOld } = person;
console.log(fullName); // "Alice"

// Default values
const { name, phone = "Not provided" } = person;
console.log(phone); // "Not provided"

// Nested destructuring
const {
  address: { city, zipCode }
} = person;
console.log(city); // "Boston"

// Rest operator
const { name: personName, ...otherInfo } = person;
console.log(otherInfo); // { age: 30, email: "alice@email.com", address: {...} }
```

### Function Parameter Destructuring

```javascript
// Instead of this:
function createUser(userInfo) {
  const name = userInfo.name;
  const email = userInfo.email;
  const age = userInfo.age;
  // ... use name, email, age
}

// Do this:
function createUserBetter({ name, email, age = 18 }) {
  console.log(`Creating user: ${name}, ${email}, ${age}`);
  return { name, email, age, id: Date.now() };
}

// Usage
const newUser = createUserBetter({
  name: "Bob",
  email: "bob@email.com"
  // age will default to 18
});

// With nested destructuring
function processOrder({ user: { name, email }, items, total }) {
  console.log(`Processing order for ${name} (${email})`);
  console.log(`Items: ${items.length}, Total: $${total}`);
}

processOrder({
  user: { name: "Alice", email: "alice@email.com" },
  items: ["laptop", "mouse"],
  total: 1024
});
```

## 🎯 Real-World Object Patterns

### Data Management System

```javascript
const UserManager = {
  users: new Map(), // Using Map for better performance with frequent additions/deletions

  createUser(userData) {
    const { name, email, age } = userData;
    const user = {
      id: Date.now() + Math.random(), // Simple ID generation
      name,
      email,
      age,
      createdAt: new Date(),
      isActive: true,
      profile: {
        bio: "",
        avatar: null,
        preferences: {
          theme: "light",
          notifications: true
        }
      }
    };

    this.users.set(user.id, user);
    return user;
  },

  updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) return null;

    // Deep merge updates
    const updatedUser = {
      ...user,
      ...updates,
      profile: {
        ...user.profile,
        ...(updates.profile || {})
      }
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  },

  findUser(predicate) {
    for (const user of this.users.values()) {
      if (predicate(user)) return user;
    }
    return null;
  },

  getAllUsers() {
    return Array.from(this.users.values());
  },

  deleteUser(id) {
    return this.users.delete(id);
  },

  // Statistics
  getStats() {
    const allUsers = this.getAllUsers();
    return {
      total: allUsers.length,
      active: allUsers.filter((u) => u.isActive).length,
      averageAge: allUsers.reduce((sum, u) => sum + u.age, 0) / allUsers.length,
      recentUsers: allUsers.filter(
        (u) => Date.now() - u.createdAt.getTime() < 7 * 24 * 60 * 60 * 1000 // Last 7 days
      ).length
    };
  }
};

// Usage
const alice = UserManager.createUser({
  name: "Alice",
  email: "alice@email.com",
  age: 30
});

UserManager.updateUser(alice.id, {
  profile: {
    bio: "Software developer",
    preferences: { theme: "dark" }
  }
});

console.log(UserManager.getStats());
```

### Configuration System

```javascript
const ConfigManager = {
  _config: {},
  _defaults: {
    theme: "light",
    language: "en",
    debug: false,
    api: {
      baseUrl: "https://api.example.com",
      timeout: 5000,
      retries: 3
    }
  },

  init(userConfig = {}) {
    this._config = this._deepMerge(this._defaults, userConfig);
    return this;
  },

  get(path) {
    return this._getNestedValue(this._config, path);
  },

  set(path, value) {
    this._setNestedValue(this._config, path, value);
    return this;
  },

  reset() {
    this._config = { ...this._defaults };
    return this;
  },

  export() {
    return JSON.parse(JSON.stringify(this._config));
  },

  // Helper methods
  _deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key])
      ) {
        result[key] = this._deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }

    return result;
  },

  _getNestedValue(obj, path) {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  },

  _setNestedValue(obj, path, value) {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!(key in current)) current[key] = {};
      return current[key];
    }, obj);
    target[lastKey] = value;
  }
};

// Usage
ConfigManager.init({
  theme: "dark",
  api: {
    baseUrl: "https://my-api.com"
  }
});

console.log(ConfigManager.get("theme")); // "dark"
console.log(ConfigManager.get("api.timeout")); // 5000 (from defaults)
ConfigManager.set("debug", true);
console.log(ConfigManager.export());
```

## 🚨 Common Object Pitfalls

### Reference vs Value

```javascript
const original = { name: "Alice", age: 30 };
const reference = original; // Same object reference
const shallowCopy = { ...original }; // New object, but shallow copy

reference.name = "Bob";
console.log(original.name); // "Bob" - original was modified!

shallowCopy.age = 25;
console.log(original.age); // 30 - original unchanged

// Nested object issues with shallow copy
const person = {
  name: "Charlie",
  address: { city: "Boston", zip: "02101" }
};

const copy = { ...person };
copy.address.city = "New York";
console.log(person.address.city); // "New York" - nested object shared!

// Deep copy solution
const deepCopy = JSON.parse(JSON.stringify(person)); // Simple but limited
// Or use a library like Lodash's cloneDeep
```

### Property Enumeration

```javascript
const obj = {
  own: "own property",
  inherited: "will be inherited"
};

// Add inherited property
Object.setPrototypeOf(obj, { inherited: "inherited property" });

// Different iteration methods
console.log(Object.keys(obj)); // ["own"] - own enumerable only
console.log(Object.getOwnPropertyNames(obj)); // ["own"] - own properties only

for (const key in obj) {
  console.log(key); // "own", "inherited" - includes inherited enumerable

  if (obj.hasOwnProperty(key)) {
    console.log(`Own property: ${key}`);
  }
}
```

## 🏃‍♂️ Quick Practice Exercises

### Exercise 1: Object Utilities

```javascript
// Create utility functions for object manipulation

function deepClone(obj) {
  // Create a deep copy of an object (handle nested objects, arrays)
  // Your code here
}

function objectDiff(obj1, obj2) {
  // Return an object showing differences between two objects
  // Your code here
}

function flattenObject(obj, prefix = "") {
  // Flatten nested object: { a: { b: 1 } } -> { "a.b": 1 }
  // Your code here
}

function pickProperties(obj, keys) {
  // Create new object with only specified properties
  // Your code here
}

// Test your functions
const test1 = { a: 1, b: { c: 2, d: [3, 4] } };
const test2 = { a: 1, b: { c: 3, d: [3, 4] } };

console.log(deepClone(test1));
console.log(objectDiff(test1, test2));
console.log(flattenObject(test1));
console.log(pickProperties(test1, ["a", "b.c"]));
```

### Exercise 2: Data Modeling

```javascript
// Model a library system with books, authors, and borrowers

const Library = {
  books: [],
  authors: [],
  borrowers: [],

  // TODO: Implement these methods
  addBook(bookData) {
    // Add a book with author relationship
  },

  addAuthor(authorData) {
    // Add an author
  },

  registerBorrower(borrowerData) {
    // Register a new borrower
  },

  borrowBook(borrowerId, bookId) {
    // Handle book borrowing
  },

  returnBook(borrowerId, bookId) {
    // Handle book return
  },

  searchBooks(criteria) {
    // Search books by title, author, genre, etc.
  },

  getBooksByAuthor(authorId) {
    // Get all books by specific author
  },

  getBorrowerHistory(borrowerId) {
    // Get borrowing history for a borrower
  },

  getOverdueBooks() {
    // Get books that are overdue
  }
};

// Test the library system
```

## 🔗 Next Steps

After mastering objects:

- Combine arrays and objects in complex data structures
- Learn about classes and prototypes
- Practice with comprehensive exercises
- Build projects using object-oriented patterns

## 📚 Additional Resources

- [MDN: Objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [MDN: Working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects)
- [JavaScript.info: Objects](https://javascript.info/object)
