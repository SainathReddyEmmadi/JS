# Functional Array Methods

JavaScript's array methods are the backbone of functional programming. This module covers how to effectively use map, filter, reduce, and other functional array methods to process data elegantly and efficiently.

## 🎯 Learning Objectives

- Master all functional array methods (map, filter, reduce, etc.)
- Learn to chain methods for complex data transformations
- Understand performance implications of different approaches
- Build custom functional array utilities
- Apply functional methods to real-world data processing

## 📚 Core Array Methods

### map() - Transform Each Element

The `map()` method creates a new array with the results of calling a function on every element.

```javascript
// Basic usage
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((x) => x * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Object transformation
const users = [
  { id: 1, firstName: "John", lastName: "Doe", age: 30 },
  { id: 2, firstName: "Jane", lastName: "Smith", age: 25 },
  { id: 3, firstName: "Bob", lastName: "Johnson", age: 35 }
];

const userCards = users.map((user) => ({
  id: user.id,
  fullName: `${user.firstName} ${user.lastName}`,
  isAdult: user.age >= 18
}));

// Complex transformations
const products = [
  { name: "Laptop", price: 999.99, category: "Electronics" },
  { name: "Book", price: 19.99, category: "Education" }
];

const processedProducts = products.map((product, index) => ({
  ...product,
  id: index + 1,
  displayPrice: `$${product.price.toFixed(2)}`,
  slug: product.name.toLowerCase().replace(/\s+/g, "-")
}));
```

### filter() - Select Elements

The `filter()` method creates a new array with all elements that pass a test.

```javascript
// Basic filtering
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evens = numbers.filter((x) => x % 2 === 0);
const greaterThanFive = numbers.filter((x) => x > 5);

// Object filtering
const users = [
  { name: "John", age: 30, active: true },
  { name: "Jane", age: 17, active: true },
  { name: "Bob", age: 25, active: false }
];

const activeAdults = users.filter((user) => user.active && user.age >= 18);

// Complex filtering with multiple conditions
const products = [
  { name: "Laptop", price: 999.99, inStock: true, rating: 4.5 },
  { name: "Phone", price: 699.99, inStock: false, rating: 4.2 },
  { name: "Tablet", price: 399.99, inStock: true, rating: 4.8 }
];

const recommendedProducts = products.filter(
  (product) => product.inStock && product.rating >= 4.3 && product.price <= 500
);

// Filtering with external data
const availableCategories = ["Electronics", "Books", "Clothing"];
const categorizedProducts = products.filter((product) =>
  availableCategories.includes(product.category)
);
```

### reduce() - Accumulate Values

The `reduce()` method executes a reducer function on each element, resulting in a single output value.

```javascript
// Basic reduction
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
const product = numbers.reduce((acc, curr) => acc * curr, 1);

// Finding max/min
const max = numbers.reduce((acc, curr) => Math.max(acc, curr), -Infinity);
const min = numbers.reduce((acc, curr) => Math.min(acc, curr), Infinity);

// Object accumulation
const orders = [
  { id: 1, amount: 99.99, customerId: "c1" },
  { id: 2, amount: 149.99, customerId: "c2" },
  { id: 3, amount: 199.99, customerId: "c1" },
  { id: 4, amount: 79.99, customerId: "c3" }
];

// Group by customer
const ordersByCustomer = orders.reduce((acc, order) => {
  if (!acc[order.customerId]) {
    acc[order.customerId] = [];
  }
  acc[order.customerId].push(order);
  return acc;
}, {});

// Calculate totals by customer
const totalsByCustomer = orders.reduce((acc, order) => {
  acc[order.customerId] = (acc[order.customerId] || 0) + order.amount;
  return acc;
}, {});

// Complex accumulation - building statistics
const salesData = [
  { date: "2023-01-01", amount: 100, product: "A" },
  { date: "2023-01-02", amount: 150, product: "B" },
  { date: "2023-01-03", amount: 200, product: "A" },
  { date: "2023-01-04", amount: 120, product: "C" }
];

const statistics = salesData.reduce(
  (acc, sale) => {
    // Total sales
    acc.totalSales += sale.amount;

    // Sales by product
    acc.salesByProduct[sale.product] =
      (acc.salesByProduct[sale.product] || 0) + sale.amount;

    // Track dates
    acc.firstDate = acc.firstDate
      ? sale.date < acc.firstDate
        ? sale.date
        : acc.firstDate
      : sale.date;
    acc.lastDate = acc.lastDate
      ? sale.date > acc.lastDate
        ? sale.date
        : acc.lastDate
      : sale.date;

    // Count transactions
    acc.transactionCount++;

    return acc;
  },
  {
    totalSales: 0,
    salesByProduct: {},
    firstDate: null,
    lastDate: null,
    transactionCount: 0
  }
);
```

### Advanced Array Methods

```javascript
// find() - Find first matching element
const users = [
  { id: 1, name: "John", email: "john@example.com" },
  { id: 2, name: "Jane", email: "jane@example.com" }
];

const user = users.find((u) => u.id === 1);
const userByEmail = users.find((u) => u.email === "jane@example.com");

// findIndex() - Find index of first matching element
const index = users.findIndex((u) => u.name === "Jane");

// some() - Test if at least one element passes
const hasAdults = users.some((u) => u.age >= 18);
const hasAdmins = users.some((u) => u.role === "admin");

// every() - Test if all elements pass
const allAdults = users.every((u) => u.age >= 18);
const allActive = users.every((u) => u.active === true);

// includes() - Check if array contains value
const numbers = [1, 2, 3, 4, 5];
const hasThree = numbers.includes(3);

// forEach() - Execute function for each element (not functional, has side effects)
users.forEach((user) => {
  console.log(`User: ${user.name}`);
});

// flatMap() - Map and flatten
const sentences = ["Hello world", "How are you", "Good morning"];
const words = sentences.flatMap((sentence) => sentence.split(" "));
// ['Hello', 'world', 'How', 'are', 'you', 'Good', 'morning']

// sort() - Sort elements (mutates original array)
const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));

// reverse() - Reverse elements (mutates original array)
const reversedNumbers = [...numbers].reverse();
```

## 🔗 Method Chaining

### Basic Chaining

```javascript
const salesData = [
  { product: "Laptop", amount: 999, category: "Electronics", quarter: "Q1" },
  { product: "Book", amount: 19, category: "Education", quarter: "Q1" },
  { product: "Phone", amount: 699, category: "Electronics", quarter: "Q2" },
  { product: "Desk", amount: 299, category: "Furniture", quarter: "Q1" },
  { product: "Chair", amount: 199, category: "Furniture", quarter: "Q2" }
];

// Chain multiple operations
const q1ElectronicsTotal = salesData
  .filter((sale) => sale.quarter === "Q1")
  .filter((sale) => sale.category === "Electronics")
  .map((sale) => sale.amount)
  .reduce((sum, amount) => sum + amount, 0);

// More complex chaining
const categoryAnalysis = salesData
  .filter((sale) => sale.amount >= 100) // Only significant sales
  .map((sale) => ({
    ...sale,
    amountTier: sale.amount >= 500 ? "high" : "medium"
  }))
  .reduce((acc, sale) => {
    if (!acc[sale.category]) {
      acc[sale.category] = { total: 0, count: 0, items: [] };
    }
    acc[sale.category].total += sale.amount;
    acc[sale.category].count++;
    acc[sale.category].items.push(sale);
    return acc;
  }, {});
```

### Advanced Chaining Patterns

```javascript
// Data processing pipeline
const processUserData = (users) => {
  return users
    .filter((user) => user.active) // Only active users
    .map((user) => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      age: calculateAge(user.birthDate)
    }))
    .filter((user) => user.age >= 18) // Adults only
    .sort((a, b) => a.lastName.localeCompare(b.lastName))
    .slice(0, 10) // Top 10
    .map((user) => ({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      age: user.age
    }));
};

// Performance consideration: early filtering
const efficientProcessing = (largeDataset) => {
  return largeDataset
    .filter((item) => item.active) // Filter early to reduce subsequent operations
    .filter((item) => item.score > 50) // Another filter
    .map(expensiveTransformation) // Expensive operation on smaller dataset
    .sort((a, b) => b.score - a.score)
    .slice(0, 100);
};
```

## 🛠️ Custom Functional Utilities

### Building Reusable Functions

```javascript
// Generic filtering functions
const createFilter = (predicate) => (array) => array.filter(predicate);

const isAdult = (user) => user.age >= 18;
const isActive = (user) => user.active;
const hasEmail = (user) => user.email && user.email.includes("@");

const adultFilter = createFilter(isAdult);
const activeFilter = createFilter(isActive);

// Combinable filters
const and =
  (...predicates) =>
  (item) =>
    predicates.every((pred) => pred(item));
const or =
  (...predicates) =>
  (item) =>
    predicates.some((pred) => pred(item));

const activeAdultFilter = createFilter(and(isActive, isAdult));
const contactableFilter = createFilter(or(hasEmail, (user) => user.phone));

// Generic mapping functions
const createMapper = (transform) => (array) => array.map(transform);

const addId = (item, index) => ({ ...item, id: index + 1 });
const addTimestamp = (item) => ({ ...item, timestamp: Date.now() });
const upperCaseName = (item) => ({ ...item, name: item.name?.toUpperCase() });

const addIdMapper = createMapper(addId);
const timestampMapper = createMapper(addTimestamp);

// Generic reduction functions
const createReducer = (reducerFn, initialValue) => (array) =>
  array.reduce(reducerFn, initialValue);

const sumReducer = createReducer((sum, num) => sum + num, 0);
const groupByReducer = (keyFn) =>
  createReducer((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

const groupByCategory = groupByReducer((item) => item.category);
```

### Pipeline Utilities

```javascript
// Pipe function for data processing
const pipe =
  (...functions) =>
  (value) =>
    functions.reduce((acc, fn) => fn(acc), value);

// Compose functions (right to left)
const compose =
  (...functions) =>
  (value) =>
    functions.reduceRight((acc, fn) => fn(acc), value);

// Example pipeline
const processData = pipe(
  (data) => data.filter((item) => item.active),
  (data) => data.map((item) => ({ ...item, processed: true })),
  (data) => data.sort((a, b) => a.name.localeCompare(b.name)),
  (data) => data.slice(0, 10)
);

// Reusable data transformations
const transformations = {
  filterActive: (data) => data.filter((item) => item.active),
  addProcessedFlag: (data) =>
    data.map((item) => ({ ...item, processed: true })),
  sortByName: (data) => data.sort((a, b) => a.name.localeCompare(b.name)),
  take: (n) => (data) => data.slice(0, n),
  skip: (n) => (data) => data.slice(n),

  // Conditional transformations
  filterBy: (predicate) => (data) => data.filter(predicate),
  mapBy: (transform) => (data) => data.map(transform),
  sortBy: (compareFn) => (data) => [...data].sort(compareFn)
};

// Usage
const userPipeline = pipe(
  transformations.filterActive,
  transformations.filterBy((user) => user.age >= 18),
  transformations.mapBy((user) => ({
    id: user.id,
    name: user.name,
    email: user.email
  })),
  transformations.sortByName,
  transformations.take(20)
);
```

### Async Array Processing

```javascript
// Sequential async processing
async function mapAsync(array, asyncFn) {
  const results = [];
  for (const item of array) {
    const result = await asyncFn(item);
    results.push(result);
  }
  return results;
}

// Parallel async processing
async function mapAsyncParallel(array, asyncFn) {
  const promises = array.map(asyncFn);
  return Promise.all(promises);
}

// Async filtering
async function filterAsync(array, asyncPredicate) {
  const results = await mapAsyncParallel(array, async (item) => ({
    item,
    keep: await asyncPredicate(item)
  }));

  return results.filter((result) => result.keep).map((result) => result.item);
}

// Async reduction
async function reduceAsync(array, asyncReducer, initialValue) {
  let accumulator = initialValue;
  for (const item of array) {
    accumulator = await asyncReducer(accumulator, item);
  }
  return accumulator;
}

// Usage examples
const urls = ["url1", "url2", "url3"];

// Sequential processing (slower but controls concurrency)
const sequentialResults = await mapAsync(urls, async (url) => {
  const response = await fetch(url);
  return response.json();
});

// Parallel processing (faster but more resource intensive)
const parallelResults = await mapAsyncParallel(urls, async (url) => {
  const response = await fetch(url);
  return response.json();
});
```

## 🧪 Real-World Examples

### E-commerce Data Processing

```javascript
const products = [
  {
    id: 1,
    name: "Laptop",
    price: 999.99,
    category: "Electronics",
    stock: 5,
    rating: 4.5
  },
  {
    id: 2,
    name: "Phone",
    price: 699.99,
    category: "Electronics",
    stock: 0,
    rating: 4.2
  },
  {
    id: 3,
    name: "Book",
    price: 19.99,
    category: "Education",
    stock: 100,
    rating: 4.8
  },
  {
    id: 4,
    name: "Desk",
    price: 299.99,
    category: "Furniture",
    stock: 3,
    rating: 4.1
  }
];

// Product recommendations
const getRecommendations = (products, minRating = 4.0, maxPrice = 1000) => {
  return products
    .filter((product) => product.stock > 0) // In stock
    .filter((product) => product.rating >= minRating) // Well rated
    .filter((product) => product.price <= maxPrice) // Within budget
    .sort((a, b) => b.rating - a.rating) // Best rated first
    .slice(0, 5) // Top 5
    .map((product) => ({
      id: product.id,
      name: product.name,
      price: `$${product.price.toFixed(2)}`,
      rating: product.rating,
      inStock: product.stock > 0
    }));
};

// Sales analytics
const orders = [
  { id: 1, productId: 1, quantity: 2, date: "2023-01-15" },
  { id: 2, productId: 3, quantity: 1, date: "2023-01-16" },
  { id: 3, productId: 1, quantity: 1, date: "2023-01-17" }
];

const getSalesAnalytics = (orders, products) => {
  const enrichedOrders = orders.map((order) => ({
    ...order,
    product: products.find((p) => p.id === order.productId),
    total:
      products.find((p) => p.id === order.productId)?.price * order.quantity
  }));

  return {
    totalRevenue: enrichedOrders.reduce((sum, order) => sum + order.total, 0),

    topProducts:
      enrichedOrders.reduce((acc, order) => {
        const productName = order.product.name;
        acc[productName] = (acc[productName] || 0) + order.quantity;
        return acc;
      }, {})
      |> Object.entries(#{})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3),

    dailySales: enrichedOrders.reduce((acc, order) => {
      acc[order.date] = (acc[order.date] || 0) + order.total;
      return acc;
    }, {})
  };
};
```

### Data Validation Pipeline

```javascript
const validateUserData = (users) => {
  const validationRules = [
    {
      field: "email",
      test: (email) => email?.includes("@"),
      message: "Invalid email"
    },
    {
      field: "age",
      test: (age) => age >= 0 && age <= 120,
      message: "Invalid age"
    },
    {
      field: "name",
      test: (name) => name?.length >= 2,
      message: "Name too short"
    }
  ];

  return users.map((user) => {
    const errors = validationRules
      .filter((rule) => !rule.test(user[rule.field]))
      .map((rule) => rule.message);

    return {
      ...user,
      isValid: errors.length === 0,
      errors
    };
  });
};

// Process only valid users
const processValidUsers = (users) => {
  return validateUserData(users)
    .filter((user) => user.isValid)
    .map((user) => {
      const { isValid, errors, ...cleanUser } = user;
      return {
        ...cleanUser,
        fullName: `${user.firstName} ${user.lastName}`,
        createdAt: new Date().toISOString()
      };
    });
};
```

## 🧪 Practice Exercises

### Exercise 1: Data Analysis

```javascript
const studentGrades = [
  { name: "Alice", subject: "Math", grade: 85, semester: "Fall" },
  { name: "Bob", subject: "Math", grade: 92, semester: "Fall" },
  { name: "Alice", subject: "Science", grade: 88, semester: "Fall" },
  { name: "Charlie", subject: "Math", grade: 78, semester: "Spring" },
  { name: "Bob", subject: "Science", grade: 90, semester: "Spring" }
];

// TODO: Implement these functions using functional array methods

// 1. Get average grade by student
function getAverageGradeByStudent(grades) {
  // Return object with student names as keys and average grades as values
}

// 2. Get top performers (grade >= 90) by subject
function getTopPerformersBySubject(grades) {
  // Return object grouped by subject with arrays of top performers
}

// 3. Calculate semester statistics
function getSemesterStatistics(grades) {
  // Return statistics for each semester (count, average, min, max)
}
```

### Exercise 2: E-commerce Functions

```javascript
const inventory = [
  { id: 1, name: "Laptop", price: 999, category: "Electronics", stock: 5 },
  { id: 2, name: "Mouse", price: 25, category: "Electronics", stock: 50 },
  { id: 3, name: "Book", price: 15, category: "Education", stock: 100 },
  { id: 4, name: "Desk", price: 200, category: "Furniture", stock: 0 }
];

// TODO: Implement these functions

// 1. Create a product search function
function searchProducts(inventory, query, filters = {}) {
  // Search by name and apply filters (category, priceRange, inStock)
}

// 2. Calculate inventory value by category
function getInventoryValueByCategory(inventory) {
  // Return object with category totals (price * stock)
}

// 3. Generate product recommendations
function getProductRecommendations(inventory, budget, category = null) {
  // Return products within budget, optionally filtered by category
}
```

### Exercise 3: Custom Array Utilities

```javascript
// TODO: Implement these utility functions

// 1. Chunk array into smaller arrays
function chunk(array, size) {
  // Split array into chunks of specified size
}

// 2. Remove duplicates by key
function uniqueBy(array, keyFn) {
  // Remove duplicates based on key function result
}

// 3. Group consecutive elements
function groupConsecutive(array, keyFn) {
  // Group consecutive elements that have the same key
}

// Usage examples:
// chunk([1,2,3,4,5], 2) → [[1,2], [3,4], [5]]
// uniqueBy([{id:1,name:'A'},{id:2,name:'B'},{id:1,name:'C'}], x => x.id) → [{id:1,name:'A'},{id:2,name:'B'}]
// groupConsecutive([1,1,2,2,2,3,1], x => x) → [[1,1],[2,2,2],[3],[1]]
```

## 💡 Performance Considerations

### Optimization Tips

```javascript
// ✅ Filter early to reduce subsequent operations
const efficientChain = largeArray
  .filter((item) => item.active) // Reduce dataset size first
  .filter((item) => item.score > 50)
  .map(expensiveTransformation)
  .sort((a, b) => b.score - a.score);

// ❌ Expensive operations on large datasets
const inefficientChain = largeArray
  .map(expensiveTransformation) // Operating on full dataset
  .filter((item) => item.active)
  .filter((item) => item.score > 50);

// ✅ Use for loops for performance-critical code
function sumLargeArray(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}

// ✅ Break chains when beneficial
const step1 = data.filter((item) => item.active);
const step2 = step1.map(expensiveTransformation);
const step3 = step2.filter((item) => item.score > threshold);
```

## 🔗 What's Next?

With functional array methods mastered, you're ready to explore:

- **Currying and Function Composition** - Advanced function techniques
- **Functional Patterns** - Common FP design patterns
- **Performance Optimization** - Making functional code efficient

Functional array methods are the tools that make functional programming practical and powerful in JavaScript!

## 📝 Summary

Key takeaways:

- ✅ `map()`, `filter()`, and `reduce()` are the core functional methods
- ✅ Method chaining creates readable data transformation pipelines
- ✅ Custom utilities make functional code more reusable
- ✅ Performance considerations are important for large datasets
- ✅ Functional methods lead to more predictable and maintainable code
- ✅ Async processing requires special handling but follows similar patterns
