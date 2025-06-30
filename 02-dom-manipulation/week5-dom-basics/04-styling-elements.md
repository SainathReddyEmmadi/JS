# Styling Elements with JavaScript

## Learning Objectives

By the end of this lesson, you should be able to:

- Manipulate CSS styles using JavaScript
- Work with CSS classes dynamically
- Understand the difference between inline styles and CSS classes
- Use computed styles to read current styling

## The `style` Property

The `style` property allows you to set inline CSS styles on elements.

### Basic Style Manipulation

```javascript
// Get an element
const element = document.getElementById("myElement");

// Set individual style properties
element.style.color = "red";
element.style.backgroundColor = "yellow";
element.style.fontSize = "20px";
element.style.marginTop = "10px";

// Note: CSS properties with hyphens become camelCase
element.style.borderRadius = "5px"; // border-radius
element.style.textAlign = "center"; // text-align
```

### Working with Multiple Styles

```javascript
// Method 1: Set multiple properties individually
const box = document.getElementById("box");
box.style.width = "200px";
box.style.height = "200px";
box.style.backgroundColor = "#3498db";
box.style.border = "2px solid #2980b9";

// Method 2: Using cssText (overwrites existing styles)
box.style.cssText =
  "width: 200px; height: 200px; background-color: #3498db; border: 2px solid #2980b9;";

// Method 3: Using Object.assign (modern approach)
Object.assign(box.style, {
  width: "200px",
  height: "200px",
  backgroundColor: "#3498db",
  border: "2px solid #2980b9"
});
```

## CSS Classes vs Inline Styles

### Why CSS Classes Are Better

```css
/* CSS file */
.highlight {
  background-color: yellow;
  border: 2px solid orange;
  padding: 10px;
}

.hidden {
  display: none;
}

.fade-in {
  opacity: 1;
  transition: opacity 0.3s ease;
}
```

```javascript
// Better approach: Use CSS classes
const element = document.getElementById("myElement");

// Add a class
element.classList.add("highlight");

// Remove a class
element.classList.remove("highlight");

// Toggle a class
element.classList.toggle("hidden");

// Check if class exists
if (element.classList.contains("highlight")) {
  console.log("Element is highlighted");
}

// Replace one class with another
element.classList.replace("old-class", "new-class");
```

### Working with Multiple Classes

```javascript
const element = document.getElementById("myElement");

// Add multiple classes
element.classList.add("class1", "class2", "class3");

// Remove multiple classes
element.classList.remove("class1", "class2");

// Get all classes as an array
const classes = Array.from(element.classList);
console.log(classes);

// Iterate through classes
element.classList.forEach((className) => {
  console.log(className);
});
```

## Reading Current Styles

### Getting Computed Styles

```javascript
const element = document.getElementById("myElement");

// Get computed styles (actual rendered styles)
const computedStyles = window.getComputedStyle(element);

// Read specific properties
const color = computedStyles.color;
const fontSize = computedStyles.fontSize;
const backgroundColor = computedStyles.backgroundColor;

console.log(`Color: ${color}`);
console.log(`Font Size: ${fontSize}`);
console.log(`Background: ${backgroundColor}`);

// Get specific property
const width = window.getComputedStyle(element).getPropertyValue("width");
```

### Difference Between style and getComputedStyle

```javascript
const element = document.getElementById("myElement");

// element.style only returns inline styles
console.log(element.style.color); // Only shows if set via JS or inline

// getComputedStyle returns all computed styles
console.log(window.getComputedStyle(element).color); // Shows actual rendered color
```

## Practical Examples

### Theme Switcher

```javascript
function toggleTheme() {
  const body = document.body;

  if (body.classList.contains("dark-theme")) {
    body.classList.remove("dark-theme");
    body.classList.add("light-theme");
  } else {
    body.classList.remove("light-theme");
    body.classList.add("dark-theme");
  }
}

// Attach to button
document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
```

### Progress Bar

```javascript
function updateProgress(percentage) {
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  // Update width using inline style
  progressBar.style.width = percentage + "%";

  // Update text content
  progressText.textContent = percentage + "%";

  // Add/remove classes based on progress
  if (percentage >= 100) {
    progressBar.classList.add("complete");
  } else {
    progressBar.classList.remove("complete");
  }
}
```

### Dynamic Card Styling

```javascript
function createCard(title, content, type = "default") {
  const card = document.createElement("div");
  card.classList.add("card", `card-${type}`);

  card.innerHTML = `
        <h3 class="card-title">${title}</h3>
        <p class="card-content">${content}</p>
    `;

  // Add hover effects
  card.addEventListener("mouseenter", function () {
    this.classList.add("card-hover");
  });

  card.addEventListener("mouseleave", function () {
    this.classList.remove("card-hover");
  });

  return card;
}
```

## Best Practices

### 1. Prefer CSS Classes Over Inline Styles

```javascript
// ❌ Not recommended
element.style.display = "none";
element.style.opacity = "0.5";

// ✅ Recommended
element.classList.add("hidden", "transparent");
```

### 2. Use Meaningful Class Names

```css
/* ❌ Not descriptive */
.red {
  color: red;
}
.big {
  font-size: 24px;
}

/* ✅ Descriptive */
.error-message {
  color: red;
}
.heading-large {
  font-size: 24px;
}
```

### 3. Batch Style Changes

```javascript
// ❌ Multiple reflows
element.style.width = "200px";
element.style.height = "200px";
element.style.backgroundColor = "red";

// ✅ Single reflow
element.style.cssText = "width: 200px; height: 200px; background-color: red;";

// ✅ Or use classes
element.classList.add("styled-box");
```

### 4. Check Before Manipulating

```javascript
// Check if element exists
const element = document.getElementById("myElement");
if (element) {
  element.classList.toggle("active");
}

// Check if class exists before removing
if (element.classList.contains("old-class")) {
  element.classList.remove("old-class");
}
```

## Common Pitfalls

### 1. CSS Property Names

```javascript
// ❌ Wrong - using CSS property names
element.style.background-color = 'red'; // Syntax error
element.style.font-size = '16px'; // Syntax error

// ✅ Correct - using camelCase
element.style.backgroundColor = 'red';
element.style.fontSize = '16px';
```

### 2. Units in Inline Styles

```javascript
// ❌ Missing units
element.style.width = 200; // May not work

// ✅ Include units
element.style.width = "200px";
element.style.margin = "10px 20px";
```

### 3. Overriding CSS with !important

```javascript
// If CSS has !important, inline styles won't work
// Use classes or modify the CSS instead
element.classList.add("override-class");
```

## Self-Check Questions

1. What's the difference between `element.style` and `window.getComputedStyle(element)`?
2. How do you add multiple CSS classes to an element at once?
3. What's the JavaScript equivalent of the CSS property `border-radius`?
4. Why should you prefer CSS classes over inline styles?
5. How can you check if an element has a specific CSS class?

## Practice Exercises

1. Create a function that toggles between light and dark themes
2. Build a progress bar that updates its width and color based on percentage
3. Create a card component that changes appearance on hover
4. Implement a function that applies different styles based on screen size
5. Build a color picker that applies colors to selected elements

## Key Takeaways

- Use CSS classes instead of inline styles when possible
- CSS property names become camelCase in JavaScript
- `getComputedStyle()` returns actual rendered styles
- Always include units when setting numeric style values
- Check for element existence before manipulating styles
- Batch style changes to improve performance
