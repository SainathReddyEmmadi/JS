/**
 * Exercise 3: ES6 Classes
 *
 * Learn modern JavaScript class syntax and features
 */

console.log("=== Exercise 3: ES6 Classes ===\n");

// PART 1: Basic Class Declaration
console.log("PART 1: Basic Class Declaration");

/*
 * TODO 1.1: Create a basic User class
 */

class User {
  // Your code here
  // Add constructor with username, email, and role parameters
  // Add method to get user info
  // Add method to update email
  // Add method to check if user is admin
}

// Test the User class
const user1 = new User("john_doe", "john@example.com", "admin");
const user2 = new User("jane_smith", "jane@example.com", "user");

console.log("User 1:", user1.getUserInfo());
console.log("User 2:", user2.getUserInfo());
console.log("User 1 is admin:", user1.isAdmin());
console.log("User 2 is admin:", user2.isAdmin());

/*
 * TODO 1.2: Add static methods to the User class
 */

// Add these static methods to the User class above:
// - User.validateEmail(email) - returns boolean
// - User.createAdmin(username, email) - returns new User with admin role
// - User.createRegularUser(username, email) - returns new User with user role

// Test static methods
console.log("Valid email test:", User.validateEmail("test@example.com"));
console.log("Invalid email test:", User.validateEmail("invalid-email"));

const adminUser = User.createAdmin("admin_user", "admin@company.com");
console.log("Created admin:", adminUser.getUserInfo());

// PART 2: Getters and Setters
console.log("\nPART 2: Getters and Setters");

/*
 * TODO 2.1: Create a Rectangle class with getters and setters
 */

class Rectangle {
  constructor(width, height) {
    // Your code here
    // Use private properties (underscore convention or # syntax)
  }

  // Add getter for width
  get width() {
    // Your code here
  }

  // Add setter for width with validation
  set width(value) {
    // Your code here
    // Validate that value is positive number
  }

  // Add getter for height
  get height() {
    // Your code here
  }

  // Add setter for height with validation
  set height(value) {
    // Your code here
    // Validate that value is positive number
  }

  // Add getter for area
  get area() {
    // Your code here
  }

  // Add getter for perimeter
  get perimeter() {
    // Your code here
  }

  // Add method to get info
  getInfo() {
    // Your code here
    // Return formatted string with dimensions, area, and perimeter
  }
}

// Test Rectangle class
const rect1 = new Rectangle(5, 10);
console.log("Rectangle info:", rect1.getInfo());
console.log("Area:", rect1.area);
console.log("Perimeter:", rect1.perimeter);

// Test setters
rect1.width = 8;
rect1.height = 12;
console.log("After modification:", rect1.getInfo());

// Test validation (should throw error)
try {
  rect1.width = -5;
} catch (error) {
  console.log("Validation error:", error.message);
}

// PART 3: Private Fields and Methods (ES2022)
console.log("\nPART 3: Private Fields and Methods");

/*
 * TODO 3.1: Create a BankAccount class with private fields
 */

class BankAccount {
  // Private fields
  #accountNumber;
  #balance;
  #pin;
  #isLocked;

  constructor(accountNumber, initialBalance, pin) {
    // Your code here
    // Initialize private fields
    // Validate inputs
  }

  // Private method
  #validatePin(enteredPin) {
    // Your code here
    // Check if entered pin matches stored pin
  }

  // Private method
  #lockAccount() {
    // Your code here
    // Lock the account
  }

  // Private method
  #unlockAccount() {
    // Your code here
    // Unlock the account
  }

  // Public method to deposit money
  deposit(amount, pin) {
    // Your code here
    // Validate pin, check if account is locked, validate amount, update balance
  }

  // Public method to withdraw money
  withdraw(amount, pin) {
    // Your code here
    // Validate pin, check if account is locked, check sufficient funds, update balance
  }

  // Public method to check balance
  getBalance(pin) {
    // Your code here
    // Validate pin, return balance if valid
  }

  // Public method to get account status
  getAccountStatus() {
    // Your code here
    // Return object with account number and locked status (not sensitive info)
  }
}

// Test BankAccount
const account = new BankAccount("123456789", 1000, "1234");
console.log("Account status:", account.getAccountStatus());

account.deposit(500, "1234");
console.log("Balance after deposit:", account.getBalance("1234"));

account.withdraw(200, "1234");
console.log("Balance after withdrawal:", account.getBalance("1234"));

// Test wrong PIN
try {
  account.withdraw(100, "0000");
} catch (error) {
  console.log("Wrong PIN error:", error.message);
}

// PART 4: Class Inheritance
console.log("\nPART 4: Class Inheritance");

/*
 * TODO 4.1: Create a base Vehicle class
 */

class Vehicle {
  constructor(make, model, year) {
    // Your code here
  }

  start() {
    // Your code here
    // Return "[make] [model] is starting..."
  }

  stop() {
    // Your code here
    // Return "[make] [model] has stopped."
  }

  getInfo() {
    // Your code here
    // Return formatted vehicle information
  }

  getAge() {
    // Your code here
    // Calculate and return vehicle age based on current year
  }
}

/*
 * TODO 4.2: Create a Car class that extends Vehicle
 */

class Car extends Vehicle {
  constructor(make, model, year, doors, fuelType) {
    // Your code here
    // Call parent constructor and set car-specific properties
  }

  // Override start method
  start() {
    // Your code here
    // Return car-specific start message
  }

  // Add car-specific method
  openTrunk() {
    // Your code here
    // Return trunk opening message
  }

  // Override getInfo method
  getInfo() {
    // Your code here
    // Get parent info and add car-specific details
  }
}

/*
 * TODO 4.3: Create a Motorcycle class that extends Vehicle
 */

class Motorcycle extends Vehicle {
  constructor(make, model, year, engineSize, type) {
    // Your code here
  }

  // Override start method
  start() {
    // Your code here
  }

  // Add motorcycle-specific method
  wheelie() {
    // Your code here
  }

  // Override getInfo method
  getInfo() {
    // Your code here
  }
}

// Test inheritance
const car = new Car("Toyota", "Camry", 2020, 4, "Gasoline");
const motorcycle = new Motorcycle(
  "Harley",
  "Sportster",
  2021,
  "883cc",
  "Cruiser"
);

console.log("Car info:", car.getInfo());
console.log("Car start:", car.start());
console.log("Car trunk:", car.openTrunk());

console.log("Motorcycle info:", motorcycle.getInfo());
console.log("Motorcycle start:", motorcycle.start());
console.log("Motorcycle wheelie:", motorcycle.wheelie());

// Test instanceof
console.log("car instanceof Car:", car instanceof Car);
console.log("car instanceof Vehicle:", car instanceof Vehicle);
console.log("motorcycle instanceof Vehicle:", motorcycle instanceof Vehicle);

// PART 5: Method Overriding and Super
console.log("\nPART 5: Method Overriding and Super");

/*
 * TODO 5.1: Create an Employee class hierarchy
 */

class Employee {
  constructor(name, id, salary) {
    // Your code here
  }

  work() {
    return `${this.name} is working.`;
  }

  calculatePay() {
    // Your code here
    // Return monthly salary
  }

  getDetails() {
    // Your code here
    // Return employee details
  }
}

class Developer extends Employee {
  constructor(name, id, salary, programmingLanguages) {
    // Your code here
  }

  // Override work method
  work() {
    // Your code here
    // Call super.work() and add developer-specific work
  }

  // Add developer-specific method
  code() {
    // Your code here
  }

  // Override getDetails method
  getDetails() {
    // Your code here
    // Call super.getDetails() and add programming languages
  }
}

class Manager extends Employee {
  constructor(name, id, salary, teamSize) {
    // Your code here
  }

  // Override work method
  work() {
    // Your code here
  }

  // Add manager-specific method
  holdMeeting() {
    // Your code here
  }

  // Override calculatePay method (managers get bonus)
  calculatePay() {
    // Your code here
    // Call super.calculatePay() and add 20% bonus
  }

  // Override getDetails method
  getDetails() {
    // Your code here
  }
}

// Test employee hierarchy
const dev = new Developer("Alice", "DEV001", 75000, [
  "JavaScript",
  "Python",
  "Java"
]);
const manager = new Manager("Bob", "MGR001", 90000, 8);

console.log("Developer details:", dev.getDetails());
console.log("Developer work:", dev.work());
console.log("Developer code:", dev.code());
console.log("Developer pay:", dev.calculatePay());

console.log("Manager details:", manager.getDetails());
console.log("Manager work:", manager.work());
console.log("Manager meeting:", manager.holdMeeting());
console.log("Manager pay:", manager.calculatePay());

// PART 6: Abstract Classes and Interfaces (Simulation)
console.log("\nPART 6: Abstract Classes and Interfaces");

/*
 * TODO 6.1: Create an abstract Shape class
 */

class Shape {
  constructor(color) {
    if (this.constructor === Shape) {
      throw new Error("Cannot instantiate abstract class Shape");
    }
    this.color = color;
  }

  // Abstract method - must be implemented by subclasses
  calculateArea() {
    throw new Error("calculateArea method must be implemented");
  }

  // Abstract method
  calculatePerimeter() {
    throw new Error("calculatePerimeter method must be implemented");
  }

  // Concrete method
  getColor() {
    return this.color;
  }

  // Template method
  getShapeInfo() {
    return `${this.constructor.name}: Color=${
      this.color
    }, Area=${this.calculateArea()}, Perimeter=${this.calculatePerimeter()}`;
  }
}

/*
 * TODO 6.2: Create concrete shape classes
 */

class Circle extends Shape {
  constructor(color, radius) {
    // Your code here
  }

  calculateArea() {
    // Your code here
    // Return π * radius²
  }

  calculatePerimeter() {
    // Your code here
    // Return 2 * π * radius
  }
}

class Square extends Shape {
  constructor(color, side) {
    // Your code here
  }

  calculateArea() {
    // Your code here
  }

  calculatePerimeter() {
    // Your code here
  }
}

class Triangle extends Shape {
  constructor(color, side1, side2, side3) {
    // Your code here
  }

  calculateArea() {
    // Your code here
    // Use Heron's formula
  }

  calculatePerimeter() {
    // Your code here
  }
}

// Test abstract class pattern
const shapes = [
  new Circle("red", 5),
  new Square("blue", 4),
  new Triangle("green", 3, 4, 5)
];

shapes.forEach((shape) => {
  console.log(shape.getShapeInfo());
});

// Test abstract class (should throw error)
try {
  const shape = new Shape("white");
} catch (error) {
  console.log("Abstract class error:", error.message);
}

// BONUS CHALLENGES
console.log("\n=== BONUS CHALLENGES ===");

/*
 * BONUS 1: Create a mixin system for classes
 */

// Mixin functions
const Flyable = {
  fly() {
    return `${this.name} is flying at ${this.altitude || 1000} feet!`;
  },

  setAltitude(altitude) {
    this.altitude = altitude;
  }
};

const Swimmable = {
  swim() {
    return `${this.name} is swimming at ${this.depth || 5} feet deep!`;
  },

  setDepth(depth) {
    this.depth = depth;
  }
};

// Mixin utility function
function mixinTo(targetClass, ...mixins) {
  // Your code here
  // Add mixin methods to the target class prototype
}

// Test class
class Duck {
  constructor(name) {
    this.name = name;
  }

  quack() {
    return `${this.name} says quack!`;
  }
}

// Apply mixins
mixinTo(Duck, Flyable, Swimmable);

const duck = new Duck("Donald");
console.log("Duck quack:", duck.quack());
console.log("Duck fly:", duck.fly());
console.log("Duck swim:", duck.swim());

/*
 * BONUS 2: Create a class decorator system
 */

function logged(target) {
  // Your code here
  // Create a decorator that logs method calls
}

function validated(target) {
  // Your code here
  // Create a decorator that validates constructor arguments
}

// Example usage (if decorators were fully supported)
// @logged
// @validated
class Example {
  constructor(value) {
    this.value = value;
  }

  getValue() {
    return this.value;
  }
}

/*
 * BONUS 3: Implement a simple Observer pattern using classes
 */

class Observable {
  constructor() {
    // Your code here
  }

  subscribe(observer) {
    // Your code here
  }

  unsubscribe(observer) {
    // Your code here
  }

  notify(data) {
    // Your code here
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }

  update(data) {
    console.log(`${this.name} received:`, data);
  }
}

// Test Observer pattern
const observable = new Observable();
const observer1 = new Observer("Observer 1");
const observer2 = new Observer("Observer 2");

observable.subscribe(observer1);
observable.subscribe(observer2);

observable.notify("Hello Observers!");

observable.unsubscribe(observer1);
observable.notify("Only Observer 2 should see this");

console.log("\n=== Exercise 3 Complete! ===");

/*
 * SELF-CHECK QUESTIONS:
 * 1. What's the difference between class declarations and class expressions?
 * 2. How do getters and setters work in ES6 classes?
 * 3. What are private fields and how do they differ from private methods?
 * 4. How does inheritance work with ES6 classes compared to constructor functions?
 * 5. When and how should you use the 'super' keyword?
 * 6. How can you simulate abstract classes in JavaScript?
 * 7. What are mixins and how can they be implemented with classes?
 * 8. What's the difference between static methods and instance methods?
 */
