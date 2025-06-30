/**
 * User Class - Represents a library user (member or librarian)
 * Implements Strategy pattern for different user types
 */

// User types enum
const UserTypes = {
  MEMBER: "member",
  LIBRARIAN: "librarian",
  ADMIN: "admin"
};

class User {
  #id;
  #name;
  #email;
  #type;
  #borrowedBooks;
  #membershipDate;
  #isActive;

  constructor(id, name, email, type = UserTypes.MEMBER) {
    this.#id = id;
    this.#name = name;
    this.#email = email;
    this.#type = type;
    this.#borrowedBooks = [];
    this.#membershipDate = new Date();
    this.#isActive = true;

    this.validateUser();
  }

  // Getters
  get id() {
    return this.#id;
  }
  get name() {
    return this.#name;
  }
  get email() {
    return this.#email;
  }
  get type() {
    return this.#type;
  }
  get borrowedBooks() {
    return [...this.#borrowedBooks];
  }
  get membershipDate() {
    return new Date(this.#membershipDate);
  }
  get isActive() {
    return this.#isActive;
  }

  // Setters with validation
  set name(value) {
    if (!value || value.trim().length < 2) {
      throw new Error("Name must be at least 2 characters long");
    }
    this.#name = value.trim();
  }

  set email(value) {
    if (!this.#isValidEmail(value)) {
      throw new Error("Invalid email format");
    }
    this.#email = value.toLowerCase();
  }

  // Public methods
  borrowBook(book) {
    if (!this.#isActive) {
      throw new Error("Inactive user cannot borrow books");
    }

    if (!this.canBorrow()) {
      throw new Error("User has reached borrowing limit");
    }

    this.#borrowedBooks.push({
      bookId: book.id,
      borrowDate: new Date(),
      dueDate: this.calculateDueDate()
    });

    return true;
  }

  returnBook(bookId) {
    const bookIndex = this.#borrowedBooks.findIndex(
      (borrowed) => borrowed.bookId === bookId
    );

    if (bookIndex === -1) {
      throw new Error("Book not found in user's borrowed list");
    }

    const borrowedBook = this.#borrowedBooks[bookIndex];
    this.#borrowedBooks.splice(bookIndex, 1);

    return {
      bookId,
      borrowDate: borrowedBook.borrowDate,
      returnDate: new Date()
    };
  }

  canBorrow() {
    const maxBooks = this.#getMaxBorrowLimit();
    return this.#borrowedBooks.length < maxBooks;
  }

  getOverdueBooks() {
    const now = new Date();
    return this.#borrowedBooks.filter((borrowed) => borrowed.dueDate < now);
  }

  calculateFines() {
    const overdueBooks = this.getOverdueBooks();
    const finePerDay = 0.5; // $0.50 per day
    let totalFine = 0;

    overdueBooks.forEach((borrowed) => {
      const daysOverdue = Math.ceil(
        (new Date() - borrowed.dueDate) / (1000 * 60 * 60 * 24)
      );
      totalFine += daysOverdue * finePerDay;
    });

    return totalFine;
  }

  deactivate() {
    if (this.#borrowedBooks.length > 0) {
      throw new Error("Cannot deactivate user with borrowed books");
    }
    this.#isActive = false;
  }

  activate() {
    this.#isActive = true;
  }

  // Static methods
  static validateUserType(type) {
    return Object.values(UserTypes).includes(type);
  }

  static fromJSON(userData) {
    const user = new User(
      userData.id,
      userData.name,
      userData.email,
      userData.type
    );

    if (userData.borrowedBooks) {
      user.#borrowedBooks = userData.borrowedBooks.map((book) => ({
        ...book,
        borrowDate: new Date(book.borrowDate),
        dueDate: new Date(book.dueDate)
      }));
    }

    user.#membershipDate = new Date(userData.membershipDate);
    user.#isActive = userData.isActive;

    return user;
  }

  // Private methods
  #isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  #getMaxBorrowLimit() {
    switch (this.#type) {
      case UserTypes.MEMBER:
        return 5;
      case UserTypes.LIBRARIAN:
        return 10;
      case UserTypes.ADMIN:
        return 20;
      default:
        return 3;
    }
  }

  calculateDueDate() {
    const daysToAdd = this.#type === UserTypes.MEMBER ? 14 : 30;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysToAdd);
    return dueDate;
  }

  validateUser() {
    if (!this.#id || !this.#name || !this.#email) {
      throw new Error("User must have id, name, and email");
    }

    if (!User.validateUserType(this.#type)) {
      throw new Error(`Invalid user type: ${this.#type}`);
    }
  }

  toJSON() {
    return {
      id: this.#id,
      name: this.#name,
      email: this.#email,
      type: this.#type,
      borrowedBooks: this.#borrowedBooks,
      membershipDate: this.#membershipDate,
      isActive: this.#isActive
    };
  }

  toString() {
    return `User(${this.#id}): ${this.#name} (${this.#type})`;
  }
}

// Export for use in other modules
export { User, UserTypes };
