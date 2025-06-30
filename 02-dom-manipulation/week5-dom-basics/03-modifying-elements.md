# Modifying Elements - Transform Your Web Page 🎨

Now that you can select elements, let's learn how to change them! This is where the magic happens - making your web pages interactive and dynamic.

## 🎯 What You'll Learn

- Modify element content (text and HTML)
- Change element attributes and properties
- Manipulate CSS styles and classes
- Create, add, and remove elements
- Best practices for DOM manipulation

## 📝 Changing Element Content

### 1. `textContent` - Plain Text Only

**Safest** way to change text content.

```javascript
const heading = document.getElementById("title");

// Get text content
console.log(heading.textContent); // "Welcome to My Site"

// Set text content (escapes HTML)
heading.textContent = "New Title";
heading.textContent = "<strong>Bold Title</strong>"; // Shows as literal text

// Benefits:
// - Safe from XSS attacks
// - Fast performance
// - Gets/sets only text
```

### 2. `innerHTML` - HTML Content

**Powerful** but use with caution.

```javascript
const container = document.getElementById("content");

// Get HTML content
console.log(container.innerHTML); // "<p>Hello <strong>world</strong></p>"

// Set HTML content
container.innerHTML = "<h2>New Section</h2><p>With <em>formatted</em> text</p>";

// Add to existing content
container.innerHTML += "<p>Additional paragraph</p>";

// ⚠️ Security Warning: Never use with user input!
// container.innerHTML = userInput; // Potential XSS attack
```

### 3. `innerText` - Rendered Text

**Considers styling** and visibility.

```javascript
const element = document.getElementById("styled-text");

// HTML: <div id="styled-text">Visible <span style="display:none">Hidden</span> Text</div>

console.log(element.textContent); // "Visible Hidden Text"
console.log(element.innerText); // "Visible Text" (hidden text excluded)

// Setting innerText
element.innerText = "New visible text";
```

### Content Modification Comparison

| Property      | Purpose      | HTML Parsing | Performance | Security |
| ------------- | ------------ | ------------ | ----------- | -------- |
| `textContent` | Plain text   | No           | ⭐⭐⭐⭐⭐  | ✅ Safe  |
| `innerHTML`   | HTML content | Yes          | ⭐⭐⭐      | ⚠️ Risky |
| `innerText`   | Visible text | No           | ⭐⭐⭐⭐    | ✅ Safe  |

## 🏷️ Working with Attributes

### 1. Standard HTML Attributes

```javascript
const image = document.querySelector("img");
const link = document.querySelector("a");

// Get attributes
console.log(image.src); // "https://example.com/image.jpg"
console.log(image.alt); // "Description"
console.log(link.href); // "https://example.com"

// Set attributes
image.src = "new-image.jpg";
image.alt = "New description";
link.href = "https://newsite.com";

// Boolean attributes
const checkbox = document.querySelector('input[type="checkbox"]');
checkbox.checked = true;
checkbox.disabled = false;
```

### 2. Generic Attribute Methods

```javascript
const element = document.getElementById("my-element");

// Get attribute
const value = element.getAttribute("data-id");

// Set attribute
element.setAttribute("data-category", "featured");
element.setAttribute("title", "Hover tooltip");

// Remove attribute
element.removeAttribute("data-old");

// Check if attribute exists
if (element.hasAttribute("data-id")) {
  console.log("Has data-id attribute");
}

// Get all attributes
const attrs = element.attributes;
for (let attr of attrs) {
  console.log(`${attr.name}: ${attr.value}`);
}
```

### 3. Data Attributes

**Best practice** for custom data storage.

```javascript
// HTML: <div id="product" data-id="123" data-price="29.99" data-category="electronics">
const product = document.getElementById("product");

// Access via dataset (camelCase conversion)
console.log(product.dataset.id); // "123"
console.log(product.dataset.price); // "29.99"
console.log(product.dataset.category); // "electronics"

// Set data attributes
product.dataset.inStock = "true"; // Creates data-in-stock="true"
product.dataset.lastUpdated = new Date().toISOString();

// Remove data attribute
delete product.dataset.category;

// List all data attributes
for (let key in product.dataset) {
  console.log(`${key}: ${product.dataset[key]}`);
}
```

## 🎨 Styling Elements

### 1. Inline Styles

```javascript
const element = document.getElementById("box");

// Set individual styles
element.style.color = "blue";
element.style.backgroundColor = "lightgray";
element.style.fontSize = "18px";
element.style.marginTop = "20px";

// CSS property names become camelCase
element.style.borderRadius = "10px"; // border-radius
element.style.zIndex = "100"; // z-index

// Get computed style (read-only)
const computedStyle = window.getComputedStyle(element);
console.log(computedStyle.color); // rgb(0, 0, 255)
console.log(computedStyle.fontSize); // 18px

// Set multiple styles
Object.assign(element.style, {
  width: "200px",
  height: "100px",
  border: "2px solid red"
});
```

### 2. CSS Classes (Recommended)

**Better than inline styles** for maintainability.

```javascript
const element = document.getElementById("card");

// Add class
element.classList.add("active");
element.classList.add("featured", "highlighted"); // Multiple classes

// Remove class
element.classList.remove("inactive");
element.classList.remove("old", "deprecated"); // Multiple classes

// Toggle class
element.classList.toggle("collapsed"); // Add if not present, remove if present

// Check if class exists
if (element.classList.contains("active")) {
  console.log("Element is active");
}

// Replace class
element.classList.replace("old-style", "new-style");

// List all classes
console.log(element.classList); // DOMTokenList
console.log([...element.classList]); // Convert to array

// Class manipulation with conditions
element.classList.toggle("error", hasError); // Add if hasError is true
element.classList.toggle("valid", isValid); // Remove if isValid is false
```

### 3. CSS Custom Properties (CSS Variables)

```javascript
const element = document.documentElement; // <html> element

// Set CSS custom properties
element.style.setProperty("--primary-color", "#007bff");
element.style.setProperty("--font-size", "16px");

// Get CSS custom properties
const primaryColor =
  getComputedStyle(element).getPropertyValue("--primary-color");

// Remove CSS custom property
element.style.removeProperty("--old-color");
```

## 🏗️ Creating and Adding Elements

### 1. Creating Elements

```javascript
// Create new element
const newDiv = document.createElement("div");
const newParagraph = document.createElement("p");
const newImage = document.createElement("img");

// Set properties immediately
newDiv.className = "card";
newDiv.id = "new-card";
newParagraph.textContent = "This is a new paragraph";
newImage.src = "image.jpg";
newImage.alt = "Description";

// Create with attributes using Object.assign
const button = Object.assign(document.createElement("button"), {
  textContent: "Click me",
  className: "btn primary",
  type: "button"
});
```

### 2. Adding Elements to DOM

```javascript
const container = document.getElementById("container");
const newElement = document.createElement("div");
newElement.textContent = "New content";

// Append as last child
container.appendChild(newElement);

// Insert as first child
container.insertBefore(newElement, container.firstChild);

// Insert at specific position
const referenceElement = container.children[2];
container.insertBefore(newElement, referenceElement);

// Modern methods (better API)
container.append(newElement); // Append (can take multiple)
container.prepend(newElement); // Prepend (can take multiple)
container.before(newElement); // Insert before container
container.after(newElement); // Insert after container

// Insert adjacent
container.insertAdjacentElement("beforebegin", newElement); // Before container
container.insertAdjacentElement("afterbegin", newElement); // First child
container.insertAdjacentElement("beforeend", newElement); // Last child
container.insertAdjacentElement("afterend", newElement); // After container
```

### 3. Insert HTML Strings

```javascript
const container = document.getElementById("container");

// Insert HTML strings
container.insertAdjacentHTML("beforebegin", "<div>Before container</div>");
container.insertAdjacentHTML("afterbegin", "<p>First child</p>");
container.insertAdjacentHTML("beforeend", "<p>Last child</p>");
container.insertAdjacentHTML("afterend", "<div>After container</div>");

// Insert text (safe from XSS)
container.insertAdjacentText("beforeend", "Safe text content");
```

## 🗑️ Removing Elements

```javascript
const element = document.getElementById("to-remove");

// Modern way (preferred)
element.remove();

// Traditional way
element.parentNode.removeChild(element);

// Remove all children
const container = document.getElementById("container");
container.innerHTML = ""; // Fast but not ideal for event listeners

// Better way to remove all children
while (container.firstChild) {
  container.removeChild(container.firstChild);
}

// Or using modern method
container.replaceChildren(); // Removes all children
```

## 🔄 Moving and Copying Elements

### 1. Moving Elements

```javascript
const element = document.getElementById("moveable");
const newParent = document.getElementById("new-container");

// Moving automatically removes from old location
newParent.appendChild(element);

// Move to specific position
const targetPosition = newParent.children[1];
newParent.insertBefore(element, targetPosition);
```

### 2. Cloning Elements

```javascript
const original = document.getElementById("template");

// Shallow clone (element only, no children)
const shallowClone = original.cloneNode(false);

// Deep clone (element and all children)
const deepClone = original.cloneNode(true);

// Clone and modify
const copy = original.cloneNode(true);
copy.id = "copy-1";
copy.textContent = "Modified copy";

// Add clone to DOM
document.body.appendChild(copy);
```

## 🎯 Practical Examples

### Example 1: Dynamic Content Creation

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .card {
        border: 1px solid #ddd;
        padding: 15px;
        margin: 10px 0;
        border-radius: 5px;
      }
      .featured {
        background-color: #f0f8ff;
      }
      .card h3 {
        margin-top: 0;
      }
    </style>
  </head>
  <body>
    <div id="container"></div>
    <button id="add-card">Add Card</button>

    <script>
      let cardCounter = 0;

      function createCard(title, content, featured = false) {
        // Create card element
        const card = document.createElement("div");
        card.className = "card";
        card.id = `card-${++cardCounter}`;

        if (featured) {
          card.classList.add("featured");
        }

        // Create card content
        const heading = document.createElement("h3");
        heading.textContent = title;

        const paragraph = document.createElement("p");
        paragraph.textContent = content;

        const button = document.createElement("button");
        button.textContent = "Remove";
        button.onclick = () => card.remove();

        // Assemble card
        card.appendChild(heading);
        card.appendChild(paragraph);
        card.appendChild(button);

        return card;
      }

      // Add event listener
      document.getElementById("add-card").addEventListener("click", () => {
        const container = document.getElementById("container");
        const isFeatured = Math.random() > 0.7; // 30% chance

        const newCard = createCard(
          `Card ${cardCounter + 1}`,
          `This is the content for card ${cardCounter + 1}`,
          isFeatured
        );

        container.appendChild(newCard);
      });
    </script>
  </body>
</html>
```

### Example 2: Form Validation with Visual Feedback

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .form-group {
        margin: 15px 0;
      }

      .form-group label {
        display: block;
        margin-bottom: 5px;
      }

      .form-group input {
        width: 100%;
        padding: 8px;
        border: 2px solid #ddd;
        border-radius: 4px;
      }

      .error {
        border-color: #dc3545 !important;
        background-color: #fff5f5;
      }

      .success {
        border-color: #28a745 !important;
        background-color: #f0fff4;
      }

      .error-message {
        color: #dc3545;
        font-size: 14px;
        margin-top: 5px;
        display: none;
      }

      .error-message.show {
        display: block;
      }
    </style>
  </head>
  <body>
    <form id="registration-form">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" required />
        <div class="error-message" id="username-error"></div>
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" required />
        <div class="error-message" id="email-error"></div>
      </div>

      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" required />
        <div class="error-message" id="password-error"></div>
      </div>

      <button type="submit">Register</button>
    </form>

    <script>
      const form = document.getElementById("registration-form");
      const username = document.getElementById("username");
      const email = document.getElementById("email");
      const password = document.getElementById("password");

      function validateField(field, validationFn, errorMessage) {
        const errorDiv = document.getElementById(`${field.id}-error`);
        const isValid = validationFn(field.value);

        // Remove existing classes
        field.classList.remove("error", "success");
        errorDiv.classList.remove("show");

        if (field.value && !isValid) {
          // Show error
          field.classList.add("error");
          errorDiv.textContent = errorMessage;
          errorDiv.classList.add("show");
          return false;
        } else if (field.value && isValid) {
          // Show success
          field.classList.add("success");
          return true;
        }

        return null; // Empty field
      }

      // Validation functions
      const isValidUsername = (username) => username.length >= 3;
      const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const isValidPassword = (password) => password.length >= 6;

      // Real-time validation
      username.addEventListener("blur", () => {
        validateField(
          username,
          isValidUsername,
          "Username must be at least 3 characters"
        );
      });

      email.addEventListener("blur", () => {
        validateField(
          email,
          isValidEmail,
          "Please enter a valid email address"
        );
      });

      password.addEventListener("blur", () => {
        validateField(
          password,
          isValidPassword,
          "Password must be at least 6 characters"
        );
      });

      // Form submission
      form.addEventListener("submit", (e) => {
        e.preventDefault();

        const isUsernameValid = validateField(
          username,
          isValidUsername,
          "Username must be at least 3 characters"
        );
        const isEmailValid = validateField(
          email,
          isValidEmail,
          "Please enter a valid email address"
        );
        const isPasswordValid = validateField(
          password,
          isValidPassword,
          "Password must be at least 6 characters"
        );

        if (isUsernameValid && isEmailValid && isPasswordValid) {
          alert("Form is valid! Ready to submit.");
          // Here you would normally submit the form
        }
      });
    </script>
  </body>
</html>
```

### Example 3: Interactive Theme Switcher

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      :root {
        --bg-color: white;
        --text-color: black;
        --border-color: #ddd;
      }

      [data-theme="dark"] {
        --bg-color: #333;
        --text-color: white;
        --border-color: #666;
      }

      body {
        background-color: var(--bg-color);
        color: var(--text-color);
        font-family: Arial, sans-serif;
        transition: all 0.3s ease;
        margin: 20px;
      }

      .theme-switch {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 15px;
        border: 2px solid var(--border-color);
        background: var(--bg-color);
        color: var(--text-color);
        cursor: pointer;
        border-radius: 5px;
      }

      .card {
        border: 1px solid var(--border-color);
        padding: 20px;
        margin: 20px 0;
        border-radius: 8px;
        background: var(--bg-color);
      }
    </style>
  </head>
  <body>
    <button class="theme-switch" id="theme-toggle">🌙 Dark Mode</button>

    <h1>Theme Switcher Demo</h1>

    <div class="card">
      <h2>Card 1</h2>
      <p>This content changes theme dynamically.</p>
    </div>

    <div class="card">
      <h2>Card 2</h2>
      <p>Notice how all colors transition smoothly.</p>
    </div>

    <script>
      const themeToggle = document.getElementById("theme-toggle");
      const body = document.body;

      // Check for saved theme preference
      const savedTheme = localStorage.getItem("theme") || "light";
      setTheme(savedTheme);

      function setTheme(theme) {
        if (theme === "dark") {
          body.setAttribute("data-theme", "dark");
          themeToggle.textContent = "☀️ Light Mode";
        } else {
          body.removeAttribute("data-theme");
          themeToggle.textContent = "🌙 Dark Mode";
        }

        // Save preference
        localStorage.setItem("theme", theme);
      }

      themeToggle.addEventListener("click", () => {
        const currentTheme = body.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        setTheme(newTheme);
      });
    </script>
  </body>
</html>
```

## 🚨 Common Mistakes and Best Practices

### Mistake 1: Using innerHTML with User Input

```javascript
// ❌ Dangerous - XSS vulnerability
const userInput = '<script>alert("XSS Attack!")</script>';
element.innerHTML = userInput;

// ✅ Safe alternatives
element.textContent = userInput; // Escapes HTML
// or sanitize HTML if you need formatting
```

### Mistake 2: Not Checking if Elements Exist

```javascript
// ❌ Can throw errors
const element = document.getElementById("maybe-missing");
element.style.color = "red"; // TypeError if element is null

// ✅ Safe approach
const element = document.getElementById("maybe-missing");
if (element) {
  element.style.color = "red";
}
```

### Mistake 3: Inefficient Style Manipulation

```javascript
// ❌ Causes multiple reflows
element.style.width = "100px";
element.style.height = "100px";
element.style.backgroundColor = "red";

// ✅ Better: Use CSS classes
element.className = "new-style";

// ✅ Or batch style changes
Object.assign(element.style, {
  width: "100px",
  height: "100px",
  backgroundColor: "red"
});
```

### Mistake 4: Memory Leaks with Event Listeners

```javascript
// ❌ Creates memory leaks if not removed
function addClickHandler(element) {
  element.addEventListener("click", function () {
    console.log("Clicked");
  });
}

// ✅ Remove listeners when element is removed
function addClickHandler(element) {
  const handler = function () {
    console.log("Clicked");
  };

  element.addEventListener("click", handler);

  // Store reference to remove later
  element._clickHandler = handler;
}

function removeElement(element) {
  if (element._clickHandler) {
    element.removeEventListener("click", element._clickHandler);
  }
  element.remove();
}
```

## 🧪 Practice Exercises

### Exercise 1: Content Manipulation

Create a simple text editor interface:

```html
<!DOCTYPE html>
<html>
  <body>
    <div id="editor">
      <div id="content" contenteditable="true">Edit this text...</div>
      <div id="controls">
        <button id="bold">Bold</button>
        <button id="italic">Italic</button>
        <button id="clear">Clear</button>
        <button id="save">Save</button>
      </div>
    </div>

    <script>
      // Implement functionality:
      // 1. Bold button toggles font-weight
      // 2. Italic button toggles font-style
      // 3. Clear button empties content
      // 4. Save button stores content to localStorage

      // Your code here...
    </script>
  </body>
</html>
```

### Exercise 2: Dynamic List Builder

```html
<!DOCTYPE html>
<html>
  <body>
    <div>
      <input type="text" id="item-input" placeholder="Enter item name" />
      <button id="add-item">Add Item</button>
    </div>

    <ul id="item-list"></ul>

    <script>
      // Implement functionality:
      // 1. Add new list items from input
      // 2. Each item should have a delete button
      // 3. Items should be numbered
      // 4. Clear input after adding
      // 5. Handle Enter key in input

      // Your code here...
    </script>
  </body>
</html>
```

## ✅ Self-Check Questions

1. **What's the difference between `textContent` and `innerHTML`?**
2. **How do you safely add user-generated content to the DOM?**
3. **What's the preferred way to style elements: inline styles or CSS classes?**
4. **How do you create and add a new element to the page?**
5. **What's the difference between `appendChild()` and `append()`?**

### Answers:

1. `textContent` sets/gets plain text (safe), `innerHTML` sets/gets HTML (can be risky)
2. Use `textContent` or properly sanitize HTML input
3. CSS classes - more maintainable and performant
4. `createElement()` then `appendChild()` or `append()`
5. `appendChild()` takes one element node, `append()` can take multiple elements/strings

## 🎯 What's Next?

You've mastered DOM manipulation! Next, let's make your pages truly interactive with events:

**Next**: Move to Week 6 - Event Handling and User Interaction

## 💡 Key Takeaways

- **Use `textContent`** for plain text (safer than `innerHTML`)
- **CSS classes** are better than inline styles
- **Always check** if elements exist before manipulating
- **Use data attributes** for custom data storage
- **Modern methods** like `append()` and `remove()` have better APIs
- **Performance matters** - batch DOM changes when possible

You're now ready to create dynamic, interactive web pages! 🚀
