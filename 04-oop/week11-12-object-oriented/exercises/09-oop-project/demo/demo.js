/**
 * Demo Script for Library Management System
 *
 * This file contains all the demo functions that are called from the HTML interface.
 * It demonstrates the usage of the OOP Library Management System.
 */

import { Library } from "../src/core/Library.js";
import { EventBus } from "../src/core/EventBus.js";

// Global instances
let library = null;
let eventBus = null;

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  output("Library Management System Demo loaded!");
  output("Click 'Initialize Library System' to begin.", "info");
});

// System Initialization Functions
window.initializeSystem = async function () {
  try {
    if (library && library.isInitialized) {
      output("System is already initialized!", "warning");
      return;
    }

    output("Initializing Library Management System...", "info");

    // Create new library instance
    library = new Library("Central City Library");

    // Set up event listeners for demo
    setupEventListeners();

    // Initialize the library
    await library.initialize();

    output("✅ Library system initialized successfully!", "info");
    output(`📚 Library: ${library.name}`, "info");

    // Update status indicator
    updateStatusIndicator(true);
  } catch (error) {
    output(`❌ Failed to initialize system: ${error.message}`, "error");
  }
};

window.loadSampleData = async function () {
  if (!checkSystemInitialized()) return;

  try {
    output("Loading sample data...", "info");

    // This is a placeholder - you would implement actual sample data loading
    // based on the User and Book classes you create

    output("📝 Sample users would be created here", "info");
    output("📚 Sample books would be added here", "info");
    output("💳 Sample transactions would be generated here", "info");

    output("✅ Sample data loaded successfully!", "info");
  } catch (error) {
    output(`❌ Failed to load sample data: ${error.message}`, "error");
  }
};

window.showSystemStatus = function () {
  if (!checkSystemInitialized()) return;

  try {
    const stats = library.getSystemStats();

    output("📊 System Status:", "info");
    output(`   Library Name: ${stats.library}`, "info");
    output(`   Total Books: ${stats.totalBooks}`, "info");
    output(`   Available Books: ${stats.availableBooks}`, "info");
    output(`   Borrowed Books: ${stats.borrowedBooks}`, "info");
    output(`   Total Users: ${stats.totalUsers}`, "info");
    output(`   Total Transactions: ${stats.totalTransactions}`, "info");
    output(
      `   Status: ${stats.isInitialized ? "Initialized" : "Not Initialized"}`,
      "info"
    );
  } catch (error) {
    output(`❌ Failed to get system status: ${error.message}`, "error");
  }
};

// User Management Functions
window.createUsers = function () {
  if (!checkSystemInitialized()) return;

  try {
    output("Creating sample users...", "info");

    // TODO: Create actual User instances when User classes are implemented
    // For now, just demonstrate the concept

    const sampleUsers = [
      { name: "John Doe", email: "john@example.com", role: "member" },
      { name: "Jane Smith", email: "jane@example.com", role: "librarian" },
      { name: "Admin User", email: "admin@example.com", role: "admin" }
    ];

    sampleUsers.forEach((userData) => {
      output(`👤 Created user: ${userData.name} (${userData.role})`, "info");
    });

    output("✅ Sample users created!", "info");
  } catch (error) {
    output(`❌ Failed to create users: ${error.message}`, "error");
  }
};

window.authenticateUser = function () {
  if (!checkSystemInitialized()) return;

  try {
    output("Testing user authentication...", "info");

    // TODO: Implement actual authentication when User classes are ready

    output("🔐 Authenticating user: john@example.com", "info");
    output("✅ Authentication successful!", "info");
    output("🔒 User session created", "info");
  } catch (error) {
    output(`❌ Authentication failed: ${error.message}`, "error");
  }
};

window.showUserProfiles = function () {
  if (!checkSystemInitialized()) return;

  try {
    const users = library.getAllUsers();

    output("👥 User Profiles:", "info");
    if (users.length === 0) {
      output("   No users found. Create some users first.", "warning");
    } else {
      users.forEach((user, index) => {
        output(
          `   ${index + 1}. ${user.name} (${user.email}) - ${user.role}`,
          "info"
        );
      });
    }
  } catch (error) {
    output(`❌ Failed to show user profiles: ${error.message}`, "error");
  }
};

// Book Management Functions
window.addBooks = function () {
  if (!checkSystemInitialized()) return;

  try {
    output("Adding sample books...", "info");

    // TODO: Create actual Book instances when Book classes are implemented

    const sampleBooks = [
      {
        title: "JavaScript: The Good Parts",
        author: "Douglas Crockford",
        type: "Physical"
      },
      { title: "Clean Code", author: "Robert C. Martin", type: "Digital" },
      {
        title: "The Pragmatic Programmer",
        author: "Andy Hunt",
        type: "AudioBook"
      }
    ];

    sampleBooks.forEach((bookData) => {
      output(
        `📖 Added book: "${bookData.title}" by ${bookData.author} (${bookData.type})`,
        "info"
      );
    });

    output("✅ Sample books added!", "info");
  } catch (error) {
    output(`❌ Failed to add books: ${error.message}`, "error");
  }
};

window.searchBooks = function () {
  if (!checkSystemInitialized()) return;

  try {
    output("Searching books...", "info");

    // TODO: Implement actual search when Book classes are ready
    const searchCriteria = { title: "JavaScript" };
    const results = library.searchBooks(searchCriteria);

    output(`🔍 Search criteria: ${JSON.stringify(searchCriteria)}`, "info");
    output(`📚 Found ${results.length} books`, "info");

    if (results.length === 0) {
      output("   No books found. Add some books first.", "warning");
    }
  } catch (error) {
    output(`❌ Search failed: ${error.message}`, "error");
  }
};

window.showBookCatalog = function () {
  if (!checkSystemInitialized()) return;

  try {
    const books = library.getAllBooks();

    output("📚 Book Catalog:", "info");
    if (books.length === 0) {
      output("   No books in catalog. Add some books first.", "warning");
    } else {
      books.forEach((book, index) => {
        const availability = book.isAvailable ? "Available" : "Borrowed";
        output(
          `   ${index + 1}. "${book.title}" by ${
            book.author
          } - ${availability}`,
          "info"
        );
      });
    }
  } catch (error) {
    output(`❌ Failed to show catalog: ${error.message}`, "error");
  }
};

// Transaction Functions
window.borrowBooks = function () {
  if (!checkSystemInitialized()) return;

  try {
    output("Processing book borrowing...", "info");

    // TODO: Implement actual borrowing when User and Book classes are ready

    output("📖 Simulating book borrow transaction", "info");
    output("👤 User: John Doe", "info");
    output("📚 Book: JavaScript: The Good Parts", "info");
    output(
      "📅 Due date: " +
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      "info"
    );
    output("✅ Book borrowed successfully!", "info");
  } catch (error) {
    output(`❌ Failed to borrow book: ${error.message}`, "error");
  }
};

window.returnBooks = function () {
  if (!checkSystemInitialized()) return;

  try {
    output("Processing book return...", "info");

    // TODO: Implement actual return when transaction classes are ready

    output("📖 Simulating book return transaction", "info");
    output("👤 User: John Doe", "info");
    output("📚 Book: JavaScript: The Good Parts", "info");
    output("📅 Return date: " + new Date().toLocaleDateString(), "info");
    output("💰 Late fee: $0.00", "info");
    output("✅ Book returned successfully!", "info");
  } catch (error) {
    output(`❌ Failed to return book: ${error.message}`, "error");
  }
};

window.showTransactionHistory = function () {
  if (!checkSystemInitialized()) return;

  try {
    const transactions = library.getTransactionHistory();

    output("📋 Transaction History:", "info");
    if (transactions.length === 0) {
      output(
        "   No transactions found. Perform some borrowing/returning first.",
        "warning"
      );
    } else {
      transactions.forEach((transaction, index) => {
        output(
          `   ${index + 1}. ${transaction.type} - ${transaction.bookTitle} by ${
            transaction.userName
          }`,
          "info"
        );
      });
    }
  } catch (error) {
    output(`❌ Failed to show transaction history: ${error.message}`, "error");
  }
};

// Notification Functions
window.sendNotifications = function () {
  if (!checkSystemInitialized()) return;

  try {
    output("Sending notifications...", "info");

    // TODO: Implement actual notification system

    output("📧 Sending due date reminders", "info");
    output("📢 Sending new book announcements", "info");
    output("💸 Sending overdue notices", "info");
    output("✅ Notifications sent successfully!", "info");
  } catch (error) {
    output(`❌ Failed to send notifications: ${error.message}`, "error");
  }
};

window.showNotificationHistory = function () {
  if (!checkSystemInitialized()) return;

  try {
    output("📬 Notification History:", "info");

    // TODO: Implement actual notification history

    output("   1. Due date reminder sent to john@example.com", "info");
    output("   2. New book announcement sent to all users", "info");
    output("   3. Overdue notice sent to jane@example.com", "info");
  } catch (error) {
    output(`❌ Failed to show notification history: ${error.message}`, "error");
  }
};

window.testEventSystem = function () {
  if (!checkSystemInitialized()) return;

  try {
    output("Testing event system...", "info");

    // Demonstrate event emission
    library.on("demo.test", (data) => {
      output(`🎉 Event received: ${data.message}`, "info");
    });

    // Emit test event (this would be done internally by the library in real usage)
    if (library._eventBus) {
      library._eventBus.emit("demo.test", { message: "Event system working!" });
    } else {
      output("⚡ Event: Book borrowed", "info");
      output("⚡ Event: User notification sent", "info");
      output("⚡ Event: Transaction completed", "info");
    }

    output("✅ Event system test completed!", "info");
  } catch (error) {
    output(`❌ Event system test failed: ${error.message}`, "error");
  }
};

// Report Functions
window.generateUsageReport = function () {
  if (!checkSystemInitialized()) return;

  try {
    output("Generating usage report...", "info");

    const stats = library.getSystemStats();

    output("📊 Library Usage Report:", "info");
    output("==========================================", "info");
    output(`Total Books in System: ${stats.totalBooks}`, "info");
    output(`Books Currently Borrowed: ${stats.borrowedBooks}`, "info");
    output(`Active Users: ${stats.totalUsers}`, "info");
    output(`Total Transactions: ${stats.totalTransactions}`, "info");

    const utilizationRate =
      stats.totalBooks > 0
        ? ((stats.borrowedBooks / stats.totalBooks) * 100).toFixed(1)
        : 0;
    output(`Utilization Rate: ${utilizationRate}%`, "info");

    output("==========================================", "info");
    output("✅ Usage report generated!", "info");
  } catch (error) {
    output(`❌ Failed to generate usage report: ${error.message}`, "error");
  }
};

window.generatePopularBooksReport = function () {
  if (!checkSystemInitialized()) return;

  try {
    output("Generating popular books report...", "info");

    // TODO: Implement actual popular books analysis

    output("📈 Popular Books Report:", "info");
    output("==========================================", "info");
    output("1. JavaScript: The Good Parts - 15 borrows", "info");
    output("2. Clean Code - 12 borrows", "info");
    output("3. The Pragmatic Programmer - 8 borrows", "info");
    output("4. Design Patterns - 6 borrows", "info");
    output("5. Refactoring - 4 borrows", "info");
    output("==========================================", "info");
    output("✅ Popular books report generated!", "info");
  } catch (error) {
    output(
      `❌ Failed to generate popular books report: ${error.message}`,
      "error"
    );
  }
};

window.generateFinancialReport = function () {
  if (!checkSystemInitialized()) return;

  try {
    output("Generating financial report...", "info");

    // TODO: Implement actual financial calculations

    output("💰 Financial Report:", "info");
    output("==========================================", "info");
    output("Late Fees Collected: $45.50", "info");
    output("Membership Fees: $1,200.00", "info");
    output("Book Replacement Costs: $120.00", "info");
    output("Total Revenue: $1,365.50", "info");
    output("==========================================", "info");
    output("Outstanding Fines: $23.00", "info");
    output("==========================================", "info");
    output("✅ Financial report generated!", "info");
  } catch (error) {
    output(`❌ Failed to generate financial report: ${error.message}`, "error");
  }
};

// Helper Functions
function setupEventListeners() {
  if (!library) return;

  // Listen to library events for demo purposes
  library.on("user.registered", (data) => {
    output(`🎉 Event: User ${data.name} registered`, "info");
  });

  library.on("book.borrowed", (data) => {
    output(
      `🎉 Event: Book "${data.bookTitle}" borrowed by ${data.userName}`,
      "info"
    );
  });

  library.on("book.returned", (data) => {
    output(
      `🎉 Event: Book "${data.bookTitle}" returned by ${data.userName}`,
      "info"
    );
  });

  library.on("system.initialized", (data) => {
    output(`🎉 Event: System ${data.libraryName} initialized`, "info");
  });
}

function checkSystemInitialized() {
  if (!library || !library.isInitialized) {
    output(
      "❌ System not initialized. Please initialize the system first.",
      "error"
    );
    return false;
  }
  return true;
}

function updateStatusIndicator(isActive) {
  const indicators = document.querySelectorAll(".status-indicator");
  indicators.forEach((indicator) => {
    indicator.className = `status-indicator ${
      isActive ? "status-active" : "status-inactive"
    }`;
  });
}

// Global output function (defined in HTML)
function output(message, type = "info") {
  if (typeof window.output === "function") {
    window.output(message, type);
  } else {
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}

// Export for testing
export { library, eventBus, checkSystemInitialized, setupEventListeners };
