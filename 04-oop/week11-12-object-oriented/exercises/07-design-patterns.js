/**
 * Exercise 7: Design Patterns
 *
 * Implement and practice common design patterns in JavaScript OOP
 */

console.log("=== Exercise 7: Design Patterns ===\n");

// PART 1: Creational Patterns
console.log("PART 1: Creational Patterns");

/*
 * TODO 1.1: Implement Singleton Pattern
 */

class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    // Your code here
    // Initialize connection properties
    this.connected = false;
    this.host = "localhost";
    this.port = 5432;
    this.database = "myapp";

    DatabaseConnection.instance = this;
    return this;
  }

  connect() {
    // Your code here
    // Simulate database connection
  }

  disconnect() {
    // Your code here
    // Simulate database disconnection
  }

  query(sql) {
    // Your code here
    // Simulate database query
  }

  getConnectionInfo() {
    // Your code here
    // Return connection information
  }

  // Static method to get instance
  static getInstance() {
    // Your code here
    // Return single instance
  }
}

// Test Singleton pattern
const db1 = new DatabaseConnection();
const db2 = new DatabaseConnection();
const db3 = DatabaseConnection.getInstance();

console.log("Same instance?", db1 === db2); // Should be true
console.log("Same instance?", db1 === db3); // Should be true

db1.connect();
console.log("DB1 connected:", db1.getConnectionInfo());
console.log("DB2 connected:", db2.getConnectionInfo()); // Should show same state

/*
 * TODO 1.2: Implement Factory Pattern
 */

class VehicleFactory {
  // Your code here
  // Create method to determine which vehicle to create based on type
  static createVehicle(type, ...args) {
    // Your implementation here
  }
}

// Vehicle classes for factory
class Car {
  constructor(make, model, doors) {
    // Your code here
  }

  getInfo() {
    // Your code here
  }

  start() {
    // Your code here
  }
}

class Motorcycle {
  constructor(make, model, engineSize) {
    // Your code here
  }

  getInfo() {
    // Your code here
  }

  start() {
    // Your code here
  }
}

class Truck {
  constructor(make, model, capacity) {
    // Your code here
  }

  getInfo() {
    // Your code here
  }

  start() {
    // Your code here
  }
}

// Test Factory pattern
const vehicles = [
  VehicleFactory.createVehicle("car", "Toyota", "Camry", 4),
  VehicleFactory.createVehicle("motorcycle", "Harley", "Sportster", "883cc"),
  VehicleFactory.createVehicle("truck", "Ford", "F-150", "1000 lbs")
];

vehicles.forEach((vehicle) => {
  console.log(vehicle.getInfo());
  console.log(vehicle.start());
});

/*
 * TODO 1.3: Implement Builder Pattern
 */

class Pizza {
  constructor() {
    this.size = "";
    this.crust = "";
    this.toppings = [];
    this.cheese = "";
    this.sauce = "";
  }

  getDescription() {
    return `${this.size} ${this.crust} crust pizza with ${
      this.cheese
    } cheese, ${this.sauce} sauce, and toppings: ${this.toppings.join(", ")}`;
  }
}

class PizzaBuilder {
  constructor() {
    this.pizza = new Pizza();
  }

  // Your code here
  // Implement fluent interface methods for building pizza

  setSize(size) {
    // Your code here
    // Return this for chaining
  }

  setCrust(crust) {
    // Your code here
  }

  addTopping(topping) {
    // Your code here
  }

  setCheese(cheese) {
    // Your code here
  }

  setSauce(sauce) {
    // Your code here
  }

  build() {
    // Your code here
    // Return the completed pizza
  }
}

// Test Builder pattern
const pizza = new PizzaBuilder()
  .setSize("Large")
  .setCrust("Thin")
  .setCheese("Mozzarella")
  .setSauce("Marinara")
  .addTopping("Pepperoni")
  .addTopping("Mushrooms")
  .addTopping("Bell Peppers")
  .build();

console.log("Built pizza:", pizza.getDescription());

// PART 2: Structural Patterns
console.log("\nPART 2: Structural Patterns");

/*
 * TODO 2.1: Implement Adapter Pattern
 */

// Legacy payment system
class LegacyPaymentGateway {
  makePayment(amount) {
    return `Legacy payment of $${amount} processed`;
  }

  getTransactionId() {
    return Math.random().toString(36).substr(2, 9);
  }
}

// New payment interface
class ModernPaymentInterface {
  processPayment(paymentData) {
    throw new Error("processPayment method must be implemented");
  }

  getPaymentStatus(transactionId) {
    throw new Error("getPaymentStatus method must be implemented");
  }
}

// Adapter to make legacy system work with new interface
class PaymentAdapter extends ModernPaymentInterface {
  constructor(legacyGateway) {
    // Your code here
    // Store reference to legacy gateway
  }

  processPayment(paymentData) {
    // Your code here
    // Adapt the new interface to work with legacy system
    // paymentData should have { amount, currency, method }
    // Convert and call legacy system
  }

  getPaymentStatus(transactionId) {
    // Your code here
    // Simulate status check for legacy system
  }
}

// Test Adapter pattern
const legacyGateway = new LegacyPaymentGateway();
const adapter = new PaymentAdapter(legacyGateway);

const paymentData = {
  amount: 99.99,
  currency: "USD",
  method: "credit_card"
};

const result = adapter.processPayment(paymentData);
console.log("Adapter result:", result);

/*
 * TODO 2.2: Implement Decorator Pattern
 */

// Base coffee class
class Coffee {
  constructor() {
    this.description = "Simple coffee";
    this.cost = 2.0;
  }

  getDescription() {
    return this.description;
  }

  getCost() {
    return this.cost;
  }
}

// Base decorator
class CoffeeDecorator extends Coffee {
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

// Concrete decorators
class MilkDecorator extends CoffeeDecorator {
  constructor(coffee) {
    // Your code here
  }

  getDescription() {
    // Your code here
    // Add milk to description
  }

  getCost() {
    // Your code here
    // Add milk cost
  }
}

class SugarDecorator extends CoffeeDecorator {
  constructor(coffee) {
    // Your code here
  }

  getDescription() {
    // Your code here
  }

  getCost() {
    // Your code here
  }
}

class VanillaDecorator extends CoffeeDecorator {
  constructor(coffee) {
    // Your code here
  }

  getDescription() {
    // Your code here
  }

  getCost() {
    // Your code here
  }
}

class WhipCreamDecorator extends CoffeeDecorator {
  constructor(coffee) {
    // Your code here
  }

  getDescription() {
    // Your code here
  }

  getCost() {
    // Your code here
  }
}

// Test Decorator pattern
let coffee = new Coffee();
console.log(`${coffee.getDescription()} - $${coffee.getCost()}`);

coffee = new MilkDecorator(coffee);
console.log(`${coffee.getDescription()} - $${coffee.getCost()}`);

coffee = new SugarDecorator(coffee);
coffee = new VanillaDecorator(coffee);
coffee = new WhipCreamDecorator(coffee);
console.log(`${coffee.getDescription()} - $${coffee.getCost()}`);

/*
 * TODO 2.3: Implement Facade Pattern
 */

// Complex subsystems
class CPU {
  start() {
    return "CPU started";
  }

  shutdown() {
    return "CPU shutdown";
  }

  getUsage() {
    return Math.floor(Math.random() * 100);
  }
}

class Memory {
  load() {
    return "Memory loaded";
  }

  clear() {
    return "Memory cleared";
  }

  getUsage() {
    return Math.floor(Math.random() * 100);
  }
}

class HardDrive {
  read() {
    return "Data read from hard drive";
  }

  write(data) {
    return `Data "${data}" written to hard drive`;
  }

  getUsage() {
    return Math.floor(Math.random() * 100);
  }
}

// Facade to simplify complex subsystem
class ComputerFacade {
  constructor() {
    // Your code here
    // Initialize subsystem components
  }

  startComputer() {
    // Your code here
    // Coordinate startup of all subsystems
  }

  shutdownComputer() {
    // Your code here
    // Coordinate shutdown of all subsystems
  }

  saveFile(filename, data) {
    // Your code here
    // Coordinate file saving operation
  }

  getSystemStatus() {
    // Your code here
    // Get status from all subsystems
  }
}

// Test Facade pattern
const computer = new ComputerFacade();
console.log("Computer startup:", computer.startComputer());
console.log("Save file:", computer.saveFile("document.txt", "Hello World"));
console.log("System status:", computer.getSystemStatus());
console.log("Computer shutdown:", computer.shutdownComputer());

// PART 3: Behavioral Patterns
console.log("\nPART 3: Behavioral Patterns");

/*
 * TODO 3.1: Implement Observer Pattern
 */

class Observable {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    // Your code here
    // Add observer to the list
  }

  unsubscribe(observer) {
    // Your code here
    // Remove observer from the list
  }

  notify(data) {
    // Your code here
    // Notify all observers with data
  }
}

class NewsAgency extends Observable {
  constructor() {
    super();
    this.news = "";
  }

  setNews(news) {
    // Your code here
    // Set news and notify observers
  }

  getNews() {
    return this.news;
  }
}

class NewsChannel {
  constructor(name) {
    this.name = name;
    this.news = "";
  }

  update(news) {
    // Your code here
    // Update method called by observable
  }

  getNews() {
    return this.news;
  }
}

// Test Observer pattern
const agency = new NewsAgency();
const cnn = new NewsChannel("CNN");
const bbc = new NewsChannel("BBC");
const fox = new NewsChannel("Fox News");

agency.subscribe(cnn);
agency.subscribe(bbc);
agency.subscribe(fox);

agency.setNews("Breaking: Major tech announcement!");

console.log("CNN news:", cnn.getNews());
console.log("BBC news:", bbc.getNews());
console.log("Fox news:", fox.getNews());

agency.unsubscribe(fox);
agency.setNews("Update: Tech stocks soar!");

console.log("After unsubscribe:");
console.log("CNN news:", cnn.getNews());
console.log("BBC news:", bbc.getNews());
console.log("Fox news:", fox.getNews()); // Should be old news

/*
 * TODO 3.2: Implement Strategy Pattern
 */

// Strategy interface
class PaymentStrategy {
  pay(amount) {
    throw new Error("pay method must be implemented");
  }

  getPaymentInfo() {
    throw new Error("getPaymentInfo method must be implemented");
  }
}

// Concrete strategies
class CreditCardStrategy extends PaymentStrategy {
  constructor(cardNumber, expiryDate, cvv) {
    super();
    // Your code here
    // Store credit card details (in real app, encrypt these)
  }

  pay(amount) {
    // Your code here
    // Implement credit card payment logic
  }

  getPaymentInfo() {
    // Your code here
    // Return masked card info
  }
}

class PayPalStrategy extends PaymentStrategy {
  constructor(email, password) {
    super();
    // Your code here
  }

  pay(amount) {
    // Your code here
  }

  getPaymentInfo() {
    // Your code here
  }
}

class CryptoStrategy extends PaymentStrategy {
  constructor(walletAddress, privateKey) {
    super();
    // Your code here
  }

  pay(amount) {
    // Your code here
  }

  getPaymentInfo() {
    // Your code here
  }
}

// Context class
class ShoppingCart {
  constructor() {
    this.items = [];
    this.paymentStrategy = null;
  }

  addItem(item, price) {
    // Your code here
    // Add item to cart
  }

  removeItem(item) {
    // Your code here
    // Remove item from cart
  }

  calculateTotal() {
    // Your code here
    // Calculate total price
  }

  setPaymentStrategy(strategy) {
    // Your code here
    // Set payment strategy
  }

  checkout() {
    // Your code here
    // Use strategy to process payment
  }

  getCartInfo() {
    // Your code here
    // Return cart information
  }
}

// Test Strategy pattern
const cart = new ShoppingCart();
cart.addItem("Laptop", 999.99);
cart.addItem("Mouse", 29.99);
cart.addItem("Keyboard", 79.99);

console.log("Cart info:", cart.getCartInfo());

// Pay with credit card
const creditCard = new CreditCardStrategy(
  "1234-5678-9012-3456",
  "12/25",
  "123"
);
cart.setPaymentStrategy(creditCard);
console.log("Credit card checkout:", cart.checkout());

// Pay with PayPal
const paypal = new PayPalStrategy("user@example.com", "password");
cart.setPaymentStrategy(paypal);
console.log("PayPal checkout:", cart.checkout());

/*
 * TODO 3.3: Implement Command Pattern
 */

// Command interface
class Command {
  execute() {
    throw new Error("execute method must be implemented");
  }

  undo() {
    throw new Error("undo method must be implemented");
  }
}

// Receiver
class TextEditor {
  constructor() {
    this.content = "";
    this.clipboard = "";
  }

  insertText(text, position = this.content.length) {
    this.content =
      this.content.slice(0, position) + text + this.content.slice(position);
  }

  deleteText(start, length) {
    const deleted = this.content.slice(start, start + length);
    this.content =
      this.content.slice(0, start) + this.content.slice(start + length);
    return deleted;
  }

  getContent() {
    return this.content;
  }

  setClipboard(text) {
    this.clipboard = text;
  }

  getClipboard() {
    return this.clipboard;
  }
}

// Concrete commands
class InsertCommand extends Command {
  constructor(editor, text, position) {
    super();
    // Your code here
    // Store editor reference and command parameters
  }

  execute() {
    // Your code here
    // Execute insert operation
  }

  undo() {
    // Your code here
    // Undo insert operation
  }
}

class DeleteCommand extends Command {
  constructor(editor, start, length) {
    super();
    // Your code here
  }

  execute() {
    // Your code here
    // Store deleted text for undo, then delete
  }

  undo() {
    // Your code here
    // Restore deleted text
  }
}

class CopyCommand extends Command {
  constructor(editor, start, length) {
    super();
    // Your code here
  }

  execute() {
    // Your code here
    // Copy text to clipboard
  }

  undo() {
    // Your code here
    // Commands like copy might not need undo
  }
}

class PasteCommand extends Command {
  constructor(editor, position) {
    super();
    // Your code here
  }

  execute() {
    // Your code here
    // Paste from clipboard
  }

  undo() {
    // Your code here
    // Remove pasted text
  }
}

// Invoker
class EditorInvoker {
  constructor(editor) {
    this.editor = editor;
    this.history = [];
    this.currentPosition = -1;
  }

  executeCommand(command) {
    // Your code here
    // Execute command and add to history
    // Remove any commands after current position (for redo functionality)
  }

  undo() {
    // Your code here
    // Undo last command
  }

  redo() {
    // Your code here
    // Redo next command
  }

  canUndo() {
    // Your code here
  }

  canRedo() {
    // Your code here
  }
}

// Test Command pattern
const editor = new TextEditor();
const invoker = new EditorInvoker(editor);

// Execute commands
invoker.executeCommand(new InsertCommand(editor, "Hello ", 0));
invoker.executeCommand(new InsertCommand(editor, "World!", 6));
console.log("After inserts:", editor.getContent());

invoker.executeCommand(new CopyCommand(editor, 0, 5)); // Copy "Hello"
invoker.executeCommand(new PasteCommand(editor, 12)); // Paste at end
console.log("After copy/paste:", editor.getContent());

// Test undo/redo
console.log("Can undo:", invoker.canUndo());
invoker.undo();
console.log("After undo:", editor.getContent());

invoker.undo();
console.log("After second undo:", editor.getContent());

console.log("Can redo:", invoker.canRedo());
invoker.redo();
console.log("After redo:", editor.getContent());

// BONUS CHALLENGES
console.log("\n=== BONUS CHALLENGES ===");

/*
 * BONUS 1: Implement State Pattern
 */

class State {
  constructor(context) {
    this.context = context;
  }

  handle() {
    throw new Error("handle method must be implemented");
  }
}

class VendingMachine {
  constructor() {
    // Your code here
    // Initialize states and set initial state
    this.states = {
      idle: new IdleState(this),
      hasQuarter: new HasQuarterState(this),
      noQuarter: new NoQuarterState(this),
      soldOut: new SoldOutState(this)
    };

    this.currentState = this.states.noQuarter;
    this.count = 5; // Number of items
  }

  insertQuarter() {
    this.currentState.insertQuarter();
  }

  ejectQuarter() {
    this.currentState.ejectQuarter();
  }

  turnCrank() {
    this.currentState.turnCrank();
    this.currentState.dispense();
  }

  setState(state) {
    this.currentState = state;
  }

  releaseBall() {
    console.log("Item dispensed!");
    this.count--;
  }

  getCount() {
    return this.count;
  }

  refill(count) {
    this.count = count;
    this.setState(this.states.noQuarter);
  }
}

class NoQuarterState extends State {
  insertQuarter() {
    // Your code here
    // Transition to hasQuarter state
  }

  ejectQuarter() {
    // Your code here
    // Can't eject when no quarter
  }

  turnCrank() {
    // Your code here
    // Can't turn crank without quarter
  }

  dispense() {
    // Your code here
    // Can't dispense without quarter
  }
}

class HasQuarterState extends State {
  insertQuarter() {
    // Your code here
    // Already has quarter
  }

  ejectQuarter() {
    // Your code here
    // Return quarter and go to noQuarter state
  }

  turnCrank() {
    // Your code here
    // Go to idle state
  }

  dispense() {
    // Your code here
    // Dispense item and determine next state
  }
}

class IdleState extends State {
  insertQuarter() {
    // Your code here
  }

  ejectQuarter() {
    // Your code here
  }

  turnCrank() {
    // Your code here
  }

  dispense() {
    // Your code here
  }
}

class SoldOutState extends State {
  insertQuarter() {
    // Your code here
    // Reject quarter when sold out
  }

  ejectQuarter() {
    // Your code here
  }

  turnCrank() {
    // Your code here
  }

  dispense() {
    // Your code here
  }
}

// Test State pattern
const vendingMachine = new VendingMachine();
console.log("Vending machine test:");

vendingMachine.insertQuarter();
vendingMachine.turnCrank();
console.log("Items left:", vendingMachine.getCount());

vendingMachine.insertQuarter();
vendingMachine.ejectQuarter();

/*
 * BONUS 2: Implement Chain of Responsibility Pattern
 */

class Handler {
  constructor() {
    this.nextHandler = null;
  }

  setNext(handler) {
    this.nextHandler = handler;
    return handler; // For chaining
  }

  handle(request) {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return null;
  }
}

class SupportTicket {
  constructor(priority, description, customerType) {
    this.priority = priority; // 'low', 'medium', 'high', 'critical'
    this.description = description;
    this.customerType = customerType; // 'basic', 'premium', 'enterprise'
    this.resolved = false;
    this.assignedTo = null;
  }
}

class Level1Support extends Handler {
  handle(ticket) {
    // Your code here
    // Handle low priority tickets for any customer type
    // Pass others to next handler
  }
}

class Level2Support extends Handler {
  handle(ticket) {
    // Your code here
    // Handle medium priority tickets or premium customers
  }
}

class Level3Support extends Handler {
  handle(ticket) {
    // Your code here
    // Handle high priority tickets or enterprise customers
  }
}

class ManagerSupport extends Handler {
  handle(ticket) {
    // Your code here
    // Handle critical tickets
  }
}

// Test Chain of Responsibility
const level1 = new Level1Support();
const level2 = new Level2Support();
const level3 = new Level3Support();
const manager = new ManagerSupport();

level1.setNext(level2).setNext(level3).setNext(manager);

const tickets = [
  new SupportTicket("low", "Password reset", "basic"),
  new SupportTicket("medium", "Feature not working", "premium"),
  new SupportTicket("high", "Data loss issue", "basic"),
  new SupportTicket("critical", "System down", "enterprise")
];

tickets.forEach((ticket, index) => {
  console.log(`Processing ticket ${index + 1}:`);
  level1.handle(ticket);
  console.log(
    `Assigned to: ${ticket.assignedTo}, Resolved: ${ticket.resolved}`
  );
});

console.log("\n=== Exercise 7 Complete! ===");

/*
 * SELF-CHECK QUESTIONS:
 * 1. When would you use the Singleton pattern and what are its drawbacks?
 * 2. How does the Factory pattern promote loose coupling?
 * 3. What's the difference between the Adapter and Facade patterns?
 * 4. How does the Observer pattern enable event-driven programming?
 * 5. When would you choose Strategy pattern over inheritance?
 * 6. What are the benefits of the Command pattern for implementing undo/redo?
 * 7. How does the State pattern differ from using conditional statements?
 * 8. What problems does the Chain of Responsibility pattern solve?
 */
