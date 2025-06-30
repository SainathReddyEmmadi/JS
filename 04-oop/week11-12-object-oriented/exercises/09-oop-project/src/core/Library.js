/**
 * Library Management System - Core Library Class
 *
 * This is the main class that orchestrates the entire library system.
 * It demonstrates the Facade pattern and serves as the entry point for all operations.
 */

import { EventBus } from "./EventBus.js";
import { Database } from "./Database.js";

export class Library {
  // Private fields for encapsulation
  #eventBus;
  #database;
  #name;
  #isInitialized;
  #users;
  #books;
  #transactions;
  #notifications;

  constructor(name = "Central Library") {
    this.#name = name;
    this.#isInitialized = false;
    this.#users = new Map();
    this.#books = new Map();
    this.#transactions = [];
    this.#notifications = [];

    // Initialize core components
    this.#eventBus = new EventBus();
    this.#database = new Database();

    // Set up event listeners
    this.#setupEventListeners();

    console.log(`Library "${this.#name}" created`);
  }

  // Private method to set up event listeners
  #setupEventListeners() {
    // TODO: Implement event listeners for system-wide events
    // Listen for book borrowed events, user registered events, etc.

    this.#eventBus.on("user.registered", (userData) => {
      console.log(`New user registered: ${userData.name}`);
    });

    this.#eventBus.on("book.borrowed", (transactionData) => {
      console.log(
        `Book borrowed: ${transactionData.bookTitle} by ${transactionData.userName}`
      );
    });

    this.#eventBus.on("book.returned", (transactionData) => {
      console.log(
        `Book returned: ${transactionData.bookTitle} by ${transactionData.userName}`
      );
    });
  }

  // Initialize the library system
  async initialize() {
    if (this.#isInitialized) {
      throw new Error("Library system is already initialized");
    }

    try {
      // Initialize database
      await this.#database.connect();

      // Load existing data
      await this.#loadData();

      this.#isInitialized = true;

      // Emit system initialized event
      this.#eventBus.emit("system.initialized", {
        libraryName: this.#name,
        timestamp: new Date()
      });

      console.log(`Library system "${this.#name}" initialized successfully`);
      return true;
    } catch (error) {
      console.error("Failed to initialize library system:", error.message);
      throw error;
    }
  }

  // Private method to load existing data
  async #loadData() {
    try {
      // TODO: Load data from database
      // This would typically load users, books, and transactions from persistent storage

      const savedData = await this.#database.loadAll();

      if (savedData.users) {
        this.#users = new Map(savedData.users);
      }

      if (savedData.books) {
        this.#books = new Map(savedData.books);
      }

      if (savedData.transactions) {
        this.#transactions = savedData.transactions;
      }

      console.log("Data loaded successfully");
    } catch (error) {
      console.warn("No existing data found or failed to load:", error.message);
      // Continue with empty data
    }
  }

  // Public method to register a user
  registerUser(user) {
    this.#checkInitialized();

    if (this.#users.has(user.id)) {
      throw new Error(`User with ID ${user.id} already exists`);
    }

    this.#users.set(user.id, user);

    // Emit user registered event
    this.#eventBus.emit("user.registered", {
      userId: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    // Save to database
    this.#database.saveUser(user);

    return user;
  }

  // Public method to add a book to the catalog
  addBook(book) {
    this.#checkInitialized();

    if (this.#books.has(book.id)) {
      throw new Error(`Book with ID ${book.id} already exists`);
    }

    this.#books.set(book.id, book);

    // Emit book added event
    this.#eventBus.emit("book.added", {
      bookId: book.id,
      title: book.title,
      author: book.author,
      type: book.constructor.name
    });

    // Save to database
    this.#database.saveBook(book);

    return book;
  }

  // Public method to borrow a book
  borrowBook(userId, bookId) {
    this.#checkInitialized();

    const user = this.#users.get(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const book = this.#books.get(bookId);
    if (!book) {
      throw new Error(`Book with ID ${bookId} not found`);
    }

    if (!book.isAvailable()) {
      throw new Error(`Book "${book.title}" is not available for borrowing`);
    }

    // Create transaction (using Command pattern - to be implemented)
    const transaction = this.#createBorrowTransaction(user, book);

    // Execute the transaction
    transaction.execute();

    // Add to transactions history
    this.#transactions.push(transaction);

    // Emit book borrowed event
    this.#eventBus.emit("book.borrowed", {
      userId: user.id,
      userName: user.name,
      bookId: book.id,
      bookTitle: book.title,
      dueDate: transaction.dueDate,
      timestamp: new Date()
    });

    return transaction;
  }

  // Public method to return a book
  returnBook(userId, bookId) {
    this.#checkInitialized();

    const user = this.#users.get(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const book = this.#books.get(bookId);
    if (!book) {
      throw new Error(`Book with ID ${bookId} not found`);
    }

    // Find the active borrow transaction
    const borrowTransaction = this.#transactions.find(
      (t) =>
        t.userId === userId &&
        t.bookId === bookId &&
        t.type === "borrow" &&
        t.status === "active"
    );

    if (!borrowTransaction) {
      throw new Error(
        `No active borrow transaction found for this book and user`
      );
    }

    // Create return transaction
    const returnTransaction = this.#createReturnTransaction(
      user,
      book,
      borrowTransaction
    );

    // Execute the transaction
    returnTransaction.execute();

    // Add to transactions history
    this.#transactions.push(returnTransaction);

    // Emit book returned event
    this.#eventBus.emit("book.returned", {
      userId: user.id,
      userName: user.name,
      bookId: book.id,
      bookTitle: book.title,
      returnDate: returnTransaction.returnDate,
      lateFee: returnTransaction.lateFee || 0,
      timestamp: new Date()
    });

    return returnTransaction;
  }

  // Search books in the catalog
  searchBooks(criteria) {
    this.#checkInitialized();

    const results = [];

    for (const book of this.#books.values()) {
      if (this.#bookMatchesCriteria(book, criteria)) {
        results.push(book);
      }
    }

    return results;
  }

  // Get user by ID
  getUser(userId) {
    this.#checkInitialized();
    return this.#users.get(userId);
  }

  // Get book by ID
  getBook(bookId) {
    this.#checkInitialized();
    return this.#books.get(bookId);
  }

  // Get all users (returns copy)
  getAllUsers() {
    this.#checkInitialized();
    return Array.from(this.#users.values());
  }

  // Get all books (returns copy)
  getAllBooks() {
    this.#checkInitialized();
    return Array.from(this.#books.values());
  }

  // Get transaction history
  getTransactionHistory(filter = {}) {
    this.#checkInitialized();

    let transactions = [...this.#transactions];

    if (filter.userId) {
      transactions = transactions.filter((t) => t.userId === filter.userId);
    }

    if (filter.bookId) {
      transactions = transactions.filter((t) => t.bookId === filter.bookId);
    }

    if (filter.type) {
      transactions = transactions.filter((t) => t.type === filter.type);
    }

    return transactions;
  }

  // Get system statistics
  getSystemStats() {
    this.#checkInitialized();

    const totalBooks = this.#books.size;
    const availableBooks = Array.from(this.#books.values()).filter((book) =>
      book.isAvailable()
    ).length;
    const borrowedBooks = totalBooks - availableBooks;
    const totalUsers = this.#users.size;
    const totalTransactions = this.#transactions.length;

    return {
      library: this.#name,
      totalBooks,
      availableBooks,
      borrowedBooks,
      totalUsers,
      totalTransactions,
      isInitialized: this.#isInitialized
    };
  }

  // Subscribe to events
  on(eventName, callback) {
    return this.#eventBus.on(eventName, callback);
  }

  // Unsubscribe from events
  off(eventName, callback) {
    return this.#eventBus.off(eventName, callback);
  }

  // Private helper methods

  #checkInitialized() {
    if (!this.#isInitialized) {
      throw new Error(
        "Library system is not initialized. Call initialize() first."
      );
    }
  }

  #createBorrowTransaction(user, book) {
    // TODO: Implement transaction creation using Command pattern
    // This is a placeholder - you should implement proper Transaction classes

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 2 weeks from now

    return {
      id: this.#generateTransactionId(),
      type: "borrow",
      userId: user.id,
      bookId: book.id,
      borrowDate: new Date(),
      dueDate: dueDate,
      status: "active",
      execute() {
        book.borrow(user.id);
      }
    };
  }

  #createReturnTransaction(user, book, borrowTransaction) {
    // TODO: Implement return transaction with late fee calculation

    const returnDate = new Date();
    const lateFee = this.#calculateLateFee(
      borrowTransaction.dueDate,
      returnDate
    );

    return {
      id: this.#generateTransactionId(),
      type: "return",
      userId: user.id,
      bookId: book.id,
      borrowTransactionId: borrowTransaction.id,
      returnDate: returnDate,
      lateFee: lateFee,
      status: "completed",
      execute() {
        book.return();
        borrowTransaction.status = "completed";
      }
    };
  }

  #calculateLateFee(dueDate, returnDate) {
    const daysLate = Math.max(
      0,
      Math.ceil((returnDate - dueDate) / (1000 * 60 * 60 * 24))
    );
    return daysLate * 0.5; // $0.50 per day late
  }

  #bookMatchesCriteria(book, criteria) {
    if (
      criteria.title &&
      !book.title.toLowerCase().includes(criteria.title.toLowerCase())
    ) {
      return false;
    }

    if (
      criteria.author &&
      !book.author.toLowerCase().includes(criteria.author.toLowerCase())
    ) {
      return false;
    }

    if (criteria.isbn && book.isbn !== criteria.isbn) {
      return false;
    }

    if (
      criteria.available !== undefined &&
      book.isAvailable() !== criteria.available
    ) {
      return false;
    }

    return true;
  }

  #generateTransactionId() {
    return (
      "TXN-" +
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).substr(2, 9)
    );
  }

  // Getter for library name
  get name() {
    return this.#name;
  }

  // Getter for initialization status
  get isInitialized() {
    return this.#isInitialized;
  }

  // Method to gracefully shutdown the system
  async shutdown() {
    if (!this.#isInitialized) {
      return;
    }

    try {
      // Save all current data
      await this.#database.saveAll({
        users: Array.from(this.#users.entries()),
        books: Array.from(this.#books.entries()),
        transactions: this.#transactions
      });

      // Disconnect from database
      await this.#database.disconnect();

      // Clear event listeners
      this.#eventBus.removeAllListeners();

      this.#isInitialized = false;

      console.log(`Library system "${this.#name}" shutdown successfully`);
    } catch (error) {
      console.error("Error during shutdown:", error.message);
      throw error;
    }
  }
}

// Export as default for convenience
export default Library;
