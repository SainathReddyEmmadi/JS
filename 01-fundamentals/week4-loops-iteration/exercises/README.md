# Week 4: Loops and Iteration Mastery Exercises 🎯

Master all forms of loops and iteration through comprehensive, progressive exercises that build real-world skills.

## 🎮 Exercise 1: Game Development - Turn-Based Battle System

Create a comprehensive turn-based battle system using various loop types.

```javascript
// TODO: Implement a complete battle system
class BattleSystem {
  constructor() {
    this.heroes = [];
    this.enemies = [];
    this.turnOrder = [];
    this.battleLog = [];
    this.round = 1;
  }

  // Character creation
  createCharacter(name, type, stats) {
    // Create hero or enemy with: name, health, attack, defense, speed, mana
    // Add special abilities based on type (warrior, mage, archer, etc.)
    // Validate all stats are positive numbers
    // Your code here
  }

  // Battle initialization
  startBattle(heroes, enemies) {
    // Set up battle participants
    // Calculate turn order based on speed stats
    // Initialize battle state
    // Display battle start message
    // Your code here
  }

  // Turn management
  processTurn() {
    // Get current character
    // Check if character is alive
    // If AI, choose best action
    // If player, present options (attack, defend, use item, cast spell)
    // Execute action and apply effects
    // Check for victory/defeat conditions
    // Move to next character in turn order
    // Your code here
  }

  // Combat actions
  executeAttack(attacker, target) {
    // Calculate damage (attack - defense + random factor)
    // Apply damage to target
    // Check for critical hits (chance based on attacker stats)
    // Add battle log entry
    // Return action result
    // Your code here
  }

  executeSpell(caster, spellName, targets) {
    // Check if caster has enough mana
    // Apply spell effects (damage, healing, buffs, debuffs)
    // Reduce mana cost
    // Handle area-of-effect spells
    // Add battle log entry
    // Your code here
  }

  // AI system
  chooseAIAction(character) {
    // Analyze battlefield situation
    // Prioritize actions: heal if low health, attack weakest enemy, etc.
    // Consider character type and available abilities
    // Return chosen action
    // Your code here
  }

  // Battle state management
  checkBattleEnd() {
    // Check if all heroes or all enemies are defeated
    // Calculate experience and rewards
    // Update character stats
    // Return battle result
    // Your code here
  }

  // Utility methods
  displayBattleStatus() {
    // Show current health/mana for all characters
    // Display current turn and round
    // Show recent battle log entries
    // Your code here
  }

  applyStatusEffects() {
    // Process ongoing effects (poison, regeneration, buffs, debuffs)
    // Reduce effect durations
    // Remove expired effects
    // Your code here
  }
}

// Test your battle system
const battle = new BattleSystem();

// Create some characters and test the battle
// Your test code here
```

**Requirements:**

- Use different loop types appropriately (for, while, for...of, forEach)
- Implement proper turn order using arrays and iteration
- Handle complex AI decision-making with nested loops
- Process multiple status effects efficiently
- Create engaging battle flow with proper pacing

---

## 📊 Exercise 2: Data Analytics Dashboard

Build a comprehensive data processing system using modern array methods.

```javascript
// TODO: Create an analytics system for e-commerce data
class ECommerceAnalytics {
  constructor() {
    this.salesData = [];
    this.customerData = [];
    this.productData = [];
    this.cache = new Map(); // For performance optimization
  }

  // Data loading and preprocessing
  loadSalesData(rawSalesData) {
    // Clean and validate sales data
    // Parse dates, normalize currencies, validate amounts
    // Remove duplicates and invalid entries
    // Calculate derived fields (profit, margin, etc.)
    // Your code here
  }

  loadCustomerData(rawCustomerData) {
    // Process customer information
    // Standardize addresses, phone numbers, emails
    // Calculate customer lifetime value
    // Segment customers by behavior
    // Your code here
  }

  // Advanced analytics methods
  calculateMonthlyTrends() {
    // Group sales by month and year
    // Calculate growth rates, seasonal patterns
    // Identify trending products
    // Return comprehensive trend analysis
    // Use: reduce, map, filter, groupBy
    // Your code here
  }

  findTopCustomers(limit = 10, criteria = "totalSpent") {
    // Analyze customer spending patterns
    // Calculate metrics: total spent, order frequency, average order value
    // Rank customers by various criteria
    // Handle tie-breaking scenarios
    // Use: map, sort, slice, reduce
    // Your code here
  }

  performCohortAnalysis() {
    // Group customers by acquisition month
    // Track retention and spending over time
    // Calculate cohort retention rates
    // Identify patterns in customer behavior
    // Use: complex reduce with nested objects
    // Your code here
  }

  detectAnomalies() {
    // Identify unusual sales patterns
    // Find outliers in order amounts, frequencies
    // Detect potential fraud indicators
    // Flag data quality issues
    // Use: statistical calculations with arrays
    // Your code here
  }

  // Product performance analysis
  analyzeProductPerformance() {
    // Calculate metrics for each product:
    // - Total sales, units sold, revenue
    // - Return rates, customer satisfaction
    // - Seasonal performance patterns
    // - Profit margins and trends
    // Chain multiple array methods efficiently
    // Your code here
  }

  // Geographic analysis
  analyzeRegionalPerformance() {
    // Group sales by region/country/state
    // Calculate regional metrics and comparisons
    // Identify growth opportunities
    // Handle geographic data normalization
    // Your code here
  }

  // Advanced filtering and search
  createAdvancedFilter(criteria) {
    // Support complex filtering:
    // - Date ranges, amount ranges
    // - Multiple product categories
    // - Customer segments
    // - Geographic regions
    // - Custom Boolean logic
    // Return filtered dataset
    // Your code here
  }

  // Performance optimization
  optimizeQueries() {
    // Implement caching for expensive calculations
    // Use indexed lookups for common queries
    // Batch process large datasets
    // Implement progressive loading
    // Your code here
  }

  // Report generation
  generateExecutiveSummary() {
    // Create comprehensive business summary
    // Include KPIs, trends, alerts
    // Format for executive consumption
    // Use all analytics methods together
    // Your code here
  }
}

// Sample data structures for testing
const sampleSalesData = [
  {
    orderId: "ORD-001",
    customerId: "CUST-123",
    productId: "PROD-456",
    quantity: 2,
    unitPrice: 49.99,
    orderDate: "2024-01-15",
    region: "North America",
    category: "Electronics"
  }
  // Add more sample data...
];

// Test your analytics system
const analytics = new ECommerceAnalytics();
// Your test code here
```

**Requirements:**

- Use all major array methods (map, filter, reduce, forEach, find, some, every)
- Implement efficient method chaining
- Handle large datasets with performance considerations
- Create reusable utility functions for common operations
- Include proper error handling and data validation

---

## 🔄 Exercise 3: Algorithm Implementation Showcase

Implement classic algorithms using different iteration approaches.

```javascript
// TODO: Implement various algorithms to demonstrate loop mastery

class AlgorithmShowcase {
  // Sorting algorithms
  bubbleSort(arr) {
    // Implement bubble sort with nested loops
    // Show step-by-step process
    // Count operations and comparisons
    // Your code here
  }

  insertionSort(arr) {
    // Implement insertion sort
    // Optimize for partially sorted arrays
    // Track performance metrics
    // Your code here
  }

  mergeSort(arr) {
    // Implement merge sort recursively
    // Handle divide and conquer approach
    // Optimize memory usage
    // Your code here
  }

  // Search algorithms
  linearSearch(arr, target) {
    // Implement with different loop types
    // Return index and comparison count
    // Handle edge cases
    // Your code here
  }

  binarySearch(sortedArr, target) {
    // Implement both iterative and recursive versions
    // Compare performance characteristics
    // Handle various edge cases
    // Your code here
  }

  // Data structure algorithms
  implementStack() {
    // Create stack using array with proper methods
    // Implement push, pop, peek, isEmpty
    // Add size limits and overflow handling
    // Your code here
  }

  implementQueue() {
    // Create queue with enqueue/dequeue operations
    // Handle circular buffer optimization
    // Implement priority queue variant
    // Your code here
  }

  // Graph algorithms
  breadthFirstSearch(graph, startNode) {
    // Implement BFS using queue
    // Track visited nodes and paths
    // Return traversal order and paths
    // Your code here
  }

  depthFirstSearch(graph, startNode) {
    // Implement both recursive and iterative DFS
    // Compare approaches and memory usage
    // Handle cycle detection
    // Your code here
  }

  // Mathematical algorithms
  calculatePrimes(limit) {
    // Implement Sieve of Eratosthenes
    // Optimize for large numbers
    // Return prime numbers and statistics
    // Your code here
  }

  fibonacci(n) {
    // Implement multiple approaches:
    // - Recursive (naive)
    // - Iterative
    // - Memoized
    // - Array-based
    // Compare performance
    // Your code here
  }

  // String algorithms
  findAnagrams(words) {
    // Group words that are anagrams
    // Use efficient sorting and hashing
    // Handle case sensitivity and spaces
    // Your code here
  }

  longestCommonSubsequence(str1, str2) {
    // Implement LCS algorithm
    // Use dynamic programming with loops
    // Return both length and actual subsequence
    // Your code here
  }

  // Performance benchmarking
  benchmarkAlgorithms() {
    // Test all algorithms with various input sizes
    // Measure execution time and memory usage
    // Generate performance reports
    // Compare Big O theoretical vs actual performance
    // Your code here
  }
}

// Test framework
class AlgorithmTester {
  constructor() {
    this.testCases = [];
    this.results = [];
  }

  addTestCase(name, algorithm, inputs, expectedOutput) {
    // Add test case for validation
    // Your code here
  }

  runAllTests() {
    // Execute all test cases
    // Validate outputs and performance
    // Generate test report
    // Your code here
  }
}

// Usage example
const algorithms = new AlgorithmShowcase();
const tester = new AlgorithmTester();

// Add your test cases and run algorithms
```

**Requirements:**

- Implement at least 5 different sorting/searching algorithms
- Use appropriate loop types for each algorithm
- Include performance benchmarking and comparison
- Provide detailed step-by-step visualization
- Handle edge cases and error conditions

---

## 🏗️ Exercise 4: Real-Time System Simulation

Create a complex simulation system that demonstrates advanced loop control.

```javascript
// TODO: Build a comprehensive city traffic simulation system
class TrafficSimulation {
  constructor(cityConfig) {
    this.intersections = [];
    this.roads = [];
    this.vehicles = [];
    this.trafficLights = [];
    this.simulationTime = 0;
    this.statistics = {
      totalVehicles: 0,
      averageSpeed: 0,
      accidents: 0,
      trafficJams: []
    };
  }

  // Setup methods
  initializeCity(config) {
    // Create road network with intersections
    // Set up traffic lights with timing patterns
    // Define vehicle spawn points and destinations
    // Initialize weather and time-of-day effects
    // Your code here
  }

  // Vehicle management
  spawnVehicles() {
    // Generate vehicles based on time of day
    // Assign random or realistic routes
    // Set vehicle properties (speed, size, type)
    // Handle different vehicle types (cars, trucks, buses)
    // Use probability distributions for realistic traffic
    // Your code here
  }

  updateVehiclePositions() {
    // Move each vehicle along its route
    // Handle speed adjustments for traffic
    // Process lane changes and overtaking
    // Check for collisions and near-misses
    // Remove vehicles that reach destinations
    // Use forEach with complex position calculations
    // Your code here
  }

  // Traffic light management
  updateTrafficLights() {
    // Process traffic light timing cycles
    // Handle emergency vehicle priority
    // Implement smart traffic control algorithms
    // Coordinate light timing across intersections
    // Use nested loops for intersection processing
    // Your code here
  }

  // Intersection processing
  processIntersections() {
    // Handle vehicle queuing at intersections
    // Process right-of-way rules
    // Manage turning movements and conflicts
    // Track waiting times and queue lengths
    // Detect and resolve deadlock situations
    // Your code here
  }

  // Advanced simulation features
  handleEmergencyVehicles() {
    // Spawn emergency vehicles with special behavior
    // Clear paths through traffic
    // Override normal traffic light patterns
    // Track emergency response times
    // Your code here
  }

  simulateWeatherEffects() {
    // Adjust vehicle speeds for weather conditions
    // Increase accident probability in bad weather
    // Modify visibility and reaction times
    // Handle road condition changes
    // Your code here
  }

  detectTrafficJams() {
    // Analyze vehicle speeds and densities
    // Identify congestion hotspots
    // Calculate jam severity and duration
    // Suggest alternative routes
    // Use complex array analysis
    // Your code here
  }

  // Main simulation loop
  runSimulation(duration, timeStep = 1) {
    // Main simulation loop with proper timing
    // Process all system updates in correct order
    // Handle pause/resume functionality
    // Collect statistics and metrics
    // Use while loop with complex exit conditions
    // Your code here
  }

  // Analytics and reporting
  generateTrafficReport() {
    // Analyze simulation data for insights
    // Calculate key performance indicators
    // Identify optimization opportunities
    // Format comprehensive report
    // Use extensive data processing with array methods
    // Your code here
  }

  optimizeTrafficFlow() {
    // Experiment with different light timing patterns
    // Test alternative road configurations
    // Evaluate emergency lane effectiveness
    // Use simulation results to improve parameters
    // Your code here
  }

  // Visualization helpers
  exportSimulationData() {
    // Prepare data for visualization tools
    // Create time-series data for analysis
    // Export heatmaps of traffic density
    // Generate vehicle path traces
    // Your code here
  }
}

// Additional challenge: Multi-threaded simulation
class AdvancedTrafficSimulation extends TrafficSimulation {
  // TODO: Implement parallel processing for large-scale simulations
  // Use Web Workers or similar for performance

  runParallelSimulation() {
    // Divide city into regions
    // Process each region in parallel
    // Synchronize border interactions
    // Merge results efficiently
    // Your code here
  }
}

// Test your simulation
const cityConfig = {
  gridSize: { width: 10, height: 10 },
  intersectionDensity: 0.3,
  trafficLightTiming: { green: 30, yellow: 5, red: 25 },
  vehicleSpawnRate: 5, // vehicles per minute
  simulationSpeed: 1.0
};

const simulation = new TrafficSimulation(cityConfig);
// Your test code here
```

**Requirements:**

- Use all loop types appropriately for different simulation aspects
- Implement proper timing and performance optimization
- Handle complex state management with arrays and objects
- Create realistic behavior with probability and statistics
- Include comprehensive data analysis and reporting

---

## 🎯 Exercise 5: Interactive Learning Game

Build an educational game that teaches programming concepts through iteration.

```javascript
// TODO: Create a comprehensive coding challenge game
class CodingChallengeGame {
  constructor() {
    this.player = {
      name: "",
      level: 1,
      experience: 0,
      skills: {},
      completedChallenges: [],
      currentStreak: 0
    };
    this.challenges = [];
    this.leaderboard = [];
    this.gameState = "menu";
  }

  // Game initialization
  setupGame() {
    // Create progressive challenge levels
    // Load player progress from storage
    // Initialize scoring system
    // Set up hint and help systems
    // Your code here
  }

  // Challenge generation
  generateLoopChallenges() {
    // Create challenges for each loop type:
    // - Basic for loops (counting, array processing)
    // - While loops (condition-based problems)
    // - Array method challenges (map, filter, reduce)
    // - Nested loop problems (2D arrays, combinations)
    // - Performance optimization challenges
    // Your code here
  }

  // Interactive code execution
  executePlayerCode(code, testCases) {
    // Safely execute player's code
    // Run against multiple test cases
    // Measure performance (time, memory)
    // Provide detailed feedback
    // Handle syntax and runtime errors gracefully
    // Your code here
  }

  // Hint system
  generateHints(challenge, playerAttempts) {
    // Analyze player's code attempts
    // Provide progressive hints:
    // 1. High-level approach suggestion
    // 2. Specific syntax or method hints
    // 3. Partial code examples
    // 4. Complete solution walkthrough
    // Your code here
  }

  // Progress tracking
  updatePlayerProgress(challengeResult) {
    // Calculate experience points based on:
    // - Challenge difficulty
    // - Time to complete
    // - Code efficiency
    // - Number of attempts
    // Update skill levels and unlock new challenges
    // Your code here
  }

  // Adaptive difficulty
  adjustDifficulty() {
    // Monitor player performance
    // Adjust challenge difficulty dynamically
    // Provide additional practice for weak areas
    // Skip ahead for advanced players
    // Your code here
  }

  // Game mechanics
  runGameLoop() {
    // Main game loop with different states:
    // - Menu navigation
    // - Challenge selection
    // - Code editing and testing
    // - Results and feedback
    // - Progress tracking
    // Use state machine pattern with loops
    // Your code here
  }

  // Social features
  updateLeaderboard() {
    // Track player rankings by various metrics
    // Handle ties and score calculations
    // Implement seasonal competitions
    // Create team challenges
    // Your code here
  }

  // Challenge categories
  createArrayChallenges() {
    return [
      {
        id: "array-sum",
        title: "Sum Array Elements",
        description: "Calculate the sum of all numbers in an array",
        difficulty: "beginner",
        template: "function sumArray(numbers) {\n  // Your code here\n}",
        testCases: [
          { input: [[1, 2, 3, 4, 5]], expected: 15 },
          { input: [[-1, 0, 1]], expected: 0 },
          { input: [[]], expected: 0 }
        ],
        hints: [
          "You can use a for loop to iterate through the array",
          "Initialize a sum variable to 0 before the loop",
          "Add each element to the sum inside the loop"
        ]
      }
      // Add many more challenges...
    ];
  }

  createAlgorithmChallenges() {
    // Create challenges for sorting, searching, etc.
    // Include visual demonstrations
    // Provide step-by-step debugging
    // Your code here
  }

  // Assessment system
  assessPlayerSkills() {
    // Analyze completed challenges
    // Identify strengths and weaknesses
    // Generate personalized learning recommendations
    // Create skill certificates and badges
    // Your code here
  }
}

// Game UI controller
class GameUI {
  constructor(game) {
    this.game = game;
    this.codeEditor = null;
    this.testOutput = null;
  }

  // TODO: Implement game interface
  setupInterface() {
    // Create code editor with syntax highlighting
    // Set up test case visualization
    // Implement progress bars and statistics
    // Add interactive tutorials
    // Your code here
  }

  displayChallenge(challenge) {
    // Show challenge description and requirements
    // Load code template into editor
    // Display test cases and expected outputs
    // Set up real-time feedback
    // Your code here
  }

  runTests() {
    // Execute player code against test cases
    // Show results with visual feedback
    // Highlight passing/failing tests
    // Provide performance metrics
    // Your code here
  }
}

// Launch the game
const game = new CodingChallengeGame();
const ui = new GameUI(game);

// Your initialization code here
```

**Requirements:**

- Create at least 20 progressive challenges covering all loop types
- Implement safe code execution and testing framework
- Include comprehensive hint and feedback systems
- Track detailed player progress and analytics
- Design engaging game mechanics with rewards and progression

---

## 🏆 Bonus Challenge: Performance Optimization Contest

```javascript
// TODO: Optimize these deliberately inefficient functions
// Goal: Improve performance while maintaining correctness

// Challenge 1: Optimize this data processing pipeline
function processLargeDataset(data) {
  // This function is intentionally inefficient
  let result = [];

  for (let i = 0; i < data.length; i++) {
    if (data[i].status === "active") {
      for (let j = 0; j < data.length; j++) {
        if (data[j].category === data[i].category && j !== i) {
          let processed = {
            id: data[i].id,
            name: data[i].name,
            relatedCount: 0
          };

          for (let k = 0; k < data.length; k++) {
            if (data[k].category === data[i].category) {
              processed.relatedCount++;
            }
          }

          result.push(processed);
          break;
        }
      }
    }
  }

  return result;
}

// Your optimized version:
function processLargeDatasetOptimized(data) {
  // TODO: Rewrite this to be much more efficient
  // Hint: Consider using Map for lookups, reduce redundant loops
  // Your code here
}

// Challenge 2: Optimize this search function
function findComplexMatches(items, criteria) {
  let matches = [];

  for (let i = 0; i < items.length; i++) {
    let isMatch = true;

    for (let key in criteria) {
      if (typeof criteria[key] === "function") {
        if (!criteria[key](items[i][key])) {
          isMatch = false;
          break;
        }
      } else if (items[i][key] !== criteria[key]) {
        isMatch = false;
        break;
      }
    }

    if (isMatch) {
      // Expensive operation inside loop
      let enrichedItem = JSON.parse(JSON.stringify(items[i]));
      enrichedItem.score = calculateComplexScore(enrichedItem);
      matches.push(enrichedItem);
    }
  }

  return matches.sort((a, b) => b.score - a.score);
}

// Your optimized version:
function findComplexMatchesOptimized(items, criteria) {
  // TODO: Optimize this search and scoring function
  // Your code here
}
```

**Optimization Goals:**

- Reduce time complexity from O(n³) to O(n) or O(n log n)
- Minimize memory allocations and garbage collection
- Use appropriate data structures for faster lookups
- Implement caching strategies for expensive operations
- Measure and compare performance improvements

---

## ✅ Self-Assessment Checklist

Check off each item as you master it:

### Basic Loop Concepts

- [ ] Can write `for`, `while`, and `do-while` loops correctly
- [ ] Understand when to use each loop type
- [ ] Can avoid infinite loops and off-by-one errors
- [ ] Use `break` and `continue` appropriately
- [ ] Handle nested loops without confusion

### Array Methods Mastery

- [ ] Use `forEach()` for side effects
- [ ] Transform data with `map()`
- [ ] Filter data with `filter()`
- [ ] Aggregate data with `reduce()`
- [ ] Find elements with `find()` and `findIndex()`
- [ ] Validate data with `some()` and `every()`

### Advanced Techniques

- [ ] Chain array methods effectively
- [ ] Choose optimal iteration approach for performance
- [ ] Implement complex data transformations
- [ ] Handle async operations with loops
- [ ] Create reusable utility functions

### Real-World Applications

- [ ] Process and analyze datasets
- [ ] Implement algorithms with appropriate loops
- [ ] Build interactive applications with game loops
- [ ] Optimize performance for large datasets
- [ ] Debug and troubleshoot iteration issues

### Problem-Solving Skills

- [ ] Break down complex problems into iteration steps
- [ ] Choose appropriate data structures for iteration
- [ ] Handle edge cases and error conditions
- [ ] Write readable and maintainable loop code
- [ ] Test and validate iteration logic thoroughly

## 🚀 Next Steps After Week 4

1. **Practice Daily**: Solve at least one loop-related problem each day
2. **Build Projects**: Create applications that heavily use iteration (data dashboards, games, simulations)
3. **Study Algorithms**: Dive deeper into algorithmic thinking and complexity analysis
4. **Optimize Performance**: Learn about profiling and optimizing iteration-heavy code
5. **Prepare for Week 5**: Get ready for DOM manipulation and event handling!

## 💡 Pro Tips for Effective Learning

1. **Start Simple**: Master basic loops before moving to complex array methods
2. **Practice Debugging**: Learn to identify and fix common loop issues
3. **Performance Awareness**: Always consider the efficiency of your iterations
4. **Read Other Code**: Study how experienced developers use loops and iterations
5. **Build Real Projects**: Apply your skills to actual problems you want to solve

Remember: Loops and iteration are the backbone of most programming logic. Master them, and you'll be able to solve almost any computational problem! 🎯
