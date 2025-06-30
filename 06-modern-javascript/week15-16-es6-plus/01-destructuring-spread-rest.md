# Destructuring Assignment

## Learning Objectives

- Master array and object destructuring syntax
- Understand nested destructuring patterns
- Apply destructuring in function parameters
- Use destructuring for variable swapping and extraction
- Implement default values and renaming in destructuring

## What is Destructuring?

Destructuring assignment is a JavaScript expression that makes it possible to unpack values from arrays or properties from objects into distinct variables. It provides a clean and readable way to extract data from complex structures.

## Array Destructuring

### Basic Array Destructuring

```javascript
// Traditional approach
const colors = ["red", "green", "blue"];
const first = colors[0];
const second = colors[1];
const third = colors[2];

// Modern destructuring approach
const [first, second, third] = ["red", "green", "blue"];
console.log(first); // 'red'
console.log(second); // 'green'
console.log(third); // 'blue'

// With existing array
const fruits = ["apple", "banana", "orange"];
const [firstFruit, secondFruit, thirdFruit] = fruits;
```

### Skipping Elements

```javascript
const numbers = [1, 2, 3, 4, 5];

// Skip elements using empty slots
const [first, , third, , fifth] = numbers;
console.log(first, third, fifth); // 1 3 5

// Get first and rest
const [head, ...tail] = numbers;
console.log(head); // 1
console.log(tail); // [2, 3, 4, 5]
```

### Default Values

```javascript
// Provide default values for missing elements
const [a = 1, b = 2, c = 3] = [10];
console.log(a, b, c); // 10 2 3

// With complex defaults
const [name = "Anonymous", age = 0] = ["John"];
console.log(name, age); // 'John' 0

// Default values with function calls
const [x = Math.random(), y = Date.now()] = [];
console.log(x, y); // random number, current timestamp
```

### Nested Array Destructuring

```javascript
const nested = [
  [1, 2],
  [3, 4],
  [5, 6]
];

// Destructure nested arrays
const [[a, b], [c, d], [e, f]] = nested;
console.log(a, b, c, d, e, f); // 1 2 3 4 5 6

// Mixed destructuring
const matrix = [
  [1, 2, 3],
  [4, 5, 6]
];
const [row1, [, second, third]] = matrix;
console.log(row1); // [1, 2, 3]
console.log(second); // 5
console.log(third); // 6
```

## Object Destructuring

### Basic Object Destructuring

```javascript
// Traditional approach
const user = { name: "John", age: 30, city: "New York" };
const name = user.name;
const age = user.age;
const city = user.city;

// Modern destructuring approach
const { name, age, city } = user;
console.log(name, age, city); // 'John' 30 'New York'

// Order doesn't matter with objects
const { city: userCity, name: userName, age: userAge } = user;
```

### Renaming Variables

```javascript
const person = { firstName: "Jane", lastName: "Doe", age: 25 };

// Rename during destructuring
const { firstName: first, lastName: last, age: years } = person;
console.log(first, last, years); // 'Jane' 'Doe' 25

// Useful for avoiding naming conflicts
const { name: personName } = person;
const { name: companyName } = company;
```

### Default Values

```javascript
const settings = { theme: "dark", fontSize: 14 };

// Provide defaults for missing properties
const { theme = "light", fontSize = 12, language = "en" } = settings;

console.log(theme, fontSize, language); // 'dark' 14 'en'

// Combine renaming with defaults
const { theme: selectedTheme = "light" } = settings;
```

### Nested Object Destructuring

```javascript
const user = {
  id: 1,
  name: "John Doe",
  address: {
    street: "123 Main St",
    city: "New York",
    coordinates: {
      lat: 40.7128,
      lng: -74.006
    }
  },
  preferences: {
    theme: "dark",
    notifications: true
  }
};

// Destructure nested objects
const {
  name,
  address: {
    street,
    city,
    coordinates: { lat, lng }
  },
  preferences: { theme, notifications }
} = user;

console.log(name, street, city, lat, lng, theme, notifications);

// Destructure nested with renaming and defaults
const {
  address: { street: userStreet, zipCode = "N/A" }
} = user;
```

## Function Parameter Destructuring

### Array Parameter Destructuring

```javascript
// Traditional function
function processCoordinates(coords) {
  const x = coords[0];
  const y = coords[1];
  const z = coords[2] || 0;
  // ... process coordinates
}

// Modern approach with destructuring
function processCoordinates([x, y, z = 0]) {
  console.log(`Coordinates: ${x}, ${y}, ${z}`);
}

processCoordinates([10, 20]); // Coordinates: 10, 20, 0
processCoordinates([5, 15, 25]); // Coordinates: 5, 15, 25

// Rest parameters in destructuring
function calculateSum([first, ...rest]) {
  return first + rest.reduce((sum, num) => sum + num, 0);
}

console.log(calculateSum([1, 2, 3, 4])); // 10
```

### Object Parameter Destructuring

```javascript
// Traditional function
function createUser(options) {
  const name = options.name;
  const age = options.age || 18;
  const role = options.role || "user";
  // ... create user
}

// Modern approach with destructuring
function createUser({ name, age = 18, role = "user", ...otherProps }) {
  console.log(`Creating user: ${name}, age: ${age}, role: ${role}`);
  console.log("Other properties:", otherProps);
}

createUser({
  name: "John",
  age: 25,
  email: "john@example.com",
  location: "NYC"
});

// API-style function with destructuring
function makeRequest({
  url,
  method = "GET",
  headers = {},
  body = null,
  timeout = 5000
}) {
  return fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    body: body ? JSON.stringify(body) : null,
    signal: AbortSignal.timeout(timeout)
  });
}
```

## Advanced Destructuring Patterns

### Mixed Destructuring

```javascript
const response = {
  data: [
    { id: 1, name: "John", scores: [85, 92, 78] },
    { id: 2, name: "Jane", scores: [90, 88, 95] }
  ],
  meta: { total: 2, page: 1 }
};

// Complex destructuring
const {
  data: [
    {
      name: firstName,
      scores: [firstScore]
    },
    {
      name: secondName,
      scores: [, , thirdScore]
    }
  ],
  meta: { total }
} = response;

console.log(firstName, firstScore, secondName, thirdScore, total);
// 'John' 85 'Jane' 95 2
```

### Computed Property Names

```javascript
const key = "dynamicKey";
const obj = {
  staticKey: "static value",
  [key]: "dynamic value"
};

// Destructure computed properties
const { staticKey, [key]: dynamicValue } = obj;
console.log(staticKey, dynamicValue); // 'static value' 'dynamic value'

// Function that returns property name
function getPropertyName() {
  return "timestamp";
}

const data = { timestamp: Date.now(), value: 42 };
const { [getPropertyName()]: time, value } = data;
```

### Destructuring in Loops

```javascript
const users = [
  { name: "John", age: 30, city: "NYC" },
  { name: "Jane", age: 25, city: "LA" },
  { name: "Bob", age: 35, city: "Chicago" }
];

// Destructure in for...of loops
for (const { name, age } of users) {
  console.log(`${name} is ${age} years old`);
}

// Destructure with entries
const settings = { theme: "dark", fontSize: 14, language: "en" };
for (const [key, value] of Object.entries(settings)) {
  console.log(`${key}: ${value}`);
}

// Array of arrays
const coordinates = [
  [0, 0],
  [1, 2],
  [3, 4]
];
for (const [x, y] of coordinates) {
  console.log(`Point: (${x}, ${y})`);
}
```

## Practical Use Cases

### API Response Handling

```javascript
// Handling API responses
async function fetchUserProfile(userId) {
  const response = await fetch(`/api/users/${userId}`);
  const {
    data: {
      user: {
        name,
        email,
        profile: { avatar, bio = "No bio available" }
      }
    },
    meta: { timestamp }
  } = await response.json();

  return { name, email, avatar, bio, timestamp };
}

// Error handling with destructuring
function handleApiError(error) {
  const {
    response: {
      status = 500,
      data: { message = "Unknown error", code = "UNKNOWN" } = {}
    } = {}
  } = error;

  console.error(`Error ${status}: ${message} (${code})`);
}
```

### Configuration Management

```javascript
// Application configuration with destructuring
function initializeApp(config = {}) {
  const {
    api: {
      baseUrl = "http://localhost:3000",
      timeout = 5000,
      retries = 3
    } = {},
    ui: { theme = "light", language = "en", animations = true } = {},
    features: {
      enableAnalytics = false,
      enableNotifications = true,
      maxFileSize = 10 * 1024 * 1024 // 10MB
    } = {}
  } = config;

  return {
    api: { baseUrl, timeout, retries },
    ui: { theme, language, animations },
    features: { enableAnalytics, enableNotifications, maxFileSize }
  };
}

// Usage
const appConfig = initializeApp({
  api: { baseUrl: "https://api.production.com" },
  ui: { theme: "dark" }
});
```

### State Management

```javascript
// Redux-style reducer with destructuring
function userReducer(state = {}, action) {
  const { type, payload } = action;

  switch (type) {
    case "UPDATE_USER": {
      const { id, updates } = payload;
      const { name, email, ...otherUpdates } = updates;

      return {
        ...state,
        [id]: {
          ...state[id],
          name,
          email,
          ...otherUpdates,
          updatedAt: Date.now()
        }
      };
    }

    case "SET_USER_PREFERENCES": {
      const {
        userId,
        preferences: { theme, notifications, ...otherPrefs }
      } = payload;

      return {
        ...state,
        [userId]: {
          ...state[userId],
          preferences: {
            ...state[userId]?.preferences,
            theme,
            notifications,
            ...otherPrefs
          }
        }
      };
    }

    default:
      return state;
  }
}
```

## Variable Swapping

```javascript
// Traditional swapping
let a = 1,
  b = 2;
let temp = a;
a = b;
b = temp;

// Modern destructuring swap
[a, b] = [b, a];
console.log(a, b); // 2 1

// Multiple variable swapping
let x = 1,
  y = 2,
  z = 3;
[x, y, z] = [z, x, y];
console.log(x, y, z); // 3 1 2

// Array rotation
const arr = [1, 2, 3, 4, 5];
[arr[0], arr[1], arr[2], arr[3], arr[4]] = [
  arr[1],
  arr[2],
  arr[3],
  arr[4],
  arr[0]
];
```

## Performance Considerations

### Memory Efficiency

```javascript
// Be careful with large objects
const largeObject = {
  /* thousands of properties */
};

// This creates references, not copies
const { prop1, prop2 } = largeObject; // ✅ Efficient

// This creates a new object
const { prop1, prop2, ...rest } = largeObject; // ⚠️ Less efficient for large objects

// Better for large objects
function extractProps(obj, keys) {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {});
}
```

### Avoiding Over-Destructuring

```javascript
// Over-destructuring can hurt readability
const {
  user: {
    profile: {
      personal: {
        contact: {
          email: { primary: userPrimaryEmail }
        }
      }
    }
  }
} = response; // ❌ Too complex

// Better approach
const userProfile = response.user.profile;
const primaryEmail = userProfile.personal?.contact?.email?.primary; // ✅ More readable
```

## Browser Compatibility

### ES6 Destructuring Support

- **Chrome**: 49+
- **Firefox**: 41+
- **Safari**: 8+
- **Edge**: 14+

### Babel Transformation

```javascript
// ES6 destructuring
const { name, age } = user;

// Babel transforms to
var name = user.name;
var age = user.age;
```

## Best Practices

### 1. Use Meaningful Variable Names

```javascript
// Bad
const { a, b, c } = response.data;

// Good
const { userName, userAge, userEmail } = response.data;
```

### 2. Provide Sensible Defaults

```javascript
// Provide defaults for optional properties
function processSettings({
  theme = "light",
  fontSize = 14,
  autoSave = true
} = {}) {
  // Function works even if called without arguments
}
```

### 3. Don't Over-Destructure

```javascript
// If you only need one property, simple access might be clearer
const userName = user.name; // ✅ Simple and clear

// Instead of
const { name: userName } = user; // ⚠️ Overkill for single property
```

### 4. Use Rest Patterns Wisely

```javascript
// Separate known properties from unknown ones
function handleFormData({ name, email, ...additionalData }) {
  validateRequired({ name, email });
  processAdditionalData(additionalData);
}
```

## Common Pitfalls

### 1. Destructuring Undefined/Null

```javascript
// This will throw an error
const user = null;
const { name } = user; // TypeError: Cannot destructure property 'name' of 'null'

// Safe destructuring
const { name } = user || {};
const { name } = user ?? {};
```

### 2. Confusing Syntax

```javascript
// This looks like object destructuring but creates a block
{ name } = user; // SyntaxError

// Correct ways
const { name } = user; // Declaration
({ name } = user);     // Assignment (note the parentheses)
```

### 3. Default Values with Falsy Values

```javascript
const config = { enableFeature: false };

// This will use the default because false is falsy
const { enableFeature = true } = config; // enableFeature is true! ❌

// Use nullish coalescing for boolean values
const { enableFeature } = config;
const feature = enableFeature ?? true; // ✅ Respects false values
```

## Self-Check Questions

1. What's the difference between array and object destructuring?
2. How do you provide default values in destructuring?
3. When would you use rest patterns in destructuring?
4. How does destructuring work with function parameters?
5. What are the performance implications of destructuring?

## Practice Exercises

### Exercise 1: Basic Destructuring

Extract values from arrays and objects using various destructuring patterns.

### Exercise 2: Function Parameters

Refactor functions to use destructuring parameters with defaults.

### Exercise 3: API Data Processing

Process complex API responses using nested destructuring.

### Exercise 4: Configuration System

Build a configuration management system using destructuring.

### Exercise 5: Data Transformation

Transform data structures using destructuring and spread operators.

## Further Reading

- [MDN: Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [ES6 In Depth: Destructuring](https://hacks.mozilla.org/2015/05/es6-in-depth-destructuring/)
- [You Don't Know JS: ES6 & Beyond - Destructuring](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/es6%20%26%20beyond/ch2.md#destructuring)
