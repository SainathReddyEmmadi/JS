/**
 * Exercise 7-1: Set and Map Data Structures
 *
 * Practice using Set and Map for unique collections and key-value associations.
 */

console.log("Starting Exercise 7-1: Set and Map Data Structures");

// Set demonstrations
console.log("\n=== Set Examples ===");

// Basic Set operations
const uniqueNumbers = new Set();

// TODO: Add numbers to the set
uniqueNumbers.add(1);
uniqueNumbers.add(2);
uniqueNumbers.add(3);
uniqueNumbers.add(2); // Duplicate, won't be added
uniqueNumbers.add(4);

console.log("Set size:", uniqueNumbers.size);
console.log("Has 2:", uniqueNumbers.has(2));
console.log("Set values:", [...uniqueNumbers]);

// TODO: Create a Set from an array with duplicates
const arrayWithDuplicates = [1, 2, 3, 2, 4, 3, 5, 1];
const uniqueFromArray = new Set(arrayWithDuplicates);
console.log("Original array:", arrayWithDuplicates);
console.log("Unique values:", [...uniqueFromArray]);

// Set operations
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

// TODO: Implement set operations
// Union
const union = new Set([...setA, ...setB]);
console.log("Union:", [...union]);

// Intersection
const intersection = new Set([...setA].filter((x) => setB.has(x)));
console.log("Intersection:", [...intersection]);

// Difference
const difference = new Set([...setA].filter((x) => !setB.has(x)));
console.log("Difference A-B:", [...difference]);

// WeakSet demonstration
const weakSet = new WeakSet();
const obj1 = { name: "Object 1" };
const obj2 = { name: "Object 2" };

weakSet.add(obj1);
weakSet.add(obj2);

console.log("WeakSet has obj1:", weakSet.has(obj1));

// Map demonstrations
console.log("\n=== Map Examples ===");

// Basic Map operations
const userMap = new Map();

// TODO: Add key-value pairs to the map
userMap.set("user1", { name: "Alice", age: 30 });
userMap.set("user2", { name: "Bob", age: 25 });
userMap.set("user3", { name: "Charlie", age: 35 });

console.log("Map size:", userMap.size);
console.log("Get user1:", userMap.get("user1"));
console.log("Has user2:", userMap.has("user2"));

// TODO: Iterate over Map
console.log("\nMap iteration:");
for (const [key, value] of userMap) {
  console.log(`${key}: ${value.name} (${value.age})`);
}

// Using objects as keys
const objKeyMap = new Map();
const keyObj1 = { id: 1 };
const keyObj2 = { id: 2 };

objKeyMap.set(keyObj1, "Value for object 1");
objKeyMap.set(keyObj2, "Value for object 2");

console.log("\nObject keys in Map:");
console.log("Get by keyObj1:", objKeyMap.get(keyObj1));

// TODO: Create a Map from an array of arrays
const dataArray = [
  ["name", "John"],
  ["age", 30],
  ["city", "New York"]
];
const mapFromArray = new Map(dataArray);
console.log("Map from array:", mapFromArray);

// Advanced Map usage: Caching function results
class ResultCache {
  constructor() {
    this.cache = new Map();
  }

  // TODO: Implement caching logic
  get(key) {
    return this.cache.get(key);
  }

  set(key, value) {
    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Function with caching
function expensiveCalculation(n) {
  // Simulate expensive operation
  console.log(`Calculating for ${n}...`);
  let result = 0;
  for (let i = 1; i <= n; i++) {
    result += i;
  }
  return result;
}

const cache = new ResultCache();

function cachedCalculation(n) {
  // TODO: Check cache first
  if (cache.has(n)) {
    console.log(`Cache hit for ${n}`);
    return cache.get(n);
  }

  // TODO: Calculate and cache result
  const result = expensiveCalculation(n);
  cache.set(n, result);
  return result;
}

console.log("\n=== Caching Example ===");
console.log("First call:", cachedCalculation(100));
console.log("Second call:", cachedCalculation(100)); // Should use cache
console.log("Cache size:", cache.size());

// WeakMap demonstration
const weakMap = new WeakMap();
const element1 = { id: "element1" };
const element2 = { id: "element2" };

// TODO: Use WeakMap for metadata storage
weakMap.set(element1, { clicks: 5, lastVisited: new Date() });
weakMap.set(element2, { clicks: 3, lastVisited: new Date() });

console.log("\n=== WeakMap Example ===");
console.log("Element1 metadata:", weakMap.get(element1));

// Practical example: User preferences storage
class UserPreferencesManager {
  constructor() {
    this.preferences = new Map();
  }

  // TODO: Set user preferences
  setPreference(userId, key, value) {
    if (!this.preferences.has(userId)) {
      this.preferences.set(userId, new Map());
    }
    this.preferences.get(userId).set(key, value);
  }

  // TODO: Get user preferences
  getPreference(userId, key) {
    const userPrefs = this.preferences.get(userId);
    return userPrefs ? userPrefs.get(key) : undefined;
  }

  // TODO: Get all preferences for a user
  getAllPreferences(userId) {
    const userPrefs = this.preferences.get(userId);
    return userPrefs ? Object.fromEntries(userPrefs) : {};
  }

  // TODO: Remove user preferences
  removeUser(userId) {
    return this.preferences.delete(userId);
  }

  // TODO: Get user count
  getUserCount() {
    return this.preferences.size;
  }
}

console.log("\n=== User Preferences Manager ===");
const prefsManager = new UserPreferencesManager();

prefsManager.setPreference("user1", "theme", "dark");
prefsManager.setPreference("user1", "language", "en");
prefsManager.setPreference("user2", "theme", "light");

console.log("User1 theme:", prefsManager.getPreference("user1", "theme"));
console.log("User1 all prefs:", prefsManager.getAllPreferences("user1"));
console.log("Total users:", prefsManager.getUserCount());

// Set-based data processing
function analyzeData(data) {
  const uniqueValues = new Set(data);
  const duplicates = new Set();
  const seen = new Set();

  // TODO: Find duplicates
  for (const value of data) {
    if (seen.has(value)) {
      duplicates.add(value);
    } else {
      seen.add(value);
    }
  }

  return {
    original: data,
    unique: [...uniqueValues],
    duplicates: [...duplicates],
    uniqueCount: uniqueValues.size,
    duplicateCount: duplicates.size
  };
}

console.log("\n=== Data Analysis Example ===");
const sampleData = [1, 2, 3, 2, 4, 3, 5, 1, 6, 4];
const analysis = analyzeData(sampleData);
console.log("Analysis result:", analysis);

// Instructions:
// 1. Complete all TODO sections for Set and Map operations
// 2. Practice set operations (union, intersection, difference)
// 3. Implement the caching mechanism using Map
// 4. Test WeakSet and WeakMap usage patterns
// 5. Complete the UserPreferencesManager class
// 6. Understand when to use Set/Map vs Array/Object
// 7. Practice data analysis using Set operations
