# Promises in JavaScript

## Learning Objectives

By the end of this lesson, you should be able to:

- Understand what Promises are and why they're useful
- Create and use Promises
- Handle Promise resolution and rejection
- Chain Promises effectively
- Understand Promise states and lifecycle
- Convert callback-based code to Promise-based code

## What are Promises?

A **Promise** is an object representing the eventual completion or failure of an asynchronous operation. It's a cleaner alternative to callbacks that helps avoid callback hell.

### Promise States

A Promise can be in one of three states:

1. **Pending** - Initial state, neither fulfilled nor rejected
2. **Fulfilled** - Operation completed successfully
3. **Rejected** - Operation failed

```javascript
// Promise lifecycle
const promise = new Promise((resolve, reject) => {
  // Initially: pending

  setTimeout(() => {
    const success = Math.random() > 0.5;

    if (success) {
      resolve("Operation successful!"); // -> fulfilled
    } else {
      reject(new Error("Operation failed!")); // -> rejected
    }
  }, 1000);
});

// Once settled (fulfilled or rejected), a Promise never changes state
```

## Creating Promises

### Basic Promise Creation

```javascript
// Creating a Promise
const myPromise = new Promise((resolve, reject) => {
  // Executor function runs immediately
  console.log("Promise executor running...");

  // Simulate async operation
  setTimeout(() => {
    const randomNum = Math.random();

    if (randomNum > 0.5) {
      resolve(randomNum); // Success
    } else {
      reject(new Error("Number too small")); // Failure
    }
  }, 1000);
});

console.log("Promise created"); // This runs immediately
```

### Promise with Immediate Resolution

```javascript
// Promise that resolves immediately
const immediatePromise = new Promise((resolve, reject) => {
  resolve("Immediate success!");
});

// Or using Promise.resolve()
const quickPromise = Promise.resolve("Quick success!");

// Promise that rejects immediately
const failedPromise = Promise.reject(new Error("Immediate failure!"));
```

## Consuming Promises

### Using .then() and .catch()

```javascript
const fetchUserData = new Promise((resolve, reject) => {
  setTimeout(() => {
    const userData = {
      id: 1,
      name: "Alice",
      email: "alice@example.com"
    };
    resolve(userData);
  }, 1500);
});

// Consuming the Promise
fetchUserData
  .then((user) => {
    console.log("User data:", user);
    return user.name; // Return value becomes the next .then()'s parameter
  })
  .then((name) => {
    console.log("User name:", name);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });
```

### Handling Both Success and Failure

```javascript
function fetchData(shouldSucceed = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldSucceed) {
        resolve({ data: "Success data" });
      } else {
        reject(new Error("Network error"));
      }
    }, 1000);
  });
}

// Success case
fetchData(true)
  .then((result) => console.log("Success:", result))
  .catch((error) => console.error("Error:", error.message));

// Failure case
fetchData(false)
  .then((result) => console.log("Success:", result))
  .catch((error) => console.error("Error:", error.message));
```

## Promise Chaining

Promises can be chained to perform sequential operations:

```javascript
// Converting callback hell to Promise chain
function fetchUser(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id: userId, name: "John" });
    }, 500);
  });
}

function fetchUserPosts(userId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" }
      ]);
    }, 500);
  });
}

function fetchPostComments(postId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        { id: 1, text: "Great post!" },
        { id: 2, text: "Thanks for sharing!" }
      ]);
    }, 500);
  });
}

// Promise chain
fetchUser(123)
  .then((user) => {
    console.log("User:", user);
    return fetchUserPosts(user.id);
  })
  .then((posts) => {
    console.log("Posts:", posts);
    return fetchPostComments(posts[0].id);
  })
  .then((comments) => {
    console.log("Comments:", comments);
  })
  .catch((error) => {
    console.error("Something went wrong:", error);
  });
```

### Returning Promises in Chains

```javascript
// When you return a Promise from .then(), it gets "unwrapped"
fetchUser(123)
  .then((user) => {
    // Returning a Promise
    return fetchUserPosts(user.id);
  })
  .then((posts) => {
    // posts is the resolved value, not a Promise
    console.log("Posts:", posts);
  });

// vs returning a regular value
fetchUser(123)
  .then((user) => {
    // Returning a regular value
    return user.name.toUpperCase();
  })
  .then((upperName) => {
    // upperName is the string, not a Promise
    console.log("Upper name:", upperName);
  });
```

## Error Handling in Promises

### Catching Errors at Different Levels

```javascript
fetchUser(123)
  .then((user) => {
    if (!user.name) {
      throw new Error("User has no name");
    }
    return fetchUserPosts(user.id);
  })
  .then((posts) => {
    if (posts.length === 0) {
      throw new Error("User has no posts");
    }
    return posts[0];
  })
  .then((firstPost) => {
    console.log("First post:", firstPost);
  })
  .catch((error) => {
    // Catches any error from the chain
    console.error("Chain error:", error.message);
  });
```

### Multiple Catch Blocks

```javascript
fetchUser(123)
  .then((user) => {
    return fetchUserPosts(user.id);
  })
  .catch((error) => {
    console.error("Error fetching user or posts:", error);
    // Return default value to continue chain
    return [];
  })
  .then((posts) => {
    console.log("Posts (might be empty array):", posts);
    return fetchPostComments(posts[0]?.id || 1);
  })
  .catch((error) => {
    console.error("Error fetching comments:", error);
  });
```

## Promise.finally()

The `finally()` method runs regardless of whether the Promise resolves or rejects:

```javascript
let loading = true;

fetchUserData()
  .then((data) => {
    console.log("Data received:", data);
  })
  .catch((error) => {
    console.error("Error:", error);
  })
  .finally(() => {
    loading = false;
    console.log("Loading finished");
    // Cleanup code goes here
  });
```

## Promise Utility Methods

### Promise.all()

Waits for all Promises to resolve (or any to reject):

```javascript
const promise1 = fetchUser(1);
const promise2 = fetchUser(2);
const promise3 = fetchUser(3);

Promise.all([promise1, promise2, promise3])
  .then((users) => {
    console.log("All users:", users);
    // users is an array with results in the same order
  })
  .catch((error) => {
    console.error("At least one failed:", error);
    // If ANY Promise rejects, this catch runs
  });
```

### Promise.allSettled()

Waits for all Promises to settle (resolve or reject):

```javascript
const promises = [
  Promise.resolve("Success 1"),
  Promise.reject(new Error("Error 1")),
  Promise.resolve("Success 2")
];

Promise.allSettled(promises).then((results) => {
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`Promise ${index} resolved:`, result.value);
    } else {
      console.log(`Promise ${index} rejected:`, result.reason.message);
    }
  });
});

// Output:
// Promise 0 resolved: Success 1
// Promise 1 rejected: Error 1
// Promise 2 resolved: Success 2
```

### Promise.race()

Resolves or rejects as soon as one Promise settles:

```javascript
const slowPromise = new Promise((resolve) =>
  setTimeout(() => resolve("Slow result"), 3000)
);

const fastPromise = new Promise((resolve) =>
  setTimeout(() => resolve("Fast result"), 1000)
);

Promise.race([slowPromise, fastPromise]).then((result) => {
  console.log("First to finish:", result); // "Fast result"
});
```

### Promise.any()

Resolves as soon as any Promise resolves (ignores rejections):

```javascript
const promises = [
  Promise.reject(new Error("Error 1")),
  Promise.reject(new Error("Error 2")),
  Promise.resolve("Success!")
];

Promise.any(promises)
  .then((result) => {
    console.log("First success:", result); // "Success!"
  })
  .catch((error) => {
    // Only runs if ALL Promises reject
    console.error("All failed:", error);
  });
```

## Converting Callbacks to Promises

### Manual Conversion

```javascript
// Callback version
function fetchDataCallback(callback) {
  setTimeout(() => {
    const data = { message: "Hello World" };
    callback(null, data);
  }, 1000);
}

// Promise version
function fetchDataPromise() {
  return new Promise((resolve, reject) => {
    fetchDataCallback((error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

// Usage
fetchDataPromise()
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
```

### Promisification Utility

```javascript
// Generic promisify function
function promisify(callbackFunction) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      callbackFunction(...args, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };
}

// Usage
const fetchDataPromisified = promisify(fetchDataCallback);

fetchDataPromisified()
  .then((data) => console.log("Promisified result:", data))
  .catch((error) => console.error("Promisified error:", error));
```

## Real-World Examples

### 1. API Request Simulation

```javascript
function apiRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    const delay = Math.random() * 2000 + 500;

    setTimeout(() => {
      // Simulate random success/failure
      const success = Math.random() > 0.2;

      if (success) {
        resolve({
          status: 200,
          data: { message: `Data from ${url}` },
          url: url
        });
      } else {
        reject(new Error(`Request to ${url} failed`));
      }
    }, delay);
  });
}

// Usage
apiRequest("/api/users")
  .then((response) => {
    console.log("API Response:", response.data);
    return apiRequest(`/api/users/${response.data.userId}/posts`);
  })
  .then((postsResponse) => {
    console.log("Posts:", postsResponse.data);
  })
  .catch((error) => {
    console.error("API Error:", error.message);
  })
  .finally(() => {
    console.log("API request sequence completed");
  });
```

### 2. File Processing Pipeline

```javascript
function readFile(filename) {
  return new Promise((resolve, reject) => {
    console.log(`Reading ${filename}...`);
    setTimeout(() => {
      if (filename.endsWith(".txt")) {
        resolve(`Content of ${filename}`);
      } else {
        reject(new Error("Only .txt files supported"));
      }
    }, 500);
  });
}

function processContent(content) {
  return new Promise((resolve, reject) => {
    console.log("Processing content...");
    setTimeout(() => {
      resolve(content.toUpperCase());
    }, 300);
  });
}

function saveFile(content, filename) {
  return new Promise((resolve, reject) => {
    console.log(`Saving to ${filename}...`);
    setTimeout(() => {
      resolve(`Saved: ${content.substring(0, 20)}...`);
    }, 400);
  });
}

// File processing pipeline
readFile("data.txt")
  .then((content) => processContent(content))
  .then((processedContent) => saveFile(processedContent, "processed.txt"))
  .then((result) => console.log("Pipeline complete:", result))
  .catch((error) => console.error("Pipeline failed:", error));
```

### 3. Timeout Promise

```javascript
function withTimeout(promise, timeoutMs) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]);
}

// Usage
const slowOperation = new Promise((resolve) =>
  setTimeout(() => resolve("Slow result"), 5000)
);

withTimeout(slowOperation, 2000)
  .then((result) => console.log("Result:", result))
  .catch((error) => console.error("Error:", error.message));
// Will timeout after 2 seconds
```

## Practice Exercises

### Exercise 1: Promise Creation

Create a Promise that simulates rolling a dice:

```javascript
function rollDice() {
  // Your implementation here
  // Should resolve with a number 1-6 after a random delay
}

rollDice()
  .then((result) => console.log("Dice rolled:", result))
  .catch((error) => console.error("Error:", error));
```

### Exercise 2: Promise Chain

Create a user registration flow:

```javascript
function validateEmail(email) {
  // Your implementation here
  // Should resolve if email is valid, reject if not
}

function checkEmailAvailability(email) {
  // Your implementation here
  // Should resolve if email is available, reject if taken
}

function createUser(email, userData) {
  // Your implementation here
  // Should resolve with user object
}

// Chain them together for user registration
```

### Exercise 3: Promise.all Practice

Fetch data from multiple sources:

```javascript
function fetchWeather(city) {
  // Your implementation here
}

function fetchNews(category) {
  // Your implementation here
}

function fetchStocks(symbol) {
  // Your implementation here
}

// Use Promise.all to fetch all data simultaneously
```

## Benefits of Promises over Callbacks

1. **Better Error Handling** - Errors bubble up through the chain
2. **Cleaner Code** - No more callback hell
3. **Composability** - Easy to combine and sequence operations
4. **Better Debugging** - Stack traces are more meaningful
5. **Standard Methods** - Built-in utilities like `Promise.all()`

## Common Pitfalls

### 1. Forgetting to Return

```javascript
// Bad: not returning the Promise
fetchUser()
  .then((user) => {
    fetchUserPosts(user.id); // Missing return!
  })
  .then((posts) => {
    console.log(posts); // undefined!
  });

// Good: returning the Promise
fetchUser()
  .then((user) => {
    return fetchUserPosts(user.id);
  })
  .then((posts) => {
    console.log(posts); // Correct posts array
  });
```

### 2. Creating Unnecessary Promises

```javascript
// Bad: wrapping Promise in Promise
function fetchData() {
  return new Promise((resolve, reject) => {
    return apiCall() // This already returns a Promise
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

// Good: just return the existing Promise
function fetchData() {
  return apiCall();
}
```

## Summary

Promises provide a much cleaner way to handle asynchronous operations compared to callbacks. They offer:

- Better error handling
- Cleaner, more readable code
- Powerful utility methods
- Easy composition and chaining

Understanding Promises is crucial for modern JavaScript development and prepares you for the even more elegant async/await syntax.

## Next Steps

In the next lesson, we'll explore **Advanced Promise Patterns** including error recovery, retries, and complex coordination scenarios.
