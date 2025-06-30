/**
 * Transaction Class - Represents a library transaction (borrow/return)
 * Implements the Command pattern for transaction operations
 */

// Transaction types enum
const TransactionType = {
  BORROW: "borrow",
  RETURN: "return",
  RESERVE: "reserve",
  CANCEL_RESERVATION: "cancel_reservation",
  RENEW: "renew",
  FINE_PAYMENT: "fine_payment"
};

// Transaction status enum
const TransactionStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled"
};

class Transaction {
  #id;
  #type;
  #userId;
  #bookId;
  #timestamp;
  #status;
  #details;
  #fineAmount;
  #dueDate;
  #notes;

  constructor(id, type, userId, bookId, details = {}) {
    this.#id = id;
    this.#type = type;
    this.#userId = userId;
    this.#bookId = bookId;
    this.#timestamp = new Date();
    this.#status = TransactionStatus.PENDING;
    this.#details = { ...details };
    this.#fineAmount = details.fineAmount || 0;
    this.#dueDate = details.dueDate ? new Date(details.dueDate) : null;
    this.#notes = details.notes || "";

    this.validateTransaction();
  }

  // Getters
  get id() {
    return this.#id;
  }
  get type() {
    return this.#type;
  }
  get userId() {
    return this.#userId;
  }
  get bookId() {
    return this.#bookId;
  }
  get timestamp() {
    return new Date(this.#timestamp);
  }
  get status() {
    return this.#status;
  }
  get details() {
    return { ...this.#details };
  }
  get fineAmount() {
    return this.#fineAmount;
  }
  get dueDate() {
    return this.#dueDate ? new Date(this.#dueDate) : null;
  }
  get notes() {
    return this.#notes;
  }

  // Setters
  set status(value) {
    if (!Object.values(TransactionStatus).includes(value)) {
      throw new Error(`Invalid transaction status: ${value}`);
    }
    this.#status = value;
  }

  set notes(value) {
    this.#notes = value || "";
  }

  set fineAmount(value) {
    if (value < 0) {
      throw new Error("Fine amount cannot be negative");
    }
    this.#fineAmount = value;
  }

  // Public methods
  complete() {
    if (this.#status !== TransactionStatus.PENDING) {
      throw new Error("Only pending transactions can be completed");
    }

    this.#status = TransactionStatus.COMPLETED;
    this.#details.completedAt = new Date();
    return true;
  }

  fail(reason) {
    if (this.#status !== TransactionStatus.PENDING) {
      throw new Error("Only pending transactions can be failed");
    }

    this.#status = TransactionStatus.FAILED;
    this.#details.failureReason = reason;
    this.#details.failedAt = new Date();
    return true;
  }

  cancel(reason) {
    if (this.#status === TransactionStatus.COMPLETED) {
      throw new Error("Cannot cancel completed transaction");
    }

    this.#status = TransactionStatus.CANCELLED;
    this.#details.cancellationReason = reason;
    this.#details.cancelledAt = new Date();
    return true;
  }

  addNote(note) {
    const timestamp = new Date().toISOString();
    this.#notes += `\n[${timestamp}] ${note}`;
  }

  isOverdue() {
    if (!this.#dueDate || this.#type !== TransactionType.BORROW) {
      return false;
    }
    return new Date() > this.#dueDate;
  }

  getDaysOverdue() {
    if (!this.isOverdue()) return 0;

    const today = new Date();
    const diffTime = today - this.#dueDate;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateFine(finePerDay = 0.5) {
    if (this.#type !== TransactionType.BORROW || !this.isOverdue()) {
      return 0;
    }

    const daysOverdue = this.getDaysOverdue();
    return daysOverdue * finePerDay;
  }

  renew(newDueDate) {
    if (this.#type !== TransactionType.BORROW) {
      throw new Error("Only borrow transactions can be renewed");
    }

    if (this.#status !== TransactionStatus.COMPLETED) {
      throw new Error("Only completed transactions can be renewed");
    }

    if (this.isOverdue()) {
      throw new Error("Overdue transactions cannot be renewed");
    }

    this.#dueDate = new Date(newDueDate);
    this.#details.renewedAt = new Date();
    this.#details.originalDueDate =
      this.#details.originalDueDate || this.#dueDate;

    return true;
  }

  // Static methods
  static validateTransactionType(type) {
    return Object.values(TransactionType).includes(type);
  }

  static createBorrowTransaction(id, userId, bookId, dueDate) {
    return new Transaction(id, TransactionType.BORROW, userId, bookId, {
      dueDate: dueDate,
      borrowDate: new Date()
    });
  }

  static createReturnTransaction(id, userId, bookId, borrowTransaction) {
    const fineAmount = borrowTransaction.calculateFine();
    return new Transaction(id, TransactionType.RETURN, userId, bookId, {
      borrowTransactionId: borrowTransaction.id,
      returnDate: new Date(),
      fineAmount: fineAmount,
      wasOverdue: borrowTransaction.isOverdue()
    });
  }

  static createReservationTransaction(id, userId, bookId) {
    return new Transaction(id, TransactionType.RESERVE, userId, bookId, {
      reservationDate: new Date()
    });
  }

  static createFinePaymentTransaction(
    id,
    userId,
    amount,
    relatedTransactionId
  ) {
    return new Transaction(id, TransactionType.FINE_PAYMENT, userId, null, {
      fineAmount: amount,
      relatedTransactionId: relatedTransactionId,
      paymentDate: new Date()
    });
  }

  static fromJSON(transactionData) {
    const transaction = new Transaction(
      transactionData.id,
      transactionData.type,
      transactionData.userId,
      transactionData.bookId,
      transactionData.details
    );

    transaction.#timestamp = new Date(transactionData.timestamp);
    transaction.#status = transactionData.status;
    transaction.#fineAmount = transactionData.fineAmount;
    transaction.#dueDate = transactionData.dueDate
      ? new Date(transactionData.dueDate)
      : null;
    transaction.#notes = transactionData.notes;

    return transaction;
  }

  // Private methods
  validateTransaction() {
    if (!this.#id || !this.#userId) {
      throw new Error("Transaction must have id and userId");
    }

    if (!Transaction.validateTransactionType(this.#type)) {
      throw new Error(`Invalid transaction type: ${this.#type}`);
    }

    // Some transaction types require a book ID
    const requiresBookId = [
      TransactionType.BORROW,
      TransactionType.RETURN,
      TransactionType.RESERVE,
      TransactionType.CANCEL_RESERVATION,
      TransactionType.RENEW
    ];

    if (requiresBookId.includes(this.#type) && !this.#bookId) {
      throw new Error(`Transaction type ${this.#type} requires a book ID`);
    }
  }

  toJSON() {
    return {
      id: this.#id,
      type: this.#type,
      userId: this.#userId,
      bookId: this.#bookId,
      timestamp: this.#timestamp,
      status: this.#status,
      details: this.#details,
      fineAmount: this.#fineAmount,
      dueDate: this.#dueDate,
      notes: this.#notes
    };
  }

  toString() {
    const date = this.#timestamp.toLocaleDateString();
    return `Transaction ${this.#id}: ${this.#type} (${date}) - ${this.#status}`;
  }
}

// Transaction factory for creating different types of transactions
class TransactionFactory {
  static generateId() {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static createBorrowTransaction(userId, bookId, dueDate) {
    const id = this.generateId();
    return Transaction.createBorrowTransaction(id, userId, bookId, dueDate);
  }

  static createReturnTransaction(userId, bookId, borrowTransaction) {
    const id = this.generateId();
    return Transaction.createReturnTransaction(
      id,
      userId,
      bookId,
      borrowTransaction
    );
  }

  static createReservationTransaction(userId, bookId) {
    const id = this.generateId();
    return Transaction.createReservationTransaction(id, userId, bookId);
  }

  static createFinePaymentTransaction(userId, amount, relatedTransactionId) {
    const id = this.generateId();
    return Transaction.createFinePaymentTransaction(
      id,
      userId,
      amount,
      relatedTransactionId
    );
  }
}

// Export for use in other modules
export { Transaction, TransactionType, TransactionStatus, TransactionFactory };
