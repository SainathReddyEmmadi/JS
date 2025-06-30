/**
 * Exercise 09: Closure Basics
 *
 * Understand closure mechanics, lexical scoping, and how inner functions
 * maintain access to outer function variables.
 */

console.log("Starting Exercise 09: Closure Basics");

// Basic closure example
console.log("\n=== Basic Closure Examples ===");

// TODO: Create a simple closure
function outerFunction(x) {
  // This variable is in the outer function's scope
  const outerVariable = x;

  // Inner function has access to outer function's variables
  function innerFunction(y) {
    return outerVariable + y;
  }

  return innerFunction;
}

const addFive = outerFunction(5);
console.log("Add 5 to 3:", addFive(3)); // 8

const addTen = outerFunction(10);
console.log("Add 10 to 7:", addTen(7)); // 17

// Each closure maintains its own copy of the outer variables
console.log("Add 5 to 10:", addFive(10)); // 15 (still uses 5, not 10)

// Counter closure
console.log("\n=== Counter Closure ===");

// TODO: Create a counter using closure
function createCounter(initialValue = 0) {
  let count = initialValue;

  return function () {
    return ++count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter(100);

console.log("Counter1:", counter1()); // 1
console.log("Counter1:", counter1()); // 2
console.log("Counter2:", counter2()); // 101
console.log("Counter1:", counter1()); // 3
console.log("Counter2:", counter2()); // 102

// Advanced counter with multiple methods
function createAdvancedCounter(initialValue = 0) {
  let count = initialValue;

  return {
    increment() {
      return ++count;
    },

    decrement() {
      return --count;
    },

    value() {
      return count;
    },

    reset() {
      count = initialValue;
      return count;
    }
  };
}

const advancedCounter = createAdvancedCounter(5);
console.log("Advanced counter increment:", advancedCounter.increment()); // 6
console.log("Advanced counter decrement:", advancedCounter.decrement()); // 5
console.log("Advanced counter value:", advancedCounter.value()); // 5
console.log("Advanced counter reset:", advancedCounter.reset()); // 5

// Variable privacy with closures
console.log("\n=== Variable Privacy ===");

// TODO: Create a bank account with private balance
function createBankAccount(initialBalance) {
  let balance = initialBalance;
  const transactions = [];

  function addTransaction(type, amount) {
    transactions.push({
      type,
      amount,
      timestamp: new Date(),
      balance: balance
    });
  }

  return {
    deposit(amount) {
      if (amount > 0) {
        balance += amount;
        addTransaction("deposit", amount);
        return balance;
      }
      throw new Error("Deposit amount must be positive");
    },

    withdraw(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        addTransaction("withdrawal", amount);
        return balance;
      }
      throw new Error("Invalid withdrawal amount");
    },

    getBalance() {
      return balance;
    },

    getTransactions() {
      return [...transactions]; // Return copy to prevent external modification
    }
  };
}

const account = createBankAccount(1000);
console.log("Initial balance:", account.getBalance());
console.log("After deposit $500:", account.deposit(500));
console.log("After withdrawal $200:", account.withdraw(200));
console.log("Final balance:", account.getBalance());
console.log("Transactions:", account.getTransactions().length);

// Closure with parameters
console.log("\n=== Closure with Parameters ===");

// TODO: Create a function that remembers configuration
function createFormatter(prefix, suffix) {
  return function (text) {
    return `${prefix}${text}${suffix}`;
  };
}

const htmlFormatter = createFormatter("<strong>", "</strong>");
const bracketsFormatter = createFormatter("[", "]");
const quotesFormatter = createFormatter('"', '"');

console.log("HTML format:", htmlFormatter("Hello World"));
console.log("Brackets format:", bracketsFormatter("Important"));
console.log("Quotes format:", quotesFormatter("JavaScript"));

// TODO: Create a multiplier factory
function createMultiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const half = createMultiplier(0.5);

console.log("Double 6:", double(6));
console.log("Triple 4:", triple(4));
console.log("Half of 10:", half(10));

// Closure in loops (common gotcha)
console.log("\n=== Closure in Loops ===");

// TODO: Demonstrate the closure loop problem
console.log("Problematic loop with var:");
const functions1 = [];
for (var i = 0; i < 3; i++) {
  functions1.push(function () {
    return i; // All functions will return 3 (final value of i)
  });
}

functions1.forEach((fn, index) => {
  console.log(`Function ${index} returns:`, fn());
});

// TODO: Fix with closure
console.log("Fixed with closure:");
const functions2 = [];
for (var i = 0; i < 3; i++) {
  functions2.push(
    (function (index) {
      return function () {
        return index; // Each function captures its own index
      };
    })(i)
  );
}

functions2.forEach((fn, index) => {
  console.log(`Function ${index} returns:`, fn());
});

// TODO: Modern solution with let
console.log("Modern solution with let:");
const functions3 = [];
for (let i = 0; i < 3; i++) {
  functions3.push(function () {
    return i; // let creates block scope
  });
}

functions3.forEach((fn, index) => {
  console.log(`Function ${index} returns:`, fn());
});

// Closure for event handling simulation
console.log("\n=== Event Handler Simulation ===");

// TODO: Create event handlers with closure
function createEventHandler(elementName) {
  let clickCount = 0;

  return function (eventType) {
    if (eventType === "click") {
      clickCount++;
      console.log(`${elementName} clicked ${clickCount} time(s)`);
    }
  };
}

const buttonHandler = createEventHandler("Button");
const linkHandler = createEventHandler("Link");

// Simulate events
buttonHandler("click");
buttonHandler("click");
linkHandler("click");
buttonHandler("click");

// Closure for configuration
console.log("\n=== Configuration Closure ===");

// TODO: Create a configurable function
function createApiClient(baseUrl, apiKey) {
  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`
  };

  return {
    get(endpoint) {
      console.log(`GET ${baseUrl}${endpoint}`);
      console.log("Headers:", defaultHeaders);
      return Promise.resolve({ data: "mock data" });
    },

    post(endpoint, data) {
      console.log(`POST ${baseUrl}${endpoint}`);
      console.log("Headers:", defaultHeaders);
      console.log("Data:", data);
      return Promise.resolve({ success: true });
    },

    updateApiKey(newKey) {
      defaultHeaders.Authorization = `Bearer ${newKey}`;
    }
  };
}

const apiClient = createApiClient("https://api.example.com", "secret-key-123");
apiClient.get("/users");
apiClient.post("/users", { name: "John Doe" });

// Closure for memoization
console.log("\n=== Memoization with Closure ===");

// TODO: Create a memoized function using closure
function createMemoizedFunction(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`Cache hit for ${key}`);
      return cache.get(key);
    }

    console.log(`Computing result for ${key}`);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Expensive function
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFibonacci = createMemoizedFunction(fibonacci);

console.log("Fibonacci 10:", memoizedFibonacci(10));
console.log("Fibonacci 10 again:", memoizedFibonacci(10)); // Should use cache

// Closure for state management
console.log("\n=== State Management with Closure ===");

// TODO: Create a simple state manager
function createState(initialState) {
  let state = { ...initialState };
  const listeners = [];

  return {
    get(key) {
      return key ? state[key] : { ...state };
    },

    set(key, value) {
      const oldValue = state[key];
      state[key] = value;

      // Notify listeners
      listeners.forEach((listener) => {
        listener(key, value, oldValue);
      });
    },

    update(updates) {
      Object.keys(updates).forEach((key) => {
        this.set(key, updates[key]);
      });
    },

    subscribe(listener) {
      listeners.push(listener);

      // Return unsubscribe function
      return function () {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      };
    }
  };
}

const state = createState({ count: 0, name: "App" });

// Subscribe to changes
const unsubscribe = state.subscribe((key, newValue, oldValue) => {
  console.log(`State change: ${key} changed from ${oldValue} to ${newValue}`);
});

state.set("count", 1);
state.set("name", "My App");
state.update({ count: 5, version: "1.0" });

// Practical example: Rate limiter
console.log("\n=== Rate Limiter with Closure ===");

// TODO: Create a rate limiter
function createRateLimiter(maxCalls, timeWindow) {
  const calls = [];

  return function (fn, ...args) {
    const now = Date.now();

    // Remove old calls outside the time window
    while (calls.length > 0 && calls[0] < now - timeWindow) {
      calls.shift();
    }

    if (calls.length >= maxCalls) {
      console.log("Rate limit exceeded");
      return null;
    }

    calls.push(now);
    return fn.apply(this, args);
  };
}

const rateLimitedLog = createRateLimiter(3, 5000); // 3 calls per 5 seconds

function logMessage(message) {
  console.log(`Message: ${message}`);
}

// Test rate limiter
rateLimitedLog(logMessage, "First call");
rateLimitedLog(logMessage, "Second call");
rateLimitedLog(logMessage, "Third call");
rateLimitedLog(logMessage, "Fourth call - should be blocked");

// Instructions:
// 1. Understand how closures maintain access to outer scope variables
// 2. Practice creating private variables using closures
// 3. Use closures for configuration and state management
// 4. Understand the closure loop problem and solutions
// 5. Build event handlers and memoization with closures
// 6. Create factory functions that return specialized functions
// 7. Use closures for rate limiting and access control
