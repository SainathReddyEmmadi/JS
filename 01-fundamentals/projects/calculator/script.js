/**
 * JavaScript Calculator - Demonstrating Core Programming Concepts
 * This calculator showcases variables, functions, arrays, objects, and DOM manipulation
 */

// Calculator Class - Demonstrating Object-Oriented Programming
class Calculator {
  constructor() {
    // Instance variables - demonstrating different data types
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = null;
    this.shouldResetDisplay = false;
    this.history = []; // Array to store calculation history

    // Get DOM elements - demonstrating element selection
    this.currentOperandElement = document.getElementById("currentOperand");
    this.previousOperandElement = document.getElementById("previousOperand");
    this.historyListElement = document.getElementById("historyList");

    // Initialize display
    this.updateDisplay();

    // Add keyboard support - demonstrating event listeners
    this.addKeyboardSupport();
  }

  // Method to clear all values - demonstrating functions
  clear() {
    this.currentOperand = "";
    this.previousOperand = "";
    this.operation = null;
    this.shouldResetDisplay = false;
    this.updateDisplay();
    this.removeErrorState();
  }

  // Method to delete last digit - demonstrating string manipulation
  delete() {
    if (this.shouldResetDisplay) return;
    this.currentOperand = this.currentOperand.toString().slice(0, -1);
    if (this.currentOperand === "") {
      this.currentOperand = "";
    }
    this.updateDisplay();
  }

  // Method to append numbers - demonstrating parameter handling and validation
  appendNumber(number) {
    // Demonstrating conditional logic
    if (this.shouldResetDisplay) {
      this.currentOperand = "";
      this.shouldResetDisplay = false;
    }

    // Prevent multiple decimal points
    if (number === "." && this.currentOperand.includes(".")) return;

    // Handle the case where first input is decimal
    if (number === "." && this.currentOperand === "") {
      this.currentOperand = "0.";
    } else {
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    this.updateDisplay();
    this.removeErrorState();
  }

  // Method to choose operation - demonstrating method parameters
  chooseOperation(operation) {
    if (this.currentOperand === "") return;

    // If there's a previous calculation, compute it first
    if (this.previousOperand !== "") {
      this.compute();
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.currentOperand = "";
    this.updateDisplay();
  }

  // Main computation method - demonstrating switch statements and arithmetic operations
  compute() {
    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    // Input validation - demonstrating error handling
    if (isNaN(prev) || isNaN(current)) return;

    // Demonstrating switch statement for control flow
    switch (this.operation) {
      case "+":
        computation = prev + current;
        break;
      case "−":
      case "-":
        computation = prev - current;
        break;
      case "×":
      case "*":
        computation = prev * current;
        break;
      case "÷":
      case "/":
        // Demonstrating error handling for division by zero
        if (current === 0) {
          this.showError("Cannot divide by zero");
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    // Store calculation in history - demonstrating array methods
    this.addToHistory(`${prev} ${this.operation} ${current} = ${computation}`);

    this.currentOperand = computation;
    this.operation = null;
    this.previousOperand = "";
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  // Advanced mathematical functions - demonstrating Math object usage
  percentage() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;

    const result = current / 100;
    this.addToHistory(`${current}% = ${result}`);
    this.currentOperand = result;
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  square() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;

    const result = Math.pow(current, 2);
    this.addToHistory(`${current}² = ${result}`);
    this.currentOperand = result;
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  squareRoot() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;

    // Error handling for negative square roots
    if (current < 0) {
      this.showError("Cannot calculate square root of negative number");
      return;
    }

    const result = Math.sqrt(current);
    this.addToHistory(`√${current} = ${result}`);
    this.currentOperand = result;
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  reciprocal() {
    const current = parseFloat(this.currentOperand);
    if (isNaN(current)) return;

    // Error handling for reciprocal of zero
    if (current === 0) {
      this.showError("Cannot calculate reciprocal of zero");
      return;
    }

    const result = 1 / current;
    this.addToHistory(`1/${current} = ${result}`);
    this.currentOperand = result;
    this.shouldResetDisplay = true;
    this.updateDisplay();
  }

  // Method to format numbers for display - demonstrating number formatting
  getDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split(".")[0]);
    const decimalDigits = stringNumber.split(".")[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = "";
    } else {
      // Format large numbers with commas
      integerDisplay = integerDigits.toLocaleString("en", {
        maximumFractionDigits: 0
      });
    }

    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  // Method to update the display - demonstrating DOM manipulation
  updateDisplay() {
    // Update current operand display
    if (this.currentOperand === "") {
      this.currentOperandElement.textContent = "0";
    } else {
      this.currentOperandElement.textContent = this.getDisplayNumber(
        this.currentOperand
      );
    }

    // Update previous operand display
    if (this.operation != null) {
      this.previousOperandElement.textContent = `${this.getDisplayNumber(
        this.previousOperand
      )} ${this.operation}`;
    } else {
      this.previousOperandElement.textContent = "";
    }
  }

  // Method to add calculations to history - demonstrating array manipulation and DOM updates
  addToHistory(calculation) {
    this.history.push({
      calculation: calculation,
      timestamp: new Date().toLocaleTimeString()
    });

    // Keep only last 10 calculations to prevent memory issues
    if (this.history.length > 10) {
      this.history.shift(); // Remove oldest calculation
    }

    this.updateHistoryDisplay();
  }

  // Method to update history display - demonstrating dynamic content creation
  updateHistoryDisplay() {
    // Clear existing history
    this.historyListElement.innerHTML = "";

    if (this.history.length === 0) {
      this.historyListElement.innerHTML =
        '<p class="no-history">No calculations yet</p>';
      return;
    }

    // Create history items - demonstrating DOM element creation and loops
    this.history
      .slice()
      .reverse()
      .forEach((item) => {
        const historyItem = document.createElement("div");
        historyItem.className = "history-item";
        historyItem.innerHTML = `
                <div style="font-weight: 600; color: #1f2937;">${item.calculation}</div>
                <div style="font-size: 0.8rem; color: #6b7280; margin-top: 0.25rem;">${item.timestamp}</div>
            `;
        this.historyListElement.appendChild(historyItem);
      });
  }

  // Method to clear calculation history
  clearHistory() {
    this.history = [];
    this.updateHistoryDisplay();
  }

  // Method to show error messages - demonstrating error handling and UI feedback
  showError(message) {
    this.currentOperandElement.textContent = message;
    this.currentOperandElement.parentElement.classList.add("error");

    // Clear error after 3 seconds
    setTimeout(() => {
      this.clear();
    }, 3000);
  }

  // Method to remove error state
  removeErrorState() {
    this.currentOperandElement.parentElement.classList.remove("error");
  }

  // Method to add keyboard support - demonstrating event handling
  addKeyboardSupport() {
    document.addEventListener("keydown", (event) => {
      // Demonstrating object destructuring
      const { key } = event;

      // Number keys
      if (key >= "0" && key <= "9") {
        this.appendNumber(key);
        this.animateButton(key);
      }

      // Decimal point
      if (key === ".") {
        this.appendNumber(key);
        this.animateButton(key);
      }

      // Operations
      if (key === "+") {
        this.chooseOperation("+");
        this.animateButtonByText("+");
      }
      if (key === "-") {
        this.chooseOperation("−");
        this.animateButtonByText("−");
      }
      if (key === "*") {
        this.chooseOperation("×");
        this.animateButtonByText("×");
      }
      if (key === "/") {
        event.preventDefault(); // Prevent browser search
        this.chooseOperation("÷");
        this.animateButtonByText("÷");
      }

      // Enter or equals
      if (key === "Enter" || key === "=") {
        event.preventDefault();
        this.compute();
        this.animateButtonByText("=");
      }

      // Backspace
      if (key === "Backspace") {
        this.delete();
        this.animateButtonByIcon("fa-backspace");
      }

      // Escape or clear
      if (key === "Escape") {
        this.clear();
        this.animateButtonByText("Clear");
      }
    });
  }

  // Method to animate button press - demonstrating CSS class manipulation
  animateButton(text) {
    const button = Array.from(document.querySelectorAll(".btn")).find(
      (btn) => btn.textContent.trim() === text
    );
    if (button) {
      button.classList.add("pressed");
      setTimeout(() => button.classList.remove("pressed"), 150);
    }
  }

  animateButtonByText(text) {
    const button = Array.from(document.querySelectorAll(".btn")).find((btn) =>
      btn.textContent.includes(text)
    );
    if (button) {
      button.classList.add("pressed");
      setTimeout(() => button.classList.remove("pressed"), 150);
    }
  }

  animateButtonByIcon(iconClass) {
    const button = Array.from(document.querySelectorAll(".btn")).find((btn) =>
      btn.querySelector(`i.${iconClass}`)
    );
    if (button) {
      button.classList.add("pressed");
      setTimeout(() => button.classList.remove("pressed"), 150);
    }
  }
}

// Initialize calculator when page loads - demonstrating event handling
document.addEventListener("DOMContentLoaded", () => {
  // Create global calculator instance - demonstrating object instantiation
  window.calculator = new Calculator();

  // Display welcome message in console - demonstrating debugging practices
  console.log("🧮 JavaScript Calculator loaded successfully!");
  console.log("💡 This project demonstrates:");
  console.log("   • Variables (let, const) and data types");
  console.log("   • Functions and methods");
  console.log("   • Objects and classes");
  console.log("   • Arrays and array methods");
  console.log("   • DOM manipulation");
  console.log("   • Event handling");
  console.log("   • Error handling");
  console.log("   • Control flow (if/else, switch)");
  console.log("   • Mathematical operations");
  console.log("📚 Try using keyboard shortcuts too!");
});

// Additional utility functions - demonstrating function declarations

/**
 * Utility function to validate numeric input
 * Demonstrates: Function parameters, return values, type checking
 */
function isValidNumber(value) {
  return !isNaN(value) && isFinite(value);
}

/**
 * Utility function to format currency
 * Demonstrates: Template literals, number formatting
 */
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

/**
 * Utility function to round to specific decimal places
 * Demonstrates: Math methods, function composition
 */
function roundToDecimals(number, decimals = 2) {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// Export for potential use in other modules (demonstrating ES6 modules concept)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    Calculator,
    isValidNumber,
    formatCurrency,
    roundToDecimals
  };
}
