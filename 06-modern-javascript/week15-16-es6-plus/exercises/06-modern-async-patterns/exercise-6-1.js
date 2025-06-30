/**
 * Exercise 6-1: Async/Await Fundamentals
 *
 * Practice converting promises to async/await and handling errors.
 */

console.log("Starting Exercise 6-1: Async/Await Fundamentals");

// Simulated API functions using promises
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id > 0) {
        resolve({
          id: id,
          name: `User ${id}`,
          email: `user${id}@example.com`
        });
      } else {
        reject(new Error("Invalid user ID"));
      }
    }, 1000);
  });
}

function fetchUserPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: "First Post", content: "Hello World" },
        { id: 2, title: "Second Post", content: "Learning Async/Await" }
      ]);
    }, 800);
  });
}

function fetchPostComments(postId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, text: "Great post!", author: "Commenter 1" },
        { id: 2, text: "Thanks for sharing", author: "Commenter 2" }
      ]);
    }, 500);
  });
}

// TODO: Convert promise-based function to async/await
function getUserDataPromises(userId) {
  return fetchUser(userId)
    .then((user) => {
      console.log("User found:", user);
      return fetchUserPosts(user.id);
    })
    .then((posts) => {
      console.log("Posts found:", posts);
      return posts;
    })
    .catch((error) => {
      console.error("Error:", error.message);
      throw error;
    });
}

// TODO: Implement the same functionality using async/await
async function getUserDataAsync(userId) {
  try {
    // TODO: Use await to fetch user
    const user = await fetchUser(userId);
    console.log("User found (async):", user);

    // TODO: Use await to fetch posts
    const posts = await fetchUserPosts(user.id);
    console.log("Posts found (async):", posts);

    return posts;
  } catch (error) {
    console.error("Error (async):", error.message);
    throw error;
  }
}

// TODO: Create an async function that fetches user, posts, and comments
async function getCompleteUserData(userId) {
  try {
    // TODO: Fetch user data
    const user = await fetchUser(userId);

    // TODO: Fetch user posts
    const posts = await fetchUserPosts(user.id);

    // TODO: Fetch comments for the first post
    const comments = await fetchPostComments(posts[0].id);

    return {
      user,
      posts,
      comments
    };
  } catch (error) {
    console.error("Error fetching complete data:", error.message);
    return null;
  }
}

// Test the functions
async function runTests() {
  console.log("\n=== Testing Promise-based function ===");
  try {
    await getUserDataPromises(1);
  } catch (error) {
    console.log("Promise error handled");
  }

  console.log("\n=== Testing Async/Await function ===");
  try {
    await getUserDataAsync(1);
  } catch (error) {
    console.log("Async error handled");
  }

  console.log("\n=== Testing Complete Data function ===");
  const completeData = await getCompleteUserData(1);
  if (completeData) {
    console.log("Complete data:", completeData);
  }

  console.log("\n=== Testing Error Handling ===");
  try {
    await getUserDataAsync(-1); // Should trigger error
  } catch (error) {
    console.log("Error caught successfully");
  }
}

// Error handling patterns
async function demonstrateErrorHandling() {
  console.log("\n=== Error Handling Patterns ===");

  // Pattern 1: Try-catch
  try {
    await fetchUser(-1);
  } catch (error) {
    console.log("Try-catch error:", error.message);
  }

  // Pattern 2: Promise.catch()
  await fetchUser(-1).catch((error) => {
    console.log("Promise.catch error:", error.message);
  });

  // Pattern 3: Optional chaining with async
  const safeGetUser = async (id) => {
    try {
      return await fetchUser(id);
    } catch {
      return null;
    }
  };

  const user = await safeGetUser(-1);
  console.log("Safe get user result:", user);
}

// Run all tests
runTests()
  .then(() => {
    return demonstrateErrorHandling();
  })
  .then(() => {
    console.log("\nExercise 6-1 completed!");
  });

// Instructions:
// 1. Complete the getUserDataAsync function using async/await
// 2. Implement getCompleteUserData to fetch user, posts, and comments
// 3. Test both promise and async/await approaches
// 4. Practice different error handling patterns
// 5. Compare the readability of promises vs async/await
