/**
 * Database - Simulated data persistence layer
 *
 * Provides data storage and retrieval functionality.
 * In a real application, this would connect to an actual database.
 * For this demo, we simulate database operations using localStorage.
 */

export class Database {
  #isConnected;
  #connectionString;
  #storage;
  #schemas;

  constructor(connectionString = "library_management_db") {
    this.#isConnected = false;
    this.#connectionString = connectionString;
    this.#storage = new Map(); // In-memory storage
    this.#schemas = new Map(); // Schema definitions

    // Initialize schemas
    this.#initializeSchemas();
  }

  // Initialize database schemas
  #initializeSchemas() {
    // User schema
    this.#schemas.set("users", {
      id: { type: "string", required: true, unique: true },
      name: { type: "string", required: true },
      email: { type: "string", required: true, unique: true },
      role: {
        type: "string",
        required: true,
        enum: ["member", "librarian", "admin"]
      },
      createdAt: { type: "date", required: true },
      updatedAt: { type: "date", required: true }
    });

    // Book schema
    this.#schemas.set("books", {
      id: { type: "string", required: true, unique: true },
      title: { type: "string", required: true },
      author: { type: "string", required: true },
      isbn: { type: "string", required: true, unique: true },
      type: { type: "string", required: true },
      isAvailable: { type: "boolean", required: true },
      createdAt: { type: "date", required: true },
      updatedAt: { type: "date", required: true }
    });

    // Transaction schema
    this.#schemas.set("transactions", {
      id: { type: "string", required: true, unique: true },
      type: { type: "string", required: true, enum: ["borrow", "return"] },
      userId: { type: "string", required: true },
      bookId: { type: "string", required: true },
      timestamp: { type: "date", required: true },
      status: {
        type: "string",
        required: true,
        enum: ["active", "completed", "overdue"]
      }
    });
  }

  // Connect to the database
  async connect() {
    if (this.#isConnected) {
      throw new Error("Database is already connected");
    }

    try {
      // Simulate connection delay
      await this.#simulateDelay(100);

      // Initialize storage tables
      this.#storage.set("users", new Map());
      this.#storage.set("books", new Map());
      this.#storage.set("transactions", []);

      // Load data from localStorage if available
      await this.#loadFromLocalStorage();

      this.#isConnected = true;
      console.log(`Connected to database: ${this.#connectionString}`);
    } catch (error) {
      console.error("Failed to connect to database:", error);
      throw error;
    }
  }

  // Disconnect from the database
  async disconnect() {
    if (!this.#isConnected) {
      return;
    }

    try {
      // Save data to localStorage before disconnecting
      await this.#saveToLocalStorage();

      // Simulate disconnection delay
      await this.#simulateDelay(50);

      this.#isConnected = false;
      console.log("Disconnected from database");
    } catch (error) {
      console.error("Error during database disconnection:", error);
      throw error;
    }
  }

  // Save a user
  async saveUser(user) {
    this.#checkConnection();

    try {
      // Validate user data
      this.#validateData("users", user);

      // Get users table
      const usersTable = this.#storage.get("users");

      // Check for duplicate email
      for (const existingUser of usersTable.values()) {
        if (existingUser.email === user.email && existingUser.id !== user.id) {
          throw new Error(`User with email ${user.email} already exists`);
        }
      }

      // Add timestamps
      const now = new Date();
      const userData = {
        ...user,
        createdAt: user.createdAt || now,
        updatedAt: now
      };

      // Save to storage
      usersTable.set(user.id, userData);

      // Simulate save delay
      await this.#simulateDelay(10);

      console.log(`User saved: ${user.name}`);
      return userData;
    } catch (error) {
      console.error("Failed to save user:", error);
      throw error;
    }
  }

  // Save a book
  async saveBook(book) {
    this.#checkConnection();

    try {
      // Validate book data
      this.#validateData("books", book);

      // Get books table
      const booksTable = this.#storage.get("books");

      // Check for duplicate ISBN
      for (const existingBook of booksTable.values()) {
        if (existingBook.isbn === book.isbn && existingBook.id !== book.id) {
          throw new Error(`Book with ISBN ${book.isbn} already exists`);
        }
      }

      // Add timestamps
      const now = new Date();
      const bookData = {
        ...book,
        createdAt: book.createdAt || now,
        updatedAt: now
      };

      // Save to storage
      booksTable.set(book.id, bookData);

      // Simulate save delay
      await this.#simulateDelay(10);

      console.log(`Book saved: ${book.title}`);
      return bookData;
    } catch (error) {
      console.error("Failed to save book:", error);
      throw error;
    }
  }

  // Save a transaction
  async saveTransaction(transaction) {
    this.#checkConnection();

    try {
      // Validate transaction data
      this.#validateData("transactions", transaction);

      // Get transactions table
      const transactionsTable = this.#storage.get("transactions");

      // Add timestamp
      const transactionData = {
        ...transaction,
        timestamp: transaction.timestamp || new Date()
      };

      // Save to storage
      transactionsTable.push(transactionData);

      // Simulate save delay
      await this.#simulateDelay(10);

      console.log(`Transaction saved: ${transaction.id}`);
      return transactionData;
    } catch (error) {
      console.error("Failed to save transaction:", error);
      throw error;
    }
  }

  // Load all data
  async loadAll() {
    this.#checkConnection();

    try {
      await this.#simulateDelay(50);

      return {
        users: Array.from(this.#storage.get("users").entries()),
        books: Array.from(this.#storage.get("books").entries()),
        transactions: [...this.#storage.get("transactions")]
      };
    } catch (error) {
      console.error("Failed to load data:", error);
      throw error;
    }
  }

  // Save all data
  async saveAll(data) {
    this.#checkConnection();

    try {
      if (data.users) {
        this.#storage.set("users", new Map(data.users));
      }

      if (data.books) {
        this.#storage.set("books", new Map(data.books));
      }

      if (data.transactions) {
        this.#storage.set("transactions", [...data.transactions]);
      }

      // Save to localStorage
      await this.#saveToLocalStorage();
      await this.#simulateDelay(100);

      console.log("All data saved successfully");
    } catch (error) {
      console.error("Failed to save all data:", error);
      throw error;
    }
  }

  // Find users by criteria
  async findUsers(criteria = {}) {
    this.#checkConnection();

    const usersTable = this.#storage.get("users");
    const results = [];

    for (const user of usersTable.values()) {
      if (this.#matchesCriteria(user, criteria)) {
        results.push(user);
      }
    }

    await this.#simulateDelay(20);
    return results;
  }

  // Find books by criteria
  async findBooks(criteria = {}) {
    this.#checkConnection();

    const booksTable = this.#storage.get("books");
    const results = [];

    for (const book of booksTable.values()) {
      if (this.#matchesCriteria(book, criteria)) {
        results.push(book);
      }
    }

    await this.#simulateDelay(20);
    return results;
  }

  // Find transactions by criteria
  async findTransactions(criteria = {}) {
    this.#checkConnection();

    const transactions = this.#storage.get("transactions");
    const results = transactions.filter((transaction) =>
      this.#matchesCriteria(transaction, criteria)
    );

    await this.#simulateDelay(20);
    return results;
  }

  // Get database statistics
  async getStats() {
    this.#checkConnection();

    const usersCount = this.#storage.get("users").size;
    const booksCount = this.#storage.get("books").size;
    const transactionsCount = this.#storage.get("transactions").length;

    await this.#simulateDelay(10);

    return {
      connected: this.#isConnected,
      connectionString: this.#connectionString,
      tables: {
        users: usersCount,
        books: booksCount,
        transactions: transactionsCount
      },
      totalRecords: usersCount + booksCount + transactionsCount
    };
  }

  // Private helper methods

  #checkConnection() {
    if (!this.#isConnected) {
      throw new Error("Database is not connected");
    }
  }

  #validateData(tableName, data) {
    const schema = this.#schemas.get(tableName);
    if (!schema) {
      throw new Error(`No schema defined for table: ${tableName}`);
    }

    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
      const value = data[fieldName];

      // Check required fields
      if (fieldSchema.required && (value === undefined || value === null)) {
        throw new Error(`Required field missing: ${fieldName}`);
      }

      // Check type
      if (value !== undefined && value !== null) {
        if (!this.#isValidType(value, fieldSchema.type)) {
          throw new Error(
            `Invalid type for field ${fieldName}. Expected ${fieldSchema.type}`
          );
        }

        // Check enum values
        if (fieldSchema.enum && !fieldSchema.enum.includes(value)) {
          throw new Error(
            `Invalid value for field ${fieldName}. Must be one of: ${fieldSchema.enum.join(
              ", "
            )}`
          );
        }
      }
    }
  }

  #isValidType(value, expectedType) {
    switch (expectedType) {
      case "string":
        return typeof value === "string";
      case "number":
        return typeof value === "number";
      case "boolean":
        return typeof value === "boolean";
      case "date":
        return value instanceof Date;
      case "array":
        return Array.isArray(value);
      case "object":
        return (
          typeof value === "object" && value !== null && !Array.isArray(value)
        );
      default:
        return true;
    }
  }

  #matchesCriteria(record, criteria) {
    for (const [key, value] of Object.entries(criteria)) {
      if (record[key] !== value) {
        return false;
      }
    }
    return true;
  }

  async #simulateDelay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async #loadFromLocalStorage() {
    try {
      const savedData = localStorage.getItem(this.#connectionString);
      if (savedData) {
        const parsedData = JSON.parse(savedData);

        if (parsedData.users) {
          this.#storage.set("users", new Map(parsedData.users));
        }

        if (parsedData.books) {
          this.#storage.set("books", new Map(parsedData.books));
        }

        if (parsedData.transactions) {
          this.#storage.set("transactions", parsedData.transactions);
        }

        console.log("Data loaded from localStorage");
      }
    } catch (error) {
      console.warn("Failed to load data from localStorage:", error);
    }
  }

  async #saveToLocalStorage() {
    try {
      const dataToSave = {
        users: Array.from(this.#storage.get("users").entries()),
        books: Array.from(this.#storage.get("books").entries()),
        transactions: this.#storage.get("transactions")
      };

      localStorage.setItem(this.#connectionString, JSON.stringify(dataToSave));
      console.log("Data saved to localStorage");
    } catch (error) {
      console.warn("Failed to save data to localStorage:", error);
    }
  }

  // Public getter for connection status
  get isConnected() {
    return this.#isConnected;
  }

  // Public getter for connection string
  get connectionString() {
    return this.#connectionString;
  }

  // Clear all data (useful for testing)
  async clearAll() {
    this.#checkConnection();

    this.#storage.set("users", new Map());
    this.#storage.set("books", new Map());
    this.#storage.set("transactions", []);

    // Clear localStorage
    localStorage.removeItem(this.#connectionString);

    console.log("All data cleared");
  }
}

export default Database;
