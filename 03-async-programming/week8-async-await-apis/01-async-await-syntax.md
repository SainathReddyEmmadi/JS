# Async/Await Syntax

## Learning Objectives

By the end of this lesson, you should be able to:

- Understand what async/await is and how it improves upon Promises
- Write asynchronous functions using async/await syntax
- Handle errors in async/await code
- Convert Promise-based code to async/await
- Understand the relationship between async/await and Promises
- Use async/await with various Promise patterns

## What is Async/Await?

**Async/await** is syntactic sugar built on top of Promises that makes asynchronous code look and behave more like synchronous code. It provides a cleaner, more readable way to handle asynchronous operations.

### The Problem with Promise Chains

```javascript
// Promise chain - can become hard to read
fetchUser(123)
  .then((user) => {
    return fetchUserPosts(user.id);
  })
  .then((posts) => {
    return fetchPostComments(posts[0].id);
  })
  .then((comments) => {
    console.log("Comments:", comments);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

### The Async/Await Solution

```javascript
// Async/await - much more readable
async function getUserData() {
  try {
    const user = await fetchUser(123);
    const posts = await fetchUserPosts(user.id);
    const comments = await fetchPostComments(posts[0].id);
    console.log("Comments:", comments);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

## The `async` Keyword

The `async` keyword is used to declare an asynchronous function:

```javascript
// Function declaration
async function myAsyncFunction() {
  return "Hello, World!";
}

// Function expression
const myAsyncFunction = async function () {
  return "Hello, World!";
};

// Arrow function
const myAsyncFunction = async () => {
  return "Hello, World!";
};

// Method in an object
const myObject = {
  async myMethod() {
    return "Hello, World!";
  }
};

// Method in a class
class MyClass {
  async myMethod() {
    return "Hello, World!";
  }
}
```

### What `async` Does

1. **Always returns a Promise**: Even if you return a regular value
2. **Allows `await` usage**: Only async functions can use the await keyword
3. **Wraps return values**: Non-promise return values are wrapped in Promise.resolve()

```javascript
async function example() {
  return "Hello"; // This becomes Promise.resolve('Hello')
}

// These are equivalent:
example().then((result) => console.log(result)); // "Hello"

async function useExample() {
  const result = await example();
  console.log(result); // "Hello"
}
```

## The `await` Keyword

The `await` keyword pauses the execution of an async function until a Promise resolves:

```javascript
async function fetchData() {
  console.log("Starting fetch...");

  // This pauses execution until the Promise resolves
  const response = await fetch("/api/data");
  console.log("Response received");

  // This also pauses until the Promise resolves
  const data = await response.json();
  console.log("Data parsed");

  return data;
}
```

### What `await` Does

1. **Pauses execution**: Function execution stops until Promise resolves
2. **Unwraps Promise values**: Returns the resolved value, not the Promise
3. **Throws on rejection**: If Promise rejects, await throws the rejection reason

```javascript
async function example() {
  // These are equivalent:

  // Using await
  const result = await Promise.resolve("success");
  console.log(result); // "success"

  // Using .then()
  Promise.resolve("success").then((result) => {
    console.log(result); // "success"
  });
}
```

## Basic Examples

### Simple Async Function

```javascript
async function greet(name) {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `Hello, ${name}!`;
}

// Usage
async function main() {
  const greeting = await greet("Alice");
  console.log(greeting); // "Hello, Alice!" (after 1 second)
}

main();
```

### Converting Promises to Async/Await

```javascript
// Promise version
function fetchUserData(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      return fetch(`/api/users/${userId}/posts`);
    })
    .then((response) => response.json())
    .then((posts) => {
      return { user, posts };
    });
}

// Async/await version
async function fetchUserData(userId) {
  const userResponse = await fetch(`/api/users/${userId}`);
  const user = await userResponse.json();

  const postsResponse = await fetch(`/api/users/${userId}/posts`);
  const posts = await postsResponse.json();

  return { user, posts };
}
```

## Error Handling

### Try/Catch Blocks

```javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error.message);
    throw error; // Re-throw if you want caller to handle it
  }
}

// Usage
async function main() {
  try {
    const user = await fetchUserData(123);
    console.log("User:", user);
  } catch (error) {
    console.error("Error in main:", error.message);
  }
}
```

### Multiple Try/Catch Blocks

```javascript
async function complexOperation() {
  let user, posts, comments;

  try {
    user = await fetchUser(123);
    console.log("User fetched successfully");
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return { error: "User fetch failed" };
  }

  try {
    posts = await fetchUserPosts(user.id);
    console.log("Posts fetched successfully");
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    // Continue without posts
    posts = [];
  }

  try {
    if (posts.length > 0) {
      comments = await fetchPostComments(posts[0].id);
    }
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    // Continue without comments
    comments = [];
  }

  return { user, posts, comments };
}
```

### Error Handling with Default Values

```javascript
async function fetchWithDefaults() {
  let userData = { name: "Unknown", email: "none" };
  let userPosts = [];
  let userStats = { posts: 0, likes: 0 };

  try {
    userData = await fetchUser(123);
  } catch (error) {
    console.warn("Using default user data:", error.message);
  }

  try {
    userPosts = await fetchUserPosts(userData.id);
  } catch (error) {
    console.warn("Using empty posts array:", error.message);
  }

  try {
    userStats = await fetchUserStats(userData.id);
  } catch (error) {
    console.warn("Using default stats:", error.message);
  }

  return { userData, userPosts, userStats };
}
```

## Working with Multiple Promises

### Sequential Execution

```javascript
// Operations happen one after another
async function sequentialOperations() {
  console.log("Starting sequential operations...");

  const result1 = await operation1(); // Wait for this to complete
  console.log("Operation 1 complete:", result1);

  const result2 = await operation2(); // Then start this
  console.log("Operation 2 complete:", result2);

  const result3 = await operation3(); // Finally this
  console.log("Operation 3 complete:", result3);

  return [result1, result2, result3];
}
```

### Parallel Execution with Promise.all()

```javascript
// Operations happen simultaneously
async function parallelOperations() {
  console.log("Starting parallel operations...");

  // Start all operations at the same time
  const [result1, result2, result3] = await Promise.all([
    operation1(),
    operation2(),
    operation3()
  ]);

  console.log("All operations complete");
  return [result1, result2, result3];
}
```

### Mixed Sequential and Parallel

```javascript
async function mixedOperations() {
  // Start two operations in parallel
  const [userData, userSettings] = await Promise.all([
    fetchUser(123),
    fetchUserSettings(123)
  ]);

  // Then use results for next operations
  const [userPosts, userFriends] = await Promise.all([
    fetchUserPosts(userData.id),
    fetchUserFriends(userData.id)
  ]);

  // Finally, sequential operation that depends on posts
  const postComments = await fetchPostComments(userPosts[0].id);

  return {
    userData,
    userSettings,
    userPosts,
    userFriends,
    postComments
  };
}
```

## Advanced Patterns

### Async Iteration

```javascript
async function processItems(items) {
  const results = [];

  // Sequential processing
  for (const item of items) {
    const result = await processItem(item);
    results.push(result);
    console.log(`Processed item ${item.id}`);
  }

  return results;
}

// Parallel processing with limited concurrency
async function processItemsConcurrently(items, concurrency = 3) {
  const results = [];

  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((item) => processItem(item))
    );
    results.push(...batchResults);
    console.log(`Processed batch ${Math.floor(i / concurrency) + 1}`);
  }

  return results;
}
```

### Conditional Async Operations

```javascript
async function conditionalOperations(userId, options = {}) {
  const user = await fetchUser(userId);

  let posts = [];
  if (options.includePosts) {
    posts = await fetchUserPosts(userId);
  }

  let comments = [];
  if (options.includeComments && posts.length > 0) {
    comments = await fetchPostComments(posts[0].id);
  }

  let stats = null;
  if (options.includeStats) {
    stats = await fetchUserStats(userId);
  }

  return {
    user,
    ...(posts.length > 0 && { posts }),
    ...(comments.length > 0 && { comments }),
    ...(stats && { stats })
  };
}
```

### Async Retry Logic

```javascript
async function withRetry(asyncFn, maxAttempts = 3, delay = 1000) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await asyncFn();
    } catch (error) {
      lastError = error;
      console.log(`Attempt ${attempt} failed:`, error.message);

      if (attempt < maxAttempts) {
        console.log(`Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }

  throw new Error(`Failed after ${maxAttempts} attempts: ${lastError.message}`);
}

// Usage
async function robustFetch(url) {
  return await withRetry(
    () =>
      fetch(url).then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      }),
    3,
    1000
  );
}
```

## Common Patterns and Best Practices

### 1. Early Return Pattern

```javascript
async function processUser(userId) {
  if (!userId) {
    return { error: "User ID is required" };
  }

  let user;
  try {
    user = await fetchUser(userId);
  } catch (error) {
    return { error: "User not found" };
  }

  if (!user.isActive) {
    return { error: "User is not active" };
  }

  // Continue with processing...
  const posts = await fetchUserPosts(userId);
  return { user, posts };
}
```

### 2. Resource Cleanup with Finally

```javascript
async function processWithCleanup() {
  let resource;

  try {
    resource = await acquireResource();
    const result = await processResource(resource);
    return result;
  } catch (error) {
    console.error("Processing failed:", error);
    throw error;
  } finally {
    if (resource) {
      await releaseResource(resource);
      console.log("Resource cleaned up");
    }
  }
}
```

### 3. Timeout with Async/Await

```javascript
function withTimeout(promise, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Operation timed out"));
    }, timeoutMs);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timer));
  });
}

async function fetchWithTimeout(url, timeoutMs = 5000) {
  try {
    const response = await withTimeout(fetch(url), timeoutMs);
    return await response.json();
  } catch (error) {
    if (error.message === "Operation timed out") {
      console.error("Request timed out");
    }
    throw error;
  }
}
```

## Async/Await vs Promises

### When to Use Async/Await

✅ **Good for:**

- Linear, sequential operations
- Complex error handling scenarios
- Code that needs to look synchronous
- When you need to use loops with async operations

```javascript
// Much cleaner with async/await
async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchUserPosts(user.id);

    for (const post of posts) {
      const comments = await fetchPostComments(post.id);
      post.comments = comments;
    }

    return { user, posts };
  } catch (error) {
    console.error("Error processing user data:", error);
    throw error;
  }
}
```

### When to Use Promises

✅ **Good for:**

- Simple chains
- When you need the Promise object itself
- Functional programming patterns
- Library/utility functions

```javascript
// Sometimes Promise chains are cleaner
function fetchUserSummary(userId) {
  return fetchUser(userId)
    .then((user) => ({ ...user, summary: `User: ${user.name}` }))
    .catch((error) => ({ error: error.message }));
}
```

## Common Mistakes

### 1. Forgetting `await`

```javascript
// Wrong - returns a Promise, not the value
async function badExample() {
  const data = fetchData(); // Missing await!
  console.log(data); // Logs: Promise { <pending> }
  return data;
}

// Correct
async function goodExample() {
  const data = await fetchData();
  console.log(data); // Logs: actual data
  return data;
}
```

### 2. Using `await` in Loops Incorrectly

```javascript
// Inefficient - sequential execution
async function badLoop(urls) {
  const results = [];
  for (const url of urls) {
    const data = await fetch(url); // Waits for each one
    results.push(data);
  }
  return results;
}

// Efficient - parallel execution
async function goodLoop(urls) {
  const promises = urls.map((url) => fetch(url));
  const results = await Promise.all(promises);
  return results;
}
```

### 3. Not Handling Errors

```javascript
// Dangerous - unhandled promise rejection
async function dangerousFunction() {
  const data = await riskyOperation(); // If this fails, error propagates
  return data;
}

// Safe - proper error handling
async function safeFunction() {
  try {
    const data = await riskyOperation();
    return data;
  } catch (error) {
    console.error("Operation failed:", error);
    return null; // or some default value
  }
}
```

## Real-World Examples

### 1. API Client with Error Handling

```javascript
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  async get(endpoint) {
    return this.request(endpoint);
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  }
}

// Usage
const api = new ApiClient("/api");

async function loadUserDashboard(userId) {
  try {
    const [user, posts, stats] = await Promise.all([
      api.get(`/users/${userId}`),
      api.get(`/users/${userId}/posts`),
      api.get(`/users/${userId}/stats`)
    ]);

    return { user, posts, stats };
  } catch (error) {
    console.error("Failed to load dashboard:", error);
    throw error;
  }
}
```

### 2. File Processing Pipeline

```javascript
async function processFiles(fileList) {
  const results = [];

  for (const file of fileList) {
    try {
      console.log(`Processing ${file.name}...`);

      // Read file
      const content = await readFileAsync(file);

      // Validate content
      const isValid = await validateContent(content);
      if (!isValid) {
        throw new Error("Invalid file content");
      }

      // Transform content
      const transformed = await transformContent(content);

      // Save result
      const savedPath = await saveContent(transformed, file.name);

      results.push({
        name: file.name,
        success: true,
        path: savedPath
      });
    } catch (error) {
      console.error(`Failed to process ${file.name}:`, error);
      results.push({
        name: file.name,
        success: false,
        error: error.message
      });
    }
  }

  return results;
}
```

## Practice Exercises

### Exercise 1: Convert Promise Chain

Convert this Promise chain to async/await:

```javascript
function getUserData(userId) {
  return fetchUser(userId)
    .then((user) => {
      return fetchUserProfile(user.id);
    })
    .then((profile) => {
      return fetchUserPosts(profile.userId);
    })
    .then((posts) => {
      return posts.map((post) => ({
        ...post,
        author: profile.name
      }));
    })
    .catch((error) => {
      console.error("Error:", error);
      return [];
    });
}
```

### Exercise 2: Error Handling

Improve this code with better error handling:

```javascript
async function loadData() {
  const user = await fetch("/api/user").then((r) => r.json());
  const posts = await fetch(`/api/posts/${user.id}`).then((r) => r.json());
  const comments = await fetch(`/api/comments/${posts[0].id}`).then((r) =>
    r.json()
  );

  return { user, posts, comments };
}
```

### Exercise 3: Parallel vs Sequential

Optimize this code to run operations in parallel where possible:

```javascript
async function setupUserAccount(userData) {
  const user = await createUser(userData);
  const profile = await createUserProfile(user.id, userData.profile);
  const settings = await createUserSettings(user.id, userData.settings);
  const subscription = await createSubscription(user.id, userData.plan);

  return { user, profile, settings, subscription };
}
```

## Summary

Async/await provides a cleaner, more readable way to handle asynchronous operations:

- **`async` functions** always return Promises
- **`await` pauses** execution until Promise resolves
- **Error handling** uses familiar try/catch blocks
- **Combines well** with other Promise patterns
- **Makes complex async flows** much more readable

Understanding async/await is essential for modern JavaScript development, especially when working with APIs and other asynchronous operations.

## Next Steps

In the next lesson, we'll explore the **Fetch API** and learn how to make HTTP requests using async/await for real-world API interactions.
