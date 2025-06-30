/**
 * Exercise 7-2: Symbols, Iterators, and Generators
 *
 * Explore Symbols for unique properties, custom iterators, and generator functions.
 */

console.log("Starting Exercise 7-2: Symbols, Iterators, and Generators");

// Symbol basics
console.log("\n=== Symbol Basics ===");

// TODO: Create symbols
const symbol1 = Symbol();
const symbol2 = Symbol("description");
const symbol3 = Symbol("description"); // Different from symbol2

console.log("Symbol1:", symbol1);
console.log("Symbol2:", symbol2);
console.log("Symbol3:", symbol3);
console.log("symbol2 === symbol3:", symbol2 === symbol3); // false

// Global symbol registry
const globalSymbol1 = Symbol.for("globalKey");
const globalSymbol2 = Symbol.for("globalKey");
console.log("Global symbols equal:", globalSymbol1 === globalSymbol2); // true

// Using symbols as object properties
const hiddenProperty = Symbol("hidden");
const publicProperty = "public";

const obj = {
  [publicProperty]: "visible value",
  [hiddenProperty]: "hidden value",
  regularProperty: "regular value"
};

console.log("\n=== Symbol Properties ===");
console.log("Object keys:", Object.keys(obj));
console.log("Object symbols:", Object.getOwnPropertySymbols(obj));
console.log("Hidden value:", obj[hiddenProperty]);

// TODO: Create a class with private-like properties using symbols
const _privateData = Symbol("privateData");
const _privateMethod = Symbol("privateMethod");

class SecureContainer {
  constructor(initialData) {
    // TODO: Store private data using symbol
    this[_privateData] = initialData;
  }

  // TODO: Private method using symbol
  [_privateMethod](data) {
    return `Processed: ${data}`;
  }

  // TODO: Public method that uses private data
  getProcessedData() {
    return this[_privateMethod](this[_privateData]);
  }

  // TODO: Public method to update private data
  updateData(newData) {
    this[_privateData] = newData;
  }
}

const container = new SecureContainer("secret data");
console.log("\n=== Secure Container ===");
console.log("Processed data:", container.getProcessedData());
console.log("Object keys:", Object.keys(container));
console.log("Cannot access private:", container[_privateData]); // undefined from outside

// Well-known symbols
console.log("\n=== Well-Known Symbols ===");

// Symbol.iterator
const iterableObject = {
  data: [1, 2, 3, 4, 5],

  // TODO: Implement Symbol.iterator
  [Symbol.iterator]() {
    let index = 0;
    const data = this.data;

    return {
      next() {
        if (index < data.length) {
          return { value: data[index++], done: false };
        } else {
          return { done: true };
        }
      }
    };
  }
};

console.log("Iterating custom object:");
for (const value of iterableObject) {
  console.log("Value:", value);
}

// Symbol.toStringTag
class CustomClass {
  // TODO: Implement custom toString tag
  get [Symbol.toStringTag]() {
    return "CustomClass";
  }
}

const customInstance = new CustomClass();
console.log("Custom toString:", Object.prototype.toString.call(customInstance));

// Generators
console.log("\n=== Generator Functions ===");

// TODO: Create a simple generator
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
  return "done";
}

const gen = numberGenerator();
console.log("Generator next():", gen.next());
console.log("Generator next():", gen.next());
console.log("Generator next():", gen.next());
console.log("Generator next():", gen.next());

// TODO: Create a generator with parameters and state
function* counterGenerator(start = 0, step = 1) {
  let count = start;
  while (true) {
    const reset = yield count;
    if (reset) {
      count = start;
    } else {
      count += step;
    }
  }
}

console.log("\n=== Counter Generator ===");
const counter = counterGenerator(10, 5);
console.log("Count 1:", counter.next().value);
console.log("Count 2:", counter.next().value);
console.log("Count 3:", counter.next().value);
console.log("Reset:", counter.next(true).value);
console.log("Count after reset:", counter.next().value);

// TODO: Generator for Fibonacci sequence
function* fibonacciGenerator() {
  let a = 0,
    b = 1;

  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

console.log("\n=== Fibonacci Generator ===");
const fib = fibonacciGenerator();
for (let i = 0; i < 10; i++) {
  console.log(`Fib ${i}:`, fib.next().value);
}

// Advanced: Generator composition
function* evenNumbers() {
  let num = 0;
  while (num <= 10) {
    if (num % 2 === 0) {
      yield num;
    }
    num++;
  }
}

function* oddNumbers() {
  let num = 1;
  while (num <= 10) {
    if (num % 2 === 1) {
      yield num;
    }
    num++;
  }
}

// TODO: Compose generators using yield*
function* allNumbers() {
  yield* evenNumbers();
  yield* oddNumbers();
}

console.log("\n=== Generator Composition ===");
console.log("All numbers:", [...allNumbers()]);

// Custom iterator with generator
class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }

  // TODO: Implement iterator using generator
  *[Symbol.iterator]() {
    for (let i = this.start; i < this.end; i += this.step) {
      yield i;
    }
  }

  // TODO: Add custom methods
  *reverse() {
    for (let i = this.end - 1; i >= this.start; i -= this.step) {
      yield i;
    }
  }

  *filter(predicate) {
    for (const value of this) {
      if (predicate(value)) {
        yield value;
      }
    }
  }

  *map(transformer) {
    for (const value of this) {
      yield transformer(value);
    }
  }
}

console.log("\n=== Custom Range Iterator ===");
const range = new Range(1, 11, 2);
console.log("Range values:", [...range]);
console.log("Reverse range:", [...range.reverse()]);
console.log("Filtered range:", [...range.filter((x) => x > 5)]);
console.log("Mapped range:", [...range.map((x) => x * 2)]);

// Practical example: Data processor with generators
class DataProcessor {
  constructor(data) {
    this.data = data;
  }

  // TODO: Generator for filtering data
  *filter(predicate) {
    for (const item of this.data) {
      if (predicate(item)) {
        yield item;
      }
    }
  }

  // TODO: Generator for transforming data
  *map(transformer) {
    for (const item of this.data) {
      yield transformer(item);
    }
  }

  // TODO: Generator for batching data
  *batch(size) {
    let batch = [];
    for (const item of this.data) {
      batch.push(item);
      if (batch.length === size) {
        yield batch;
        batch = [];
      }
    }
    if (batch.length > 0) {
      yield batch;
    }
  }

  // TODO: Chain operations
  static pipe(generator, ...operations) {
    return operations.reduce((gen, operation) => operation(gen), generator);
  }
}

console.log("\n=== Data Processor Example ===");
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const processor = new DataProcessor(data);

// Filter even numbers
console.log("Even numbers:", [...processor.filter((x) => x % 2 === 0)]);

// Map to squares
console.log("Squares:", [...processor.map((x) => x * x)]);

// Batch processing
console.log("Batches:", [...processor.batch(3)]);

// Chained operations example
function* filterEven(generator) {
  for (const value of generator) {
    if (value % 2 === 0) {
      yield value;
    }
  }
}

function* square(generator) {
  for (const value of generator) {
    yield value * value;
  }
}

const chainedResult = DataProcessor.pipe(
  processor[Symbol.iterator](),
  filterEven,
  square
);

console.log("Chained result:", [...chainedResult]);

// Instructions:
// 1. Complete all symbol-related exercises and understand symbol uniqueness
// 2. Implement custom iterators using Symbol.iterator
// 3. Practice generator functions with different patterns
// 4. Create generators with state and parameters
// 5. Use yield* for generator composition
// 6. Build practical data processing pipelines with generators
// 7. Understand the memory efficiency benefits of generators vs arrays
