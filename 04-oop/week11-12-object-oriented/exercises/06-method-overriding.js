/**
 * Exercise 6: Method Overriding and Super
 *
 * Master method overriding patterns and the proper use of super
 */

console.log("=== Exercise 6: Method Overriding and Super ===\n");

// PART 1: Basic Method Overriding
console.log("PART 1: Basic Method Overriding");

/*
 * TODO 1.1: Create a hierarchy with method overriding
 */

class MediaFile {
  constructor(filename, size, format) {
    this.filename = filename;
    this.size = size; // in bytes
    this.format = format;
    this.created = new Date();
  }

  play() {
    return `Playing ${this.filename}`;
  }

  getInfo() {
    return `${this.filename} (${this.format}) - ${this.formatSize()}`;
  }

  formatSize() {
    const units = ["B", "KB", "MB", "GB"];
    let size = this.size;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  download() {
    return `Downloading ${this.filename}...`;
  }
}

class AudioFile extends MediaFile {
  constructor(filename, size, format, duration, artist, album) {
    // Your code here
    // Call parent constructor and set audio-specific properties
  }

  // Override play method with audio-specific behavior
  play() {
    // Your code here
    // Return audio-specific play message with duration
  }

  // Override getInfo method
  getInfo() {
    // Your code here
    // Call parent getInfo and add audio-specific info
  }

  // Audio-specific method
  adjustVolume(level) {
    // Your code here
    // Return volume adjustment message
  }

  // Audio-specific method
  skipTo(seconds) {
    // Your code here
    // Return skip message with validation
  }
}

class VideoFile extends MediaFile {
  constructor(filename, size, format, duration, resolution, fps) {
    // Your code here
  }

  // Override play method with video-specific behavior
  play() {
    // Your code here
    // Return video-specific play message
  }

  // Override getInfo method
  getInfo() {
    // Your code here
    // Call parent getInfo and add video-specific info
  }

  // Video-specific method
  changeQuality(quality) {
    // Your code here
    // Return quality change message
  }

  // Video-specific method
  enableSubtitles(language) {
    // Your code here
  }
}

class ImageFile extends MediaFile {
  constructor(filename, size, format, width, height, colorDepth) {
    // Your code here
  }

  // Override play method (images don't "play")
  play() {
    // Your code here
    // Return image viewing message
  }

  // Override getInfo method
  getInfo() {
    // Your code here
    // Call parent getInfo and add image-specific info
  }

  // Image-specific method
  resize(newWidth, newHeight) {
    // Your code here
    // Return resize message
  }

  // Image-specific method
  applyFilter(filterName) {
    // Your code here
  }
}

// Test method overriding
const audio = new AudioFile(
  "song.mp3",
  5242880,
  "MP3",
  180,
  "Artist Name",
  "Album Name"
);
const video = new VideoFile(
  "movie.mp4",
  1073741824,
  "MP4",
  7200,
  "1920x1080",
  24
);
const image = new ImageFile("photo.jpg", 2097152, "JPEG", 1920, 1080, 24);

console.log("Audio:", audio.getInfo());
console.log("Audio play:", audio.play());
console.log("Audio volume:", audio.adjustVolume(75));

console.log("Video:", video.getInfo());
console.log("Video play:", video.play());
console.log("Video quality:", video.changeQuality("720p"));

console.log("Image:", image.getInfo());
console.log("Image play:", image.play());
console.log("Image resize:", image.resize(800, 600));

// PART 2: Super with Constructor Chaining
console.log("\nPART 2: Super with Constructor Chaining");

/*
 * TODO 2.1: Create a complex hierarchy with constructor chaining
 */

class Vehicle {
  constructor(make, model, year, vin) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.vin = vin;
    this.mileage = 0;
    this.isRunning = false;

    console.log(`Vehicle created: ${make} ${model}`);
  }

  start() {
    this.isRunning = true;
    return `${this.make} ${this.model} started`;
  }

  stop() {
    this.isRunning = false;
    return `${this.make} ${this.model} stopped`;
  }

  drive(miles) {
    if (!this.isRunning) {
      return "Vehicle must be started first";
    }
    this.mileage += miles;
    return `Drove ${miles} miles. Total mileage: ${this.mileage}`;
  }

  getStatus() {
    return {
      make: this.make,
      model: this.model,
      year: this.year,
      mileage: this.mileage,
      isRunning: this.isRunning
    };
  }
}

class MotorVehicle extends Vehicle {
  constructor(make, model, year, vin, engineType, fuelCapacity) {
    // Your code here
    // Call super and set motor vehicle properties
    console.log(`Motor vehicle created with ${engineType} engine`);
  }

  // Override start method
  start() {
    // Your code here
    // Call super.start() and add engine-specific startup
  }

  // Override stop method
  stop() {
    // Your code here
    // Add engine-specific shutdown, then call super.stop()
  }

  // Override drive method
  drive(miles) {
    // Your code here
    // Add fuel consumption logic, then call super.drive()
  }

  // Override getStatus method
  getStatus() {
    // Your code here
    // Call super.getStatus() and add motor vehicle info
  }

  refuel(gallons) {
    // Your code here
    // Add fuel with capacity validation
  }
}

class Car extends MotorVehicle {
  constructor(
    make,
    model,
    year,
    vin,
    engineType,
    fuelCapacity,
    doors,
    transmission
  ) {
    // Your code here
    console.log(
      `Car created with ${doors} doors and ${transmission} transmission`
    );
  }

  // Override start method
  start() {
    // Your code here
    // Add car-specific startup checks, then call super.start()
  }

  // Override drive method
  drive(miles) {
    // Your code here
    // Add car-specific driving behavior, then call super.drive()
  }

  // Override getStatus method
  getStatus() {
    // Your code here
    // Call super.getStatus() and add car-specific info
  }

  // Car-specific methods
  lockDoors() {
    // Your code here
  }

  unlockDoors() {
    // Your code here
  }

  openTrunk() {
    // Your code here
  }
}

class ElectricCar extends Car {
  constructor(
    make,
    model,
    year,
    vin,
    batteryCapacity,
    range,
    doors,
    transmission
  ) {
    // Your code here
    // Call super with "Electric" engine type and 0 fuel capacity
    console.log(`Electric car created with ${batteryCapacity}kWh battery`);
  }

  // Override start method
  start() {
    // Your code here
    // Electric cars start differently
  }

  // Override refuel method
  refuel(amount) {
    // Your code here
    // Electric cars don't use fuel
  }

  // Override drive method
  drive(miles) {
    // Your code here
    // Calculate battery usage and call appropriate parent method
  }

  // Override getStatus method
  getStatus() {
    // Your code here
    // Call super.getStatus() and add electric car info
  }

  // Electric car specific methods
  charge(kWh) {
    // Your code here
    // Charge the battery with capacity validation
  }

  enableRegenerativeBraking() {
    // Your code here
  }
}

// Test constructor chaining and method overriding
const electricCar = new ElectricCar(
  "Tesla",
  "Model 3",
  2023,
  "VIN123",
  75,
  300,
  4,
  "Automatic"
);

console.log("Electric car start:", electricCar.start());
console.log("Electric car drive:", electricCar.drive(50));
console.log("Electric car status:", electricCar.getStatus());
console.log("Electric car charge:", electricCar.charge(20));

// PART 3: Method Overriding with Different Signatures
console.log("\nPART 3: Method Overriding with Different Signatures");

/*
 * TODO 3.1: Create a logging system with different override patterns
 */

class Logger {
  constructor(name) {
    this.name = name;
    this.logs = [];
  }

  log(message, level = "INFO") {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] ${this.name}: ${message}`;
    this.logs.push(logEntry);
    console.log(logEntry);
  }

  getLogs() {
    return [...this.logs]; // Return copy
  }

  clearLogs() {
    this.logs = [];
  }
}

class FileLogger extends Logger {
  constructor(name, filename) {
    // Your code here
    // Call super and set filename
  }

  // Override log method with file writing simulation
  log(message, level = "INFO") {
    // Your code here
    // Call super.log() first, then simulate file writing
  }

  // Additional method for file operations
  saveToFile() {
    // Your code here
    // Simulate saving logs to file
  }
}

class DatabaseLogger extends Logger {
  constructor(name, connectionString) {
    // Your code here
  }

  // Override log method with database insertion simulation
  log(message, level = "INFO", category = "GENERAL") {
    // Your code here
    // Call super.log() and simulate database insertion
  }

  // Database-specific method
  queryLogs(filters) {
    // Your code here
    // Simulate database query
  }
}

class ConsoleLogger extends Logger {
  constructor(name, useColors = true) {
    // Your code here
  }

  // Override log method with colored output
  log(message, level = "INFO") {
    // Your code here
    // Add color coding based on level, then call super.log()
  }

  // Console-specific method
  logTable(data) {
    // Your code here
    // Log data in table format
  }
}

// Test different logger overrides
const fileLogger = new FileLogger("FileLogger", "app.log");
const dbLogger = new DatabaseLogger("DBLogger", "mongodb://localhost:27017");
const consoleLogger = new ConsoleLogger("ConsoleLogger", true);

fileLogger.log("File logger test", "INFO");
dbLogger.log("Database logger test", "ERROR", "DATABASE");
consoleLogger.log("Console logger test", "WARNING");

// PART 4: Template Method Pattern with Super
console.log("\nPART 4: Template Method Pattern with Super");

/*
 * TODO 4.1: Create a data processor with template method pattern
 */

class DataProcessor {
  constructor(name) {
    this.name = name;
    this.processed = false;
  }

  // Template method - defines the algorithm structure
  process(data) {
    console.log(`Starting ${this.name} processing...`);

    try {
      // Step 1: Validate data
      this.validateData(data);

      // Step 2: Transform data
      const transformed = this.transformData(data);

      // Step 3: Process data
      const result = this.processData(transformed);

      // Step 4: Save result
      this.saveResult(result);

      this.processed = true;
      console.log(`${this.name} processing completed successfully`);
      return result;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Steps to be overridden by subclasses
  validateData(data) {
    if (!data) {
      throw new Error("Data cannot be null or undefined");
    }
  }

  transformData(data) {
    // Default implementation - return data as is
    return data;
  }

  processData(data) {
    // Must be implemented by subclasses
    throw new Error("processData method must be implemented");
  }

  saveResult(result) {
    // Default implementation - just log
    console.log("Result saved:", result);
  }

  handleError(error) {
    console.error(`Error in ${this.name}:`, error.message);
  }
}

class JSONProcessor extends DataProcessor {
  constructor() {
    super("JSON Processor");
  }

  // Override validateData
  validateData(data) {
    // Your code here
    // Call super.validateData() then add JSON-specific validation
  }

  // Override transformData
  transformData(data) {
    // Your code here
    // Parse JSON string to object, call super if needed
  }

  // Implement required processData method
  processData(data) {
    // Your code here
    // Process the JSON data (e.g., format, filter, etc.)
  }

  // Override saveResult
  saveResult(result) {
    // Your code here
    // Call super.saveResult() and add JSON-specific saving
  }
}

class CSVProcessor extends DataProcessor {
  constructor(delimiter = ",") {
    // Your code here
  }

  // Override validateData
  validateData(data) {
    // Your code here
    // Call super.validateData() then add CSV-specific validation
  }

  // Override transformData
  transformData(data) {
    // Your code here
    // Parse CSV string to array of objects
  }

  // Implement required processData method
  processData(data) {
    // Your code here
    // Process the CSV data
  }

  // Override saveResult
  saveResult(result) {
    // Your code here
    // Call super.saveResult() and add CSV-specific saving
  }
}

class XMLProcessor extends DataProcessor {
  constructor() {
    super("XML Processor");
  }

  // Override validateData
  validateData(data) {
    // Your code here
    // Call super.validateData() then add XML-specific validation
  }

  // Override transformData
  transformData(data) {
    // Your code here
    // Parse XML string (simplified simulation)
  }

  // Implement required processData method
  processData(data) {
    // Your code here
    // Process the XML data
  }

  // Override handleError
  handleError(error) {
    // Your code here
    // Call super.handleError() and add XML-specific error handling
  }
}

// Test template method pattern
const jsonProcessor = new JSONProcessor();
const csvProcessor = new CSVProcessor(";");
const xmlProcessor = new XMLProcessor();

const jsonData = '{"name": "John", "age": 30, "city": "New York"}';
const csvData = "name;age;city\nJohn;30;New York\nJane;25;Boston";
const xmlData =
  "<person><name>John</name><age>30</age><city>New York</city></person>";

try {
  jsonProcessor.process(jsonData);
  csvProcessor.process(csvData);
  xmlProcessor.process(xmlData);
} catch (error) {
  console.log("Processing error:", error.message);
}

// PART 5: Advanced Super Usage Patterns
console.log("\nPART 5: Advanced Super Usage Patterns");

/*
 * TODO 5.1: Create a game character system with complex super usage
 */

class Character {
  constructor(name, health, mana, level) {
    this.name = name;
    this.maxHealth = health;
    this.health = health;
    this.maxMana = mana;
    this.mana = mana;
    this.level = level;
    this.experience = 0;
    this.alive = true;
  }

  attack(target) {
    const damage = this.calculateBaseDamage();
    console.log(`${this.name} attacks ${target.name} for ${damage} damage`);
    target.takeDamage(damage);
    return damage;
  }

  takeDamage(damage) {
    this.health = Math.max(0, this.health - damage);
    if (this.health === 0) {
      this.alive = false;
      console.log(`${this.name} has been defeated!`);
    }
    return this.health;
  }

  heal(amount) {
    const oldHealth = this.health;
    this.health = Math.min(this.maxHealth, this.health + amount);
    const healed = this.health - oldHealth;
    console.log(`${this.name} healed for ${healed} HP`);
    return healed;
  }

  calculateBaseDamage() {
    return Math.floor(this.level * 5 + Math.random() * 10);
  }

  levelUp() {
    this.level++;
    this.maxHealth += 20;
    this.maxMana += 10;
    this.health = this.maxHealth;
    this.mana = this.maxMana;
    console.log(`${this.name} leveled up to ${this.level}!`);
  }

  getStatus() {
    return {
      name: this.name,
      level: this.level,
      health: `${this.health}/${this.maxHealth}`,
      mana: `${this.mana}/${this.maxMana}`,
      alive: this.alive
    };
  }
}

class Warrior extends Character {
  constructor(name, health, mana, level, strength) {
    // Your code here
  }

  // Override attack with warrior-specific behavior
  attack(target) {
    // Your code here
    // Add strength bonus to base damage, call super.attack()
  }

  // Override calculateBaseDamage
  calculateBaseDamage() {
    // Your code here
    // Call super.calculateBaseDamage() and add strength bonus
  }

  // Warrior special ability
  powerStrike(target) {
    // Your code here
    // Enhanced attack that uses mana
  }

  // Override levelUp
  levelUp() {
    // Your code here
    // Call super.levelUp() and increase strength
  }

  // Override getStatus
  getStatus() {
    // Your code here
    // Call super.getStatus() and add strength
  }
}

class Mage extends Character {
  constructor(name, health, mana, level, intelligence) {
    // Your code here
  }

  // Override attack with magic attack
  attack(target) {
    // Your code here
    // Magic attack that costs mana
  }

  // Override calculateBaseDamage
  calculateBaseDamage() {
    // Your code here
    // Base damage plus intelligence bonus
  }

  // Mage special ability
  fireball(target) {
    // Your code here
    // High damage spell with high mana cost
  }

  // Mage utility
  healSpell(target) {
    // Your code here
    // Healing spell that costs mana
  }

  // Override takeDamage (mages take more damage)
  takeDamage(damage) {
    // Your code here
    // Increase damage by 20%, then call super.takeDamage()
  }

  // Override levelUp
  levelUp() {
    // Your code here
    // Call super.levelUp() and increase intelligence
  }

  // Override getStatus
  getStatus() {
    // Your code here
    // Call super.getStatus() and add intelligence
  }
}

class Paladin extends Warrior {
  constructor(name, health, mana, level, strength, faith) {
    // Your code here
  }

  // Override attack to include holy damage
  attack(target) {
    // Your code here
    // Call super.attack() and add holy damage based on faith
  }

  // Override heal with divine healing
  heal(amount) {
    // Your code here
    // Enhanced healing based on faith, call super.heal()
  }

  // Paladin special ability
  divineStrike(target) {
    // Your code here
    // Combines warrior power strike with holy damage
  }

  // Paladin utility
  bless(target) {
    // Your code here
    // Temporary buff that enhances target's abilities
  }

  // Override levelUp
  levelUp() {
    // Your code here
    // Call super.levelUp() and increase faith
  }

  // Override getStatus
  getStatus() {
    // Your code here
    // Call super.getStatus() and add faith
  }
}

// Test complex character hierarchy
const warrior = new Warrior("Conan", 120, 30, 5, 18);
const mage = new Mage("Gandalf", 80, 100, 5, 20);
const paladin = new Paladin("Arthur", 110, 60, 5, 16, 15);

console.log("Initial status:");
console.log("Warrior:", warrior.getStatus());
console.log("Mage:", mage.getStatus());
console.log("Paladin:", paladin.getStatus());

// Test combat
warrior.attack(mage);
mage.fireball(warrior);
paladin.divineStrike(mage);

console.log("After combat:");
console.log("Warrior:", warrior.getStatus());
console.log("Mage:", mage.getStatus());

// Test healing
paladin.heal(20);
mage.healSpell(warrior);

console.log("After healing:");
console.log("Warrior:", warrior.getStatus());
console.log("Paladin:", paladin.getStatus());

console.log("\n=== Exercise 6 Complete! ===");

/*
 * SELF-CHECK QUESTIONS:
 * 1. When should you call super() in a constructor vs in a method?
 * 2. What happens if you forget to call super() in a constructor?
 * 3. How do you call a grandparent method when you've overridden it twice?
 * 4. What's the difference between overriding and overloading methods?
 * 5. How does method resolution work in JavaScript inheritance chains?
 * 6. When is it appropriate to completely replace vs. extend parent functionality?
 * 7. How can you ensure proper initialization in deep inheritance hierarchies?
 * 8. What are some common pitfalls when using super in complex hierarchies?
 */
