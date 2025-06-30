/**
 * Exercise 2-2: Tagged Template Literals
 *
 * Explore tagged template literals for custom string processing and advanced use cases.
 */

console.log("Starting Exercise 2-2: Tagged Template Literals");

// Basic tagged template literal
function simpleTag(strings, ...values) {
  console.log("Strings:", strings);
  console.log("Values:", values);

  // TODO: Combine strings and values
  let result = "";
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += values[i];
    }
  }
  return result;
}

const name = "Alice";
const age = 30;

// TODO: Use the tagged template literal
const message = simpleTag`Hello, ${name}! You are ${age} years old.`;
console.log("Simple tag result:", message);

// HTML escaping tag
function html(strings, ...values) {
  // TODO: Escape HTML entities in values
  const escapeHtml = (str) => {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  return strings.reduce((result, string, i) => {
    const value = i < values.length ? escapeHtml(values[i]) : "";
    return result + string + value;
  }, "");
}

const userInput = '<script>alert("xss")</script>';
const title = 'User "Profile" & Settings';

// TODO: Use HTML tag to safely insert user content
const safeHtml = html`
  <div class="user-info">
    <h1>${title}</h1>
    <p>User input: ${userInput}</p>
  </div>
`;

console.log("\nSafe HTML:", safeHtml);

// SQL template tag (for demonstration - don't use in production)
function sql(strings, ...values) {
  // TODO: Basic SQL parameter substitution (simplified)
  const escapeSql = (value) => {
    if (typeof value === "string") {
      return `'${value.replace(/'/g, "''")}'`;
    }
    if (typeof value === "number") {
      return value.toString();
    }
    if (value === null || value === undefined) {
      return "NULL";
    }
    return `'${String(value)}'`;
  };

  return strings.reduce((result, string, i) => {
    const value = i < values.length ? escapeSql(values[i]) : "";
    return result + string + value;
  }, "");
}

const userId = 123;
const userName = "O'Connor";
const email = "oconnor@example.com";

// TODO: Use SQL tag for query building
const query = sql`
    SELECT * FROM users
    WHERE id = ${userId}
    AND name = ${userName}
    AND email = ${email}
`;

console.log("\nSQL query:", query);

// Localization tag
const translations = {
  en: {
    greeting: "Hello",
    farewell: "Goodbye",
    welcome: "Welcome back"
  },
  es: {
    greeting: "Hola",
    farewell: "Adiós",
    welcome: "Bienvenido de nuevo"
  },
  fr: {
    greeting: "Bonjour",
    farewell: "Au revoir",
    welcome: "Bon retour"
  }
};

function i18n(language) {
  return function (strings, ...values) {
    // TODO: Process template for internationalization
    let result = "";

    for (let i = 0; i < strings.length; i++) {
      let string = strings[i];

      // Replace translation keys
      string = string.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return translations[language]?.[key] || match;
      });

      result += string;

      if (i < values.length) {
        result += values[i];
      }
    }

    return result;
  };
}

// TODO: Create localized messages
const english = i18n("en");
const spanish = i18n("es");
const french = i18n("fr");

const username = "María";

console.log("\nLocalization examples:");
console.log("English:", english`{{greeting}}, ${username}! {{welcome}}.`);
console.log("Spanish:", spanish`{{greeting}}, ${username}! {{welcome}}.`);
console.log("French:", french`{{greeting}}, ${username}! {{welcome}}.`);

// CSS-in-JS style tag
function css(strings, ...values) {
  // TODO: Process CSS template with auto-prefixing simulation
  const autoprefixProperties = {
    transform: ["-webkit-transform", "-moz-transform", "transform"],
    transition: ["-webkit-transition", "-moz-transition", "transition"],
    "border-radius": [
      "-webkit-border-radius",
      "-moz-border-radius",
      "border-radius"
    ]
  };

  let result = strings.reduce((acc, string, i) => {
    const value = i < values.length ? values[i] : "";
    return acc + string + value;
  }, "");

  // Simple autoprefixing simulation
  Object.entries(autoprefixProperties).forEach(([property, prefixed]) => {
    const regex = new RegExp(`(^|\\s)(${property})\\s*:`, "gm");
    result = result.replace(regex, (match, space, prop) => {
      return prefixed.map((p) => `${space}${p}:`).join("\n");
    });
  });

  return result;
}

const primaryColor = "#007bff";
const borderSize = "4px";

// TODO: Use CSS tag for styling
const styles = css`
  .button {
    background-color: ${primaryColor};
    border-radius: ${borderSize};
    transform: translateX(0);
    transition: all 0.3s ease;
  }

  .button:hover {
    transform: translateX(5px);
  }
`;

console.log("\nCSS with autoprefixing:", styles);

// Logging tag with metadata
function log(strings, ...values) {
  const timestamp = new Date().toISOString();
  const caller = new Error().stack?.split("\n")[2]?.trim() || "unknown";

  // TODO: Create enhanced log message
  const message = strings.reduce((result, string, i) => {
    const value = i < values.length ? JSON.stringify(values[i]) : "";
    return result + string + value;
  }, "");

  return `[${timestamp}] ${message} (${caller})`;
}

const debugData = { userId: 123, action: "login" };
const errorCode = 404;

// TODO: Use logging tag
console.log("\nEnhanced logging:");
console.log(log`User action: ${debugData}`);
console.log(log`Error occurred with code: ${errorCode}`);

// Performance measurement tag
function perf(strings, ...values) {
  const startTime = performance.now();

  return function (...args) {
    // TODO: Measure execution time of a function
    const result = strings.reduce((acc, string, i) => {
      const value = i < values.length ? values[i] : "";
      return acc + string + value;
    }, "");

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.log(
      `Performance: "${result.trim()}" took ${duration.toFixed(2)}ms`
    );
    return result;
  };
}

// TODO: Use performance tag
const perfMessage = perf`Calculating sum of numbers from 1 to ${1000000}`;
perfMessage();

// Advanced: Template literal for building URLs
function url(strings, ...values) {
  // TODO: Build and encode URLs properly
  const encodeValue = (value) => {
    if (typeof value === "object") {
      return Object.entries(value)
        .map(
          ([key, val]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(val)}`
        )
        .join("&");
    }
    return encodeURIComponent(value);
  };

  return strings.reduce((result, string, i) => {
    const value = i < values.length ? encodeValue(values[i]) : "";
    return result + string + value;
  }, "");
}

const baseUrl = "https://api.example.com";
const endpoint = "users/search";
const params = { q: "john doe", limit: 10, sort: "name" };

// TODO: Build URL with proper encoding
const apiUrl = url`${baseUrl}/${endpoint}?${params}`;
console.log("\nBuilt URL:", apiUrl);

// Template caching for performance
const templateCache = new Map();

function cached(strings, ...values) {
  // TODO: Implement template caching
  const key = strings.join("{{VALUE}}");

  if (!templateCache.has(key)) {
    templateCache.set(key, (values) => {
      return strings.reduce((result, string, i) => {
        const value = i < values.length ? values[i] : "";
        return result + string + value;
      }, "");
    });
  }

  const template = templateCache.get(key);
  return template(values);
}

// TODO: Use cached template
console.log("\nCached templates:");
console.log(cached`Hello, ${name}! You have ${5} messages.`);
console.log(cached`Hello, ${"Bob"}! You have ${3} messages.`); // Uses same template

console.log("Template cache size:", templateCache.size);

// Instructions:
// 1. Understand how tagged template literals work with strings and values arrays
// 2. Implement HTML escaping for security
// 3. Create SQL query builders with parameter escaping
// 4. Build internationalization systems using tagged templates
// 5. Process CSS with auto-prefixing capabilities
// 6. Enhance logging with metadata and formatting
// 7. Measure performance and build URL helpers
// 8. Implement template caching for better performance
