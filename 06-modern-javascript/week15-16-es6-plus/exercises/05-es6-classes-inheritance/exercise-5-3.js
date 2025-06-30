// Exercise 5.3: Private Fields and Methods
// Objective: Implement classes with private fields and methods for proper encapsulation

// Task 1: Bank Account with Private Balance
// TODO: Create a BankAccount class with private balance and transaction history
class BankAccount {
  // TODO: Add private fields for balance and transactions
  // #balance = 0;
  // #transactions = [];

  constructor(initialBalance = 0, accountNumber) {
    // TODO: Initialize private fields
    // Validate initial balance
    // Set account number as public property
  }

  // TODO: Add private method for recording transactions
  // #recordTransaction(type, amount, description) {
  //     // Add transaction to history with timestamp
  // }

  // TODO: Add private method for validation
  // #validateAmount(amount) {
  //     // Validate amount is positive number
  // }

  // Public methods
  deposit(amount, description = "Deposit") {
    // TODO: Implement deposit logic
    // Validate amount, update balance, record transaction
  }

  withdraw(amount, description = "Withdrawal") {
    // TODO: Implement withdrawal logic
    // Validate amount, check sufficient funds, update balance, record transaction
  }

  getBalance() {
    // TODO: Return current balance
  }

  getTransactionHistory() {
    // TODO: Return copy of transaction history
  }

  // TODO: Add static method for account number generation
  static generateAccountNumber() {
    // Generate random account number
  }
}

// Task 2: User Profile with Private Data
// TODO: Create a UserProfile class with private sensitive information
class UserProfile {
  // TODO: Add private fields
  // #personalInfo = {};
  // #preferences = {};
  // #loginAttempts = 0;

  constructor(username, email) {
    // TODO: Initialize public and private data
    this.username = username;
    this.email = email;
    this.createdAt = new Date();
    // Initialize private fields
  }

  // TODO: Private method for password hashing (simplified)
  // #hashPassword(password) {
  //     // Simple hash simulation
  //     return btoa(password + 'salt');
  // }

  // TODO: Private method for login attempt tracking
  // #recordLoginAttempt(success) {
  //     // Track login attempts
  // }

  setPassword(newPassword) {
    // TODO: Implement password setting with validation
    // Hash password and store in private field
  }

  verifyPassword(password) {
    // TODO: Implement password verification
    // Compare hashed passwords, record attempt
  }

  updatePreference(key, value) {
    // TODO: Update user preferences
  }

  getPreferences() {
    // TODO: Return copy of preferences
  }

  setPersonalInfo(info) {
    // TODO: Set personal information (private)
    // Validate and store sensitive data
  }

  // TODO: Public getter for safe personal info
  getPublicProfile() {
    // Return only non-sensitive information
  }

  // TODO: Private method for data validation
  // #validatePersonalInfo(info) {
  //     // Validate personal information format
  // }
}

// Task 3: Cache with Private Storage
// TODO: Create a Cache class with private storage and cleanup
class Cache {
  // TODO: Add private fields
  // #storage = new Map();
  // #timestamps = new Map();
  // #maxSize;
  // #ttl;

  constructor(maxSize = 100, ttl = 60000) {
    // TODO: Initialize cache configuration
  }

  // TODO: Private method for cleanup
  // #cleanup() {
  //     // Remove expired entries
  //     // Implement LRU eviction if over maxSize
  // }

  // TODO: Private method for expiry check
  // #isExpired(key) {
  //     // Check if entry is expired
  // }

  set(key, value) {
    // TODO: Store value with timestamp
    // Trigger cleanup if needed
  }

  get(key) {
    // TODO: Retrieve value if not expired
    // Update timestamp for LRU
  }

  has(key) {
    // TODO: Check if key exists and is not expired
  }

  delete(key) {
    // TODO: Remove entry from cache
  }

  clear() {
    // TODO: Clear all cache entries
  }

  // Public getter for cache stats
  getStats() {
    // TODO: Return cache statistics (size, hit rate, etc.)
  }

  // TODO: Private method for hit rate calculation
  // #calculateHitRate() {
  //     // Calculate cache hit rate
  // }
}

// Task 4: Game Character with Private Stats
// TODO: Create a GameCharacter class with private stats and abilities
class GameCharacter {
  // TODO: Add private fields
  // #stats = { health: 100, mana: 50, experience: 0 };
  // #abilities = [];
  // #inventory = [];

  constructor(name, characterClass = "warrior") {
    // TODO: Initialize character
    this.name = name;
    this.characterClass = characterClass;
    this.level = 1;
    // Initialize private stats based on class
  }

  // TODO: Private method for stat calculation
  // #calculateStatBonus(stat) {
  //     // Calculate stat bonus based on level and class
  // }

  // TODO: Private method for ability learning
  // #canLearnAbility(ability) {
  //     // Check if character meets requirements
  // }

  // TODO: Private method for damage calculation
  // #calculateDamage(baseDamage) {
  //     // Calculate damage with stat bonuses
  // }

  attack(target) {
    // TODO: Implement attack logic
    // Calculate damage, consume mana if needed
  }

  heal(amount) {
    // TODO: Implement healing
    // Validate amount, update health
  }

  gainExperience(amount) {
    // TODO: Add experience and handle leveling
  }

  learnAbility(ability) {
    // TODO: Learn new ability if requirements met
  }

  // Public getters for safe stat access
  getHealth() {
    // TODO: Return current health
  }

  getLevel() {
    return this.level;
  }

  getAbilities() {
    // TODO: Return copy of abilities
  }

  // TODO: Private method for level up
  // #levelUp() {
  //     // Handle level progression
  // }
}

// Test Cases
console.log("=== Private Fields and Methods Exercise ===\n");

// Test 1: Bank Account
console.log("Test 1 - Bank Account:");
// Uncomment to test:
// const account = new BankAccount(1000, 'ACC123');
// account.deposit(500, 'Salary');
// account.withdraw(200, 'Groceries');
// console.log('Balance:', account.getBalance());
// console.log('Transactions:', account.getTransactionHistory());
// Try to access private fields (should not work):
// console.log('Private balance access:', account.#balance); // Should cause error

console.log("\nTest 2 - User Profile:");
// Uncomment to test:
// const user = new UserProfile('alice', 'alice@example.com');
// user.setPassword('secretPassword');
// console.log('Password valid:', user.verifyPassword('secretPassword'));
// user.updatePreference('theme', 'dark');
// console.log('Preferences:', user.getPreferences());

console.log("\nTest 3 - Cache:");
// Uncomment to test:
// const cache = new Cache(5, 5000); // 5 items, 5 second TTL
// cache.set('key1', 'value1');
// cache.set('key2', 'value2');
// console.log('Has key1:', cache.has('key1'));
// console.log('Get key1:', cache.get('key1'));
// console.log('Stats:', cache.getStats());

console.log("\nTest 4 - Game Character:");
// Uncomment to test:
// const hero = new GameCharacter('Hero', 'mage');
// hero.gainExperience(100);
// hero.learnAbility({ name: 'Fireball', manaCost: 10 });
// console.log('Health:', hero.getHealth());
// console.log('Abilities:', hero.getAbilities());

console.log(
  "\nImplement all classes with private fields and methods, then uncomment tests!"
);

// Advanced Challenge: Inheritance with Private Fields
// TODO: Create a SavingsAccount that extends BankAccount
class SavingsAccount extends BankAccount {
  // TODO: Add private fields for interest rate and compound frequency
  // Note: Private fields are not inherited, so you need new private fields

  constructor(initialBalance, accountNumber, interestRate = 0.02) {
    // TODO: Call super constructor
    // Initialize private fields for savings-specific features
  }

  // TODO: Add method to calculate and apply interest
  applyInterest() {
    // Calculate interest on current balance
    // Add interest as a deposit
  }

  // Override withdraw to enforce minimum balance
  withdraw(amount, description = "Withdrawal") {
    // TODO: Check minimum balance requirement
    // Call parent withdraw if valid
  }
}

console.log("\n=== Advanced Challenge ===");
console.log(
  "Extend BankAccount to create SavingsAccount with additional private fields!"
);
