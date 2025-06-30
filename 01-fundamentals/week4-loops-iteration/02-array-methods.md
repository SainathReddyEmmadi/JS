# Advanced Iteration: Modern Loop Techniques 🌟

## 🎯 Learning Objectives

- Master modern array iteration methods (forEach, map, filter, reduce)
- Understand when to use functional vs imperative loops
- Learn to chain array methods effectively
- Practice with complex data transformations
- Build efficient data processing pipelines

## 🔄 Array Iteration Methods

Modern JavaScript provides powerful methods for iterating over arrays that are often more readable and functional than traditional loops.

### forEach() - Execute Function for Each Element

**Best for:** When you want to perform an action on each element without returning a new array

```javascript
// Traditional for loop
const numbers = [1, 2, 3, 4, 5];
for (let i = 0; i < numbers.length; i++) {
  console.log(numbers[i] * 2);
}

// Modern forEach
numbers.forEach((num) => console.log(num * 2));

// forEach with index and array parameters
const fruits = ["apple", "banana", "orange"];
fruits.forEach((fruit, index, array) => {
  console.log(`${index + 1}. ${fruit} (total: ${array.length})`);
});

// Real-world example: Update UI elements
const userCards = document.querySelectorAll(".user-card");
const users = [
  { name: "Alice", status: "online" },
  { name: "Bob", status: "offline" },
  { name: "Charlie", status: "online" }
];

users.forEach((user, index) => {
  if (userCards[index]) {
    userCards[index].textContent = user.name;
    userCards[index].className = `user-card ${user.status}`;
  }
});
```

### map() - Transform Each Element

**Best for:** When you want to create a new array with transformed elements

```javascript
// Transform numbers
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((num) => num * 2);
console.log(doubled); // [2, 4, 6, 8, 10]

// Transform objects
const users = [
  { firstName: "John", lastName: "Doe", age: 30 },
  { firstName: "Jane", lastName: "Smith", age: 25 },
  { firstName: "Bob", lastName: "Johnson", age: 35 }
];

const fullNames = users.map((user) => `${user.firstName} ${user.lastName}`);
console.log(fullNames); // ["John Doe", "Jane Smith", "Bob Johnson"]

// Add computed properties
const usersWithCategory = users.map((user) => ({
  ...user,
  fullName: `${user.firstName} ${user.lastName}`,
  ageCategory: user.age < 30 ? "Young" : user.age < 40 ? "Adult" : "Senior"
}));

// Complex transformations
const products = [
  { name: "Laptop", price: 999, tax: 0.08 },
  { name: "Phone", price: 599, tax: 0.08 },
  { name: "Tablet", price: 399, tax: 0.08 }
];

const invoiceItems = products.map((product) => ({
  description: product.name,
  subtotal: product.price,
  taxAmount: product.price * product.tax,
  total: product.price * (1 + product.tax)
}));
```

### filter() - Select Elements That Meet Criteria

**Best for:** When you want to create a new array with only elements that pass a test

```javascript
// Filter numbers
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const evenNumbers = numbers.filter((num) => num % 2 === 0);
const bigNumbers = numbers.filter((num) => num > 5);

// Filter objects
const products = [
  { name: "Laptop", price: 999, category: "Electronics", inStock: true },
  { name: "Book", price: 15, category: "Education", inStock: true },
  { name: "Phone", price: 599, category: "Electronics", inStock: false },
  { name: "Desk", price: 299, category: "Furniture", inStock: true }
];

const availableProducts = products.filter((product) => product.inStock);
const affordableProducts = products.filter((product) => product.price < 500);
const electronics = products.filter(
  (product) => product.category === "Electronics"
);

// Complex filtering
const qualifiedProducts = products.filter(
  (product) =>
    product.inStock && product.price >= 100 && product.category !== "Education"
);

// Filter with search functionality
function searchProducts(products, searchTerm) {
  const term = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
  );
}
```

### reduce() - Reduce Array to Single Value

**Best for:** When you want to calculate a single value from an array

```javascript
// Sum numbers
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((total, num) => total + num, 0);
console.log(sum); // 15

// Find maximum
const max = numbers.reduce((max, num) => (num > max ? num : max), -Infinity);

// Count occurrences
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];
const fruitCount = fruits.reduce((count, fruit) => {
  count[fruit] = (count[fruit] || 0) + 1;
  return count;
}, {});
console.log(fruitCount); // { apple: 3, banana: 2, orange: 1 }

// Group objects by property
const students = [
  { name: "Alice", grade: "A", subject: "Math" },
  { name: "Bob", grade: "B", subject: "Math" },
  { name: "Charlie", grade: "A", subject: "Science" },
  { name: "Diana", grade: "A", subject: "Math" }
];

const groupedByGrade = students.reduce((groups, student) => {
  const grade = student.grade;
  if (!groups[grade]) {
    groups[grade] = [];
  }
  groups[grade].push(student);
  return groups;
}, {});

// Calculate complex statistics
const orders = [
  { id: 1, amount: 100, status: "completed" },
  { id: 2, amount: 150, status: "completed" },
  { id: 3, amount: 75, status: "pending" },
  { id: 4, amount: 200, status: "completed" }
];

const orderStats = orders.reduce(
  (stats, order) => {
    stats.totalOrders++;
    stats.totalAmount += order.amount;

    if (order.status === "completed") {
      stats.completedOrders++;
      stats.completedAmount += order.amount;
    }

    stats.averageOrderValue = stats.totalAmount / stats.totalOrders;

    return stats;
  },
  {
    totalOrders: 0,
    completedOrders: 0,
    totalAmount: 0,
    completedAmount: 0,
    averageOrderValue: 0
  }
);
```

## ⛓️ Method Chaining

One of the most powerful features of array methods is the ability to chain them together:

```javascript
const sales = [
  { product: "Laptop", amount: 1200, region: "North", month: "Jan" },
  { product: "Phone", amount: 800, region: "South", month: "Jan" },
  { product: "Tablet", amount: 600, region: "North", month: "Feb" },
  { product: "Laptop", amount: 1100, region: "East", month: "Feb" },
  { product: "Phone", amount: 750, region: "North", month: "Mar" }
];

// Complex data processing pipeline
const northRegionAnalysis = sales
  .filter((sale) => sale.region === "North") // Get North region sales
  .map((sale) => ({
    // Add profit calculation
    ...sale,
    profit: sale.amount * 0.2
  }))
  .filter((sale) => sale.profit > 100) // Only high-profit sales
  .reduce(
    (summary, sale) => {
      // Calculate summary
      summary.totalSales += sale.amount;
      summary.totalProfit += sale.profit;
      summary.count++;
      return summary;
    },
    { totalSales: 0, totalProfit: 0, count: 0 }
  );

// Top products analysis
const topProducts = sales.reduce((productSales, sale) => {
  if (!productSales[sale.product]) {
    productSales[sale.product] = { total: 0, count: 0 };
  }
  productSales[sale.product].total += sale.amount;
  productSales[sale.product].count++;
  return productSales;
}, {});

// Convert to array and sort
const topProductsList = Object.entries(topProducts)
  .map(([product, data]) => ({
    product,
    totalSales: data.total,
    averageSale: data.total / data.count,
    orderCount: data.count
  }))
  .sort((a, b) => b.totalSales - a.totalSales)
  .slice(0, 3); // Top 3 products
```

## 🔧 Specialized Iteration Methods

### find() and findIndex()

```javascript
const users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
  { id: 3, name: "Charlie", email: "charlie@example.com" }
];

// Find first matching element
const user = users.find((user) => user.name === "Bob");
console.log(user); // { id: 2, name: "Bob", email: "bob@example.com" }

// Find index of first matching element
const userIndex = users.findIndex((user) => user.email.includes("charlie"));
console.log(userIndex); // 2

// Real-world example: Update user
function updateUser(users, userId, updates) {
  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updates };
    return true;
  }
  return false;
}
```

### some() and every()

```javascript
const numbers = [2, 4, 6, 8, 10];
const mixedNumbers = [1, 2, 3, 4, 5];

// Check if some elements meet condition
const hasEven = mixedNumbers.some((num) => num % 2 === 0);
console.log(hasEven); // true

// Check if all elements meet condition
const allEven = numbers.every((num) => num % 2 === 0);
console.log(allEven); // true

// Form validation example
function validateForm(formData) {
  const fields = [
    { name: "email", value: formData.email, required: true },
    { name: "password", value: formData.password, required: true },
    { name: "name", value: formData.name, required: true }
  ];

  const hasEmptyRequired = fields
    .filter((field) => field.required)
    .some((field) => !field.value || field.value.trim() === "");

  const allFieldsValid = fields.every((field) => {
    if (!field.required && !field.value) return true;
    return field.value && field.value.trim().length > 0;
  });

  return {
    isValid: !hasEmptyRequired && allFieldsValid,
    hasEmptyRequired,
    allFieldsValid
  };
}
```

## 🆚 Traditional Loops vs Modern Methods

### When to Use Traditional Loops

```javascript
// ✅ GOOD: When you need to break early
function findFirstNegative(numbers) {
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] < 0) {
      return { value: numbers[i], index: i };
    }
  }
  return null;
}

// ✅ GOOD: When you need complex control flow
function processItems(items) {
  for (let i = 0; i < items.length; i++) {
    if (items[i].skip) continue;

    if (items[i].type === "critical") {
      // Handle critical items immediately
      handleCritical(items[i]);
      break; // Stop processing
    }

    processNormal(items[i]);
  }
}

// ✅ GOOD: When performance is critical (very large arrays)
function sumIntegers(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}
```

### When to Use Modern Methods

```javascript
// ✅ GOOD: Data transformations
const processedData = rawData
  .filter((item) => item.isValid)
  .map((item) => transformItem(item))
  .sort((a, b) => a.priority - b.priority);

// ✅ GOOD: Functional programming style
const pipeline = (data) =>
  data.map(normalize).filter(validate).reduce(aggregate, initialState);

// ✅ GOOD: Readability and maintainability
const activeUsers = users
  .filter((user) => user.status === "active")
  .map((user) => ({ ...user, lastSeen: formatDate(user.lastSeen) }));
```

## 🚀 Advanced Patterns

### Parallel Processing with Promise.all()

```javascript
// Process multiple async operations
async function processUsersInParallel(userIds) {
  const userPromises = userIds.map((id) => fetchUser(id));
  const users = await Promise.all(userPromises);

  return users
    .filter((user) => user !== null)
    .map((user) => enrichUserData(user));
}

// Batch processing
async function processBatches(items, batchSize = 10) {
  const results = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchPromises = batch.map(processItem);
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
}
```

### Creating Utility Functions

```javascript
// Reusable utility functions
const arrayUtils = {
  // Group array by property
  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const group = item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  },

  // Get unique values
  unique: (array, key = null) => {
    if (key) {
      const seen = new Set();
      return array.filter((item) => {
        const value = item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
      });
    }
    return [...new Set(array)];
  },

  // Chunk array into smaller arrays
  chunk: (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  // Sort by multiple criteria
  sortBy: (array, ...criteria) => {
    return array.sort((a, b) => {
      for (const criterion of criteria) {
        const [key, direction = "asc"] = criterion.split(":");
        const aVal = a[key];
        const bVal = b[key];

        if (aVal !== bVal) {
          const result = aVal < bVal ? -1 : 1;
          return direction === "desc" ? -result : result;
        }
      }
      return 0;
    });
  }
};

// Usage examples
const data = [
  { name: "Alice", age: 30, department: "Engineering" },
  { name: "Bob", age: 25, department: "Marketing" },
  { name: "Charlie", age: 35, department: "Engineering" },
  { name: "Diana", age: 28, department: "Marketing" }
];

const grouped = arrayUtils.groupBy(data, "department");
const sorted = arrayUtils.sortBy(data, "department", "age:desc");
const chunks = arrayUtils.chunk(data, 2);
```

## 💡 Performance Considerations

### Optimizing Array Operations

```javascript
// ❌ INEFFICIENT: Multiple passes through array
const processData = (data) => {
  const filtered = data.filter((item) => item.active);
  const mapped = filtered.map((item) => transformItem(item));
  const sorted = mapped.sort((a, b) => a.priority - b.priority);
  return sorted.slice(0, 10);
};

// ✅ EFFICIENT: Single pass with reduce
const processDataOptimized = (data) => {
  return data.reduce((acc, item) => {
    if (!item.active) return acc;

    const transformed = transformItem(item);

    // Insert in correct position (maintain sort)
    const insertIndex = acc.findIndex(
      (existing) => existing.priority > transformed.priority
    );

    if (insertIndex === -1) {
      acc.push(transformed);
    } else {
      acc.splice(insertIndex, 0, transformed);
    }

    // Keep only top 10
    if (acc.length > 10) {
      acc.pop();
    }

    return acc;
  }, []);
};

// For very large datasets, consider using for loops
function sumLargeArray(numbers) {
  let sum = 0;
  const length = numbers.length;
  for (let i = 0; i < length; i++) {
    sum += numbers[i];
  }
  return sum;
}
```

## 🎯 Best Practices

1. **Choose the right method**: Use `forEach` for side effects, `map` for transformations, `filter` for selection
2. **Chain thoughtfully**: Too many chained methods can hurt readability and performance
3. **Use early termination**: Consider `find()`, `some()`, or traditional loops when you don't need to process all elements
4. **Handle edge cases**: Empty arrays, null values, missing properties
5. **Consider performance**: For large datasets, traditional loops might be faster
6. **Keep it readable**: Sometimes a traditional loop is clearer than a complex chain

## 🔍 Next Steps

- Practice with the comprehensive exercises in the exercises folder
- Try implementing data processing pipelines with real-world datasets
- Experiment with combining different iteration methods
- Learn about async iteration (for...await...of, async map patterns)
- Explore performance profiling tools to optimize your iterations

Master these iteration patterns, and you'll be able to process data efficiently and elegantly in any JavaScript application! 🚀
