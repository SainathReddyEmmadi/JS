/**
 * Exercise 15: Side Effects Management
 *
 * Understanding and managing side effects is crucial in functional programming.
 * This exercise covers identifying, isolating, and controlling side effects
 * to write more predictable and testable code.
 *
 * Difficulty: 🟡 Intermediate
 */

// ==========================================
// EXERCISE 1: Identifying Side Effects
// ==========================================

/**
 * TODO: Identify which functions have side effects and explain why
 *
 * For each function below, determine if it has side effects and refactor
 * the ones that do to minimize or eliminate side effects.
 */

// Global state
let globalCounter = 0;
let users = [];
let appConfig = { theme: "light", language: "en" };

// Function 1
function incrementCounter() {
  globalCounter++;
  return globalCounter;
}
// TODO: Does this have side effects? If yes, create a pure version.

// Function 2
function addUser(name, email) {
  const user = { id: Date.now(), name, email, createdAt: new Date() };
  users.push(user);
  console.log(`User ${name} added`);
  return user;
}
// TODO: Does this have side effects? If yes, create a pure version.

// Function 3
function calculateTax(amount, rate) {
  return amount * rate;
}
// TODO: Does this have side effects? If yes, create a pure version.

// Function 4
function updateUserProfile(userId, updates) {
  const user = users.find((u) => u.id === userId);
  if (user) {
    Object.assign(user, updates);
    localStorage.setItem("lastUpdated", Date.now());
  }
  return user;
}
// TODO: Does this have side effects? If yes, create a pure version.

// Function 5
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}
// TODO: Does this have side effects? If yes, create a pure version.

// ==========================================
// EXERCISE 2: Separating Pure and Impure Functions
// ==========================================

/**
 * TODO: Separate the following mixed function into pure and impure parts
 *
 * The function currently mixes business logic with side effects.
 * Split it into pure functions for logic and impure functions for effects.
 */

function processOrder(order) {
  // Validation
  if (!order.items || order.items.length === 0) {
    console.error("Order must have items");
    return null;
  }

  // Calculate total
  const total = order.items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  // Apply discount
  const discount = total > 100 ? total * 0.1 : 0;
  const finalTotal = total - discount;

  // Save to database
  const orderRecord = {
    id: Date.now(),
    ...order,
    total: finalTotal,
    discount,
    createdAt: new Date()
  };

  // Side effects
  console.log(`Order processed: $${finalTotal}`);
  localStorage.setItem("lastOrder", JSON.stringify(orderRecord));

  return orderRecord;
}

// TODO: Create pure functions for the business logic
function validateOrder(order) {
  // TODO: Pure validation logic
}

function calculateOrderTotal(items) {
  // TODO: Pure calculation logic
}

function applyDiscount(total) {
  // TODO: Pure discount logic
}

function createOrderRecord(order, total, discount) {
  // TODO: Pure object creation (without Date.now())
}

// TODO: Create impure functions for side effects
function logOrder(total) {
  // TODO: Logging side effect
}

function saveOrderToStorage(orderRecord) {
  // TODO: Storage side effect
}

// TODO: Compose the pure and impure functions
function processOrderRefactored(order) {
  // TODO: Use the separated functions
}

// ==========================================
// EXERCISE 3: Effect Management Patterns
// ==========================================

/**
 * TODO: Implement effect management patterns
 *
 * Create patterns to control when and how side effects occur.
 */

// Effect wrapper pattern
class Effect {
  constructor(operation) {
    this.operation = operation;
  }

  // TODO: Implement map method for transforming effects
  map(fn) {
    // TODO: Transform the effect without executing it
  }

  // TODO: Implement flatMap for chaining effects
  flatMap(fn) {
    // TODO: Chain effects together
  }

  // TODO: Implement run method to execute the effect
  run() {
    // TODO: Execute the wrapped operation
  }

  // TODO: Static method to create an effect
  static of(value) {
    // TODO: Wrap a pure value in an effect
  }
}

// TODO: Create effect constructors for common side effects
const log = (message) => new Effect(() => console.log(message));
const saveToStorage = (key, value) =>
  new Effect(() => localStorage.setItem(key, value));
const httpGet = (url) => new Effect(() => fetch(url));

// TODO: Test effect composition
// const composedEffect = log('Starting process')
//     .flatMap(() => saveToStorage('status', 'processing'))
//     .flatMap(() => log('Process complete'));

// ==========================================
// EXERCISE 4: IO Monad Pattern
// ==========================================

/**
 * TODO: Implement a simple IO monad for managing side effects
 *
 * The IO monad delays execution of side effects until explicitly run.
 */

class IO {
  constructor(computation) {
    this.computation = computation;
  }

  // TODO: Implement map for transforming IO values
  map(fn) {
    // TODO: Transform the result without executing
  }

  // TODO: Implement flatMap for chaining IO operations
  flatMap(fn) {
    // TODO: Chain IO operations together
  }

  // TODO: Implement run to execute the IO operation
  run() {
    // TODO: Execute the computation
  }

  // TODO: Static methods for common IO operations
  static of(value) {
    return new IO(() => value);
  }

  static fromEffect(effect) {
    return new IO(effect);
  }
}

// TODO: Create IO operations for common side effects
const readFile = (filename) =>
  new IO(() => {
    console.log(`Reading file: ${filename}`);
    return `Contents of ${filename}`;
  });

const writeFile = (filename, content) =>
  new IO(() => {
    console.log(`Writing to file: ${filename}`);
    return `Wrote: ${content}`;
  });

const httpRequest = (url) =>
  new IO(() => {
    console.log(`HTTP request to: ${url}`);
    return `Response from ${url}`;
  });

// TODO: Test IO monad composition
// const fileOperation = readFile('input.txt')
//     .map(content => content.toUpperCase())
//     .flatMap(content => writeFile('output.txt', content));

// ==========================================
// EXERCISE 5: Command Pattern for Side Effects
// ==========================================

/**
 * TODO: Implement the Command pattern to encapsulate side effects
 *
 * Commands allow you to queue, undo, and replay side effects.
 */

class Command {
  constructor(execute, undo = null) {
    this.execute = execute;
    this.undo = undo;
  }
}

class CommandManager {
  constructor() {
    this.history = [];
    this.currentIndex = -1;
  }

  // TODO: Execute a command and add to history
  executeCommand(command) {
    // TODO: Implement command execution with history tracking
  }

  // TODO: Undo the last command
  undoCommand() {
    // TODO: Implement undo functionality
  }

  // TODO: Redo a previously undone command
  redoCommand() {
    // TODO: Implement redo functionality
  }

  // TODO: Get command history
  getHistory() {
    // TODO: Return command history
  }
}

// TODO: Create specific commands for different side effects
const createLogCommand = (message) =>
  new Command(
    () => console.log(message),
    () => console.log(`Undoing log: ${message}`)
  );

const createStorageCommand = (key, value) =>
  new Command(
    () => localStorage.setItem(key, value),
    () => localStorage.removeItem(key)
  );

// TODO: Test command pattern
// const commandManager = new CommandManager();
// commandManager.executeCommand(createLogCommand('Hello World'));

// ==========================================
// EXERCISE 6: Event Sourcing Pattern
// ==========================================

/**
 * TODO: Implement event sourcing to track side effects as events
 *
 * Instead of directly mutating state, record events that describe
 * what happened and replay them to reconstruct state.
 */

class EventStore {
  constructor() {
    this.events = [];
  }

  // TODO: Add an event to the store
  addEvent(event) {
    // TODO: Store event with timestamp and sequence number
  }

  // TODO: Get all events for a specific aggregate
  getEvents(aggregateId) {
    // TODO: Return events for the specified aggregate
  }

  // TODO: Replay events to reconstruct state
  replayEvents(aggregateId, eventHandlers) {
    // TODO: Apply events to reconstruct current state
  }
}

// TODO: Create event types
const EventTypes = {
  USER_CREATED: "USER_CREATED",
  USER_UPDATED: "USER_UPDATED",
  USER_DELETED: "USER_DELETED"
};

// TODO: Create event creators (pure functions)
const createUserCreatedEvent = (userId, userData) => ({
  type: EventTypes.USER_CREATED,
  aggregateId: userId,
  data: userData,
  timestamp: Date.now()
});

// TODO: Create event handlers (pure functions)
const userEventHandlers = {
  [EventTypes.USER_CREATED]: (state, event) => ({
    ...state,
    [event.aggregateId]: event.data
  })
  // TODO: Add other event handlers
};

// TODO: Test event sourcing
// const eventStore = new EventStore();
// const event = createUserCreatedEvent('user1', { name: 'Alice', email: 'alice@example.com' });
// eventStore.addEvent(event);

// ==========================================
// EXERCISE 7: Dependency Injection for Side Effects
// ==========================================

/**
 * TODO: Use dependency injection to control side effects
 *
 * Instead of hardcoding side effects, inject them as dependencies
 * to make functions more testable and flexible.
 */

// TODO: Create interfaces for side effects
class Logger {
  log(message) {
    throw new Error("Not implemented");
  }
}

class Storage {
  save(key, value) {
    throw new Error("Not implemented");
  }

  load(key) {
    throw new Error("Not implemented");
  }
}

class HttpClient {
  get(url) {
    throw new Error("Not implemented");
  }

  post(url, data) {
    throw new Error("Not implemented");
  }
}

// TODO: Create concrete implementations
class ConsoleLogger extends Logger {
  log(message) {
    console.log(message);
  }
}

class LocalStorage extends Storage {
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  load(key) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
}

class FetchHttpClient extends HttpClient {
  async get(url) {
    const response = await fetch(url);
    return response.json();
  }

  async post(url, data) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

// TODO: Create functions that accept dependencies
function createUserService(logger, storage, httpClient) {
  return {
    async createUser(userData) {
      // TODO: Use injected dependencies instead of direct side effects
    },

    async getUserById(id) {
      // TODO: Use injected dependencies
    },

    async updateUser(id, updates) {
      // TODO: Use injected dependencies
    }
  };
}

// TODO: Test with different implementations
// const userService = createUserService(
//     new ConsoleLogger(),
//     new LocalStorage(),
//     new FetchHttpClient()
// );

// ==========================================
// EXERCISE 8: Side Effect Testing Strategies
// ==========================================

/**
 * TODO: Create strategies for testing code with side effects
 *
 * Show how to mock, stub, and test side effects properly.
 */

// Mock implementations for testing
class MockLogger extends Logger {
  constructor() {
    super();
    this.logs = [];
  }

  log(message) {
    this.logs.push({ message, timestamp: Date.now() });
  }

  getLogs() {
    return this.logs;
  }

  clear() {
    this.logs = [];
  }
}

class MockStorage extends Storage {
  constructor() {
    super();
    this.data = new Map();
  }

  save(key, value) {
    this.data.set(key, value);
  }

  load(key) {
    return this.data.get(key) || null;
  }

  clear() {
    this.data.clear();
  }
}

// TODO: Create test utilities
function createTestEnvironment() {
  return {
    logger: new MockLogger(),
    storage: new MockStorage(),
    httpClient: {
      responses: new Map(),
      get: function (url) {
        return Promise.resolve(this.responses.get(url) || {});
      },
      post: function (url, data) {
        return Promise.resolve({ success: true, data });
      },
      mockResponse: function (url, response) {
        this.responses.set(url, response);
      }
    }
  };
}

// TODO: Create test cases
async function testUserService() {
  const testEnv = createTestEnvironment();
  const userService = createUserService(
    testEnv.logger,
    testEnv.storage,
    testEnv.httpClient
  );

  // TODO: Write tests that verify side effects occurred correctly
  // Example: Test that user creation logs the right message
  // Example: Test that data is saved to storage
  // Example: Test that HTTP requests are made with correct parameters
}

// ==========================================
// EXERCISE 9: Functional Error Handling
// ==========================================

/**
 * TODO: Implement functional error handling patterns
 *
 * Handle errors without throwing exceptions, which are side effects.
 */

// Result type for error handling
class Result {
  constructor(value, error) {
    this.value = value;
    this.error = error;
  }

  static success(value) {
    return new Result(value, null);
  }

  static failure(error) {
    return new Result(null, error);
  }

  isSuccess() {
    return this.error === null;
  }

  isFailure() {
    return this.error !== null;
  }

  // TODO: Implement map for transforming successful values
  map(fn) {
    // TODO: Apply function only if result is successful
  }

  // TODO: Implement flatMap for chaining operations that return Results
  flatMap(fn) {
    // TODO: Chain operations that might fail
  }

  // TODO: Implement getOrElse for providing default values
  getOrElse(defaultValue) {
    // TODO: Return value or default if failure
  }
}

// TODO: Create functions that return Results instead of throwing
function safeDivide(a, b) {
  // TODO: Return Result.success or Result.failure
}

function safeParseInt(str) {
  // TODO: Return Result.success or Result.failure
}

function safeGetProperty(obj, prop) {
  // TODO: Return Result.success or Result.failure
}

// TODO: Test functional error handling
// const result = safeParseInt('42')
//     .flatMap(num => safeDivide(100, num))
//     .map(result => result * 2);

// ==========================================
// EXERCISE 10: Real-world Example
// ==========================================

/**
 * TODO: Create a real-world example that demonstrates proper side effect management
 *
 * Build a user registration system that:
 * - Validates input (pure)
 * - Checks for existing users (side effect)
 * - Hashes passwords (pure)
 * - Saves user to database (side effect)
 * - Sends welcome email (side effect)
 * - Logs the operation (side effect)
 */

// TODO: Implement the user registration system using the patterns above
function createUserRegistrationSystem(dependencies) {
  // TODO: Use dependency injection and proper side effect management

  return {
    async registerUser(userData) {
      // TODO: Implement registration with proper side effect management
    }
  };
}

// TODO: Test the registration system
// const registrationSystem = createUserRegistrationSystem({
//     logger: new MockLogger(),
//     storage: new MockStorage(),
//     emailService: { send: () => Promise.resolve() }
// });

console.log(
  "Side Effects Management exercises loaded. Implement the TODOs above!"
);
