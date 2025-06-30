/**
 * Exercise 6-3: Async Generators and Advanced Patterns
 *
 * Explore async generators, async iteration, and advanced async patterns.
 */

console.log("Starting Exercise 6-3: Async Generators and Advanced Patterns");

// Simulated data source
function createDataStream() {
  let count = 0;

  return {
    async next() {
      await new Promise((resolve) => setTimeout(resolve, 500));
      count++;

      if (count <= 5) {
        return {
          value: { id: count, data: `Item ${count}`, timestamp: Date.now() },
          done: false
        };
      } else {
        return { done: true };
      }
    }
  };
}

// TODO: Create an async generator function
async function* dataGenerator() {
  let count = 0;

  while (count < 5) {
    // TODO: Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 300));
    count++;

    // TODO: Yield data
    yield {
      id: count,
      data: `Generated item ${count}`,
      timestamp: Date.now()
    };
  }
}

// TODO: Create an async generator that fetches paginated data
async function* paginatedDataGenerator(pageSize = 3) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    console.log(`Fetching page ${page}...`);

    // TODO: Simulate API call for paginated data
    await new Promise((resolve) => setTimeout(resolve, 800));

    const data = Array.from({ length: pageSize }, (_, i) => ({
      id: (page - 1) * pageSize + i + 1,
      title: `Item ${(page - 1) * pageSize + i + 1}`,
      page: page
    }));

    // TODO: Simulate end condition
    hasMore = page < 3; // Only 3 pages of data
    page++;

    // TODO: Yield the page data
    yield data;
  }
}

// Async iteration patterns
async function consumeAsyncGenerator() {
  console.log("\n=== Consuming Async Generator ===");

  // TODO: Use for-await-of to consume the async generator
  for await (const item of dataGenerator()) {
    console.log("Received:", item);
  }
}

async function consumePaginatedData() {
  console.log("\n=== Consuming Paginated Data ===");

  // TODO: Use for-await-of to consume paginated data
  for await (const page of paginatedDataGenerator(2)) {
    console.log(`Page data (${page.length} items):`, page);
  }
}

// Advanced: Async generator with error handling
async function* resilientDataGenerator() {
  let attempt = 0;

  while (attempt < 8) {
    try {
      attempt++;

      // TODO: Simulate occasional failures
      if (Math.random() < 0.3) {
        throw new Error(`Network error on attempt ${attempt}`);
      }

      await new Promise((resolve) => setTimeout(resolve, 400));

      yield {
        attempt,
        data: `Resilient data ${attempt}`,
        success: true
      };
    } catch (error) {
      console.log(`Error: ${error.message}, retrying...`);

      // TODO: Yield error information
      yield {
        attempt,
        error: error.message,
        success: false
      };
    }
  }
}

// TODO: Create an async generator that transforms data
async function* transformDataGenerator(sourceGenerator, transformer) {
  for await (const item of sourceGenerator) {
    // TODO: Apply transformation
    const transformed = await transformer(item);
    yield transformed;
  }
}

// Async transformer function
async function enrichData(item) {
  // TODO: Simulate async enrichment
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    ...item,
    enriched: true,
    processedAt: new Date().toISOString(),
    hash: Math.random().toString(36).substr(2, 9)
  };
}

// Advanced pattern: Async pipeline
class AsyncPipeline {
  constructor() {
    this.steps = [];
  }

  // TODO: Add pipeline step
  pipe(asyncGeneratorFn) {
    this.steps.push(asyncGeneratorFn);
    return this;
  }

  // TODO: Execute pipeline
  async *execute(input) {
    let current = input;

    for (const step of this.steps) {
      current = step(current);
    }

    yield* current;
  }
}

// Concurrent async processing
async function processConcurrently(asyncIterable, concurrency = 3) {
  console.log("\n=== Concurrent Processing ===");
  const results = [];
  const workers = [];

  async function worker(items) {
    for await (const item of items) {
      // TODO: Process item
      const processed = await enrichData(item);
      results.push(processed);
      console.log("Processed:", processed.id || processed.attempt);
    }
  }

  // TODO: Create worker queues
  const queues = Array.from({ length: concurrency }, () => []);
  let queueIndex = 0;

  // TODO: Distribute items to workers
  for await (const item of asyncIterable) {
    queues[queueIndex].push(item);
    queueIndex = (queueIndex + 1) % concurrency;
  }

  // TODO: Start workers
  for (let i = 0; i < concurrency; i++) {
    workers.push(worker(queues[i]));
  }

  await Promise.all(workers);
  return results;
}

// Real-world example: File processing simulation
async function* fileProcessor(fileList) {
  for (const filename of fileList) {
    console.log(`Processing file: ${filename}`);

    // TODO: Simulate file reading
    await new Promise((resolve) => setTimeout(resolve, 600));

    // TODO: Simulate file processing
    const content = `Content of ${filename}`;
    const wordCount = content.split(" ").length;

    yield {
      filename,
      size: Math.floor(Math.random() * 10000),
      wordCount,
      processedAt: new Date().toISOString()
    };
  }
}

// Run all tests
async function runAllTests() {
  try {
    // Test basic async generator
    await consumeAsyncGenerator();

    // Test paginated data
    await consumePaginatedData();

    // Test resilient generator
    console.log("\n=== Testing Resilient Generator ===");
    for await (const result of resilientDataGenerator()) {
      if (result.success) {
        console.log("Success:", result.data);
      } else {
        console.log("Handled error:", result.error);
      }
    }

    // Test data transformation
    console.log("\n=== Testing Data Transformation ===");
    const sourceData = dataGenerator();
    const transformedData = transformDataGenerator(sourceData, enrichData);

    for await (const item of transformedData) {
      console.log("Transformed:", item);
    }

    // Test async pipeline
    console.log("\n=== Testing Async Pipeline ===");
    const pipeline = new AsyncPipeline().pipe((source) =>
      transformDataGenerator(source, enrichData)
    );

    for await (const item of pipeline.execute(dataGenerator())) {
      console.log("Pipeline result:", item.data);
    }

    // Test file processing
    console.log("\n=== Testing File Processing ===");
    const files = ["doc1.txt", "doc2.txt", "doc3.txt"];
    for await (const result of fileProcessor(files)) {
      console.log("File processed:", result);
    }

    console.log("\nExercise 6-3 completed!");
  } catch (error) {
    console.error("Test error:", error.message);
  }
}

runAllTests();

// Instructions:
// 1. Complete all async generator functions
// 2. Practice using for-await-of loops for async iteration
// 3. Implement error handling in async generators
// 4. Create data transformation pipelines
// 5. Test concurrent processing with async iterables
// 6. Understand when async generators are useful vs regular promises
// 7. Practice real-world scenarios like file processing and data streaming
