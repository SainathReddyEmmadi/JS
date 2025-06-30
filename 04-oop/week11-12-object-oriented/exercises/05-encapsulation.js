/**
 * Exercise 5: Encapsulation and Private Members
 *
 * Master data hiding, encapsulation, and access control in JavaScript
 */

console.log("=== Exercise 5: Encapsulation and Private Members ===\n");

// PART 1: Encapsulation with Public and Private Properties
console.log("PART 1: Encapsulation with Public and Private Properties");

/*
 * TODO 1.1: Create a BankAccount class with proper encapsulation
 */

class BankAccount {
  // Private fields (ES2022)
  #accountNumber;
  #balance;
  #pin;
  #transactionHistory;
  #isLocked;
  #failedAttempts;

  constructor(accountNumber, initialBalance, pin) {
    // Your code here
    // Initialize private fields with validation
    // Validate account number format, initial balance, pin
  }

  // Private method for PIN validation
  #validatePin(enteredPin) {
    // Your code here
    // Check PIN and handle failed attempts
    // Lock account after 3 failed attempts
  }

  // Private method for logging transactions
  #logTransaction(type, amount, description) {
    // Your code here
    // Add transaction to history with timestamp
  }

  // Private method for account lock management
  #lockAccount() {
    // Your code here
  }

  // Private method to unlock account (could be used by admin)
  #unlockAccount() {
    // Your code here
  }

  // Public method to deposit money
  deposit(amount, pin) {
    // Your code here
    // Validate PIN, amount, account status
    // Update balance and log transaction
  }

  // Public method to withdraw money
  withdraw(amount, pin) {
    // Your code here
    // Validate PIN, amount, sufficient funds, account status
    // Update balance and log transaction
  }

  // Public method to check balance
  getBalance(pin) {
    // Your code here
    // Validate PIN and return balance
  }

  // Public method to get account info (non-sensitive)
  getAccountInfo() {
    // Your code here
    // Return account number (masked) and status
  }

  // Public method to get transaction history
  getTransactionHistory(pin) {
    // Your code here
    // Validate PIN and return transaction history
  }

  // Public method to change PIN
  changePin(currentPin, newPin) {
    // Your code here
    // Validate current PIN and set new PIN
  }

  // Getter for account status (read-only)
  get isAccountLocked() {
    return this.#isLocked;
  }

  // Static method to validate account number format
  static validateAccountNumber(accountNumber) {
    // Your code here
    // Check if account number follows required format (e.g., 10 digits)
  }
}

// Test bank account encapsulation
try {
  const account = new BankAccount("1234567890", 1000, "1234");

  console.log("Account info:", account.getAccountInfo());
  console.log("Initial balance:", account.getBalance("1234"));

  account.deposit(500, "1234");
  console.log("After deposit:", account.getBalance("1234"));

  account.withdraw(200, "1234");
  console.log("After withdrawal:", account.getBalance("1234"));

  console.log("Transaction history:", account.getTransactionHistory("1234"));

  // Test wrong PIN
  try {
    account.withdraw(100, "0000");
  } catch (error) {
    console.log("Error:", error.message);
  }

  // Test direct access to private fields (should fail)
  console.log("Trying to access private field:", account.#balance); // This will cause an error
} catch (error) {
  console.log("Encapsulation working - cannot access private field");
}

// PART 2: Closure-based Encapsulation (Alternative Approach)
console.log("\nPART 2: Closure-based Encapsulation");

/*
 * TODO 2.1: Create a Counter using closures for encapsulation
 */

function createCounter(initialValue = 0, step = 1) {
  // Private variables using closures
  let count = initialValue;
  let stepSize = step;
  let history = [];

  // Private function
  function logOperation(operation, oldValue, newValue) {
    // Your code here
    // Add operation to history with timestamp
  }

  // Return public interface
  return {
    // Public methods
    increment() {
      // Your code here
      // Increment count by step size and log operation
    },

    decrement() {
      // Your code here
      // Decrement count by step size and log operation
    },

    getValue() {
      // Your code here
      // Return current count value
    },

    reset() {
      // Your code here
      // Reset count to initial value and log operation
    },

    setStep(newStep) {
      // Your code here
      // Change step size with validation
    },

    getHistory() {
      // Your code here
      // Return copy of history (not reference)
    },

    // Read-only properties using getters
    get currentValue() {
      return count;
    },

    get currentStep() {
      return stepSize;
    }
  };
}

// Test closure-based encapsulation
const counter1 = createCounter(10, 2);
const counter2 = createCounter(0, 5);

console.log("Counter 1 initial:", counter1.getValue());
counter1.increment();
counter1.increment();
counter1.decrement();
console.log("Counter 1 after operations:", counter1.getValue());
console.log("Counter 1 history:", counter1.getHistory());

console.log("Counter 2 operations:");
counter2.increment();
counter2.setStep(10);
counter2.increment();
console.log("Counter 2 value:", counter2.currentValue);

// PART 3: Property Descriptors and Access Control
console.log("\nPART 3: Property Descriptors and Access Control");

/*
 * TODO 3.1: Create a User class with controlled property access
 */

class User {
  constructor(username, email, age) {
    // Your code here
    // Set initial values and configure property descriptors
    this._username = username;
    this._email = email;
    this._age = age;
    this._createdAt = new Date();
    this._lastLogin = null;

    // Configure property descriptors
    this._setupPropertyDescriptors();
  }

  _setupPropertyDescriptors() {
    // Your code here
    // Use Object.defineProperty to create controlled access to properties

    // Username: readable, not writable, not enumerable
    Object.defineProperty(this, "username", {
      // Your descriptor configuration here
    });

    // Email: readable and writable with validation, enumerable
    Object.defineProperty(this, "email", {
      // Your descriptor configuration here
    });

    // Age: readable and writable with validation, enumerable
    Object.defineProperty(this, "age", {
      // Your descriptor configuration here
    });

    // CreatedAt: readable only, not writable, enumerable
    Object.defineProperty(this, "createdAt", {
      // Your descriptor configuration here
    });

    // LastLogin: readable only, not writable, enumerable
    Object.defineProperty(this, "lastLogin", {
      // Your descriptor configuration here
    });
  }

  // Method to update last login (controlled access)
  updateLastLogin() {
    // Your code here
    // Update the _lastLogin private property
  }

  // Method to get user info
  getUserInfo() {
    // Your code here
    // Return object with user information
  }

  // Static method to validate email format
  static validateEmail(email) {
    // Your code here
    // Check email format using regex
  }

  // Static method to validate age
  static validateAge(age) {
    // Your code here
    // Check if age is valid number between reasonable limits
  }
}

// Test property descriptors
const user = new User("john_doe", "john@example.com", 25);

console.log("User info:", user.getUserInfo());
console.log("User enumerable properties:", Object.keys(user));

// Test property access control
try {
  user.username = "new_username"; // Should not work
} catch (error) {
  console.log("Username change blocked:", error.message);
}

// Test email validation
try {
  user.email = "invalid-email"; // Should trigger validation
} catch (error) {
  console.log("Email validation error:", error.message);
}

user.email = "john.doe@example.com"; // Should work
console.log("Email updated:", user.email);

// PART 4: Advanced Encapsulation Patterns
console.log("\nPART 4: Advanced Encapsulation Patterns");

/*
 * TODO 4.1: Create a ConfigManager with different access levels
 */

class ConfigManager {
  // Private fields for different configuration levels
  #systemConfig;
  #userConfig;
  #defaultConfig;
  #adminPassword;

  constructor(adminPassword) {
    this.#adminPassword = adminPassword;
    this.#defaultConfig = {
      theme: "light",
      language: "en",
      autoSave: true,
      timeout: 30000
    };
    this.#systemConfig = { ...this.#defaultConfig };
    this.#userConfig = {};
  }

  // Private method to validate admin access
  #validateAdminAccess(password) {
    // Your code here
    // Check if provided password matches admin password
  }

  // Private method to merge configurations
  #mergeConfigs() {
    // Your code here
    // Merge default, system, and user configs with proper precedence
  }

  // Public method to get configuration value
  get(key) {
    // Your code here
    // Return configuration value from merged config
  }

  // Public method to set user configuration
  setUser(key, value) {
    // Your code here
    // Set user-level configuration
  }

  // Admin method to set system configuration
  setSystem(key, value, adminPassword) {
    // Your code here
    // Validate admin access and set system-level configuration
  }

  // Admin method to reset to defaults
  resetToDefaults(adminPassword) {
    // Your code here
    // Validate admin access and reset all configurations
  }

  // Public method to get current configuration (merged)
  getCurrentConfig() {
    // Your code here
    // Return merged configuration (read-only copy)
  }

  // Public method to export user configuration
  exportUserConfig() {
    // Your code here
    // Return copy of user configuration
  }

  // Admin method to get system configuration
  getSystemConfig(adminPassword) {
    // Your code here
    // Validate admin access and return system configuration
  }
}

// Test configuration manager
const configManager = new ConfigManager("admin123");

console.log("Default config:", configManager.getCurrentConfig());

// Set user preferences
configManager.setUser("theme", "dark");
configManager.setUser("language", "es");
console.log("After user changes:", configManager.getCurrentConfig());

// Admin changes system config
configManager.setSystem("timeout", 60000, "admin123");
console.log("After system change:", configManager.getCurrentConfig());

// Test admin access control
try {
  configManager.setSystem("timeout", 120000, "wrong_password");
} catch (error) {
  console.log("Admin access denied:", error.message);
}

/*
 * TODO 4.2: Create a CacheManager with automatic cleanup and size limits
 */

class CacheManager {
  #cache;
  #maxSize;
  #ttl; // Time to live in milliseconds
  #accessTimes;
  #cleanupInterval;

  constructor(maxSize = 100, ttl = 300000) {
    // 5 minutes default TTL
    // Your code here
    // Initialize private fields and start cleanup interval
  }

  // Private method to check if item is expired
  #isExpired(timestamp) {
    // Your code here
    // Check if item has exceeded TTL
  }

  // Private method to evict expired items
  #evictExpired() {
    // Your code here
    // Remove expired items from cache
  }

  // Private method to evict least recently used items
  #evictLRU() {
    // Your code here
    // Remove least recently used items when cache is full
  }

  // Private method for automatic cleanup
  #startCleanup() {
    // Your code here
    // Set up interval for automatic cleanup
  }

  // Public method to set cache item
  set(key, value) {
    // Your code here
    // Add item to cache with timestamp, handle size limits
  }

  // Public method to get cache item
  get(key) {
    // Your code here
    // Retrieve item if not expired, update access time
  }

  // Public method to check if key exists
  has(key) {
    // Your code here
    // Check if key exists and is not expired
  }

  // Public method to delete cache item
  delete(key) {
    // Your code here
    // Remove item from cache
  }

  // Public method to clear all cache
  clear() {
    // Your code here
    // Clear all cache items
  }

  // Public method to get cache statistics
  getStats() {
    // Your code here
    // Return cache size, hit rate, etc.
  }

  // Getter for cache size
  get size() {
    return this.#cache.size;
  }

  // Method to cleanup and destroy
  destroy() {
    // Your code here
    // Clear interval and cleanup resources
  }
}

// Test cache manager
const cache = new CacheManager(3, 2000); // 3 items max, 2 second TTL

cache.set("user1", { name: "Alice", age: 30 });
cache.set("user2", { name: "Bob", age: 25 });
cache.set("user3", { name: "Charlie", age: 35 });

console.log("Cache stats:", cache.getStats());
console.log("Get user1:", cache.get("user1"));

// Add one more item (should evict LRU)
cache.set("user4", { name: "David", age: 28 });
console.log("After adding user4:", cache.getStats());

// Wait for TTL to expire (in real scenario)
// setTimeout(() => {
//     console.log("After TTL expiry:", cache.getStats());
//     cache.destroy();
// }, 2500);

// BONUS CHALLENGES
console.log("\n=== BONUS CHALLENGES ===");

/*
 * BONUS 1: Create a Secure Store with encryption-like behavior
 */

class SecureStore {
  #store;
  #salt;
  #keyDerivation;

  constructor(masterKey) {
    // Your code here
    // Initialize secure storage with key derivation
  }

  // Private method to hash keys (simulate encryption)
  #hashKey(key) {
    // Your code here
    // Simple hash function for demonstration
  }

  // Private method to encrypt value (simulate encryption)
  #encrypt(value) {
    // Your code here
    // Simple encryption simulation
  }

  // Private method to decrypt value (simulate decryption)
  #decrypt(encryptedValue) {
    // Your code here
    // Simple decryption simulation
  }

  // Public method to store encrypted data
  store(key, value) {
    // Your code here
    // Hash key and encrypt value before storing
  }

  // Public method to retrieve and decrypt data
  retrieve(key) {
    // Your code here
    // Hash key, retrieve, and decrypt value
  }

  // Public method to check if key exists
  exists(key) {
    // Your code here
  }

  // Public method to delete data
  remove(key) {
    // Your code here
  }

  // Public method to list all keys (hashed)
  listKeys() {
    // Your code here
    // Return array of hashed keys
  }
}

/*
 * BONUS 2: Create a State Machine with encapsulated state transitions
 */

class StateMachine {
  #currentState;
  #states;
  #transitions;
  #history;
  #listeners;

  constructor(initialState, states, transitions) {
    // Your code here
    // Initialize state machine with validation
  }

  // Private method to validate transition
  #canTransition(fromState, toState) {
    // Your code here
    // Check if transition is allowed
  }

  // Private method to execute state change
  #executeTransition(newState, data) {
    // Your code here
    // Change state, update history, notify listeners
  }

  // Private method to trigger state events
  #triggerEvents(event, data) {
    // Your code here
    // Notify all registered listeners
  }

  // Public method to transition to new state
  transition(newState, data = null) {
    // Your code here
    // Validate and execute state transition
  }

  // Public method to get current state
  getCurrentState() {
    return this.#currentState;
  }

  // Public method to get state history
  getHistory() {
    // Your code here
    // Return copy of state history
  }

  // Public method to add event listener
  on(event, callback) {
    // Your code here
    // Add event listener for state changes
  }

  // Public method to remove event listener
  off(event, callback) {
    // Your code here
  }

  // Public method to get available transitions
  getAvailableTransitions() {
    // Your code here
    // Return possible transitions from current state
  }

  // Public method to reset to initial state
  reset() {
    // Your code here
  }
}

// Test state machine
const orderStates = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled"
];
const orderTransitions = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: []
};

const orderMachine = new StateMachine("pending", orderStates, orderTransitions);

// Add event listener
orderMachine.on("stateChange", (data) => {
  console.log(`Order state changed to: ${data.newState}`);
});

// Test transitions
console.log("Initial state:", orderMachine.getCurrentState());
console.log("Available transitions:", orderMachine.getAvailableTransitions());

orderMachine.transition("processing");
orderMachine.transition("shipped");
orderMachine.transition("delivered");

console.log("State history:", orderMachine.getHistory());

console.log("\n=== Exercise 5 Complete! ===");

/*
 * SELF-CHECK QUESTIONS:
 * 1. What's the difference between private fields and private methods in ES6 classes?
 * 2. How do closures enable encapsulation in JavaScript?
 * 3. When would you use property descriptors over getters and setters?
 * 4. What are the trade-offs between different encapsulation approaches?
 * 5. How can you implement access control in JavaScript objects?
 * 6. What is information hiding and why is it important?
 * 7. How do you prevent external code from modifying internal state?
 * 8. What are some patterns for creating immutable objects?
 */
