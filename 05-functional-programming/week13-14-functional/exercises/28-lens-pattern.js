/**
 * Exercise 28: Lens Pattern for Data Manipulation
 *
 * Lenses provide a functional way to focus on and update specific parts
 * of nested data structures immutably. This exercise covers implementing
 * and using lenses for complex data manipulation.
 *
 * Difficulty: 🔴 Advanced
 */

// ==========================================
// EXERCISE 1: Basic Lens Implementation
// ==========================================

/**
 * TODO: Implement a basic Lens class
 *
 * A lens has two functions:
 * - getter: extracts a value from a data structure
 * - setter: returns a new data structure with the value updated
 */

class Lens {
  constructor(getter, setter) {
    this.getter = getter;
    this.setter = setter;
  }

  // TODO: Get value using the lens
  get(data) {
    return this.getter(data);
  }

  // TODO: Set value using the lens (immutably)
  set(newValue, data) {
    return this.setter(newValue, data);
  }

  // TODO: Update value using a function
  over(fn, data) {
    const currentValue = this.get(data);
    const newValue = fn(currentValue);
    return this.set(newValue, data);
  }

  // TODO: Compose two lenses
  compose(otherLens) {
    return new Lens(
      (data) => otherLens.get(this.get(data)),
      (newValue, data) => {
        const currentOuter = this.get(data);
        const newOuter = otherLens.set(newValue, currentOuter);
        return this.set(newOuter, data);
      }
    );
  }

  // TODO: Create lens for object property
  static prop(propName) {
    return new Lens(
      (obj) => obj[propName],
      (newValue, obj) => ({ ...obj, [propName]: newValue })
    );
  }

  // TODO: Create lens for array index
  static index(idx) {
    return new Lens(
      (arr) => arr[idx],
      (newValue, arr) => {
        const newArr = [...arr];
        newArr[idx] = newValue;
        return newArr;
      }
    );
  }

  // TODO: Create lens for nested path
  static path(pathArray) {
    return pathArray.reduce((lens, key) => {
      const nextLens =
        typeof key === "number" ? Lens.index(key) : Lens.prop(key);
      return lens ? lens.compose(nextLens) : nextLens;
    }, null);
  }
}

// ==========================================
// EXERCISE 2: Property Lenses
// ==========================================

/**
 * TODO: Create lenses for common object properties
 */

// Basic property lenses
const nameLens = null; // TODO: Create lens for 'name' property
const ageLens = null; // TODO: Create lens for 'age' property
const emailLens = null; // TODO: Create lens for 'email' property

// TODO: Test basic property lenses
const person = { name: "Alice", age: 30, email: "alice@example.com" };

// TODO: Test getting values
// console.log('Name:', nameLens.get(person));
// console.log('Age:', ageLens.get(person));

// TODO: Test setting values
// const olderPerson = ageLens.set(31, person);
// const renamedPerson = nameLens.set('Alicia', person);

// TODO: Test updating values
// const evenOlderPerson = ageLens.over(age => age + 1, person);

// ==========================================
// EXERCISE 3: Nested Object Lenses
// ==========================================

/**
 * TODO: Create lenses for nested object structures
 */

const user = {
  id: 1,
  profile: {
    personal: {
      name: "Alice Johnson",
      age: 30,
      address: {
        street: "123 Main St",
        city: "Anytown",
        country: "USA"
      }
    },
    professional: {
      title: "Software Engineer",
      company: "Tech Corp",
      experience: 5
    }
  },
  preferences: {
    theme: "dark",
    language: "en",
    notifications: {
      email: true,
      push: false,
      sms: true
    }
  }
};

// TODO: Create nested lenses
const profileLens = null; // TODO: profile property
const personalLens = null; // TODO: profile.personal
const addressLens = null; // TODO: profile.personal.address
const streetLens = null; // TODO: profile.personal.address.street
const cityLens = null; // TODO: profile.personal.address.city

// TODO: Create composed lenses for deep paths
const userStreetLens = null; // TODO: Compose to access street
const userCityLens = null; // TODO: Compose to access city
const userThemeLens = null; // TODO: Access preferences.theme
const emailNotificationLens = null; // TODO: Access preferences.notifications.email

// TODO: Test nested lenses
// console.log('Street:', userStreetLens.get(user));
// const movedUser = userCityLens.set('New City', user);
// const darkThemeUser = userThemeLens.set('light', user);

// ==========================================
// EXERCISE 4: Array Lenses
// ==========================================

/**
 * TODO: Create lenses for array manipulation
 */

const todos = [
  { id: 1, text: "Learn JavaScript", completed: false, priority: "high" },
  { id: 2, text: "Build a project", completed: false, priority: "medium" },
  { id: 3, text: "Write tests", completed: true, priority: "low" }
];

// TODO: Create array index lenses
const firstTodoLens = null; // TODO: First todo item
const secondTodoLens = null; // TODO: Second todo item

// TODO: Create lenses for specific todo properties
const firstTodoTextLens = null; // TODO: Text of first todo
const firstTodoCompletedLens = null; // TODO: Completed status of first todo
const secondTodoPriorityLens = null; // TODO: Priority of second todo

// TODO: Advanced array lens - find by predicate
const createFindLens = (predicate) => {
  return new Lens(
    (arr) => {
      const index = arr.findIndex(predicate);
      return index !== -1 ? arr[index] : undefined;
    },
    (newValue, arr) => {
      const index = arr.findIndex(predicate);
      if (index !== -1) {
        const newArr = [...arr];
        newArr[index] = newValue;
        return newArr;
      }
      return arr;
    }
  );
};

// TODO: Create specific find lenses
const todoByIdLens = (id) => null; // TODO: Find todo by ID
const todoByTextLens = (text) => null; // TODO: Find todo by text

// TODO: Test array lenses
// const completedFirstTodo = firstTodoCompletedLens.set(true, todos);
// const prioritizedSecondTodo = secondTodoPriorityLens.set('high', todos);

// ==========================================
// EXERCISE 5: Complex Data Structure Lenses
// ==========================================

/**
 * TODO: Work with complex nested data structures
 */

const appState = {
  user: {
    id: 1,
    name: "Alice",
    settings: {
      theme: "dark",
      language: "en"
    }
  },
  todos: [
    { id: 1, text: "Learn lenses", completed: false, tags: ["learning", "fp"] },
    {
      id: 2,
      text: "Build app",
      completed: false,
      tags: ["project", "development"]
    }
  ],
  ui: {
    sidebar: { collapsed: false, width: 250 },
    modal: { visible: false, content: null },
    notifications: [
      { id: 1, type: "info", message: "Welcome!", read: false },
      { id: 2, type: "warning", message: "Update available", read: true }
    ]
  }
};

// TODO: Create lenses for app state management
const userStateLens = null; // TODO: User object
const userNameStateLens = null; // TODO: User name
const userSettingsStateLens = null; // TODO: User settings
const userThemeStateLens = null; // TODO: User theme

const todosLens = null; // TODO: Todos array
const todoByIdStateLens = (id) => null; // TODO: Specific todo by ID

const uiLens = null; // TODO: UI state
const sidebarLens = null; // TODO: Sidebar state
const sidebarCollapsedLens = null; // TODO: Sidebar collapsed state
const modalLens = null; // TODO: Modal state
const modalVisibleLens = null; // TODO: Modal visibility

// TODO: Create utility lenses
const notificationsLens = null; // TODO: Notifications array
const unreadNotificationsLens = null; // TODO: Filter unread notifications

// ==========================================
// EXERCISE 6: Lens Utilities and Helpers
// ==========================================

/**
 * TODO: Create utility functions for working with lenses
 */

// TODO: Create multiple lenses utility
const createMultipleLenses = (propNames) => {
  // TODO: Return object with lenses for each property
};

// TODO: Create lens for optional properties
const optional = (lens, defaultValue = null) => {
  return new Lens(
    (data) => {
      try {
        const value = lens.get(data);
        return value !== undefined ? value : defaultValue;
      } catch {
        return defaultValue;
      }
    },
    (newValue, data) => {
      try {
        return lens.set(newValue, data);
      } catch {
        return data;
      }
    }
  );
};

// TODO: Create lens for filtering arrays
const filtered = (predicate) => {
  return new Lens(
    (arr) => arr.filter(predicate),
    (newFilteredArr, arr) => {
      // This is complex - for now, return the new filtered array
      // In practice, you'd need more sophisticated merging logic
      return newFilteredArr;
    }
  );
};

// TODO: Create lens for mapping over arrays
const mapped = (itemLens) => {
  return new Lens(
    (arr) => arr.map((item) => itemLens.get(item)),
    (newValues, arr) =>
      arr.map((item, index) =>
        index < newValues.length ? itemLens.set(newValues[index], item) : item
      )
  );
};

// ==========================================
// EXERCISE 7: State Management with Lenses
// ==========================================

/**
 * TODO: Create a state management system using lenses
 */

class StateManager {
  constructor(initialState) {
    this.state = initialState;
    this.subscribers = [];
  }

  // TODO: Get current state
  getState() {
    return this.state;
  }

  // TODO: Update state using a lens
  updateState(lens, newValue) {
    const oldState = this.state;
    this.state = lens.set(newValue, this.state);
    this.notifySubscribers(oldState, this.state);
  }

  // TODO: Update state using a function and lens
  modifyState(lens, updateFn) {
    const oldState = this.state;
    this.state = lens.over(updateFn, this.state);
    this.notifySubscribers(oldState, this.state);
  }

  // TODO: Get specific part of state using lens
  select(lens) {
    return lens.get(this.state);
  }

  // TODO: Subscribe to state changes
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  // TODO: Notify subscribers of state changes
  notifySubscribers(oldState, newState) {
    this.subscribers.forEach((callback) => callback(newState, oldState));
  }
}

// TODO: Test state management
const initialAppState = {
  user: { name: "Alice", email: "alice@example.com" },
  todos: [],
  ui: { theme: "light", sidebarOpen: true }
};

const stateManager = new StateManager(initialAppState);

// TODO: Create action creators using lenses
const actions = {
  setUserName: (name) =>
    stateManager.updateState(Lens.path(["user", "name"]), name),
  toggleSidebar: () =>
    stateManager.modifyState(Lens.path(["ui", "sidebarOpen"]), (open) => !open),
  addTodo: (todo) =>
    stateManager.modifyState(Lens.prop("todos"), (todos) => [...todos, todo]),
  toggleTheme: () =>
    stateManager.modifyState(Lens.path(["ui", "theme"]), (theme) =>
      theme === "light" ? "dark" : "light"
    )
};

// ==========================================
// EXERCISE 8: Form Handling with Lenses
// ==========================================

/**
 * TODO: Create a form handling system using lenses
 */

class FormManager {
  constructor(initialValues, validationRules = {}) {
    this.values = initialValues;
    this.errors = {};
    this.touched = {};
    this.validationRules = validationRules;
  }

  // TODO: Create lens for form field
  field(fieldName) {
    return new Lens(
      (formData) => formData.values[fieldName],
      (newValue, formData) => ({
        ...formData,
        values: { ...formData.values, [fieldName]: newValue },
        touched: { ...formData.touched, [fieldName]: true }
      })
    );
  }

  // TODO: Update field value
  updateField(fieldName, value) {
    const fieldLens = this.field(fieldName);
    const newFormData = fieldLens.set(value, this);
    Object.assign(this, newFormData);
    this.validateField(fieldName);
  }

  // TODO: Validate single field
  validateField(fieldName) {
    const rule = this.validationRules[fieldName];
    if (rule) {
      const value = this.values[fieldName];
      const error = rule(value);
      if (error) {
        this.errors[fieldName] = error;
      } else {
        delete this.errors[fieldName];
      }
    }
  }

  // TODO: Validate all fields
  validateAll() {
    Object.keys(this.validationRules).forEach((fieldName) => {
      this.validateField(fieldName);
    });
    return Object.keys(this.errors).length === 0;
  }

  // TODO: Get form state
  getState() {
    return {
      values: this.values,
      errors: this.errors,
      touched: this.touched,
      isValid: Object.keys(this.errors).length === 0
    };
  }
}

// ==========================================
// EXERCISE 9: Performance Optimization
// ==========================================

/**
 * TODO: Optimize lenses for performance
 */

// TODO: Memoized lens creation
const memoizedLens = (() => {
  const cache = new Map();

  return (getter, setter) => {
    const key = `${getter.toString()}-${setter.toString()}`;
    if (!cache.has(key)) {
      cache.set(key, new Lens(getter, setter));
    }
    return cache.get(key);
  };
})();

// TODO: Path-based lens caching
const pathLensCache = new Map();

const cachedPathLens = (path) => {
  const pathKey = Array.isArray(path) ? path.join(".") : path;
  if (!pathLensCache.has(pathKey)) {
    pathLensCache.set(
      pathKey,
      Lens.path(Array.isArray(path) ? path : path.split("."))
    );
  }
  return pathLensCache.get(pathKey);
};

// TODO: Immutable update optimization
const optimizedSet = (path, value, obj) => {
  // Use structural sharing for better performance
  const pathArray = Array.isArray(path) ? path : path.split(".");

  const updateRecursive = (current, pathIndex) => {
    if (pathIndex >= pathArray.length) {
      return value;
    }

    const key = pathArray[pathIndex];
    const nextValue = updateRecursive(current[key], pathIndex + 1);

    if (Array.isArray(current)) {
      const newArray = [...current];
      newArray[key] = nextValue;
      return newArray;
    } else {
      return { ...current, [key]: nextValue };
    }
  };

  return updateRecursive(obj, 0);
};

// ==========================================
// EXERCISE 10: Real-world Application
// ==========================================

/**
 * TODO: Build a complete application using lenses
 *
 * Create a todo application with:
 * - User management
 * - Todo CRUD operations
 * - Filtering and sorting
 * - Settings management
 */

const createTodoApp = () => {
  const initialState = {
    user: {
      id: 1,
      name: "Alice",
      preferences: {
        theme: "light",
        defaultPriority: "medium",
        sortBy: "dueDate"
      }
    },
    todos: [],
    filters: {
      showCompleted: true,
      priority: "all",
      search: ""
    },
    ui: {
      editingTodo: null,
      selectedTodos: []
    }
  };

  const stateManager = new StateManager(initialState);

  // TODO: Create lenses for the application
  const lenses = {
    user: Lens.prop("user"),
    userName: Lens.path(["user", "name"]),
    userTheme: Lens.path(["user", "preferences", "theme"]),
    todos: Lens.prop("todos"),
    filters: Lens.prop("filters"),
    searchFilter: Lens.path(["filters", "search"]),
    ui: Lens.prop("ui"),
    editingTodo: Lens.path(["ui", "editingTodo"])
  };

  // TODO: Create application actions
  const actions = {
    // User actions
    setUserName: (name) => stateManager.updateState(lenses.userName, name),
    setTheme: (theme) => stateManager.updateState(lenses.userTheme, theme),

    // Todo actions
    addTodo: (todo) =>
      stateManager.modifyState(lenses.todos, (todos) => [
        ...todos,
        { id: Date.now(), ...todo, completed: false, createdAt: new Date() }
      ]),

    updateTodo: (id, updates) =>
      stateManager.modifyState(lenses.todos, (todos) =>
        todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
      ),

    deleteTodo: (id) =>
      stateManager.modifyState(lenses.todos, (todos) =>
        todos.filter((todo) => todo.id !== id)
      ),

    toggleTodo: (id) =>
      stateManager.modifyState(lenses.todos, (todos) =>
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      ),

    // Filter actions
    setSearchFilter: (search) =>
      stateManager.updateState(lenses.searchFilter, search),

    // UI actions
    setEditingTodo: (todoId) =>
      stateManager.updateState(lenses.editingTodo, todoId)
  };

  // TODO: Create selectors using lenses
  const selectors = {
    getUser: () => stateManager.select(lenses.user),
    getTodos: () => stateManager.select(lenses.todos),
    getFilteredTodos: () => {
      const todos = stateManager.select(lenses.todos);
      const filters = stateManager.select(lenses.filters);

      return todos.filter((todo) => {
        if (!filters.showCompleted && todo.completed) return false;
        if (filters.priority !== "all" && todo.priority !== filters.priority)
          return false;
        if (
          filters.search &&
          !todo.text.toLowerCase().includes(filters.search.toLowerCase())
        )
          return false;
        return true;
      });
    },
    getEditingTodo: () => {
      const editingId = stateManager.select(lenses.editingTodo);
      const todos = stateManager.select(lenses.todos);
      return todos.find((todo) => todo.id === editingId);
    }
  };

  return {
    actions,
    selectors,
    subscribe: stateManager.subscribe.bind(stateManager),
    getState: stateManager.getState.bind(stateManager)
  };
};

// TODO: Test the todo application
// const todoApp = createTodoApp();
// todoApp.actions.addTodo({ text: 'Learn lenses', priority: 'high' });
// todoApp.actions.setSearchFilter('lens');
// console.log('Filtered todos:', todoApp.selectors.getFilteredTodos());

console.log("Lens Pattern exercises loaded. Implement the TODOs above!");
