# Pure Functions and Immutability

Pure functions and immutability are cornerstone concepts of functional programming. They lead to more predictable, testable, and maintainable code. This module explores how to write pure functions and work with immutable data in JavaScript.

## 🎯 Learning Objectives

- Understand what makes a function "pure"
- Learn to identify and avoid side effects
- Master immutable data manipulation techniques
- Apply functional principles for better code quality
- Implement immutable data structures
- Write testable and predictable functions

## 📚 Understanding Pure Functions

### What is a Pure Function?

A pure function is a function that:

1. **Always returns the same output for the same input** (deterministic)
2. **Has no side effects** (doesn't modify anything outside itself)

```javascript
// ✅ Pure function
function add(a, b) {
  return a + b;
}

console.log(add(2, 3)); // Always returns 5
console.log(add(2, 3)); // Always returns 5

// ✅ Pure function with complex logic
function calculateTotal(items, taxRate) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * taxRate;
  return subtotal + tax;
}

// ❌ Impure function (relies on external state)
let discountRate = 0.1;
function calculateDiscountedPrice(price) {
  return price * (1 - discountRate); // Depends on external variable
}

// ❌ Impure function (has side effects)
let totalSales = 0;
function addSale(amount) {
  totalSales += amount; // Modifies external state
  return totalSales;
}

// ❌ Impure function (non-deterministic)
function getCurrentTime() {
  return new Date(); // Returns different values
}
```

### Benefits of Pure Functions

```javascript
// 1. Easy to test
function multiply(a, b) {
  return a * b;
}

// Simple unit test
console.assert(multiply(3, 4) === 12);
console.assert(multiply(0, 100) === 0);

// 2. Easy to reason about
function formatName(firstName, lastName) {
  return `${lastName}, ${firstName}`;
}

// 3. Cacheable (memoization)
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const memoizedMultiply = memoize(multiply);

// 4. Parallelizable (no shared state conflicts)
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map((x) => x * x); // Each operation is independent
```

## 🔄 Understanding Side Effects

### Types of Side Effects

```javascript
// 1. Modifying global variables
let counter = 0;
function incrementCounter() {
  // Side effect: modifies global state
  counter++;
  return counter;
}

// 2. Modifying input parameters
function sortArray(arr) {
  // Side effect: modifies input
  return arr.sort();
}

// 3. I/O operations
function saveToFile(data) {
  // Side effect: file system operation
  localStorage.setItem("data", JSON.stringify(data));
  return data;
}

// 4. Network requests
function fetchUser(id) {
  // Side effect: network call
  return fetch(`/api/users/${id}`);
}

// 5. DOM manipulation
function updateDisplay(message) {
  // Side effect: DOM modification
  document.getElementById("message").textContent = message;
}

// 6. Console output
function debugLog(value) {
  // Side effect: console output
  console.log("Debug:", value);
  return value;
}
```

### Converting Impure to Pure Functions

```javascript
// ❌ Impure version
let tax = 0.08;
function calculatePrice(basePrice) {
  return basePrice * (1 + tax);
}

// ✅ Pure version
function calculatePrice(basePrice, taxRate) {
  return basePrice * (1 + taxRate);
}

// ❌ Impure version (modifies input)
function addProperty(obj, key, value) {
  obj[key] = value;
  return obj;
}

// ✅ Pure version (returns new object)
function addProperty(obj, key, value) {
  return { ...obj, [key]: value };
}

// ❌ Impure version (modifies array)
function removeItem(array, index) {
  array.splice(index, 1);
  return array;
}

// ✅ Pure version (returns new array)
function removeItem(array, index) {
  return array.filter((_, i) => i !== index);
}
```

## 🛡️ Immutability Principles

### Basic Immutable Operations

```javascript
// Strings are immutable by default
const str = "Hello";
const newStr = str + " World"; // Creates new string
console.log(str); // "Hello" (unchanged)
console.log(newStr); // "Hello World"

// Numbers are immutable by default
const num = 5;
const newNum = num + 3; // Creates new number
console.log(num); // 5 (unchanged)
console.log(newNum); // 8

// Arrays - creating new arrays instead of modifying
const originalArray = [1, 2, 3];

// ❌ Mutable operations
// originalArray.push(4);
// originalArray[0] = 0;

// ✅ Immutable operations
const withNewItem = [...originalArray, 4]; // [1, 2, 3, 4]
const withUpdatedItem = originalArray.map(
  (item, index) => (index === 0 ? 0 : item) // [0, 2, 3]
);
const withoutItem = originalArray.filter((item) => item !== 2); // [1, 3]

console.log(originalArray); // [1, 2, 3] (unchanged)
```

### Immutable Object Operations

```javascript
const originalUser = {
  id: 1,
  name: "John",
  email: "john@example.com",
  address: {
    street: "123 Main St",
    city: "Anytown"
  }
};

// ✅ Shallow copy operations
const updatedUser = {
  ...originalUser,
  name: "John Doe"
};

const userWithNewEmail = {
  ...originalUser,
  email: "johndoe@example.com"
};

// ✅ Deep copy for nested objects
const userWithNewAddress = {
  ...originalUser,
  address: {
    ...originalUser.address,
    street: "456 Oak Ave"
  }
};

// ✅ Using Object.assign
const userCopy = Object.assign({}, originalUser, { name: "Jane" });

// ✅ Adding new properties
const userWithPhone = {
  ...originalUser,
  phone: "555-1234"
};

// ✅ Removing properties
const { email, ...userWithoutEmail } = originalUser;

console.log(originalUser); // Unchanged
```

### Advanced Immutable Patterns

```javascript
// Immutable array updates
function updateArrayItem(array, index, newValue) {
  return array.map((item, i) => (i === index ? newValue : item));
}

function insertArrayItem(array, index, newValue) {
  return [...array.slice(0, index), newValue, ...array.slice(index)];
}

function replaceArrayItem(array, predicate, newValue) {
  return array.map((item) => (predicate(item) ? newValue : item));
}

// Immutable object updates
function updateObjectProperty(obj, path, value) {
  const keys = path.split(".");

  if (keys.length === 1) {
    return { ...obj, [keys[0]]: value };
  }

  const [firstKey, ...restKeys] = keys;
  return {
    ...obj,
    [firstKey]: updateObjectProperty(obj[firstKey], restKeys.join("."), value)
  };
}

// Usage examples
const users = [
  { id: 1, name: "John", active: true },
  { id: 2, name: "Jane", active: false },
  { id: 3, name: "Bob", active: true }
];

const updatedUsers = updateArrayItem(users, 1, { ...users[1], active: true });
const newUsersList = insertArrayItem(users, 1, {
  id: 4,
  name: "Alice",
  active: true
});

const config = {
  api: {
    baseUrl: "https://api.example.com",
    timeout: 5000
  },
  ui: {
    theme: "dark"
  }
};

const newConfig = updateObjectProperty(config, "api.timeout", 10000);
```

## 🛠️ Functional Data Transformation

### Pure Array Processing

```javascript
// Complex data processing with pure functions
const products = [
  {
    id: 1,
    name: "Laptop",
    price: 999.99,
    category: "Electronics",
    inStock: true
  },
  { id: 2, name: "Book", price: 19.99, category: "Education", inStock: true },
  {
    id: 3,
    name: "Phone",
    price: 699.99,
    category: "Electronics",
    inStock: false
  },
  { id: 4, name: "Desk", price: 299.99, category: "Furniture", inStock: true }
];

// Pure functions for data processing
const isInStock = (product) => product.inStock;
const isInCategory = (category) => (product) => product.category === category;
const isPriceRange = (min, max) => (product) =>
  product.price >= min && product.price <= max;

const addDiscount = (discount) => (product) => ({
  ...product,
  originalPrice: product.price,
  price: product.price * (1 - discount)
});

const formatForDisplay = (product) => ({
  id: product.id,
  title: product.name.toUpperCase(),
  displayPrice: `$${product.price.toFixed(2)}`,
  available: product.inStock ? "In Stock" : "Out of Stock"
});

// Chain operations for complex transformations
const discountedElectronics = products
  .filter(isInStock)
  .filter(isInCategory("Electronics"))
  .filter(isPriceRange(500, 1000))
  .map(addDiscount(0.1))
  .map(formatForDisplay);

console.log(discountedElectronics);
```

### Pure State Updates

```javascript
// State management with pure functions
const initialState = {
  user: null,
  products: [],
  cart: [],
  loading: false,
  error: null
};

// Pure reducers
function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        error: null
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        cart: [] // Clear cart on logout
      };

    default:
      return state;
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART":
      const existingItem = state.cart.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }

      return {
        ...state,
        cart: [...state.cart, { ...action.payload, quantity: 1 }]
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload.id)
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    default:
      return state;
  }
}

// Combine reducers
function appReducer(state = initialState, action) {
  return {
    ...userReducer(state, action),
    ...cartReducer(state, action)
  };
}
```

## 🧪 Practical Immutable Utilities

### Deep Clone Utility

```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }

  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

// Usage
const original = {
  name: "John",
  hobbies: ["reading", "coding"],
  address: { city: "New York", zip: "10001" }
};

const copy = deepClone(original);
copy.hobbies.push("gaming");
copy.address.city = "Boston";

console.log(original.hobbies); // ['reading', 'coding'] (unchanged)
console.log(original.address.city); // 'New York' (unchanged)
```

### Immutable Update Helpers

```javascript
// Generic immutable update utilities
const update = {
  // Set a property
  set: (obj, key, value) => ({ ...obj, [key]: value }),

  // Update nested property
  setIn: (obj, path, value) => {
    const [head, ...tail] = path;
    return tail.length === 0
      ? { ...obj, [head]: value }
      : { ...obj, [head]: update.setIn(obj[head] || {}, tail, value) };
  },

  // Merge objects
  merge: (obj, updates) => ({ ...obj, ...updates }),

  // Deep merge objects
  deepMerge: (obj, updates) => {
    const result = { ...obj };
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (typeof updates[key] === "object" && typeof obj[key] === "object") {
          result[key] = update.deepMerge(obj[key], updates[key]);
        } else {
          result[key] = updates[key];
        }
      }
    }
    return result;
  },

  // Remove property
  unset: (obj, key) => {
    const { [key]: removed, ...rest } = obj;
    return rest;
  },

  // Array operations
  push: (arr, ...items) => [...arr, ...items],
  pop: (arr) => arr.slice(0, -1),
  shift: (arr) => arr.slice(1),
  unshift: (arr, ...items) => [...items, ...arr],
  splice: (arr, start, deleteCount, ...items) => [
    ...arr.slice(0, start),
    ...items,
    ...arr.slice(start + deleteCount)
  ]
};

// Usage examples
const state = {
  user: { name: "John", age: 30 },
  items: [1, 2, 3],
  config: { theme: "dark", lang: "en" }
};

const newState1 = update.set(state, "loading", true);
const newState2 = update.setIn(state, ["user", "age"], 31);
const newState3 = update.merge(state, { loading: false, error: null });
const newState4 = update.push(state.items, 4, 5);
```

## 🧪 Practice Exercises

### Exercise 1: Pure Function Conversion

```javascript
// Convert these impure functions to pure functions

// 1. Impure function
let config = { theme: "light", lang: "en" };
function updateConfig(key, value) {
  config[key] = value;
  return config;
}

// TODO: Convert to pure function
function updateConfig(config, key, value) {
  // Your implementation here
}

// 2. Impure function
function processOrders(orders) {
  orders.forEach((order) => {
    order.processed = true;
    order.processedAt = new Date();
  });
  return orders;
}

// TODO: Convert to pure function
function processOrders(orders) {
  // Your implementation here
}
```

### Exercise 2: Immutable State Management

```javascript
// Create pure functions for managing a shopping list state
const initialShoppingList = {
  items: [
    { id: 1, name: "Milk", quantity: 1, completed: false },
    { id: 2, name: "Bread", quantity: 2, completed: true }
  ],
  filter: "all" // 'all', 'active', 'completed'
};

// TODO: Implement these pure functions
function addItem(state, item) {
  // Add new item to the list
}

function toggleItem(state, id) {
  // Toggle completion status of an item
}

function updateQuantity(state, id, quantity) {
  // Update item quantity
}

function removeItem(state, id) {
  // Remove item from list
}

function setFilter(state, filter) {
  // Change the filter
}

function getFilteredItems(state) {
  // Return items based on current filter
}
```

### Exercise 3: Immutable Data Transformation

```javascript
// Transform this data using pure functions
const salesData = [
  { date: "2023-01-01", product: "Laptop", amount: 999, region: "North" },
  { date: "2023-01-02", product: "Phone", amount: 699, region: "South" },
  { date: "2023-01-03", product: "Laptop", amount: 999, region: "North" },
  { date: "2023-01-04", product: "Tablet", amount: 499, region: "East" }
];

// TODO: Create pure functions to:
// 1. Calculate total sales by product
// 2. Calculate total sales by region
// 3. Get sales above a certain amount
// 4. Group sales by month
// 5. Calculate average sale amount
```

## 🔍 Self-Check Questions

1. **Pure Functions**: What are the two main requirements for a function to be considered pure?

2. **Side Effects**: List five types of side effects that make functions impure.

3. **Immutability**: Why is immutability important in functional programming?

4. **Testing**: Why are pure functions easier to test than impure functions?

5. **Performance**: What are the performance implications of immutability?

## 💡 Best Practices

### 1. Prefer Pure Functions

```javascript
// ❌ Impure - depends on external state
let basePrice = 100;
function calculatePrice(discount) {
  return basePrice * (1 - discount);
}

// ✅ Pure - all inputs are parameters
function calculatePrice(basePrice, discount) {
  return basePrice * (1 - discount);
}
```

### 2. Use Immutable Operations

```javascript
// ❌ Mutating operations
function sortUsers(users) {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}

// ✅ Immutable operations
function sortUsers(users) {
  return [...users].sort((a, b) => a.name.localeCompare(b.name));
}
```

### 3. Separate Pure and Impure Code

```javascript
// Pure business logic
function calculateTax(amount, rate) {
  return amount * rate;
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// Impure I/O operations
function saveToDatabase(data) {
  return fetch("/api/save", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

function displayResult(result) {
  document.getElementById("result").textContent = result;
}

// Combine in a controlled way
async function processPayment(amount, taxRate) {
  const tax = calculateTax(amount, taxRate); // Pure
  const total = amount + tax; // Pure
  const formatted = formatCurrency(total); // Pure

  await saveToDatabase({ amount, tax, total }); // Impure
  displayResult(formatted); // Impure
}
```

## 🔗 What's Next?

With pure functions and immutability mastered, you're ready to explore:

- **Functional Array Methods** - Advanced data processing techniques
- **Function Composition** - Building complex operations from simple functions
- **Functional Patterns** - Common FP design patterns

Pure functions and immutability form the foundation of functional programming, enabling you to write more reliable, testable, and maintainable code!

## 📝 Summary

Key takeaways:

- ✅ Pure functions are predictable and have no side effects
- ✅ Immutability prevents unintended data changes
- ✅ Pure functions are easier to test, debug, and reason about
- ✅ Immutable operations create new data rather than modifying existing data
- ✅ Functional programming leads to more maintainable code
- ✅ Separate pure business logic from impure I/O operations
