# OOP Performance Considerations

This guide covers performance optimization techniques specific to object-oriented JavaScript programming.

## 🎯 Object Creation Performance

### 1. Constructor vs Factory Functions vs Object.create

```javascript
// Performance comparison
const iterations = 1000000;

// Constructor Function (Fastest)
function PersonConstructor(name, age) {
  this.name = name;
  this.age = age;
}
PersonConstructor.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

// Factory Function (Slower)
function createPerson(name, age) {
  return {
    name: name,
    age: age,
    greet: function () {
      return `Hello, I'm ${this.name}`;
    }
  };
}

// Object.create (Middle ground)
const PersonPrototype = {
  init: function (name, age) {
    this.name = name;
    this.age = age;
    return this;
  },
  greet: function () {
    return `Hello, I'm ${this.name}`;
  }
};

function createPersonWithPrototype(name, age) {
  return Object.create(PersonPrototype).init(name, age);
}

// Benchmark function
function benchmark(name, fn) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    fn();
  }
  const end = performance.now();
  console.log(`${name}: ${end - start}ms`);
}

// Run benchmarks
benchmark("Constructor", () => new PersonConstructor("John", 30));
benchmark("Factory", () => createPerson("John", 30));
benchmark("Object.create", () => createPersonWithPrototype("John", 30));
```

### 2. Class vs Function Performance

```javascript
// ES6 Class
class PersonClass {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

// Equivalent Function
function PersonFunction(name, age) {
  this.name = name;
  this.age = age;
}
PersonFunction.prototype.greet = function () {
  return `Hello, I'm ${this.name}`;
};

// Both compile to similar code and have similar performance
// Choose based on readability and team preferences
```

## 🏠 Memory Management

### 1. Object Pooling for Frequently Created Objects

```javascript
class ObjectPool {
  constructor(createFn, resetFn, maxSize = 100) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
    this.maxSize = maxSize;
    this.created = 0;
    this.reused = 0;
  }

  acquire() {
    if (this.pool.length > 0) {
      this.reused++;
      return this.pool.pop();
    }

    this.created++;
    return this.createFn();
  }

  release(obj) {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj);
      this.pool.push(obj);
    }
  }

  getStats() {
    return {
      created: this.created,
      reused: this.reused,
      poolSize: this.pool.length,
      reusageRate: this.reused / (this.created + this.reused)
    };
  }
}

// Example: Particle system
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.life = 1.0;
    this.active = false;
  }

  init(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.active = true;
    return this;
  }

  update(dt) {
    if (!this.active) return;

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;

    if (this.life <= 0) {
      this.active = false;
    }
  }
}

// Usage
const particlePool = new ObjectPool(
  () => new Particle(),
  (particle) => particle.reset(),
  1000
);

class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  emit(x, y, vx, vy) {
    const particle = particlePool.acquire().init(x, y, vx, vy);
    this.particles.push(particle);
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update(dt);

      if (!particle.active) {
        particlePool.release(particle);
        this.particles.splice(i, 1);
      }
    }
  }
}
```

### 2. Avoiding Memory Leaks

```javascript
// ❌ Memory leak: Circular reference
class Parent {
  constructor(name) {
    this.name = name;
    this.children = [];
  }

  addChild(child) {
    this.children.push(child);
    child.parent = this; // Circular reference
  }
}

// ✅ Better: Use WeakMap for relationships
const parentChildMap = new WeakMap();
const childParentMap = new WeakMap();

class Parent {
  constructor(name) {
    this.name = name;
    parentChildMap.set(this, []);
  }

  addChild(child) {
    const children = parentChildMap.get(this);
    children.push(child);
    childParentMap.set(child, this);
  }

  getChildren() {
    return parentChildMap.get(this) || [];
  }

  static getParent(child) {
    return childParentMap.get(child);
  }
}

// ✅ Cleanup event listeners
class EventManager {
  constructor() {
    this.listeners = new Map();
    this.abortController = new AbortController();
  }

  addEventListener(element, event, handler) {
    element.addEventListener(event, handler, {
      signal: this.abortController.signal
    });
  }

  destroy() {
    // Removes all event listeners at once
    this.abortController.abort();
    this.listeners.clear();
  }
}
```

## ⚡ Method Performance

### 1. Method Lookup Optimization

```javascript
// ❌ Slow: Deep prototype chain
class A {
  methodA() {
    return "A";
  }
}

class B extends A {
  methodB() {
    return "B";
  }
}

class C extends B {
  methodC() {
    return "C";
  }
}

class D extends C {
  methodD() {
    return "D";
  }
}

// Method lookup goes through: D -> C -> B -> A

// ✅ Better: Flatten hierarchy or cache methods
class OptimizedD {
  constructor() {
    // Cache frequently used methods
    this.methodA = A.prototype.methodA;
    this.methodB = B.prototype.methodB;
    this.methodC = C.prototype.methodC;
  }

  methodD() {
    return "D";
  }
}
```

### 2. Property Access Optimization

```javascript
class OptimizedClass {
  constructor() {
    // ✅ Define all properties in constructor for V8 optimization
    this.prop1 = null;
    this.prop2 = null;
    this.prop3 = null;
    this.prop4 = null;

    // Initialize after declaration
    this.init();
  }

  init() {
    this.prop1 = "value1";
    this.prop2 = "value2";
    this.prop3 = "value3";
    this.prop4 = "value4";
  }

  // ❌ Avoid adding properties later (changes hidden class)
  addPropertyLater() {
    this.newProp = "new value"; // Causes deoptimization
  }
}

// ✅ Better: Define all properties upfront
class BetterOptimizedClass {
  constructor() {
    this.prop1 = "value1";
    this.prop2 = "value2";
    this.prop3 = "value3";
    this.prop4 = "value4";
    this.newProp = null; // Define even if unused initially
  }

  setNewProp(value) {
    this.newProp = value; // No deoptimization
  }
}
```

### 3. Method Binding Performance

```javascript
class EventHandler {
  constructor() {
    this.count = 0;

    // ❌ Slow: Creates new function each time
    this.badHandler = () => {
      this.count++;
    };

    // ✅ Better: Bind once
    this.goodHandler = this.handleEvent.bind(this);
  }

  handleEvent() {
    this.count++;
  }

  // ❌ Creates new function on each render/call
  render() {
    element.addEventListener("click", () => this.count++);
  }

  // ✅ Reuses bound function
  betterRender() {
    element.addEventListener("click", this.goodHandler);
  }
}
```

## 🔄 Inheritance Performance

### 1. Composition vs Inheritance Performance

```javascript
// Inheritance (can be slower due to prototype chain)
class Animal {
  move() {
    return "moving";
  }

  eat() {
    return "eating";
  }
}

class Bird extends Animal {
  fly() {
    return "flying";
  }
}

class FlyingBird extends Bird {
  soar() {
    return "soaring";
  }
}

// Composition (often faster, more flexible)
class MovementBehavior {
  move() {
    return "moving";
  }
}

class FlyingBehavior {
  fly() {
    return "flying";
  }

  soar() {
    return "soaring";
  }
}

class EatingBehavior {
  eat() {
    return "eating";
  }
}

class ComposedBird {
  constructor() {
    this.movement = new MovementBehavior();
    this.flying = new FlyingBehavior();
    this.eating = new EatingBehavior();
  }

  move() {
    return this.movement.move();
  }

  fly() {
    return this.flying.fly();
  }

  soar() {
    return this.flying.soar();
  }

  eat() {
    return this.eating.eat();
  }
}
```

### 2. Mixin Performance

```javascript
// ✅ Efficient mixin implementation
const mixins = {
  flying: {
    fly() {
      return `${this.name} is flying`;
    },

    land() {
      return `${this.name} has landed`;
    }
  },

  swimming: {
    swim() {
      return `${this.name} is swimming`;
    },

    dive() {
      return `${this.name} is diving`;
    }
  }
};

function applyMixins(target, ...mixinObjects) {
  mixinObjects.forEach((mixin) => {
    Object.getOwnPropertyNames(mixin).forEach((name) => {
      if (name !== "constructor") {
        target.prototype[name] = mixin[name];
      }
    });
  });
}

class Duck {
  constructor(name) {
    this.name = name;
  }
}

// Apply mixins once at class definition time
applyMixins(Duck, mixins.flying, mixins.swimming);

const duck = new Duck("Donald");
console.log(duck.fly()); // Fast method lookup
console.log(duck.swim()); // Fast method lookup
```

## 📊 Performance Monitoring

### 1. Performance Measurement Utilities

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  startTimer(name) {
    this.metrics.set(name, performance.now());
  }

  endTimer(name) {
    const startTime = this.metrics.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`${name}: ${duration.toFixed(2)}ms`);
      this.metrics.delete(name);
      return duration;
    }
  }

  measureMethod(obj, methodName) {
    const original = obj[methodName];
    obj[methodName] = function (...args) {
      const start = performance.now();
      const result = original.apply(this, args);
      const end = performance.now();
      console.log(`${methodName}: ${(end - start).toFixed(2)}ms`);
      return result;
    };
  }

  measureAllMethods(obj) {
    const proto = Object.getPrototypeOf(obj);
    Object.getOwnPropertyNames(proto).forEach((name) => {
      if (typeof obj[name] === "function" && name !== "constructor") {
        this.measureMethod(obj, name);
      }
    });
  }

  memoryUsage() {
    if (performance.memory) {
      return {
        used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }
}

// Usage
const monitor = new PerformanceMonitor();

class TestClass {
  expensiveOperation() {
    // Simulate expensive operation
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += Math.random();
    }
    return sum;
  }
}

const test = new TestClass();
monitor.measureMethod(test, "expensiveOperation");
test.expensiveOperation(); // Will log timing
```

### 2. Memory Leak Detection

```javascript
class MemoryLeakDetector {
  constructor() {
    this.objects = new WeakSet();
    this.counters = new Map();
  }

  register(obj, type = "object") {
    this.objects.add(obj);

    const count = this.counters.get(type) || 0;
    this.counters.set(type, count + 1);

    // Add finalizer to detect when object is garbage collected
    if (typeof FinalizationRegistry !== "undefined") {
      const registry = new FinalizationRegistry((type) => {
        const count = this.counters.get(type) || 0;
        this.counters.set(type, Math.max(0, count - 1));
      });
      registry.register(obj, type);
    }
  }

  getStats() {
    return new Map(this.counters);
  }

  forceGC() {
    if (global.gc) {
      global.gc();
    } else if (window.gc) {
      window.gc();
    } else {
      console.warn("Garbage collection not available");
    }
  }
}

// Usage
const detector = new MemoryLeakDetector();

class TestObject {
  constructor() {
    detector.register(this, "TestObject");
  }
}
```

## 📈 Optimization Strategies

### 1. Lazy Initialization

```javascript
class LazyInitialization {
  constructor() {
    this._expensiveResource = null;
    this._cache = null;
  }

  get expensiveResource() {
    if (!this._expensiveResource) {
      console.log("Initializing expensive resource...");
      this._expensiveResource = this.createExpensiveResource();
    }
    return this._expensiveResource;
  }

  get cache() {
    if (!this._cache) {
      this._cache = new Map();
    }
    return this._cache;
  }

  createExpensiveResource() {
    // Simulate expensive initialization
    return { initialized: true, data: new Array(1000000).fill(0) };
  }
}
```

### 2. Method Caching

```javascript
class CachedCalculator {
  constructor() {
    this.cache = new Map();
  }

  expensiveCalculation(input) {
    const cacheKey = JSON.stringify(input);

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Simulate expensive calculation
    const result = input.reduce((sum, num) => sum + Math.pow(num, 2), 0);

    this.cache.set(cacheKey, result);
    return result;
  }

  clearCache() {
    this.cache.clear();
  }
}
```

### 3. Prototype Method Optimization

```javascript
// ✅ Optimize prototype methods for frequently called functions
class OptimizedArray {
  constructor(items = []) {
    this.items = items;

    // Pre-bind frequently used methods if needed
    this.forEach = this.forEach.bind(this);
  }

  // Fast path for common operations
  push(item) {
    this.items[this.items.length] = item; // Faster than this.items.push(item)
  }

  // Use for loop instead of array methods for performance-critical code
  forEach(callback) {
    for (let i = 0; i < this.items.length; i++) {
      callback(this.items[i], i, this.items);
    }
  }

  // Cache length property
  get length() {
    return this.items.length;
  }
}
```

## 📋 Performance Checklist

### Object Creation

- [ ] Use constructor functions or classes for frequently created objects
- [ ] Implement object pooling for short-lived objects
- [ ] Define all properties in constructor
- [ ] Avoid adding properties after object creation

### Memory Management

- [ ] Break circular references
- [ ] Use WeakMap/WeakSet for object relationships
- [ ] Clean up event listeners and timers
- [ ] Monitor memory usage

### Method Performance

- [ ] Keep prototype chains shallow
- [ ] Cache frequently used methods
- [ ] Use composition over deep inheritance
- [ ] Bind methods once, not repeatedly

### Optimization Techniques

- [ ] Implement lazy initialization
- [ ] Use caching for expensive calculations
- [ ] Profile and measure performance
- [ ] Avoid premature optimization

## 🎯 Key Takeaways

1. **Measure first** - Profile before optimizing
2. **Object pooling** helps with frequent allocations
3. **Shallow inheritance** is faster than deep chains
4. **Composition** often performs better than inheritance
5. **Cache expensive operations** when possible
6. **Clean up resources** to prevent memory leaks
7. **Define properties early** for V8 optimization
8. **Use native methods** when possible
