# Control Structures in JavaScript 🔀

## 🎯 Learning Objectives

- Master if/else statements and conditional logic
- Understand when and how to use switch statements
- Learn the ternary operator for concise conditionals
- Avoid common pitfalls and write clean conditional code
- Practice with real-world decision-making scenarios

## 🤔 If/Else Statements

### Basic If Statement

```javascript
const age = 18;

if (age >= 18) {
  console.log("You can vote!");
}
// Output: "You can vote!"

// Without curly braces (single statement)
if (age >= 18) console.log("You can vote!");
```

### If/Else Statement

```javascript
const temperature = 25;

if (temperature > 30) {
  console.log("It's hot outside! 🌞");
} else {
  console.log("It's nice weather! 😊");
}
// Output: "It's nice weather! 😊"
```

### If/Else If/Else Chain

```javascript
const score = 85;

if (score >= 90) {
  console.log("Grade: A 🌟");
} else if (score >= 80) {
  console.log("Grade: B 👍");
} else if (score >= 70) {
  console.log("Grade: C 👌");
} else if (score >= 60) {
  console.log("Grade: D 😐");
} else {
  console.log("Grade: F 😞");
}
// Output: "Grade: B 👍"
```

### Nested If Statements

```javascript
const weather = "sunny";
const temperature = 25;

if (weather === "sunny") {
  if (temperature > 20) {
    console.log("Perfect day for a picnic! 🧺");
  } else {
    console.log("Sunny but a bit cold ❄️");
  }
} else {
  console.log("Maybe stay inside today 🏠");
}
```

### Complex Conditions

```javascript
const user = {
  age: 25,
  isLoggedIn: true,
  isPremium: false,
  country: "USA"
};

// Multiple conditions with logical operators
if (user.isLoggedIn && user.age >= 18) {
  console.log("Access granted to adult content");
}

if (user.isPremium || user.country === "USA") {
  console.log("Free shipping available");
}

// Grouping conditions with parentheses
if ((user.age >= 18 && user.isLoggedIn) || user.isPremium) {
  console.log("Can access premium features");
}
```

## 🔀 Switch Statements

### Basic Switch

```javascript
const day = "Monday";

switch (day) {
  case "Monday":
    console.log("Start of the work week 💼");
    break;
  case "Tuesday":
    console.log("Tuesday blues 😴");
    break;
  case "Wednesday":
    console.log("Hump day! 🐪");
    break;
  case "Thursday":
    console.log("Almost there! 😊");
    break;
  case "Friday":
    console.log("TGIF! 🎉");
    break;
  case "Saturday":
  case "Sunday":
    console.log("Weekend vibes! 🌴");
    break;
  default:
    console.log("Invalid day");
}
```

### Switch with Multiple Cases

```javascript
const grade = "B";

switch (grade) {
  case "A":
  case "A+":
    console.log("Excellent work! 🌟");
    break;
  case "B":
  case "B+":
    console.log("Good job! 👍");
    break;
  case "C":
  case "C+":
    console.log("Average performance 👌");
    break;
  case "D":
    console.log("Needs improvement 📚");
    break;
  case "F":
    console.log("Please see instructor 😔");
    break;
  default:
    console.log("Invalid grade");
}
```

### Switch with Return Values

```javascript
function getSeasonMessage(month) {
  switch (month) {
    case 12:
    case 1:
    case 2:
      return "Winter ❄️ - Stay warm!";
    case 3:
    case 4:
    case 5:
      return "Spring 🌸 - Everything's blooming!";
    case 6:
    case 7:
    case 8:
      return "Summer ☀️ - Time for vacation!";
    case 9:
    case 10:
    case 11:
      return "Fall 🍂 - Beautiful colors!";
    default:
      return "Invalid month";
  }
}

console.log(getSeasonMessage(7)); // "Summer ☀️ - Time for vacation!"
```

### Switch vs If/Else Performance

```javascript
// When you have many conditions, switch can be more readable
const statusCode = 404;

// Using if/else (can become unwieldy)
if (statusCode === 200) {
  console.log("Success");
} else if (statusCode === 201) {
  console.log("Created");
} else if (statusCode === 400) {
  console.log("Bad Request");
} else if (statusCode === 401) {
  console.log("Unauthorized");
} else if (statusCode === 404) {
  console.log("Not Found");
} else {
  console.log("Unknown status");
}

// Using switch (cleaner for multiple exact matches)
switch (statusCode) {
  case 200:
    console.log("Success");
    break;
  case 201:
    console.log("Created");
    break;
  case 400:
    console.log("Bad Request");
    break;
  case 401:
    console.log("Unauthorized");
    break;
  case 404:
    console.log("Not Found");
    break;
  default:
    console.log("Unknown status");
}
```

## ❓ Ternary Operator

### Basic Ternary

```javascript
const age = 20;
const message = age >= 18 ? "Adult" : "Minor";
console.log(message); // "Adult"

// Equivalent if/else
let message2;
if (age >= 18) {
  message2 = "Adult";
} else {
  message2 = "Minor";
}
```

### Ternary in Function Calls

```javascript
const user = { name: "John", isActive: true };

// Using ternary for different function calls
user.isActive ? activateUser(user) : deactivateUser(user);

// Using ternary for different parameters
sendEmail(user.email, user.isActive ? "Welcome back!" : "We miss you!");
```

### Nested Ternary (Use Sparingly!)

```javascript
const score = 85;

// Nested ternary - can become hard to read
const grade =
  score >= 90
    ? "A"
    : score >= 80
    ? "B"
    : score >= 70
    ? "C"
    : score >= 60
    ? "D"
    : "F";

console.log(grade); // "B"

// Better approach for complex logic
function getGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
```

### Ternary for Default Values

```javascript
// Setting default values
function greetUser(name) {
  const displayName = name ? name : "Guest";
  // Or using short-circuit evaluation
  const displayName2 = name || "Guest";
  // Or using nullish coalescing (ES2020)
  const displayName3 = name ?? "Guest";

  console.log(`Hello, ${displayName}!`);
}

// Ternary for conditional styling (common in web development)
const buttonClass = isActive ? "btn-active" : "btn-inactive";
const textColor = isDarkMode ? "#ffffff" : "#000000";
```

## 🚨 Common Pitfalls and Best Practices

### 1. Assignment vs Comparison

```javascript
let x = 5;

// ❌ WRONG - Assignment instead of comparison
if ((x = 10)) {
  console.log("This will always execute!");
}

// ✅ CORRECT - Comparison
if (x === 10) {
  console.log("This checks if x equals 10");
}

// ✅ GOOD PRACTICE - Use const when possible
const y = 5;
if (y === 10) {
  // Can't accidentally assign to const
  console.log("This is safe");
}
```

### 2. Truthy/Falsy Values

```javascript
// Understanding falsy values: false, 0, "", null, undefined, NaN
const values = [0, "", false, null, undefined, NaN, "hello", 1, [], {}];

values.forEach((value) => {
  if (value) {
    console.log(`${value} is truthy`);
  } else {
    console.log(`${value} is falsy`);
  }
});

// Common mistakes
const items = [];
if (items) {
  // ✅ This is true (empty array is truthy)
  console.log("Array exists");
}

if (items.length) {
  // ✅ Better check for content
  console.log("Array has items");
} else {
  console.log("Array is empty");
}
```

### 3. Switch Statement Gotchas

```javascript
const value = "2";

// ❌ Forgetting break statements
switch (value) {
  case 1:
    console.log("One");
  // Missing break - falls through!
  case 2:
    console.log("Two");
    break;
  case "2":
    console.log("String two");
    break;
}
// Output: "Two" and "String two" (if value was 1)

// ❌ Type coercion issues
switch (value) {
  case 2: // Number 2
    console.log("Number two");
    break;
  case "2": // String "2"
    console.log("String two");
    break;
}
// Output: "String two" (strict equality used)
```

### 4. Nested Conditional Complexity

```javascript
// ❌ Hard to read and maintain
function processUser(user) {
  if (user) {
    if (user.isActive) {
      if (user.permissions) {
        if (user.permissions.includes("admin")) {
          if (user.lastLogin) {
            return "Full admin access";
          } else {
            return "Admin access - first time login";
          }
        } else {
          return "Regular user access";
        }
      } else {
        return "No permissions set";
      }
    } else {
      return "User inactive";
    }
  } else {
    return "No user provided";
  }
}

// ✅ Better approach - early returns
function processUserBetter(user) {
  if (!user) return "No user provided";
  if (!user.isActive) return "User inactive";
  if (!user.permissions) return "No permissions set";

  const isAdmin = user.permissions.includes("admin");
  if (!isAdmin) return "Regular user access";

  return user.lastLogin
    ? "Full admin access"
    : "Admin access - first time login";
}
```

## 💡 When to Use Each Structure

### Use If/Else When:

- Complex conditions with ranges
- Multiple conditions with logical operators
- Need different types of operations in each branch

### Use Switch When:

- Comparing a single variable against multiple exact values
- Many discrete options
- Each case performs similar operations

### Use Ternary When:

- Simple conditional assignments
- Short, readable conditions
- Inline conditional values

## 🏃‍♂️ Practical Examples

### Example 1: User Authentication

```javascript
function authenticateUser(username, password, role) {
  // Input validation
  if (!username || !password) {
    return "Username and password are required";
  }

  // Authentication logic
  if (username === "admin" && password === "secret123") {
    switch (role) {
      case "admin":
        return "Admin access granted";
      case "user":
        return "User access granted";
      default:
        return "Role not recognized";
    }
  } else {
    return "Invalid credentials";
  }
}
```

### Example 2: Shopping Cart Discount

```javascript
function calculateDiscount(totalAmount, customerType, itemCount) {
  let discountPercent = 0;

  // Customer type discounts
  if (customerType === "premium") {
    discountPercent = 15;
  } else if (customerType === "gold") {
    discountPercent = 10;
  } else if (customerType === "silver") {
    discountPercent = 5;
  }

  // Bulk purchase bonus
  if (itemCount >= 10) {
    discountPercent += 5;
  } else if (itemCount >= 5) {
    discountPercent += 2;
  }

  // Maximum discount cap
  discountPercent = discountPercent > 25 ? 25 : discountPercent;

  const discountAmount = (totalAmount * discountPercent) / 100;
  const finalAmount = totalAmount - discountAmount;

  return {
    originalAmount: totalAmount,
    discountPercent,
    discountAmount: discountAmount.toFixed(2),
    finalAmount: finalAmount.toFixed(2)
  };
}
```

### Example 3: Date and Time Logic

```javascript
function getTimeBasedGreeting() {
  const now = new Date();
  const hour = now.getHours();

  let greeting;
  let emoji;

  if (hour < 6) {
    greeting = "Good night";
    emoji = "🌙";
  } else if (hour < 12) {
    greeting = "Good morning";
    emoji = "🌅";
  } else if (hour < 17) {
    greeting = "Good afternoon";
    emoji = "☀️";
  } else if (hour < 21) {
    greeting = "Good evening";
    emoji = "🌆";
  } else {
    greeting = "Good night";
    emoji = "🌙";
  }

  const isWeekend = [0, 6].includes(now.getDay());
  const dayType = isWeekend ? "weekend" : "weekday";

  return `${greeting} ${emoji} Hope you're having a great ${dayType}!`;
}
```

## 🎯 Mini Exercises

Try these quick exercises to test your understanding:

### Exercise 1: Traffic Light System

```javascript
function getTrafficAction(lightColor, isEmergency = false) {
  // TODO: Implement traffic light logic
  // - Red: "Stop"
  // - Yellow: "Caution"
  // - Green: "Go"
  // - If emergency: always return "Emergency - Pull Over"
  // - Invalid color: "Invalid light"
}
```

### Exercise 2: Restaurant Menu Pricing

```javascript
function calculateMealPrice(mealType, size, extras = []) {
  // TODO: Implement pricing logic
  // Base prices: breakfast: $8, lunch: $12, dinner: $15
  // Sizes: small (-$2), medium ($0), large (+$3)
  // Extras: each extra adds $2
  // Return total price
}
```

### Exercise 3: Password Strength Checker

```javascript
function checkPasswordStrength(password) {
  // TODO: Implement password strength logic
  // Criteria:
  // - Length >= 8 characters
  // - Contains uppercase letter
  // - Contains lowercase letter
  // - Contains number
  // - Contains special character
  // Return: "Weak", "Medium", "Strong", "Very Strong"
}
```

## 🔗 Next Steps

After mastering control structures, you're ready for:

- [Functions and Scope](../week2-functions/01-function-basics.md)
- Week 1 Review and Mini Project

## 📚 Additional Resources

- [MDN: if...else](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else)
- [MDN: switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch)
- [MDN: Conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)
- [JavaScript.info: Conditional branching](https://javascript.info/ifelse)
