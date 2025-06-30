# Week 5 DOM Basics - Practical Exercises

## Exercise 1: Element Selection Practice

### Objective

Practice different methods of selecting DOM elements.

### Setup

Create an HTML file with the following structure:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Selection Practice</title>
  </head>
  <body>
    <header id="main-header">
      <h1 class="title">Welcome to DOM Practice</h1>
      <nav>
        <ul class="nav-list">
          <li><a href="#home" class="nav-link active">Home</a></li>
          <li><a href="#about" class="nav-link">About</a></li>
          <li><a href="#contact" class="nav-link">Contact</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section class="content">
        <article data-category="tech">
          <h2>Technology Article</h2>
          <p>This is a technology article.</p>
        </article>
        <article data-category="sports">
          <h2>Sports Article</h2>
          <p>This is a sports article.</p>
        </article>
      </section>

      <aside>
        <div class="widget">
          <h3>Latest News</h3>
          <ul>
            <li>News item 1</li>
            <li>News item 2</li>
            <li>News item 3</li>
          </ul>
        </div>
      </aside>
    </main>

    <footer>
      <p>&copy; 2024 DOM Practice</p>
    </footer>

    <script src="selection-practice.js"></script>
  </body>
</html>
```

### Tasks

Complete the following tasks in your JavaScript file:

1. Select the main header element by ID
2. Select all navigation links by class name
3. Select the first article element
4. Select all articles with data-category="tech"
5. Select the active navigation link
6. Select all list items inside the widget
7. Select the last navigation link
8. Select all elements with class "nav-link" that are not active

### Expected Output

Your script should log information about each selected element(s) to the console.

---

## Exercise 2: Content Manipulation

### Objective

Practice modifying element content and attributes.

### Setup

Start with this HTML structure:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Content Manipulation</title>
    <style>
      .highlight {
        background-color: yellow;
      }
      .important {
        color: red;
        font-weight: bold;
      }
      .hidden {
        display: none;
      }
    </style>
  </head>
  <body>
    <div id="content-container">
      <h1 id="page-title">Original Title</h1>
      <p id="description">Original description text.</p>
      <img id="main-image" src="placeholder.jpg" alt="Placeholder" />
      <a id="main-link" href="https://example.com">Example Link</a>

      <div id="user-info">
        <span id="username">Guest</span>
        <span id="user-role">Visitor</span>
      </div>

      <ul id="item-list">
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>

      <button id="action-btn">Click Me</button>
    </div>

    <script src="content-manipulation.js"></script>
  </body>
</html>
```

### Tasks

1. Change the page title to "Updated Title"
2. Update the description to include HTML formatting (bold text)
3. Change the image source and alt text
4. Update the link href and text content
5. Set custom data attributes on the user info elements
6. Add HTML content to create a new list item
7. Change the button text and add a data attribute
8. Toggle CSS classes on different elements

### Challenge

Create a function that takes a user object and updates all user-related elements on the page.

---

## Exercise 3: Dynamic Styling

### Objective

Practice manipulating element styles and CSS classes.

### Setup

Create this HTML structure:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dynamic Styling</title>
    <style>
      .box {
        width: 100px;
        height: 100px;
        margin: 10px;
        display: inline-block;
        border: 2px solid #ccc;
        transition: all 0.3s ease;
      }

      .red {
        background-color: red;
      }
      .blue {
        background-color: blue;
      }
      .green {
        background-color: green;
      }
      .large {
        transform: scale(1.5);
      }
      .rounded {
        border-radius: 50%;
      }
      .shadow {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      }

      .theme-dark {
        background-color: #333;
        color: white;
      }

      .theme-light {
        background-color: white;
        color: black;
      }
    </style>
  </head>
  <body>
    <div id="container">
      <h1>Dynamic Styling Practice</h1>

      <div id="controls">
        <button id="theme-toggle">Toggle Theme</button>
        <button id="add-box">Add Box</button>
        <button id="style-boxes">Style All Boxes</button>
      </div>

      <div id="box-container">
        <div class="box" id="box1"></div>
        <div class="box" id="box2"></div>
        <div class="box" id="box3"></div>
      </div>

      <div id="info-panel">
        <p id="box-count">Boxes: 3</p>
        <p id="current-theme">Theme: Light</p>
      </div>
    </div>

    <script src="dynamic-styling.js"></script>
  </body>
</html>
```

### Tasks

1. Create a theme toggle function that switches between dark and light themes
2. Implement a function to add new boxes with random colors
3. Create a function that applies random styles to all boxes
4. Implement hover effects using JavaScript (not CSS)
5. Create a function that reads and displays computed styles
6. Build a color picker that changes box backgrounds
7. Implement a size slider that changes box dimensions

### Challenge

Create a style animation system that gradually changes element properties over time.

---

## Exercise 4: Element Creation and Management

### Objective

Practice creating, adding, and removing DOM elements.

### Setup

Start with minimal HTML:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Element Management</title>
    <style>
      .card {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 16px;
        margin: 8px;
        background: white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .card h3 {
        margin-top: 0;
        color: #333;
      }

      .card button {
        background: #e74c3c;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-group label {
        display: block;
        margin-bottom: 4px;
        font-weight: bold;
      }

      .form-group input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <div id="app">
      <h1>Contact Manager</h1>

      <form id="contact-form">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" required />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" required />
        </div>
        <div class="form-group">
          <label for="phone">Phone:</label>
          <input type="tel" id="phone" />
        </div>
        <button type="submit">Add Contact</button>
      </form>

      <div id="contacts-container">
        <!-- Contacts will be added here dynamically -->
      </div>

      <div id="stats">
        <p>Total Contacts: <span id="contact-count">0</span></p>
      </div>
    </div>

    <script src="element-management.js"></script>
  </body>
</html>
```

### Tasks

1. Create a contact card element factory function
2. Implement form submission to create new contacts
3. Add delete functionality to remove contacts
4. Implement a clear all contacts function
5. Create an edit contact feature
6. Add contact search/filter functionality
7. Implement contact sorting (by name, email, etc.)
8. Add data persistence using localStorage

### Requirements

- Each contact should be displayed as a card
- Cards should have delete buttons
- Form should reset after submission
- Contact count should update automatically
- Use document fragments for performance when adding multiple contacts

### Challenge

Implement an import/export feature that can handle JSON data.

---

## Exercise 5: Mini Project - Interactive Dashboard

### Objective

Combine all Week 5 concepts to build a simple dashboard.

### Features to Implement

1. **Widget System**: Create different types of widgets (weather, news, todo)
2. **Theme Switcher**: Light/dark theme toggle
3. **Widget Management**: Add, remove, and reorder widgets
4. **Data Display**: Show dynamic data in widgets
5. **Settings Panel**: Configure dashboard appearance

### Starter HTML

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Interactive Dashboard</title>
    <link rel="stylesheet" href="dashboard.css" />
  </head>
  <body>
    <div id="dashboard">
      <header id="dashboard-header">
        <h1>My Dashboard</h1>
        <div id="controls">
          <button id="add-widget">Add Widget</button>
          <button id="theme-toggle">Toggle Theme</button>
          <button id="settings-toggle">Settings</button>
        </div>
      </header>

      <main id="widget-container">
        <!-- Widgets will be added here -->
      </main>

      <div id="settings-panel" class="hidden">
        <!-- Settings controls -->
      </div>
    </div>

    <script src="dashboard.js"></script>
  </body>
</html>
```

### Requirements

- Responsive grid layout for widgets
- At least 3 different widget types
- Drag and drop to reorder (optional advanced feature)
- Data persistence
- Smooth animations and transitions
- Accessible keyboard navigation

### Bonus Features

- Widget templates system
- Import/export dashboard configuration
- Real-time clock widget
- Chart/graph widgets
- Custom widget creation interface

---

## Submission Guidelines

For each exercise:

1. Create the HTML, CSS, and JavaScript files
2. Test all functionality thoroughly
3. Add comments explaining your code
4. Include error handling where appropriate
5. Test in multiple browsers if possible

## Assessment Criteria

- **Functionality**: Does the code work as expected?
- **Code Quality**: Is the code well-organized and readable?
- **Best Practices**: Are DOM manipulation best practices followed?
- **Creativity**: Are there any innovative solutions or features?
- **Performance**: Is the code efficient, especially with DOM operations?

## Additional Resources

- [MDN DOM Manipulation Guide](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [JavaScript DOM Performance Tips](https://developers.google.com/web/fundamentals/performance/rendering/)
- [Accessibility in DOM Manipulation](https://webaim.org/articles/javascript/)
