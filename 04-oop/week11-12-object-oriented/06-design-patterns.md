# Design Patterns in JavaScript

## Table of Contents

1. [Introduction to Design Patterns](#introduction-to-design-patterns)
2. [Creational Patterns](#creational-patterns)
3. [Structural Patterns](#structural-patterns)
4. [Behavioral Patterns](#behavioral-patterns)
5. [Module Patterns](#module-patterns)
6. [Architectural Patterns](#architectural-patterns)
7. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)
8. [Pattern Selection Guide](#pattern-selection-guide)
9. [Real-World Applications](#real-world-applications)
10. [Best Practices](#best-practices)
11. [Self-Check Questions](#self-check-questions)
12. [Practice Exercises](#practice-exercises)

## Introduction to Design Patterns

Design patterns are reusable solutions to commonly occurring problems in software design. They represent best practices and provide a common vocabulary for developers to communicate complex design concepts.

### Benefits of Design Patterns

- **Reusability**: Proven solutions that can be applied to similar problems
- **Communication**: Common vocabulary for developers
- **Best Practices**: Time-tested approaches to common problems
- **Maintainability**: Well-structured, easy-to-understand code
- **Flexibility**: Designs that can adapt to changing requirements

### Pattern Categories

1. **Creational**: Object creation mechanisms
2. **Structural**: Object composition and relationships
3. **Behavioral**: Communication between objects and assignment of responsibilities

## Creational Patterns

### 1. Singleton Pattern

Ensures a class has only one instance and provides global access to it.

```javascript
class DatabaseConnection {
  static #instance = null;
  #isConnected = false;

  constructor() {
    if (DatabaseConnection.#instance) {
      return DatabaseConnection.#instance;
    }

    this.host = "localhost";
    this.port = 5432;
    this.database = "myapp";

    DatabaseConnection.#instance = this;
  }

  connect() {
    if (!this.#isConnected) {
      console.log(`Connecting to ${this.host}:${this.port}/${this.database}`);
      this.#isConnected = true;
    }
    return this;
  }

  disconnect() {
    if (this.#isConnected) {
      console.log("Disconnecting from database");
      this.#isConnected = false;
    }
    return this;
  }

  query(sql) {
    if (!this.#isConnected) {
      throw new Error("Database not connected");
    }
    console.log(`Executing: ${sql}`);
    return { results: [], rowCount: 0 };
  }

  static getInstance() {
    if (!DatabaseConnection.#instance) {
      new DatabaseConnection();
    }
    return DatabaseConnection.#instance;
  }
}

// Usage
const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();
const db3 = DatabaseConnection.getInstance();

console.log(db1 === db2); // true
console.log(db2 === db3); // true

db1.connect().query("SELECT * FROM users");
```

#### Alternative Singleton Implementation

```javascript
const DatabaseSingleton = (function () {
  let instance;

  function createInstance() {
    return {
      host: "localhost",
      port: 5432,
      isConnected: false,

      connect() {
        if (!this.isConnected) {
          console.log(`Connecting to ${this.host}:${this.port}`);
          this.isConnected = true;
        }
        return this;
      },

      disconnect() {
        if (this.isConnected) {
          console.log("Disconnecting from database");
          this.isConnected = false;
        }
        return this;
      },

      query(sql) {
        if (!this.isConnected) {
          throw new Error("Database not connected");
        }
        console.log(`Executing: ${sql}`);
        return { results: [], rowCount: 0 };
      }
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

// Usage
const db = DatabaseSingleton.getInstance();
db.connect().query("SELECT * FROM products");
```

### 2. Factory Pattern

Creates objects without exposing the instantiation logic to the client.

```javascript
class Animal {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }

  speak() {
    throw new Error("speak method must be implemented");
  }

  move() {
    throw new Error("move method must be implemented");
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name, "dog");
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks: Woof! Woof!`;
  }

  move() {
    return `${this.name} runs on four legs`;
  }

  fetch() {
    return `${this.name} fetches the ball`;
  }
}

class Cat extends Animal {
  constructor(name, breed) {
    super(name, "cat");
    this.breed = breed;
  }

  speak() {
    return `${this.name} meows: Meow! Meow!`;
  }

  move() {
    return `${this.name} prowls silently`;
  }

  climb() {
    return `${this.name} climbs the tree`;
  }
}

class Bird extends Animal {
  constructor(name, species) {
    super(name, "bird");
    this.species = species;
  }

  speak() {
    return `${this.name} chirps: Tweet! Tweet!`;
  }

  move() {
    return `${this.name} flies through the sky`;
  }

  migrate() {
    return `${this.name} migrates south for winter`;
  }
}

// Factory class
class AnimalFactory {
  static createAnimal(type, name, ...args) {
    switch (type.toLowerCase()) {
      case "dog":
        return new Dog(name, args[0] || "Mixed");
      case "cat":
        return new Cat(name, args[0] || "Mixed");
      case "bird":
        return new Bird(name, args[0] || "Unknown");
      default:
        throw new Error(`Unknown animal type: ${type}`);
    }
  }

  static createPet(petData) {
    const { type, name, breed, species } = petData;

    if (type === "dog" || type === "cat") {
      return this.createAnimal(type, name, breed);
    } else if (type === "bird") {
      return this.createAnimal(type, name, species);
    } else {
      throw new Error(`${type} is not supported as a pet`);
    }
  }
}

// Usage
const pets = [
  AnimalFactory.createAnimal("dog", "Buddy", "Golden Retriever"),
  AnimalFactory.createAnimal("cat", "Whiskers", "Persian"),
  AnimalFactory.createAnimal("bird", "Tweety", "Canary"),

  AnimalFactory.createPet({
    type: "dog",
    name: "Rex",
    breed: "German Shepherd"
  })
];

pets.forEach((pet) => {
  console.log(pet.speak());
  console.log(pet.move());
  console.log("---");
});
```

### 3. Builder Pattern

Constructs complex objects step by step.

```javascript
class Computer {
  constructor() {
    this.cpu = null;
    this.memory = null;
    this.storage = null;
    this.gpu = null;
    this.motherboard = null;
    this.powerSupply = null;
    this.case = null;
  }

  getSpecs() {
    return {
      cpu: this.cpu,
      memory: this.memory,
      storage: this.storage,
      gpu: this.gpu,
      motherboard: this.motherboard,
      powerSupply: this.powerSupply,
      case: this.case
    };
  }

  displaySpecs() {
    console.log("Computer Specifications:");
    console.log(`CPU: ${this.cpu || "Not specified"}`);
    console.log(`Memory: ${this.memory || "Not specified"}`);
    console.log(`Storage: ${this.storage || "Not specified"}`);
    console.log(`GPU: ${this.gpu || "Not specified"}`);
    console.log(`Motherboard: ${this.motherboard || "Not specified"}`);
    console.log(`Power Supply: ${this.powerSupply || "Not specified"}`);
    console.log(`Case: ${this.case || "Not specified"}`);
  }
}

class ComputerBuilder {
  constructor() {
    this.computer = new Computer();
  }

  setCPU(cpu) {
    this.computer.cpu = cpu;
    return this; // Return this for method chaining
  }

  setMemory(memory) {
    this.computer.memory = memory;
    return this;
  }

  setStorage(storage) {
    this.computer.storage = storage;
    return this;
  }

  setGPU(gpu) {
    this.computer.gpu = gpu;
    return this;
  }

  setMotherboard(motherboard) {
    this.computer.motherboard = motherboard;
    return this;
  }

  setPowerSupply(powerSupply) {
    this.computer.powerSupply = powerSupply;
    return this;
  }

  setCase(computerCase) {
    this.computer.case = computerCase;
    return this;
  }

  build() {
    // Validation before building
    if (!this.computer.cpu) {
      throw new Error("CPU is required");
    }
    if (!this.computer.memory) {
      throw new Error("Memory is required");
    }
    if (!this.computer.storage) {
      throw new Error("Storage is required");
    }

    return this.computer;
  }

  // Preset configurations
  static createGamingPC() {
    return new ComputerBuilder()
      .setCPU("Intel i9-12900K")
      .setMemory("32GB DDR5")
      .setStorage("1TB NVMe SSD")
      .setGPU("NVIDIA RTX 4080")
      .setMotherboard("ASUS ROG Maximus Z690")
      .setPowerSupply("850W 80+ Gold")
      .setCase("NZXT H7 Elite");
  }

  static createOfficePC() {
    return new ComputerBuilder()
      .setCPU("Intel i5-12400")
      .setMemory("16GB DDR4")
      .setStorage("512GB SSD")
      .setGPU("Integrated Graphics")
      .setMotherboard("MSI B660M Pro")
      .setPowerSupply("500W 80+ Bronze")
      .setCase("Fractal Design Core 1000");
  }
}

// Usage
const gamingPC = ComputerBuilder.createGamingPC()
  .setStorage("2TB NVMe SSD") // Override default storage
  .build();

const customPC = new ComputerBuilder()
  .setCPU("AMD Ryzen 7 5800X")
  .setMemory("16GB DDR4")
  .setStorage("1TB SSD")
  .setGPU("AMD RX 6700 XT")
  .build();

gamingPC.displaySpecs();
console.log("\n---\n");
customPC.displaySpecs();
```

### 4. Abstract Factory Pattern

Provides an interface for creating families of related objects.

```javascript
// Abstract Product Classes
class Button {
  render() {
    throw new Error("render method must be implemented");
  }

  onClick() {
    throw new Error("onClick method must be implemented");
  }
}

class Checkbox {
  render() {
    throw new Error("render method must be implemented");
  }

  onCheck() {
    throw new Error("onCheck method must be implemented");
  }
}

// Windows Implementation
class WindowsButton extends Button {
  render() {
    return '<button class="windows-btn">Windows Button</button>';
  }

  onClick() {
    console.log("Windows button clicked with native Windows styling");
  }
}

class WindowsCheckbox extends Checkbox {
  render() {
    return '<input type="checkbox" class="windows-checkbox" />';
  }

  onCheck() {
    console.log("Windows checkbox toggled with native Windows behavior");
  }
}

// Mac Implementation
class MacButton extends Button {
  render() {
    return '<button class="mac-btn">Mac Button</button>';
  }

  onClick() {
    console.log("Mac button clicked with native macOS styling");
  }
}

class MacCheckbox extends Checkbox {
  render() {
    return '<input type="checkbox" class="mac-checkbox" />';
  }

  onCheck() {
    console.log("Mac checkbox toggled with native macOS behavior");
  }
}

// Abstract Factory
class UIFactory {
  createButton() {
    throw new Error("createButton method must be implemented");
  }

  createCheckbox() {
    throw new Error("createCheckbox method must be implemented");
  }
}

// Concrete Factories
class WindowsUIFactory extends UIFactory {
  createButton() {
    return new WindowsButton();
  }

  createCheckbox() {
    return new WindowsCheckbox();
  }
}

class MacUIFactory extends UIFactory {
  createButton() {
    return new MacButton();
  }

  createCheckbox() {
    return new MacCheckbox();
  }
}

// Factory Provider
class UIFactoryProvider {
  static getFactory(platform) {
    switch (platform.toLowerCase()) {
      case "windows":
        return new WindowsUIFactory();
      case "mac":
        return new MacUIFactory();
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }
}

// Application using the factory
class Application {
  constructor(platform) {
    this.factory = UIFactoryProvider.getFactory(platform);
    this.components = [];
  }

  createUI() {
    const button = this.factory.createButton();
    const checkbox = this.factory.createCheckbox();

    this.components.push(button, checkbox);

    return {
      button: button.render(),
      checkbox: checkbox.render()
    };
  }

  handleInteractions() {
    this.components.forEach((component) => {
      if (component instanceof Button) {
        component.onClick();
      } else if (component instanceof Checkbox) {
        component.onCheck();
      }
    });
  }
}

// Usage
const windowsApp = new Application("windows");
const macApp = new Application("mac");

console.log("Windows UI:", windowsApp.createUI());
windowsApp.handleInteractions();

console.log("\nMac UI:", macApp.createUI());
macApp.handleInteractions();
```

## Structural Patterns

### 1. Adapter Pattern

Allows incompatible interfaces to work together.

```javascript
// Target interface (what our application expects)
class MediaPlayer {
  play(audioType, fileName) {
    throw new Error("play method must be implemented");
  }
}

// Adaptee classes (existing classes with incompatible interfaces)
class Mp3Player {
  playMp3(fileName) {
    console.log(`Playing MP3 file: ${fileName}`);
  }
}

class Mp4Player {
  playMp4(fileName) {
    console.log(`Playing MP4 file: ${fileName}`);
  }
}

class VlcPlayer {
  playVlc(fileName) {
    console.log(`Playing VLC file: ${fileName}`);
  }
}

// Adapter class
class MediaAdapter extends MediaPlayer {
  constructor(audioType) {
    super();

    switch (audioType.toLowerCase()) {
      case "mp3":
        this.player = new Mp3Player();
        break;
      case "mp4":
        this.player = new Mp4Player();
        break;
      case "vlc":
        this.player = new VlcPlayer();
        break;
      default:
        throw new Error(`${audioType} format not supported`);
    }
  }

  play(audioType, fileName) {
    switch (audioType.toLowerCase()) {
      case "mp3":
        this.player.playMp3(fileName);
        break;
      case "mp4":
        this.player.playMp4(fileName);
        break;
      case "vlc":
        this.player.playVlc(fileName);
        break;
      default:
        throw new Error(`${audioType} format not supported`);
    }
  }
}

// Main player class using adapter
class AudioPlayer extends MediaPlayer {
  play(audioType, fileName) {
    if (audioType.toLowerCase() === "mp3") {
      // Built-in support for MP3
      console.log(`Playing MP3 file: ${fileName}`);
    } else {
      // Use adapter for other formats
      const adapter = new MediaAdapter(audioType);
      adapter.play(audioType, fileName);
    }
  }
}

// Usage
const player = new AudioPlayer();

player.play("mp3", "song.mp3");
player.play("mp4", "video.mp4");
player.play("vlc", "movie.vlc");
```

### 2. Decorator Pattern

Adds new functionality to objects dynamically without altering their structure.

```javascript
// Base Coffee interface
class Coffee {
  getDescription() {
    return "Simple coffee";
  }

  getCost() {
    return 2.0;
  }
}

// Concrete Coffee implementations
class Espresso extends Coffee {
  getDescription() {
    return "Espresso";
  }

  getCost() {
    return 1.99;
  }
}

class HouseBlend extends Coffee {
  getDescription() {
    return "House Blend Coffee";
  }

  getCost() {
    return 0.89;
  }
}

// Decorator base class
class CondimentDecorator extends Coffee {
  constructor(coffee) {
    super();
    this.coffee = coffee;
  }

  getDescription() {
    return this.coffee.getDescription();
  }

  getCost() {
    return this.coffee.getCost();
  }
}

// Concrete Decorators
class Milk extends CondimentDecorator {
  getDescription() {
    return `${this.coffee.getDescription()}, Milk`;
  }

  getCost() {
    return this.coffee.getCost() + 0.1;
  }
}

class Mocha extends CondimentDecorator {
  getDescription() {
    return `${this.coffee.getDescription()}, Mocha`;
  }

  getCost() {
    return this.coffee.getCost() + 0.2;
  }
}

class Whip extends CondimentDecorator {
  getDescription() {
    return `${this.coffee.getDescription()}, Whip`;
  }

  getCost() {
    return this.coffee.getCost() + 0.1;
  }
}

class Soy extends CondimentDecorator {
  getDescription() {
    return `${this.coffee.getDescription()}, Soy`;
  }

  getCost() {
    return this.coffee.getCost() + 0.15;
  }
}

// Usage
let beverage = new Espresso();
console.log(`${beverage.getDescription()} $${beverage.getCost()}`);

beverage = new Milk(beverage);
console.log(`${beverage.getDescription()} $${beverage.getCost()}`);

beverage = new Mocha(beverage);
console.log(`${beverage.getDescription()} $${beverage.getCost()}`);

beverage = new Whip(beverage);
console.log(`${beverage.getDescription()} $${beverage.getCost()}`);

// Another order
let beverage2 = new HouseBlend();
beverage2 = new Soy(beverage2);
beverage2 = new Mocha(beverage2);
beverage2 = new Whip(beverage2);
console.log(`${beverage2.getDescription()} $${beverage2.getCost()}`);
```

### 3. Facade Pattern

Provides a simplified interface to a complex subsystem.

```javascript
// Complex subsystem classes
class CPU {
  freeze() {
    console.log("CPU: Freezing processor");
  }

  jump(position) {
    console.log(`CPU: Jumping to position ${position}`);
  }

  execute() {
    console.log("CPU: Executing instructions");
  }
}

class Memory {
  load(position, data) {
    console.log(`Memory: Loading data "${data}" at position ${position}`);
  }
}

class HardDrive {
  read(lba, size) {
    console.log(`HardDrive: Reading ${size} bytes from LBA ${lba}`);
    return "boot sector data";
  }
}

class GPU {
  initialize() {
    console.log("GPU: Initializing graphics card");
  }

  loadDrivers() {
    console.log("GPU: Loading graphics drivers");
  }
}

class NetworkCard {
  initialize() {
    console.log("NetworkCard: Initializing network interface");
  }

  connectToNetwork() {
    console.log("NetworkCard: Connecting to network");
  }
}

// Facade class - provides simple interface
class ComputerFacade {
  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hardDrive = new HardDrive();
    this.gpu = new GPU();
    this.networkCard = new NetworkCard();
  }

  start() {
    console.log("=== Starting Computer ===");

    // Complex startup sequence hidden from client
    this.cpu.freeze();

    const bootData = this.hardDrive.read(0, 1024);
    this.memory.load(0, bootData);

    this.cpu.jump(0);
    this.cpu.execute();

    this.gpu.initialize();
    this.gpu.loadDrivers();

    this.networkCard.initialize();
    this.networkCard.connectToNetwork();

    console.log("=== Computer Started Successfully ===");
  }

  shutdown() {
    console.log("=== Shutting Down Computer ===");
    console.log("Saving work and closing applications...");
    console.log("Disconnecting from network...");
    console.log("Shutting down graphics...");
    console.log("Powering off CPU...");
    console.log("=== Computer Shut Down ===");
  }

  restart() {
    console.log("=== Restarting Computer ===");
    this.shutdown();
    console.log("Waiting for restart...");
    setTimeout(() => {
      this.start();
    }, 1000);
  }
}

// Usage - Client only needs to know about the simple interface
const computer = new ComputerFacade();

computer.start();
console.log("\n");

setTimeout(() => {
  computer.restart();
}, 2000);
```

## Behavioral Patterns

### 1. Observer Pattern

Defines a one-to-many dependency between objects so that when one object changes state, all dependents are notified.

```javascript
// Observer interface
class Observer {
  update(data) {
    throw new Error("update method must be implemented");
  }
}

// Subject (Observable) class
class Subject {
  constructor() {
    this.observers = [];
  }

  addObserver(observer) {
    if (!(observer instanceof Observer)) {
      throw new Error("Observer must implement Observer interface");
    }

    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      console.log("Observer added");
    }
  }

  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
      console.log("Observer removed");
    }
  }

  notifyObservers(data) {
    console.log(`Notifying ${this.observers.length} observers`);
    this.observers.forEach((observer) => {
      try {
        observer.update(data);
      } catch (error) {
        console.error("Error notifying observer:", error.message);
      }
    });
  }
}

// Concrete Subject - Weather Station
class WeatherStation extends Subject {
  constructor() {
    super();
    this.temperature = 0;
    this.humidity = 0;
    this.pressure = 0;
  }

  setMeasurements(temperature, humidity, pressure) {
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;

    this.measurementsChanged();
  }

  measurementsChanged() {
    this.notifyObservers({
      temperature: this.temperature,
      humidity: this.humidity,
      pressure: this.pressure,
      timestamp: new Date()
    });
  }

  getTemperature() {
    return this.temperature;
  }

  getHumidity() {
    return this.humidity;
  }

  getPressure() {
    return this.pressure;
  }
}

// Concrete Observers
class CurrentConditionsDisplay extends Observer {
  constructor(name) {
    super();
    this.name = name;
  }

  update(weatherData) {
    console.log(`${this.name} - Current conditions:`);
    console.log(`  Temperature: ${weatherData.temperature}°F`);
    console.log(`  Humidity: ${weatherData.humidity}%`);
    console.log(`  Pressure: ${weatherData.pressure} inHg`);
    console.log(`  Time: ${weatherData.timestamp.toLocaleTimeString()}`);
    console.log("");
  }
}

class StatisticsDisplay extends Observer {
  constructor() {
    super();
    this.temperatures = [];
    this.maxTemp = -Infinity;
    this.minTemp = Infinity;
  }

  update(weatherData) {
    this.temperatures.push(weatherData.temperature);

    if (weatherData.temperature > this.maxTemp) {
      this.maxTemp = weatherData.temperature;
    }

    if (weatherData.temperature < this.minTemp) {
      this.minTemp = weatherData.temperature;
    }

    const avgTemp =
      this.temperatures.reduce((sum, temp) => sum + temp, 0) /
      this.temperatures.length;

    console.log("Weather Statistics:");
    console.log(`  Average Temperature: ${avgTemp.toFixed(1)}°F`);
    console.log(`  Max Temperature: ${this.maxTemp}°F`);
    console.log(`  Min Temperature: ${this.minTemp}°F`);
    console.log("");
  }
}

class ForecastDisplay extends Observer {
  constructor() {
    super();
    this.lastPressure = 0;
  }

  update(weatherData) {
    let forecast = "More of the same";

    if (weatherData.pressure > this.lastPressure) {
      forecast = "Improving weather on the way!";
    } else if (weatherData.pressure < this.lastPressure) {
      forecast = "Watch out for cooler, rainy weather";
    }

    console.log("Weather Forecast:");
    console.log(`  ${forecast}`);
    console.log("");

    this.lastPressure = weatherData.pressure;
  }
}

// Usage
const weatherStation = new WeatherStation();

const currentDisplay = new CurrentConditionsDisplay("Main Display");
const statsDisplay = new StatisticsDisplay();
const forecastDisplay = new ForecastDisplay();

// Register observers
weatherStation.addObserver(currentDisplay);
weatherStation.addObserver(statsDisplay);
weatherStation.addObserver(forecastDisplay);

// Simulate weather changes
console.log("=== First Weather Update ===");
weatherStation.setMeasurements(80, 65, 30.4);

console.log("=== Second Weather Update ===");
weatherStation.setMeasurements(82, 70, 29.2);

console.log("=== Third Weather Update ===");
weatherStation.setMeasurements(78, 90, 29.2);

// Remove an observer
weatherStation.removeObserver(forecastDisplay);

console.log("=== Fourth Weather Update (without forecast) ===");
weatherStation.setMeasurements(75, 85, 30.1);
```

### 2. Strategy Pattern

Defines a family of algorithms, encapsulates each one, and makes them interchangeable.

```javascript
// Strategy interface
class PaymentStrategy {
  pay(amount) {
    throw new Error("pay method must be implemented");
  }

  getPaymentDetails() {
    throw new Error("getPaymentDetails method must be implemented");
  }
}

// Concrete Strategies
class CreditCardStrategy extends PaymentStrategy {
  constructor(cardNumber, expiryDate, cvv, cardholderName) {
    super();
    this.cardNumber = cardNumber;
    this.expiryDate = expiryDate;
    this.cvv = cvv;
    this.cardholderName = cardholderName;
  }

  pay(amount) {
    console.log(`Processing credit card payment of $${amount}`);
    console.log(`Card: **** **** **** ${this.cardNumber.slice(-4)}`);
    console.log(`Cardholder: ${this.cardholderName}`);

    // Simulate payment processing
    return {
      success: true,
      transactionId: `CC_${Date.now()}`,
      method: "Credit Card",
      amount: amount
    };
  }

  getPaymentDetails() {
    return {
      type: "Credit Card",
      lastFour: this.cardNumber.slice(-4),
      cardholder: this.cardholderName
    };
  }
}

class PayPalStrategy extends PaymentStrategy {
  constructor(email, password) {
    super();
    this.email = email;
    this.password = password;
  }

  pay(amount) {
    console.log(`Processing PayPal payment of $${amount}`);
    console.log(`PayPal account: ${this.email}`);

    return {
      success: true,
      transactionId: `PP_${Date.now()}`,
      method: "PayPal",
      amount: amount
    };
  }

  getPaymentDetails() {
    return {
      type: "PayPal",
      email: this.email
    };
  }
}

class ApplePayStrategy extends PaymentStrategy {
  constructor(deviceId, touchId) {
    super();
    this.deviceId = deviceId;
    this.touchId = touchId;
  }

  pay(amount) {
    console.log(`Processing Apple Pay payment of $${amount}`);
    console.log(`Device: ${this.deviceId}`);
    console.log("Touch ID verified");

    return {
      success: true,
      transactionId: `AP_${Date.now()}`,
      method: "Apple Pay",
      amount: amount
    };
  }

  getPaymentDetails() {
    return {
      type: "Apple Pay",
      device: this.deviceId
    };
  }
}

// Context class
class ShoppingCart {
  constructor() {
    this.items = [];
    this.paymentStrategy = null;
  }

  addItem(name, price, quantity = 1) {
    this.items.push({ name, price, quantity });
    console.log(`Added ${quantity}x ${name} at $${price} each`);
  }

  removeItem(name) {
    this.items = this.items.filter((item) => item.name !== name);
    console.log(`Removed ${name} from cart`);
  }

  getTotal() {
    return this.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  setPaymentStrategy(strategy) {
    if (!(strategy instanceof PaymentStrategy)) {
      throw new Error("Strategy must implement PaymentStrategy interface");
    }
    this.paymentStrategy = strategy;
    console.log(`Payment method set to: ${strategy.getPaymentDetails().type}`);
  }

  checkout() {
    if (!this.paymentStrategy) {
      throw new Error("No payment method selected");
    }

    if (this.items.length === 0) {
      throw new Error("Cart is empty");
    }

    const total = this.getTotal();

    console.log("\n=== Checkout Summary ===");
    this.items.forEach((item) => {
      console.log(
        `${item.quantity}x ${item.name} - $${item.price * item.quantity}`
      );
    });
    console.log(`Total: $${total}`);
    console.log("");

    const result = this.paymentStrategy.pay(total);

    if (result.success) {
      console.log(
        `Payment successful! Transaction ID: ${result.transactionId}`
      );
      this.items = []; // Clear cart after successful payment
    } else {
      console.log("Payment failed!");
    }

    return result;
  }
}

// Usage
const cart = new ShoppingCart();

// Add items to cart
cart.addItem("Laptop", 999.99);
cart.addItem("Mouse", 29.99, 2);
cart.addItem("Keyboard", 79.99);

console.log(`\nCart Total: $${cart.getTotal()}`);

// Try different payment strategies
console.log("\n--- Paying with Credit Card ---");
const creditCard = new CreditCardStrategy(
  "1234567890123456",
  "12/25",
  "123",
  "John Doe"
);
cart.setPaymentStrategy(creditCard);
cart.checkout();

// Add more items and try PayPal
cart.addItem("Monitor", 199.99);
cart.addItem("Headphones", 149.99);

console.log("\n--- Paying with PayPal ---");
const paypal = new PayPalStrategy("john.doe@email.com", "password123");
cart.setPaymentStrategy(paypal);
cart.checkout();

// Add more items and try Apple Pay
cart.addItem("iPhone Case", 39.99);

console.log("\n--- Paying with Apple Pay ---");
const applePay = new ApplePayStrategy("iPhone13_ABC123", true);
cart.setPaymentStrategy(applePay);
cart.checkout();
```

### 3. Command Pattern

Encapsulates a request as an object, allowing you to parameterize clients with different requests.

```javascript
// Command interface
class Command {
  execute() {
    throw new Error("execute method must be implemented");
  }

  undo() {
    throw new Error("undo method must be implemented");
  }

  getDescription() {
    throw new Error("getDescription method must be implemented");
  }
}

// Receiver classes
class TextEditor {
  constructor() {
    this.content = "";
    this.clipboard = "";
  }

  write(text) {
    this.content += text;
  }

  delete(length) {
    this.content = this.content.slice(0, -length);
  }

  copy(start, end) {
    this.clipboard = this.content.substring(start, end);
  }

  paste() {
    this.content += this.clipboard;
  }

  getContent() {
    return this.content;
  }

  setContent(content) {
    this.content = content;
  }

  clear() {
    this.content = "";
  }
}

// Concrete Commands
class WriteCommand extends Command {
  constructor(editor, text) {
    super();
    this.editor = editor;
    this.text = text;
  }

  execute() {
    this.editor.write(this.text);
  }

  undo() {
    this.editor.delete(this.text.length);
  }

  getDescription() {
    return `Write: "${this.text}"`;
  }
}

class DeleteCommand extends Command {
  constructor(editor, length) {
    super();
    this.editor = editor;
    this.length = length;
    this.deletedText = "";
  }

  execute() {
    const content = this.editor.getContent();
    this.deletedText = content.slice(-this.length);
    this.editor.delete(this.length);
  }

  undo() {
    this.editor.write(this.deletedText);
  }

  getDescription() {
    return `Delete: ${this.length} characters`;
  }
}

class CopyCommand extends Command {
  constructor(editor, start, end) {
    super();
    this.editor = editor;
    this.start = start;
    this.end = end;
  }

  execute() {
    this.editor.copy(this.start, this.end);
  }

  undo() {
    // Copy command doesn't change content, so no undo needed
    // But we implement it for interface compliance
  }

  getDescription() {
    return `Copy: characters ${this.start}-${this.end}`;
  }
}

class PasteCommand extends Command {
  constructor(editor) {
    super();
    this.editor = editor;
    this.pastedText = "";
  }

  execute() {
    this.pastedText = this.editor.clipboard;
    this.editor.paste();
  }

  undo() {
    this.editor.delete(this.pastedText.length);
  }

  getDescription() {
    return `Paste: "${this.pastedText}"`;
  }
}

// Macro Command - composite command
class MacroCommand extends Command {
  constructor(commands, description) {
    super();
    this.commands = commands;
    this.description = description;
  }

  execute() {
    this.commands.forEach((command) => command.execute());
  }

  undo() {
    // Undo in reverse order
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }
  }

  getDescription() {
    return this.description;
  }
}

// Invoker class
class EditorInvoker {
  constructor(editor) {
    this.editor = editor;
    this.history = [];
    this.currentPosition = -1;
  }

  executeCommand(command) {
    // Remove any commands after current position (for redo functionality)
    this.history = this.history.slice(0, this.currentPosition + 1);

    command.execute();
    this.history.push(command);
    this.currentPosition++;

    console.log(`Executed: ${command.getDescription()}`);
    console.log(`Content: "${this.editor.getContent()}"`);
  }

  undo() {
    if (this.currentPosition >= 0) {
      const command = this.history[this.currentPosition];
      command.undo();
      this.currentPosition--;

      console.log(`Undid: ${command.getDescription()}`);
      console.log(`Content: "${this.editor.getContent()}"`);
    } else {
      console.log("Nothing to undo");
    }
  }

  redo() {
    if (this.currentPosition < this.history.length - 1) {
      this.currentPosition++;
      const command = this.history[this.currentPosition];
      command.execute();

      console.log(`Redid: ${command.getDescription()}`);
      console.log(`Content: "${this.editor.getContent()}"`);
    } else {
      console.log("Nothing to redo");
    }
  }

  getHistory() {
    return this.history.map((command, index) => ({
      index,
      description: command.getDescription(),
      isCurrent: index <= this.currentPosition
    }));
  }
}

// Usage
const editor = new TextEditor();
const invoker = new EditorInvoker(editor);

// Execute individual commands
console.log("=== Executing Commands ===");
invoker.executeCommand(new WriteCommand(editor, "Hello "));
invoker.executeCommand(new WriteCommand(editor, "World!"));
invoker.executeCommand(new WriteCommand(editor, " How are you?"));

// Copy and paste
invoker.executeCommand(new CopyCommand(editor, 0, 5)); // Copy "Hello"
invoker.executeCommand(new PasteCommand(editor));

// Delete some text
invoker.executeCommand(new DeleteCommand(editor, 10));

console.log("\n=== Command History ===");
console.log(invoker.getHistory());

// Undo operations
console.log("\n=== Undo Operations ===");
invoker.undo();
invoker.undo();
invoker.undo();

// Redo operations
console.log("\n=== Redo Operations ===");
invoker.redo();
invoker.redo();

// Macro command example
console.log("\n=== Macro Command ===");
const macroCommands = [
  new WriteCommand(editor, "\nNew paragraph: "),
  new WriteCommand(editor, "This is a "),
  new WriteCommand(editor, "macro command!")
];

const macroCommand = new MacroCommand(macroCommands, "Add new paragraph");
invoker.executeCommand(macroCommand);

console.log("\n=== Undo Macro ===");
invoker.undo(); // This will undo the entire macro
```

## Module Patterns

### 1. Module Pattern (IIFE)

```javascript
const UserModule = (function () {
  // Private variables and functions
  let users = [];
  let currentId = 1;

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function generateId() {
    return currentId++;
  }

  function findUserById(id) {
    return users.find((user) => user.id === id);
  }

  // Public API
  return {
    addUser(name, email) {
      if (!name || !email) {
        throw new Error("Name and email are required");
      }

      if (!validateEmail(email)) {
        throw new Error("Invalid email format");
      }

      const user = {
        id: generateId(),
        name,
        email,
        createdAt: new Date()
      };

      users.push(user);
      return user;
    },

    getUser(id) {
      const user = findUserById(id);
      if (!user) {
        throw new Error("User not found");
      }
      return { ...user }; // Return copy
    },

    updateUser(id, updates) {
      const user = findUserById(id);
      if (!user) {
        throw new Error("User not found");
      }

      if (updates.email && !validateEmail(updates.email)) {
        throw new Error("Invalid email format");
      }

      Object.assign(user, updates);
      return { ...user };
    },

    deleteUser(id) {
      const index = users.findIndex((user) => user.id === id);
      if (index === -1) {
        throw new Error("User not found");
      }

      const deletedUser = users.splice(index, 1)[0];
      return { ...deletedUser };
    },

    getAllUsers() {
      return users.map((user) => ({ ...user })); // Return copies
    },

    getUserCount() {
      return users.length;
    }
  };
})();

// Usage
const user1 = UserModule.addUser("John Doe", "john@example.com");
const user2 = UserModule.addUser("Jane Smith", "jane@example.com");

console.log("All users:", UserModule.getAllUsers());
console.log("User count:", UserModule.getUserCount());

UserModule.updateUser(user1.id, { name: "John Updated" });
console.log("Updated user:", UserModule.getUser(user1.id));
```

### 2. Revealing Module Pattern

```javascript
const CalculatorModule = (function () {
  // Private variables
  let result = 0;
  let history = [];

  // Private functions
  function logOperation(operation, operand, result) {
    history.push({
      operation,
      operand,
      result,
      timestamp: new Date()
    });
  }

  function validateNumber(num) {
    if (typeof num !== "number" || isNaN(num)) {
      throw new Error("Invalid number");
    }
  }

  // Public functions
  function add(num) {
    validateNumber(num);
    result += num;
    logOperation("add", num, result);
    return result;
  }

  function subtract(num) {
    validateNumber(num);
    result -= num;
    logOperation("subtract", num, result);
    return result;
  }

  function multiply(num) {
    validateNumber(num);
    result *= num;
    logOperation("multiply", num, result);
    return result;
  }

  function divide(num) {
    validateNumber(num);
    if (num === 0) {
      throw new Error("Division by zero");
    }
    result /= num;
    logOperation("divide", num, result);
    return result;
  }

  function getResult() {
    return result;
  }

  function clear() {
    result = 0;
    logOperation("clear", null, result);
    return result;
  }

  function getHistory() {
    return [...history]; // Return copy
  }

  function clearHistory() {
    history = [];
  }

  // Reveal public interface
  return {
    add,
    subtract,
    multiply,
    divide,
    getResult,
    clear,
    getHistory,
    clearHistory
  };
})();

// Usage
console.log(CalculatorModule.add(10)); // 10
console.log(CalculatorModule.multiply(2)); // 20
console.log(CalculatorModule.subtract(5)); // 15
console.log(CalculatorModule.divide(3)); // 5

console.log("Current result:", CalculatorModule.getResult());
console.log("History:", CalculatorModule.getHistory());

CalculatorModule.clear();
console.log("After clear:", CalculatorModule.getResult());
```

## Self-Check Questions

1. When would you use the Singleton pattern and what are its drawbacks?
2. How does the Factory pattern differ from the Abstract Factory pattern?
3. What is the main advantage of the Builder pattern over constructor functions?
4. How does the Decorator pattern maintain the single responsibility principle?
5. What problem does the Facade pattern solve?
6. How does the Observer pattern promote loose coupling?
7. When would you choose the Strategy pattern over inheritance?
8. What are the benefits of the Command pattern for implementing undo functionality?
9. How do Module patterns help with encapsulation in JavaScript?
10. Which pattern would you use to handle cross-cutting concerns?

## Practice Exercises

### Exercise 1: Shopping System with Multiple Patterns

Create a comprehensive shopping system that uses multiple design patterns:

```javascript
// Use Factory pattern for creating different product types
// Use Observer pattern for inventory notifications
// Use Strategy pattern for different pricing strategies
// Use Command pattern for cart operations with undo/redo
// Use Facade pattern to simplify the shopping experience

class ShoppingSystemFacade {
  // Simple interface that hides complex subsystem interactions
  // Methods: addToCart, removeFromCart, applyDiscount, checkout
}

// Implement the complete system with proper pattern usage
```

### Exercise 2: Document Editor with Design Patterns

Build a document editor using various patterns:

```javascript
// Use Command pattern for all editing operations
// Use Decorator pattern for text formatting
// Use Observer pattern for real-time collaboration
// Use Strategy pattern for different save formats
// Use Builder pattern for complex document creation

class DocumentEditor {
  // Should support: text editing, formatting, saving, collaboration
  // With full undo/redo functionality
}
```

### Exercise 3: Game Development Framework

Create a game framework using design patterns:

```javascript
// Use Factory pattern for creating game objects
// Use Observer pattern for game events
// Use Strategy pattern for AI behaviors
// Use State pattern for game states
// Use Command pattern for input handling

class GameFramework {
  // Should handle: game objects, AI, input, state management
  // With extensible architecture for different game types
}
```

---

This completes the comprehensive guide to design patterns in JavaScript. These patterns form the foundation of maintainable, scalable, and well-structured code in object-oriented programming.
