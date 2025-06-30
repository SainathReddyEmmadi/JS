/**
 * Exercise 26: Either Pattern
 *
 * Implement and use the Either pattern for functional error handling,
 * representing values that can be either successful (Right) or failed (Left).
 */

console.log("Starting Exercise 26: Either Pattern");

// Basic Either implementation
console.log("\n=== Basic Either Implementation ===");

// TODO: Implement Either abstract class
class Either {
  constructor(value) {
    this.value = value;
  }

  static left(value) {
    return new Left(value);
  }

  static right(value) {
    return new Right(value);
  }

  static of(value) {
    return Either.right(value);
  }

  // Abstract methods to be implemented by subclasses
  map(fn) {
    throw new Error("map must be implemented by subclass");
  }

  flatMap(fn) {
    throw new Error("flatMap must be implemented by subclass");
  }

  isLeft() {
    throw new Error("isLeft must be implemented by subclass");
  }

  isRight() {
    throw new Error("isRight must be implemented by subclass");
  }
}

// TODO: Implement Left (error case)
class Left extends Either {
  map(fn) {
    return this; // Don't apply function to error case
  }

  flatMap(fn) {
    return this; // Don't apply function to error case
  }

  fold(leftFn, rightFn) {
    return leftFn(this.value);
  }

  getOrElse(defaultValue) {
    return defaultValue;
  }

  orElse(fn) {
    return fn(this.value);
  }

  isLeft() {
    return true;
  }

  isRight() {
    return false;
  }

  toString() {
    return `Left(${this.value})`;
  }
}

// TODO: Implement Right (success case)
class Right extends Either {
  map(fn) {
    try {
      return Either.right(fn(this.value));
    } catch (error) {
      return Either.left(error);
    }
  }

  flatMap(fn) {
    try {
      return fn(this.value);
    } catch (error) {
      return Either.left(error);
    }
  }

  fold(leftFn, rightFn) {
    return rightFn(this.value);
  }

  getOrElse(defaultValue) {
    return this.value;
  }

  orElse(fn) {
    return this;
  }

  isLeft() {
    return false;
  }

  isRight() {
    return true;
  }

  toString() {
    return `Right(${this.value})`;
  }
}

// Basic usage examples
console.log("Right(5):", Either.right(5).toString());
console.log('Left("error"):', Either.left("error").toString());

// Map operations
const rightValue = Either.right(5);
const leftValue = Either.left("error");

console.log("Right map (*2):", rightValue.map((x) => x * 2).toString());
console.log("Left map (*2):", leftValue.map((x) => x * 2).toString());

// Practical examples
console.log("\n=== Practical Either Examples ===");

// TODO: Safe division function
function safeDivide(a, b) {
  if (b === 0) {
    return Either.left("Division by zero");
  }
  return Either.right(a / b);
}

// TODO: Safe parsing function
function safeParseInt(str) {
  const parsed = parseInt(str, 10);
  if (isNaN(parsed)) {
    return Either.left(`Cannot parse "${str}" as integer`);
  }
  return Either.right(parsed);
}

// TODO: Safe JSON parsing
function safeJsonParse(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return Either.right(parsed);
  } catch (error) {
    return Either.left(`JSON parse error: ${error.message}`);
  }
}

console.log("Safe divide 10/2:", safeDivide(10, 2).toString());
console.log("Safe divide 10/0:", safeDivide(10, 0).toString());
console.log('Safe parse "123":', safeParseInt("123").toString());
console.log('Safe parse "abc":', safeParseInt("abc").toString());
console.log("Safe JSON parse:", safeJsonParse('{"name": "Alice"}').toString());
console.log(
  "Safe JSON parse invalid:",
  safeJsonParse("invalid json").toString()
);

// Chaining operations with flatMap
console.log("\n=== Chaining Operations ===");

// TODO: Chain multiple operations that can fail
function processNumber(str) {
  return safeParseInt(str)
    .flatMap((num) =>
      num > 0 ? Either.right(num) : Either.left("Number must be positive")
    )
    .flatMap((num) => safeDivide(100, num))
    .map((result) => Math.round(result * 100) / 100); // Round to 2 decimal places
}

console.log('Process "10":', processNumber("10").toString());
console.log('Process "0":', processNumber("0").toString());
console.log('Process "abc":', processNumber("abc").toString());

// TODO: User validation example
function validateUser(userData) {
  const validateName = (user) => {
    if (!user.name || user.name.trim().length === 0) {
      return Either.left("Name is required");
    }
    return Either.right(user);
  };

  const validateEmail = (user) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      return Either.left("Invalid email format");
    }
    return Either.right(user);
  };

  const validateAge = (user) => {
    if (user.age < 0 || user.age > 150) {
      return Either.left("Age must be between 0 and 150");
    }
    return Either.right(user);
  };

  return Either.right(userData)
    .flatMap(validateName)
    .flatMap(validateEmail)
    .flatMap(validateAge);
}

const validUser = { name: "Alice", email: "alice@example.com", age: 30 };
const invalidUser = { name: "", email: "invalid-email", age: -5 };

console.log("Valid user:", validateUser(validUser).toString());
console.log("Invalid user:", validateUser(invalidUser).toString());

// Working with collections
console.log("\n=== Either with Collections ===");

// TODO: Transform array of Eithers
function sequence(eithers) {
  const rights = [];

  for (const either of eithers) {
    if (either.isLeft()) {
      return either; // Return first error
    }
    rights.push(either.value);
  }

  return Either.right(rights);
}

// TODO: Apply function to array, collecting errors or successes
function traverse(array, fn) {
  const results = array.map(fn);
  return sequence(results);
}

const numbers = ["1", "2", "3", "4"];
const mixedNumbers = ["1", "abc", "3", "def"];

console.log("Parse all valid:", traverse(numbers, safeParseInt).toString());
console.log(
  "Parse with invalid:",
  traverse(mixedNumbers, safeParseInt).toString()
);

// Advanced: Either utilities
console.log("\n=== Either Utilities ===");

// TODO: Combine multiple Eithers
function combine(eithers) {
  const results = [];
  const errors = [];

  eithers.forEach((either) => {
    if (either.isLeft()) {
      errors.push(either.value);
    } else {
      results.push(either.value);
    }
  });

  if (errors.length > 0) {
    return Either.left(errors);
  }

  return Either.right(results);
}

// TODO: Apply function with multiple Either arguments
function lift2(fn) {
  return (either1, either2) => {
    if (either1.isLeft()) return either1;
    if (either2.isLeft()) return either2;

    try {
      return Either.right(fn(either1.value, either2.value));
    } catch (error) {
      return Either.left(error);
    }
  };
}

const add = (a, b) => a + b;
const liftedAdd = lift2(add);

console.log(
  "Combine valid Eithers:",
  combine([Either.right(1), Either.right(2), Either.right(3)]).toString()
);
console.log(
  "Combine with errors:",
  combine([
    Either.right(1),
    Either.left("error1"),
    Either.left("error2")
  ]).toString()
);
console.log(
  "Lifted add (Right + Right):",
  liftedAdd(Either.right(5), Either.right(3)).toString()
);
console.log(
  "Lifted add (Right + Left):",
  liftedAdd(Either.right(5), Either.left("error")).toString()
);

// Real-world example: API call simulation
console.log("\n=== API Call Simulation ===");

// TODO: Simulate API calls that can fail
function fetchUser(id) {
  if (id <= 0) {
    return Either.left("Invalid user ID");
  }

  // Simulate random failure
  if (Math.random() < 0.3) {
    return Either.left("Network error");
  }

  return Either.right({
    id,
    name: `User ${id}`,
    email: `user${id}@example.com`
  });
}

function fetchUserPosts(userId) {
  if (Math.random() < 0.2) {
    return Either.left("Posts service unavailable");
  }

  return Either.right([
    { id: 1, title: "First Post", userId },
    { id: 2, title: "Second Post", userId }
  ]);
}

// TODO: Chain API calls
function getUserWithPosts(userId) {
  return fetchUser(userId).flatMap((user) =>
    fetchUserPosts(user.id).map((posts) => ({ user, posts }))
  );
}

console.log("Fetch user with posts:");
for (let i = 0; i < 3; i++) {
  const result = getUserWithPosts(1);
  console.log(`  Attempt ${i + 1}:`, result.toString());
}

// Error recovery patterns
console.log("\n=== Error Recovery Patterns ===");

// TODO: Provide default values
function getConfigValue(key) {
  const config = { timeout: 5000, retries: 3 };

  if (key in config) {
    return Either.right(config[key]);
  }

  return Either.left(`Config key "${key}" not found`);
}

const timeoutValue = getConfigValue("timeout").getOrElse(1000); // Default value

const invalidValue = getConfigValue("invalid").getOrElse("default");

console.log("Timeout value:", timeoutValue);
console.log("Invalid value with default:", invalidValue);

// TODO: Try alternative operations
function tryPrimary() {
  return Either.left("Primary failed");
}

function trySecondary() {
  return Either.right("Secondary succeeded");
}

const result = tryPrimary().orElse(() => trySecondary());

console.log("Try with fallback:", result.toString());

// Pattern matching with fold
console.log("\n=== Pattern Matching with Fold ===");

// TODO: Handle both cases explicitly
function handleResult(either) {
  return either.fold(
    (error) => `Error occurred: ${error}`,
    (value) => `Success: ${value}`
  );
}

console.log("Handle success:", handleResult(Either.right("Great!")));
console.log("Handle error:", handleResult(Either.left("Something went wrong")));

// TODO: Complex pattern matching
function processApiResponse(either) {
  return either.fold(
    (error) => ({
      success: false,
      error: error,
      data: null,
      timestamp: new Date().toISOString()
    }),
    (data) => ({
      success: true,
      error: null,
      data: data,
      timestamp: new Date().toISOString()
    })
  );
}

const apiSuccess = Either.right({ users: [{ id: 1, name: "Alice" }] });
const apiError = Either.left("Database connection failed");

console.log("API success response:", processApiResponse(apiSuccess));
console.log("API error response:", processApiResponse(apiError));

// Instructions:
// 1. Use Either for operations that can fail instead of throwing exceptions
// 2. Chain operations with flatMap to stop on first error
// 3. Transform successful values with map
// 4. Handle both success and error cases with fold
// 5. Provide defaults with getOrElse
// 6. Try alternative operations with orElse
// 7. Work with collections of Eithers using sequence and traverse
// 8. Use Either for validation pipelines and API calls
