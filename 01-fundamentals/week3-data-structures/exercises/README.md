# Week 3: Arrays and Objects Exercises 🎯

Master arrays, objects, and their combination through comprehensive hands-on exercises.

## 🛒 Exercise 1: E-commerce Product Management System

Build a comprehensive product management system using arrays and objects.

```javascript
// TODO: Create a ProductManager system
const ProductManager = {
  products: [],
  categories: [],
  suppliers: [],

  // Product management
  addProduct(productData) {
    // Add a new product with validation
    // Required fields: name, price, category, supplier, stock
    // Generate unique ID, add timestamps
    // Handle duplicate names, validate price > 0
    // Your code here
  },

  updateProduct(productId, updates) {
    // Update existing product
    // Don't allow changing ID or timestamps
    // Validate all updates
    // Your code here
  },

  deleteProduct(productId) {
    // Soft delete (mark as inactive) or hard delete
    // Your code here
  },

  // Search and filter
  searchProducts(query) {
    // Search by name, description, category
    // Case-insensitive search
    // Return matching products
    // Your code here
  },

  filterProducts(criteria) {
    // Filter by: category, price range, supplier, stock level
    // criteria = { category: "Electronics", priceMin: 100, priceMax: 500 }
    // Your code here
  },

  sortProducts(sortBy, order = "asc") {
    // Sort by: name, price, date, stock
    // Order: 'asc' or 'desc'
    // Your code here
  },

  // Analytics
  getProductStats() {
    // Return: total products, categories count, average price,
    // most expensive, cheapest, out of stock count
    // Your code here
  },

  getLowStockProducts(threshold = 10) {
    // Return products with stock below threshold
    // Your code here
  },

  getCategoryBreakdown() {
    // Return object with product count per category
    // Your code here
  },

  // Inventory management
  updateStock(productId, quantity, operation = "set") {
    // operation: 'set', 'add', 'subtract'
    // Track stock changes with history
    // Your code here
  },

  processSale(items) {
    // items = [{ productId, quantity }, ...]
    // Update stock, calculate total, validate availability
    // Return sale summary
    // Your code here
  },

  generateReport(type = "summary") {
    // Generate different types of reports: summary, inventory, sales
    // Your code here
  }
};

// Test data and usage examples
const sampleProducts = [
  {
    name: "iPhone 14",
    price: 999,
    category: "Electronics",
    supplier: "Apple",
    stock: 50
  },
  {
    name: "MacBook Pro",
    price: 1999,
    category: "Electronics",
    supplier: "Apple",
    stock: 25
  },
  {
    name: "Nike Air Max",
    price: 150,
    category: "Shoes",
    supplier: "Nike",
    stock: 100
  },
  {
    name: "Levi's Jeans",
    price: 80,
    category: "Clothing",
    supplier: "Levi's",
    stock: 75
  }
];

// Add sample products and test your implementation
sampleProducts.forEach((product) => ProductManager.addProduct(product));
console.log(ProductManager.getProductStats());
console.log(
  ProductManager.filterProducts({ category: "Electronics", priceMax: 1500 })
);
```

## 📚 Exercise 2: Student Grade Management System

Create a comprehensive grade management system with complex data relationships.

```javascript
// TODO: Build a GradeManager system
const GradeManager = {
  students: [],
  courses: [],
  enrollments: [], // Links students to courses
  assignments: [], // Course assignments
  grades: [], // Individual grades

  // Student management
  addStudent(studentData) {
    // Required: firstName, lastName, email, studentId
    // Generate unique ID if not provided
    // Validate email format
    // Your code here
  },

  // Course management
  addCourse(courseData) {
    // Required: code, name, credits, instructor
    // Validate course code uniqueness
    // Your code here
  },

  // Enrollment management
  enrollStudent(studentId, courseCode) {
    // Enroll student in course
    // Check prerequisites, capacity limits
    // Track enrollment date
    // Your code here
  },

  // Assignment management
  addAssignment(courseCode, assignmentData) {
    // Add assignment to course
    // Required: name, maxPoints, dueDate, type (homework, quiz, exam)
    // Your code here
  },

  // Grade management
  recordGrade(studentId, assignmentId, points, feedback = "") {
    // Record grade for student assignment
    // Validate points <= maxPoints
    // Calculate percentage
    // Your code here
  },

  // Calculations and analytics
  calculateStudentGPA(studentId) {
    // Calculate overall GPA across all courses
    // Weight by credit hours
    // Your code here
  },

  calculateCourseGrade(studentId, courseCode) {
    // Calculate final grade for specific course
    // Weight different assignment types
    // Return letter grade and percentage
    // Your code here
  },

  getClassStatistics(courseCode) {
    // Return class stats: average, median, std deviation, grade distribution
    // Your code here
  },

  getStudentTranscript(studentId) {
    // Generate complete transcript with all courses and grades
    // Include GPA, credit hours, etc.
    // Your code here
  },

  // Advanced features
  findAtRiskStudents(threshold = 2.0) {
    // Find students with GPA below threshold
    // Include recent grade trends
    // Your code here
  },

  generateProgressReport(studentId, courseCode) {
    // Detailed progress report for student in specific course
    // Include grade breakdown, missing assignments, improvement suggestions
    // Your code here
  },

  exportGrades(courseCode, format = "json") {
    // Export grades in different formats: json, csv
    // Your code here
  }
};

// Test the system with sample data
const sampleData = {
  students: [
    {
      firstName: "Alice",
      lastName: "Johnson",
      email: "alice@email.com",
      studentId: "S001"
    },
    {
      firstName: "Bob",
      lastName: "Smith",
      email: "bob@email.com",
      studentId: "S002"
    },
    {
      firstName: "Charlie",
      lastName: "Brown",
      email: "charlie@email.com",
      studentId: "S003"
    }
  ],
  courses: [
    {
      code: "CS101",
      name: "Introduction to Programming",
      credits: 3,
      instructor: "Dr. Wilson"
    },
    {
      code: "MATH201",
      name: "Calculus II",
      credits: 4,
      instructor: "Prof. Davis"
    }
  ]
};

// Implement and test your system
```

## 🏦 Exercise 3: Banking System Simulation

Create a banking system with accounts, transactions, and financial operations.

```javascript
// TODO: Implement a comprehensive Banking System
const BankingSystem = {
  accounts: new Map(),
  transactions: [],
  interestRates: {
    savings: 0.02,
    checking: 0.001,
    premium: 0.035
  },

  // Account management
  createAccount(accountData) {
    // Create new account: checking, savings, or premium
    // Generate account number, validate initial deposit
    // Required: customerName, accountType, initialDeposit
    // Your code here
  },

  closeAccount(accountNumber) {
    // Close account, transfer remaining balance
    // Record closure transaction
    // Your code here
  },

  // Transaction operations
  deposit(accountNumber, amount, description = "") {
    // Deposit money to account
    // Validate amount > 0, account exists
    // Record transaction, update balance
    // Your code here
  },

  withdraw(accountNumber, amount, description = "") {
    // Withdraw money from account
    // Check sufficient funds, daily limits
    // Apply fees for overdrafts if applicable
    // Your code here
  },

  transfer(fromAccount, toAccount, amount, description = "") {
    // Transfer between accounts
    // Validate both accounts exist, sufficient funds
    // Record both debit and credit transactions
    // Your code here
  },

  // Advanced features
  calculateInterest(accountNumber) {
    // Calculate interest based on account type and balance
    // Consider minimum balance requirements
    // Your code here
  },

  applyMonthlyInterest() {
    // Apply interest to all eligible accounts
    // Record interest transactions
    // Your code here
  },

  // Reporting and analytics
  getAccountStatement(accountNumber, startDate, endDate) {
    // Generate account statement for date range
    // Include beginning balance, transactions, ending balance
    // Your code here
  },

  getTransactionHistory(accountNumber, limit = 50) {
    // Get recent transactions for account
    // Support pagination
    // Your code here
  },

  detectSuspiciousActivity(accountNumber) {
    // Detect unusual transaction patterns
    // Large amounts, frequent transactions, etc.
    // Your code here
  },

  generateBankSummary() {
    // Overall bank statistics
    // Total deposits, number of accounts, transaction volume
    // Your code here
  },

  // Utility functions
  validateAccount(accountNumber) {
    // Check if account exists and is active
    // Your code here
  },

  formatCurrency(amount) {
    // Format amount as currency string
    // Your code here
  },

  generateAccountNumber() {
    // Generate unique account number
    // Your code here
  }
};

// Test the banking system
const testAccounts = [
  {
    customerName: "Alice Johnson",
    accountType: "checking",
    initialDeposit: 1000
  },
  { customerName: "Bob Smith", accountType: "savings", initialDeposit: 5000 },
  {
    customerName: "Charlie Brown",
    accountType: "premium",
    initialDeposit: 10000
  }
];

// Create accounts and perform operations
testAccounts.forEach((data) => {
  const account = BankingSystem.createAccount(data);
  console.log(
    `Created account ${account.accountNumber} for ${data.customerName}`
  );
});
```

## 📱 Exercise 4: Social Media Analytics Dashboard

Build a social media analytics system with complex data aggregation.

```javascript
// TODO: Create a SocialMediaAnalytics system
const SocialMediaAnalytics = {
  posts: [],
  users: [],
  interactions: [], // likes, comments, shares
  hashtags: new Map(),

  // Data ingestion
  addPost(postData) {
    // Add new post with metadata
    // Required: userId, content, platform, timestamp
    // Extract hashtags, mentions, media info
    // Your code here
  },

  addUser(userData) {
    // Add user profile
    // Required: username, platform, followerCount
    // Your code here
  },

  recordInteraction(interactionData) {
    // Record like, comment, share, etc.
    // Required: postId, userId, type, timestamp
    // Your code here
  },

  // Analytics functions
  getEngagementMetrics(postId) {
    // Calculate engagement rate, reach, impressions
    // Return detailed metrics object
    // Your code here
  },

  getUserAnalytics(userId, timeframe = "30d") {
    // User performance over timeframe
    // Total posts, average engagement, top posts
    // Your code here
  },

  getTrendingHashtags(limit = 10, timeframe = "24h") {
    // Get trending hashtags with usage count
    // Sort by recent usage and growth rate
    // Your code here
  },

  getViralContent(threshold = 1000) {
    // Find posts with engagement above threshold
    // Calculate virality score
    // Your code here
  },

  // Advanced analytics
  analyzeAudienceEngagement(userId) {
    // Analyze when audience is most active
    // Best posting times, engagement patterns
    // Your code here
  },

  generateContentRecommendations(userId) {
    // Recommend content types based on historical performance
    // Hashtag suggestions, optimal posting frequency
    // Your code here
  },

  detectInfluencers(minFollowers = 10000, engagementRate = 0.05) {
    // Find users meeting influencer criteria
    // Calculate influence scores
    // Your code here
  },

  // Reporting
  generateDashboard(userId, period = "week") {
    // Generate comprehensive dashboard data
    // Charts data, key metrics, comparisons
    // Your code here
  },

  exportAnalytics(format = "json", filters = {}) {
    // Export analytics data in various formats
    // Apply filters for date range, users, etc.
    // Your code here
  },

  // Helper functions
  extractHashtags(content) {
    // Extract hashtags from post content
    // Your code here
  },

  calculateEngagementRate(interactions, followers) {
    // Calculate engagement rate formula
    // Your code here
  },

  aggregateByTimeframe(data, timeframe) {
    // Group data by hour, day, week, month
    // Your code here
  }
};

// Sample data for testing
const samplePosts = [
  {
    userId: "user1",
    content: "Loving the new #JavaScript features! #WebDev #Programming",
    platform: "twitter",
    timestamp: new Date("2024-01-15T10:30:00Z")
  },
  {
    userId: "user2",
    content: "Check out my latest project #ReactJS #Frontend",
    platform: "linkedin",
    timestamp: new Date("2024-01-15T14:20:00Z")
  }
];

// Test your implementation
```

## 🎮 Exercise 5: Game Inventory and Stats System

Create a complex game system with inventory management and player statistics.

```javascript
// TODO: Build a GameSystem with inventory and stats
const GameSystem = {
  players: new Map(),
  items: new Map(),
  itemCategories: [],

  // Player management
  createPlayer(playerData) {
    // Create new player with starting inventory and stats
    // Required: username, email
    // Initialize: level=1, xp=0, gold=100, empty inventory
    // Your code here
  },

  // Item system
  createItem(itemData) {
    // Create game item with properties
    // Required: name, type, rarity, value
    // Optional: stats (attack, defense, magic), requirements
    // Your code here
  },

  // Inventory management
  addItemToInventory(playerId, itemId, quantity = 1) {
    // Add item to player inventory
    // Handle stacking, weight limits, capacity
    // Your code here
  },

  removeItemFromInventory(playerId, itemId, quantity = 1) {
    // Remove item from player inventory
    // Handle partial quantities
    // Your code here
  },

  equipItem(playerId, itemId, slot) {
    // Equip item to specific slot (weapon, armor, accessory)
    // Check requirements, unequip current item
    // Update player stats
    // Your code here
  },

  // Trading system
  tradeItems(player1Id, player2Id, trade1Items, trade2Items) {
    // Handle item trading between players
    // Validate both players have items
    // Execute atomic trade
    // Your code here
  },

  // Stats and progression
  gainExperience(playerId, xpAmount) {
    // Add XP and handle level ups
    // Calculate new stats on level up
    // Your code here
  },

  calculatePlayerStats(playerId) {
    // Calculate total stats including equipped items
    // Base stats + item bonuses + level bonuses
    // Your code here
  },

  // Analytics and reporting
  getInventoryValue(playerId) {
    // Calculate total value of player's inventory
    // Consider item rarity multipliers
    // Your code here
  },

  getTopPlayers(metric = "level", limit = 10) {
    // Get top players by level, wealth, achievements
    // Your code here
  },

  getItemPopularity() {
    // Analyze which items are most commonly owned/equipped
    // Your code here
  },

  generatePlayerReport(playerId) {
    // Comprehensive player report
    // Stats, inventory, achievements, ranking
    // Your code here
  },

  // Advanced features
  simulateBattle(player1Id, player2Id) {
    // Simulate battle between two players
    // Use stats to calculate outcomes
    // Return battle log and results
    // Your code here
  },

  craftItem(playerId, recipe) {
    // Craft new item from materials
    // Check player has required items and skills
    // Consume materials, create new item
    // Your code here
  },

  auctionItem(sellerId, itemId, startingBid, duration) {
    // Create auction for item
    // Handle bidding process
    // Your code here
  }
};

// Sample game data
const sampleItems = [
  {
    name: "Iron Sword",
    type: "weapon",
    rarity: "common",
    value: 50,
    stats: { attack: 10 }
  },
  {
    name: "Steel Armor",
    type: "armor",
    rarity: "uncommon",
    value: 150,
    stats: { defense: 15 }
  },
  {
    name: "Magic Ring",
    type: "accessory",
    rarity: "rare",
    value: 300,
    stats: { magic: 20 }
  },
  {
    name: "Health Potion",
    type: "consumable",
    rarity: "common",
    value: 25,
    effect: "heal"
  }
];

// Test your game system implementation
```

## 🏪 Exercise 6: Advanced Data Structure Operations

Practice complex operations combining arrays and objects.

```javascript
// TODO: Implement advanced data manipulation utilities

const DataUtils = {
  // Deep operations
  deepMerge(...objects) {
    // Merge multiple objects deeply
    // Handle arrays, nested objects, primitive conflicts
    // Your code here
  },

  deepDiff(obj1, obj2) {
    // Find differences between two objects
    // Return added, removed, changed properties
    // Handle nested structures
    // Your code here
  },

  deepClone(obj) {
    // Create deep copy handling all data types
    // Arrays, objects, dates, functions, etc.
    // Your code here
  },

  // Path operations
  getNestedValue(obj, path) {
    // Get value at nested path: "user.profile.address.city"
    // Handle missing properties gracefully
    // Your code here
  },

  setNestedValue(obj, path, value) {
    // Set value at nested path, create path if needed
    // Your code here
  },

  deleteNestedProperty(obj, path) {
    // Delete property at nested path
    // Your code here
  },

  // Array operations
  groupBy(array, key) {
    // Group array elements by property or function result
    // Return object with grouped arrays
    // Your code here
  },

  partition(array, predicate) {
    // Split array into two arrays based on predicate
    // Return [matching, notMatching]
    // Your code here
  },

  chunk(array, size) {
    // Split array into chunks of specified size
    // Your code here
  },

  // Object operations
  pickBy(obj, predicate) {
    // Create new object with properties matching predicate
    // Your code here
  },

  omitBy(obj, predicate) {
    // Create new object excluding properties matching predicate
    // Your code here
  },

  mapValues(obj, mapper) {
    // Transform all object values using mapper function
    // Your code here
  },

  // Advanced transformations
  pivot(array, keyProp, valueProp) {
    // Transform array of objects to object with key-value pairs
    // Your code here
  },

  denormalize(normalizedData, schema) {
    // Convert normalized data back to nested structure
    // Your code here
  },

  normalize(data, idKey = "id") {
    // Convert nested data to flat structure with references
    // Your code here
  }
};

// Test cases for your implementations
const testData = {
  users: [
    { id: 1, name: "Alice", department: "Engineering", salary: 90000 },
    { id: 2, name: "Bob", department: "Marketing", salary: 75000 },
    { id: 3, name: "Charlie", department: "Engineering", salary: 95000 },
    { id: 4, name: "Diana", department: "Sales", salary: 80000 }
  ],

  nested: {
    level1: {
      level2: {
        level3: {
          value: "deep value"
        }
      }
    }
  }
};

// Test your utility functions
console.log(DataUtils.groupBy(testData.users, "department"));
console.log(
  DataUtils.getNestedValue(testData.nested, "level1.level2.level3.value")
);
```

## 🎯 Exercise 7: Performance Optimization Challenge

Optimize data operations for large datasets.

```javascript
// TODO: Create optimized versions of common operations
const OptimizedDataOps = {
  // Efficient search operations
  createSearchIndex(array, searchFields) {
    // Create search index for fast text search
    // Support multiple fields, fuzzy matching
    // Your code here
  },

  binarySearch(sortedArray, target, compareFn) {
    // Implement binary search with custom compare function
    // Your code here
  },

  // Memory-efficient operations
  streamProcess(largeDataset, processor, batchSize = 1000) {
    // Process large dataset in batches to avoid memory issues
    // Your code here
  },

  lazyFilter(array, predicate) {
    // Return iterator that filters lazily
    // Don't process until values are requested
    // Your code here
  },

  // Cache optimization
  memoizeExpensive(fn, maxSize = 100) {
    // Memoize function with LRU cache
    // Limit cache size to prevent memory leaks
    // Your code here
  },

  // Benchmark utilities
  benchmark(fn, iterations = 1000) {
    // Benchmark function performance
    // Return average execution time, memory usage
    // Your code here
  },

  comparePerformance(implementations, testData) {
    // Compare performance of different implementations
    // Return detailed performance report
    // Your code here
  }
};

// Performance test scenarios
const largeDataset = Array.from({ length: 100000 }, (_, i) => ({
  id: i,
  name: `User ${i}`,
  score: Math.random() * 100,
  category: ["A", "B", "C"][i % 3]
}));

// Test performance optimizations
```

## 📊 Self-Assessment Checklist

After completing these exercises, you should be able to:

- [ ] Create and manipulate complex data structures combining arrays and objects
- [ ] Implement efficient search, filter, and sort operations
- [ ] Handle nested data structures and object relationships
- [ ] Use destructuring for clean data extraction
- [ ] Apply functional programming concepts to data transformation
- [ ] Build real-world applications with proper data modeling
- [ ] Optimize performance for large datasets
- [ ] Debug complex data structure issues

## 🎯 Learning Outcomes

By completing these exercises, you will have:

1. **Mastered Data Structures** - Arrays, objects, and their combinations
2. **Built Real Systems** - E-commerce, banking, social media, gaming systems
3. **Applied Best Practices** - Data validation, error handling, performance optimization
4. **Developed Problem-Solving Skills** - Breaking complex problems into manageable parts
5. **Gained Practical Experience** - Real-world scenarios and requirements

## 🔗 Next Steps

After mastering these concepts:

1. Review and optimize your solutions
2. Build a capstone project combining multiple systems
3. Move on to [Loops and Iteration](../week4-loops-iteration/)
4. Explore advanced JavaScript patterns and frameworks

## 💡 Pro Tips

- **Start simple** then add complexity gradually
- **Test edge cases** like empty arrays, null values, invalid inputs
- **Use meaningful variable names** and add comments for complex logic
- **Consider performance** for operations on large datasets
- **Practice debugging** with browser DevTools
- **Refactor regularly** to improve code quality
