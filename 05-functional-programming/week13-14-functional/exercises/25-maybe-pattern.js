// Exercise 25: Maybe Pattern
// Difficulty: 🔴 Advanced
// Topic: Implementing and using the Maybe pattern for safe null handling

console.log("=== Exercise 25: Maybe Pattern ===\n");

// TODO 1: Basic Maybe Implementation
// Implement a Maybe class with the core methods

class Maybe {
  constructor(value) {
    this.value = value;
  }

  // TODO: Implement static factory methods
  static of(value) {
    // Your code here
  }

  static nothing() {
    // Your code here
  }

  static some(value) {
    // Your code here
  }

  // TODO: Implement instance methods
  isNothing() {
    // Your code here
  }

  isSome() {
    // Your code here
  }

  map(fn) {
    // Your code here
  }

  flatMap(fn) {
    // Your code here
  }

  filter(predicate) {
    // Your code here
  }

  getOrElse(defaultValue) {
    // Your code here
  }

  orElse(alternativeMaybe) {
    // Your code here
  }
}

// TODO 2: Safe Property Access
// Create a function that safely accesses nested object properties using Maybe

function safeGet(obj, path) {
  // Your code here
  // Example: safeGet(user, 'address.street.name')
}

// TODO 3: Safe Array Operations
// Create safe versions of array operations that return Maybe

function safeHead(array) {
  // Your code here - return Maybe of first element
}

function safeTail(array) {
  // Your code here - return Maybe of array without first element
}

function safeNth(index, array) {
  // Your code here - return Maybe of element at index
}

// TODO 4: Safe Mathematical Operations
// Create safe versions of mathematical operations

function safeDivide(dividend, divisor) {
  // Your code here - return Maybe.nothing() for division by zero
}

function safeSqrt(number) {
  // Your code here - return Maybe.nothing() for negative numbers
}

function safeLog(number) {
  // Your code here - return Maybe.nothing() for non-positive numbers
}

// TODO 5: Safe Parsing Functions
// Create safe parsing functions that return Maybe

function safeParseInt(str) {
  // Your code here
}

function safeParseFloat(str) {
  // Your code here
}

function safeParseJson(jsonString) {
  // Your code here
}

// TODO 6: Maybe Chain Operations
// Create functions that work with Maybe chains

function processUser(userData) {
  // TODO: Create a processing pipeline that safely:
  // 1. Parses user data
  // 2. Validates required fields
  // 3. Formats the output
  // Return Maybe of processed user or nothing if any step fails
  // Your code here
}

// TODO 7: Maybe with Async Operations
// Create async-aware Maybe operations

class AsyncMaybe {
  constructor(promiseValue) {
    this.promiseValue = promiseValue;
  }

  static of(value) {
    // Your code here
  }

  static fromPromise(promise) {
    // Your code here
  }

  map(fn) {
    // Your code here
  }

  flatMap(fn) {
    // Your code here
  }

  filter(predicate) {
    // Your code here
  }

  getOrElse(defaultValue) {
    // Your code here
  }

  toPromise() {
    // Your code here
  }
}

// TODO 8: Real-World Application
// Create a user profile system using Maybe

function createUserProfileSystem() {
  // TODO: Implement a system that:
  // 1. Safely fetches user data
  // 2. Safely accesses nested properties
  // 3. Applies transformations safely
  // 4. Handles missing data gracefully

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      profile: {
        bio: "Software developer",
        social: { twitter: "@johndoe" }
      }
    },
    {
      id: 2,
      name: "Jane Smith",
      email: null,
      profile: { bio: null }
    },
    {
      id: 3,
      name: "Bob Johnson"
      // Missing profile
    }
  ];

  // Your implementation here

  return {
    findUser: (id) => {
      // Your code here
    },
    getUserEmail: (id) => {
      // Your code here
    },
    getUserBio: (id) => {
      // Your code here
    },
    getUserTwitter: (id) => {
      // Your code here
    },
    getFormattedProfile: (id) => {
      // Your code here
    }
  };
}

// ==================== TESTS ====================

function runTests() {
  console.log("Running tests...\n");

  try {
    // Test 1: Basic Maybe
    console.log("Test 1 - Basic Maybe:");
    const some5 = Maybe.of(5);
    const nothing = Maybe.nothing();

    console.log(some5.map((x) => x * 2).getOrElse(0)); // Expected: 10
    console.log(nothing.map((x) => x * 2).getOrElse(0)); // Expected: 0

    // Test 2: Safe Property Access
    console.log("\nTest 2 - Safe Property Access:");
    const user = {
      name: "John",
      address: {
        street: { name: "Main St", number: 123 }
      }
    };

    console.log(safeGet(user, "name").getOrElse("Unknown")); // Expected: 'John'
    console.log(safeGet(user, "address.street.name").getOrElse("Unknown")); // Expected: 'Main St'
    console.log(safeGet(user, "address.city").getOrElse("Unknown")); // Expected: 'Unknown'

    // Test 3: Safe Array Operations
    console.log("\nTest 3 - Safe Array Operations:");
    const numbers = [1, 2, 3, 4, 5];
    const emptyArray = [];

    console.log(safeHead(numbers).getOrElse(0)); // Expected: 1
    console.log(safeHead(emptyArray).getOrElse(0)); // Expected: 0
    console.log(safeNth(2, numbers).getOrElse(0)); // Expected: 3
    console.log(safeNth(10, numbers).getOrElse(0)); // Expected: 0

    // Test 4: Safe Math Operations
    console.log("\nTest 4 - Safe Math Operations:");
    console.log(safeDivide(10, 2).getOrElse(0)); // Expected: 5
    console.log(safeDivide(10, 0).getOrElse(0)); // Expected: 0
    console.log(safeSqrt(9).getOrElse(0)); // Expected: 3
    console.log(safeSqrt(-4).getOrElse(0)); // Expected: 0

    // Test 5: Safe Parsing
    console.log("\nTest 5 - Safe Parsing:");
    console.log(safeParseInt("123").getOrElse(0)); // Expected: 123
    console.log(safeParseInt("abc").getOrElse(0)); // Expected: 0
    console.log(
      safeParseJson('{"name": "John"}')
        .map((obj) => obj.name)
        .getOrElse("Unknown")
    ); // Expected: 'John'
    console.log(safeParseJson("invalid json").getOrElse({})); // Expected: {}

    // Test 6: Chain Operations
    console.log("\nTest 6 - Chain Operations:");
    const validUser = { name: "John", email: "john@example.com", age: "25" };
    const invalidUser = { name: "", email: "invalid" };

    console.log(
      processUser(validUser)
        .map((u) => u.name)
        .getOrElse("Invalid")
    );
    console.log(processUser(invalidUser).getOrElse("Invalid"));

    // Test 7: User Profile System
    console.log("\nTest 7 - User Profile System:");
    const profileSystem = createUserProfileSystem();

    console.log(profileSystem.getUserEmail(1).getOrElse("No email")); // Expected: john@example.com
    console.log(profileSystem.getUserEmail(2).getOrElse("No email")); // Expected: No email
    console.log(profileSystem.getUserBio(1).getOrElse("No bio")); // Expected: Software developer
    console.log(profileSystem.getUserTwitter(1).getOrElse("No twitter")); // Expected: @johndoe
    console.log(profileSystem.getUserTwitter(2).getOrElse("No twitter")); // Expected: No twitter

    console.log("\n✅ All tests completed!");
  } catch (error) {
    console.log("❌ Test failed:", error.message);
  }
}

// Uncomment the line below to run tests
// runTests();

// ==================== BONUS CHALLENGES ====================

// BONUS 1: Implement Maybe with TypeScript-style type safety (using JSDoc)
// Add comprehensive JSDoc types to your Maybe implementation

// BONUS 2: Create a Maybe monad that works with generators
// Implement Maybe operations that work with generator functions

// BONUS 3: Implement sequence and traverse operations
// sequence: [Maybe a] -> Maybe [a]
// traverse: (a -> Maybe b) -> [a] -> Maybe [b]

// BONUS 4: Create a Maybe-aware fetch wrapper
// Implement an HTTP client that returns Maybe for safe response handling

// ==================== PRACTICAL EXAMPLES ====================

// Example 1: Configuration management with Maybe
function createConfigManager() {
  // Implement a configuration system that safely handles missing values
}

// Example 2: Form validation with Maybe
function createFormValidator() {
  // Implement form validation that accumulates errors safely
}

// Example 3: Database query builder with Maybe
function createQueryBuilder() {
  // Implement a query builder that handles optional parameters safely
}

// ==================== LEARNING NOTES ====================
/*
Key Concepts to Remember:

1. Maybe Pattern Purpose:
   - Represents values that might be null/undefined
   - Eliminates null pointer exceptions
   - Makes null handling explicit and safe

2. Core Methods:
   - of/some: Wrap a value in Maybe
   - nothing: Represent absence of value
   - map: Transform value if present
   - flatMap: Chain Maybe-returning operations
   - filter: Keep value only if predicate passes
   - getOrElse: Extract value with fallback

3. Benefits:
   - Explicit null handling
   - Composable operations
   - Eliminates defensive null checks
   - Functional error handling

4. When to Use Maybe:
   - API responses that might be empty
   - Optional configuration values
   - Nullable database fields
   - User input validation
   - File system operations

5. Maybe vs Exceptions:
   - Maybe makes absence explicit
   - No try/catch blocks needed
   - Composable error handling
   - Type-safe operations

6. Common Patterns:
   - Chain operations safely
   - Provide default values
   - Transform optional data
   - Validate input safely

Best Practices:
- Use Maybe.of() for potentially null values
- Chain operations instead of nested null checks
- Provide meaningful default values
- Keep Maybe instances immutable
- Use flatMap for operations that return Maybe
*/
