/**
 * Exercise 03: IIFE (Immediately Invoked Function Expression) Patterns
 *
 * Practice creating and using IIFEs for various purposes like module creation,
 * variable isolation, and initialization patterns.
 */

console.log("Starting Exercise 03: IIFE Patterns");

// Basic IIFE syntax
console.log("\n=== Basic IIFE Examples ===");

// TODO: Create a basic IIFE that executes immediately
(function () {
  console.log("This IIFE executes immediately!");
})();

// TODO: IIFE with parameters
(function (name, age) {
  console.log(`Hello, ${name}! You are ${age} years old.`);
})("Alice", 30);

// TODO: IIFE that returns a value
const result = (function (a, b) {
  return a + b;
})(5, 3);

console.log("IIFE result:", result);

// Module pattern with IIFE
console.log("\n=== Module Pattern with IIFE ===");

// TODO: Create a module using IIFE
const Calculator = (function () {
  // Private variables
  let history = [];

  // Private functions
  function log(operation, result) {
    history.push({ operation, result, timestamp: new Date() });
  }

  // Public API
  return {
    add(a, b) {
      const result = a + b;
      log(`${a} + ${b}`, result);
      return result;
    },

    subtract(a, b) {
      const result = a - b;
      log(`${a} - ${b}`, result);
      return result;
    },

    multiply(a, b) {
      const result = a * b;
      log(`${a} * ${b}`, result);
      return result;
    },

    getHistory() {
      return [...history]; // Return copy to maintain privacy
    },

    clearHistory() {
      history = [];
    }
  };
})();

// TODO: Test the calculator module
console.log("Add 5 + 3 =", Calculator.add(5, 3));
console.log("Multiply 4 * 6 =", Calculator.multiply(4, 6));
console.log("Calculator history:", Calculator.getHistory());

// Configuration pattern with IIFE
console.log("\n=== Configuration Pattern ===");

// TODO: Create a configuration module
const AppConfig = (function () {
  const config = {
    apiUrl: "https://api.example.com",
    timeout: 5000,
    retries: 3,
    debug: false
  };

  return {
    get(key) {
      return config[key];
    },

    set(key, value) {
      if (config.hasOwnProperty(key)) {
        config[key] = value;
      } else {
        throw new Error(`Unknown config key: ${key}`);
      }
    },

    getAll() {
      return { ...config };
    }
  };
})();

// TODO: Test configuration
console.log("API URL:", AppConfig.get("apiUrl"));
AppConfig.set("debug", true);
console.log("Debug mode:", AppConfig.get("debug"));
console.log("All config:", AppConfig.getAll());

// Counter with closure using IIFE
console.log("\n=== Counter Pattern ===");

// TODO: Create multiple independent counters
const counter1 = (function () {
  let count = 0;

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
      count = 0;
      return count;
    }
  };
})();

const counter2 = (function () {
  let count = 10;

  return {
    increment() {
      return ++count;
    },

    decrement() {
      return --count;
    },

    value() {
      return count;
    }
  };
})();

// TODO: Test independent counters
console.log("Counter1 increment:", counter1.increment());
console.log("Counter1 increment:", counter1.increment());
console.log("Counter2 increment:", counter2.increment());
console.log("Counter1 value:", counter1.value());
console.log("Counter2 value:", counter2.value());

// Namespace pattern with IIFE
console.log("\n=== Namespace Pattern ===");

// TODO: Create a namespace for utility functions
const MyUtils = (function () {
  // String utilities
  const StringUtils = {
    capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    reverse(str) {
      return str.split("").reverse().join("");
    },

    truncate(str, length) {
      return str.length > length ? str.slice(0, length) + "..." : str;
    }
  };

  // Array utilities
  const ArrayUtils = {
    unique(arr) {
      return [...new Set(arr)];
    },

    chunk(arr, size) {
      const chunks = [];
      for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
      }
      return chunks;
    },

    shuffle(arr) {
      const shuffled = [...arr];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
  };

  // Public API
  return {
    String: StringUtils,
    Array: ArrayUtils,

    // Additional utility
    randomId() {
      return Math.random().toString(36).substr(2, 9);
    }
  };
})();

// TODO: Test namespace utilities
console.log("Capitalize:", MyUtils.String.capitalize("hello WORLD"));
console.log("Reverse:", MyUtils.String.reverse("hello"));
console.log("Unique array:", MyUtils.Array.unique([1, 2, 2, 3, 3, 4]));
console.log("Chunk array:", MyUtils.Array.chunk([1, 2, 3, 4, 5, 6], 2));
console.log("Random ID:", MyUtils.randomId());

// Initialization pattern with IIFE
console.log("\n=== Initialization Pattern ===");

// TODO: Create an initialization IIFE
const App = (function () {
  let initialized = false;
  let startTime;

  function init() {
    if (initialized) {
      console.log("App already initialized");
      return;
    }

    startTime = Date.now();
    console.log("App initializing...");

    // Simulate initialization tasks
    console.log("- Loading configuration");
    console.log("- Setting up event listeners");
    console.log("- Connecting to services");

    initialized = true;
    console.log("App initialized successfully");
  }

  function getUptime() {
    return initialized ? Date.now() - startTime : 0;
  }

  // Auto-initialize
  init();

  return {
    isInitialized() {
      return initialized;
    },

    getUptime,

    restart() {
      initialized = false;
      init();
    }
  };
})();

// TODO: Test initialization
console.log("App initialized:", App.isInitialized());
setTimeout(() => {
  console.log("App uptime:", App.getUptime(), "ms");
}, 100);

// Advanced: Factory pattern with IIFE
console.log("\n=== Factory Pattern with IIFE ===");

// TODO: Create a factory for creating objects
const PersonFactory = (function () {
  let idCounter = 0;

  function Person(name, age) {
    this.id = ++idCounter;
    this.name = name;
    this.age = age;
    this.createdAt = new Date();
  }

  Person.prototype.greet = function () {
    return `Hello, I'm ${this.name} and I'm ${this.age} years old.`;
  };

  Person.prototype.getAge = function () {
    return this.age;
  };

  return {
    create(name, age) {
      return new Person(name, age);
    },

    getCount() {
      return idCounter;
    }
  };
})();

// TODO: Test factory
const person1 = PersonFactory.create("Alice", 30);
const person2 = PersonFactory.create("Bob", 25);

console.log("Person 1:", person1.greet());
console.log("Person 2:", person2.greet());
console.log("Total persons created:", PersonFactory.getCount());

// Error handling with IIFE
console.log("\n=== Error Handling Pattern ===");

// TODO: Create error-safe operations
const SafeOperations = (function () {
  function safeExecute(operation, errorHandler) {
    try {
      return operation();
    } catch (error) {
      return errorHandler ? errorHandler(error) : null;
    }
  }

  return {
    safeDivide(a, b) {
      return safeExecute(
        () => {
          if (b === 0) throw new Error("Division by zero");
          return a / b;
        },
        (error) => {
          console.log("Math error:", error.message);
          return NaN;
        }
      );
    },

    safeJsonParse(jsonString) {
      return safeExecute(
        () => JSON.parse(jsonString),
        (error) => {
          console.log("JSON parse error:", error.message);
          return null;
        }
      );
    }
  };
})();

// TODO: Test error handling
console.log("Safe divide 10/2:", SafeOperations.safeDivide(10, 2));
console.log("Safe divide 10/0:", SafeOperations.safeDivide(10, 0));
console.log(
  "Safe JSON parse:",
  SafeOperations.safeJsonParse('{"valid": true}')
);
console.log(
  "Safe JSON parse invalid:",
  SafeOperations.safeJsonParse("invalid json")
);

// Instructions:
// 1. Understand how IIFEs provide variable isolation
// 2. Practice the module pattern for encapsulation
// 3. Create configuration and namespace patterns
// 4. Use IIFEs for initialization and setup code
// 5. Build factory patterns with private state
// 6. Implement error-safe operations
// 7. Compare IIFE patterns with modern module syntax
