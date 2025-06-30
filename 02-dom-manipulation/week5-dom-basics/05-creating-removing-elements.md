# Creating and Removing Elements

## Learning Objectives

By the end of this lesson, you should be able to:

- Create new DOM elements dynamically
- Add elements to the DOM tree
- Remove elements from the DOM
- Clone existing elements
- Understand document fragments for performance

## Creating Elements

### Basic Element Creation

```javascript
// Create a new element
const newDiv = document.createElement("div");
const newParagraph = document.createElement("p");
const newButton = document.createElement("button");
const newImage = document.createElement("img");

// Set properties
newDiv.id = "myNewDiv";
newDiv.className = "container";
newParagraph.textContent = "This is a new paragraph";
newButton.textContent = "Click me";
newImage.src = "image.jpg";
newImage.alt = "Description";
```

### Setting Attributes

```javascript
const link = document.createElement("a");

// Method 1: Direct property assignment
link.href = "https://example.com";
link.textContent = "Visit Example";
link.target = "_blank";

// Method 2: Using setAttribute
link.setAttribute("href", "https://example.com");
link.setAttribute("target", "_blank");
link.setAttribute("data-category", "external");

// Method 3: Using properties for HTML content
link.innerHTML = "<strong>Visit Example</strong>";
```

### Creating Complex Elements

```javascript
function createUserCard(user) {
  // Create container
  const card = document.createElement("div");
  card.classList.add("user-card");

  // Create and set up image
  const img = document.createElement("img");
  img.src = user.avatar;
  img.alt = `${user.name}'s avatar`;
  img.classList.add("user-avatar");

  // Create name element
  const name = document.createElement("h3");
  name.textContent = user.name;
  name.classList.add("user-name");

  // Create email element
  const email = document.createElement("p");
  email.textContent = user.email;
  email.classList.add("user-email");

  // Create button
  const button = document.createElement("button");
  button.textContent = "Contact";
  button.classList.add("contact-btn");
  button.addEventListener("click", () => contactUser(user.id));

  // Assemble the card
  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(email);
  card.appendChild(button);

  return card;
}
```

## Adding Elements to the DOM

### appendChild()

```javascript
const parent = document.getElementById("container");
const newElement = document.createElement("div");
newElement.textContent = "New content";

// Add to the end of parent's children
parent.appendChild(newElement);
```

### insertBefore()

```javascript
const parent = document.getElementById("container");
const newElement = document.createElement("div");
const referenceElement = document.getElementById("existing-element");

// Insert before the reference element
parent.insertBefore(newElement, referenceElement);

// Insert at the beginning
parent.insertBefore(newElement, parent.firstChild);
```

### Modern Methods (insertAdjacentElement)

```javascript
const referenceElement = document.getElementById("reference");
const newElement = document.createElement("div");

// Insert positions:
referenceElement.insertAdjacentElement("beforebegin", newElement); // Before the element
referenceElement.insertAdjacentElement("afterbegin", newElement); // First child
referenceElement.insertAdjacentElement("beforeend", newElement); // Last child
referenceElement.insertAdjacentElement("afterend", newElement); // After the element
```

### insertAdjacentHTML (Quick but be careful with XSS)

```javascript
const element = document.getElementById("container");

// Insert HTML at different positions
element.insertAdjacentHTML("beforebegin", "<div>Before</div>");
element.insertAdjacentHTML("afterbegin", "<div>First child</div>");
element.insertAdjacentHTML("beforeend", "<div>Last child</div>");
element.insertAdjacentHTML("afterend", "<div>After</div>");
```

## Removing Elements

### removeChild() (Traditional)

```javascript
const parent = document.getElementById("container");
const child = document.getElementById("child-to-remove");

// Remove child from parent
parent.removeChild(child);
```

### remove() (Modern)

```javascript
const element = document.getElementById("element-to-remove");

// Remove element directly
element.remove();
```

### Removing All Children

```javascript
const container = document.getElementById("container");

// Method 1: Loop and remove
while (container.firstChild) {
  container.removeChild(container.firstChild);
}

// Method 2: Set innerHTML to empty (faster but loses event listeners)
container.innerHTML = "";

// Method 3: Modern approach
container.replaceChildren();
```

### Conditional Removal

```javascript
function removeElementsByClass(className) {
  const elements = document.querySelectorAll(`.${className}`);
  elements.forEach((element) => element.remove());
}

function removeEmptyParagraphs() {
  const paragraphs = document.querySelectorAll("p");
  paragraphs.forEach((p) => {
    if (p.textContent.trim() === "") {
      p.remove();
    }
  });
}
```

## Cloning Elements

### cloneNode()

```javascript
const original = document.getElementById("template");

// Shallow clone (element only, no children)
const shallowClone = original.cloneNode(false);

// Deep clone (element and all children)
const deepClone = original.cloneNode(true);

// Add to DOM
document.body.appendChild(deepClone);
```

### Practical Cloning Example

```javascript
function duplicateListItem() {
  const list = document.getElementById("todo-list");
  const template = document.getElementById("todo-template");

  // Clone the template
  const newItem = template.cloneNode(true);

  // Update properties
  newItem.id = "todo-" + Date.now();
  newItem.querySelector(".todo-text").textContent = "New todo item";

  // Add to list
  list.appendChild(newItem);
}
```

## Document Fragments (Performance Optimization)

### Why Use Document Fragments?

```javascript
// ❌ Inefficient - multiple DOM updates
const container = document.getElementById("container");
for (let i = 0; i < 1000; i++) {
  const div = document.createElement("div");
  div.textContent = `Item ${i}`;
  container.appendChild(div); // Triggers reflow each time
}

// ✅ Efficient - single DOM update
const container = document.getElementById("container");
const fragment = document.createDocumentFragment();

for (let i = 0; i < 1000; i++) {
  const div = document.createElement("div");
  div.textContent = `Item ${i}`;
  fragment.appendChild(div); // No reflow
}

container.appendChild(fragment); // Single reflow
```

### Fragment Example with Complex Elements

```javascript
function createUserList(users) {
  const fragment = document.createDocumentFragment();

  users.forEach((user) => {
    const userElement = createUserCard(user); // From previous example
    fragment.appendChild(userElement);
  });

  // Add all users at once
  document.getElementById("user-list").appendChild(fragment);
}
```

## Practical Examples

### Dynamic List Management

```javascript
class TodoList {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.todos = [];
  }

  addTodo(text) {
    const todo = {
      id: Date.now(),
      text: text,
      completed: false
    };

    this.todos.push(todo);
    this.renderTodo(todo);
  }

  renderTodo(todo) {
    const li = document.createElement("li");
    li.dataset.id = todo.id;
    li.classList.add("todo-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.addEventListener("change", () => this.toggleTodo(todo.id));

    const span = document.createElement("span");
    span.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => this.deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    this.container.appendChild(li);
  }

  deleteTodo(id) {
    // Remove from array
    this.todos = this.todos.filter((todo) => todo.id !== id);

    // Remove from DOM
    const element = this.container.querySelector(`[data-id="${id}"]`);
    if (element) {
      element.remove();
    }
  }

  clear() {
    this.todos = [];
    this.container.replaceChildren();
  }
}
```

### Dynamic Form Builder

```javascript
class FormBuilder {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.form = document.createElement("form");
    this.container.appendChild(this.form);
  }

  addTextField(label, name, required = false) {
    const fieldContainer = this.createFieldContainer();

    const labelEl = document.createElement("label");
    labelEl.textContent = label;
    labelEl.setAttribute("for", name);

    const input = document.createElement("input");
    input.type = "text";
    input.name = name;
    input.id = name;
    input.required = required;

    fieldContainer.appendChild(labelEl);
    fieldContainer.appendChild(input);
    this.form.appendChild(fieldContainer);

    return this;
  }

  addSelectField(label, name, options) {
    const fieldContainer = this.createFieldContainer();

    const labelEl = document.createElement("label");
    labelEl.textContent = label;
    labelEl.setAttribute("for", name);

    const select = document.createElement("select");
    select.name = name;
    select.id = name;

    options.forEach((option) => {
      const optionEl = document.createElement("option");
      optionEl.value = option.value;
      optionEl.textContent = option.text;
      select.appendChild(optionEl);
    });

    fieldContainer.appendChild(labelEl);
    fieldContainer.appendChild(select);
    this.form.appendChild(fieldContainer);

    return this;
  }

  addSubmitButton(text = "Submit") {
    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = text;
    this.form.appendChild(button);

    return this;
  }

  createFieldContainer() {
    const container = document.createElement("div");
    container.classList.add("field-container");
    return container;
  }
}

// Usage
const builder = new FormBuilder("form-container");
builder
  .addTextField("Name", "name", true)
  .addTextField("Email", "email", true)
  .addSelectField("Country", "country", [
    { value: "us", text: "United States" },
    { value: "ca", text: "Canada" },
    { value: "uk", text: "United Kingdom" }
  ])
  .addSubmitButton("Submit Form");
```

## Best Practices

### 1. Use Document Fragments for Multiple Elements

```javascript
// ✅ Good for performance
const fragment = document.createDocumentFragment();
// Add multiple elements to fragment
container.appendChild(fragment);
```

### 2. Set Properties Before Adding to DOM

```javascript
// ✅ Set properties first
const element = document.createElement("div");
element.className = "my-class";
element.textContent = "Content";
element.style.display = "block";
// Then add to DOM
parent.appendChild(element);
```

### 3. Be Careful with innerHTML for User Content

```javascript
// ❌ XSS vulnerability
element.innerHTML = userInput;

// ✅ Safe approach
element.textContent = userInput;
// or
const textNode = document.createTextNode(userInput);
element.appendChild(textNode);
```

### 4. Clean Up Event Listeners

```javascript
function removeElementWithCleanup(element) {
  // Remove event listeners (if using removeEventListener)
  // Remove references from your app state
  // Then remove from DOM
  element.remove();
}
```

## Self-Check Questions

1. What's the difference between `appendChild()` and `insertBefore()`?
2. When should you use document fragments?
3. What's the difference between `cloneNode(true)` and `cloneNode(false)`?
4. How do you remove all children from an element?
5. What are the security considerations when using `innerHTML`?

## Practice Exercises

1. Create a function that generates a table from an array of objects
2. Build a dynamic navigation menu from a configuration object
3. Implement a card gallery with add/remove functionality
4. Create a form generator that builds forms from JSON configuration
5. Build a tree view component with expand/collapse functionality

## Key Takeaways

- Use `createElement()` to create new elements
- Set properties before adding elements to the DOM
- Use document fragments for better performance with multiple elements
- Prefer `textContent` over `innerHTML` for user content
- Clean up resources when removing elements
- Modern methods like `remove()` and `insertAdjacentElement()` are more convenient
