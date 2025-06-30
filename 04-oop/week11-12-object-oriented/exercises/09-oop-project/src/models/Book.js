/**
 * Book Class - Represents a book in the library system
 * Implements value object pattern with immutable core properties
 */

// Book status enum
const BookStatus = {
  AVAILABLE: "available",
  BORROWED: "borrowed",
  RESERVED: "reserved",
  MAINTENANCE: "maintenance",
  LOST: "lost"
};

// Book categories enum
const BookCategory = {
  FICTION: "fiction",
  NON_FICTION: "non-fiction",
  SCIENCE: "science",
  TECHNOLOGY: "technology",
  HISTORY: "history",
  BIOGRAPHY: "biography",
  CHILDREN: "children",
  REFERENCE: "reference"
};

class Book {
  #id;
  #isbn;
  #title;
  #author;
  #category;
  #publishedYear;
  #publisher;
  #status;
  #borrowedBy;
  #borrowDate;
  #dueDate;
  #location;
  #description;
  #totalCopies;
  #availableCopies;

  constructor(id, isbn, title, author, options = {}) {
    this.#id = id;
    this.#isbn = isbn;
    this.#title = title;
    this.#author = author;
    this.#category = options.category || BookCategory.FICTION;
    this.#publishedYear = options.publishedYear || new Date().getFullYear();
    this.#publisher = options.publisher || "";
    this.#status = BookStatus.AVAILABLE;
    this.#borrowedBy = null;
    this.#borrowDate = null;
    this.#dueDate = null;
    this.#location = options.location || "";
    this.#description = options.description || "";
    this.#totalCopies = options.totalCopies || 1;
    this.#availableCopies = this.#totalCopies;

    this.validateBook();
  }

  // Getters
  get id() {
    return this.#id;
  }
  get isbn() {
    return this.#isbn;
  }
  get title() {
    return this.#title;
  }
  get author() {
    return this.#author;
  }
  get category() {
    return this.#category;
  }
  get publishedYear() {
    return this.#publishedYear;
  }
  get publisher() {
    return this.#publisher;
  }
  get status() {
    return this.#status;
  }
  get borrowedBy() {
    return this.#borrowedBy;
  }
  get borrowDate() {
    return this.#borrowDate ? new Date(this.#borrowDate) : null;
  }
  get dueDate() {
    return this.#dueDate ? new Date(this.#dueDate) : null;
  }
  get location() {
    return this.#location;
  }
  get description() {
    return this.#description;
  }
  get totalCopies() {
    return this.#totalCopies;
  }
  get availableCopies() {
    return this.#availableCopies;
  }

  // Setters (limited - most properties are immutable after creation)
  set status(value) {
    if (!Object.values(BookStatus).includes(value)) {
      throw new Error(`Invalid book status: ${value}`);
    }
    this.#status = value;
  }

  set location(value) {
    this.#location = value || "";
  }

  set description(value) {
    this.#description = value || "";
  }

  // Public methods
  isAvailable() {
    return this.#status === BookStatus.AVAILABLE && this.#availableCopies > 0;
  }

  isBorrowed() {
    return this.#status === BookStatus.BORROWED;
  }

  isOverdue() {
    if (!this.#dueDate) return false;
    return new Date() > this.#dueDate;
  }

  borrow(userId, dueDate) {
    if (!this.isAvailable()) {
      throw new Error("Book is not available for borrowing");
    }

    this.#status = BookStatus.BORROWED;
    this.#borrowedBy = userId;
    this.#borrowDate = new Date();
    this.#dueDate = new Date(dueDate);
    this.#availableCopies--;

    return {
      bookId: this.#id,
      userId: userId,
      borrowDate: this.#borrowDate,
      dueDate: this.#dueDate
    };
  }

  returnBook() {
    if (!this.isBorrowed()) {
      throw new Error("Book is not currently borrowed");
    }

    const transaction = {
      bookId: this.#id,
      userId: this.#borrowedBy,
      borrowDate: this.#borrowDate,
      returnDate: new Date(),
      wasOverdue: this.isOverdue()
    };

    this.#status = BookStatus.AVAILABLE;
    this.#borrowedBy = null;
    this.#borrowDate = null;
    this.#dueDate = null;
    this.#availableCopies++;

    return transaction;
  }

  reserve(userId) {
    if (this.isAvailable()) {
      throw new Error("Book is available, no need to reserve");
    }

    if (this.#status === BookStatus.RESERVED) {
      throw new Error("Book is already reserved");
    }

    this.#status = BookStatus.RESERVED;
    // Note: In a full implementation, you'd track reservations in a queue
    return true;
  }

  cancelReservation() {
    if (this.#status !== BookStatus.RESERVED) {
      throw new Error("Book is not reserved");
    }

    this.#status =
      this.#availableCopies > 0 ? BookStatus.AVAILABLE : BookStatus.BORROWED;
    return true;
  }

  addCopies(count) {
    if (count <= 0) {
      throw new Error("Copy count must be positive");
    }

    this.#totalCopies += count;
    this.#availableCopies += count;

    // If book was unavailable due to no copies, make it available
    if (this.#status === BookStatus.BORROWED && this.#availableCopies > 0) {
      // Keep individual copy borrowed, but book becomes partially available
    }

    return this.#totalCopies;
  }

  removeCopies(count) {
    if (count <= 0) {
      throw new Error("Copy count must be positive");
    }

    if (count > this.#availableCopies) {
      throw new Error("Cannot remove more copies than available");
    }

    this.#totalCopies -= count;
    this.#availableCopies -= count;

    return this.#totalCopies;
  }

  markAsLost() {
    this.#status = BookStatus.LOST;
    if (this.#borrowedBy) {
      // In a full implementation, charge the user for the lost book
      this.#borrowedBy = null;
      this.#borrowDate = null;
      this.#dueDate = null;
    }
  }

  markForMaintenance() {
    if (this.isBorrowed()) {
      throw new Error("Cannot mark borrowed book for maintenance");
    }

    this.#status = BookStatus.MAINTENANCE;
    this.#availableCopies = Math.max(0, this.#availableCopies - 1);
  }

  finishMaintenance() {
    if (this.#status !== BookStatus.MAINTENANCE) {
      throw new Error("Book is not under maintenance");
    }

    this.#status = BookStatus.AVAILABLE;
    this.#availableCopies = Math.min(
      this.#totalCopies,
      this.#availableCopies + 1
    );
  }

  getDaysUntilDue() {
    if (!this.#dueDate) return null;

    const today = new Date();
    const diffTime = this.#dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  matches(searchTerm) {
    const term = searchTerm.toLowerCase();
    return (
      this.#title.toLowerCase().includes(term) ||
      this.#author.toLowerCase().includes(term) ||
      this.#isbn.includes(term) ||
      this.#category.toLowerCase().includes(term) ||
      this.#publisher.toLowerCase().includes(term)
    );
  }

  // Static methods
  static validateISBN(isbn) {
    // Basic ISBN validation (simplified)
    const cleaned = isbn.replace(/[-\s]/g, "");
    return cleaned.length === 10 || cleaned.length === 13;
  }

  static validateCategory(category) {
    return Object.values(BookCategory).includes(category);
  }

  static fromJSON(bookData) {
    const book = new Book(
      bookData.id,
      bookData.isbn,
      bookData.title,
      bookData.author,
      {
        category: bookData.category,
        publishedYear: bookData.publishedYear,
        publisher: bookData.publisher,
        location: bookData.location,
        description: bookData.description,
        totalCopies: bookData.totalCopies
      }
    );

    book.#status = bookData.status;
    book.#borrowedBy = bookData.borrowedBy;
    book.#borrowDate = bookData.borrowDate
      ? new Date(bookData.borrowDate)
      : null;
    book.#dueDate = bookData.dueDate ? new Date(bookData.dueDate) : null;
    book.#availableCopies = bookData.availableCopies;

    return book;
  }

  // Private methods
  validateBook() {
    if (!this.#id || !this.#title || !this.#author) {
      throw new Error("Book must have id, title, and author");
    }

    if (!Book.validateISBN(this.#isbn)) {
      throw new Error("Invalid ISBN format");
    }

    if (!Book.validateCategory(this.#category)) {
      throw new Error(`Invalid book category: ${this.#category}`);
    }

    if (this.#publishedYear > new Date().getFullYear()) {
      throw new Error("Published year cannot be in the future");
    }

    if (this.#totalCopies < 1) {
      throw new Error("Total copies must be at least 1");
    }
  }

  toJSON() {
    return {
      id: this.#id,
      isbn: this.#isbn,
      title: this.#title,
      author: this.#author,
      category: this.#category,
      publishedYear: this.#publishedYear,
      publisher: this.#publisher,
      status: this.#status,
      borrowedBy: this.#borrowedBy,
      borrowDate: this.#borrowDate,
      dueDate: this.#dueDate,
      location: this.#location,
      description: this.#description,
      totalCopies: this.#totalCopies,
      availableCopies: this.#availableCopies
    };
  }

  toString() {
    return `"${this.#title}" by ${this.#author} (${this.#status})`;
  }
}

// Export for use in other modules
export { Book, BookStatus, BookCategory };
