/**
 * Exercise 7-3: BigInt, Optional Chaining, and Modern Features
 *
 * Practice BigInt for large numbers, optional chaining, nullish coalescing, and other modern features.
 */

console.log(
  "Starting Exercise 7-3: BigInt, Optional Chaining, and Modern Features"
);

// BigInt basics
console.log("\n=== BigInt Basics ===");

// TODO: Create BigInt values
const regularNumber = 9007199254740991; // Number.MAX_SAFE_INTEGER
const bigIntNumber = 9007199254740991n;
const bigIntFromConstructor = BigInt("123456789012345678901234567890");

console.log("Regular number:", regularNumber);
console.log("BigInt number:", bigIntNumber);
console.log("BigInt from constructor:", bigIntFromConstructor);

// TODO: BigInt arithmetic
const bigInt1 = 123456789012345678901234567890n;
const bigInt2 = 987654321098765432109876543210n;

console.log("Addition:", bigInt1 + bigInt2);
console.log("Multiplication:", bigInt1 * bigInt2);
console.log("Division:", bigInt2 / bigInt1); // Note: BigInt division truncates

// Type checking
console.log("typeof bigInt1:", typeof bigInt1);
console.log("bigInt1 instanceof BigInt:", bigInt1 instanceof BigInt); // false
console.log("Is BigInt:", typeof bigInt1 === "bigint");

// TODO: BigInt conversion functions
function safeBigIntOperation(a, b, operation) {
  try {
    const bigA = typeof a === "bigint" ? a : BigInt(a);
    const bigB = typeof b === "bigint" ? b : BigInt(b);

    switch (operation) {
      case "add":
        return bigA + bigB;
      case "subtract":
        return bigA - bigB;
      case "multiply":
        return bigA * bigB;
      case "divide":
        return bigA / bigB;
      default:
        throw new Error("Unknown operation");
    }
  } catch (error) {
    console.error("BigInt operation error:", error.message);
    return null;
  }
}

console.log("\n=== Safe BigInt Operations ===");
console.log("Safe add:", safeBigIntOperation("123", "456", "add"));
console.log("Safe multiply:", safeBigIntOperation(999n, 888n, "multiply"));

// Optional Chaining (?.)
console.log("\n=== Optional Chaining ===");

const user = {
  id: 1,
  name: "Alice",
  profile: {
    email: "alice@example.com",
    settings: {
      theme: "dark",
      notifications: {
        email: true,
        push: false
      }
    }
  },
  posts: [
    { id: 1, title: "First Post" },
    { id: 2, title: "Second Post" }
  ]
};

const incompleteUser = {
  id: 2,
  name: "Bob"
  // No profile property
};

// TODO: Use optional chaining to safely access nested properties
console.log("User email:", user.profile?.email);
console.log("User theme:", user.profile?.settings?.theme);
console.log(
  "Email notifications:",
  user.profile?.settings?.notifications?.email
);

console.log("Incomplete user email:", incompleteUser.profile?.email); // undefined
console.log("Incomplete user theme:", incompleteUser.profile?.settings?.theme); // undefined

// Optional chaining with arrays
console.log("First post title:", user.posts?.[0]?.title);
console.log("Third post title:", user.posts?.[2]?.title); // undefined

// Optional chaining with methods
const api = {
  getData() {
    return { status: "success", data: [1, 2, 3] };
  }
};

const brokenApi = null;

// TODO: Use optional chaining with method calls
console.log("API result:", api.getData?.());
console.log("Broken API result:", brokenApi?.getData?.()); // undefined

// Nullish Coalescing (??)
console.log("\n=== Nullish Coalescing ===");

// TODO: Practice nullish coalescing vs logical OR
const config = {
  apiUrl: "",
  timeout: 0,
  retries: null,
  debug: false
};

// Using || (logical OR) - problematic with falsy values
console.log("API URL with ||:", config.apiUrl || "default-url"); // 'default-url'
console.log("Timeout with ||:", config.timeout || 5000); // 5000
console.log("Debug with ||:", config.debug || true); // true

// Using ?? (nullish coalescing) - only null/undefined trigger default
console.log("API URL with ??:", config.apiUrl ?? "default-url"); // ''
console.log("Timeout with ??:", config.timeout ?? 5000); // 0
console.log("Debug with ??:", config.debug ?? true); // false
console.log("Retries with ??:", config.retries ?? 3); // 3

// TODO: Create a configuration merger function
function mergeConfig(userConfig, defaultConfig) {
  return {
    apiUrl: userConfig.apiUrl ?? defaultConfig.apiUrl,
    timeout: userConfig.timeout ?? defaultConfig.timeout,
    retries: userConfig.retries ?? defaultConfig.retries,
    debug: userConfig.debug ?? defaultConfig.debug
  };
}

const defaultConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
  debug: false
};

const userConfig = {
  timeout: 0, // User wants 0 timeout
  debug: false // User explicitly wants debug off
};

const mergedConfig = mergeConfig(userConfig, defaultConfig);
console.log("Merged config:", mergedConfig);

// Logical Assignment Operators
console.log("\n=== Logical Assignment Operators ===");

let data = {
  count: 0,
  items: null,
  status: undefined
};

// TODO: Use logical assignment operators
data.count ||= 10; // Only assign if falsy (count is 0, so this assigns)
data.items ??= []; // Only assign if nullish
data.status ??= "pending"; // Only assign if nullish

console.log("Data after logical assignment:", data);

// AND assignment
let settings = {
  enabled: true,
  features: { notifications: true }
};

settings.enabled &&= settings.features.notifications; // Only assign if both are truthy
console.log("Settings after AND assignment:", settings);

// Numeric separators
console.log("\n=== Numeric Separators ===");

// TODO: Use numeric separators for readability
const million = 1_000_000;
const billion = 1_000_000_000;
const binaryNumber = 0b1010_0001;
const hexNumber = 0xff_ec_de_5e;
const bigIntWithSeparators = 123_456_789_012_345_678_901_234_567_890n;

console.log("Million:", million);
console.log("Billion:", billion);
console.log("Binary:", binaryNumber);
console.log("Hex:", hexNumber);
console.log("BigInt with separators:", bigIntWithSeparators);

// Private fields and methods (if supported)
console.log("\n=== Private Fields (if supported) ===");

class BankAccount {
  // TODO: Private fields
  #balance = 0;
  #accountNumber;

  constructor(initialBalance, accountNumber) {
    this.#balance = initialBalance;
    this.#accountNumber = accountNumber;
  }

  // TODO: Private method
  #validateAmount(amount) {
    return typeof amount === "number" && amount > 0;
  }

  // Public methods
  deposit(amount) {
    if (this.#validateAmount(amount)) {
      this.#balance += amount;
      return this.#balance;
    }
    throw new Error("Invalid amount");
  }

  withdraw(amount) {
    if (this.#validateAmount(amount) && amount <= this.#balance) {
      this.#balance -= amount;
      return this.#balance;
    }
    throw new Error("Invalid amount or insufficient funds");
  }

  getBalance() {
    return this.#balance;
  }

  getAccountInfo() {
    return {
      accountNumber: this.#accountNumber,
      balance: this.#balance
    };
  }
}

try {
  const account = new BankAccount(1000, "ACC123");
  console.log("Initial balance:", account.getBalance());

  account.deposit(500);
  console.log("After deposit:", account.getBalance());

  account.withdraw(200);
  console.log("After withdrawal:", account.getBalance());

  console.log("Account info:", account.getAccountInfo());

  // TODO: Try to access private fields (should fail)
  // console.log('Direct access to balance:', account.#balance); // SyntaxError
} catch (error) {
  console.error("Account error:", error.message);
}

// String.prototype.replaceAll()
console.log("\n=== String replaceAll ===");

const text = "Hello world, world is beautiful, world peace";

// TODO: Use replaceAll vs replace
console.log("Using replace:", text.replace("world", "universe"));
console.log("Using replaceAll:", text.replaceAll("world", "universe"));

// TODO: replaceAll with regex
const htmlText = "<p>Hello</p><p>World</p>";
console.log("Remove all p tags:", htmlText.replaceAll(/<\/?p>/g, ""));

// Advanced example: Data validator with modern features
class DataValidator {
  #rules = new Map();

  addRule(field, validator) {
    this.#rules.set(field, validator);
    return this;
  }

  validate(data) {
    const errors = [];

    for (const [field, validator] of this.#rules) {
      const value = data?.[field];
      const result = validator?.(value);

      if (result !== true) {
        errors.push({
          field,
          message: result ?? `Invalid value for ${field}`
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// TODO: Create validator with modern features
const validator = new DataValidator()
  .addRule("email", (value) => {
    return value?.includes("@") || "Email must contain @";
  })
  .addRule("age", (value) => {
    const age = Number(value);
    return (age >= 0 && age <= 150) || "Age must be between 0 and 150";
  })
  .addRule("name", (value) => {
    return (
      (typeof value === "string" && value.length > 0) || "Name is required"
    );
  });

console.log("\n=== Data Validator Example ===");
const testData1 = { email: "test@example.com", age: 25, name: "John" };
const testData2 = { email: "invalid-email", age: -5 };

console.log("Valid data:", validator.validate(testData1));
console.log("Invalid data:", validator.validate(testData2));

// Instructions:
// 1. Practice BigInt operations and understand when to use BigInt vs Number
// 2. Use optional chaining to safely access nested object properties
// 3. Apply nullish coalescing to handle null/undefined values properly
// 4. Experiment with logical assignment operators
// 5. Use numeric separators for better readability
// 6. Practice private fields and methods (if supported in your environment)
// 7. Use String.replaceAll() for text processing
// 8. Build practical examples combining multiple modern features
