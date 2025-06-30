# Debugging OOP Code

This guide covers common issues in object-oriented JavaScript and strategies to debug them effectively.

## 🐛 Common OOP Bugs

### 1. `this` Context Issues

#### Problem: Lost `this` binding

```javascript
class Timer {
  constructor() {
    this.seconds = 0;
  }

  start() {
    // ❌ Problem: `this` will be undefined in setTimeout
    setTimeout(function () {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
}

const timer = new Timer();
timer.start(); // TypeError: Cannot read property 'seconds' of undefined
```

#### Solutions:

```javascript
class Timer {
  constructor() {
    this.seconds = 0;
  }

  // ✅ Solution 1: Arrow function
  start() {
    setTimeout(() => {
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }

  // ✅ Solution 2: bind()
  startWithBind() {
    setTimeout(
      function () {
        this.seconds++;
        console.log(this.seconds);
      }.bind(this),
      1000
    );
  }

  // ✅ Solution 3: Store reference
  startWithReference() {
    const self = this;
    setTimeout(function () {
      self.seconds++;
      console.log(self.seconds);
    }, 1000);
  }
}
```

#### Debugging Technique:

```javascript
class DebugTimer {
  constructor() {
    this.seconds = 0;
  }

  start() {
    console.log("Before setTimeout, this is:", this);

    setTimeout(() => {
      console.log("Inside setTimeout, this is:", this);
      this.seconds++;
      console.log(this.seconds);
    }, 1000);
  }
}
```

### 2. Prototype Chain Issues

#### Problem: Incorrect prototype setup

```javascript
function Parent(name) {
  this.name = name;
}

Parent.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

function Child(name, age) {
  this.name = name;
  this.age = age;
}

// ❌ Problem: Incorrect inheritance setup
Child.prototype = Parent.prototype; // Shares same prototype!

Child.prototype.getAge = function () {
  return this.age;
};

// Now Parent instances also have getAge method!
const parent = new Parent("John");
console.log(parent.getAge); // function - This shouldn't exist!
```

#### Solution:

```javascript
function Parent(name) {
  this.name = name;
}

Parent.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

function Child(name, age) {
  Parent.call(this, name); // Call parent constructor
  this.age = age;
}

// ✅ Correct: Create new prototype object
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

Child.prototype.getAge = function () {
  return this.age;
};
```

#### Debugging Technique:

```javascript
function debugPrototypeChain(obj) {
  let current = obj;
  let level = 0;

  while (current) {
    console.log(`Level ${level}:`, current.constructor.name);
    console.log("Properties:", Object.getOwnPropertyNames(current));
    current = Object.getPrototypeOf(current);
    level++;

    if (level > 10) break; // Prevent infinite loop
  }
}

// Usage
const child = new Child("Alice", 10);
debugPrototypeChain(child);
```

### 3. Memory Leaks in OOP

#### Problem: Circular references

```javascript
class Parent {
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  addChild(child) {
    this.children.push(child);
    child.parent = this; // ❌ Circular reference
  }
}

class Child {
  constructor(name) {
    this.name = name;
    this.parent = null;
  }
}
```

#### Solution: WeakMap or proper cleanup

```javascript
class Parent {
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  addChild(child) {
    this.children.push(child);
    child.setParent(this);
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.setParent(null); // ✅ Clean up reference
    }
  }
}

// Or use WeakMap for relationships
const parentChildMap = new WeakMap();

class Parent {
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  addChild(child) {
    this.children.push(child);
    parentChildMap.set(child, this);
  }

  static getParent(child) {
    return parentChildMap.get(child);
  }
}
```

### 4. Inheritance Problems

#### Problem: Forgetting to call super()

```javascript
class Animal {
  constructor(name) {
    this.name = name;
    this.energy = 100;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    // ❌ ReferenceError: Must call super constructor
    this.breed = breed;
  }
}

const dog = new Dog("Rex", "Labrador"); // Error!
```

#### Solution:

```javascript
class Dog extends Animal {
  constructor(name, breed) {
    super(name); // ✅ Call parent constructor first
    this.breed = breed;
  }
}
```

## 🔍 Debugging Strategies

### 1. Console Debugging Techniques

```javascript
class DebuggableClass {
  constructor(data) {
    console.log("Constructor called with:", data);
    this.data = data;

    // Debug object state
    console.log("Object state after construction:", this);
  }

  processData() {
    console.log("Before processing:", this.data);

    // Debug intermediate steps
    const step1 = this.data.map((item) => item * 2);
    console.log("After step 1:", step1);

    const step2 = step1.filter((item) => item > 10);
    console.log("After step 2:", step2);

    this.data = step2;
    console.log("Final result:", this.data);
  }

  // Debug method calls
  debugMethod(methodName, ...args) {
    console.log(`Calling ${methodName} with:`, args);
    const result = this[methodName](...args);
    console.log(`${methodName} returned:`, result);
    return result;
  }
}
```

### 2. Property and Method Introspection

```javascript
class ObjectInspector {
  static inspect(obj) {
    console.log("=== Object Inspection ===");
    console.log("Constructor:", obj.constructor.name);
    console.log("Instance of:", obj.constructor);

    // Own properties
    console.log("Own properties:", Object.getOwnPropertyNames(obj));

    // Prototype chain
    let proto = Object.getPrototypeOf(obj);
    let level = 1;
    while (proto && proto !== Object.prototype) {
      console.log(`Prototype level ${level}:`, proto.constructor.name);
      console.log(
        `Methods at level ${level}:`,
        Object.getOwnPropertyNames(proto)
      );
      proto = Object.getPrototypeOf(proto);
      level++;
    }

    // Property descriptors
    Object.getOwnPropertyNames(obj).forEach((prop) => {
      const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
      console.log(`Property "${prop}":`, descriptor);
    });
  }

  static checkMethod(obj, methodName) {
    if (typeof obj[methodName] === "function") {
      console.log(`✅ ${methodName} is available`);
      console.log(`Method source:`, obj[methodName].toString());
    } else {
      console.log(`❌ ${methodName} is not available`);
    }
  }
}

// Usage
const obj = new SomeClass();
ObjectInspector.inspect(obj);
ObjectInspector.checkMethod(obj, "someMethod");
```

### 3. Error Handling and Validation

```javascript
class ValidatedClass {
  constructor(data) {
    this.validateConstructorArgs(data);
    this.data = data;
  }

  validateConstructorArgs(data) {
    if (!data) {
      throw new Error("Data is required");
    }

    if (typeof data !== "object") {
      throw new Error("Data must be an object");
    }

    console.log("✅ Constructor arguments are valid");
  }

  process() {
    try {
      this.validateState();
      return this.doProcess();
    } catch (error) {
      console.error("Process failed:", error.message);
      console.error("Object state:", this);
      throw error;
    }
  }

  validateState() {
    if (!this.data) {
      throw new Error("Invalid state: data is missing");
    }

    console.log("✅ Object state is valid");
  }

  doProcess() {
    // Processing logic here
    return "processed";
  }
}
```

### 4. Performance Debugging

```javascript
class PerformanceDebugger {
  static timeMethod(obj, methodName) {
    const originalMethod = obj[methodName];

    obj[methodName] = function (...args) {
      const start = performance.now();
      const result = originalMethod.apply(this, args);
      const end = performance.now();

      console.log(`${methodName} took ${end - start} milliseconds`);
      return result;
    };
  }

  static countCalls(obj, methodName) {
    let callCount = 0;
    const originalMethod = obj[methodName];

    obj[methodName] = function (...args) {
      callCount++;
      console.log(`${methodName} called ${callCount} times`);
      return originalMethod.apply(this, args);
    };
  }

  static memoryUsage() {
    if (performance.memory) {
      console.log("Memory usage:", {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      });
    }
  }
}

// Usage
const obj = new SomeClass();
PerformanceDebugger.timeMethod(obj, "expensiveMethod");
PerformanceDebugger.countCalls(obj, "frequentMethod");
```

## 🛠️ Browser DevTools for OOP Debugging

### 1. Using Breakpoints Effectively

```javascript
class BreakpointExample {
  constructor(data) {
    debugger; // Automatic breakpoint
    this.data = data;
  }

  process() {
    // Set conditional breakpoint: this.data.length > 100
    console.log("Processing data of length:", this.data.length);

    for (let i = 0; i < this.data.length; i++) {
      // Set breakpoint here to inspect each iteration
      this.processItem(this.data[i]);
    }
  }

  processItem(item) {
    // Inspect 'item' and 'this' in scope
    return item * 2;
  }
}
```

### 2. Console Commands for Debugging

```javascript
// In browser console:

// Inspect object prototype chain
console.dir(myObject);

// Check if object is instance of class
myObject instanceof MyClass;

// Get all property names (including inherited)
Object.getOwnPropertyNames(myObject);

// Check property descriptor
Object.getOwnPropertyDescriptor(myObject, "propertyName");

// Monitor function calls
monitor(myObject.methodName);
unmonitor(myObject.methodName);

// Profile performance
console.profile("MyProfile");
// ... code to profile ...
console.profileEnd("MyProfile");
```

## 🧪 Unit Testing for OOP Debugging

```javascript
// Simple test framework for OOP classes
class SimpleTest {
  static assertEqual(actual, expected, message) {
    if (actual === expected) {
      console.log("✅ PASS:", message);
    } else {
      console.error("❌ FAIL:", message);
      console.error("Expected:", expected);
      console.error("Actual:", actual);
    }
  }

  static assertThrows(fn, message) {
    try {
      fn();
      console.error(
        "❌ FAIL:",
        message,
        "- Expected error but none was thrown"
      );
    } catch (error) {
      console.log("✅ PASS:", message, "- Error thrown as expected");
    }
  }

  static testClass(ClassConstructor, tests) {
    console.log(`Testing ${ClassConstructor.name}:`);

    tests.forEach((test) => {
      try {
        test();
      } catch (error) {
        console.error("❌ Test failed:", error.message);
      }
    });
  }
}

// Usage
SimpleTest.testClass(Calculator, [
  () => {
    const calc = new Calculator();
    SimpleTest.assertEqual(calc.add(2, 3), 5, "Addition works");
  },
  () => {
    const calc = new Calculator();
    SimpleTest.assertThrows(
      () => calc.divide(5, 0),
      "Division by zero throws error"
    );
  }
]);
```

## 📋 Debugging Checklist

### Before Writing Code

- [ ] Plan your class hierarchy
- [ ] Define clear interfaces
- [ ] Consider error conditions

### While Writing Code

- [ ] Use descriptive variable names
- [ ] Add logging for complex operations
- [ ] Validate inputs and state
- [ ] Handle edge cases

### When Debugging

- [ ] Reproduce the issue consistently
- [ ] Check `this` binding
- [ ] Verify prototype chain
- [ ] Inspect object state
- [ ] Use breakpoints strategically
- [ ] Test with minimal examples

### Common Debugging Questions

- [ ] Is `this` what I expect it to be?
- [ ] Are my constructor arguments correct?
- [ ] Is inheritance set up properly?
- [ ] Are there memory leaks?
- [ ] Am I calling `super()` correctly?
- [ ] Are private members truly private?

## 🎯 Pro Tips

1. **Use TypeScript** for better error catching
2. **Write tests first** to clarify expected behavior
3. **Use ESLint** with OOP-specific rules
4. **Profile memory usage** regularly
5. **Document complex inheritance** chains
6. **Use debugger statements** strategically
7. **Keep methods small** for easier debugging
8. **Log object state** at key points
