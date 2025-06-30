/**
 * Exercise 6-2: Promise.all, Promise.race, and Concurrent Operations
 *
 * Practice parallel execution and promise combinators.
 */

console.log(
  "Starting Exercise 6-2: Promise Combinators and Concurrent Operations"
);

// Simulated API calls with different delays
function fetchData(endpoint, delay = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) {
        // 90% success rate
        resolve({
          endpoint,
          data: `Data from ${endpoint}`,
          timestamp: new Date().toISOString()
        });
      } else {
        reject(new Error(`Failed to fetch from ${endpoint}`));
      }
    }, delay);
  });
}

function fetchWeather() {
  return fetchData("weather-api", 800);
}

function fetchNews() {
  return fetchData("news-api", 1200);
}

function fetchStocks() {
  return fetchData("stocks-api", 600);
}

function fetchUserProfile() {
  return fetchData("profile-api", 1000);
}

// Sequential vs Parallel execution demonstration
async function sequentialExecution() {
  console.log("\n=== Sequential Execution ===");
  const startTime = Date.now();

  try {
    const weather = await fetchWeather();
    console.log("Weather fetched:", weather.endpoint);

    const news = await fetchNews();
    console.log("News fetched:", news.endpoint);

    const stocks = await fetchStocks();
    console.log("Stocks fetched:", stocks.endpoint);

    const endTime = Date.now();
    console.log(`Sequential execution took: ${endTime - startTime}ms`);

    return { weather, news, stocks };
  } catch (error) {
    console.error("Sequential error:", error.message);
    throw error;
  }
}

// TODO: Implement parallel execution using Promise.all
async function parallelExecution() {
  console.log("\n=== Parallel Execution with Promise.all ===");
  const startTime = Date.now();

  try {
    // TODO: Use Promise.all to fetch all data concurrently
    const [weather, news, stocks] = await Promise.all([
      fetchWeather(),
      fetchNews(),
      fetchStocks()
    ]);

    const endTime = Date.now();
    console.log(`Parallel execution took: ${endTime - startTime}ms`);

    console.log("All data fetched:");
    console.log("- Weather:", weather.endpoint);
    console.log("- News:", news.endpoint);
    console.log("- Stocks:", stocks.endpoint);

    return { weather, news, stocks };
  } catch (error) {
    console.error("Parallel error:", error.message);
    throw error;
  }
}

// TODO: Implement Promise.allSettled for handling partial failures
async function robustParallelExecution() {
  console.log("\n=== Robust Parallel Execution with Promise.allSettled ===");
  const startTime = Date.now();

  // TODO: Use Promise.allSettled to handle failures gracefully
  const results = await Promise.allSettled([
    fetchWeather(),
    fetchNews(),
    fetchStocks(),
    fetchUserProfile()
  ]);

  const endTime = Date.now();
  console.log(`Robust execution took: ${endTime - startTime}ms`);

  // TODO: Process results and handle both fulfilled and rejected promises
  const successful = [];
  const failed = [];

  results.forEach((result, index) => {
    const endpoints = ["weather", "news", "stocks", "profile"];

    if (result.status === "fulfilled") {
      successful.push(result.value);
      console.log(`✓ ${endpoints[index]} successful`);
    } else {
      failed.push({ endpoint: endpoints[index], error: result.reason.message });
      console.log(`✗ ${endpoints[index]} failed: ${result.reason.message}`);
    }
  });

  return { successful, failed };
}

// TODO: Implement Promise.race for fastest response
async function raceExecution() {
  console.log("\n=== Race Execution with Promise.race ===");
  const startTime = Date.now();

  try {
    // TODO: Use Promise.race to get the fastest response
    const fastestResult = await Promise.race([
      fetchWeather(),
      fetchNews(),
      fetchStocks()
    ]);

    const endTime = Date.now();
    console.log(`Race execution took: ${endTime - startTime}ms`);
    console.log("Fastest result:", fastestResult);

    return fastestResult;
  } catch (error) {
    console.error("Race error:", error.message);
    throw error;
  }
}

// Advanced: Custom promise combinator
function promiseAny(promises) {
  return new Promise((resolve, reject) => {
    let rejectionCount = 0;
    const rejections = [];

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(resolve) // Resolve with first successful result
        .catch((error) => {
          rejections[index] = error;
          rejectionCount++;

          if (rejectionCount === promises.length) {
            reject(new Error("All promises rejected"));
          }
        });
    });
  });
}

// TODO: Test the custom promiseAny function
async function testCustomCombinator() {
  console.log("\n=== Testing Custom Promise Combinator ===");

  try {
    const result = await promiseAny([
      fetchData("slow-api", 2000),
      fetchData("medium-api", 1000),
      fetchData("fast-api", 500)
    ]);

    console.log("First successful result:", result);
  } catch (error) {
    console.error("All promises failed:", error.message);
  }
}

// Concurrent processing with limited concurrency
async function batchProcessing(urls, batchSize = 3) {
  console.log("\n=== Batch Processing with Limited Concurrency ===");
  const results = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}`);

    // TODO: Process each batch in parallel
    const batchPromises = batch.map((url) => fetchData(url, 500));
    const batchResults = await Promise.allSettled(batchPromises);

    results.push(...batchResults);
  }

  return results;
}

// Run all tests
async function runAllTests() {
  try {
    // Test sequential vs parallel
    await sequentialExecution();
    await parallelExecution();

    // Test robust execution
    await robustParallelExecution();

    // Test race
    await raceExecution();

    // Test custom combinator
    await testCustomCombinator();

    // Test batch processing
    const urls = ["api1", "api2", "api3", "api4", "api5", "api6", "api7"];
    await batchProcessing(urls, 3);

    console.log("\nExercise 6-2 completed!");
  } catch (error) {
    console.error("Test error:", error.message);
  }
}

runAllTests();

// Instructions:
// 1. Compare the execution times of sequential vs parallel approaches
// 2. Complete the Promise.all implementation for parallel execution
// 3. Implement Promise.allSettled for robust error handling
// 4. Use Promise.race to get the fastest response
// 5. Test the custom promiseAny function
// 6. Understand when to use each promise combinator
// 7. Practice batch processing for handling large sets of operations
