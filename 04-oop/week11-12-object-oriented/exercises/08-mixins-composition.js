/**
 * Exercise 8: Mixins and Composition
 *
 * Learn composition over inheritance and implement mixin patterns
 */

console.log("=== Exercise 8: Mixins and Composition ===\n");

// PART 1: Basic Mixins
console.log("PART 1: Basic Mixins");

/*
 * TODO 1.1: Create basic mixins for common functionality
 */

// Mixin for logging functionality
const Loggable = {
  log(message, level = "INFO") {
    const timestamp = new Date().toISOString();
    console.log(
      `[${timestamp}] [${level}] ${this.constructor.name}: ${message}`
    );
  },

  logError(message) {
    this.log(message, "ERROR");
  },

  logWarning(message) {
    this.log(message, "WARNING");
  },

  logDebug(message) {
    this.log(message, "DEBUG");
  }
};

// Mixin for event handling
const EventEmitter = {
  initEvents() {
    this._events = {};
  },

  on(eventName, callback) {
    // Your code here
    // Add event listener
    if (!this._events) this.initEvents();
  },

  off(eventName, callback) {
    // Your code here
    // Remove event listener
  },

  emit(eventName, ...args) {
    // Your code here
    // Trigger event listeners
  },

  once(eventName, callback) {
    // Your code here
    // Add one-time event listener
  }
};

// Mixin for serialization
const Serializable = {
  toJSON() {
    const obj = {};
    for (let key in this) {
      if (this.hasOwnProperty(key) && !key.startsWith("_")) {
        obj[key] = this[key];
      }
    }
    return obj;
  },

  fromJSON(jsonString) {
    // Your code here
    // Restore object from JSON
  },

  clone() {
    // Your code here
    // Create a deep copy of the object
  },

  toString() {
    return JSON.stringify(this.toJSON());
  }
};

// Utility function to apply mixins
function applyMixin(targetClass, mixin) {
  // Your code here
  // Copy all methods from mixin to target class prototype
}

function applyMixins(targetClass, ...mixins) {
  // Your code here
  // Apply multiple mixins to a class
}

/*
 * TODO 1.2: Create a class that uses multiple mixins
 */

class User {
  constructor(name, email, role) {
    this.name = name;
    this.email = email;
    this.role = role;
    this.createdAt = new Date();

    // Initialize event system if available
    if (this.initEvents) {
      this.initEvents();
    }
  }

  getInfo() {
    return `${this.name} (${this.email}) - ${this.role}`;
  }

  updateEmail(newEmail) {
    const oldEmail = this.email;
    this.email = newEmail;

    // Log change if logging is available
    if (this.log) {
      this.log(`Email updated from ${oldEmail} to ${newEmail}`);
    }

    // Emit event if event system is available
    if (this.emit) {
      this.emit("emailChanged", { oldEmail, newEmail });
    }
  }
}

// Apply mixins to User class
applyMixins(User, Loggable, EventEmitter, Serializable);

// Test mixed-in functionality
const user = new User("John Doe", "john@example.com", "admin");

// Test logging
user.log("User created");
user.logWarning("This is a warning");

// Test events
user.on("emailChanged", (data) => {
  console.log("Email changed event:", data);
});

user.updateEmail("john.doe@example.com");

// Test serialization
console.log("User JSON:", user.toString());
const userClone = user.clone();
console.log("Cloned user:", userClone.getInfo());

// PART 2: Composition Pattern
console.log("\nPART 2: Composition Pattern");

/*
 * TODO 2.1: Implement composition instead of inheritance
 */

// Components for composition
class Engine {
  constructor(type, horsepower, fuelType) {
    this.type = type;
    this.horsepower = horsepower;
    this.fuelType = fuelType;
    this.running = false;
  }

  start() {
    this.running = true;
    return `${this.type} engine started (${this.horsepower}hp)`;
  }

  stop() {
    this.running = false;
    return `${this.type} engine stopped`;
  }

  getStatus() {
    return {
      type: this.type,
      horsepower: this.horsepower,
      fuelType: this.fuelType,
      running: this.running
    };
  }
}

class GPS {
  constructor() {
    this.currentLocation = { lat: 0, lng: 0 };
    this.destination = null;
  }

  setDestination(destination) {
    this.destination = destination;
    return `Destination set to ${destination}`;
  }

  navigate() {
    // Your code here
    // Return navigation instructions
  }

  getCurrentLocation() {
    return this.currentLocation;
  }

  updateLocation(lat, lng) {
    this.currentLocation = { lat, lng };
  }
}

class SoundSystem {
  constructor() {
    this.volume = 50;
    this.currentTrack = null;
    this.playlist = [];
  }

  play(track) {
    // Your code here
    // Play a track
  }

  pause() {
    // Your code here
  }

  setVolume(volume) {
    // Your code here
    // Set volume with validation (0-100)
  }

  addToPlaylist(track) {
    // Your code here
  }

  getStatus() {
    return {
      volume: this.volume,
      currentTrack: this.currentTrack,
      playlistLength: this.playlist.length
    };
  }
}

class ClimateControl {
  constructor() {
    this.temperature = 72;
    this.fanSpeed = 3;
    this.acOn = false;
    this.heaterOn = false;
  }

  setTemperature(temp) {
    // Your code here
    // Set temperature with validation
  }

  setFanSpeed(speed) {
    // Your code here
    // Set fan speed (1-5)
  }

  toggleAC() {
    // Your code here
  }

  toggleHeater() {
    // Your code here
  }

  getStatus() {
    return {
      temperature: this.temperature,
      fanSpeed: this.fanSpeed,
      acOn: this.acOn,
      heaterOn: this.heaterOn
    };
  }
}

// Composed vehicle class
class ModernCar {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;

    // Composition: Car HAS these components
    this.engine = new Engine("V6", 300, "Gasoline");
    this.gps = new GPS();
    this.soundSystem = new SoundSystem();
    this.climateControl = new ClimateControl();

    this.locked = true;
    this.mileage = 0;
  }

  // Delegate to engine
  start() {
    if (this.locked) {
      return "Car is locked. Cannot start.";
    }
    return this.engine.start();
  }

  stop() {
    return this.engine.stop();
  }

  // Delegate to GPS
  setDestination(destination) {
    return this.gps.setDestination(destination);
  }

  navigate() {
    return this.gps.navigate();
  }

  // Delegate to sound system
  playMusic(track) {
    return this.soundSystem.play(track);
  }

  adjustVolume(volume) {
    return this.soundSystem.setVolume(volume);
  }

  // Delegate to climate control
  setClimate(temperature) {
    return this.climateControl.setTemperature(temperature);
  }

  toggleAC() {
    return this.climateControl.toggleAC();
  }

  // Car-specific methods
  lock() {
    this.locked = true;
    return `${this.make} ${this.model} locked`;
  }

  unlock() {
    this.locked = false;
    return `${this.make} ${this.model} unlocked`;
  }

  drive(miles) {
    if (!this.engine.running) {
      return "Engine must be started first";
    }
    this.mileage += miles;
    return `Drove ${miles} miles. Total mileage: ${this.mileage}`;
  }

  getFullStatus() {
    return {
      vehicle: `${this.make} ${this.model} (${this.year})`,
      mileage: this.mileage,
      locked: this.locked,
      engine: this.engine.getStatus(),
      gps: this.gps.getCurrentLocation(),
      soundSystem: this.soundSystem.getStatus(),
      climate: this.climateControl.getStatus()
    };
  }
}

// Test composition
const car = new ModernCar("Tesla", "Model S", 2023);

console.log("Car unlock:", car.unlock());
console.log("Car start:", car.start());
console.log("Set destination:", car.setDestination("Airport"));
console.log("Play music:", car.playMusic("Bohemian Rhapsody"));
console.log("Set climate:", car.setClimate(75));
console.log("Drive:", car.drive(50));

console.log("Full car status:", car.getFullStatus());

// PART 3: Advanced Mixin Patterns
console.log("\nPART 3: Advanced Mixin Patterns");

/*
 * TODO 3.1: Create functional mixins with parameters
 */

// Functional mixin for timestamping
function Timestamped(BaseClass) {
  return class extends BaseClass {
    constructor(...args) {
      super(...args);
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }

    touch() {
      this.updatedAt = new Date();
      return this;
    }

    getAge() {
      return Date.now() - this.createdAt.getTime();
    }

    getTimestamps() {
      return {
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        age: this.getAge()
      };
    }
  };
}

// Functional mixin for validation
function Validatable(BaseClass, schema) {
  return class extends BaseClass {
    constructor(...args) {
      super(...args);
      this.validationSchema = schema;
      this.errors = [];
    }

    validate() {
      // Your code here
      // Validate object against schema
      this.errors = [];

      for (let field in this.validationSchema) {
        const rules = this.validationSchema[field];
        const value = this[field];

        // Implement validation logic based on rules
        // rules can have: required, type, min, max, pattern, etc.
      }

      return this.errors.length === 0;
    }

    isValid() {
      return this.validate();
    }

    getErrors() {
      return [...this.errors];
    }

    addError(field, message) {
      this.errors.push({ field, message });
    }
  };
}

// Functional mixin for caching
function Cacheable(BaseClass, ttl = 300000) {
  // 5 minutes default
  return class extends BaseClass {
    constructor(...args) {
      super(...args);
      this._cache = new Map();
      this._cacheTTL = ttl;
    }

    cached(key, fn) {
      // Your code here
      // Check cache first, then execute function if not found or expired
    }

    clearCache(key = null) {
      // Your code here
      // Clear specific key or entire cache
    }

    getCacheStats() {
      // Your code here
      // Return cache statistics
    }
  };
}

/*
 * TODO 3.2: Create a class using functional mixins
 */

class BaseProduct {
  constructor(name, price, category) {
    this.name = name;
    this.price = price;
    this.category = category;
  }

  getInfo() {
    return `${this.name} - $${this.price} (${this.category})`;
  }

  updatePrice(newPrice) {
    this.price = newPrice;
    this.touch(); // Will be available from Timestamped mixin
    return this;
  }
}

// Define validation schema
const productSchema = {
  name: { required: true, type: "string", minLength: 1 },
  price: { required: true, type: "number", min: 0 },
  category: { required: true, type: "string" }
};

// Apply functional mixins
const Product = Cacheable(
  Timestamped(Validatable(BaseProduct, productSchema)),
  600000 // 10 minutes cache TTL
);

// Test functional mixins
const product = new Product("Laptop", 999.99, "Electronics");

console.log("Product info:", product.getInfo());
console.log("Is valid:", product.isValid());
console.log("Timestamps:", product.getTimestamps());

// Test caching
const expensiveOperation = () => {
  console.log("Performing expensive calculation...");
  return Math.random() * 1000;
};

console.log(
  "Cached result 1:",
  product.cached("expensive", expensiveOperation)
);
console.log(
  "Cached result 2:",
  product.cached("expensive", expensiveOperation)
); // Should use cache

// PART 4: Multiple Inheritance Simulation
console.log("\nPART 4: Multiple Inheritance Simulation");

/*
 * TODO 4.1: Create a complex mixin system
 */

// Capability mixins
const Flyable = {
  fly() {
    if (!this.altitude) this.altitude = 0;
    this.altitude += 1000;
    return `${this.name} is flying at ${this.altitude} feet`;
  },

  land() {
    this.altitude = 0;
    return `${this.name} has landed`;
  },

  getAltitude() {
    return this.altitude || 0;
  }
};

const Swimmable = {
  swim() {
    if (!this.depth) this.depth = 0;
    this.depth = Math.min(this.depth + 10, this.maxDepth || 100);
    return `${this.name} is swimming at ${this.depth} feet deep`;
  },

  surface() {
    this.depth = 0;
    return `${this.name} has surfaced`;
  },

  getDepth() {
    return this.depth || 0;
  }
};

const Walkable = {
  walk() {
    if (!this.distance) this.distance = 0;
    this.distance += 1;
    return `${this.name} walked 1 mile. Total distance: ${this.distance} miles`;
  },

  run() {
    if (!this.distance) this.distance = 0;
    this.distance += 3;
    return `${this.name} ran 3 miles. Total distance: ${this.distance} miles`;
  },

  getDistance() {
    return this.distance || 0;
  }
};

const Talkable = {
  speak(message) {
    return `${this.name} says: "${message}"`;
  },

  whisper(message) {
    return `${this.name} whispers: "${message}"`;
  },

  shout(message) {
    return `${this.name} shouts: "${message.toUpperCase()}!"`;
  }
};

// Advanced mixin application utility
class MixinBuilder {
  constructor(BaseClass) {
    this.BaseClass = BaseClass;
    this.mixins = [];
  }

  with(...mixins) {
    this.mixins.push(...mixins);
    return this;
  }

  build() {
    let ExtendedClass = this.BaseClass;

    // Apply each mixin
    this.mixins.forEach((mixin) => {
      Object.assign(ExtendedClass.prototype, mixin);
    });

    return ExtendedClass;
  }
}

/*
 * TODO 4.2: Create different creatures with different capabilities
 */

class Creature {
  constructor(name, species) {
    this.name = name;
    this.species = species;
    this.energy = 100;
  }

  getInfo() {
    return `${this.name} is a ${this.species}`;
  }

  rest() {
    this.energy = Math.min(100, this.energy + 20);
    return `${this.name} rested and now has ${this.energy} energy`;
  }

  getStatus() {
    return {
      name: this.name,
      species: this.species,
      energy: this.energy,
      altitude: this.getAltitude ? this.getAltitude() : 0,
      depth: this.getDepth ? this.getDepth() : 0,
      distance: this.getDistance ? this.getDistance() : 0
    };
  }
}

// Create different creature types with different capabilities

// Duck: can fly, swim, walk, and talk
const Duck = new MixinBuilder(Creature)
  .with(Flyable, Swimmable, Walkable, Talkable)
  .build();

// Fish: can only swim
const Fish = new MixinBuilder(Creature).with(Swimmable).build();

// Bird: can fly, walk, and talk
const Bird = new MixinBuilder(Creature)
  .with(Flyable, Walkable, Talkable)
  .build();

// Human: can walk and talk
const Human = new MixinBuilder(Creature).with(Walkable, Talkable).build();

// Test different creatures
const duck = new Duck("Donald", "Mallard");
const fish = new Fish("Nemo", "Clownfish");
const bird = new Bird("Tweety", "Canary");
const human = new Human("Alice", "Homo sapiens");

console.log("Duck capabilities:");
console.log(duck.fly());
console.log(duck.swim());
console.log(duck.walk());
console.log(duck.speak("Quack quack!"));
console.log("Duck status:", duck.getStatus());

console.log("\nFish capabilities:");
console.log(fish.swim());
console.log("Fish status:", fish.getStatus());

console.log("\nBird capabilities:");
console.log(bird.fly());
console.log(bird.walk());
console.log(bird.shout("Tweet tweet"));

console.log("\nHuman capabilities:");
console.log(human.walk());
console.log(human.run());
console.log(human.speak("Hello world!"));

// BONUS CHALLENGES
console.log("\n=== BONUS CHALLENGES ===");

/*
 * BONUS 1: Create a trait system similar to Rust/Scala
 */

class TraitSystem {
  static defineTrait(name, methods) {
    // Your code here
    // Define a trait with required and optional methods
  }

  static implementTrait(targetClass, traitName, implementation) {
    // Your code here
    // Implement a trait for a class with validation
  }

  static hasTrait(instance, traitName) {
    // Your code here
    // Check if an instance implements a trait
  }
}

/*
 * BONUS 2: Create a plugin system using mixins
 */

class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.loadedPlugins = new Set();
  }

  registerPlugin(name, plugin) {
    // Your code here
    // Register a plugin (mixin) with metadata
  }

  loadPlugin(name, targetClass) {
    // Your code here
    // Load a plugin into a class
  }

  unloadPlugin(name, targetClass) {
    // Your code here
    // Remove a plugin from a class
  }

  getLoadedPlugins() {
    return Array.from(this.loadedPlugins);
  }
}

// Example plugins
const DatabasePlugin = {
  connect() {
    return "Database connected";
  },
  query(sql) {
    return `Executing: ${sql}`;
  },
  disconnect() {
    return "Database disconnected";
  }
};

const CachePlugin = {
  set(key, value) {
    return `Cached ${key}: ${value}`;
  },
  get(key) {
    return `Retrieved ${key} from cache`;
  },
  clear() {
    return "Cache cleared";
  }
};

const LoggingPlugin = {
  info(msg) {
    console.log(`INFO: ${msg}`);
  },
  error(msg) {
    console.log(`ERROR: ${msg}`);
  },
  debug(msg) {
    console.log(`DEBUG: ${msg}`);
  }
};

// Test plugin system
const pluginManager = new PluginManager();
pluginManager.registerPlugin("database", DatabasePlugin);
pluginManager.registerPlugin("cache", CachePlugin);
pluginManager.registerPlugin("logging", LoggingPlugin);

class Application {
  constructor(name) {
    this.name = name;
  }

  start() {
    return `${this.name} application started`;
  }
}

// Load plugins into application
pluginManager.loadPlugin("database", Application);
pluginManager.loadPlugin("logging", Application);

const app = new Application("MyApp");
console.log(app.start());
if (app.connect) console.log(app.connect());
if (app.info) app.info("Application started successfully");

console.log("\n=== Exercise 8 Complete! ===");

/*
 * SELF-CHECK QUESTIONS:
 * 1. What are the advantages of composition over inheritance?
 * 2. How do mixins help achieve multiple inheritance in JavaScript?
 * 3. When should you use functional mixins vs object mixins?
 * 4. How can you avoid the diamond problem with mixins?
 * 5. What are traits and how do they differ from mixins?
 * 6. How can you implement a plugin architecture using composition?
 * 7. What are the performance implications of using many mixins?
 * 8. How do you handle method name conflicts between mixins?
 */
