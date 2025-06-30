/**
 * Exercise 10: Module Pattern with Closures
 *
 * The module pattern uses closures to create encapsulated modules
 * with private state and public interfaces. This was especially
 * important before ES6 modules.
 *
 * Difficulty: 🟡 Intermediate
 */

// ==========================================
// EXERCISE 1: Basic Module Pattern
// ==========================================

/**
 * TODO: Create a simple counter module
 *
 * The module should:
 * - Have private state (count)
 * - Expose public methods (increment, decrement, getCount)
 * - Prevent direct access to internal state
 */
const counterModule = (function () {
  // TODO: Implement counter module with private state

  // Return public interface
  return {
    // TODO: Add public methods
  };
})();

// TODO: Test the counter module
// counterModule.increment();
// console.log(counterModule.getCount()); // Should be 1
// Try to access private state - should be undefined
// console.log(counterModule.count); // Should be undefined

// ==========================================
// EXERCISE 2: Module with Configuration
// ==========================================

/**
 * TODO: Create a configurable timer module
 *
 * The module should:
 * - Accept initial configuration
 * - Maintain private state
 * - Provide public methods for starting, stopping, and checking status
 */
const createTimer = function (config = {}) {
  // TODO: Implement configurable timer module
  // Default config: { interval: 1000, autoStart: false }

  return {
    // TODO: Add public methods
    // start(), stop(), reset(), getElapsed(), isRunning()
  };
};

// TODO: Test the timer module
// const timer1 = createTimer({ interval: 500 });
// const timer2 = createTimer({ interval: 1000, autoStart: true });

// ==========================================
// EXERCISE 3: Shopping Cart Module
// ==========================================

/**
 * TODO: Create a shopping cart module
 *
 * The module should:
 * - Store items privately
 * - Provide methods to add, remove, and list items
 * - Calculate totals
 * - Prevent direct manipulation of the cart array
 */
const shoppingCart = (function () {
  // TODO: Implement shopping cart module

  return {
    // TODO: Add public methods
    // addItem(item), removeItem(id), getItems(), getTotal(), clear()
  };
})();

// Test data
const item1 = { id: 1, name: "Laptop", price: 999.99, quantity: 1 };
const item2 = { id: 2, name: "Mouse", price: 29.99, quantity: 2 };

// TODO: Test the shopping cart
// shoppingCart.addItem(item1);
// shoppingCart.addItem(item2);

// ==========================================
// EXERCISE 4: Event Emitter Module
// ==========================================

/**
 * TODO: Create an event emitter module
 *
 * The module should:
 * - Store event listeners privately
 * - Provide methods to subscribe, unsubscribe, and emit events
 * - Support multiple listeners per event
 * - Return unsubscribe functions
 */
const createEventEmitter = function () {
  // TODO: Implement event emitter module

  return {
    // TODO: Add public methods
    // on(event, callback), off(event, callback), emit(event, data), once(event, callback)
  };
};

// TODO: Test the event emitter
// const emitter = createEventEmitter();
// const unsubscribe = emitter.on('test', data => console.log('Received:', data));
// emitter.emit('test', 'Hello World');

// ==========================================
// EXERCISE 5: Cache Module with TTL
// ==========================================

/**
 * TODO: Create a cache module with time-to-live functionality
 *
 * The module should:
 * - Store cache entries with expiration times
 * - Automatically clean up expired entries
 * - Provide get, set, delete, and clear methods
 * - Support configurable default TTL
 */
const createCache = function (defaultTTL = 60000) {
  // Default 1 minute
  // TODO: Implement cache module with TTL

  return {
    // TODO: Add public methods
    // set(key, value, ttl), get(key), delete(key), clear(), size()
  };
};

// TODO: Test the cache module
// const cache = createCache(5000); // 5 second default TTL
// cache.set('user:1', { name: 'Alice' });
// cache.set('temp', 'data', 1000); // 1 second TTL

// ==========================================
// EXERCISE 6: State Machine Module
// ==========================================

/**
 * TODO: Create a state machine module
 *
 * The module should:
 * - Manage state transitions privately
 * - Define allowed transitions
 * - Provide methods to transition and query state
 * - Emit events on state changes
 */
const createStateMachine = function (initialState, transitions) {
  // TODO: Implement state machine module
  // transitions format: { currentState: { action: nextState } }

  return {
    // TODO: Add public methods
    // getState(), transition(action), canTransition(action), onStateChange(callback)
  };
};

// Example state machine configuration
const lightSwitchTransitions = {
  off: { turnOn: "on" },
  on: { turnOff: "off" }
};

// TODO: Test the state machine
// const lightSwitch = createStateMachine('off', lightSwitchTransitions);

// ==========================================
// EXERCISE 7: Logger Module with Levels
// ==========================================

/**
 * TODO: Create a logger module with different log levels
 *
 * The module should:
 * - Support multiple log levels (debug, info, warn, error)
 * - Allow setting minimum log level
 * - Format log messages consistently
 * - Optionally store log history
 */
const createLogger = function (config = {}) {
  // TODO: Implement logger module
  // Default config: { level: 'info', storeHistory: false, maxHistory: 100 }

  return {
    // TODO: Add public methods
    // debug(msg), info(msg), warn(msg), error(msg), setLevel(level), getHistory()
  };
};

// TODO: Test the logger
// const logger = createLogger({ level: 'warn', storeHistory: true });

// ==========================================
// EXERCISE 8: Validator Module
// ==========================================

/**
 * TODO: Create a validator module with chainable rules
 *
 * The module should:
 * - Store validation rules privately
 * - Provide chainable methods for adding rules
 * - Validate data against all rules
 * - Return detailed validation results
 */
const createValidator = function () {
  // TODO: Implement validator module

  return {
    // TODO: Add public methods
    // required(), minLength(n), maxLength(n), pattern(regex), custom(fn), validate(value)
  };
};

// TODO: Test the validator
// const emailValidator = createValidator()
//     .required()
//     .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
//     .minLength(5);

// ==========================================
// EXERCISE 9: Database Mock Module
// ==========================================

/**
 * TODO: Create a mock database module
 *
 * The module should:
 * - Store collections privately
 * - Provide CRUD operations
 * - Support simple queries
 * - Generate unique IDs automatically
 */
const createDatabase = function () {
  // TODO: Implement database module

  return {
    // TODO: Add public methods
    // createCollection(name), insert(collection, data), find(collection, query),
    // update(collection, id, data), delete(collection, id), count(collection)
  };
};

// TODO: Test the database module
// const db = createDatabase();
// db.createCollection('users');
// const userId = db.insert('users', { name: 'Alice', email: 'alice@example.com' });

// ==========================================
// EXERCISE 10: Namespace Module
// ==========================================

/**
 * TODO: Create a namespace module for organizing code
 *
 * The module should:
 * - Provide nested namespace creation
 * - Prevent namespace conflicts
 * - Allow attaching objects to namespaces
 * - Support dot notation access
 */
const createNamespace = function (root = {}) {
  // TODO: Implement namespace module

  return {
    // TODO: Add public methods
    // create(path), attach(path, object), get(path), exists(path), list(path)
  };
};

// TODO: Test the namespace module
// const ns = createNamespace();
// ns.create('MyApp.Utils.String');
// ns.attach('MyApp.Utils.String', { capitalize: str => str.charAt(0).toUpperCase() + str.slice(1) });

// ==========================================
// EXERCISE 11: Plugin System Module
// ==========================================

/**
 * TODO: Create a plugin system module
 *
 * The module should:
 * - Register and manage plugins
 * - Provide plugin lifecycle hooks
 * - Allow plugins to extend core functionality
 * - Handle plugin dependencies
 */
const createPluginSystem = function () {
  // TODO: Implement plugin system module

  return {
    // TODO: Add public methods
    // register(name, plugin), unregister(name), isRegistered(name),
    // getPlugin(name), listPlugins(), executeHook(hookName, data)
  };
};

// Example plugin
const samplePlugin = {
  name: "sample",
  version: "1.0.0",
  dependencies: [],
  init: function (system) {
    console.log("Sample plugin initialized");
  },
  hooks: {
    beforeAction: function (data) {
      console.log("Before action hook:", data);
    }
  }
};

// TODO: Test the plugin system
// const pluginSystem = createPluginSystem();
// pluginSystem.register('sample', samplePlugin);

// ==========================================
// REAL-WORLD EXAMPLE: API Client Module
// ==========================================

/**
 * TODO: Create a comprehensive API client module
 *
 * Combine multiple patterns:
 * - Configuration management
 * - Request/response interceptors
 * - Caching
 * - Error handling
 * - Rate limiting
 */
const createApiClient = function (baseConfig = {}) {
  // TODO: Implement comprehensive API client
  // Should support: interceptors, caching, retries, rate limiting

  return {
    // TODO: Add public methods
    // get(url, config), post(url, data, config), put(url, data, config),
    // delete(url, config), addInterceptor(type, fn), setCache(cache), setRateLimit(limit)
  };
};

// TODO: Create and test the API client
// const apiClient = createApiClient({ baseURL: 'https://api.example.com' });

console.log("Module Pattern exercises loaded. Implement the TODOs above!");
