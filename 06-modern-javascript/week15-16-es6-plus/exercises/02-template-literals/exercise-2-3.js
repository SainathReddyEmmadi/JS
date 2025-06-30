// Exercise 2.3: Tagged Template Functions
// Objective: Create and use tagged template functions for custom string processing

// Task 1: Basic Tagged Template
// TODO: Create a tagged template that highlights placeholders
function highlight(strings, ...values) {
  // Your code here
  // Combine strings and values, wrapping values in <mark> tags
  // Example: highlight`Hello ${'World'}!` → "Hello <mark>World</mark>!"
}

// Task 2: HTML Escaping Template
// TODO: Create a template that escapes HTML characters in interpolated values
function safeHTML(strings, ...values) {
  // Your code here
  // Escape HTML characters: < > & " '
  // Example: safeHTML`<p>${'<script>'}</p>` → "<p>&lt;script&gt;</p>"
}

// Task 3: Currency Formatter
// TODO: Create a template for formatting currency values
function currency(strings, ...values) {
  // Your code here
  // Format numbers as currency with $ sign and 2 decimal places
  // Example: currency`Total: ${25.5}` → "Total: $25.50"
}

// Task 4: SQL Query Builder
// TODO: Create a template for building SQL queries safely
function sql(strings, ...values) {
  // Your code here
  // Escape SQL values and build query
  // Example: sql`SELECT * FROM users WHERE name = ${'John'}`
  // → "SELECT * FROM users WHERE name = 'John'"
}

// Task 5: Translation Template
// TODO: Create a template for internationalization
const translations = {
  en: { greeting: "Hello", name: "Name" },
  es: { greeting: "Hola", name: "Nombre" },
  fr: { greeting: "Bonjour", name: "Nom" }
};

function t(strings, ...keys) {
  // Your code here
  // Look up translations for keys and interpolate
  // Usage: t`${greeting}, my ${name} is Alice` with current language
}

// Set current language for translation
let currentLanguage = "en";

// Task 6: Debug Template
// TODO: Create a template that logs variables with their names
function debug(strings, ...values) {
  // Your code here
  // Log each value with context
  // Example: debug`User: ${user}, Age: ${age}`
  // → Console: "User: [object], Age: 25"
}

// Helper function for HTML escaping
function escapeHTML(str) {
  const escapeMap = {
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;",
    "'": "&#x27;"
  };
  return String(str).replace(/[<>&"']/g, (match) => escapeMap[match]);
}

// Helper function for SQL escaping
function escapeSQL(value) {
  if (typeof value === "string") {
    return "'" + value.replace(/'/g, "''") + "'";
  }
  if (typeof value === "number") {
    return value.toString();
  }
  if (value === null || value === undefined) {
    return "NULL";
  }
  return "'" + String(value) + "'";
}

// Test Cases
console.log("=== Tagged Template Functions Exercise ===\n");

// Uncomment these tests once you implement the functions:

// console.log('Test 1 - Highlight template:');
// console.log(highlight`Hello ${'World'} and ${'Universe'}!`);
// console.log('Expected: "Hello <mark>World</mark> and <mark>Universe</mark>!"\n');

// console.log('Test 2 - Safe HTML template:');
// console.log(safeHTML`<div>User input: ${'<script>alert("xss")</script>'}</div>`);
// console.log('Expected: "<div>User input: &lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</div>"\n');

// console.log('Test 3 - Currency template:');
// console.log(currency`Total amount: ${123.4} plus tax: ${15.678}`);
// console.log('Expected: "Total amount: $123.40 plus tax: $15.68"\n');

// console.log('Test 4 - SQL template:');
// console.log(sql`SELECT * FROM users WHERE name = ${'Alice'} AND age = ${25}`);
// console.log('Expected: "SELECT * FROM users WHERE name = \'Alice\' AND age = 25"\n');

// console.log('Test 5 - Translation template:');
// currentLanguage = 'es';
// // Note: This requires implementing the translation lookup logic
// console.log('Translation test - implement the t function with key lookup\n');

// console.log('Test 6 - Debug template:');
// const user = { name: 'Alice', id: 1 };
// const age = 25;
// // debug`User: ${user}, Age: ${age}`;
// console.log('Debug should log to console with variable context\n');

console.log(
  "Complete the TODOs above and uncomment the tests to verify your solutions!"
);

// Advanced Challenge: Combine multiple tagged templates
// TODO: Create a template that combines HTML safety with highlighting
function safeHighlight(strings, ...values) {
  // Your code here
  // First escape HTML, then apply highlighting
}

// TODO: Create a template for email generation
function email(strings, ...values) {
  // Your code here
  // Format values appropriately for email content
  // - Escape HTML in values
  // - Format links as clickable
  // - Format emails as mailto links
}

console.log("\n=== Advanced Challenges ===");
console.log(
  "Implement safeHighlight and email tagged templates for bonus points!"
);
