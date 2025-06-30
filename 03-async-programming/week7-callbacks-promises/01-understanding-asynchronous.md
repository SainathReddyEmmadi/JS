# Understanding Asynchronous Programming

## Learning Objectives

By the end of this lesson, you should be able to:

- Understand the difference between synchronous and asynchronous programming
- Explain how JavaScript's event loop works
- Identify when to use asynchronous operations
- Understand the call stack, task queue, and event loop interaction
- Recognize common asynchronous operations in web development

## What is Asynchronous Programming?

### Synchronous vs Asynchronous

**Synchronous (Blocking) Code:**

```javascript
console.log("Start");

// This blocks the execution
function expensiveOperation() {
  let result = 0;
  for (let i = 0; i < 1000000000; i++) {
    result += i;
  }
  return result;
}

console.log("Before expensive operation");
const result = expensiveOperation(); // Blocks here
console.log("After expensive operation:", result);
console.log("End");

// Output (in order):
// Start
// Before expensive operation
// (long pause)
// After expensive operation: [big number]
// End
```

**Asynchronous (Non-blocking) Code:**

```javascript
console.log("Start");

console.log("Before setTimeout");
setTimeout(() => {
  console.log("Inside setTimeout");
}, 1000);

console.log("After setTimeout");
console.log("End");

// Output (immediate):
// Start
// Before setTimeout
// After setTimeout
// End
// (1 second later):
// Inside setTimeout
```

### Why Asynchronous Programming Matters

#### In Web Browsers

```javascript
// ❌ Bad: Blocking the UI
function fetchDataSynchronously() {
  // Imagine this takes 3 seconds
  const data = makeSlowNetworkRequest();
  updateUI(data);
  // User can't interact with the page for 3 seconds!
}

// ✅ Good: Non-blocking
function fetchDataAsynchronously() {
  showLoadingSpinner();

  makeAsyncNetworkRequest()
    .then((data) => {
      hideLoadingSpinner();
      updateUI(data);
      // User can still interact while waiting!
    })
    .catch((error) => {
      hideLoadingSpinner();
      showErrorMessage(error);
    });
}
```

## The JavaScript Event Loop

### Core Components

#### 1. Call Stack

```javascript
function first() {
  console.log("First function");
  second();
}

function second() {
  console.log("Second function");
  third();
}

function third() {
  console.log("Third function");
}

first();

// Call Stack Execution:
// 1. first() is pushed onto stack
// 2. second() is pushed onto stack
// 3. third() is pushed onto stack
// 4. third() completes and is popped
// 5. second() completes and is popped
// 6. first() completes and is popped
```

#### 2. Web APIs / Browser APIs

```javascript
// These operations are handled by Browser APIs, not JavaScript
setTimeout(() => console.log("Timer"), 1000); // Timer API
fetch("https://api.example.com/data"); // Network API
document.addEventListener("click", handler); // DOM API
```

#### 3. Task Queue (Callback Queue)

```javascript
console.log("1");

setTimeout(() => console.log("2"), 0); // Goes to Task Queue

console.log("3");

// Output:
// 1
// 3
// 2

// Even with 0ms delay, setTimeout goes through the event loop!
```

#### 4. Event Loop

```javascript
// Event Loop Process:
// 1. Execute all synchronous code (call stack)
// 2. When call stack is empty, check task queue
// 3. Move first task from queue to call stack
// 4. Repeat

function eventLoopDemo() {
  console.log("Start");

  setTimeout(() => console.log("Timeout 1"), 0);
  setTimeout(() => console.log("Timeout 2"), 0);

  Promise.resolve().then(() => console.log("Promise"));

  console.log("End");
}

eventLoopDemo();

// Output:
// Start
// End
// Promise
// Timeout 1
// Timeout 2
```

### Visualizing the Event Loop

```javascript
// Let's trace through this step by step
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
});

console.log("D");

// Step-by-step execution:
// 1. console.log('A') - Call Stack → Output: A
// 2. setTimeout - Web API (Timer) → Callback queued
// 3. Promise.resolve().then - Microtask Queue → Higher priority
// 4. console.log('D') - Call Stack → Output: D
// 5. Call stack empty, check Microtask Queue → Output: C
// 6. Microtask Queue empty, check Task Queue → Output: B

// Final Output:
// A
// D
// C
// B
```

## Types of Asynchronous Operations

### 1. Timers

```javascript
// setTimeout - Execute once after delay
setTimeout(() => {
  console.log("Executed after 2 seconds");
}, 2000);

// setInterval - Execute repeatedly
const intervalId = setInterval(() => {
  console.log("Executed every second");
}, 1000);

// Clear interval after 5 seconds
setTimeout(() => {
  clearInterval(intervalId);
  console.log("Interval cleared");
}, 5000);

// Immediate execution (next tick)
setTimeout(() => {
  console.log("Next tick");
}, 0);
```

### 2. Network Requests

```javascript
// Fetch API (returns a Promise)
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((response) => response.json())
  .then((data) => {
    console.log("Post title:", data.title);
  })
  .catch((error) => {
    console.error("Network error:", error);
  });

// XMLHttpRequest (older approach)
const xhr = new XMLHttpRequest();
xhr.open("GET", "https://jsonplaceholder.typicode.com/posts/1");
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    console.log("Post title:", data.title);
  }
};
xhr.send();
```

### 3. DOM Events

```javascript
// Event listeners are asynchronous
document.getElementById("button").addEventListener("click", function () {
  console.log("Button clicked!");
  // This code runs when the event occurs, not immediately
});

// Multiple event listeners
const button = document.getElementById("button");
button.addEventListener("mouseenter", () => console.log("Mouse entered"));
button.addEventListener("mouseleave", () => console.log("Mouse left"));
button.addEventListener("focus", () => console.log("Button focused"));
```

### 4. File Operations

```javascript
// Reading files (in modern browsers)
const fileInput = document.getElementById("file-input");
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    console.log("File content:", e.target.result);
  };

  reader.onerror = function (e) {
    console.error("File reading error:", e);
  };

  reader.readAsText(file);
});
```

## Common Asynchronous Patterns

### 1. Loading Data with Feedback

```javascript
function loadUserData(userId) {
  // Show loading state
  showLoadingSpinner();
  updateStatus("Loading user data...");

  // Fetch data asynchronously
  fetch(`/api/users/${userId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((userData) => {
      hideLoadingSpinner();
      displayUserData(userData);
      updateStatus("User data loaded successfully");
    })
    .catch((error) => {
      hideLoadingSpinner();
      showErrorMessage(`Failed to load user data: ${error.message}`);
      updateStatus("Error loading user data");
    });
}

function showLoadingSpinner() {
  document.getElementById("spinner").style.display = "block";
}

function hideLoadingSpinner() {
  document.getElementById("spinner").style.display = "none";
}

function updateStatus(message) {
  document.getElementById("status").textContent = message;
}
```

### 2. Debounced Search

```javascript
function createDebouncedSearch(delay = 300) {
  let timeoutId;

  return function (searchTerm) {
    // Clear previous timeout
    clearTimeout(timeoutId);

    // Set new timeout
    timeoutId = setTimeout(() => {
      performSearch(searchTerm);
    }, delay);
  };
}

const debouncedSearch = createDebouncedSearch(300);

document.getElementById("search-input").addEventListener("input", (e) => {
  const searchTerm = e.target.value.trim();

  if (searchTerm.length >= 2) {
    debouncedSearch(searchTerm);
  }
});

function performSearch(term) {
  console.log("Searching for:", term);

  fetch(`/api/search?q=${encodeURIComponent(term)}`)
    .then((response) => response.json())
    .then((results) => {
      displaySearchResults(results);
    })
    .catch((error) => {
      console.error("Search error:", error);
    });
}
```

### 3. Progress Tracking

```javascript
function uploadFileWithProgress(file) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        updateProgressBar(percentComplete);
      }
    });

    // Handle completion
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    // Handle errors
    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    // Start upload
    const formData = new FormData();
    formData.append("file", file);

    xhr.open("POST", "/api/upload");
    xhr.send(formData);
  });
}

function updateProgressBar(percent) {
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  progressBar.style.width = `${percent}%`;
  progressText.textContent = `${Math.round(percent)}%`;
}
```

## Understanding Async Flow Control

### Sequential vs Parallel Execution

```javascript
// Sequential execution (one after another)
async function sequentialExample() {
  console.log("Starting sequential operations...");

  const start = Date.now();

  const result1 = await fetch("/api/data1").then((r) => r.json());
  console.log("Got result 1:", result1);

  const result2 = await fetch("/api/data2").then((r) => r.json());
  console.log("Got result 2:", result2);

  const result3 = await fetch("/api/data3").then((r) => r.json());
  console.log("Got result 3:", result3);

  const end = Date.now();
  console.log(`Sequential took ${end - start}ms`);

  return [result1, result2, result3];
}

// Parallel execution (all at once)
async function parallelExample() {
  console.log("Starting parallel operations...");

  const start = Date.now();

  const [result1, result2, result3] = await Promise.all([
    fetch("/api/data1").then((r) => r.json()),
    fetch("/api/data2").then((r) => r.json()),
    fetch("/api/data3").then((r) => r.json())
  ]);

  console.log("Got all results:", { result1, result2, result3 });

  const end = Date.now();
  console.log(`Parallel took ${end - start}ms`);

  return [result1, result2, result3];
}
```

## Async Programming Challenges

### 1. Race Conditions

```javascript
// ❌ Race condition - unreliable order
let counter = 0;

function incrementAsync() {
  setTimeout(() => {
    const current = counter;
    // Simulate some async work
    setTimeout(() => {
      counter = current + 1;
      console.log("Counter:", counter);
    }, Math.random() * 100);
  }, Math.random() * 100);
}

// These might not increment in order!
incrementAsync();
incrementAsync();
incrementAsync();

// ✅ Solution - use proper async coordination
class AsyncCounter {
  constructor() {
    this.counter = 0;
    this.queue = Promise.resolve();
  }

  async increment() {
    this.queue = this.queue.then(async () => {
      const current = this.counter;
      // Simulate async work
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 100));
      this.counter = current + 1;
      console.log("Counter:", this.counter);
    });

    return this.queue;
  }
}

const asyncCounter = new AsyncCounter();
asyncCounter.increment();
asyncCounter.increment();
asyncCounter.increment();
```

### 2. Memory Leaks with Timers

```javascript
// ❌ Memory leak - timer never cleared
function startTimer() {
  const intervalId = setInterval(() => {
    console.log("Timer tick");
    updateUI();
  }, 1000);

  // If this function exits without clearing the timer,
  // it will continue running forever!
}

// ✅ Proper cleanup
class TimerManager {
  constructor() {
    this.timers = new Set();
  }

  setTimeout(callback, delay) {
    const id = setTimeout(() => {
      this.timers.delete(id);
      callback();
    }, delay);

    this.timers.add(id);
    return id;
  }

  setInterval(callback, interval) {
    const id = setInterval(callback, interval);
    this.timers.add(id);
    return id;
  }

  clearTimer(id) {
    if (this.timers.has(id)) {
      clearTimeout(id);
      clearInterval(id);
      this.timers.delete(id);
    }
  }

  clearAll() {
    this.timers.forEach((id) => {
      clearTimeout(id);
      clearInterval(id);
    });
    this.timers.clear();
  }
}
```

## Best Practices

### 1. Always Handle Errors

```javascript
// ❌ Unhandled rejection
fetch("/api/data")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
  });

// ✅ Proper error handling
fetch("/api/data")
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    showUserFriendlyError("Failed to load data. Please try again.");
  });
```

### 2. Provide User Feedback

```javascript
async function saveUserProfile(profileData) {
  const saveButton = document.getElementById("save-button");
  const statusMessage = document.getElementById("status-message");

  try {
    // Show loading state
    saveButton.disabled = true;
    saveButton.textContent = "Saving...";
    statusMessage.textContent = "Saving your profile...";
    statusMessage.className = "status-info";

    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error("Save failed");
    }

    // Show success
    statusMessage.textContent = "Profile saved successfully!";
    statusMessage.className = "status-success";
  } catch (error) {
    // Show error
    statusMessage.textContent = "Failed to save profile. Please try again.";
    statusMessage.className = "status-error";
  } finally {
    // Reset button state
    saveButton.disabled = false;
    saveButton.textContent = "Save Profile";

    // Clear status after delay
    setTimeout(() => {
      statusMessage.textContent = "";
      statusMessage.className = "";
    }, 3000);
  }
}
```

### 3. Use Appropriate Timing

```javascript
// Debouncing for search/input
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Throttling for scroll/resize events
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Usage examples
const debouncedSearch = debounce(searchFunction, 300);
const throttledScroll = throttle(scrollHandler, 100);

document.getElementById("search").addEventListener("input", debouncedSearch);
window.addEventListener("scroll", throttledScroll);
```

## Self-Check Questions

1. What is the difference between synchronous and asynchronous programming?
2. How does the JavaScript event loop work?
3. What is the call stack and how does it relate to async operations?
4. Why do `setTimeout` callbacks execute after synchronous code, even with 0ms delay?
5. What are some common sources of asynchronous operations in web development?
6. How can you prevent memory leaks with timers?
7. What's the difference between debouncing and throttling?

## Practice Exercises

1. **Event Loop Tracing**: Predict the output of complex async code snippets
2. **Timer Management**: Build a stopwatch with start, stop, and reset functionality
3. **Debounced Search**: Create a search input that only searches after user stops typing
4. **Progress Tracker**: Simulate a multi-step process with progress updates
5. **Race Condition Demo**: Show how race conditions occur and how to prevent them

## Key Takeaways

- **JavaScript is single-threaded** but can handle async operations through the event loop
- **Async operations don't block** the main thread, keeping UIs responsive
- **The event loop** coordinates between the call stack, web APIs, and task queue
- **Always handle errors** in async operations to provide good user experience
- **Use appropriate timing techniques** (debouncing, throttling) for performance
- **Clean up resources** like timers to prevent memory leaks
- **Provide user feedback** for long-running async operations

Understanding these fundamentals is crucial for writing effective asynchronous JavaScript. Next, we'll dive into callback functions and how they enable async programming patterns.
