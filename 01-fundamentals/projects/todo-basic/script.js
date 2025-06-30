/**
 * Todo List Application - Demonstrating Core JavaScript Concepts
 * This application showcases arrays, objects, DOM manipulation, local storage, and more
 */

// Todo Class - Demonstrating Object-Oriented Programming and Constructor Functions
class Todo {
  constructor(
    title,
    description = "",
    priority = "medium",
    category = "personal",
    dueDate = null
  ) {
    this.id = Date.now() + Math.random(); // Simple unique ID generation
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.category = category;
    this.dueDate = dueDate;
    this.completed = false;
    this.createdAt = new Date().toISOString();
    this.completedAt = null;
  }

  // Method to toggle completion status - demonstrating object methods
  toggleComplete() {
    this.completed = !this.completed;
    this.completedAt = this.completed ? new Date().toISOString() : null;
  }

  // Method to check if todo is overdue - demonstrating date manipulation
  isOverdue() {
    if (!this.dueDate || this.completed) return false;
    return new Date(this.dueDate) < new Date();
  }

  // Method to check if todo is due soon (within 3 days) - demonstrating date calculations
  isDueSoon() {
    if (!this.dueDate || this.completed || this.isOverdue()) return false;
    const dueDate = new Date(this.dueDate);
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
    return dueDate <= threeDaysFromNow;
  }

  // Method to get priority level as number for sorting - demonstrating object methods
  getPriorityLevel() {
    const priorities = { urgent: 4, high: 3, medium: 2, low: 1 };
    return priorities[this.priority] || 1;
  }
}

// TodoManager Class - Demonstrating Class-based Architecture
class TodoManager {
  constructor() {
    // Array to store todos - demonstrating array usage
    this.todos = [];
    this.currentFilter = "all";
    this.currentSort = "dateCreated";
    this.editingTodoId = null; // Track which todo is being edited

    // DOM elements - demonstrating element selection and storage
    this.initializeElements();
    this.attachEventListeners();
    this.loadFromStorage();
    this.render();
  }

  // Method to initialize DOM elements
  initializeElements() {
    this.todoForm = document.getElementById("todoForm");
    this.todosList = document.getElementById("todosList");
    this.filterSelect = document.getElementById("filterStatus");
    this.sortSelect = document.getElementById("sortBy");
    this.cancelEditBtn = document.getElementById("cancelEdit");

    // Statistics elements
    this.totalTasksElement = document.getElementById("totalTasks");
    this.completedTasksElement = document.getElementById("completedTasks");
    this.pendingTasksElement = document.getElementById("pendingTasks");
    this.completionRateElement = document.getElementById("completionRate");

    // Category breakdown
    this.categoryBreakdownElement =
      document.getElementById("categoryBreakdown");

    // Action buttons
    this.markAllCompleteBtn = document.getElementById("markAllComplete");
    this.clearCompletedBtn = document.getElementById("clearCompleted");
    this.loadSampleBtn = document.getElementById("loadSampleTodos");
    this.clearAllBtn = document.getElementById("clearAllTodos");
  }

  // Method to attach event listeners - demonstrating event handling
  attachEventListeners() {
    // Form submission - demonstrating form handling
    this.todoForm.addEventListener("submit", (e) => this.handleAddTodo(e));

    // Cancel edit button
    this.cancelEditBtn.addEventListener("click", () => this.cancelEdit());

    // Filter and sort changes - demonstrating select element events
    this.filterSelect.addEventListener("change", (e) =>
      this.handleFilterChange(e)
    );
    this.sortSelect.addEventListener("change", (e) => this.handleSortChange(e));

    // Action button events - demonstrating button click events
    this.markAllCompleteBtn.addEventListener("click", () =>
      this.markAllComplete()
    );
    this.clearCompletedBtn.addEventListener("click", () =>
      this.clearCompleted()
    );
    this.loadSampleBtn.addEventListener("click", () => this.loadSampleData());
    this.clearAllBtn.addEventListener("click", () => this.clearAll());

    // Set minimum date to today for due date input
    const dueDateInput = document.getElementById("todoDueDate");
    dueDateInput.min = new Date().toISOString().split("T")[0];
  }

  // Method to handle adding new todo - demonstrating form data processing
  handleAddTodo(event) {
    event.preventDefault();

    // Extract form data - demonstrating form element access
    const formData = new FormData(this.todoForm);
    const title = document.getElementById("todoTitle").value.trim();
    const description = document.getElementById("todoDescription").value.trim();
    const priority = document.getElementById("todoPriority").value;
    const category = document.getElementById("todoCategory").value;
    const dueDate = document.getElementById("todoDueDate").value;

    // Validate input - demonstrating validation logic
    if (!title) {
      this.showMessage("Please enter a task title", "error");
      return;
    }

    if (this.editingTodoId) {
      // Update existing todo
      this.updateTodo(this.editingTodoId, {
        title,
        description,
        priority,
        category,
        dueDate: dueDate || null
      });
      this.showMessage("Task updated successfully!", "success");
    } else {
      // Create new todo - demonstrating object instantiation
      const newTodo = new Todo(
        title,
        description,
        priority,
        category,
        dueDate || null
      );

      // Add to todos array - demonstrating array manipulation
      this.addTodo(newTodo);
      this.showMessage("Task added successfully!", "success");
    }

    // Reset form completely - demonstrating form reset
    this.resetForm();
  }

  // Method to add todo to the list - demonstrating array methods
  addTodo(todo) {
    this.todos.push(todo);
    this.saveToStorage();
    this.render();
  }

  // Method to reset form to default values
  resetForm() {
    this.todoForm.reset();
    // Set default values explicitly
    document.getElementById("todoPriority").value = "medium";
    document.getElementById("todoCategory").value = "personal";
    document.getElementById("todoDueDate").value = "";
    // Clear any edit state
    this.editingTodoId = null;
    this.updateFormButtonText();
  }

  // Method to update form button text based on mode
  updateFormButtonText() {
    const submitButton = this.todoForm.querySelector('button[type="submit"]');
    if (this.editingTodoId) {
      submitButton.innerHTML = '<i class="fas fa-save"></i> Update Task';
      submitButton.className = "btn btn-warning";
      this.cancelEditBtn.style.display = "inline-flex";
    } else {
      submitButton.innerHTML = '<i class="fas fa-plus"></i> Add Task';
      submitButton.className = "btn btn-primary";
      this.cancelEditBtn.style.display = "none";
    }
  }

  // Method to cancel edit mode
  cancelEdit() {
    this.resetForm();
    this.showMessage("Edit cancelled", "info");
  }

  // Method to toggle todo completion - demonstrating array methods and object manipulation
  toggleTodo(id) {
    // Find todo using array find method - demonstrating array search
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.toggleComplete();
      this.saveToStorage();
      this.render();
    }
  }

  // Method to delete todo - demonstrating array filtering
  deleteTodo(id) {
    // Use filter to remove todo - demonstrating array methods
    this.todos = this.todos.filter((t) => t.id !== id);
    this.saveToStorage();
    this.render();
    this.showMessage("Task deleted successfully!", "success");
  }

  // Method to update existing todo - demonstrating object property updates
  updateTodo(id, updates) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      // Update properties
      todo.title = updates.title;
      todo.description = updates.description;
      todo.priority = updates.priority;
      todo.category = updates.category;
      todo.dueDate = updates.dueDate;

      // Recalculate percentage if needed
      if (
        todo.pointsEarned !== undefined &&
        todo.pointsPossible !== undefined
      ) {
        todo.percentage = (todo.pointsEarned / todo.pointsPossible) * 100;
      }

      this.saveToStorage();
      this.render();
    }
  }

  // Method to edit todo - demonstrating form population and edit mode
  editTodo(id) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      // Set editing mode
      this.editingTodoId = id;

      // Populate form with existing data - demonstrating form manipulation
      document.getElementById("todoTitle").value = todo.title;
      document.getElementById("todoDescription").value = todo.description;
      document.getElementById("todoPriority").value = todo.priority;
      document.getElementById("todoCategory").value = todo.category;
      document.getElementById("todoDueDate").value = todo.dueDate || "";

      // Update button text to show edit mode
      this.updateFormButtonText();

      // Scroll to form
      document
        .querySelector(".input-section")
        .scrollIntoView({ behavior: "smooth" });

      // Focus on title input
      document.getElementById("todoTitle").focus();
    }
  }

  // Method to handle filter changes - demonstrating event handling and rendering
  handleFilterChange(event) {
    this.currentFilter = event.target.value;
    this.render();
  }

  // Method to handle sort changes - demonstrating sorting and rendering
  handleSortChange(event) {
    this.currentSort = event.target.value;
    this.render();
  }

  // Method to get filtered todos - demonstrating array filtering and conditional logic
  getFilteredTodos() {
    let filtered = [...this.todos]; // Create copy using spread operator

    // Apply filter - demonstrating switch statement
    switch (this.currentFilter) {
      case "completed":
        filtered = filtered.filter((todo) => todo.completed);
        break;
      case "pending":
        filtered = filtered.filter((todo) => !todo.completed);
        break;
      default: // 'all'
        // No filtering needed
        break;
    }

    return filtered;
  }

  // Method to get sorted todos - demonstrating array sorting with custom comparators
  getSortedTodos(todos) {
    return [...todos].sort((a, b) => {
      switch (this.currentSort) {
        case "title":
          return a.title.localeCompare(b.title);
        case "priority":
          // Sort by priority level (urgent first)
          return b.getPriorityLevel() - a.getPriorityLevel();
        case "dueDate":
          // Handle null due dates
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case "dateCreated":
        default:
          // Sort by creation date (newest first)
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }

  // Method to render all components - demonstrating modular rendering
  render() {
    this.renderTodos();
    this.renderStatistics();
    this.renderCategoryBreakdown();
  }

  // Method to render todos list - demonstrating dynamic DOM creation
  renderTodos() {
    const filteredTodos = this.getFilteredTodos();
    const sortedTodos = this.getSortedTodos(filteredTodos);

    // Clear existing content
    this.todosList.innerHTML = "";

    // Check if there are no todos - demonstrating conditional rendering
    if (sortedTodos.length === 0) {
      const message =
        this.currentFilter === "all"
          ? "No tasks yet"
          : `No ${this.currentFilter} tasks`;

      this.todosList.innerHTML = `
                <div class="no-todos">
                    <i class="fas fa-clipboard-list"></i>
                    <p>${message}</p>
                    <p class="subtitle">${
                      this.currentFilter === "all"
                        ? "Add your first task to get started!"
                        : "Try changing the filter above."
                    }</p>
                </div>
            `;
      return;
    }

    // Create todo elements - demonstrating loops and DOM creation
    sortedTodos.forEach((todo) => {
      const todoElement = this.createTodoElement(todo);
      this.todosList.appendChild(todoElement);
    });
  }

  // Method to create individual todo element - demonstrating complex DOM creation
  createTodoElement(todo) {
    const div = document.createElement("div");
    div.className = `todo-item ${todo.completed ? "completed" : ""} new`;

    // Format due date - demonstrating date formatting and conditional logic
    let dueDateHtml = "";
    if (todo.dueDate) {
      const dueDate = new Date(todo.dueDate);
      const formattedDate = dueDate.toLocaleDateString();
      let dueDateClass = "";

      if (todo.isOverdue()) {
        dueDateClass = "overdue";
        dueDateHtml = `<span class="todo-due-date ${dueDateClass}">
                    <i class="fas fa-exclamation-triangle"></i> Overdue: ${formattedDate}
                </span>`;
      } else if (todo.isDueSoon()) {
        dueDateClass = "due-soon";
        dueDateHtml = `<span class="todo-due-date ${dueDateClass}">
                    <i class="fas fa-clock"></i> Due soon: ${formattedDate}
                </span>`;
      } else {
        dueDateHtml = `<span class="todo-due-date">
                    <i class="fas fa-calendar"></i> Due: ${formattedDate}
                </span>`;
      }
    }

    // Get priority emoji - demonstrating object mapping
    const priorityEmojis = {
      low: "🟢",
      medium: "🟡",
      high: "🔴",
      urgent: "🚨"
    };

    // Create HTML content - demonstrating template literals and conditional content
    div.innerHTML = `
            <div class="todo-header">
                <div class="todo-checkbox ${todo.completed ? "checked" : ""}"
                     onclick="todoManager.toggleTodo(${todo.id})">
                    ${todo.completed ? "✓" : ""}
                </div>
                <div class="todo-content">
                    <h3 class="todo-title">${this.escapeHtml(todo.title)}</h3>
                    ${
                      todo.description
                        ? `<p class="todo-description">${this.escapeHtml(
                            todo.description
                          )}</p>`
                        : ""
                    }
                    <div class="todo-meta">
                        <span class="todo-priority priority-${todo.priority}">
                            ${priorityEmojis[todo.priority]} ${
      todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)
    }
                        </span>
                        <span class="todo-category">${todo.category}</span>
                        ${dueDateHtml}
                        <span class="todo-created">
                            <i class="fas fa-plus"></i> ${new Date(
                              todo.createdAt
                            ).toLocaleDateString()}
                        </span>
                    </div>
                    <div class="todo-actions">
                        <button class="btn btn-secondary btn-small" onclick="todoManager.editTodo(${
                          todo.id
                        })">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-small" onclick="todoManager.deleteTodo(${
                          todo.id
                        })">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;

    // Remove animation class after animation completes
    setTimeout(() => div.classList.remove("new"), 300);

    return div;
  }

  // Method to render statistics - demonstrating calculations and DOM updates
  renderStatistics() {
    const total = this.todos.length;
    const completed = this.todos.filter((t) => t.completed).length;
    const pending = total - completed;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update DOM elements - demonstrating element content updates
    this.totalTasksElement.textContent = total;
    this.completedTasksElement.textContent = completed;
    this.pendingTasksElement.textContent = pending;
    this.completionRateElement.textContent = `${completionRate}%`;
  }

  // Method to render category breakdown - demonstrating data grouping and analysis
  renderCategoryBreakdown() {
    // Group todos by category - demonstrating object creation and array methods
    const categoryStats = {};

    this.todos.forEach((todo) => {
      if (!categoryStats[todo.category]) {
        categoryStats[todo.category] = {
          total: 0,
          completed: 0
        };
      }
      categoryStats[todo.category].total++;
      if (todo.completed) {
        categoryStats[todo.category].completed++;
      }
    });

    // Clear existing content
    this.categoryBreakdownElement.innerHTML = "";

    // Check if there are categories to display
    if (Object.keys(categoryStats).length === 0) {
      this.categoryBreakdownElement.innerHTML = `
                <div class="no-categories">
                    <i class="fas fa-tag"></i>
                    <p>No categories yet</p>
                </div>
            `;
      return;
    }

    // Create category elements - demonstrating object iteration
    for (const [category, stats] of Object.entries(categoryStats)) {
      const categoryElement = document.createElement("div");
      categoryElement.className = "category-item";
      categoryElement.innerHTML = `
                <span class="category-name">${category}</span>
                <span class="category-count">${stats.completed}/${stats.total}</span>
            `;
      this.categoryBreakdownElement.appendChild(categoryElement);
    }
  }

  // Method to mark all todos as complete - demonstrating array methods and bulk operations
  markAllComplete() {
    if (this.todos.length === 0) {
      this.showMessage("No tasks to mark as complete", "warning");
      return;
    }

    const pendingTodos = this.todos.filter((t) => !t.completed);
    if (pendingTodos.length === 0) {
      this.showMessage("All tasks are already completed", "info");
      return;
    }

    // Mark all as complete - demonstrating array iteration
    this.todos.forEach((todo) => {
      if (!todo.completed) {
        todo.toggleComplete();
      }
    });

    this.saveToStorage();
    this.render();
    this.showMessage(
      `Marked ${pendingTodos.length} tasks as complete!`,
      "success"
    );
  }

  // Method to clear completed todos - demonstrating array filtering
  clearCompleted() {
    const completedCount = this.todos.filter((t) => t.completed).length;

    if (completedCount === 0) {
      this.showMessage("No completed tasks to clear", "warning");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete ${completedCount} completed task${
          completedCount > 1 ? "s" : ""
        }?`
      )
    ) {
      this.todos = this.todos.filter((t) => !t.completed);
      this.saveToStorage();
      this.render();
      this.showMessage(`Cleared ${completedCount} completed tasks!`, "success");
    }
  }

  // Method to load sample data - demonstrating array of objects and bulk operations
  loadSampleData() {
    const sampleTodos = [
      new Todo(
        "Complete JavaScript Fundamentals Course",
        "Finish all modules and projects in the JavaScript fundamentals course",
        "high",
        "study",
        this.getDateString(3) // 3 days from now
      ),
      new Todo(
        "Buy groceries",
        "Milk, bread, eggs, and vegetables for the week",
        "medium",
        "shopping",
        this.getDateString(1) // Tomorrow
      ),
      new Todo(
        "Exercise for 30 minutes",
        "Go for a run or do home workout",
        "medium",
        "health",
        this.getDateString(0) // Today
      ),
      new Todo(
        "Prepare presentation for work",
        "Create slides for the quarterly review meeting",
        "urgent",
        "work",
        this.getDateString(2) // 2 days from now
      ),
      new Todo(
        "Call mom",
        "Weekly check-in call with family",
        "low",
        "personal"
      ),
      new Todo(
        "Read 20 pages of book",
        "Continue reading the current programming book",
        "low",
        "personal"
      )
    ];

    // Add sample todos - demonstrating array concatenation
    this.todos = [...this.todos, ...sampleTodos];
    this.saveToStorage();
    this.render();
    this.showMessage("Sample data loaded successfully!", "success");
  }

  // Method to clear all todos - demonstrating confirmation and array reset
  clearAll() {
    if (this.todos.length === 0) {
      this.showMessage("No tasks to clear", "warning");
      return;
    }

    if (
      confirm(
        `Are you sure you want to delete all ${this.todos.length} tasks? This action cannot be undone.`
      )
    ) {
      this.todos = [];
      this.saveToStorage();
      this.render();
      this.showMessage("All tasks cleared successfully!", "success");
    }
  }

  // Method to save data to localStorage - demonstrating browser storage
  saveToStorage() {
    try {
      localStorage.setItem("todoListData", JSON.stringify(this.todos));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      this.showMessage("Error saving data", "error");
    }
  }

  // Method to load data from localStorage - demonstrating data persistence and error handling
  loadFromStorage() {
    try {
      const savedData = localStorage.getItem("todoListData");
      if (savedData) {
        const todoData = JSON.parse(savedData);
        // Recreate Todo objects from plain objects - demonstrating object reconstruction
        this.todos = todoData.map((data) => {
          const todo = new Todo(
            data.title,
            data.description,
            data.priority,
            data.category,
            data.dueDate
          );
          todo.id = data.id;
          todo.completed = data.completed;
          todo.createdAt = data.createdAt;
          todo.completedAt = data.completedAt;
          return todo;
        });
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      this.showMessage("Error loading saved data", "error");
    }
  }

  // Utility method to escape HTML - demonstrating security practices
  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  // Utility method to get date string - demonstrating date manipulation
  getDateString(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split("T")[0];
  }

  // Method to show messages to user - demonstrating user feedback and DOM manipulation
  showMessage(message, type = "info") {
    // Create message element
    const messageDiv = document.createElement("div");
    messageDiv.className = `message message-${type}`;

    // Style based on type - demonstrating conditional styling
    const colors = {
      success: "#10b981",
      error: "#ef4444",
      warning: "#f59e0b",
      info: "#3b82f6"
    };

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
            background: ${colors[type] || colors.info};
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        `;
    messageDiv.textContent = message;

    // Add to DOM and animate - demonstrating animation and timing
    document.body.appendChild(messageDiv);
    setTimeout(() => (messageDiv.style.transform = "translateX(0)"), 10);

    // Remove after 3 seconds
    setTimeout(() => {
      messageDiv.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (document.body.contains(messageDiv)) {
          document.body.removeChild(messageDiv);
        }
      }, 300);
    }, 3000);
  }
}

// Utility functions - demonstrating standalone functions and helper methods

/**
 * Function to analyze todo trends
 * Demonstrates: Array methods, date calculations, statistical analysis
 */
function analyzeTodoTrends(todos) {
  if (todos.length === 0) return null;

  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Filter todos from last week
  const recentTodos = todos.filter(
    (todo) => new Date(todo.createdAt) >= lastWeek
  );
  const recentCompleted = recentTodos.filter((todo) => todo.completed);

  return {
    totalThisWeek: recentTodos.length,
    completedThisWeek: recentCompleted.length,
    completionRate:
      recentTodos.length > 0
        ? Math.round((recentCompleted.length / recentTodos.length) * 100)
        : 0,
    averageCompletionTime: calculateAverageCompletionTime(recentCompleted)
  };
}

/**
 * Function to calculate average completion time
 * Demonstrates: Date calculations, array reduce method
 */
function calculateAverageCompletionTime(completedTodos) {
  if (completedTodos.length === 0) return 0;

  const totalTime = completedTodos.reduce((sum, todo) => {
    if (todo.completedAt && todo.createdAt) {
      const created = new Date(todo.createdAt);
      const completed = new Date(todo.completedAt);
      return sum + (completed - created);
    }
    return sum;
  }, 0);

  return Math.round(totalTime / completedTodos.length / (1000 * 60 * 60 * 24)); // Days
}

/**
 * Function to export todos as JSON
 * Demonstrates: JSON manipulation, file download
 */
function exportTodos(todos) {
  const exportData = {
    exportDate: new Date().toISOString(),
    totalTodos: todos.length,
    completedTodos: todos.filter((t) => t.completed).length,
    todos: todos
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `todos_${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Function to format relative time
 * Demonstrates: Date calculations, conditional logic
 */
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

// Initialize the application when DOM is loaded - demonstrating application lifecycle
document.addEventListener("DOMContentLoaded", () => {
  // Create global instance - demonstrating object instantiation
  window.todoManager = new TodoManager();

  // Add keyboard shortcuts - demonstrating advanced event handling
  document.addEventListener("keydown", (event) => {
    // Ctrl/Cmd + Enter to add todo quickly
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      const titleInput = document.getElementById("todoTitle");
      if (titleInput.value.trim()) {
        document.getElementById("todoForm").dispatchEvent(new Event("submit"));
      } else {
        titleInput.focus();
      }
    }

    // Escape to clear form
    if (event.key === "Escape") {
      document.getElementById("todoForm").reset();
      document.getElementById("todoTitle").blur();
    }
  });

  // Display welcome message in console - demonstrating debugging practices
  console.log("✅ Todo List application loaded successfully!");
  console.log("💡 This project demonstrates:");
  console.log(
    "   • Arrays and array methods (push, filter, map, sort, reduce)"
  );
  console.log("   • Objects and classes");
  console.log("   • DOM manipulation and event handling");
  console.log("   • Local storage and data persistence");
  console.log("   • Form handling and validation");
  console.log("   • Date manipulation and calculations");
  console.log("   • Conditional logic and control flow");
  console.log("🎯 Try using Ctrl+Enter to quickly add todos!");
});

// Export for potential use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    Todo,
    TodoManager,
    analyzeTodoTrends,
    calculateAverageCompletionTime,
    exportTodos,
    formatRelativeTime
  };
}
