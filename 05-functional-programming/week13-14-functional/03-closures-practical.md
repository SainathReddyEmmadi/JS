# Closures - Practical Applications

Closures are one of the most powerful and fundamental concepts in JavaScript. They enable data privacy, state persistence, and elegant functional programming patterns. This module focuses on practical applications of closures in real-world scenarios.

## 🎯 Learning Objectives

- Understand how closures work in JavaScript
- Master lexical scope and closure creation
- Apply closures for data privacy and encapsulation
- Build practical utilities using closures
- Implement the module pattern with closures
- Avoid common closure pitfalls

## 📚 Understanding Closures

### What is a Closure?

A closure is created when a function is defined inside another function and has access to the outer function's variables, even after the outer function has finished executing.

```javascript
// Basic closure example
function outerFunction(x) {
  // Outer function's variable
  const outerVariable = x;

  // Inner function that forms a closure
  function innerFunction(y) {
    // Access to outer function's variable
    return outerVariable + y;
  }

  return innerFunction;
}

const addTen = outerFunction(10);
console.log(addTen(5)); // 15

// The outer function has finished executing,
// but innerFunction still has access to outerVariable!
```

### Lexical Scope

Closures are based on lexical scope - functions have access to variables in their outer scope at the time they were defined.

```javascript
const globalVar = "I'm global";

function outerFunction() {
  const outerVar = "I'm in outer function";

  function middleFunction() {
    const middleVar = "I'm in middle function";

    function innerFunction() {
      const innerVar = "I'm in inner function";

      // Has access to all outer scopes
      console.log(globalVar); // "I'm global"
      console.log(outerVar); // "I'm in outer function"
      console.log(middleVar); // "I'm in middle function"
      console.log(innerVar); // "I'm in inner function"
    }

    return innerFunction;
  }

  return middleFunction;
}

const inner = outerFunction()();
inner(); // Prints all variables
```

## 🛠️ Practical Closure Applications

### 1. Data Privacy and Encapsulation

```javascript
// Private variables using closures
function createCounter() {
  let count = 0; // Private variable

  return {
    increment() {
      count++;
      return count;
    },

    decrement() {
      count--;
      return count;
    },

    getCount() {
      return count;
    },

    // Private method example
    reset: (() => {
      const resetValue = 0;
      return function () {
        count = resetValue;
        return count;
      };
    })()
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2

// Cannot access count directly
console.log(counter.count); // undefined

// Cannot modify count directly
counter.count = 100;
console.log(counter.getCount()); // Still 2
```

### 2. Function Factories

```javascript
// Creating specialized functions
function createValidator(rules) {
  return function (data) {
    const errors = [];

    // The rules are "remembered" in the closure
    for (const [field, rule] of Object.entries(rules)) {
      const value = data[field];

      if (rule.required && (!value || value.trim() === "")) {
        errors.push(`${field} is required`);
      }

      if (value && rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }

      if (value && rule.minLength && value.length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };
}

// Create specialized validators
const userValidator = createValidator({
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    required: true,
    minLength: 8
  }
});

const productValidator = createValidator({
  name: { required: true, minLength: 3 },
  price: { required: true }
});

// Usage
console.log(
  userValidator({
    email: "test@example.com",
    password: "password123"
  })
); // { isValid: true, errors: [] }

console.log(
  productValidator({
    name: "AB"
  })
); // { isValid: false, errors: [...] }
```

### 3. Configuration and Settings

```javascript
// Configuration closure
function createApiClient(config) {
  const { baseUrl, apiKey, timeout = 5000 } = config;

  // Private helper functions
  function buildUrl(endpoint) {
    return `${baseUrl}${endpoint}`;
  }

  function buildHeaders(customHeaders = {}) {
    return {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...customHeaders
    };
  }

  // Public API
  return {
    get(endpoint, headers) {
      return fetch(buildUrl(endpoint), {
        method: "GET",
        headers: buildHeaders(headers),
        signal: AbortSignal.timeout(timeout)
      });
    },

    post(endpoint, data, headers) {
      return fetch(buildUrl(endpoint), {
        method: "POST",
        headers: buildHeaders(headers),
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(timeout)
      });
    },

    // Method to update configuration
    updateConfig(newConfig) {
      Object.assign(config, newConfig);
    },

    getConfig() {
      // Return a copy to prevent external modification
      return { ...config };
    }
  };
}

const apiClient = createApiClient({
  baseUrl: "https://api.example.com",
  apiKey: "your-api-key",
  timeout: 10000
});

apiClient.get("/users");
apiClient.post("/users", { name: "John" });
```

### 4. Event Handling and Callbacks

```javascript
// Event system with closures
function createEventSystem() {
  const listeners = new Map(); // Private event storage

  function addEventListener(event, callback, options = {}) {
    if (!listeners.has(event)) {
      listeners.set(event, []);
    }

    const listenerInfo = {
      callback,
      once: options.once || false,
      priority: options.priority || 0
    };

    listeners.get(event).push(listenerInfo);

    // Sort by priority (higher priority first)
    listeners.get(event).sort((a, b) => b.priority - a.priority);

    // Return cleanup function (closure over listenerInfo)
    return function removeListener() {
      const eventListeners = listeners.get(event);
      if (eventListeners) {
        const index = eventListeners.indexOf(listenerInfo);
        if (index > -1) {
          eventListeners.splice(index, 1);
        }
      }
    };
  }

  function emit(event, data) {
    const eventListeners = listeners.get(event);
    if (!eventListeners) return;

    // Process listeners (some might be removed during iteration)
    const listenersToCall = [...eventListeners];

    listenersToCall.forEach((listenerInfo) => {
      try {
        listenerInfo.callback(data);

        // Remove if it's a once listener
        if (listenerInfo.once) {
          const index = eventListeners.indexOf(listenerInfo);
          if (index > -1) {
            eventListeners.splice(index, 1);
          }
        }
      } catch (error) {
        console.error("Event listener error:", error);
      }
    });
  }

  return { on: addEventListener, emit };
}

// Usage
const events = createEventSystem();

const cleanup1 = events.on(
  "user-login",
  (user) => {
    console.log(`${user.name} logged in`);
  },
  { priority: 1 }
);

const cleanup2 = events.on(
  "user-login",
  (user) => {
    console.log(`Welcome, ${user.name}!`);
  },
  { once: true, priority: 2 }
);

events.emit("user-login", { name: "Alice" });
// Output: "Welcome, Alice!" (priority 2, once)
//         "Alice logged in" (priority 1)

events.emit("user-login", { name: "Bob" });
// Output: "Bob logged in" (once listener was removed)

// Cleanup
cleanup1();
cleanup2(); // Already removed, but safe to call
```

## 🧩 Advanced Closure Patterns

### Module Pattern

```javascript
// Revealing module pattern
const UserModule = (function () {
  // Private variables and functions
  let users = [];
  let nextId = 1;

  function validateUser(user) {
    return user.name && user.email && user.age > 0;
  }

  function findUserIndex(id) {
    return users.findIndex((user) => user.id === id);
  }

  function notifyChange(action, user) {
    console.log(`User ${action}:`, user);
  }

  // Public API
  return {
    addUser(name, email, age) {
      const user = { id: nextId++, name, email, age };

      if (!validateUser(user)) {
        throw new Error("Invalid user data");
      }

      users.push(user);
      notifyChange("added", user);
      return user;
    },

    removeUser(id) {
      const index = findUserIndex(id);
      if (index === -1) {
        throw new Error("User not found");
      }

      const user = users.splice(index, 1)[0];
      notifyChange("removed", user);
      return user;
    },

    getUser(id) {
      const index = findUserIndex(id);
      return index !== -1 ? { ...users[index] } : null;
    },

    getAllUsers() {
      return users.map((user) => ({ ...user })); // Return copies
    },

    getUserCount: () => users.length,

    // Factory method that creates specialized functions
    createUserFilter(criteria) {
      return function () {
        return users.filter((user) => {
          return Object.entries(criteria).every(([key, value]) => {
            return user[key] === value;
          });
        });
      };
    }
  };
})();

// Usage
UserModule.addUser("Alice", "alice@example.com", 25);
UserModule.addUser("Bob", "bob@example.com", 30);

const adultFilter = UserModule.createUserFilter({ age: 25 });
console.log(adultFilter()); // Users aged 25
```

### Memoization with Closures

```javascript
// Advanced memoization
function createMemoizer(hasher) {
  return function (fn) {
    const cache = new Map();

    return function (...args) {
      const key = hasher ? hasher(...args) : JSON.stringify(args);

      if (cache.has(key)) {
        console.log(`Cache hit for ${key}`);
        return cache.get(key);
      }

      console.log(`Computing for ${key}`);
      const result = fn.apply(this, args);
      cache.set(key, result);
      return result;
    };
  };
}

// Different hashers for different use cases
const jsonMemoizer = createMemoizer();
const stringMemoizer = createMemoizer((...args) => args.join("-"));

// Expensive function
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFib = jsonMemoizer(fibonacci);

console.log(memoizedFib(10)); // Computes
console.log(memoizedFib(10)); // Cache hit
```

### State Machines with Closures

```javascript
// Simple state machine
function createStateMachine(initialState, transitions) {
  let currentState = initialState;
  const listeners = [];

  function notifyListeners(oldState, newState, action) {
    listeners.forEach((listener) => {
      try {
        listener(oldState, newState, action);
      } catch (error) {
        console.error("State listener error:", error);
      }
    });
  }

  return {
    getCurrentState() {
      return currentState;
    },

    transition(action) {
      const stateTransitions = transitions[currentState];

      if (!stateTransitions || !stateTransitions[action]) {
        throw new Error(`Invalid transition: ${action} from ${currentState}`);
      }

      const oldState = currentState;
      currentState = stateTransitions[action];
      notifyListeners(oldState, currentState, action);

      return currentState;
    },

    canTransition(action) {
      const stateTransitions = transitions[currentState];
      return stateTransitions && stateTransitions[action] !== undefined;
    },

    onStateChange(listener) {
      listeners.push(listener);

      // Return cleanup function
      return function () {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    }
  };
}

// Usage: Traffic light state machine
const trafficLight = createStateMachine("red", {
  red: { next: "green" },
  green: { next: "yellow" },
  yellow: { next: "red" }
});

const cleanup = trafficLight.onStateChange((oldState, newState, action) => {
  console.log(`Traffic light: ${oldState} -> ${newState} (${action})`);
});

trafficLight.transition("next"); // red -> green
trafficLight.transition("next"); // green -> yellow
trafficLight.transition("next"); // yellow -> red
```

## 🧪 Practice Exercises

### Exercise 1: Shopping Cart

```javascript
// Create a shopping cart using closures
function createShoppingCart() {
  // Private state
  let items = [];
  let taxRate = 0.08;

  // Your implementation here
  return {
    addItem(product, quantity) {
      // Add item to cart
    },

    removeItem(productId) {
      // Remove item from cart
    },

    updateQuantity(productId, quantity) {
      // Update item quantity
    },

    getItems() {
      // Return copy of items
    },

    getSubtotal() {
      // Calculate subtotal
    },

    getTax() {
      // Calculate tax
    },

    getTotal() {
      // Calculate total with tax
    },

    setTaxRate(rate) {
      // Update tax rate
    },

    clear() {
      // Empty the cart
    }
  };
}

// Test your implementation
const cart = createShoppingCart();
cart.addItem({ id: 1, name: "Laptop", price: 999.99 }, 1);
cart.addItem({ id: 2, name: "Mouse", price: 29.99 }, 2);
console.log(cart.getTotal());
```

### Exercise 2: Rate Limiter

```javascript
// Create a rate limiter using closures
function createRateLimiter(maxRequests, timeWindow) {
  // Track requests per identifier

  return function (identifier) {
    // Return whether the request should be allowed
    // and how long to wait if not
  };
}

// Usage
const limiter = createRateLimiter(5, 60000); // 5 requests per minute

console.log(limiter("user1")); // { allowed: true, waitTime: 0 }
// ... make 4 more requests ...
console.log(limiter("user1")); // { allowed: false, waitTime: 45000 }
```

### Exercise 3: Cache with TTL

```javascript
// Create a cache with time-to-live using closures
function createCacheWithTTL(defaultTTL = 60000) {
  // Private cache storage

  return {
    set(key, value, ttl) {
      // Store value with expiration
    },

    get(key) {
      // Retrieve value if not expired
    },

    has(key) {
      // Check if key exists and is not expired
    },

    delete(key) {
      // Remove key
    },

    clear() {
      // Clear all keys
    },

    size() {
      // Return number of valid (non-expired) keys
    }
  };
}
```

## 🔍 Common Closure Pitfalls

### 1. Loop Closure Problem

```javascript
// ❌ Common mistake
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // Prints 3, 3, 3
  }, 100);
}

// ✅ Solutions

// Solution 1: Use let instead of var
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // Prints 0, 1, 2
  }, 100);
}

// Solution 2: Use IIFE
for (var i = 0; i < 3; i++) {
  (function (index) {
    setTimeout(() => {
      console.log(index); // Prints 0, 1, 2
    }, 100);
  })(i);
}

// Solution 3: Use bind
for (var i = 0; i < 3; i++) {
  setTimeout(
    function (index) {
      console.log(index); // Prints 0, 1, 2
    }.bind(null, i),
    100
  );
}
```

### 2. Memory Leaks

```javascript
// ❌ Potential memory leak
function createHandler() {
  const largeData = new Array(1000000).fill("data");

  return function () {
    // If largeData is not used here, it still can't be garbage collected
    console.log("Handler called");
  };
}

// ✅ Better approach
function createHandler() {
  const largeData = new Array(1000000).fill("data");
  const needed = largeData.slice(0, 10); // Only keep what's needed

  return function () {
    console.log("Handler called", needed[0]);
    // largeData can now be garbage collected
  };
}
```

## 🔗 What's Next?

With closures mastered, you're ready to explore:

- **Pure Functions and Immutability** - Writing predictable code
- **Functional Array Methods** - Advanced data processing
- **Function Composition** - Building complex operations

Closures are fundamental to JavaScript and enable many advanced patterns. They're essential for creating clean, encapsulated, and maintainable code!

## 📝 Summary

Key takeaways:

- ✅ Closures give functions access to outer scope variables
- ✅ They enable data privacy and encapsulation
- ✅ Closures are perfect for creating specialized functions
- ✅ The module pattern uses closures for information hiding
- ✅ Watch out for common pitfalls like loop closures and memory leaks
- ✅ Closures are essential for functional programming patterns
