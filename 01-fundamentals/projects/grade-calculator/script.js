/**
 * Grade Calculator - Demonstrating Arrays, Objects, Functions, and Loops
 * This application showcases core JavaScript concepts through grade management
 */

// Grade Calculator Class - Demonstrating Object-Oriented Programming
class GradeCalculator {
  constructor() {
    // Arrays to store different types of data - demonstrating array usage
    this.assignments = []; // Array of assignment objects
    this.categories = [
      "homework",
      "quiz",
      "exam",
      "project",
      "participation",
      "other"
    ];

    // Object to store grade scale - demonstrating objects and key-value pairs
    this.gradeScale = {
      "A+": { min: 97, max: 100, gpa: 4.0 },
      A: { min: 93, max: 96.99, gpa: 4.0 },
      "A-": { min: 90, max: 92.99, gpa: 3.7 },
      "B+": { min: 87, max: 89.99, gpa: 3.3 },
      B: { min: 83, max: 86.99, gpa: 3.0 },
      "B-": { min: 80, max: 82.99, gpa: 2.7 },
      "C+": { min: 77, max: 79.99, gpa: 2.3 },
      C: { min: 73, max: 76.99, gpa: 2.0 },
      "C-": { min: 70, max: 72.99, gpa: 1.7 },
      "D+": { min: 67, max: 69.99, gpa: 1.3 },
      D: { min: 65, max: 66.99, gpa: 1.0 },
      F: { min: 0, max: 64.99, gpa: 0.0 }
    };

    // DOM elements - demonstrating element selection
    this.initializeElements();
    this.attachEventListeners();
    this.updateDisplay();

    // Load data from localStorage if available - demonstrating browser storage
    this.loadDataFromStorage();
  }

  // Method to initialize DOM elements
  initializeElements() {
    this.form = document.getElementById("gradeForm");
    this.assignmentsList = document.getElementById("assignmentsList");
    this.overallGradeElement = document.getElementById("overallGrade");
    this.letterGradeElement = document.getElementById("letterGrade");
    this.gpaElement = document.getElementById("gpaValue");
    this.totalAssignmentsElement = document.getElementById("totalAssignments");
    this.categoryBreakdown = document.getElementById("categoryBreakdown");
    this.loadSampleDataBtn = document.getElementById("loadSampleData");
    this.clearAllDataBtn = document.getElementById("clearAllData");
  }

  // Method to attach event listeners - demonstrating event handling
  attachEventListeners() {
    this.form.addEventListener("submit", (e) => this.handleFormSubmit(e));
    this.loadSampleDataBtn.addEventListener("click", () =>
      this.loadSampleData()
    );
    this.clearAllDataBtn.addEventListener("click", () => this.clearAllData());
  }

  // Method to handle form submission - demonstrating form handling and validation
  handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    // Get form data - demonstrating form data extraction
    const formData = new FormData(this.form);
    const assignmentData = {
      id: Date.now(), // Simple ID generation
      name:
        formData.get("assignmentName") ||
        document.getElementById("assignmentName").value,
      pointsEarned: parseFloat(document.getElementById("pointsEarned").value),
      pointsPossible: parseFloat(
        document.getElementById("pointsPossible").value
      ),
      category: document.getElementById("category").value,
      weight: parseFloat(document.getElementById("weight").value),
      dateAdded: new Date().toISOString()
    };

    // Validate input - demonstrating validation logic
    if (this.validateAssignment(assignmentData)) {
      this.addAssignment(assignmentData);
      this.form.reset(); // Clear form
      this.showSuccessMessage("Assignment added successfully!");
    }
  }

  // Method to validate assignment data - demonstrating validation functions
  validateAssignment(assignment) {
    const errors = [];

    // Demonstrating conditional logic and validation
    if (!assignment.name || assignment.name.trim() === "") {
      errors.push("Assignment name is required");
    }

    if (isNaN(assignment.pointsEarned) || assignment.pointsEarned < 0) {
      errors.push("Points earned must be a positive number");
    }

    if (isNaN(assignment.pointsPossible) || assignment.pointsPossible <= 0) {
      errors.push("Points possible must be greater than 0");
    }

    if (assignment.pointsEarned > assignment.pointsPossible) {
      errors.push("Points earned cannot exceed points possible");
    }

    if (!assignment.category) {
      errors.push("Category is required");
    }

    if (
      isNaN(assignment.weight) ||
      assignment.weight < 0 ||
      assignment.weight > 100
    ) {
      errors.push("Weight must be between 0 and 100");
    }

    // Display errors if any - demonstrating error handling
    if (errors.length > 0) {
      this.showErrorMessage(errors.join(", "));
      return false;
    }

    return true;
  }

  // Method to add assignment - demonstrating array manipulation
  addAssignment(assignment) {
    // Calculate percentage
    assignment.percentage =
      (assignment.pointsEarned / assignment.pointsPossible) * 100;
    assignment.letterGrade = this.getLetterGrade(assignment.percentage);

    // Add to assignments array - demonstrating array push method
    this.assignments.push(assignment);

    // Update display and save to storage
    this.updateDisplay();
    this.saveToStorage();
  }

  // Method to remove assignment - demonstrating array filtering
  removeAssignment(id) {
    // Use filter method to remove assignment - demonstrating array methods
    this.assignments = this.assignments.filter(
      (assignment) => assignment.id !== id
    );
    this.updateDisplay();
    this.saveToStorage();
    this.showSuccessMessage("Assignment removed successfully!");
  }

  // Method to edit assignment - demonstrating array methods and object updates
  editAssignment(id) {
    // Find assignment using find method - demonstrating array search
    const assignment = this.assignments.find((a) => a.id === id);
    if (assignment) {
      // Populate form with existing data
      document.getElementById("assignmentName").value = assignment.name;
      document.getElementById("pointsEarned").value = assignment.pointsEarned;
      document.getElementById("pointsPossible").value =
        assignment.pointsPossible;
      document.getElementById("category").value = assignment.category;
      document.getElementById("weight").value = assignment.weight;

      // Remove the assignment so it can be re-added with updates
      this.removeAssignment(id);
    }
  }

  // Method to calculate overall grade - demonstrating mathematical operations and loops
  calculateOverallGrade() {
    if (this.assignments.length === 0) return 0;

    // Using reduce method to calculate weighted average - demonstrating higher-order functions
    const totalWeightedPoints = this.assignments.reduce((total, assignment) => {
      return total + (assignment.percentage * assignment.weight) / 100;
    }, 0);

    const totalWeight = this.assignments.reduce((total, assignment) => {
      return total + assignment.weight;
    }, 0);

    // Prevent division by zero
    return totalWeight > 0 ? (totalWeightedPoints / totalWeight) * 100 : 0;
  }

  // Method to get letter grade - demonstrating object iteration and conditional logic
  getLetterGrade(percentage) {
    // Using for...in loop to iterate through grade scale object
    for (const [letter, range] of Object.entries(this.gradeScale)) {
      if (percentage >= range.min && percentage <= range.max) {
        return letter;
      }
    }
    return "F"; // Default fallback
  }

  // Method to get GPA - demonstrating object property access
  getGPA(letterGrade) {
    return this.gradeScale[letterGrade]?.gpa || 0.0;
  }

  // Method to get category statistics - demonstrating array grouping and calculations
  getCategoryStats() {
    // Group assignments by category - demonstrating object creation and array methods
    const categoryGroups = {};

    // Use forEach to group assignments - demonstrating loops
    this.assignments.forEach((assignment) => {
      if (!categoryGroups[assignment.category]) {
        categoryGroups[assignment.category] = [];
      }
      categoryGroups[assignment.category].push(assignment);
    });

    // Calculate statistics for each category - demonstrating object manipulation
    const categoryStats = {};
    for (const [category, assignments] of Object.entries(categoryGroups)) {
      const totalPoints = assignments.reduce(
        (sum, a) => sum + a.pointsEarned,
        0
      );
      const totalPossible = assignments.reduce(
        (sum, a) => sum + a.pointsPossible,
        0
      );
      const average =
        totalPossible > 0 ? (totalPoints / totalPossible) * 100 : 0;

      categoryStats[category] = {
        assignments: assignments.length,
        average: average,
        totalPoints: totalPoints,
        totalPossible: totalPossible,
        letterGrade: this.getLetterGrade(average)
      };
    }

    return categoryStats;
  }

  // Method to update all display elements - demonstrating DOM manipulation
  updateDisplay() {
    this.updateAssignmentsList();
    this.updateStatistics();
    this.updateCategoryBreakdown();
  }

  // Method to update assignments list - demonstrating dynamic content creation
  updateAssignmentsList() {
    // Clear existing content
    this.assignmentsList.innerHTML = "";

    // Check if there are no assignments - demonstrating conditional rendering
    if (this.assignments.length === 0) {
      this.assignmentsList.innerHTML = `
                <div class="no-assignments">
                    <i class="fas fa-clipboard-list"></i>
                    <p>No assignments added yet</p>
                    <p class="subtitle">Add your first assignment to get started!</p>
                </div>
            `;
      return;
    }

    // Sort assignments by date added (newest first) - demonstrating array sorting
    const sortedAssignments = [...this.assignments].sort(
      (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
    );

    // Create assignment items - demonstrating loops and DOM creation
    sortedAssignments.forEach((assignment) => {
      const assignmentElement = this.createAssignmentElement(assignment);
      this.assignmentsList.appendChild(assignmentElement);
    });
  }

  // Method to create individual assignment element - demonstrating DOM creation
  createAssignmentElement(assignment) {
    const div = document.createElement("div");
    div.className = "assignment-item new";
    div.innerHTML = `
            <div class="assignment-header">
                <span class="assignment-name">${assignment.name}</span>
                <span class="assignment-grade grade-${assignment.letterGrade
                  .toLowerCase()
                  .charAt(0)}">
                    ${assignment.percentage.toFixed(1)}% (${
      assignment.letterGrade
    })
                </span>
            </div>
            <div class="assignment-details">
                <span><strong>Points:</strong> ${assignment.pointsEarned}/${
      assignment.pointsPossible
    }</span>
                <span><strong>Category:</strong> ${assignment.category}</span>
                <span><strong>Weight:</strong> ${assignment.weight}%</span>
                <span><strong>Date:</strong> ${new Date(
                  assignment.dateAdded
                ).toLocaleDateString()}</span>
            </div>
            <div class="assignment-actions">
                <button class="btn btn-secondary btn-small" onclick="gradeCalculator.editAssignment(${
                  assignment.id
                })">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-small" onclick="gradeCalculator.removeAssignment(${
                  assignment.id
                })">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        `;

    // Remove animation class after animation completes
    setTimeout(() => div.classList.remove("new"), 300);

    return div;
  }

  // Method to update statistics display - demonstrating calculations and DOM updates
  updateStatistics() {
    const overallGrade = this.calculateOverallGrade();
    const letterGrade = this.getLetterGrade(overallGrade);
    const gpa = this.getGPA(letterGrade);

    // Update DOM elements - demonstrating element content updates
    this.overallGradeElement.textContent = overallGrade.toFixed(1) + "%";
    this.letterGradeElement.textContent = letterGrade;
    this.gpaElement.textContent = gpa.toFixed(2);
    this.totalAssignmentsElement.textContent = this.assignments.length;

    // Apply grade color classes - demonstrating CSS class manipulation
    this.overallGradeElement.className = `stat-value grade-${letterGrade
      .toLowerCase()
      .charAt(0)}`;
    this.letterGradeElement.className = `stat-value grade-${letterGrade
      .toLowerCase()
      .charAt(0)}`;
  }

  // Method to update category breakdown - demonstrating complex data presentation
  updateCategoryBreakdown() {
    const categoryStats = this.getCategoryStats();
    this.categoryBreakdown.innerHTML = "";

    // Check if there are categories to display
    if (Object.keys(categoryStats).length === 0) {
      this.categoryBreakdown.innerHTML = `
                <div class="no-categories">
                    <i class="fas fa-chart-pie"></i>
                    <p>No categories to display</p>
                </div>
            `;
      return;
    }

    // Create category items - demonstrating object iteration and DOM creation
    for (const [category, stats] of Object.entries(categoryStats)) {
      const categoryElement = document.createElement("div");
      categoryElement.className = "category-item";
      categoryElement.innerHTML = `
                <div class="category-header">
                    <span class="category-name">${category}</span>
                    <span class="category-average grade-${stats.letterGrade
                      .toLowerCase()
                      .charAt(0)}">
                        ${stats.average.toFixed(1)}% (${stats.letterGrade})
                    </span>
                </div>
                <div class="category-details">
                    <span>${stats.assignments} assignment${
        stats.assignments !== 1 ? "s" : ""
      }</span>
                    <span>${stats.totalPoints}/${
        stats.totalPossible
      } points</span>
                </div>
                <div class="category-progress">
                    <div class="category-progress-bar" style="width: ${
                      stats.average
                    }%"></div>
                </div>
            `;
      this.categoryBreakdown.appendChild(categoryElement);
    }
  }

  // Method to load sample data - demonstrating array of objects
  loadSampleData() {
    const sampleAssignments = [
      {
        id: Date.now() + 1,
        name: "Midterm Exam",
        pointsEarned: 85,
        pointsPossible: 100,
        category: "exam",
        weight: 25,
        dateAdded: new Date().toISOString()
      },
      {
        id: Date.now() + 2,
        name: "Homework 1",
        pointsEarned: 95,
        pointsPossible: 100,
        category: "homework",
        weight: 10,
        dateAdded: new Date().toISOString()
      },
      {
        id: Date.now() + 3,
        name: "Quiz 1",
        pointsEarned: 18,
        pointsPossible: 20,
        category: "quiz",
        weight: 5,
        dateAdded: new Date().toISOString()
      },
      {
        id: Date.now() + 4,
        name: "Final Project",
        pointsEarned: 92,
        pointsPossible: 100,
        category: "project",
        weight: 30,
        dateAdded: new Date().toISOString()
      }
    ];

    // Clear existing assignments and add sample data
    this.assignments = [];
    sampleAssignments.forEach((assignment) => {
      assignment.percentage =
        (assignment.pointsEarned / assignment.pointsPossible) * 100;
      assignment.letterGrade = this.getLetterGrade(assignment.percentage);
      this.assignments.push(assignment);
    });

    this.updateDisplay();
    this.saveToStorage();
    this.showSuccessMessage("Sample data loaded successfully!");
  }

  // Method to clear all data - demonstrating array reset
  clearAllData() {
    if (
      confirm(
        "Are you sure you want to clear all assignments? This action cannot be undone."
      )
    ) {
      this.assignments = [];
      this.updateDisplay();
      this.saveToStorage();
      this.showSuccessMessage("All data cleared successfully!");
    }
  }

  // Method to save data to localStorage - demonstrating browser storage
  saveToStorage() {
    try {
      localStorage.setItem(
        "gradeCalculatorData",
        JSON.stringify(this.assignments)
      );
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  // Method to load data from localStorage - demonstrating data persistence
  loadDataFromStorage() {
    try {
      const savedData = localStorage.getItem("gradeCalculatorData");
      if (savedData) {
        this.assignments = JSON.parse(savedData);
        this.updateDisplay();
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  }

  // Method to show success message - demonstrating user feedback
  showSuccessMessage(message) {
    this.showMessage(message, "success");
  }

  // Method to show error message - demonstrating error handling UI
  showErrorMessage(message) {
    this.showMessage(message, "error");
  }

  // Method to show generic message - demonstrating dynamic UI updates
  showMessage(message, type) {
    // Create message element
    const messageDiv = document.createElement("div");
    messageDiv.className = `message message-${type}`;
    messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            ${
              type === "success"
                ? "background: #10b981;"
                : "background: #ef4444;"
            }
        `;
    messageDiv.textContent = message;

    // Add to DOM and animate
    document.body.appendChild(messageDiv);
    setTimeout(() => (messageDiv.style.transform = "translateX(0)"), 10);

    // Remove after 3 seconds
    setTimeout(() => {
      messageDiv.style.transform = "translateX(100%)";
      setTimeout(() => document.body.removeChild(messageDiv), 300);
    }, 3000);
  }
}

// Utility functions - demonstrating standalone functions

/**
 * Function to format percentage with color coding
 * Demonstrates: Function parameters, conditional logic, return values
 */
function formatPercentageWithColor(percentage) {
  let colorClass = "grade-f";
  if (percentage >= 90) colorClass = "grade-a";
  else if (percentage >= 80) colorClass = "grade-b";
  else if (percentage >= 70) colorClass = "grade-c";
  else if (percentage >= 60) colorClass = "grade-d";

  return { percentage: percentage.toFixed(1), colorClass };
}

/**
 * Function to calculate grade trend
 * Demonstrates: Array methods, mathematical calculations
 */
function calculateGradeTrend(assignments) {
  if (assignments.length < 2) return "neutral";

  // Sort by date and compare recent assignments
  const sorted = assignments.sort(
    (a, b) => new Date(a.dateAdded) - new Date(b.dateAdded)
  );
  const recent = sorted.slice(-3); // Last 3 assignments
  const previous = sorted.slice(-6, -3); // Previous 3 assignments

  if (recent.length === 0 || previous.length === 0) return "neutral";

  const recentAvg =
    recent.reduce((sum, a) => sum + a.percentage, 0) / recent.length;
  const previousAvg =
    previous.reduce((sum, a) => sum + a.percentage, 0) / previous.length;

  const difference = recentAvg - previousAvg;

  if (difference > 5) return "improving";
  if (difference < -5) return "declining";
  return "stable";
}

/**
 * Function to export data as JSON
 * Demonstrates: JSON manipulation, file handling
 */
function exportGradeData(assignments) {
  const data = {
    exportDate: new Date().toISOString(),
    assignments: assignments,
    summary: {
      totalAssignments: assignments.length,
      overallGrade:
        assignments.length > 0
          ? assignments.reduce((sum, a) => sum + a.percentage, 0) /
            assignments.length
          : 0
    }
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `grades_${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// Initialize the application when DOM is loaded - demonstrating application initialization
document.addEventListener("DOMContentLoaded", () => {
  // Create global instance - demonstrating object instantiation
  window.gradeCalculator = new GradeCalculator();

  // Display welcome message in console - demonstrating debugging practices
  console.log("📊 Grade Calculator loaded successfully!");
  console.log("💡 This project demonstrates:");
  console.log("   • Arrays and array methods (push, filter, map, reduce)");
  console.log("   • Objects and object manipulation");
  console.log("   • Functions and higher-order functions");
  console.log("   • Loops (for...of, forEach, for...in)");
  console.log("   • DOM manipulation and event handling");
  console.log("   • Local storage and data persistence");
  console.log("   • Form handling and validation");
  console.log("   • Mathematical calculations");
});

// Export for potential use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    GradeCalculator,
    formatPercentageWithColor,
    calculateGradeTrend,
    exportGradeData
  };
}
