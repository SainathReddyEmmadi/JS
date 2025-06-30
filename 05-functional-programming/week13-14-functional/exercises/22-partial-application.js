/**
 * Exercise 22: Partial Application
 *
 * Practice partial application techniques - fixing some arguments of a function
 * to create more specialized functions.
 */

console.log("Starting Exercise 22: Partial Application");

// Basic partial application
console.log("\n=== Basic Partial Application ===");

// TODO: Manual partial application
function multiply(a, b, c) {
  return a * b * c;
}

// Create a function with the first argument fixed
function multiplyBy2(b, c) {
  return multiply(2, b, c);
}

// Create a function with first two arguments fixed
function multiplyBy2And3(c) {
  return multiply(2, 3, c);
}

console.log("Multiply 2 * 3 * 4:", multiply(2, 3, 4));
console.log("MultiplyBy2 (3, 4):", multiplyBy2(3, 4));
console.log("MultiplyBy2And3 (4):", multiplyBy2And3(4));

// Generic partial application function
console.log("\n=== Generic Partial Application ===");

// TODO: Create a partial application utility
function partial(fn, ...partialArgs) {
  return function (...remainingArgs) {
    return fn(...partialArgs, ...remainingArgs);
  };
}

// Test with different functions
const add = (a, b, c) => a + b + c;
const addTo10 = partial(add, 10);
const addTo10And5 = partial(add, 10, 5);

console.log("Add 1 + 2 + 3:", add(1, 2, 3));
console.log("AddTo10 (2, 3):", addTo10(2, 3)); // 10 + 2 + 3 = 15
console.log("AddTo10And5 (7):", addTo10And5(7)); // 10 + 5 + 7 = 22

// TODO: Partial from the right
function partialRight(fn, ...partialArgs) {
  return function (...remainingArgs) {
    return fn(...remainingArgs, ...partialArgs);
  };
}

const subtract = (a, b, c) => a - b - c;
const subtractFrom100 = partialRight(subtract, 10, 5); // x - 10 - 5

console.log("Subtract 100 - 10 - 5:", subtract(100, 10, 5));
console.log("SubtractFrom100 (50):", subtractFrom100(50)); // 50 - 10 - 5 = 35

// Advanced partial application with placeholders
console.log("\n=== Partial Application with Placeholders ===");

// TODO: Create partial with placeholder support
const _ = Symbol("placeholder");

function partialWithPlaceholders(fn, ...partialArgs) {
  return function (...remainingArgs) {
    const args = [];
    let remainingIndex = 0;

    for (const arg of partialArgs) {
      if (arg === _) {
        args.push(remainingArgs[remainingIndex++]);
      } else {
        args.push(arg);
      }
    }

    // Add any remaining arguments
    args.push(...remainingArgs.slice(remainingIndex));

    return fn(...args);
  };
}

const divide = (a, b, c) => a / b / c;
const divideByAndThen = partialWithPlaceholders(divide, _, 2, _); // x / 2 / y

console.log("Divide 20 / 2 / 5:", divide(20, 2, 5));
console.log("DivideByAndThen (20, 5):", divideByAndThen(20, 5)); // 20 / 2 / 5 = 2

// Practical examples
console.log("\n=== Practical Examples ===");

// TODO: Event handler partial application
function addEventListener(element, event, handler) {
  console.log(`Adding ${event} listener to ${element}`);
  return { element, event, handler };
}

const addClickListener = partial(addEventListener, "button", "click");
const addHoverListener = partial(addEventListener, _, "mouseover");

console.log(
  "Click listener:",
  addClickListener(() => console.log("clicked"))
);
console.log(
  "Hover listener:",
  addHoverListener("div", () => console.log("hovered"))
);

// TODO: API request partial application
function makeRequest(method, url, headers, body) {
  return {
    method,
    url,
    headers,
    body,
    timestamp: Date.now()
  };
}

const makeGetRequest = partial(makeRequest, "GET");
const makePostRequest = partial(makeRequest, "POST");
const makeApiRequest = partial(makeRequest, _, "https://api.example.com");

console.log("GET request:", makeGetRequest("/users", {}, null));
console.log(
  "POST request:",
  makePostRequest("/users", { "Content-Type": "application/json" }, "{}")
);
console.log("API request:", makeApiRequest("GET", {}, null));

// TODO: Validation partial application
function validate(rules, data) {
  const errors = [];

  rules.forEach((rule) => {
    if (!rule.test(data)) {
      errors.push(rule.message);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    data
  };
}

const emailRules = [
  {
    test: (data) => data.email && data.email.includes("@"),
    message: "Email must contain @"
  },
  {
    test: (data) => data.email && data.email.length > 5,
    message: "Email too short"
  }
];

const passwordRules = [
  {
    test: (data) => data.password && data.password.length >= 8,
    message: "Password must be 8+ chars"
  },
  {
    test: (data) => data.password && /[A-Z]/.test(data.password),
    message: "Password needs uppercase"
  }
];

const validateEmail = partial(validate, emailRules);
const validatePassword = partial(validate, passwordRules);

console.log("Email validation:", validateEmail({ email: "user@example.com" }));
console.log(
  "Password validation:",
  validatePassword({ password: "Password123" })
);

// Partial application with objects
console.log("\n=== Object Method Partial Application ===");

// TODO: Partial application for object methods
function partialMethod(obj, methodName, ...partialArgs) {
  return function (...remainingArgs) {
    return obj[methodName](...partialArgs, ...remainingArgs);
  };
}

const calculator = {
  add(a, b, c = 0) {
    return a + b + c;
  },

  multiply(a, b, c = 1) {
    return a * b * c;
  }
};

const addTo5 = partialMethod(calculator, "add", 5);
const multiplyBy10 = partialMethod(calculator, "multiply", 10);

console.log("Add to 5 (3, 2):", addTo5(3, 2)); // 5 + 3 + 2 = 10
console.log("Multiply by 10 (2, 3):", multiplyBy10(2, 3)); // 10 * 2 * 3 = 60

// Partial application in array processing
console.log("\n=== Array Processing with Partial Application ===");

// TODO: Create specialized array processors
function filterBy(predicate, array) {
  return array.filter(predicate);
}

function mapWith(transformer, array) {
  return array.map(transformer);
}

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const filterEven = partial(filterBy, (x) => x % 2 === 0);
const filterGreaterThan5 = partial(filterBy, (x) => x > 5);
const mapDouble = partial(mapWith, (x) => x * 2);
const mapSquare = partial(mapWith, (x) => x * x);

console.log("Original numbers:", numbers);
console.log("Filter even:", filterEven(numbers));
console.log("Filter > 5:", filterGreaterThan5(numbers));
console.log("Map double:", mapDouble(numbers));
console.log("Map square:", mapSquare(numbers));

// TODO: Combining partial application with function composition
function pipe(...functions) {
  return function (value) {
    return functions.reduce((acc, fn) => fn(acc), value);
  };
}

const processNumbers = pipe(
  filterEven,
  mapSquare,
  partial(filterBy, (x) => x > 10)
);

console.log("Processed numbers:", processNumbers(numbers));

// Partial application for configuration
console.log("\n=== Configuration with Partial Application ===");

// TODO: Create configurable functions
function createLogger(level, timestamp, prefix, message) {
  const time = timestamp ? new Date().toISOString() : "";
  const levelPrefix = `[${level.toUpperCase()}]`;
  const prefixText = prefix ? `[${prefix}]` : "";

  return `${time} ${levelPrefix} ${prefixText} ${message}`.trim();
}

const createInfoLogger = partial(createLogger, "info", true);
const createErrorLogger = partial(createLogger, "error", true);
const createDebugLogger = partial(createLogger, "debug", false, "DEBUG");

console.log("Info log:", createInfoLogger("", "Application started"));
console.log(
  "Error log:",
  createErrorLogger("ERROR", "Database connection failed")
);
console.log("Debug log:", createDebugLogger("User logged in"));

// TODO: Database query partial application
function buildQuery(table, columns, where, orderBy, limit) {
  let query = `SELECT ${columns.join(", ")} FROM ${table}`;

  if (where) {
    query += ` WHERE ${where}`;
  }

  if (orderBy) {
    query += ` ORDER BY ${orderBy}`;
  }

  if (limit) {
    query += ` LIMIT ${limit}`;
  }

  return query;
}

const selectFromUsers = partial(buildQuery, "users");
const selectUserNames = partial(buildQuery, "users", ["name", "email"]);
const selectActiveUsers = partial(buildQuery, "users", ["*"], "active = true");

console.log(
  "Select from users:",
  selectFromUsers(["*"], null, "created_at DESC", 10)
);
console.log("Select user names:", selectUserNames(null, "name ASC", null));
console.log("Select active users:", selectActiveUsers(null, null, null));

// Performance considerations
console.log("\n=== Performance Considerations ===");

// TODO: Demonstrate partial application overhead
function heavyFunction(a, b, c, d, e) {
  // Simulate heavy computation
  let result = 0;
  for (let i = 0; i < 1000; i++) {
    result += a * b * c * d * e + i;
  }
  return result;
}

const partialHeavy = partial(heavyFunction, 1, 2);

console.time("Direct call");
for (let i = 0; i < 1000; i++) {
  heavyFunction(1, 2, 3, 4, 5);
}
console.timeEnd("Direct call");

console.time("Partial application");
for (let i = 0; i < 1000; i++) {
  partialHeavy(3, 4, 5);
}
console.timeEnd("Partial application");

// Instructions:
// 1. Understand partial application vs currying differences
// 2. Create generic partial application utilities
// 3. Use placeholders for flexible argument positioning
// 4. Apply partial application to real-world scenarios
// 5. Combine partial application with function composition
// 6. Use partial application for configuration and specialization
// 7. Consider performance implications for frequently called functions
// 8. Practice partial application with object methods and array processing
