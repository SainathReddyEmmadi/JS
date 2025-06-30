# Template Literals and Tagged Templates

## Learning Objectives

- Master template literal syntax for string interpolation
- Understand multiline strings and expression embedding
- Implement tagged template functions
- Apply template literals for HTML generation and formatting
- Use template literals for advanced string processing

## What are Template Literals?

Template literals are string literals allowing embedded expressions, multiline strings, and advanced string formatting. They use backticks (`) instead of quotes and support expression interpolation through `${}` syntax.

## Basic Template Literal Syntax

### String Interpolation

```javascript
// Traditional string concatenation
const name = "John";
const age = 30;
const message =
  "Hello, my name is " + name + " and I am " + age + " years old.";

// Template literal approach
const message = `Hello, my name is ${name} and I am ${age} years old.`;
console.log(message); // "Hello, my name is John and I am 30 years old."

// Complex expressions
const user = { firstName: "Jane", lastName: "Doe" };
const greeting = `Welcome, ${user.firstName} ${user.lastName}!`;

// Function calls in expressions
const price = 99.99;
const formattedPrice = `Price: $${price.toFixed(2)}`;
console.log(formattedPrice); // "Price: $99.99"
```

### Multiline Strings

```javascript
// Traditional multiline strings (awkward)
const html =
  '<div class="container">\n' +
  "  <h1>Welcome</h1>\n" +
  "  <p>This is a paragraph.</p>\n" +
  "</div>";

// Template literals (natural)
const html = `
<div class="container">
  <h1>Welcome</h1>
  <p>This is a paragraph.</p>
</div>
`;

// SQL queries
const query = `
  SELECT users.name, users.email, profiles.bio
  FROM users
  JOIN profiles ON users.id = profiles.user_id
  WHERE users.active = true
  ORDER BY users.created_at DESC
  LIMIT 10
`;

// Configuration files
const config = `
server:
  host: ${process.env.HOST || "localhost"}
  port: ${process.env.PORT || 3000}
database:
  url: ${process.env.DATABASE_URL}
  pool_size: ${process.env.POOL_SIZE || 10}
`;
```

## Advanced Expression Embedding

### Complex Expressions

```javascript
const items = ["apple", "banana", "orange"];
const user = { name: "John", isAdmin: true };

// Conditional expressions
const welcomeMessage = `
  Welcome ${user.name}!
  You have ${user.isAdmin ? "admin" : "regular"} access.
`;

// Array methods and operations
const itemList = `
  Available items:
  ${items.map((item) => `- ${item}`).join("\n")}
  Total: ${items.length} items
`;

// Mathematical expressions
const order = { quantity: 3, price: 29.99, tax: 0.08 };
const receipt = `
  Quantity: ${order.quantity}
  Unit Price: $${order.price}
  Subtotal: $${(order.quantity * order.price).toFixed(2)}
  Tax: $${(order.quantity * order.price * order.tax).toFixed(2)}
  Total: $${(order.quantity * order.price * (1 + order.tax)).toFixed(2)}
`;
```

### Nested Template Literals

```javascript
const users = [
  { name: "John", age: 30, skills: ["JavaScript", "React"] },
  { name: "Jane", age: 25, skills: ["Python", "Django"] }
];

// Nested template literals for complex structures
const userProfiles = `
  User Profiles:
  ${users
    .map(
      (user) => `
    Name: ${user.name}
    Age: ${user.age}
    Skills: ${user.skills.map((skill) => `${skill}`).join(", ")}
  `
    )
    .join("\n---\n")}
`;

// Dynamic HTML generation
const createCard = (title, content, actions) => `
  <div class="card">
    <div class="card-header">
      <h3>${title}</h3>
    </div>
    <div class="card-body">
      ${content}
    </div>
    <div class="card-footer">
      ${actions
        .map(
          (action) => `
        <button class="${action.class}" onclick="${action.handler}">
          ${action.label}
        </button>
      `
        )
        .join("")}
    </div>
  </div>
`;
```

## Tagged Templates

Tagged templates allow you to parse template literals with a function, providing powerful string processing capabilities.

### Basic Tagged Template Syntax

```javascript
// Tag function signature
function myTag(strings, ...expressions) {
  console.log("Strings:", strings); // Array of string parts
  console.log("Expressions:", expressions); // Array of expression values

  // Build result
  let result = "";
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < expressions.length) {
      result += expressions[i];
    }
  }
  return result;
}

// Usage
const name = "John";
const age = 30;
const result = myTag`Hello ${name}, you are ${age} years old.`;

// strings: ['Hello ', ', you are ', ' years old.']
// expressions: ['John', 30]
```

### Practical Tagged Template Examples

#### HTML Escaping

```javascript
function html(strings, ...expressions) {
  const escapeHtml = (str) => {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  };

  return strings.reduce((result, string, i) => {
    const expression = expressions[i] ? escapeHtml(expressions[i]) : "";
    return result + string + expression;
  }, "");
}

// Usage - automatically escapes HTML
const userInput = '<script>alert("xss")</script>';
const safeHtml = html`<div>User said: ${userInput}</div>`;
// Result: <div>User said: &lt;script&gt;alert("xss")&lt;/script&gt;</div>
```

#### SQL Query Builder

```javascript
function sql(strings, ...expressions) {
  const escapeValue = (value) => {
    if (typeof value === "string") {
      return `'${value.replace(/'/g, "''")}'`;
    }
    if (value === null || value === undefined) {
      return "NULL";
    }
    return value;
  };

  return strings.reduce((query, string, i) => {
    const expression = expressions[i] ? escapeValue(expressions[i]) : "";
    return query + string + expression;
  }, "");
}

// Usage
const userId = 123;
const userName = "John O'Connor";
const query = sql`
  SELECT * FROM users
  WHERE id = ${userId}
  AND name = ${userName}
`;
// Result: SELECT * FROM users WHERE id = 123 AND name = 'John O''Connor'
```

#### Styled Components Pattern

```javascript
function styled(strings, ...expressions) {
  return function (props = {}) {
    return strings.reduce((css, string, i) => {
      const expression = expressions[i];
      let value = "";

      if (typeof expression === "function") {
        value = expression(props);
      } else {
        value = expression || "";
      }

      return css + string + value;
    }, "");
  };
}

// Usage
const Button = styled`
  background-color: ${(props) => (props.primary ? "#007bff" : "#6c757d")};
  color: white;
  padding: ${(props) => (props.size === "large" ? "12px 24px" : "8px 16px")};
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;

const primaryButtonCSS = Button({ primary: true, size: "large" });
```

#### Internationalization (i18n)

```javascript
const translations = {
  en: {
    greeting: "Hello",
    farewell: "Goodbye",
    itemCount: (count) => (count === 1 ? "item" : "items")
  },
  es: {
    greeting: "Hola",
    farewell: "Adiós",
    itemCount: (count) => (count === 1 ? "artículo" : "artículos")
  }
};

function i18n(strings, ...expressions) {
  const currentLang = getCurrentLanguage(); // Assume this function exists

  return strings.reduce((result, string, i) => {
    let expression = expressions[i] || "";

    // Check if expression is a translation key
    if (
      typeof expression === "string" &&
      translations[currentLang][expression]
    ) {
      expression = translations[currentLang][expression];
    }

    return result + string + expression;
  }, "");
}

// Usage
const count = 5;
const message = i18n`You have ${count} ${"itemCount"}`;
```

## Advanced Template Literal Patterns

### Dynamic Content Generation

```javascript
// Blog post generator
function generateBlogPost({ title, author, date, content, tags }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${title} - Blog</title>
  <meta name="author" content="${author}">
  <meta name="date" content="${date}">
</head>
<body>
  <article>
    <header>
      <h1>${title}</h1>
      <p>By ${author} on ${new Date(date).toLocaleDateString()}</p>
    </header>

    <main>
      ${content
        .split("\n")
        .map((paragraph) =>
          paragraph.trim() ? `<p>${paragraph.trim()}</p>` : ""
        )
        .join("\n")}
    </main>

    <footer>
      <div class="tags">
        ${tags.map((tag) => `<span class="tag">#${tag}</span>`).join(" ")}
      </div>
    </footer>
  </article>
</body>
</html>
  `.trim();
}
```

### Configuration Template System

```javascript
class ConfigTemplate {
  constructor(template) {
    this.template = template;
  }

  render(variables = {}) {
    // Enhanced template literal with additional features
    return this.template.replace(/\$\{([^}]+)\}/g, (match, expression) => {
      try {
        // Create a function that returns the expression value
        const func = new Function(
          ...Object.keys(variables),
          `return ${expression}`
        );
        return func(...Object.values(variables));
      } catch (error) {
        console.warn(`Template expression error: ${expression}`, error);
        return match; // Return original if evaluation fails
      }
    });
  }
}

// Usage
const configTemplate = new ConfigTemplate(`
server:
  host: \${host || 'localhost'}
  port: \${port || 3000}
  ssl: \${ssl ? 'enabled' : 'disabled'}

database:
  url: \${dbUrl}
  pool_size: \${Math.min(poolSize || 10, 50)}

features:
  cache: \${cacheEnabled && 'redis' || 'memory'}
  auth: \${authProvider || 'local'}
`);

const config = configTemplate.render({
  host: "production.example.com",
  port: 8080,
  ssl: true,
  dbUrl: "postgresql://...",
  poolSize: 20,
  cacheEnabled: true,
  authProvider: "oauth"
});
```

### Template-Based Validation

```javascript
function validateTemplate(strings, ...expressions) {
  const validators = {
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    phone: (value) => /^\+?[\d\s-()]+$/.test(value),
    url: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    }
  };

  const errors = [];

  strings.forEach((string, i) => {
    const expression = expressions[i];
    if (expression && typeof expression === "object" && expression.validate) {
      const { value, type, field } = expression;
      if (validators[type] && !validators[type](value)) {
        errors.push(`Invalid ${type} for field: ${field}`);
      }
    }
  });

  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(", ")}`);
  }

  return strings.reduce((result, string, i) => {
    const expression = expressions[i];
    const value =
      expression && typeof expression === "object"
        ? expression.value
        : expression;
    return result + string + (value || "");
  }, "");
}

// Usage
try {
  const userProfile = validateTemplate`
    Name: John Doe
    Email: ${{ value: "invalid-email", type: "email", field: "email" }}
    Phone: ${{ value: "+1-555-0123", type: "phone", field: "phone" }}
    Website: ${{ value: "https://example.com", type: "url", field: "website" }}
  `;
} catch (error) {
  console.error(error.message); // Validation failed: Invalid email for field: email
}
```

## Performance Considerations

### Template Literal vs String Concatenation

```javascript
// Performance comparison
const iterations = 1000000;

// Template literals
console.time("Template Literals");
for (let i = 0; i < iterations; i++) {
  const result = `Hello ${i} world`;
}
console.timeEnd("Template Literals");

// String concatenation
console.time("String Concatenation");
for (let i = 0; i < iterations; i++) {
  const result = "Hello " + i + " world";
}
console.timeEnd("String Concatenation");

// Array join (for many concatenations)
console.time("Array Join");
for (let i = 0; i < iterations; i++) {
  const result = ["Hello", i, "world"].join(" ");
}
console.timeEnd("Array Join");
```

### Optimizing Tagged Templates

```javascript
// Cache compiled templates for repeated use
const templateCache = new Map();

function optimizedTemplate(strings, ...expressions) {
  const cacheKey = strings.join("|");

  if (!templateCache.has(cacheKey)) {
    // Compile template once
    templateCache.set(cacheKey, {
      strings,
      compile: (values) =>
        strings.reduce(
          (result, string, i) => result + string + (values[i] || ""),
          ""
        )
    });
  }

  return templateCache.get(cacheKey).compile(expressions);
}
```

## Browser Compatibility

### Template Literal Support

- **Chrome**: 41+
- **Firefox**: 34+
- **Safari**: 9+
- **Edge**: 12+

### Polyfills and Transpilation

```javascript
// Babel transforms template literals
// ES6
const message = `Hello ${name}!`;

// ES5 equivalent
var message = "Hello " + name + "!";

// Tagged templates are more complex to polyfill
// Usually require runtime helpers
```

## Best Practices

### 1. Use Template Literals for Readability

```javascript
// Good: Clear and readable
const query = `
  SELECT name, email
  FROM users
  WHERE active = true
  AND created_at > '${startDate}'
`;

// Avoid: Hard to read
const query =
  "SELECT name, email FROM users WHERE active = true AND created_at > '" +
  startDate +
  "'";
```

### 2. Be Careful with HTML Injection

```javascript
// Dangerous: Direct user input
const userInput = '<script>alert("xss")</script>';
const html = `<div>${userInput}</div>`; // XSS vulnerability

// Safe: Use escaping or sanitization
const html = `<div>${escapeHtml(userInput)}</div>`;
```

### 3. Keep Tagged Templates Simple

```javascript
// Good: Simple and focused
function css(strings, ...expressions) {
  return strings.reduce(
    (result, string, i) => result + string + (expressions[i] || ""),
    ""
  );
}

// Avoid: Overly complex tag functions
function overlyComplexTag(strings, ...expressions) {
  // 100+ lines of complex logic
  // Hard to debug and maintain
}
```

### 4. Consider Performance for Hot Paths

```javascript
// For frequently called functions, consider alternatives
function formatMessage(name, count) {
  // Template literal (fine for occasional use)
  return `Hello ${name}, you have ${count} messages`;

  // String concatenation (slightly faster for hot paths)
  // return 'Hello ' + name + ', you have ' + count + ' messages';
}
```

## Common Pitfalls

### 1. Whitespace in Multiline Templates

```javascript
// Problem: Unwanted indentation
function generateHTML() {
  return `
    <div>
      <h1>Title</h1>
    </div>
  `;
  // Includes leading whitespace from indentation
}

// Solution: Use dedent library or manual trimming
function generateHTML() {
  return `
<div>
  <h1>Title</h1>
</div>
  `.trim();
}
```

### 2. Expression Side Effects

```javascript
let counter = 0;

// Problem: Side effects in expressions
const message = `Count: ${++counter}`; // Modifies counter
console.log(message); // "Count: 1"
console.log(counter); // 1 (modified!)

// Better: Pure expressions
const count = counter + 1;
const message = `Count: ${count}`;
```

### 3. Complex Expression Debugging

```javascript
// Hard to debug
const complex = `Result: ${users
  .filter((u) => u.active)
  .map((u) => u.name)
  .join(", ")}`;

// Easier to debug
const activeUsers = users.filter((u) => u.active);
const activeNames = activeUsers.map((u) => u.name);
const nameList = activeNames.join(", ");
const result = `Result: ${nameList}`;
```

## Self-Check Questions

1. When should you use template literals instead of string concatenation?
2. How do tagged templates work and what are their use cases?
3. What are the security implications of template literals?
4. How do you handle multiline strings with proper indentation?
5. What are the performance considerations for template literals?

## Practice Exercises

### Exercise 1: String Formatting

Create various string formatting functions using template literals.

### Exercise 2: HTML Generator

Build an HTML generation system using template literals.

### Exercise 3: Tagged Template Implementation

Implement custom tagged templates for specific use cases.

### Exercise 4: Template Engine

Create a simple template engine with variable substitution.

### Exercise 5: Performance Testing

Compare template literals with other string manipulation methods.

## Further Reading

- [MDN: Template Literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
- [ES6 In Depth: Template Strings](https://hacks.mozilla.org/2015/05/es6-in-depth-template-strings-2/)
- [Tagged Template Literals](https://wesbos.com/tagged-template-literals)
