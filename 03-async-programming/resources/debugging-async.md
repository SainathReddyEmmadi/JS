# Debugging Async JavaScript 🐛

## Overview

Debugging asynchronous code presents unique challenges compared to synchronous code. This guide covers tools, techniques, and strategies for effectively debugging async JavaScript applications.

## Common Async Debugging Challenges

### 1. Asynchronous Stack Traces

**Problem**: Stack traces from async operations often lose context of where the operation originated.

**Example of Confusing Stack Trace**:

```javascript
async function problematicFunction() {
  const data = await fetchData();
  return processData(data); // Error occurs here
}

async function fetchData() {
  throw new Error("Network error");
}

// Stack trace will show fetchData but not the calling context
```

**Solutions**:

```javascript
// 1. Use async stack traces in modern browsers
async function betterErrorHandling() {
  try {
    const data = await fetchData();
    return processData(data);
  } catch (error) {
    console.error("Error in betterErrorHandling:", error);
    // Add context to the error
    throw new Error(`Failed to process data: ${error.message}`);
  }
}

// 2. Create error chains with context
class AsyncError extends Error {
  constructor(message, cause, context) {
    super(message);
    this.name = "AsyncError";
    this.cause = cause;
    this.context = context;
    this.stack = this.stack + "\\nCaused by: " + cause.stack;
  }
}

async function withContext() {
  try {
    return await problematicFunction();
  } catch (error) {
    throw new AsyncError("Processing failed in withContext", error, {
      operation: "data processing",
      timestamp: Date.now()
    });
  }
}
```

### 2. Race Conditions

**Problem**: Multiple async operations interfering with each other.

**Debugging Tools**:

```javascript
class RaceDetector {
  constructor() {
    this.activeOperations = new Map();
    this.operationHistory = [];
  }

  trackOperation(id, operation) {
    const startTime = Date.now();
    console.log(`🚀 Starting operation: ${id}`);

    if (this.activeOperations.has(id)) {
      console.warn(`⚠️ Race condition detected: ${id} already running`);
    }

    this.activeOperations.set(id, { startTime, operation });

    return operation.finally(() => {
      const endTime = Date.now();
      const duration = endTime - startTime;

      console.log(`✅ Completed operation: ${id} (${duration}ms)`);
      this.activeOperations.delete(id);

      this.operationHistory.push({
        id,
        startTime,
        endTime,
        duration
      });
    });
  }

  getCurrentOperations() {
    return Array.from(this.activeOperations.keys());
  }

  getOperationHistory() {
    return this.operationHistory;
  }
}

// Usage
const raceDetector = new RaceDetector();

async function riskyOperation(id) {
  return raceDetector.trackOperation(
    `operation-${id}`,
    fetch(`/api/data/${id}`).then((r) => r.json())
  );
}
```

### 3. Memory Leaks in Async Code

**Problem**: Unresolved promises and uncleaned resources causing memory leaks.

**Detection and Prevention**:

```javascript
class AsyncResourceTracker {
  constructor() {
    this.activePromises = new Set();
    this.activeTimers = new Set();
    this.activeListeners = new Map();
  }

  trackPromise(promise, description) {
    this.activePromises.add({ promise, description, created: Date.now() });

    promise.finally(() => {
      this.activePromises.forEach((item) => {
        if (item.promise === promise) {
          this.activePromises.delete(item);
        }
      });
    });

    return promise;
  }

  trackTimeout(timeoutId, description) {
    this.activeTimers.add({ timeoutId, description, created: Date.now() });
    return timeoutId;
  }

  clearTimeout(timeoutId) {
    clearTimeout(timeoutId);
    this.activeTimers.forEach((item) => {
      if (item.timeoutId === timeoutId) {
        this.activeTimers.delete(item);
      }
    });
  }

  trackEventListener(element, event, listener, description) {
    const key = `${element.constructor.name}-${event}`;
    if (!this.activeListeners.has(key)) {
      this.activeListeners.set(key, []);
    }

    this.activeListeners.get(key).push({
      element,
      listener,
      description,
      created: Date.now()
    });

    element.addEventListener(event, listener);
  }

  removeEventListener(element, event, listener) {
    const key = `${element.constructor.name}-${event}`;
    const listeners = this.activeListeners.get(key) || [];

    this.activeListeners.set(
      key,
      listeners.filter((item) => item.listener !== listener)
    );

    element.removeEventListener(event, listener);
  }

  getResourceReport() {
    return {
      activePromises: this.activePromises.size,
      activeTimers: this.activeTimers.size,
      activeListeners: Array.from(this.activeListeners.entries()).reduce(
        (total, [, listeners]) => total + listeners.length,
        0
      ),
      details: {
        promises: Array.from(this.activePromises),
        timers: Array.from(this.activeTimers),
        listeners: Array.from(this.activeListeners.entries())
      }
    };
  }
}

// Usage
const resourceTracker = new AsyncResourceTracker();

class Component {
  constructor() {
    this.cleanup = [];
  }

  async initialize() {
    // Track promises
    const dataPromise = resourceTracker.trackPromise(
      fetch("/api/data").then((r) => r.json()),
      "Component data fetch"
    );

    // Track timers
    const timerId = resourceTracker.trackTimeout(
      setTimeout(() => this.refresh(), 5000),
      "Component refresh timer"
    );

    this.cleanup.push(() => resourceTracker.clearTimeout(timerId));

    // Track event listeners
    const handleClick = () => this.handleClick();
    resourceTracker.trackEventListener(
      document,
      "click",
      handleClick,
      "Component click handler"
    );

    this.cleanup.push(() =>
      resourceTracker.removeEventListener(document, "click", handleClick)
    );

    return dataPromise;
  }

  destroy() {
    this.cleanup.forEach((cleanupFn) => cleanupFn());
    this.cleanup = [];
  }
}
```

## Browser Developer Tools for Async Debugging

### 1. Chrome DevTools

```javascript
// Enable async stack traces
// DevTools > Settings > Experiments > "Capture async stack traces"

// Use console.trace() in async functions
async function debugAsyncFlow() {
  console.trace("Async flow checkpoint 1");
  const data = await fetchData();
  console.trace("Async flow checkpoint 2");
  return processData(data);
}

// Use Performance tab to analyze async operations
// Look for:
// - Long running timers
// - Promise resolution timing
// - Event loop blocking
```

### 2. Breakpoint Strategies

```javascript
// 1. Conditional breakpoints for specific async states
async function conditionalDebugging(userId) {
  const user = await fetchUser(userId);

  // Set breakpoint condition: user.role === 'admin'
  if (user.role === "admin") {
    debugger; // This will only trigger for admin users
  }

  return processUser(user);
}

// 2. Async breakpoints with debugger statements
async function asyncBreakpoints() {
  console.log("Before async operation");
  debugger; // Breakpoint 1

  const result = await longRunningOperation();
  debugger; // Breakpoint 2 - after async completion

  console.log("After async operation");
  return result;
}

// 3. Promise breakpoints
function promiseBreakpoints() {
  return fetch("/api/data")
    .then((response) => {
      debugger; // Breakpoint in .then()
      return response.json();
    })
    .catch((error) => {
      debugger; // Breakpoint in .catch()
      throw error;
    });
}
```

### 3. Console Debugging Techniques

```javascript
// 1. Async operation logging
class AsyncLogger {
  static logPromise(promise, label) {
    console.group(`🚀 ${label} - Starting`);
    console.time(label);

    return promise
      .then((result) => {
        console.timeEnd(label);
        console.log("✅ Success:", result);
        console.groupEnd();
        return result;
      })
      .catch((error) => {
        console.timeEnd(label);
        console.error("❌ Error:", error);
        console.groupEnd();
        throw error;
      });
  }

  static logAsyncFunction(asyncFn, label) {
    return async (...args) => {
      return AsyncLogger.logPromise(asyncFn(...args), label);
    };
  }
}

// Usage
const loggedFetch = AsyncLogger.logAsyncFunction(fetch, "API Request");
const result = await loggedFetch("/api/users");

// 2. Promise state monitoring
function monitorPromise(promise, name) {
  const states = { pending: true, resolved: false, rejected: false };

  console.log(`📊 ${name}: pending`);

  promise
    .then((result) => {
      states.pending = false;
      states.resolved = true;
      console.log(`📊 ${name}: resolved`, result);
    })
    .catch((error) => {
      states.pending = false;
      states.rejected = true;
      console.log(`📊 ${name}: rejected`, error);
    });

  return { promise, states };
}

// 3. Async call stack simulation
class AsyncCallStack {
  constructor() {
    this.stack = [];
  }

  enter(functionName, args) {
    this.stack.push({ functionName, args, timestamp: Date.now() });
    console.log(`📥 Entering: ${functionName}`, args);
    console.log(`📚 Stack depth: ${this.stack.length}`);
  }

  exit(functionName, result) {
    const entry = this.stack.pop();
    const duration = Date.now() - entry.timestamp;
    console.log(`📤 Exiting: ${functionName} (${duration}ms)`, result);
    console.log(`📚 Stack depth: ${this.stack.length}`);
  }

  getCurrentStack() {
    return this.stack.map((entry) => entry.functionName);
  }
}

const asyncStack = new AsyncCallStack();

async function trackedAsyncFunction(param) {
  asyncStack.enter("trackedAsyncFunction", { param });

  try {
    const result = await someAsyncOperation(param);
    asyncStack.exit("trackedAsyncFunction", result);
    return result;
  } catch (error) {
    asyncStack.exit("trackedAsyncFunction", error);
    throw error;
  }
}
```

## Testing Async Code

### 1. Unit Testing Async Functions

```javascript
// Using Jest/Vitest
describe("Async Functions", () => {
  test("should handle successful async operation", async () => {
    const result = await asyncFunction("test");
    expect(result).toBe("expected result");
  });

  test("should handle async errors", async () => {
    await expect(asyncFunction("invalid")).rejects.toThrow("Expected error");
  });

  test("should timeout long operations", async () => {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 1000)
    );

    await expect(
      Promise.race([slowAsyncFunction(), timeoutPromise])
    ).rejects.toThrow("Timeout");
  });
});

// Mock async dependencies
const mockFetch = jest.fn();
global.fetch = mockFetch;

test("should handle API errors gracefully", async () => {
  mockFetch.mockRejectedValueOnce(new Error("Network error"));

  const result = await apiFunction();
  expect(result).toBe(null); // Fallback value
});
```

### 2. Integration Testing

```javascript
// Test async workflows
class AsyncWorkflowTester {
  constructor() {
    this.steps = [];
    this.results = [];
  }

  addStep(name, asyncFn) {
    this.steps.push({ name, asyncFn });
    return this;
  }

  async execute() {
    for (const step of this.steps) {
      try {
        const startTime = Date.now();
        const result = await step.asyncFn();
        const duration = Date.now() - startTime;

        this.results.push({
          step: step.name,
          success: true,
          result,
          duration
        });

        console.log(`✅ ${step.name} completed in ${duration}ms`);
      } catch (error) {
        this.results.push({
          step: step.name,
          success: false,
          error: error.message,
          duration: Date.now() - startTime
        });

        console.error(`❌ ${step.name} failed:`, error.message);
        throw error;
      }
    }

    return this.results;
  }
}

// Usage
const workflowTest = new AsyncWorkflowTester()
  .addStep("Initialize", () => initializeApp())
  .addStep("Load User", () => loadUserData())
  .addStep("Fetch Permissions", () => fetchUserPermissions())
  .addStep("Render UI", () => renderUserInterface());

const results = await workflowTest.execute();
```

## Performance Debugging

### 1. Timing Analysis

```javascript
class PerformanceProfiler {
  constructor() {
    this.measurements = new Map();
  }

  startMeasurement(name) {
    this.measurements.set(name, {
      start: performance.now(),
      marks: []
    });
    performance.mark(`${name}-start`);
  }

  addMark(name, description) {
    const measurement = this.measurements.get(name);
    if (measurement) {
      const markTime = performance.now();
      measurement.marks.push({
        description,
        time: markTime,
        elapsed: markTime - measurement.start
      });
      performance.mark(`${name}-${description}`);
    }
  }

  endMeasurement(name) {
    const measurement = this.measurements.get(name);
    if (measurement) {
      measurement.end = performance.now();
      measurement.duration = measurement.end - measurement.start;
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);

      return measurement;
    }
  }

  getReport(name) {
    const measurement = this.measurements.get(name);
    if (measurement) {
      return {
        totalDuration: measurement.duration,
        marks: measurement.marks,
        breakdown: measurement.marks.map((mark, index) => ({
          phase: mark.description,
          duration:
            index === 0
              ? mark.elapsed
              : mark.elapsed - measurement.marks[index - 1].elapsed
        }))
      };
    }
  }
}

// Usage
async function profiledAsyncOperation() {
  const profiler = new PerformanceProfiler();
  profiler.startMeasurement("dataProcessing");

  profiler.addMark("dataProcessing", "fetchStarted");
  const data = await fetchData();

  profiler.addMark("dataProcessing", "fetchCompleted");
  const processed = await processData(data);

  profiler.addMark("dataProcessing", "processCompleted");
  const result = await saveData(processed);

  const report = profiler.endMeasurement("dataProcessing");
  console.log("Performance Report:", profiler.getReport("dataProcessing"));

  return result;
}
```

### 2. Memory Usage Monitoring

```javascript
class MemoryMonitor {
  constructor() {
    this.snapshots = [];
    this.isMonitoring = false;
  }

  startMonitoring(interval = 1000) {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      if (performance.memory) {
        this.snapshots.push({
          timestamp: Date.now(),
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit
        });
      }
    }, interval);
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.isMonitoring = false;
    }
  }

  getMemoryTrend() {
    if (this.snapshots.length < 2) return null;

    const first = this.snapshots[0];
    const last = this.snapshots[this.snapshots.length - 1];

    return {
      growth: last.used - first.used,
      duration: last.timestamp - first.timestamp,
      growthRate: (last.used - first.used) / (last.timestamp - first.timestamp),
      peak: Math.max(...this.snapshots.map((s) => s.used)),
      current: last.used
    };
  }

  detectMemoryLeaks() {
    const trend = this.getMemoryTrend();
    if (!trend) return null;

    const leakThreshold = 1024 * 1024; // 1MB growth
    const timeThreshold = 30000; // 30 seconds

    if (trend.growth > leakThreshold && trend.duration > timeThreshold) {
      return {
        detected: true,
        growthMB: trend.growth / (1024 * 1024),
        rateKBPerSecond: trend.growthRate / 1024,
        recommendation:
          "Check for unresolved promises, uncleaned timers, or retained references"
      };
    }

    return { detected: false };
  }
}

// Usage
const memoryMonitor = new MemoryMonitor();
memoryMonitor.startMonitoring();

// Run your async operations...
await longRunningAsyncProcess();

// Check for leaks
const leakReport = memoryMonitor.detectMemoryLeaks();
console.log("Memory leak analysis:", leakReport);

memoryMonitor.stopMonitoring();
```

## Common Debugging Patterns

### 1. The "Async Wrapper" Pattern

```javascript
function debugAsync(fn, name) {
  return async function (...args) {
    console.group(`🔍 Debugging: ${name}`);
    console.log("Arguments:", args);

    try {
      const result = await fn.apply(this, args);
      console.log("✅ Result:", result);
      console.groupEnd();
      return result;
    } catch (error) {
      console.error("❌ Error:", error);
      console.groupEnd();
      throw error;
    }
  };
}

// Usage
const debuggedFetch = debugAsync(fetch, "API Request");
const response = await debuggedFetch("/api/users");
```

### 2. The "State Snapshot" Pattern

```javascript
class StateSnapshotter {
  constructor() {
    this.snapshots = [];
  }

  capture(label, state) {
    this.snapshots.push({
      label,
      timestamp: Date.now(),
      state: JSON.parse(JSON.stringify(state)) // Deep clone
    });
  }

  getDiff(index1, index2) {
    const snap1 = this.snapshots[index1];
    const snap2 = this.snapshots[index2];

    if (!snap1 || !snap2) return null;

    return {
      from: snap1.label,
      to: snap2.label,
      duration: snap2.timestamp - snap1.timestamp,
      changes: this.deepDiff(snap1.state, snap2.state)
    };
  }

  deepDiff(obj1, obj2) {
    const diff = {};

    for (const key in obj2) {
      if (obj1[key] !== obj2[key]) {
        diff[key] = { from: obj1[key], to: obj2[key] };
      }
    }

    return diff;
  }
}

// Usage in async workflow
const snapshotter = new StateSnapshotter();
let appState = { users: [], loading: false, error: null };

async function loadUsers() {
  snapshotter.capture("Before loading", appState);

  appState.loading = true;
  snapshotter.capture("Loading started", appState);

  try {
    appState.users = await fetchUsers();
    appState.loading = false;
    snapshotter.capture("Loading completed", appState);
  } catch (error) {
    appState.error = error.message;
    appState.loading = false;
    snapshotter.capture("Loading failed", appState);
  }

  const diff = snapshotter.getDiff(0, snapshotter.snapshots.length - 1);
  console.log("State changes:", diff);
}
```

## Best Practices for Async Debugging

### 1. Always Use Descriptive Error Messages

```javascript
// ❌ Bad
throw new Error("Failed");

// ✅ Good
throw new Error(
  `Failed to fetch user data for ID ${userId}: ${originalError.message}`
);
```

### 2. Add Context to Promise Chains

```javascript
// ❌ Hard to debug
fetch("/api/users")
  .then((r) => r.json())
  .then((users) => users.map((u) => u.name))
  .then((names) => names.join(", "));

// ✅ Easy to debug
fetch("/api/users")
  .then((response) => {
    console.log("Fetch response:", response.status);
    return response.json();
  })
  .then((users) => {
    console.log("Parsed users:", users.length);
    return users.map((u) => u.name);
  })
  .then((names) => {
    console.log("Extracted names:", names);
    return names.join(", ");
  })
  .catch((error) => {
    console.error("Pipeline failed:", error);
    throw error;
  });
```

### 3. Use Timeout Guards

```javascript
function withTimeout(promise, timeoutMs, operation) {
  const timeout = new Promise((_, reject) =>
    setTimeout(
      () => reject(new Error(`${operation} timed out after ${timeoutMs}ms`)),
      timeoutMs
    )
  );

  return Promise.race([promise, timeout]);
}

// Usage
const result = await withTimeout(
  fetch("/api/slow-endpoint"),
  5000,
  "API request"
);
```

Remember: Good async debugging is about visibility, context, and patience. Use these tools and techniques to make the invisible visible! 🔍
