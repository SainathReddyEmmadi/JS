# Inheritance and Polymorphism in JavaScript

## Table of Contents

1. [Introduction to Inheritance](#introduction-to-inheritance)
2. [Class Inheritance with extends](#class-inheritance-with-extends)
3. [The super Keyword](#the-super-keyword)
4. [Method Overriding](#method-overriding)
5. [Polymorphism Concepts](#polymorphism-concepts)
6. [Abstract Classes and Methods](#abstract-classes-and-methods)
7. [Multiple Inheritance Patterns](#multiple-inheritance-patterns)
8. [Composition vs Inheritance](#composition-vs-inheritance)
9. [Real-World Examples](#real-world-examples)
10. [Best Practices](#best-practices)
11. [Common Pitfalls](#common-pitfalls)
12. [Self-Check Questions](#self-check-questions)
13. [Practice Exercises](#practice-exercises)

## Introduction to Inheritance

Inheritance is a fundamental concept in OOP that allows one class to inherit properties and methods from another class. This promotes code reuse and establishes a hierarchical relationship between classes.

### Why Use Inheritance?

```javascript
// Without inheritance - code duplication
class Dog {
  constructor(name, age) {
    this.name = name;
    this.age = age;
    this.species = "Canis lupus";
  }

  eat() {
    console.log(`${this.name} is eating`);
  }

  sleep() {
    console.log(`${this.name} is sleeping`);
  }

  bark() {
    console.log(`${this.name} says woof!`);
  }
}

class Cat {
  constructor(name, age) {
    this.name = name;
    this.age = age;
    this.species = "Felis catus";
  }

  eat() {
    console.log(`${this.name} is eating`);
  }

  sleep() {
    console.log(`${this.name} is sleeping`);
  }

  meow() {
    console.log(`${this.name} says meow!`);
  }
}

// With inheritance - DRY principle
class Animal {
  constructor(name, age, species) {
    this.name = name;
    this.age = age;
    this.species = species;
  }

  eat() {
    console.log(`${this.name} is eating`);
  }

  sleep() {
    console.log(`${this.name} is sleeping`);
  }
}

class Dog extends Animal {
  constructor(name, age) {
    super(name, age, "Canis lupus");
  }

  bark() {
    console.log(`${this.name} says woof!`);
  }
}

class Cat extends Animal {
  constructor(name, age) {
    super(name, age, "Felis catus");
  }

  meow() {
    console.log(`${this.name} says meow!`);
  }
}
```

## Class Inheritance with extends

The `extends` keyword creates a class that inherits from another class.

### Basic Inheritance

```javascript
class Vehicle {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    console.log(`${this.make} ${this.model} is starting...`);
  }

  stop() {
    this.isRunning = false;
    console.log(`${this.make} ${this.model} has stopped.`);
  }

  getInfo() {
    return `${this.year} ${this.make} ${this.model}`;
  }
}

class Car extends Vehicle {
  constructor(make, model, year, doors) {
    super(make, model, year); // Call parent constructor
    this.doors = doors;
    this.fuel = 100;
  }

  honk() {
    console.log(`${this.getInfo()} goes beep beep!`);
  }

  drive(distance) {
    if (!this.isRunning) {
      console.log("Please start the car first!");
      return;
    }

    const fuelUsed = distance * 0.1;
    if (this.fuel >= fuelUsed) {
      this.fuel -= fuelUsed;
      console.log(`Drove ${distance} miles. Fuel remaining: ${this.fuel}%`);
    } else {
      console.log("Not enough fuel!");
    }
  }
}

const myCar = new Car("Toyota", "Camry", 2023, 4);
console.log(myCar.getInfo()); // "2023 Toyota Camry"
myCar.start(); // "Toyota Camry is starting..."
myCar.honk(); // "2023 Toyota Camry goes beep beep!"
myCar.drive(50); // "Drove 50 miles. Fuel remaining: 95%"
```

### Multi-Level Inheritance

```javascript
class LivingThing {
  constructor(name) {
    this.name = name;
    this.alive = true;
  }

  grow() {
    console.log(`${this.name} is growing`);
  }

  die() {
    this.alive = false;
    console.log(`${this.name} has died`);
  }
}

class Animal extends LivingThing {
  constructor(name, species) {
    super(name);
    this.species = species;
  }

  move() {
    console.log(`${this.name} is moving`);
  }

  eat() {
    console.log(`${this.name} is eating`);
  }
}

class Mammal extends Animal {
  constructor(name, species, furColor) {
    super(name, species);
    this.furColor = furColor;
    this.warmBlooded = true;
  }

  feedMilk() {
    console.log(`${this.name} is feeding milk to offspring`);
  }
}

class Dog extends Mammal {
  constructor(name, breed, furColor) {
    super(name, "Canis lupus", furColor);
    this.breed = breed;
  }

  bark() {
    console.log(`${this.name} the ${this.breed} barks!`);
  }

  wagTail() {
    console.log(`${this.name} is wagging tail happily`);
  }
}

const myDog = new Dog("Buddy", "Golden Retriever", "golden");
myDog.grow(); // From LivingThing
myDog.move(); // From Animal
myDog.feedMilk(); // From Mammal
myDog.bark(); // From Dog
```

## The super Keyword

The `super` keyword is used to access and call functions on an object's parent class.

### Calling Parent Constructor

```javascript
class Employee {
  constructor(name, id, department) {
    this.name = name;
    this.id = id;
    this.department = department;
    this.startDate = new Date();
  }

  getDetails() {
    return `${this.name} (ID: ${this.id}) - ${this.department}`;
  }

  calculateYearsOfService() {
    const currentDate = new Date();
    return currentDate.getFullYear() - this.startDate.getFullYear();
  }
}

class Manager extends Employee {
  constructor(name, id, department, teamSize) {
    super(name, id, department); // Must be called before using 'this'
    this.teamSize = teamSize;
    this.directReports = [];
  }

  addDirectReport(employee) {
    this.directReports.push(employee);
    console.log(`${employee.name} now reports to ${this.name}`);
  }

  getTeamInfo() {
    return `Manager: ${super.getDetails()}, Team Size: ${this.teamSize}`;
  }
}

const manager = new Manager("Alice Johnson", "M001", "Engineering", 5);
const developer = new Employee("Bob Smith", "E001", "Engineering");

manager.addDirectReport(developer);
console.log(manager.getTeamInfo());
```

### Calling Parent Methods

```javascript
class Shape {
  constructor(color) {
    this.color = color;
  }

  describe() {
    return `A ${this.color} shape`;
  }

  getArea() {
    throw new Error("getArea method must be implemented by subclass");
  }
}

class Rectangle extends Shape {
  constructor(color, width, height) {
    super(color);
    this.width = width;
    this.height = height;
  }

  describe() {
    const baseDescription = super.describe(); // Call parent method
    return `${baseDescription} with dimensions ${this.width}x${this.height}`;
  }

  getArea() {
    return this.width * this.height;
  }
}

class Square extends Rectangle {
  constructor(color, size) {
    super(color, size, size); // Call Rectangle constructor
  }

  describe() {
    const parentDescription = super.describe();
    return `${parentDescription} (Square)`;
  }
}

const square = new Square("red", 5);
console.log(square.describe()); // "A red shape with dimensions 5x5 (Square)"
console.log(square.getArea()); // 25
```

## Method Overriding

Method overriding allows a child class to provide a specific implementation of a method that is already defined in its parent class.

### Basic Method Overriding

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  makeSound() {
    console.log(`${this.name} makes a sound`);
  }

  move() {
    console.log(`${this.name} moves around`);
  }
}

class Bird extends Animal {
  constructor(name, wingspan) {
    super(name);
    this.wingspan = wingspan;
  }

  // Override parent method
  makeSound() {
    console.log(`${this.name} chirps beautifully`);
  }

  // Override parent method
  move() {
    console.log(`${this.name} flies with a ${this.wingspan}cm wingspan`);
  }

  // New method specific to Bird
  migrate() {
    console.log(`${this.name} is migrating south for winter`);
  }
}

class Fish extends Animal {
  constructor(name, depth) {
    super(name);
    this.depth = depth;
  }

  // Override parent method
  makeSound() {
    console.log(`${this.name} makes bubbles`);
  }

  // Override parent method
  move() {
    console.log(`${this.name} swims at ${this.depth}m depth`);
  }

  // New method specific to Fish
  swim() {
    console.log(`${this.name} swims gracefully through the water`);
  }
}

const bird = new Bird("Robin", 25);
const fish = new Fish("Goldfish", 2);

bird.makeSound(); // "Robin chirps beautifully"
bird.move(); // "Robin flies with a 25cm wingspan"

fish.makeSound(); // "Goldfish makes bubbles"
fish.move(); // "Goldfish swims at 2m depth"
```

### Calling Parent Method in Override

```javascript
class Logger {
  log(message) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }
}

class FileLogger extends Logger {
  constructor(filename) {
    super();
    this.filename = filename;
    this.logs = [];
  }

  log(message) {
    // Call parent method first
    super.log(message);

    // Then add file-specific logic
    this.logs.push({
      timestamp: new Date(),
      message: message
    });

    console.log(`Message saved to ${this.filename}`);
  }

  saveLogs() {
    console.log(`Saving ${this.logs.length} logs to ${this.filename}`);
    // In real implementation, would write to file
  }
}

class DatabaseLogger extends Logger {
  constructor(connectionString) {
    super();
    this.connectionString = connectionString;
  }

  log(message) {
    // Call parent method first
    super.log(message);

    // Then add database-specific logic
    console.log(`Message saved to database: ${this.connectionString}`);
  }
}

const fileLogger = new FileLogger("app.log");
const dbLogger = new DatabaseLogger("mongodb://localhost:27017/logs");

fileLogger.log("Application started");
dbLogger.log("User logged in");
```

## Polymorphism Concepts

Polymorphism allows objects of different types to be treated as objects of a common base type, while still maintaining their specific behaviors.

### Runtime Polymorphism

```javascript
class MediaPlayer {
  play() {
    throw new Error("play method must be implemented");
  }

  pause() {
    throw new Error("pause method must be implemented");
  }

  stop() {
    throw new Error("stop method must be implemented");
  }
}

class AudioPlayer extends MediaPlayer {
  constructor(audioFile) {
    super();
    this.audioFile = audioFile;
    this.position = 0;
  }

  play() {
    console.log(`Playing audio: ${this.audioFile}`);
    console.log("♪ ♫ ♪ ♫");
  }

  pause() {
    console.log(`Audio paused at ${this.position}s`);
  }

  stop() {
    this.position = 0;
    console.log("Audio stopped");
  }
}

class VideoPlayer extends MediaPlayer {
  constructor(videoFile) {
    super();
    this.videoFile = videoFile;
    this.position = 0;
  }

  play() {
    console.log(`Playing video: ${this.videoFile}`);
    console.log("📺 Video content playing...");
  }

  pause() {
    console.log(`Video paused at ${this.position}s`);
  }

  stop() {
    this.position = 0;
    console.log("Video stopped");
  }
}

class StreamingPlayer extends MediaPlayer {
  constructor(streamUrl) {
    super();
    this.streamUrl = streamUrl;
  }

  play() {
    console.log(`Streaming from: ${this.streamUrl}`);
    console.log("🌐 Live stream playing...");
  }

  pause() {
    console.log("Stream buffering...");
  }

  stop() {
    console.log("Stream disconnected");
  }
}

// Polymorphic usage
function operatePlayer(player) {
  console.log("--- Operating Media Player ---");
  player.play();
  setTimeout(() => {
    player.pause();
    setTimeout(() => {
      player.stop();
    }, 1000);
  }, 2000);
}

const players = [
  new AudioPlayer("song.mp3"),
  new VideoPlayer("movie.mp4"),
  new StreamingPlayer("https://live.example.com/stream")
];

// Same function works with different player types
players.forEach((player) => {
  operatePlayer(player);
  console.log(""); // Empty line for separation
});
```

### Interface-like Behavior

```javascript
class Drawable {
  draw() {
    throw new Error("draw method must be implemented");
  }

  getArea() {
    throw new Error("getArea method must be implemented");
  }
}

class Circle extends Drawable {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  draw() {
    console.log(`Drawing a circle with radius ${this.radius}`);
    console.log("   ⭕");
  }

  getArea() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Drawable {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  draw() {
    console.log(`Drawing a rectangle ${this.width}x${this.height}`);
    console.log("   ▭");
  }

  getArea() {
    return this.width * this.height;
  }
}

class Triangle extends Drawable {
  constructor(base, height) {
    super();
    this.base = base;
    this.height = height;
  }

  draw() {
    console.log(
      `Drawing a triangle with base ${this.base} and height ${this.height}`
    );
    console.log("   ▲");
  }

  getArea() {
    return (this.base * this.height) / 2;
  }
}

// Canvas class that works with any Drawable object
class Canvas {
  constructor() {
    this.shapes = [];
  }

  addShape(shape) {
    if (!(shape instanceof Drawable)) {
      throw new Error("Shape must be drawable");
    }
    this.shapes.push(shape);
  }

  render() {
    console.log("=== Rendering Canvas ===");
    this.shapes.forEach((shape, index) => {
      console.log(`Shape ${index + 1}:`);
      shape.draw();
      console.log(`Area: ${shape.getArea().toFixed(2)}`);
      console.log("");
    });
  }

  getTotalArea() {
    return this.shapes.reduce((total, shape) => total + shape.getArea(), 0);
  }
}

const canvas = new Canvas();
canvas.addShape(new Circle(5));
canvas.addShape(new Rectangle(4, 6));
canvas.addShape(new Triangle(3, 8));

canvas.render();
console.log(`Total area: ${canvas.getTotalArea().toFixed(2)}`);
```

## Abstract Classes and Methods

While JavaScript doesn't have built-in abstract classes, we can simulate them using conventions and error throwing.

### Abstract Base Class Pattern

```javascript
class AbstractVehicle {
  constructor(make, model) {
    // Prevent instantiation of abstract class
    if (this.constructor === AbstractVehicle) {
      throw new Error("Abstract class cannot be instantiated directly");
    }

    this.make = make;
    this.model = model;
    this.isRunning = false;
  }

  // Concrete method - can be used by all subclasses
  start() {
    if (this.isRunning) {
      console.log(`${this.make} ${this.model} is already running`);
      return;
    }

    this.isRunning = true;
    console.log(`${this.make} ${this.model} started`);
    this.onStart(); // Call abstract method
  }

  stop() {
    if (!this.isRunning) {
      console.log(`${this.make} ${this.model} is already stopped`);
      return;
    }

    this.isRunning = false;
    console.log(`${this.make} ${this.model} stopped`);
    this.onStop(); // Call abstract method
  }

  // Abstract methods - must be implemented by subclasses
  onStart() {
    throw new Error("onStart method must be implemented by subclass");
  }

  onStop() {
    throw new Error("onStop method must be implemented by subclass");
  }

  getMaxSpeed() {
    throw new Error("getMaxSpeed method must be implemented by subclass");
  }

  getFuelType() {
    throw new Error("getFuelType method must be implemented by subclass");
  }
}

class Car extends AbstractVehicle {
  constructor(make, model, doors) {
    super(make, model);
    this.doors = doors;
  }

  onStart() {
    console.log("Engine warming up...");
    console.log("All systems check complete");
  }

  onStop() {
    console.log("Engine cooling down...");
    console.log("Parking brake engaged");
  }

  getMaxSpeed() {
    return 180; // km/h
  }

  getFuelType() {
    return "Gasoline";
  }

  honk() {
    console.log("Beep beep!");
  }
}

class Motorcycle extends AbstractVehicle {
  constructor(make, model, type) {
    super(make, model);
    this.type = type; // sport, cruiser, touring, etc.
  }

  onStart() {
    console.log("Kickstand up!");
    console.log("Ready to ride!");
  }

  onStop() {
    console.log("Kickstand down");
    console.log("Helmet off");
  }

  getMaxSpeed() {
    return 250; // km/h
  }

  getFuelType() {
    return "Gasoline";
  }

  wheelie() {
    if (this.isRunning) {
      console.log("Popping a wheelie! 🏍️");
    } else {
      console.log("Start the motorcycle first!");
    }
  }
}

// This would throw an error:
// const vehicle = new AbstractVehicle('Generic', 'Vehicle');

const car = new Car("Toyota", "Camry", 4);
const bike = new Motorcycle("Harley", "Davidson", "cruiser");

car.start(); // Calls concrete start() which calls abstract onStart()
bike.start(); // Different implementation of onStart()

console.log(`Car max speed: ${car.getMaxSpeed()} km/h`);
console.log(`Bike max speed: ${bike.getMaxSpeed()} km/h`);
```

## Multiple Inheritance Patterns

JavaScript doesn't support multiple inheritance directly, but we can achieve similar functionality using mixins.

### Mixin Pattern

```javascript
// Mixin functions
const Flyable = {
  fly() {
    console.log(`${this.name} is flying through the sky!`);
  },

  land() {
    console.log(`${this.name} has landed safely`);
  },

  getAltitude() {
    return this.altitude || 0;
  }
};

const Swimmable = {
  swim() {
    console.log(`${this.name} is swimming in the water`);
  },

  dive(depth) {
    this.depth = depth;
    console.log(`${this.name} dives to ${depth} meters`);
  },

  surface() {
    console.log(`${this.name} surfaces from ${this.depth || 0} meters`);
    this.depth = 0;
  }
};

const Walkable = {
  walk() {
    console.log(`${this.name} is walking on land`);
  },

  run() {
    console.log(`${this.name} is running fast!`);
  },

  jump() {
    console.log(`${this.name} jumps high into the air`);
  }
};

// Utility function to apply mixins
function applyMixins(targetClass, ...mixins) {
  mixins.forEach((mixin) => {
    Object.getOwnPropertyNames(mixin).forEach((name) => {
      if (name !== "constructor") {
        targetClass.prototype[name] = mixin[name];
      }
    });
  });
}

// Base Animal class
class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
  }

  eat() {
    console.log(`${this.name} is eating`);
  }

  sleep() {
    console.log(`${this.name} is sleeping`);
  }
}

// Duck - can fly, swim, and walk
class Duck extends Animal {
  constructor(name) {
    super(name, "Duck");
    this.altitude = 0;
    this.depth = 0;
  }

  quack() {
    console.log(`${this.name} says quack!`);
  }
}

// Apply multiple mixins to Duck
applyMixins(Duck, Flyable, Swimmable, Walkable);

// Fish - can only swim
class Fish extends Animal {
  constructor(name) {
    super(name, "Fish");
    this.depth = 0;
  }

  breatheUnderwater() {
    console.log(`${this.name} breathes through gills`);
  }
}

applyMixins(Fish, Swimmable);

// Bird - can fly and walk
class Bird extends Animal {
  constructor(name) {
    super(name, "Bird");
    this.altitude = 0;
  }

  chirp() {
    console.log(`${this.name} chirps melodiously`);
  }
}

applyMixins(Bird, Flyable, Walkable);

// Usage
const duck = new Duck("Donald");
const fish = new Fish("Nemo");
const bird = new Bird("Tweety");

console.log("=== Duck abilities ===");
duck.walk();
duck.swim();
duck.fly();
duck.quack();

console.log("\n=== Fish abilities ===");
fish.swim();
fish.dive(10);
fish.breatheUnderwater();
// fish.fly(); // This would cause an error - fish can't fly

console.log("\n=== Bird abilities ===");
bird.walk();
bird.fly();
bird.chirp();
// bird.swim(); // This would cause an error - this bird can't swim
```

### Advanced Mixin with Class Factories

```javascript
// Mixin factory functions
function Timestamped(BaseClass) {
  return class extends BaseClass {
    constructor(...args) {
      super(...args);
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }

    touch() {
      this.updatedAt = new Date();
      console.log(`${this.constructor.name} updated at ${this.updatedAt}`);
    }

    getAge() {
      return Date.now() - this.createdAt.getTime();
    }
  };
}

function Serializable(BaseClass) {
  return class extends BaseClass {
    toJSON() {
      const obj = {};
      for (let key in this) {
        if (this.hasOwnProperty(key) && typeof this[key] !== "function") {
          obj[key] = this[key];
        }
      }
      return obj;
    }

    toString() {
      return JSON.stringify(this.toJSON(), null, 2);
    }

    static fromJSON(json) {
      const data = typeof json === "string" ? JSON.parse(json) : json;
      return new this(...Object.values(data));
    }
  };
}

function Validatable(BaseClass) {
  return class extends BaseClass {
    constructor(...args) {
      super(...args);
      this.errors = [];
    }

    validate() {
      this.errors = [];
      this.performValidation();
      return this.errors.length === 0;
    }

    performValidation() {
      // To be overridden by subclasses
      console.log("No validation rules defined");
    }

    addError(field, message) {
      this.errors.push({ field, message });
    }

    getErrors() {
      return [...this.errors];
    }
  };
}

// Base class
class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  getInfo() {
    return `User: ${this.username} (${this.email})`;
  }
}

// Apply multiple mixins using composition
class EnhancedUser extends Validatable(Serializable(Timestamped(User))) {
  constructor(username, email) {
    super(username, email);
  }

  performValidation() {
    if (!this.username || this.username.length < 3) {
      this.addError("username", "Username must be at least 3 characters");
    }

    if (!this.email || !this.email.includes("@")) {
      this.addError("email", "Email must be valid");
    }
  }
}

// Usage
const user = new EnhancedUser("john_doe", "john@example.com");

console.log(user.getInfo());
console.log("Is valid:", user.validate());

setTimeout(() => {
  user.touch();
  console.log("User age:", user.getAge(), "ms");
  console.log("User JSON:", user.toString());
}, 100);

// Try with invalid data
const invalidUser = new EnhancedUser("jo", "invalid-email");
console.log("Invalid user valid:", invalidUser.validate());
console.log("Errors:", invalidUser.getErrors());
```

## Composition vs Inheritance

Sometimes composition is a better choice than inheritance. Here's when to use each:

### When to Use Inheritance

```javascript
// Good use of inheritance - "is-a" relationship
class Vehicle {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }

  start() {
    console.log(`${this.make} ${this.model} started`);
  }
}

class Car extends Vehicle {
  // Car IS-A Vehicle
  constructor(make, model, doors) {
    super(make, model);
    this.doors = doors;
  }

  honk() {
    console.log("Beep beep!");
  }
}
```

### When to Use Composition

```javascript
// Better with composition - "has-a" relationship
class Engine {
  constructor(type, horsepower) {
    this.type = type;
    this.horsepower = horsepower;
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    console.log(`${this.type} engine started (${this.horsepower} HP)`);
  }

  stop() {
    this.isRunning = false;
    console.log(`${this.type} engine stopped`);
  }
}

class GPS {
  constructor() {
    this.currentLocation = { lat: 0, lng: 0 };
  }

  navigate(destination) {
    console.log(`Navigating to ${destination}`);
    return `Route calculated to ${destination}`;
  }

  updateLocation(lat, lng) {
    this.currentLocation = { lat, lng };
    console.log(`Location updated: ${lat}, ${lng}`);
  }
}

class Radio {
  constructor() {
    this.currentStation = 101.5;
    this.volume = 5;
  }

  changeStation(station) {
    this.currentStation = station;
    console.log(`Tuned to ${station} FM`);
  }

  setVolume(level) {
    this.volume = Math.max(0, Math.min(10, level));
    console.log(`Volume set to ${this.volume}`);
  }
}

// Car HAS-AN engine, GPS, and radio (composition)
class ModernCar {
  constructor(make, model) {
    this.make = make;
    this.model = model;

    // Composition - car HAS these components
    this.engine = new Engine("V6", 300);
    this.gps = new GPS();
    this.radio = new Radio();
  }

  start() {
    console.log(`Starting ${this.make} ${this.model}`);
    this.engine.start();
  }

  stop() {
    console.log(`Stopping ${this.make} ${this.model}`);
    this.engine.stop();
  }

  navigateTo(destination) {
    return this.gps.navigate(destination);
  }

  tuneRadio(station) {
    this.radio.changeStation(station);
  }

  // Delegate methods to composed objects
  setVolume(level) {
    this.radio.setVolume(level);
  }

  updateLocation(lat, lng) {
    this.gps.updateLocation(lat, lng);
  }
}

const car = new ModernCar("BMW", "X5");
car.start();
car.navigateTo("Downtown");
car.tuneRadio(105.7);
car.setVolume(8);
```

## Real-World Examples

### E-commerce System

```javascript
class Product {
  constructor(id, name, price, category) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.category = category;
    this.createdAt = new Date();
  }

  getInfo() {
    return `${this.name} - $${this.price}`;
  }

  calculateTotal(quantity = 1) {
    return this.price * quantity;
  }

  isAvailable() {
    return true; // Base implementation
  }
}

class PhysicalProduct extends Product {
  constructor(id, name, price, category, weight, dimensions) {
    super(id, name, price, category);
    this.weight = weight;
    this.dimensions = dimensions;
    this.stock = 0;
  }

  updateStock(quantity) {
    this.stock = Math.max(0, this.stock + quantity);
    console.log(`${this.name} stock updated: ${this.stock} units`);
  }

  isAvailable() {
    return this.stock > 0;
  }

  calculateShipping() {
    const baseRate = 5.99;
    const weightMultiplier = this.weight * 0.5;
    return baseRate + weightMultiplier;
  }
}

class DigitalProduct extends Product {
  constructor(id, name, price, category, downloadUrl, fileSize) {
    super(id, name, price, category);
    this.downloadUrl = downloadUrl;
    this.fileSize = fileSize;
    this.downloadCount = 0;
  }

  isAvailable() {
    return true; // Digital products are always available
  }

  download() {
    this.downloadCount++;
    console.log(`Downloading ${this.name}... (${this.fileSize}MB)`);
    return this.downloadUrl;
  }

  calculateTotal(quantity = 1) {
    // Digital products might have volume discounts
    const baseTotal = super.calculateTotal(quantity);
    if (quantity >= 10) {
      return baseTotal * 0.8; // 20% discount for bulk
    }
    return baseTotal;
  }
}

class SubscriptionProduct extends Product {
  constructor(id, name, monthlyPrice, category, features) {
    super(id, name, monthlyPrice, category);
    this.features = features;
    this.subscribers = 0;
  }

  calculateTotal(months = 1) {
    const monthlyTotal = super.calculateTotal(months);

    // Discount for longer subscriptions
    if (months >= 12) {
      return monthlyTotal * 0.7; // 30% discount for annual
    } else if (months >= 6) {
      return monthlyTotal * 0.85; // 15% discount for semi-annual
    }

    return monthlyTotal;
  }

  addSubscriber() {
    this.subscribers++;
    console.log(`New subscriber! Total: ${this.subscribers}`);
  }

  getFeatures() {
    return this.features.join(", ");
  }

  isAvailable() {
    return true; // Subscriptions are always available
  }
}

// Usage
const products = [
  new PhysicalProduct("P001", "Laptop", 999, "Electronics", 2.5, "30x20x2cm"),
  new DigitalProduct(
    "D001",
    "E-book",
    19.99,
    "Books",
    "https://download.link",
    5
  ),
  new SubscriptionProduct("S001", "Premium Service", 29.99, "Software", [
    "Advanced Analytics",
    "Priority Support",
    "API Access"
  ])
];

// Physical product
const laptop = products[0];
laptop.updateStock(50);
console.log(`${laptop.getInfo()} - Available: ${laptop.isAvailable()}`);
console.log(`Shipping cost: $${laptop.calculateShipping()}`);

// Digital product
const ebook = products[1];
console.log(`${ebook.getInfo()} - Available: ${ebook.isAvailable()}`);
console.log(`Bulk price (10 copies): $${ebook.calculateTotal(10)}`);

// Subscription product
const subscription = products[2];
console.log(
  `${subscription.getInfo()} - Available: ${subscription.isAvailable()}`
);
console.log(`Annual price: $${subscription.calculateTotal(12)}`);
console.log(`Features: ${subscription.getFeatures()}`);
```

## Best Practices

### 1. Prefer Composition Over Inheritance

```javascript
// Instead of deep inheritance hierarchies
class FlyingCar extends Car {
  // Inherits all car behavior but may not need it all
}

// Use composition
class Vehicle {
  constructor(engine, controls) {
    this.engine = engine;
    this.controls = controls;
    this.capabilities = [];
  }

  addCapability(capability) {
    this.capabilities.push(capability);
  }

  can(action) {
    return this.capabilities.some((cap) => cap.canPerform(action));
  }
}

class FlyingCapability {
  canPerform(action) {
    return ["fly", "takeoff", "land"].includes(action);
  }
}

class DrivingCapability {
  canPerform(action) {
    return ["drive", "park", "reverse"].includes(action);
  }
}
```

### 2. Use Abstract Base Classes for Interfaces

```javascript
class PaymentProcessor {
  constructor() {
    if (this.constructor === PaymentProcessor) {
      throw new Error("PaymentProcessor is abstract");
    }
  }

  processPayment(amount) {
    this.validateAmount(amount);
    return this.executePayment(amount);
  }

  validateAmount(amount) {
    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }
  }

  // Abstract method
  executePayment(amount) {
    throw new Error("executePayment must be implemented");
  }
}

class CreditCardProcessor extends PaymentProcessor {
  executePayment(amount) {
    console.log(`Processing $${amount} via credit card`);
    return { success: true, transactionId: "CC123" };
  }
}

class PayPalProcessor extends PaymentProcessor {
  executePayment(amount) {
    console.log(`Processing $${amount} via PayPal`);
    return { success: true, transactionId: "PP456" };
  }
}
```

### 3. Document Class Hierarchies

```javascript
/**
 * Base class for all geometric shapes
 * Provides common interface for area calculation and drawing
 *
 * @abstract
 */
class Shape {
  /**
   * Calculate the area of the shape
   * @abstract
   * @returns {number} The area in square units
   */
  getArea() {
    throw new Error("getArea must be implemented by subclass");
  }

  /**
   * Draw the shape to console
   * @abstract
   */
  draw() {
    throw new Error("draw must be implemented by subclass");
  }
}

/**
 * Represents a circle shape
 * @extends Shape
 */
class Circle extends Shape {
  /**
   * Create a circle
   * @param {number} radius - The radius of the circle
   */
  constructor(radius) {
    super();
    this.radius = radius;
  }

  /**
   * Calculate the area of the circle
   * @returns {number} The area (π * r²)
   */
  getArea() {
    return Math.PI * this.radius ** 2;
  }

  /**
   * Draw the circle to console
   */
  draw() {
    console.log(`○ Circle with radius ${this.radius}`);
  }
}
```

## Common Pitfalls

### 1. Deep Inheritance Hierarchies

```javascript
// Avoid - too many levels of inheritance
class LivingThing {}
class Animal extends LivingThing {}
class Mammal extends Animal {}
class Primate extends Mammal {}
class Human extends Primate {}
class Developer extends Human {} // Getting too specific!

// Better - use composition for specific behaviors
class Human {
  constructor(name, skills = []) {
    this.name = name;
    this.skills = skills;
  }

  addSkill(skill) {
    this.skills.push(skill);
  }

  hasSkill(skillName) {
    return this.skills.some((skill) => skill.name === skillName);
  }
}

class Skill {
  constructor(name, level) {
    this.name = name;
    this.level = level;
  }
}

const developer = new Human("John", [
  new Skill("JavaScript", "Expert"),
  new Skill("Python", "Intermediate")
]);
```

### 2. Improper Use of super()

```javascript
// Wrong - calling super() after using this
class Child extends Parent {
  constructor(name) {
    this.name = name; // Error! Cannot use 'this' before super()
    super();
  }
}

// Correct - call super() first
class Child extends Parent {
  constructor(name) {
    super(); // Call parent constructor first
    this.name = name; // Now safe to use 'this'
  }
}
```

### 3. Forgetting to Override Abstract Methods

```javascript
class AbstractShape {
  getArea() {
    throw new Error("getArea must be implemented");
  }
}

class Circle extends AbstractShape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  // Forgot to implement getArea()!
}

const circle = new Circle(5);
// circle.getArea(); // Error: getArea must be implemented
```

## Self-Check Questions

1. What is the difference between inheritance and composition?
2. When should you use the `extends` keyword?
3. What does the `super` keyword do?
4. How do you prevent a class from being instantiated directly?
5. What is method overriding?
6. How can you achieve multiple inheritance in JavaScript?
7. What are the benefits and drawbacks of deep inheritance hierarchies?
8. How do mixins work in JavaScript?
9. When should you prefer composition over inheritance?
10. What is polymorphism and how does it work in JavaScript?

## Practice Exercises

### Exercise 1: University System

Create a hierarchy for a university system:

```javascript
// Base Person class
class Person {
  // Properties: name, age, email
  // Methods: getInfo(), updateEmail()
}

// Student class extends Person
class Student {
  // Additional properties: studentId, major, gpa
  // Methods: enroll(course), calculateGPA(), graduate()
}

// Faculty class extends Person
class Faculty {
  // Additional properties: facultyId, department, salary
  // Methods: teach(course), research(topic), getTeachingLoad()
}

// GraduateStudent extends Student
class GraduateStudent {
  // Additional properties: advisor, thesis
  // Methods: defendThesis(), publish(paper)
}

// Test your implementation
const student = new Student(
  "John Doe",
  20,
  "john@university.edu",
  "S001",
  "Computer Science"
);
const faculty = new Faculty(
  "Dr. Smith",
  45,
  "smith@university.edu",
  "F001",
  "Computer Science",
  75000
);
const gradStudent = new GraduateStudent(
  "Jane Doe",
  25,
  "jane@university.edu",
  "G001",
  "Computer Science"
);

// All should have access to Person methods
console.log(student.getInfo());
console.log(faculty.getInfo());
console.log(gradStudent.getInfo());
```

### Exercise 2: Media Library System

Create a polymorphic media system:

```javascript
// Abstract Media class
class Media {
  // Properties: title, duration, genre
  // Abstract methods: play(), pause(), stop()
  // Concrete methods: getInfo(), isPlaying()
}

// Video class extends Media
class Video {
  // Additional properties: resolution, frameRate
  // Implement abstract methods with video-specific behavior
  // Additional methods: changeQuality(), enableSubtitles()
}

// Audio class extends Media
class Audio {
  // Additional properties: bitrate, artist
  // Implement abstract methods with audio-specific behavior
  // Additional methods: adjustVolume(), showLyrics()
}

// Podcast class extends Audio
class Podcast {
  // Additional properties: host, episode
  // Override methods as needed
  // Additional methods: skipAd(), subscribe()
}

// MediaPlayer class that works with any Media
class MediaPlayer {
  // Methods: loadMedia(media), playAll(mediaList), shuffle(mediaList)
}

// Test polymorphic behavior
const mediaPlayer = new MediaPlayer();
const playlist = [
  new Video("Movie", 7200, "Action", "4K", 60),
  new Audio("Song", 240, "Rock", 320, "The Beatles"),
  new Podcast("Tech Talk", 3600, "Technology", 128, "John Host", "Episode 1")
];

mediaPlayer.playAll(playlist); // Should work with all media types
```

### Exercise 3: Game Character System

Create a flexible character system using composition and mixins:

```javascript
// Base Character class
class Character {
  // Properties: name, level, health, experience
  // Methods: levelUp(), takeDamage(), heal()
}

// Ability mixins
const MagicUser = {
  // Properties: mana, spells
  // Methods: castSpell(spellName), learnSpell(spell), restoreMana()
};

const Warrior = {
  // Properties: strength, armor
  // Methods: attack(target), block(), charge()
};

const Healer = {
  // Properties: healingPower
  // Methods: heal(target), revive(target), bless(target)
};

const Archer = {
  // Properties: accuracy, arrows
  // Methods: shoot(target), aim(), craftArrow()
};

// Character classes using multiple mixins
class Paladin extends Character {
  // Combines Warrior and Healer abilities
}

class Mage extends Character {
  // Uses MagicUser abilities
}

class Ranger extends Character {
  // Combines Archer and some Healer abilities
}

// Apply mixins and test
const paladin = new Paladin("Sir Lancelot");
const mage = new Mage("Gandalf");
const ranger = new Ranger("Legolas");

// Each should have their specific abilities
paladin.attack(mage);
paladin.heal(ranger);
mage.castSpell("Fireball");
ranger.shoot(mage);
```

---

**Next**: Continue with [05-encapsulation-abstraction.md](./05-encapsulation-abstraction.md) to learn about encapsulation and abstraction principles.
