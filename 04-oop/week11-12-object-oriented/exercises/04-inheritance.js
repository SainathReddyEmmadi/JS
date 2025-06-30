/**
 * Exercise 4: Inheritance and Polymorphism
 *
 * Master inheritance patterns and polymorphic behavior in JavaScript
 */

console.log("=== Exercise 4: Inheritance and Polymorphism ===\n");

// PART 1: Basic Inheritance Patterns
console.log("PART 1: Basic Inheritance Patterns");

/*
 * TODO 1.1: Create an Animal hierarchy with ES6 classes
 */

class Animal {
  constructor(name, species, age) {
    // Your code here
  }

  makeSound() {
    // Your code here
    // Return generic animal sound
  }

  eat(food) {
    // Your code here
    // Return eating message
  }

  sleep() {
    // Your code here
    // Return sleeping message
  }

  getInfo() {
    // Your code here
    // Return formatted animal information
  }
}

class Mammal extends Animal {
  constructor(name, species, age, furColor) {
    // Your code here
  }

  // Override makeSound with mammal-specific behavior
  makeSound() {
    // Your code here
  }

  // Add mammal-specific method
  giveBirth() {
    // Your code here
  }

  // Override getInfo to include fur color
  getInfo() {
    // Your code here
  }
}

class Bird extends Animal {
  constructor(name, species, age, wingSpan) {
    // Your code here
  }

  // Override makeSound with bird-specific behavior
  makeSound() {
    // Your code here
  }

  // Add bird-specific method
  fly() {
    // Your code here
  }

  // Override getInfo to include wing span
  getInfo() {
    // Your code here
  }
}

// Test basic inheritance
const genericAnimal = new Animal("Rex", "Unknown", 5);
const mammal = new Mammal("Bella", "Dog", 3, "Brown");
const bird = new Bird("Tweety", "Canary", 2, "6 inches");

console.log("Generic animal:", genericAnimal.getInfo());
console.log("Generic animal sound:", genericAnimal.makeSound());

console.log("Mammal:", mammal.getInfo());
console.log("Mammal sound:", mammal.makeSound());
console.log("Mammal birth:", mammal.giveBirth());

console.log("Bird:", bird.getInfo());
console.log("Bird sound:", bird.makeSound());
console.log("Bird fly:", bird.fly());

// PART 2: Deep Inheritance Chains
console.log("\nPART 2: Deep Inheritance Chains");

/*
 * TODO 2.1: Extend the hierarchy further
 */

class Dog extends Mammal {
  constructor(name, age, furColor, breed) {
    // Your code here
    // Call parent constructor with "Dog" as species
  }

  // Override makeSound with dog-specific behavior
  makeSound() {
    // Your code here
  }

  // Add dog-specific methods
  bark() {
    // Your code here
  }

  wagTail() {
    // Your code here
  }

  fetch(item) {
    // Your code here
  }

  // Override getInfo to include breed
  getInfo() {
    // Your code here
  }
}

class Cat extends Mammal {
  constructor(name, age, furColor, isIndoor) {
    // Your code here
  }

  // Override makeSound
  makeSound() {
    // Your code here
  }

  // Add cat-specific methods
  meow() {
    // Your code here
  }

  purr() {
    // Your code here
  }

  scratch(object) {
    // Your code here
  }

  // Override getInfo
  getInfo() {
    // Your code here
  }
}

class Eagle extends Bird {
  constructor(name, age, wingSpan, territory) {
    // Your code here
  }

  // Override makeSound
  makeSound() {
    // Your code here
  }

  // Override fly with eagle-specific behavior
  fly() {
    // Your code here
  }

  // Add eagle-specific methods
  hunt(prey) {
    // Your code here
  }

  soar() {
    // Your code here
  }

  // Override getInfo
  getInfo() {
    // Your code here
  }
}

// Test deep inheritance
const dog = new Dog("Buddy", 4, "Golden", "Retriever");
const cat = new Cat("Whiskers", 3, "Gray", true);
const eagle = new Eagle("Freedom", 8, "7 feet", "Mountain Range");

console.log("Dog:", dog.getInfo());
console.log("Dog sound:", dog.makeSound());
console.log("Dog bark:", dog.bark());
console.log("Dog fetch:", dog.fetch("ball"));

console.log("Cat:", cat.getInfo());
console.log("Cat sound:", cat.makeSound());
console.log("Cat purr:", cat.purr());

console.log("Eagle:", eagle.getInfo());
console.log("Eagle sound:", eagle.makeSound());
console.log("Eagle hunt:", eagle.hunt("rabbit"));

// PART 3: Polymorphism in Action
console.log("\nPART 3: Polymorphism in Action");

/*
 * TODO 3.1: Demonstrate polymorphism with a zoo system
 */

class Zoo {
  constructor(name) {
    this.name = name;
    this.animals = [];
  }

  addAnimal(animal) {
    // Your code here
    // Add animal to the zoo
  }

  feedAllAnimals() {
    // Your code here
    // Call eat method on all animals (polymorphism)
    console.log(`Feeding all animals in ${this.name}:`);
  }

  makeAllAnimalsSounds() {
    // Your code here
    // Call makeSound method on all animals (polymorphism)
    console.log(`All animals in ${this.name} are making sounds:`);
  }

  getZooInfo() {
    // Your code here
    // Return zoo information including animal count and types
  }

  exerciseAnimals() {
    // Your code here
    // Call appropriate exercise methods based on animal type
    console.log(`Exercising animals in ${this.name}:`);
  }
}

// Create zoo and add different animals
const zoo = new Zoo("Wildlife Park");

zoo.addAnimal(new Dog("Rex", 5, "Black", "German Shepherd"));
zoo.addAnimal(new Cat("Luna", 2, "White", false));
zoo.addAnimal(new Eagle("Storm", 6, "8 feet", "Cliffs"));
zoo.addAnimal(new Mammal("Elephant", "African Elephant", 15, "Gray"));

console.log("Zoo info:", zoo.getZooInfo());
zoo.feedAllAnimals();
zoo.makeAllAnimalsSounds();
zoo.exerciseAnimals();

/*
 * TODO 3.2: Create a shape calculator using polymorphism
 */

class Shape {
  constructor(name) {
    this.name = name;
  }

  calculateArea() {
    throw new Error("calculateArea must be implemented by subclass");
  }

  calculatePerimeter() {
    throw new Error("calculatePerimeter must be implemented by subclass");
  }

  getShapeType() {
    return this.name;
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    // Your code here
  }

  calculateArea() {
    // Your code here
  }

  calculatePerimeter() {
    // Your code here
  }

  getShapeInfo() {
    // Your code here
    // Return detailed shape information
  }
}

class Circle extends Shape {
  constructor(radius) {
    // Your code here
  }

  calculateArea() {
    // Your code here
  }

  calculatePerimeter() {
    // Your code here
  }

  getShapeInfo() {
    // Your code here
  }
}

class Triangle extends Shape {
  constructor(side1, side2, side3) {
    // Your code here
  }

  calculateArea() {
    // Your code here
    // Use Heron's formula
  }

  calculatePerimeter() {
    // Your code here
  }

  getShapeInfo() {
    // Your code here
  }
}

class ShapeCalculator {
  constructor() {
    this.shapes = [];
  }

  addShape(shape) {
    // Your code here
  }

  calculateTotalArea() {
    // Your code here
    // Use polymorphism to calculate total area of all shapes
  }

  calculateTotalPerimeter() {
    // Your code here
    // Use polymorphism to calculate total perimeter of all shapes
  }

  getShapeReport() {
    // Your code here
    // Generate report for all shapes using polymorphism
  }
}

// Test shape calculator
const calculator = new ShapeCalculator();

calculator.addShape(new Rectangle(5, 10));
calculator.addShape(new Circle(7));
calculator.addShape(new Triangle(3, 4, 5));

console.log("Shape Calculator Report:");
console.log(calculator.getShapeReport());
console.log("Total Area:", calculator.calculateTotalArea());
console.log("Total Perimeter:", calculator.calculateTotalPerimeter());

// PART 4: Method Resolution and Super
console.log("\nPART 4: Method Resolution and Super");

/*
 * TODO 4.1: Create a complex inheritance chain with super usage
 */

class Vehicle {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    return `${this.make} ${this.model} engine started`;
  }

  stop() {
    this.isRunning = false;
    return `${this.make} ${this.model} engine stopped`;
  }

  getStatus() {
    return `${this.make} ${this.model} (${this.year}) - ${
      this.isRunning ? "Running" : "Stopped"
    }`;
  }
}

class MotorVehicle extends Vehicle {
  constructor(make, model, year, fuelType, engineSize) {
    // Your code here
    // Call super and set additional properties
  }

  start() {
    // Your code here
    // Call super.start() and add motor vehicle specific startup
  }

  refuel() {
    // Your code here
    // Return refueling message
  }

  getStatus() {
    // Your code here
    // Call super.getStatus() and add fuel and engine info
  }
}

class Car extends MotorVehicle {
  constructor(make, model, year, fuelType, engineSize, doors) {
    // Your code here
  }

  start() {
    // Your code here
    // Call super.start() and add car-specific startup
  }

  openTrunk() {
    // Your code here
  }

  lockDoors() {
    // Your code here
  }

  getStatus() {
    // Your code here
    // Call super.getStatus() and add door count
  }
}

class ElectricCar extends Car {
  constructor(make, model, year, batteryCapacity, range, doors) {
    // Your code here
    // Call super with "Electric" as fuel type and 0 as engine size
  }

  start() {
    // Your code here
    // Override with electric car specific startup
  }

  charge() {
    // Your code here
    // Return charging message
  }

  // Override refuel method
  refuel() {
    // Your code here
    // Return message that electric cars don't use fuel
  }

  getStatus() {
    // Your code here
    // Call super.getStatus() and add battery and range info
  }
}

// Test complex inheritance with super
const regularCar = new Car("Honda", "Civic", 2022, "Gasoline", "2.0L", 4);
const electricCar = new ElectricCar(
  "Tesla",
  "Model 3",
  2023,
  "75kWh",
  "300 miles",
  4
);

console.log("Regular car start:", regularCar.start());
console.log("Regular car status:", regularCar.getStatus());
console.log("Regular car refuel:", regularCar.refuel());

console.log("Electric car start:", electricCar.start());
console.log("Electric car status:", electricCar.getStatus());
console.log("Electric car charge:", electricCar.charge());
console.log("Electric car refuel attempt:", electricCar.refuel());

// PART 5: Multiple Inheritance Simulation (Mixins)
console.log("\nPART 5: Multiple Inheritance Simulation");

/*
 * TODO 5.1: Create mixins for multiple inheritance
 */

// Mixin for flying capability
const FlyingMixin = {
  fly() {
    return `${this.name} is flying at ${this.altitude || 1000} feet`;
  },

  setAltitude(altitude) {
    this.altitude = altitude;
    return `${this.name} is now flying at ${altitude} feet`;
  },

  land() {
    this.altitude = 0;
    return `${this.name} has landed`;
  }
};

// Mixin for swimming capability
const SwimmingMixin = {
  swim() {
    return `${this.name} is swimming at ${this.depth || 5} feet deep`;
  },

  setDepth(depth) {
    this.depth = depth;
    return `${this.name} is now swimming at ${depth} feet deep`;
  },

  surface() {
    this.depth = 0;
    return `${this.name} has surfaced`;
  }
};

// Utility function to apply mixins
function applyMixin(targetClass, mixin) {
  // Your code here
  // Copy all methods from mixin to target class prototype
}

// Utility function to apply multiple mixins
function applyMixins(targetClass, ...mixins) {
  // Your code here
  // Apply all mixins to the target class
}

/*
 * TODO 5.2: Create classes that use multiple mixins
 */

class Duck extends Bird {
  constructor(name, age, wingSpan, species) {
    // Your code here
  }

  // Override makeSound
  makeSound() {
    return `${this.name} quacks loudly`;
  }

  // Duck can both fly and swim
}

class Penguin extends Bird {
  constructor(name, age, wingSpan, species) {
    // Your code here
  }

  // Override makeSound
  makeSound() {
    return `${this.name} makes penguin sounds`;
  }

  // Override fly (penguins can't fly)
  fly() {
    return `${this.name} cannot fly, but waddles instead`;
  }

  // Penguins can swim
}

class FlyingFish extends Animal {
  constructor(name, age, species) {
    // Your code here
  }

  // Override makeSound
  makeSound() {
    return `${this.name} makes fish sounds`;
  }

  // Flying fish can both fly and swim
}

// Apply mixins to classes
applyMixins(Duck, FlyingMixin, SwimmingMixin);
applyMixin(Penguin, SwimmingMixin);
applyMixins(FlyingFish, FlyingMixin, SwimmingMixin);

// Test multiple inheritance simulation
const duck = new Duck("Donald", 3, "12 inches", "Mallard");
const penguin = new Penguin("Pingu", 5, "18 inches", "Emperor");
const flyingFish = new FlyingFish("Nemo", 1, "Flying Fish");

console.log("Duck:", duck.getInfo());
console.log("Duck fly:", duck.fly());
console.log("Duck swim:", duck.swim());

console.log("Penguin:", penguin.getInfo());
console.log("Penguin fly:", penguin.fly());
console.log("Penguin swim:", penguin.swim());

console.log("Flying Fish:", flyingFish.getInfo());
console.log("Flying Fish fly:", flyingFish.fly());
console.log("Flying Fish swim:", flyingFish.swim());

// BONUS CHALLENGES
console.log("\n=== BONUS CHALLENGES ===");

/*
 * BONUS 1: Create a game character system with complex inheritance
 */

class GameCharacter {
  constructor(name, level, health, mana) {
    // Your code here
  }

  attack(target) {
    // Your code here
    // Basic attack implementation
  }

  takeDamage(damage) {
    // Your code here
    // Reduce health, check if character is defeated
  }

  levelUp() {
    // Your code here
    // Increase level, health, and mana
  }

  getStats() {
    // Your code here
    // Return character statistics
  }
}

class Warrior extends GameCharacter {
  constructor(name, level, health, mana, strength) {
    // Your code here
  }

  // Override attack with warrior-specific damage
  attack(target) {
    // Your code here
    // Higher physical damage based on strength
  }

  // Warrior special ability
  powerStrike(target) {
    // Your code here
    // High damage attack with cooldown
  }
}

class Mage extends GameCharacter {
  constructor(name, level, health, mana, intelligence) {
    // Your code here
  }

  // Override attack with mage-specific magic damage
  attack(target) {
    // Your code here
    // Magic damage based on intelligence, costs mana
  }

  // Mage special ability
  fireball(target) {
    // Your code here
    // High magic damage, high mana cost
  }

  // Mage utility
  heal(target) {
    // Your code here
    // Restore health to target, costs mana
  }
}

// Create combat system
class CombatSystem {
  constructor() {
    this.characters = [];
  }

  addCharacter(character) {
    // Your code here
  }

  simulateBattle(char1, char2) {
    // Your code here
    // Simulate turn-based combat
  }
}

/*
 * BONUS 2: Implement a plugin system using inheritance and composition
 */

class Plugin {
  constructor(name, version) {
    this.name = name;
    this.version = version;
    this.enabled = false;
  }

  enable() {
    this.enabled = true;
    return `Plugin ${this.name} enabled`;
  }

  disable() {
    this.enabled = false;
    return `Plugin ${this.name} disabled`;
  }

  execute() {
    throw new Error("execute method must be implemented by plugin");
  }
}

class AudioPlugin extends Plugin {
  constructor(name, version, audioFormat) {
    // Your code here
  }

  execute() {
    // Your code here
    // Audio processing logic
  }
}

class VideoPlugin extends Plugin {
  constructor(name, version, videoFormat) {
    // Your code here
  }

  execute() {
    // Your code here
    // Video processing logic
  }
}

class PluginManager {
  constructor() {
    this.plugins = new Map();
  }

  registerPlugin(plugin) {
    // Your code here
  }

  enablePlugin(name) {
    // Your code here
  }

  executePlugin(name, data) {
    // Your code here
  }

  getPluginInfo() {
    // Your code here
  }
}

console.log("\n=== Exercise 4 Complete! ===");

/*
 * SELF-CHECK QUESTIONS:
 * 1. What is the difference between inheritance and composition?
 * 2. How does polymorphism enable code reusability and flexibility?
 * 3. When should you use the 'super' keyword and when should you avoid it?
 * 4. What are the pros and cons of deep inheritance chains?
 * 5. How can you simulate multiple inheritance in JavaScript?
 * 6. What is method resolution order and how does it work in JavaScript?
 * 7. How do mixins differ from traditional inheritance?
 * 8. What are some alternatives to inheritance for code reuse?
 */
