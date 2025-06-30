# New Data Structures and Features

## Table of Contents

1. [Map and WeakMap](#map-and-weakmap)
2. [Set and WeakSet](#set-and-weakset)
3. [Symbols and Well-Known Symbols](#symbols-and-well-known-symbols)
4. [Proxy and Reflect APIs](#proxy-and-reflect-apis)
5. [Iterators and Iteration Protocol](#iterators-and-iteration-protocol)
6. [ES2020+ Features](#es2020-features)
7. [BigInt for Large Numbers](#bigint-for-large-numbers)
8. [Optional Chaining and Nullish Coalescing](#optional-chaining-and-nullish-coalescing)
9. [Performance Considerations](#performance-considerations)
10. [Best Practices](#best-practices)
11. [Practice Exercises](#practice-exercises)

## Map and WeakMap

### Map - Enhanced Key-Value Storage

Map provides a better alternative to plain objects for key-value storage with any type of keys.

```javascript
// Basic Map usage
const userMap = new Map();

// Setting values with different key types
userMap.set("string-key", "String key value");
userMap.set(42, "Number key value");
userMap.set(true, "Boolean key value");

const objKey = { id: 1 };
const funcKey = function () {};
userMap.set(objKey, "Object key value");
userMap.set(funcKey, "Function key value");

// Getting values
console.log(userMap.get("string-key")); // "String key value"
console.log(userMap.get(42)); // "Number key value"
console.log(userMap.get(objKey)); // "Object key value"

// Map properties and methods
console.log(userMap.size); // 5
console.log(userMap.has(objKey)); // true

// Deleting entries
userMap.delete(42);
console.log(userMap.has(42)); // false

// Clearing all entries
userMap.clear();
console.log(userMap.size); // 0
```

### Advanced Map Patterns

```javascript
class Cache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return undefined;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      // Update existing key
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first entry)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  has(key) {
    return this.cache.has(key);
  }

  clear() {
    this.cache.clear();
  }

  get size() {
    return this.cache.size;
  }

  // Get all entries as array
  entries() {
    return Array.from(this.cache.entries());
  }

  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilizationPercent: (this.cache.size / this.maxSize) * 100
    };
  }
}

// Usage
const cache = new Cache(3);
cache.set("user:1", { name: "Alice" });
cache.set("user:2", { name: "Bob" });
cache.set("user:3", { name: "Charlie" });

console.log(cache.get("user:1")); // { name: 'Alice' }
cache.set("user:4", { name: "David" }); // Removes user:2 (LRU)

console.log(cache.has("user:2")); // false
console.log(cache.getStats()); // { size: 3, maxSize: 3, utilizationPercent: 100 }
```

### Map Iteration

```javascript
const fruitColors = new Map([
  ["apple", "red"],
  ["banana", "yellow"],
  ["grape", "purple"],
  ["orange", "orange"]
]);

// Iterating over keys
for (const fruit of fruitColors.keys()) {
  console.log("Fruit:", fruit);
}

// Iterating over values
for (const color of fruitColors.values()) {
  console.log("Color:", color);
}

// Iterating over entries
for (const [fruit, color] of fruitColors.entries()) {
  console.log(`${fruit} is ${color}`);
}

// Using forEach
fruitColors.forEach((color, fruit) => {
  console.log(`${fruit}: ${color}`);
});

// Converting to arrays
const fruitsArray = Array.from(fruitColors.keys());
const colorsArray = Array.from(fruitColors.values());
const entriesArray = Array.from(fruitColors.entries());

// Advanced transformations
const uppercaseFruits = new Map(
  Array.from(fruitColors.entries()).map(([fruit, color]) => [
    fruit.toUpperCase(),
    color
  ])
);

const filteredMap = new Map(
  Array.from(fruitColors.entries()).filter(([fruit, color]) => color.length > 3)
);
```

### WeakMap - Weak References for Memory Management

WeakMap holds weak references to keys, allowing for better garbage collection.

```javascript
class ObjectMetadata {
  constructor() {
    this.metadata = new WeakMap();
  }

  // Associate metadata with an object
  setMetadata(object, data) {
    this.metadata.set(object, {
      ...data,
      createdAt: new Date(),
      lastAccessed: new Date()
    });
  }

  // Get metadata for an object
  getMetadata(object) {
    const data = this.metadata.get(object);
    if (data) {
      data.lastAccessed = new Date();
      data.accessCount = (data.accessCount || 0) + 1;
    }
    return data;
  }

  // Check if object has metadata
  hasMetadata(object) {
    return this.metadata.has(object);
  }

  // Remove metadata
  removeMetadata(object) {
    return this.metadata.delete(object);
  }
}

// Usage
const metadata = new ObjectMetadata();

// Create objects
const user = { id: 1, name: "Alice" };
const product = { id: 101, name: "Laptop" };

// Associate metadata
metadata.setMetadata(user, {
  type: "user",
  permissions: ["read", "write"],
  department: "engineering"
});

metadata.setMetadata(product, {
  type: "product",
  category: "electronics",
  inStock: true
});

// Access metadata
console.log(metadata.getMetadata(user));
console.log(metadata.getMetadata(product));

// When objects are no longer referenced, their metadata is automatically garbage collected
// This prevents memory leaks in long-running applications

// Private object properties using WeakMap
const privateProperties = new WeakMap();

class SecureUser {
  constructor(name, ssn) {
    this.name = name;
    // Store sensitive data in WeakMap
    privateProperties.set(this, { ssn });
  }

  getSSN() {
    const private = privateProperties.get(this);
    return private ? private.ssn : null;
  }

  updateSSN(newSSN) {
    const private = privateProperties.get(this);
    if (private) {
      private.ssn = newSSN;
    }
  }
}

const secureUser = new SecureUser("Alice", "123-45-6789");
console.log(secureUser.getSSN()); // "123-45-6789"
console.log(secureUser.ssn); // undefined (not directly accessible)
```

## Set and WeakSet

### Set - Collection of Unique Values

Set stores unique values of any type and maintains insertion order.

```javascript
// Basic Set usage
const uniqueNumbers = new Set([1, 2, 3, 2, 1, 4, 5, 3]);
console.log(uniqueNumbers); // Set(5) {1, 2, 3, 4, 5}

// Adding values
uniqueNumbers.add(6);
uniqueNumbers.add(6); // Duplicate, won't be added
console.log(uniqueNumbers.size); // 6

// Checking for values
console.log(uniqueNumbers.has(3)); // true
console.log(uniqueNumbers.has(10)); // false

// Deleting values
uniqueNumbers.delete(2);
console.log(uniqueNumbers.has(2)); // false

// Clearing all values
uniqueNumbers.clear();
console.log(uniqueNumbers.size); // 0
```

### Advanced Set Operations

```javascript
class SetOperations {
  // Union of two sets
  static union(setA, setB) {
    return new Set([...setA, ...setB]);
  }

  // Intersection of two sets
  static intersection(setA, setB) {
    return new Set([...setA].filter((x) => setB.has(x)));
  }

  // Difference between two sets
  static difference(setA, setB) {
    return new Set([...setA].filter((x) => !setB.has(x)));
  }

  // Symmetric difference (union minus intersection)
  static symmetricDifference(setA, setB) {
    const diff1 = this.difference(setA, setB);
    const diff2 = this.difference(setB, setA);
    return this.union(diff1, diff2);
  }

  // Check if setA is subset of setB
  static isSubset(setA, setB) {
    return [...setA].every((x) => setB.has(x));
  }

  // Check if setA is superset of setB
  static isSuperset(setA, setB) {
    return this.isSubset(setB, setA);
  }
}

// Usage
const evens = new Set([2, 4, 6, 8, 10]);
const primes = new Set([2, 3, 5, 7, 11]);
const small = new Set([1, 2, 3, 4, 5]);

console.log(SetOperations.union(evens, primes)); // Set {2, 4, 6, 8, 10, 3, 5, 7, 11}
console.log(SetOperations.intersection(evens, primes)); // Set {2}
console.log(SetOperations.difference(evens, primes)); // Set {4, 6, 8, 10}
console.log(SetOperations.isSubset(new Set([2, 4]), evens)); // true

// Practical example: Tag management system
class TagManager {
  constructor() {
    this.tags = new Set();
    this.itemTags = new Map();
  }

  addTag(tag) {
    this.tags.add(tag.toLowerCase());
  }

  removeTag(tag) {
    const normalizedTag = tag.toLowerCase();
    this.tags.delete(normalizedTag);

    // Remove tag from all items
    for (const [item, itemTagSet] of this.itemTags) {
      itemTagSet.delete(normalizedTag);
    }
  }

  tagItem(item, tags) {
    if (!this.itemTags.has(item)) {
      this.itemTags.set(item, new Set());
    }

    const itemTagSet = this.itemTags.get(item);
    tags.forEach((tag) => {
      const normalizedTag = tag.toLowerCase();
      this.addTag(normalizedTag);
      itemTagSet.add(normalizedTag);
    });
  }

  getItemTags(item) {
    return Array.from(this.itemTags.get(item) || new Set());
  }

  findItemsByTag(tag) {
    const normalizedTag = tag.toLowerCase();
    const items = [];

    for (const [item, itemTagSet] of this.itemTags) {
      if (itemTagSet.has(normalizedTag)) {
        items.push(item);
      }
    }

    return items;
  }

  findItemsWithAllTags(tags) {
    const normalizedTags = new Set(tags.map((tag) => tag.toLowerCase()));
    const items = [];

    for (const [item, itemTagSet] of this.itemTags) {
      if (SetOperations.isSubset(normalizedTags, itemTagSet)) {
        items.push(item);
      }
    }

    return items;
  }

  findItemsWithAnyTag(tags) {
    const normalizedTags = new Set(tags.map((tag) => tag.toLowerCase()));
    const items = [];

    for (const [item, itemTagSet] of this.itemTags) {
      if (SetOperations.intersection(normalizedTags, itemTagSet).size > 0) {
        items.push(item);
      }
    }

    return items;
  }

  getAllTags() {
    return Array.from(this.tags).sort();
  }

  getTagStats() {
    const stats = new Map();

    for (const itemTagSet of this.itemTags.values()) {
      for (const tag of itemTagSet) {
        stats.set(tag, (stats.get(tag) || 0) + 1);
      }
    }

    return Array.from(stats.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }
}

// Usage
const tagManager = new TagManager();

tagManager.tagItem("article1", ["javascript", "frontend", "tutorial"]);
tagManager.tagItem("article2", ["javascript", "backend", "api"]);
tagManager.tagItem("article3", ["python", "data-science", "tutorial"]);

console.log(tagManager.findItemsByTag("javascript")); // ['article1', 'article2']
console.log(tagManager.findItemsWithAllTags(["javascript", "tutorial"])); // ['article1']
console.log(tagManager.getTagStats());
```

### WeakSet - Weak References for Objects

WeakSet stores weak references to objects only.

```javascript
class ObjectTracker {
  constructor() {
    this.trackedObjects = new WeakSet();
    this.processedObjects = new WeakSet();
  }

  track(object) {
    if (typeof object === "object" && object !== null) {
      this.trackedObjects.add(object);
      return true;
    }
    return false;
  }

  isTracked(object) {
    return this.trackedObjects.has(object);
  }

  markAsProcessed(object) {
    if (this.trackedObjects.has(object)) {
      this.processedObjects.add(object);
      return true;
    }
    return false;
  }

  isProcessed(object) {
    return this.processedObjects.has(object);
  }

  untrack(object) {
    this.trackedObjects.delete(object);
    this.processedObjects.delete(object);
  }
}

// Usage
const tracker = new ObjectTracker();

const obj1 = { id: 1, data: "test" };
const obj2 = { id: 2, data: "example" };

tracker.track(obj1);
tracker.track(obj2);

console.log(tracker.isTracked(obj1)); // true
tracker.markAsProcessed(obj1);
console.log(tracker.isProcessed(obj1)); // true

// Objects are automatically removed from WeakSet when they're garbage collected
```

## Symbols and Well-Known Symbols

### Creating and Using Symbols

```javascript
// Creating symbols
const sym1 = Symbol();
const sym2 = Symbol("description");
const sym3 = Symbol("description"); // Different from sym2

console.log(sym1 === sym2); // false
console.log(sym2 === sym3); // false
console.log(sym2.toString()); // "Symbol(description)"
console.log(sym2.description); // "description"

// Global symbol registry
const globalSym1 = Symbol.for("app.config");
const globalSym2 = Symbol.for("app.config");
console.log(globalSym1 === globalSym2); // true

console.log(Symbol.keyFor(globalSym1)); // "app.config"
```

### Symbols as Object Properties

```javascript
class PrivatePropertiesExample {
  constructor(name, age) {
    this.name = name; // Public property
    this[PrivatePropertiesExample._age] = age; // Private property
    this[PrivatePropertiesExample._id] = Math.random().toString(36);
  }

  getAge() {
    return this[PrivatePropertiesExample._age];
  }

  getId() {
    return this[PrivatePropertiesExample._id];
  }

  // Method with symbol key
  [PrivatePropertiesExample._secretMethod]() {
    return "This is a secret method";
  }
}

// Private symbols (not accessible outside the class)
PrivatePropertiesExample._age = Symbol("age");
PrivatePropertiesExample._id = Symbol("id");
PrivatePropertiesExample._secretMethod = Symbol("secretMethod");

const person = new PrivatePropertiesExample("Alice", 30);

console.log(person.name); // "Alice"
console.log(person.age); // undefined
console.log(person.getAge()); // 30

// Symbol properties don't appear in for...in loops
for (const key in person) {
  console.log(key); // Only shows "name"
}

// Symbol properties don't appear in Object.keys()
console.log(Object.keys(person)); // ["name"]

// But they can be accessed with Object.getOwnPropertySymbols()
console.log(Object.getOwnPropertySymbols(person));
```

### Well-Known Symbols

```javascript
// Symbol.iterator - custom iteration behavior
class NumberRange {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;

    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
}

const range = new NumberRange(1, 5);
for (const num of range) {
  console.log(num); // 1, 2, 3, 4, 5
}

// Symbol.toPrimitive - custom type conversion
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case "number":
        return this.celsius;
      case "string":
        return `${this.celsius}°C`;
      default:
        return this.celsius;
    }
  }
}

const temp = new Temperature(25);
console.log(+temp); // 25 (number conversion)
console.log(`Temperature: ${temp}`); // "Temperature: 25°C" (string conversion)

// Symbol.toStringTag - custom toString behavior
class CustomClass {
  get [Symbol.toStringTag]() {
    return "CustomClass";
  }
}

const custom = new CustomClass();
console.log(custom.toString()); // "[object CustomClass]"

// Symbol.hasInstance - custom instanceof behavior
class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}

console.log([] instanceof MyArray); // true
console.log({} instanceof MyArray); // false
```

## Proxy and Reflect APIs

### Basic Proxy Usage

```javascript
// Data validation proxy
function createValidatedObject(target, validators = {}) {
  return new Proxy(target, {
    set(obj, prop, value) {
      if (validators[prop]) {
        const isValid = validators[prop](value);
        if (!isValid) {
          throw new Error(`Invalid value for property ${prop}: ${value}`);
        }
      }
      obj[prop] = value;
      return true;
    },

    get(obj, prop) {
      if (prop in obj) {
        return obj[prop];
      } else {
        throw new Error(`Property ${prop} does not exist`);
      }
    }
  });
}

// Usage
const userValidators = {
  name: (value) => typeof value === "string" && value.length > 0,
  age: (value) => typeof value === "number" && value >= 0 && value <= 150,
  email: (value) => typeof value === "string" && value.includes("@")
};

const user = createValidatedObject({}, userValidators);

user.name = "Alice"; // OK
user.age = 30; // OK
user.email = "alice@example.com"; // OK

try {
  user.age = -5; // Throws error
} catch (error) {
  console.error(error.message); // "Invalid value for property age: -5"
}
```

### Advanced Proxy Patterns

```javascript
// Logging proxy
function createLoggingProxy(target, name = "Object") {
  return new Proxy(target, {
    get(obj, prop) {
      console.log(`[${name}] Getting property: ${prop}`);
      return Reflect.get(obj, prop);
    },

    set(obj, prop, value) {
      console.log(`[${name}] Setting property: ${prop} = ${value}`);
      return Reflect.set(obj, prop, value);
    },

    has(obj, prop) {
      console.log(`[${name}] Checking property: ${prop}`);
      return Reflect.has(obj, prop);
    },

    deleteProperty(obj, prop) {
      console.log(`[${name}] Deleting property: ${prop}`);
      return Reflect.deleteProperty(obj, prop);
    }
  });
}

// Auto-creating nested objects
function createAutoObject() {
  return new Proxy(
    {},
    {
      get(target, prop) {
        if (!(prop in target)) {
          target[prop] = createAutoObject();
        }
        return target[prop];
      }
    }
  );
}

const autoObj = createAutoObject();
autoObj.user.profile.settings.theme = "dark";
console.log(autoObj.user.profile.settings.theme); // "dark"

// API client proxy
class APIProxy {
  constructor(baseURL) {
    this.baseURL = baseURL;

    return new Proxy(this, {
      get(target, prop) {
        if (prop in target) {
          return target[prop];
        }

        // Dynamic method creation for API endpoints
        return function (...args) {
          const endpoint = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
          return target.request(endpoint, ...args);
        };
      }
    });
  }

  async request(endpoint, method = "GET", data = null) {
    const url = `${this.baseURL}/${endpoint}`;
    const options = { method };

    if (data) {
      options.body = JSON.stringify(data);
      options.headers = { "Content-Type": "application/json" };
    }

    console.log(`Making ${method} request to ${url}`);
    // Simulate API call
    return { endpoint, method, data };
  }
}

const api = new APIProxy("https://api.example.com");

// These methods don't exist but are created dynamically
api.getUsers(); // GET /get-users
api.createUser({ name: "Alice" }); // POST /create-user
api.updateUserProfile({ theme: "dark" }); // GET /update-user-profile
```

### Reflect API

```javascript
// Using Reflect for meta-programming
class MetaClass {
  constructor(data = {}) {
    Object.assign(this, data);
  }

  // Dynamic property access
  getProperty(prop) {
    return Reflect.get(this, prop);
  }

  setProperty(prop, value) {
    return Reflect.set(this, prop, value);
  }

  hasProperty(prop) {
    return Reflect.has(this, prop);
  }

  deleteProperty(prop) {
    return Reflect.deleteProperty(this, prop);
  }

  getPropertyNames() {
    return Reflect.ownKeys(this);
  }

  // Dynamic method invocation
  callMethod(methodName, ...args) {
    const method = Reflect.get(this, methodName);
    if (typeof method === "function") {
      return Reflect.apply(method, this, args);
    }
    throw new Error(`Method ${methodName} not found`);
  }

  // Clone with property filtering
  clone(excludeProps = []) {
    const clone = Reflect.construct(this.constructor, []);

    for (const prop of Reflect.ownKeys(this)) {
      if (!excludeProps.includes(prop)) {
        const descriptor = Reflect.getOwnPropertyDescriptor(this, prop);
        if (descriptor) {
          Reflect.defineProperty(clone, prop, descriptor);
        }
      }
    }

    return clone;
  }
}

// Usage
const meta = new MetaClass({ name: "Test", value: 42 });

console.log(meta.getProperty("name")); // "Test"
meta.setProperty("newProp", "Hello");
console.log(meta.hasProperty("newProp")); // true
console.log(meta.getPropertyNames()); // ['name', 'value', 'newProp']

const cloned = meta.clone(["value"]);
console.log(cloned.name); // "Test"
console.log(cloned.value); // undefined
```

## Iterators and Iteration Protocol

### Custom Iterators

```javascript
// Simple iterator
class SimpleIterator {
  constructor(data) {
    this.data = data;
    this.index = 0;
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    if (this.index < this.data.length) {
      return { value: this.data[this.index++], done: false };
    } else {
      return { done: true };
    }
  }
}

// Advanced iterator with transformation
class TransformIterator {
  constructor(iterable, transformFn) {
    this.iterator = iterable[Symbol.iterator]();
    this.transformFn = transformFn;
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    const result = this.iterator.next();
    if (!result.done) {
      return {
        value: this.transformFn(result.value),
        done: false
      };
    }
    return result;
  }
}

// Generator-based iterator
function* fibonacci(max = Infinity) {
  let a = 0,
    b = 1;
  while (a <= max) {
    yield a;
    [a, b] = [b, a + b];
  }
}

// Infinite iterator with lazy evaluation
function* primes() {
  const primeSet = new Set();
  let candidate = 2;

  while (true) {
    let isPrime = true;

    for (const prime of primeSet) {
      if (prime * prime > candidate) break;
      if (candidate % prime === 0) {
        isPrime = false;
        break;
      }
    }

    if (isPrime) {
      primeSet.add(candidate);
      yield candidate;
    }

    candidate++;
  }
}

// Usage examples
const numbers = new SimpleIterator([1, 2, 3, 4, 5]);
for (const num of numbers) {
  console.log(num);
}

const doubled = new TransformIterator([1, 2, 3], (x) => x * 2);
console.log([...doubled]); // [2, 4, 6]

const fibSequence = fibonacci(100);
console.log([...fibSequence]); // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]

const primeGen = primes();
const first10Primes = [];
for (const prime of primeGen) {
  first10Primes.push(prime);
  if (first10Primes.length === 10) break;
}
console.log(first10Primes); // [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

### Iterable Utilities

```javascript
class IterableUtils {
  // Take first n items
  static *take(iterable, n) {
    let count = 0;
    for (const item of iterable) {
      if (count >= n) break;
      yield item;
      count++;
    }
  }

  // Skip first n items
  static *skip(iterable, n) {
    let count = 0;
    for (const item of iterable) {
      if (count >= n) {
        yield item;
      }
      count++;
    }
  }

  // Filter items
  static *filter(iterable, predicate) {
    for (const item of iterable) {
      if (predicate(item)) {
        yield item;
      }
    }
  }

  // Map items
  static *map(iterable, mapper) {
    for (const item of iterable) {
      yield mapper(item);
    }
  }

  // Chain iterables
  static *chain(...iterables) {
    for (const iterable of iterables) {
      yield* iterable;
    }
  }

  // Zip iterables
  static *zip(...iterables) {
    const iterators = iterables.map((it) => it[Symbol.iterator]());

    while (true) {
      const results = iterators.map((it) => it.next());

      if (results.some((result) => result.done)) {
        break;
      }

      yield results.map((result) => result.value);
    }
  }

  // Reduce iterable
  static reduce(iterable, reducer, initialValue) {
    let accumulator = initialValue;
    let hasInitial = arguments.length > 2;

    for (const item of iterable) {
      if (!hasInitial) {
        accumulator = item;
        hasInitial = true;
      } else {
        accumulator = reducer(accumulator, item);
      }
    }

    return accumulator;
  }

  // Convert to array
  static toArray(iterable) {
    return Array.from(iterable);
  }
}

// Usage
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const result = IterableUtils.take(
  IterableUtils.filter(
    IterableUtils.map(numbers, (x) => x * x),
    (x) => x % 2 === 0
  ),
  3
);

console.log(IterableUtils.toArray(result)); // [4, 16, 36]

const zipped = IterableUtils.zip(
  [1, 2, 3],
  ["a", "b", "c"],
  [true, false, true]
);
console.log(IterableUtils.toArray(zipped)); // [[1, 'a', true], [2, 'b', false], [3, 'c', true]]
```

## ES2020+ Features

### Optional Chaining (?.)

```javascript
// Safe property access
const user = {
  id: 1,
  name: "Alice",
  address: {
    street: "123 Main St",
    city: "Anytown"
  },
  contacts: {
    email: "alice@example.com"
  }
};

// Traditional approach (verbose and error-prone)
const phoneOld = user && user.contacts && user.contacts.phone;

// Optional chaining (clean and safe)
const phone = user?.contacts?.phone; // undefined
const email = user?.contacts?.email; // "alice@example.com"
const zipCode = user?.address?.zipCode; // undefined

// Method calls
const userInfo = user?.getInfo?.(); // undefined (method doesn't exist)

// Dynamic property access
const dynamicProp = user?.["dynamic-property"]; // undefined

// Array access
const users = [{ name: "Alice", posts: [{ title: "Hello" }] }, { name: "Bob" }];

const firstPostTitle = users?.[0]?.posts?.[0]?.title; // "Hello"
const secondPostTitle = users?.[1]?.posts?.[0]?.title; // undefined

// Function parameter handling
function processUser(user) {
  const name = user?.name ?? "Anonymous";
  const email = user?.contacts?.email ?? "No email";
  const isActive = user?.status?.active ?? false;

  return { name, email, isActive };
}

console.log(processUser({})); // { name: 'Anonymous', email: 'No email', isActive: false }
```

### Nullish Coalescing (??)

```javascript
// Nullish coalescing vs logical OR
const settings = {
  theme: "dark",
  notifications: false,
  volume: 0,
  autoSave: null,
  userName: ""
};

// Logical OR (problematic with falsy values)
const volumeOr = settings.volume || 50; // 50 (wrong, volume is 0)
const notificationsOr = settings.notifications || true; // true (wrong, notifications is false)

// Nullish coalescing (only null/undefined trigger default)
const volumeNullish = settings.volume ?? 50; // 0 (correct)
const notificationsNullish = settings.notifications ?? true; // false (correct)
const autoSaveNullish = settings.autoSave ?? true; // true (correct, autoSave is null)
const userNameNullish = settings.userName ?? "Guest"; // '' (correct, empty string is not nullish)

// Practical configuration system
class ConfigManager {
  constructor(userConfig = {}) {
    this.config = {
      // Default values
      apiUrl: "https://api.example.com",
      timeout: 5000,
      retries: 3,
      debug: false,

      // Override with user values (only if not null/undefined)
      ...Object.fromEntries(
        Object.entries(userConfig).filter(
          ([key, value]) => value !== null && value !== undefined
        )
      )
    };
  }

  get(key, defaultValue = null) {
    return this.config[key] ?? defaultValue;
  }

  set(key, value) {
    // Only set if not null/undefined
    if (value !== null && value !== undefined) {
      this.config[key] = value;
    }
  }

  getAll() {
    return { ...this.config };
  }
}

const config = new ConfigManager({
  apiUrl: null, // Should use default
  timeout: 0, // Should keep 0
  debug: true // Should override default
});

console.log(config.getAll());
// { apiUrl: 'https://api.example.com', timeout: 0, retries: 3, debug: true }
```

### Logical Assignment Operators

```javascript
// Logical assignment operators (ES2021)
let user = { name: "Alice" };

// Logical OR assignment (||=)
user.role ||= "guest"; // Sets role to 'guest' if it's falsy
user.role ||= "admin"; // Doesn't change role (already truthy)

// Logical AND assignment (&&=)
user.permissions &&= user.permissions.filter((p) => p !== "delete");
// Only executes if permissions is truthy

// Nullish coalescing assignment (??=)
user.id ??= generateId(); // Sets id only if it's null or undefined
user.settings ??= {}; // Sets empty object if settings is null/undefined

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// Practical example: Cache with fallback
class Cache {
  constructor() {
    this.data = new Map();
    this.stats = { hits: 0, misses: 0 };
  }

  get(key, fallbackFn) {
    let value = this.data.get(key);

    if (value !== undefined) {
      this.stats.hits++;
      return value;
    }

    this.stats.misses++;
    value = fallbackFn();
    this.data.set(key, value);

    return value;
  }

  getOrDefault(key, defaultValue) {
    let value = this.data.get(key);
    value ??= defaultValue; // Use nullish coalescing assignment

    if (!this.data.has(key)) {
      this.data.set(key, value);
    }

    return value;
  }
}
```

## BigInt for Large Numbers

```javascript
// Creating BigInt values
const big1 = 9007199254740991n; // Literal syntax
const big2 = BigInt("9007199254740991"); // Constructor
const big3 = BigInt(9007199254740991); // From number

console.log(typeof big1); // "bigint"

// Operations with BigInt
const large1 = 123456789012345678901234567890n;
const large2 = 987654321098765432109876543210n;

console.log(large1 + large2); // 1111111110111111111011111111100n
console.log(large1 * large2); // Very large result
console.log(large2 / large1); // 8n (integer division)
console.log(large2 % large1); // Remainder

// Cannot mix BigInt with regular numbers
try {
  console.log(big1 + 1); // TypeError
} catch (error) {
  console.error("Cannot mix BigInt with number");
}

// Correct way to mix
console.log(big1 + 1n); // Works
console.log(big1 + BigInt(1)); // Works

// Practical example: High precision calculations
class PrecisionCalculator {
  static factorial(n) {
    if (n < 0) throw new Error("Factorial undefined for negative numbers");

    let result = 1n;
    for (let i = 2n; i <= BigInt(n); i++) {
      result *= i;
    }
    return result;
  }

  static fibonacci(n) {
    if (n < 0) throw new Error("Invalid input");
    if (n <= 1) return BigInt(n);

    let a = 0n,
      b = 1n;
    for (let i = 2; i <= n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }

  static power(base, exponent) {
    if (exponent < 0) throw new Error("Negative exponents not supported");

    base = BigInt(base);
    let result = 1n;

    for (let i = 0n; i < BigInt(exponent); i++) {
      result *= base;
    }

    return result;
  }

  // Convert BigInt to string with formatting
  static format(bigintValue, locale = "en-US") {
    return bigintValue.toLocaleString(locale);
  }
}

// Usage
console.log(PrecisionCalculator.factorial(50));
// 30414093201713378043612608166064768844377641568960512000000000000n

console.log(PrecisionCalculator.fibonacci(100));
// 354224848179261915075n

console.log(PrecisionCalculator.format(PrecisionCalculator.factorial(20)));
// "2,432,902,008,176,640,000"
```

## Performance Considerations

### Choosing the Right Data Structure

```javascript
// Performance comparison utility
class PerformanceComparison {
  static timeOperation(operation, iterations = 1000000) {
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      operation();
    }

    const end = performance.now();
    return end - start;
  }

  static compareOperations(operations, iterations = 1000000) {
    const results = {};

    for (const [name, operation] of Object.entries(operations)) {
      results[name] = this.timeOperation(operation, iterations);
    }

    return results;
  }
}

// Map vs Object performance
function compareMapVsObject() {
  const map = new Map();
  const obj = {};
  const key = "testKey";

  const operations = {
    "Map set": () => map.set(key, "value"),
    "Object set": () => (obj[key] = "value"),
    "Map get": () => map.get(key),
    "Object get": () => obj[key],
    "Map has": () => map.has(key),
    "Object has": () => key in obj
  };

  return PerformanceComparison.compareOperations(operations);
}

// Set vs Array performance for uniqueness
function compareSetVsArray() {
  const set = new Set();
  const array = [];
  const value = "testValue";

  const operations = {
    "Set add": () => set.add(value),
    "Array push (no check)": () => array.push(value),
    "Array push (with check)": () => {
      if (!array.includes(value)) array.push(value);
    },
    "Set has": () => set.has(value),
    "Array includes": () => array.includes(value)
  };

  return PerformanceComparison.compareOperations(operations);
}

// Memory usage considerations
class MemoryEfficiencyDemo {
  static createLargeDataStructures() {
    const size = 100000;

    // Map with object keys (memory efficient for lookups)
    const map = new Map();
    for (let i = 0; i < size; i++) {
      map.set({ id: i }, `value${i}`);
    }

    // WeakMap (memory efficient, but limited iteration)
    const weakMap = new WeakMap();
    const keys = [];
    for (let i = 0; i < size; i++) {
      const key = { id: i };
      keys.push(key); // Keep reference
      weakMap.set(key, `value${i}`);
    }

    // Set (memory efficient for uniqueness)
    const set = new Set();
    for (let i = 0; i < size; i++) {
      set.add(i);
    }

    return { map, weakMap, set, keys };
  }

  static measureMemoryUsage() {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    return null;
  }
}

// Run performance tests
console.log("Map vs Object:", compareMapVsObject());
console.log("Set vs Array:", compareSetVsArray());

const memoryBefore = MemoryEfficiencyDemo.measureMemoryUsage();
const dataStructures = MemoryEfficiencyDemo.createLargeDataStructures();
const memoryAfter = MemoryEfficiencyDemo.measureMemoryUsage();

if (memoryBefore && memoryAfter) {
  console.log("Memory used:", memoryAfter.used - memoryBefore.used, "bytes");
}
```

## Best Practices

### 1. Choose Appropriate Data Structures

```javascript
// Good: Use Map for object-like operations with non-string keys
const usersByObject = new Map();
usersByObject.set(userObject, "additional data");

// Good: Use Set for unique collections
const uniqueIds = new Set([1, 2, 3, 2, 1]); // Set {1, 2, 3}

// Good: Use WeakMap/WeakSet for temporary associations
const privateData = new WeakMap();
privateData.set(objectInstance, { secret: "value" });
```

### 2. Leverage Symbols for Meta-programming

```javascript
// Good: Use symbols for private-like properties
const _internals = Symbol("internals");

class MyClass {
  constructor() {
    this[_internals] = { private: "data" };
  }
}
```

### 3. Use Proxy Judiciously

```javascript
// Good: Use proxy for specific meta-programming needs
const observableData = new Proxy(data, {
  set(target, property, value) {
    console.log(`Property ${property} changed to ${value}`);
    target[property] = value;
    return true;
  }
});

// Avoid: Overusing proxy for simple operations (performance cost)
```

### 4. Handle Nullish Values Properly

```javascript
// Good: Use nullish coalescing for default values
const config = userConfig ?? defaultConfig;

// Good: Use optional chaining for safe property access
const value = obj?.deeply?.nested?.property;
```

## Self-Check Questions

1. When would you use Map instead of a plain object?
2. What's the difference between WeakMap and Map?
3. How do Symbols help with object property collision?
4. What are the performance implications of using Proxy?
5. When should you use BigInt instead of regular numbers?
6. How does optional chaining differ from logical OR (||)?
7. What are the memory implications of WeakSet vs Set?
8. How can iterators help with memory efficiency?

## Practice Exercises

### Exercise 1: Advanced Cache System

Build a sophisticated caching system using Map and WeakMap that:

- Supports TTL (time-to-live) for entries
- Uses WeakMap for metadata storage
- Implements LRU eviction policy
- Provides usage statistics

### Exercise 2: Observable Object Pattern

Create an observable object system using Proxy that:

- Tracks property changes
- Supports nested object observation
- Implements computed properties
- Provides change history

### Exercise 3: Custom Collection Classes

Implement collection classes that:

- Extend native Set/Map behavior
- Support chaining operations
- Implement custom iteration protocols
- Provide advanced filtering and transformation methods

### Exercise 4: Meta-Programming Framework

Build a framework using Symbols and Reflect that:

- Provides property validation decorators
- Implements automatic serialization
- Supports method interception
- Enables runtime type checking

These exercises will help you master the new data structures and features introduced in modern JavaScript, enabling you to write more efficient and expressive code.
