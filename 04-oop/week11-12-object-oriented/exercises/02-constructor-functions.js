/**
 * Exercise 2: Constructor Functions
 *
 * Learn how to create objects using constructor functions and understand prototypes
 */

console.log("=== Exercise 2: Constructor Functions ===\n");

// PART 1: Basic Constructor Functions
console.log("PART 1: Basic Constructor Functions");

/*
 * TODO 1.1: Create a Person constructor function
 * Should accept name, age, and occupation parameters
 * Should set these as properties on the instance
 */

function Person(name, age, occupation) {
  // Your code here
}

// Test the constructor
const person1 = new Person("Alice Johnson", 28, "Software Engineer");
const person2 = new Person("Bob Smith", 35, "Teacher");

console.log("Person 1:", person1);
console.log("Person 2:", person2);

/*
 * TODO 1.2: Add methods to the Person constructor
 * Add methods directly to the constructor function
 */

function PersonWithMethods(name, age, occupation) {
  this.name = name;
  this.age = age;
  this.occupation = occupation;

  // Add a greet method here
  this.greet = function () {
    // Your code here - return greeting message
  };

  // Add a getInfo method here
  this.getInfo = function () {
    // Your code here - return formatted info string
  };
}

const person3 = new PersonWithMethods("Carol Davis", 32, "Designer");
console.log("Greeting:", person3.greet());
console.log("Info:", person3.getInfo());

// PART 2: Understanding the 'new' Keyword
console.log("\nPART 2: Understanding the 'new' Keyword");

/*
 * TODO 2.1: Create a function that demonstrates what 'new' does
 */

function Car(brand, model, year) {
  // Your code here
  // Set properties for brand, model, year
}

// Create instances using 'new'
const car1 = new Car("Honda", "Civic", 2022);
const car2 = new Car("Ford", "Mustang", 2023);

console.log("Car 1:", car1);
console.log("Car 2:", car2);

/*
 * TODO 2.2: Show what happens without 'new' keyword
 */

function TestConstructor(value) {
  this.value = value;
  this.getValue = function () {
    return this.value;
  };
}

// Test with 'new'
const withNew = new TestConstructor("correct");
console.log("With 'new':", withNew);

// Test without 'new' (dangerous!)
// Uncomment the line below to see what happens
// const withoutNew = TestConstructor("incorrect");
// console.log("Without 'new':", withoutNew);

// PART 3: Prototype and Prototype Chain
console.log("\nPART 3: Prototype and Prototype Chain");

/*
 * TODO 3.1: Add methods to constructor prototype
 */

function Animal(name, species) {
  // Your code here
  // Set name and species properties
}

// Add methods to the prototype instead of the constructor
Animal.prototype.speak = function () {
  // Your code here
  // Return a string like "[name] makes a sound"
};

Animal.prototype.getSpecies = function () {
  // Your code here
  // Return the species
};

Animal.prototype.toString = function () {
  // Your code here
  // Return formatted string with name and species
};

const animal1 = new Animal("Rex", "Dog");
const animal2 = new Animal("Fluffy", "Cat");

console.log("Animal 1 speaks:", animal1.speak());
console.log("Animal 2 species:", animal2.getSpecies());
console.log("Animal 1 toString:", animal1.toString());

/*
 * TODO 3.2: Understand prototype chain
 */

// Check if methods exist on prototype
console.log(
  "speak method on prototype?",
  Animal.prototype.hasOwnProperty("speak")
);
console.log(
  "name property on prototype?",
  Animal.prototype.hasOwnProperty("name")
);
console.log("name property on instance?", animal1.hasOwnProperty("name"));

// Check prototype chain
console.log("animal1 instanceof Animal:", animal1 instanceof Animal);
console.log("animal1.constructor === Animal:", animal1.constructor === Animal);

// PART 4: Constructor Inheritance
console.log("\nPART 4: Constructor Inheritance");

/*
 * TODO 4.1: Create a Dog constructor that inherits from Animal
 */

function Dog(name, breed, age) {
  // Your code here
  // Call Animal constructor with name and "Dog" as species
  // Set breed and age properties
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Add Dog-specific methods
Dog.prototype.bark = function () {
  // Your code here
  // Return "[name] barks: Woof!"
};

Dog.prototype.getAge = function () {
  // Your code here
  // Return the age
};

// Override the speak method
Dog.prototype.speak = function () {
  // Your code here
  // Return "[name] barks loudly!"
};

const dog1 = new Dog("Buddy", "Golden Retriever", 3);
const dog2 = new Dog("Max", "German Shepherd", 5);

console.log("Dog 1:", dog1);
console.log("Dog 1 speaks:", dog1.speak());
console.log("Dog 1 barks:", dog1.bark());
console.log("Dog 1 age:", dog1.getAge());

// Test inheritance
console.log("dog1 instanceof Dog:", dog1 instanceof Dog);
console.log("dog1 instanceof Animal:", dog1 instanceof Animal);

/*
 * TODO 4.2: Create a Cat constructor that also inherits from Animal
 */

function Cat(name, color, isIndoor) {
  // Your code here
}

// Set up inheritance for Cat
// Your code here

Cat.prototype.meow = function () {
  // Your code here
  // Return "[name] meows: Meow!"
};

Cat.prototype.isIndoorCat = function () {
  // Your code here
  // Return whether the cat is indoor
};

// Override speak method for Cat
Cat.prototype.speak = function () {
  // Your code here
  // Return "[name] purrs softly"
};

const cat1 = new Cat("Whiskers", "Orange", true);
console.log("Cat 1:", cat1);
console.log("Cat 1 speaks:", cat1.speak());
console.log("Cat 1 meows:", cat1.meow());

// PART 5: Static Methods and Properties
console.log("\nPART 5: Static Methods and Properties");

/*
 * TODO 5.1: Add static methods to constructor
 */

function Product(name, price, category) {
  this.name = name;
  this.price = price;
  this.category = category;

  // Add to product count
  Product.count = (Product.count || 0) + 1;
}

// Static property
Product.count = 0;

// Static methods
Product.getCount = function () {
  // Your code here
  // Return the total number of products created
};

Product.comparePrice = function (product1, product2) {
  // Your code here
  // Return which product is more expensive
};

Product.createSaleProduct = function (name, originalPrice, discountPercent) {
  // Your code here
  // Create a product with discounted price
  // Set category to "Sale"
};

// Instance methods
Product.prototype.getInfo = function () {
  // Your code here
  // Return formatted product information
};

Product.prototype.applyDiscount = function (percentage) {
  // Your code here
  // Apply discount to the price
};

const product1 = new Product("Laptop", 999, "Electronics");
const product2 = new Product("Book", 25, "Education");
const product3 = Product.createSaleProduct("Tablet", 300, 20);

console.log("Product count:", Product.getCount());
console.log("Product 1 info:", product1.getInfo());
console.log("Price comparison:", Product.comparePrice(product1, product2));

// PART 6: Advanced Constructor Patterns
console.log("\nPART 6: Advanced Constructor Patterns");

/*
 * TODO 6.1: Factory pattern with constructor
 */

function VehicleFactory() {}

VehicleFactory.createCar = function (make, model) {
  // Your code here
  // Return a new car object with make, model, and type: "car"
};

VehicleFactory.createTruck = function (make, model, capacity) {
  // Your code here
  // Return a new truck object with make, model, capacity, and type: "truck"
};

VehicleFactory.createMotorcycle = function (make, model, engineSize) {
  // Your code here
  // Return a new motorcycle object with make, model, engineSize, and type: "motorcycle"
};

// Test factory
const vehicles = [
  VehicleFactory.createCar("Toyota", "Camry"),
  VehicleFactory.createTruck("Ford", "F-150", "1000 lbs"),
  VehicleFactory.createMotorcycle("Harley", "Sportster", "883cc")
];

console.log("Vehicles:", vehicles);

/*
 * TODO 6.2: Constructor with validation
 */

function BankAccount(accountNumber, initialBalance, accountType) {
  // Validate inputs
  if (!accountNumber || typeof accountNumber !== "string") {
    throw new Error("Valid account number required");
  }

  if (typeof initialBalance !== "number" || initialBalance < 0) {
    throw new Error("Initial balance must be a non-negative number");
  }

  // Your code here
  // Set properties and add validation

  // Private-like properties using closures
  let balance = initialBalance;

  this.getBalance = function () {
    return balance;
  };

  this.deposit = function (amount) {
    // Your code here
    // Add validation and update balance
  };

  this.withdraw = function (amount) {
    // Your code here
    // Add validation, check sufficient funds, update balance
  };
}

BankAccount.prototype.getAccountInfo = function () {
  // Your code here
  // Return formatted account information
};

// Test bank account
try {
  const account1 = new BankAccount("ACC123", 1000, "Checking");
  console.log("Account created:", account1.getAccountInfo());

  account1.deposit(500);
  console.log("After deposit:", account1.getBalance());

  account1.withdraw(200);
  console.log("After withdrawal:", account1.getBalance());

  // This should throw an error
  // account1.withdraw(2000);
} catch (error) {
  console.log("Error:", error.message);
}

// BONUS CHALLENGES
console.log("\n=== BONUS CHALLENGES ===");

/*
 * BONUS 1: Implement a simple EventEmitter using constructor functions
 */

function EventEmitter() {
  // Your code here
  // Initialize events storage
}

EventEmitter.prototype.on = function (eventName, callback) {
  // Your code here
  // Add event listener
};

EventEmitter.prototype.emit = function (eventName, ...args) {
  // Your code here
  // Trigger all listeners for the event
};

EventEmitter.prototype.off = function (eventName, callback) {
  // Your code here
  // Remove specific event listener
};

EventEmitter.prototype.once = function (eventName, callback) {
  // Your code here
  // Add event listener that only triggers once
};

// Test EventEmitter
const emitter = new EventEmitter();

emitter.on("test", (data) => console.log("Test event:", data));
emitter.once("welcome", (name) => console.log("Welcome", name));

emitter.emit("test", "Hello World");
emitter.emit("welcome", "Alice");
emitter.emit("welcome", "Bob"); // This won't trigger anything

/*
 * BONUS 2: Create a mixin system for constructor functions
 */

function createMixin(mixin) {
  // Your code here
  // Return a function that can add mixin methods to a constructor
}

// Example mixins
const Flyable = {
  fly: function () {
    return `${this.name} is flying!`;
  },
  land: function () {
    return `${this.name} has landed.`;
  }
};

const Swimmable = {
  swim: function () {
    return `${this.name} is swimming!`;
  },
  dive: function () {
    return `${this.name} dives underwater.`;
  }
};

// Test constructor with mixins
function Bird(name, species) {
  this.name = name;
  this.species = species;
}

// Apply mixins
// Your code here - apply Flyable mixin to Bird

const eagle = new Bird("Eagle", "Bird of Prey");
console.log("Mixin test:", eagle.fly());

console.log("\n=== Exercise 2 Complete! ===");

/*
 * SELF-CHECK QUESTIONS:
 * 1. What happens when you use the 'new' keyword with a function?
 * 2. What's the difference between adding methods to the constructor vs. the prototype?
 * 3. How do you set up inheritance between constructor functions?
 * 4. What is the prototype chain and how does it work?
 * 5. How do you create static methods for constructor functions?
 * 6. What are the advantages of using prototypes for methods?
 * 7. How can you implement private-like variables in constructor functions?
 */
