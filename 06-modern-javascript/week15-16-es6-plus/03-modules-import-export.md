# ES6 Modules: Import and Export

## Learning Objectives

- Understand the ES6 module system and its benefits
- Master import and export syntax variations
- Implement module patterns for code organization
- Handle dynamic imports and lazy loading
- Apply module bundling concepts and best practices

## Introduction to ES6 Modules

ES6 modules provide a standardized way to organize and share code across files. They replace older patterns like CommonJS (Node.js) and AMD, offering static analysis, tree shaking, and better tooling support.

## Basic Export Syntax

### Named Exports

```javascript
// math.js - Multiple named exports
export const PI = 3.14159;
export const E = 2.71828;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export class Calculator {
  static add(a, b) {
    return a + b;
  }

  static subtract(a, b) {
    return a - b;
  }
}

// Alternative syntax - export at the end
const GOLDEN_RATIO = 1.618;
const subtract = (a, b) => a - b;

function divide(a, b) {
  if (b === 0) throw new Error("Division by zero");
  return a / b;
}

export { GOLDEN_RATIO, subtract, divide };

// Rename during export
const internalFunction = () => "internal";
export { internalFunction as publicFunction };
```

### Default Exports

```javascript
// logger.js - Default export
export default class Logger {
  constructor(level = 'info') {
    this.level = level;
  }

  log(message) {
    console.log(`[${this.level.toUpperCase()}] ${message}`);
  }

  error(message) {
    console.error(`[ERROR] ${message}`);
  }
}

// utils.js - Default export function
export default function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// config.js - Default export object
export default {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
  headers: {
    'Content-Type': 'application/json'
  }
};

// constants.js - Mixed exports
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

export const MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'An error occurred'
};

// Default export alongside named exports
export default {
  development: {
    database: 'dev_db',
    debug: true
  },
  production: {
    database: 'prod_db',
    debug: false
  }
};
```

## Basic Import Syntax

### Named Imports

```javascript
// app.js - Importing named exports
import { add, multiply, PI } from "./math.js";

console.log(add(5, 3)); // 8
console.log(multiply(4, 7)); // 28
console.log(PI); // 3.14159

// Import with renaming
import { add as sum, multiply as product, Calculator as Calc } from "./math.js";

console.log(sum(2, 3)); // 5
console.log(product(4, 5)); // 20

const calc = new Calc();

// Import everything as namespace
import * as Math from "./math.js";

console.log(Math.add(1, 2)); // 3
console.log(Math.PI); // 3.14159
console.log(Math.Calculator); // Class constructor
```

### Default Imports

```javascript
// app.js - Importing default exports
import Logger from "./logger.js";
import formatDate from "./utils.js";
import config from "./config.js";

const logger = new Logger("debug");
logger.log("Application started");

const now = new Date();
console.log(formatDate(now));

console.log(config.apiUrl);

// Mixed imports (default + named)
import appConfig, { STATUS_CODES, MESSAGES } from "./constants.js";

console.log(appConfig.development.database);
console.log(STATUS_CODES.OK);
console.log(MESSAGES.SUCCESS);
```

### Import Side Effects Only

```javascript
// polyfills.js
if (!Array.prototype.includes) {
  Array.prototype.includes = function (element) {
    return this.indexOf(element) !== -1;
  };
}

// styles.css import (in bundled environment)
import "./styles.css";

// Execute initialization code
import "./polyfills.js";
import "./analytics-setup.js";
```

## Advanced Module Patterns

### Re-exports and Barrel Exports

```javascript
// components/index.js - Barrel export pattern
export { default as Button } from "./Button.js";
export { default as Input } from "./Input.js";
export { default as Modal } from "./Modal.js";
export { default as Card } from "./Card.js";

// Re-export with renaming
export { default as PrimaryButton, ButtonVariant } from "./Button.js";

// Re-export everything
export * from "./utils.js";

// Usage in other files
import { Button, Input, Modal } from "./components/index.js";

// api/index.js - API module organization
export { default as UserAPI } from "./users.js";
export { default as ProductAPI } from "./products.js";
export { default as OrderAPI } from "./orders.js";

// Export utilities
export {
  createAuthHeaders,
  handleApiError,
  formatApiResponse
} from "./utils.js";

// Main API client
export { default } from "./client.js";
```

### Module Factories and Configuration

```javascript
// database.js - Configurable module
class DatabaseConnection {
  constructor(config) {
    this.host = config.host;
    this.port = config.port;
    this.database = config.database;
    this.connected = false;
  }

  async connect() {
    // Connection logic
    this.connected = true;
    console.log(`Connected to ${this.host}:${this.port}/${this.database}`);
  }

  async query(sql, params) {
    if (!this.connected) {
      throw new Error("Database not connected");
    }
    // Query logic
    return { results: [], rowCount: 0 };
  }
}

// Factory function for creating configured instances
export function createDatabase(config) {
  return new DatabaseConnection(config);
}

// Export the class for advanced usage
export { DatabaseConnection };

// Default configuration
export const defaultConfig = {
  host: "localhost",
  port: 5432,
  database: "myapp"
};

// app.js - Using configurable module
import { createDatabase, defaultConfig } from "./database.js";

const db = createDatabase({
  ...defaultConfig,
  host: process.env.DB_HOST || defaultConfig.host,
  database: process.env.DB_NAME || defaultConfig.database
});

await db.connect();
```

### Plugin System with Modules

```javascript
// pluginSystem.js
class PluginSystem {
  constructor() {
    this.plugins = new Map();
  }

  register(name, plugin) {
    this.plugins.set(name, plugin);
    console.log(`Plugin '${name}' registered`);
  }

  async loadPlugin(modulePath) {
    try {
      const module = await import(modulePath);
      const plugin = module.default || module;

      if (plugin.name && plugin.initialize) {
        this.register(plugin.name, plugin);
        await plugin.initialize();
      } else {
        throw new Error('Invalid plugin format');
      }
    } catch (error) {
      console.error(`Failed to load plugin: ${error.message}`);
    }
  }

  getPlugin(name) {
    return this.plugins.get(name);
  }
}

export default new PluginSystem();

// plugins/analytics.js
export default {
  name: 'analytics',

  async initialize() {
    console.log('Analytics plugin initialized');
    // Setup analytics
  },

  track(event, data) {
    console.log('Tracking event:', event, data);
  },

  pageView(page) {
    this.track('page_view', { page });
  }
};

// plugins/auth.js
export default {
  name: 'auth',

  async initialize() {
    console.log('Auth plugin initialized');
    // Setup authentication
  },

  login(credentials) {
    // Login logic
    return { token: 'fake-jwt-token', user: { id: 1, name: 'John' } };
  },

  logout() {
    // Logout logic
    console.log('User logged out');
  }
};

// main.js - Using plugin system
import pluginSystem from './pluginSystem.js';

async function initializeApp() {
  // Load plugins dynamically
  await pluginSystem.loadPlugin('./plugins/analytics.js');
  await pluginSystem.loadPlugin('./plugins/auth.js');

  // Use plugins
  const analytics = pluginSystem.getPlugin('analytics');
  const auth = pluginSystem.getPlugin('auth');

  analytics.pageView('/home');

  const loginResult = auth.login({ email: 'user@example.com', password: 'password' });
  console.log('Login result:', loginResult);
}

initializeApp();
```

## Dynamic Imports

### Basic Dynamic Import

```javascript
// Dynamic import returns a Promise
async function loadModule() {
  try {
    const mathModule = await import("./math.js");

    console.log(mathModule.add(5, 3)); // 8
    console.log(mathModule.PI); // 3.14159

    // Access default export
    if (mathModule.default) {
      console.log(mathModule.default);
    }
  } catch (error) {
    console.error("Failed to load module:", error);
  }
}

// Using .then() syntax
import("./utils.js")
  .then((module) => {
    const formatDate = module.default;
    console.log(formatDate(new Date()));
  })
  .catch((error) => console.error("Import failed:", error));
```

### Conditional Loading

```javascript
// Load modules based on conditions
async function initializeFeatures() {
  const isProduction = process.env.NODE_ENV === "production";

  if (isProduction) {
    // Load production analytics
    const { default: analytics } = await import("./analytics.js");
    analytics.initialize();
  } else {
    // Load development tools
    const { default: devTools } = await import("./dev-tools.js");
    devTools.setup();
  }

  // Feature flags
  const features = await loadFeatureFlags();

  if (features.enableChat) {
    const { ChatWidget } = await import("./chat-widget.js");
    new ChatWidget().render();
  }

  if (features.enableNotifications) {
    const { NotificationManager } = await import("./notifications.js");
    NotificationManager.initialize();
  }
}

// User interaction triggered loading
document.getElementById("load-chart").addEventListener("click", async () => {
  const { default: Chart } = await import("./chart-library.js");
  const chart = new Chart("#chart-container");
  chart.render(data);
});
```

### Lazy Loading Components

```javascript
// componentLoader.js
class ComponentLoader {
  constructor() {
    this.cache = new Map();
  }

  async loadComponent(name) {
    if (this.cache.has(name)) {
      return this.cache.get(name);
    }

    try {
      const module = await import(`./components/${name}.js`);
      const Component = module.default || module[name];

      this.cache.set(name, Component);
      return Component;
    } catch (error) {
      console.error(`Failed to load component ${name}:`, error);
      throw error;
    }
  }

  async renderComponent(name, container, props = {}) {
    const Component = await this.loadComponent(name);

    if (typeof Component === "function") {
      // Function component
      container.innerHTML = Component(props);
    } else if (Component.render) {
      // Class component
      const instance = new Component(props);
      container.innerHTML = instance.render();
    }
  }
}

const loader = new ComponentLoader();

// Route-based lazy loading
const routes = {
  "/home": () =>
    loader.renderComponent("HomePage", document.getElementById("app")),
  "/profile": () =>
    loader.renderComponent("ProfilePage", document.getElementById("app")),
  "/settings": () =>
    loader.renderComponent("SettingsPage", document.getElementById("app"))
};

function navigate(path) {
  const handler = routes[path];
  if (handler) {
    handler();
  }
}
```

## Module Bundling Concepts

### Tree Shaking

```javascript
// utils.js - Large utility library
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(amount);
}

// app.js - Only imports what's needed
import { debounce, formatCurrency } from "./utils.js";

// Tree shaking will remove throttle and deepClone from the bundle
const debouncedSave = debounce(saveData, 300);
const price = formatCurrency(99.99);
```

### Code Splitting

```javascript
// main.js - Entry point
async function initializeApp() {
  // Core app functionality loads immediately
  const { AppCore } = await import("./core/app.js");
  const app = new AppCore();

  // Setup routing with code splitting
  const router = {
    "/": () => import("./pages/home.js"),
    "/products": () => import("./pages/products.js"),
    "/cart": () => import("./pages/cart.js"),
    "/checkout": () => import("./pages/checkout.js")
  };

  function handleRoute(path) {
    const pageImport = router[path];
    if (pageImport) {
      pageImport().then((module) => {
        const Page = module.default;
        const page = new Page();
        page.render();
      });
    }
  }

  // Initialize router
  window.addEventListener("popstate", () => {
    handleRoute(window.location.pathname);
  });

  // Initial route
  handleRoute(window.location.pathname);
}

initializeApp();
```

## Module Resolution and Configuration

### Package.json Module Configuration

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "exports": {
    ".": "./index.js",
    "./utils": "./src/utils/index.js",
    "./components": "./src/components/index.js",
    "./package.json": "./package.json"
  },
  "imports": {
    "#internal/*": "./src/internal/*.js",
    "#config": "./config/index.js"
  }
}
```

### Import Maps (Browser)

```html
<!-- index.html -->
<script type="importmap">
  {
    "imports": {
      "lodash": "https://cdn.skypack.dev/lodash",
      "react": "https://cdn.skypack.dev/react",
      "utils/": "./src/utils/",
      "components/": "./src/components/"
    }
  }
</script>

<script type="module">
  import _ from "lodash";
  import React from "react";
  import { formatDate } from "utils/date.js";
  import { Button } from "components/Button.js";
</script>
```

## Best Practices

### 1. Consistent Export Patterns

```javascript
// Good: Consistent named exports
// api/users.js
export async function getUser(id) { /* ... */ }
export async function createUser(data) { /* ... */ }
export async function updateUser(id, data) { /* ... */ }
export async function deleteUser(id) { /* ... */ }

// Good: Clear default exports
// components/Button.js
export default class Button {
  constructor(props) {
    this.props = props;
  }

  render() {
    return `<button class="${this.props.className}">${this.props.text}</button>`;
  }
}

// Avoid: Mixed patterns without clear purpose
// confusing.js
export function someFunction() { /* ... */ }
export default class SomeClass { /* ... */ }
export const SOME_CONSTANT = 42;
```

### 2. Meaningful Module Organization

```javascript
// Good: Feature-based organization
// features/user/
//   ├── api.js          (user API calls)
//   ├── components.js   (user-related components)
//   ├── utils.js        (user utility functions)
//   └── index.js        (barrel export)

// features/user/index.js
export * from "./api.js";
export * from "./components.js";
export * from "./utils.js";

// Usage
import { getUser, UserProfile, formatUserName } from "./features/user/index.js";
```

### 3. Circular Dependency Avoidance

```javascript
// Bad: Circular dependency
// a.js
import { functionB } from "./b.js";
export function functionA() {
  return functionB() + 1;
}

// b.js
import { functionA } from "./a.js"; // Circular!
export function functionB() {
  return functionA() + 1;
}

// Good: Extract shared functionality
// shared.js
export function sharedLogic() {
  return 42;
}

// a.js
import { sharedLogic } from "./shared.js";
export function functionA() {
  return sharedLogic() + 1;
}

// b.js
import { sharedLogic } from "./shared.js";
export function functionB() {
  return sharedLogic() + 2;
}
```

### 4. Progressive Enhancement

```javascript
// Check for module support
if ("noModule" in HTMLScriptElement.prototype) {
  // Browser supports modules
  import("./modern-app.js");
} else {
  // Fallback for older browsers
  const script = document.createElement("script");
  script.src = "./legacy-app.js";
  document.head.appendChild(script);
}
```

## Browser Compatibility

### ES6 Module Support

- **Chrome**: 61+
- **Firefox**: 60+
- **Safari**: 10.1+
- **Edge**: 16+

### Module Script Tag

```html
<!-- Modern browsers -->
<script type="module" src="./app.js"></script>

<!-- Fallback for older browsers -->
<script nomodule src="./app-legacy.js"></script>
```

## Common Pitfalls

### 1. File Extensions

```javascript
// In browsers and Node.js with "type": "module"
import { utils } from "./utils.js"; // ✅ Include .js extension

// This will fail
import { utils } from "./utils"; // ❌ Missing extension
```

### 2. Dynamic Import Paths

```javascript
// Static analysis works
import("./components/Button.js"); // ✅ Can be analyzed by bundlers

// Dynamic paths are harder to analyze
const componentName = "Button";
import(`./components/${componentName}.js`); // ⚠️ May require additional config
```

### 3. Mixed Module Systems

```javascript
// Don't mix CommonJS and ES modules in the same file
// Bad
const fs = require("fs"); // CommonJS
import path from "path"; // ES module

// Good: Use consistent module system
import fs from "fs";
import path from "path";
```

## Self-Check Questions

1. What's the difference between named and default exports?
2. How do dynamic imports work and when should you use them?
3. What is tree shaking and how do modules enable it?
4. How do you handle circular dependencies in modules?
5. What are the benefits of the ES6 module system over older patterns?

## Practice Exercises

### Exercise 1: Module Refactoring

Convert a legacy application to use ES6 modules.

### Exercise 2: Plugin System

Build a plugin system using dynamic imports.

### Exercise 3: Code Splitting

Implement route-based code splitting.

### Exercise 4: Tree Shaking Analysis

Analyze and optimize bundle size using tree shaking.

### Exercise 5: Module Federation

Create a micro-frontend architecture using modules.

## Further Reading

- [MDN: ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [ES6 Modules in Depth](https://ponyfoo.com/articles/es6-modules-in-depth)
- [Dynamic Import Specification](https://github.com/tc39/proposal-dynamic-import)
