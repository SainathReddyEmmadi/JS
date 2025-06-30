# Callbacks in JavaScript

## Learning Objectives

By the end of this lesson, you should be able to:

- Understand what callbacks are and why they're needed
- Write functions that accept callbacks
- Handle errors in callback-based code
- Recognize and deal with callback hell
- Implement higher-order functions using callbacks

## What are Callbacks?

A **callback** is a function that is passed as an argument to another function and is executed after (or during) the execution of that function.

### Simple Callback Example

```javascript
function greet(name, callback) {
  console.log("Hello " + name);
  callback();
}

function sayGoodbye() {
  console.log("Goodbye!");
}

greet("Alice", sayGoodbye);
// Output:
// Hello Alice
// Goodbye!
```

### Why Callbacks?

Callbacks enable:

1. **Asynchronous programming** - Handle operations that take time
2. **Higher-order functions** - Functions that operate on other functions
3. **Event handling** - Respond to user interactions
4. **Customizable behavior** - Let callers define what happens

## Types of Callbacks

### 1. Synchronous Callbacks

```javascript
// Array methods use synchronous callbacks
const numbers = [1, 2, 3, 4, 5];

// map() executes the callback for each element
const doubled = numbers.map(function (num) {
  return num * 2;
});
console.log(doubled); // [2, 4, 6, 8, 10]

// filter() uses callback to test each element
const evens = numbers.filter(function (num) {
  return num % 2 === 0;
});
console.log(evens); // [2, 4]

// forEach() executes callback for each element
numbers.forEach(function (num, index) {
  console.log(`Index ${index}: ${num}`);
});
```

### 2. Asynchronous Callbacks

```javascript
// setTimeout uses an asynchronous callback
console.log("Start");

setTimeout(function () {
  console.log("This runs after 2 seconds");
}, 2000);

console.log("End");

// Output:
// Start
// End
// This runs after 2 seconds
```

## Practical Examples

### 1. Event Handling

```javascript
// Button click callback
document.getElementById("myButton").addEventListener("click", function () {
  console.log("Button was clicked!");
});

// Form submission callback
document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("Form submitted!");
});
```

### 2. API Simulation with Callbacks

```javascript
// Simulating an API call with callbacks
function fetchUserData(userId, callback) {
  console.log("Fetching user data...");

  // Simulate network delay
  setTimeout(() => {
    const userData = {
      id: userId,
      name: "John Doe",
      email: "john@example.com"
    };

    // Call the callback with the data
    callback(userData);
  }, 1500);
}

// Usage
fetchUserData(123, function (user) {
  console.log("User data received:", user);
  console.log(`Welcome, ${user.name}!`);
});
```

### 3. Error Handling with Callbacks

```javascript
function fetchUserData(userId, successCallback, errorCallback) {
  console.log("Fetching user data...");

  setTimeout(() => {
    // Simulate random success/failure
    const isSuccess = Math.random() > 0.3;

    if (isSuccess) {
      const userData = {
        id: userId,
        name: "John Doe",
        email: "john@example.com"
      };
      successCallback(userData);
    } else {
      errorCallback(new Error("Failed to fetch user data"));
    }
  }, 1500);
}

// Usage with error handling
fetchUserData(
  123,
  function (user) {
    console.log("Success:", user);
  },
  function (error) {
    console.error("Error:", error.message);
  }
);
```

### 4. Node.js Style Error-First Callbacks

```javascript
// Common pattern in Node.js: error-first callbacks
function readFileSimulation(filename, callback) {
  setTimeout(() => {
    // Simulate file reading
    if (filename === "nonexistent.txt") {
      // Error as first parameter
      callback(new Error("File not found"), null);
    } else {
      // null error, data as second parameter
      callback(null, "File content here...");
    }
  }, 1000);
}

// Usage
readFileSimulation("data.txt", function (error, data) {
  if (error) {
    console.error("Error reading file:", error.message);
    return;
  }
  console.log("File content:", data);
});
```

## The Problem: Callback Hell

As applications grow complex, callbacks can lead to deeply nested code that's hard to read and maintain:

```javascript
// Example of callback hell
fetchUserData(
  123,
  function (user) {
    fetchUserPosts(
      user.id,
      function (posts) {
        fetchPostComments(
          posts[0].id,
          function (comments) {
            fetchCommentReplies(
              comments[0].id,
              function (replies) {
                // This nesting can go on and on...
                console.log("Finally got the replies:", replies);
              },
              function (error) {
                console.error("Error fetching replies:", error);
              }
            );
          },
          function (error) {
            console.error("Error fetching comments:", error);
          }
        );
      },
      function (error) {
        console.error("Error fetching posts:", error);
      }
    );
  },
  function (error) {
    console.error("Error fetching user:", error);
  }
);
```

### Solutions to Callback Hell

#### 1. Named Functions

```javascript
// Break callbacks into named functions
function handleUserData(user) {
  fetchUserPosts(user.id, handleUserPosts, handleError);
}

function handleUserPosts(posts) {
  fetchPostComments(posts[0].id, handleComments, handleError);
}

function handleComments(comments) {
  fetchCommentReplies(comments[0].id, handleReplies, handleError);
}

function handleReplies(replies) {
  console.log("Finally got the replies:", replies);
}

function handleError(error) {
  console.error("Error:", error.message);
}

// Much cleaner!
fetchUserData(123, handleUserData, handleError);
```

#### 2. Modularization

```javascript
// Create separate modules/functions
function getUserWithPosts(userId, callback) {
  fetchUserData(
    userId,
    function (user) {
      fetchUserPosts(
        user.id,
        function (posts) {
          callback(null, { user, posts });
        },
        callback
      );
    },
    callback
  );
}

function getPostWithComments(postId, callback) {
  fetchPostComments(
    postId,
    function (comments) {
      callback(null, comments);
    },
    callback
  );
}

// Usage
getUserWithPosts(123, function (error, data) {
  if (error) return console.error(error);

  getPostWithComments(data.posts[0].id, function (error, comments) {
    if (error) return console.error(error);
    console.log("Comments:", comments);
  });
});
```

## Best Practices for Callbacks

### 1. Keep It Flat

```javascript
// Bad: nested callbacks
getData(function (a) {
  getMoreData(a, function (b) {
    getEvenMoreData(b, function (c) {
      // ...
    });
  });
});

// Good: flat structure
function step1(data) {
  getMoreData(data, step2);
}

function step2(data) {
  getEvenMoreData(data, step3);
}

function step3(data) {
  // Final step
}

getData(step1);
```

### 2. Handle Errors Consistently

```javascript
// Consistent error handling pattern
function fetchData(callback) {
  // Always call callback with (error, data)
  try {
    // Simulation
    const data = { success: true };
    callback(null, data);
  } catch (error) {
    callback(error, null);
  }
}
```

### 3. Validate Callbacks

```javascript
function processData(data, callback) {
  // Validate callback is a function
  if (typeof callback !== "function") {
    throw new Error("Callback must be a function");
  }

  // Process data...
  callback(null, processedData);
}
```

## Common Use Cases

### 1. Animation Callbacks

```javascript
function fadeIn(element, duration, callback) {
  let opacity = 0;
  const step = 1 / (duration / 16); // 60fps

  function animate() {
    opacity += step;
    element.style.opacity = opacity;

    if (opacity >= 1) {
      element.style.opacity = 1;
      if (callback) callback();
    } else {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

// Usage
const element = document.getElementById("myDiv");
fadeIn(element, 1000, function () {
  console.log("Fade in complete!");
});
```

### 2. Data Processing Pipeline

```javascript
function processDataPipeline(data, ...processors) {
  function runNext(index, currentData) {
    if (index >= processors.length) {
      console.log("Pipeline complete:", currentData);
      return;
    }

    const processor = processors[index];
    processor(currentData, function (error, result) {
      if (error) {
        console.error("Pipeline error:", error);
        return;
      }
      runNext(index + 1, result);
    });
  }

  runNext(0, data);
}

// Processors
function validateData(data, callback) {
  if (!data || !data.name) {
    callback(new Error("Invalid data"));
    return;
  }
  callback(null, data);
}

function transformData(data, callback) {
  const transformed = {
    ...data,
    name: data.name.toUpperCase()
  };
  callback(null, transformed);
}

function saveData(data, callback) {
  console.log("Saving:", data);
  callback(null, { ...data, id: Date.now() });
}

// Usage
processDataPipeline(
  { name: "john doe" },
  validateData,
  transformData,
  saveData
);
```

## Practice Exercises

### Exercise 1: Timer with Callback

Create a timer function that accepts a duration and a callback:

```javascript
function timer(seconds, callback) {
  // Your implementation here
  // Should call callback after the specified seconds
}

// Usage
timer(3, function () {
  console.log("Timer finished!");
});
```

### Exercise 2: Array Processor

Create a function that processes an array with a callback:

```javascript
function processArray(array, processor, callback) {
  // Your implementation here
  // Should process each item and call callback with results
}

// Usage
processArray(
  [1, 2, 3, 4],
  function (item) {
    return item * 2;
  },
  function (results) {
    console.log(results); // [2, 4, 6, 8]
  }
);
```

### Exercise 3: Sequential Operations

Create a function that performs operations in sequence:

```javascript
function sequence(operations, callback) {
  // Your implementation here
  // Should execute operations one after another
}

// Usage
sequence(
  [
    function (next) {
      setTimeout(() => next(null, 1), 100);
    },
    function (next) {
      setTimeout(() => next(null, 2), 100);
    },
    function (next) {
      setTimeout(() => next(null, 3), 100);
    }
  ],
  function (error, results) {
    console.log(results); // [1, 2, 3]
  }
);
```

## Summary

Callbacks are fundamental to JavaScript's asynchronous nature. They enable:

- Non-blocking operations
- Event handling
- Higher-order functions
- Customizable behavior

However, they can lead to callback hell in complex scenarios. Understanding callbacks well prepares you for more advanced patterns like Promises and async/await, which we'll cover next.

## Next Steps

In the next lesson, we'll learn about **Promises**, which provide a more elegant way to handle asynchronous operations and help solve the callback hell problem.
