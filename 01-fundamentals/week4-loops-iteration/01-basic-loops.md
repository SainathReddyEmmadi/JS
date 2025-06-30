# Loops: Repeating Code Efficiently 🔄

## 🎯 Learning Objectives

- Master different types of loops and when to use them
- Understand loop control flow (break, continue)
- Learn to avoid infinite loops and common pitfalls
- Practice with nested loops and complex iteration patterns
- Build confidence with loop-based algorithms

## 📝 Why Do We Need Loops?

Loops allow us to execute code repeatedly without writing the same statements over and over. They're essential for processing collections, automating repetitive tasks, and implementing algorithms.

```javascript
// Without loops (repetitive and impractical)
console.log("Processing item 1");
console.log("Processing item 2");
console.log("Processing item 3");
// ... what if we have 1000 items?

// With loops (efficient and scalable)
for (let i = 1; i <= 1000; i++) {
  console.log(`Processing item ${i}`);
}
```

## 🔄 Types of Loops

### 1. For Loop

**Best for:** When you know the number of iterations in advance

```javascript
// Basic for loop syntax
for (initialization; condition; increment) {
  // code to execute
}

// Example: Count from 1 to 5
for (let i = 1; i <= 5; i++) {
  console.log(`Count: ${i}`);
}
// Output: Count: 1, Count: 2, Count: 3, Count: 4, Count: 5

// Example: Process array elements
const fruits = ["apple", "banana", "orange"];
for (let i = 0; i < fruits.length; i++) {
  console.log(`Fruit ${i + 1}: ${fruits[i]}`);
}

// Example: Countdown
for (let i = 10; i >= 1; i--) {
  console.log(`Countdown: ${i}`);
}
console.log("Blast off! 🚀");

// Example: Skip by 2
for (let i = 0; i <= 20; i += 2) {
  console.log(`Even number: ${i}`);
}
```

### 2. While Loop

**Best for:** When you don't know the exact number of iterations

```javascript
// Basic while loop syntax
while (condition) {
  // code to execute
  // make sure to update condition eventually!
}

// Example: User input validation
let password = "";
while (password.length < 8) {
  password = prompt("Enter a password (min 8 characters):");
}

// Example: Generate random numbers until we get 5
let randomNum;
let attempts = 0;
while (randomNum !== 5) {
  randomNum = Math.floor(Math.random() * 10) + 1;
  attempts++;
  console.log(`Attempt ${attempts}: Generated ${randomNum}`);
}
console.log(`Found 5 after ${attempts} attempts!`);

// Example: Process items until empty
let items = ["task1", "task2", "task3"];
while (items.length > 0) {
  const currentTask = items.pop();
  console.log(`Processing: ${currentTask}`);
}
```

### 3. Do-While Loop

**Best for:** When you need to execute code at least once

```javascript
// Basic do-while syntax
do {
  // code to execute
} while (condition);

// Example: Menu system
let choice;
do {
  console.log("\n=== Main Menu ===");
  console.log("1. Play Game");
  console.log("2. View Stats");
  console.log("3. Settings");
  console.log("4. Exit");

  choice = prompt("Choose an option (1-4):");

  switch (choice) {
    case "1":
      console.log("Starting game...");
      break;
    case "2":
      console.log("Displaying stats...");
      break;
    case "3":
      console.log("Opening settings...");
      break;
    case "4":
      console.log("Goodbye!");
      break;
    default:
      console.log("Invalid choice. Please try again.");
  }
} while (choice !== "4");

// Example: Dice game
let roll;
let rollCount = 0;
do {
  roll = Math.floor(Math.random() * 6) + 1;
  rollCount++;
  console.log(`Roll ${rollCount}: ${roll}`);
} while (roll !== 6);
console.log(`Got a 6 after ${rollCount} rolls!`);
```

## 🎮 Loop Control Statements

### Break Statement

Exits the loop completely

```javascript
// Example: Find first even number
const numbers = [1, 3, 7, 8, 11, 12, 15];
let firstEven;

for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    firstEven = numbers[i];
    break; // Exit the loop immediately
  }
}

console.log(`First even number: ${firstEven}`); // 8

// Example: Search for user
const users = ["alice", "bob", "charlie", "diana"];
const searchName = "charlie";
let found = false;

for (let i = 0; i < users.length; i++) {
  if (users[i] === searchName) {
    console.log(`Found ${searchName} at index ${i}`);
    found = true;
    break;
  }
}

if (!found) {
  console.log(`${searchName} not found`);
}
```

### Continue Statement

Skips the current iteration and continues with the next one

```javascript
// Example: Process only positive numbers
const numbers = [-2, 5, -1, 8, 0, 3, -4];

for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] <= 0) {
    continue; // Skip non-positive numbers
  }
  console.log(`Processing positive number: ${numbers[i]}`);
}
// Output: Processing positive number: 5, 8, 3

// Example: Skip weekends
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

for (let i = 0; i < days.length; i++) {
  if (days[i] === "Saturday" || days[i] === "Sunday") {
    continue; // Skip weekends
  }
  console.log(`Work day: ${days[i]}`);
}
```

## 🔁 Nested Loops

When you need loops inside loops:

```javascript
// Example: Multiplication table
console.log("Multiplication Table:");
for (let i = 1; i <= 10; i++) {
  let row = "";
  for (let j = 1; j <= 10; j++) {
    row += `${i * j}\t`;
  }
  console.log(row);
}

// Example: 2D array processing
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

console.log("Matrix elements:");
for (let row = 0; row < matrix.length; row++) {
  for (let col = 0; col < matrix[row].length; col++) {
    console.log(`matrix[${row}][${col}] = ${matrix[row][col]}`);
  }
}

// Example: Find all pairs
const colors = ["red", "blue", "green"];
const sizes = ["small", "medium", "large"];

console.log("All combinations:");
for (let i = 0; i < colors.length; i++) {
  for (let j = 0; j < sizes.length; j++) {
    console.log(`${sizes[j]} ${colors[i]} shirt`);
  }
}
```

## ⚠️ Common Pitfalls and Best Practices

### 1. Infinite Loops

```javascript
// ❌ BAD: Infinite loop (i never changes)
for (let i = 0; i < 10 /* missing increment */; ) {
  console.log(i);
}

// ❌ BAD: Condition never becomes false
let x = 0;
while (x >= 0) {
  console.log(x);
  x++; // x keeps growing, never negative
}

// ✅ GOOD: Proper loop control
for (let i = 0; i < 10; i++) {
  console.log(i);
}

let y = 0;
while (y < 10) {
  console.log(y);
  y++;
}
```

### 2. Off-by-One Errors

```javascript
const arr = [1, 2, 3, 4, 5];

// ❌ BAD: Will cause error (index out of bounds)
for (let i = 0; i <= arr.length; i++) {
  console.log(arr[i]); // arr[5] is undefined
}

// ✅ GOOD: Correct boundary
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]);
}
```

### 3. Modifying Array During Iteration

```javascript
const numbers = [1, 2, 3, 4, 5];

// ❌ BAD: Modifying array while iterating
for (let i = 0; i < numbers.length; i++) {
  if (numbers[i] % 2 === 0) {
    numbers.splice(i, 1); // Changes array length!
  }
}

// ✅ GOOD: Iterate backwards when removing items
for (let i = numbers.length - 1; i >= 0; i--) {
  if (numbers[i] % 2 === 0) {
    numbers.splice(i, 1);
  }
}

// ✅ BETTER: Use filter method
const oddNumbers = numbers.filter((num) => num % 2 !== 0);
```

## 🚀 Practical Examples

### Example 1: Password Strength Checker

```javascript
function checkPasswordStrength(password) {
  let score = 0;
  let feedback = [];

  // Check length
  if (password.length >= 8) {
    score += 2;
  } else {
    feedback.push("Password should be at least 8 characters");
  }

  // Check for different character types
  let hasLower = false,
    hasUpper = false,
    hasNumber = false,
    hasSpecial = false;

  for (let i = 0; i < password.length; i++) {
    const char = password[i];

    if (char >= "a" && char <= "z") {
      hasLower = true;
    } else if (char >= "A" && char <= "Z") {
      hasUpper = true;
    } else if (char >= "0" && char <= "9") {
      hasNumber = true;
    } else {
      hasSpecial = true;
    }
  }

  if (hasLower) score++;
  else feedback.push("Add lowercase letters");

  if (hasUpper) score++;
  else feedback.push("Add uppercase letters");

  if (hasNumber) score++;
  else feedback.push("Add numbers");

  if (hasSpecial) score++;
  else feedback.push("Add special characters");

  let strength = "";
  if (score < 3) strength = "Weak";
  else if (score < 5) strength = "Medium";
  else strength = "Strong";

  return { strength, score, feedback };
}

// Test the function
console.log(checkPasswordStrength("password"));
console.log(checkPasswordStrength("Password123!"));
```

### Example 2: Simple Game Loop

```javascript
function playNumberGuessingGame() {
  const secretNumber = Math.floor(Math.random() * 100) + 1;
  let attempts = 0;
  let maxAttempts = 7;
  let hasWon = false;

  console.log("🎯 Guess the number between 1 and 100!");
  console.log(`You have ${maxAttempts} attempts.`);

  while (attempts < maxAttempts && !hasWon) {
    attempts++;
    const guess = parseInt(prompt(`Attempt ${attempts}: Enter your guess:`));

    if (isNaN(guess) || guess < 1 || guess > 100) {
      console.log("Please enter a valid number between 1 and 100");
      attempts--; // Don't count invalid attempts
      continue;
    }

    if (guess === secretNumber) {
      hasWon = true;
      console.log(
        `🎉 Congratulations! You guessed it in ${attempts} attempts!`
      );
    } else if (guess < secretNumber) {
      console.log("📈 Too low! Try a higher number.");
    } else {
      console.log("📉 Too high! Try a lower number.");
    }

    if (!hasWon && attempts < maxAttempts) {
      console.log(`You have ${maxAttempts - attempts} attempts left.`);
    }
  }

  if (!hasWon) {
    console.log(`💥 Game over! The number was ${secretNumber}.`);
  }
}

// Start the game
playNumberGuessingGame();
```

## 💡 Performance Tips

### 1. Cache Array Length

```javascript
const largeArray = new Array(10000).fill().map((_, i) => i);

// ❌ SLOWER: Length calculated every iteration
for (let i = 0; i < largeArray.length; i++) {
  // process item
}

// ✅ FASTER: Length cached
const length = largeArray.length;
for (let i = 0; i < length; i++) {
  // process item
}
```

### 2. Use Appropriate Loop Type

```javascript
const items = ["a", "b", "c", "d", "e"];

// For simple iteration over arrays, for...of is cleaner
for (const item of items) {
  console.log(item);
}

// For when you need the index
for (let i = 0; i < items.length; i++) {
  console.log(`${i}: ${items[i]}`);
}

// For objects, use for...in
const person = { name: "Alice", age: 30, city: "Boston" };
for (const key in person) {
  console.log(`${key}: ${person[key]}`);
}
```

## 🎯 Key Takeaways

1. **Choose the right loop type**: `for` when you know iterations, `while` when condition-based
2. **Always ensure loop termination**: Update your control variable
3. **Watch for off-by-one errors**: Check your boundary conditions
4. **Use break and continue strategically**: For early exits and skipping iterations
5. **Cache values when possible**: Don't recalculate the same things repeatedly
6. **Be careful with nested loops**: They can impact performance significantly

## 🔍 Next Steps

- Practice with the exercises in the exercises folder
- Try implementing classic algorithms using loops (bubble sort, linear search)
- Experiment with loop optimizations for large datasets
- Learn about array iteration methods (forEach, map, filter) as alternatives to traditional loops

Remember: Loops are fundamental to programming. Master them, and you'll be able to solve complex problems with simple, elegant code! 🚀
