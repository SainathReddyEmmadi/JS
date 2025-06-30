# Introduction to Events

## Learning Objectives

By the end of this lesson, you should be able to:

- Understand what events are and how they work
- Add and remove event listeners
- Understand event propagation (bubbling and capturing)
- Handle different types of events
- Use event objects effectively

## What Are Events?

Events are actions that happen in the browser - user interactions, browser actions, or programmatic triggers. Examples include:

- User clicks a button
- User types in an input field
- Page finishes loading
- Mouse moves over an element
- Form is submitted
- Window is resized

## Adding Event Listeners

### addEventListener() Method

```javascript
// Basic syntax
element.addEventListener("eventType", handlerFunction);

// Example: Click event
const button = document.getElementById("myButton");
button.addEventListener("click", function () {
  console.log("Button was clicked!");
});

// Using arrow function
button.addEventListener("click", () => {
  console.log("Button clicked with arrow function!");
});

// Using named function
function handleButtonClick() {
  console.log("Button clicked with named function!");
}
button.addEventListener("click", handleButtonClick);
```

### Event Handler Properties (Alternative Method)

```javascript
const button = document.getElementById("myButton");

// Using onclick property
button.onclick = function () {
  console.log("Button clicked via onclick property");
};

// Note: Only one handler per event type with this method
button.onclick = function () {
  console.log("This will override the previous handler");
};
```

### HTML Event Attributes (Not Recommended)

```html
<!-- Avoid this approach -->
<button onclick="handleClick()">Click me</button>

<script>
  function handleClick() {
    console.log("Button clicked via HTML attribute");
  }
</script>
```

## Common Event Types

### Mouse Events

```javascript
const element = document.getElementById("myElement");

// Click events
element.addEventListener("click", handleClick);
element.addEventListener("dblclick", handleDoubleClick);

// Mouse movement
element.addEventListener("mouseenter", handleMouseEnter);
element.addEventListener("mouseleave", handleMouseLeave);
element.addEventListener("mouseover", handleMouseOver);
element.addEventListener("mouseout", handleMouseOut);
element.addEventListener("mousemove", handleMouseMove);

// Mouse buttons
element.addEventListener("mousedown", handleMouseDown);
element.addEventListener("mouseup", handleMouseUp);

function handleClick(event) {
  console.log("Element clicked at:", event.clientX, event.clientY);
}

function handleMouseEnter() {
  console.log("Mouse entered element");
}

function handleMouseLeave() {
  console.log("Mouse left element");
}
```

### Keyboard Events

```javascript
const input = document.getElementById("myInput");

// Key events
input.addEventListener("keydown", handleKeyDown);
input.addEventListener("keyup", handleKeyUp);
input.addEventListener("keypress", handleKeyPress); // Deprecated

function handleKeyDown(event) {
  console.log("Key pressed:", event.key);
  console.log("Key code:", event.code);

  // Check for specific keys
  if (event.key === "Enter") {
    console.log("Enter key pressed");
  }

  // Check for modifier keys
  if (event.ctrlKey && event.key === "s") {
    event.preventDefault(); // Prevent browser save dialog
    console.log("Ctrl+S pressed");
  }
}

function handleKeyUp(event) {
  console.log("Key released:", event.key);
}
```

### Form Events

```javascript
const form = document.getElementById("myForm");
const input = document.getElementById("myInput");

// Form submission
form.addEventListener("submit", handleFormSubmit);

// Input events
input.addEventListener("input", handleInput); // Fires on every change
input.addEventListener("change", handleChange); // Fires when focus is lost
input.addEventListener("focus", handleFocus);
input.addEventListener("blur", handleBlur);

function handleFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission
  console.log("Form submitted");

  // Get form data
  const formData = new FormData(form);
  console.log("Form data:", Object.fromEntries(formData));
}

function handleInput(event) {
  console.log("Input value changed:", event.target.value);
}

function handleChange(event) {
  console.log("Input change event:", event.target.value);
}

function handleFocus() {
  console.log("Input focused");
}

function handleBlur() {
  console.log("Input lost focus");
}
```

### Window and Document Events

```javascript
// Page load events
window.addEventListener("load", function () {
  console.log("Page fully loaded");
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM content loaded");
});

// Window resize
window.addEventListener("resize", function () {
  console.log("Window resized to:", window.innerWidth, "x", window.innerHeight);
});

// Scroll events
window.addEventListener("scroll", function () {
  console.log("Page scrolled to:", window.scrollY);
});

// Before page unload
window.addEventListener("beforeunload", function (event) {
  event.preventDefault();
  event.returnValue = ""; // Some browsers require this
});
```

## The Event Object

Every event handler receives an event object with useful information:

```javascript
function handleEvent(event) {
  // Common event properties
  console.log("Event type:", event.type);
  console.log("Target element:", event.target);
  console.log("Current target:", event.currentTarget);
  console.log("Timestamp:", event.timeStamp);

  // Mouse event specific properties
  if (event.type.startsWith("mouse") || event.type === "click") {
    console.log("Mouse position:", event.clientX, event.clientY);
    console.log("Mouse button:", event.button);
    console.log("Ctrl key held:", event.ctrlKey);
    console.log("Shift key held:", event.shiftKey);
    console.log("Alt key held:", event.altKey);
  }

  // Keyboard event specific properties
  if (event.type.startsWith("key")) {
    console.log("Key pressed:", event.key);
    console.log("Key code:", event.code);
    console.log("Modifier keys:", {
      ctrl: event.ctrlKey,
      shift: event.shiftKey,
      alt: event.altKey,
      meta: event.metaKey
    });
  }
}
```

## Event Propagation

### Bubbling (Default Behavior)

Events bubble up from the target element to its ancestors:

```javascript
// HTML structure:
// <div id="parent">
//   <div id="child">
//     <button id="button">Click me</button>
//   </div>
// </div>

const parent = document.getElementById("parent");
const child = document.getElementById("child");
const button = document.getElementById("button");

parent.addEventListener("click", () => console.log("Parent clicked"));
child.addEventListener("click", () => console.log("Child clicked"));
button.addEventListener("click", () => console.log("Button clicked"));

// When button is clicked, console shows:
// "Button clicked"
// "Child clicked"
// "Parent clicked"
```

### Capturing Phase

You can listen during the capturing phase instead:

```javascript
// Add true as third parameter for capturing
parent.addEventListener(
  "click",
  () => console.log("Parent clicked (capturing)"),
  true
);
child.addEventListener(
  "click",
  () => console.log("Child clicked (capturing)"),
  true
);
button.addEventListener("click", () => console.log("Button clicked"));

// When button is clicked, console shows:
// "Parent clicked (capturing)"
// "Child clicked (capturing)"
// "Button clicked"
```

### Stopping Propagation

```javascript
button.addEventListener("click", function (event) {
  console.log("Button clicked");
  event.stopPropagation(); // Stops event from bubbling up
});

// Now only "Button clicked" will be logged
```

### Preventing Default Behavior

```javascript
// Prevent form submission
form.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("Form submission prevented");
});

// Prevent link navigation
link.addEventListener("click", function (event) {
  event.preventDefault();
  console.log("Link click prevented");
});

// Prevent context menu
element.addEventListener("contextmenu", function (event) {
  event.preventDefault();
  console.log("Context menu prevented");
});
```

## Removing Event Listeners

```javascript
function handleClick() {
  console.log("Button clicked");
}

const button = document.getElementById("myButton");

// Add event listener
button.addEventListener("click", handleClick);

// Remove event listener (must use same function reference)
button.removeEventListener("click", handleClick);

// This won't work (different function reference):
button.addEventListener("click", function () {
  console.log("Click");
});
button.removeEventListener("click", function () {
  console.log("Click");
});
```

## Event Delegation

Handle events for multiple elements efficiently:

```javascript
// Instead of adding listeners to each button individually
const container = document.getElementById("button-container");

container.addEventListener("click", function (event) {
  if (event.target.tagName === "BUTTON") {
    console.log("Button clicked:", event.target.textContent);

    // Handle different buttons based on their class or data attributes
    if (event.target.classList.contains("delete-btn")) {
      handleDelete(event.target);
    } else if (event.target.classList.contains("edit-btn")) {
      handleEdit(event.target);
    }
  }
});

function handleDelete(button) {
  const item = button.closest(".item");
  item.remove();
}

function handleEdit(button) {
  const item = button.closest(".item");
  // Enable editing for this item
}
```

## Practical Examples

### Interactive Button

```javascript
const button = document.getElementById("interactive-btn");

button.addEventListener("click", function () {
  this.textContent = "Clicked!";
  this.style.backgroundColor = "#27ae60";
});

button.addEventListener("mouseenter", function () {
  this.style.transform = "scale(1.1)";
});

button.addEventListener("mouseleave", function () {
  this.style.transform = "scale(1)";
});
```

### Form Validation

```javascript
const form = document.getElementById("registration-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("input", validatePassword);
form.addEventListener("submit", handleSubmit);

function validateEmail() {
  const email = emailInput.value;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    showError(emailInput, "Please enter a valid email");
  } else {
    clearError(emailInput);
  }
}

function validatePassword() {
  const password = passwordInput.value;

  if (password.length < 8) {
    showError(passwordInput, "Password must be at least 8 characters");
  } else {
    clearError(passwordInput);
  }
}

function handleSubmit(event) {
  event.preventDefault();

  // Validate all fields
  validateEmail();
  validatePassword();

  // Check if form is valid
  const errors = form.querySelectorAll(".error");
  if (errors.length === 0) {
    console.log("Form is valid, submitting...");
    // Submit form data
  }
}

function showError(input, message) {
  clearError(input);
  const error = document.createElement("span");
  error.textContent = message;
  error.classList.add("error");
  input.parentNode.appendChild(error);
  input.classList.add("invalid");
}

function clearError(input) {
  const error = input.parentNode.querySelector(".error");
  if (error) {
    error.remove();
  }
  input.classList.remove("invalid");
}
```

## Best Practices

### 1. Use addEventListener() Instead of HTML Attributes

```javascript
// ✅ Good
button.addEventListener("click", handleClick);

// ❌ Avoid
// <button onclick="handleClick()">Click</button>
```

### 2. Use Named Functions for Complex Handlers

```javascript
// ✅ Good for debugging and removal
function handleComplexClick(event) {
  // Complex logic here
}
button.addEventListener("click", handleComplexClick);

// ❌ Hard to debug and remove
button.addEventListener("click", function (event) {
  // Complex logic here
});
```

### 3. Clean Up Event Listeners

```javascript
// Remove listeners when elements are removed
function cleanup() {
  button.removeEventListener("click", handleClick);
  window.removeEventListener("resize", handleResize);
}
```

### 4. Use Event Delegation for Dynamic Content

```javascript
// ✅ Works for dynamically added elements
container.addEventListener("click", function (event) {
  if (event.target.matches(".dynamic-button")) {
    handleDynamicClick(event);
  }
});
```

## Self-Check Questions

1. What's the difference between `addEventListener()` and `onclick`?
2. How does event bubbling work?
3. When would you use `event.preventDefault()`?
4. What's the difference between `event.target` and `event.currentTarget`?
5. How do you remove an event listener?

## Practice Exercises

1. Create a color-changing box that responds to different mouse events
2. Build a form with real-time validation
3. Implement a keyboard shortcut system
4. Create a drag-and-drop interface
5. Build a simple drawing application using mouse events

## Key Takeaways

- Events are the primary way to handle user interactions
- Use `addEventListener()` for attaching event handlers
- Events bubble up through the DOM by default
- The event object contains useful information about the event
- Event delegation is efficient for handling multiple similar elements
- Always clean up event listeners when removing elements
