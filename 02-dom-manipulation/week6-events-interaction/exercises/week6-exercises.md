# Week 6 Events and Interaction - Practical Exercises

## Exercise 1: Event Handling Fundamentals

### Objective

Master different types of events and event handling techniques.

### Setup

Create this HTML structure:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Event Handling Practice</title>
    <style>
      .event-box {
        width: 200px;
        height: 200px;
        border: 2px solid #ccc;
        margin: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f9f9f9;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .event-box:hover {
        background: #e9e9e9;
        transform: scale(1.05);
      }

      .active {
        background: #3498db !important;
        color: white;
      }

      .log {
        height: 200px;
        overflow-y: auto;
        border: 1px solid #ddd;
        padding: 10px;
        font-family: monospace;
        font-size: 12px;
      }

      .controls {
        margin: 20px 0;
      }

      .controls button {
        margin: 5px;
        padding: 10px 15px;
      }
    </style>
  </head>
  <body>
    <h1>Event Handling Practice</h1>

    <div class="controls">
      <button id="clear-log">Clear Log</button>
      <button id="toggle-logging">Toggle Logging</button>
      <button id="simulate-events">Simulate Events</button>
    </div>

    <div style="display: flex; gap: 20px;">
      <div>
        <h3>Interaction Boxes</h3>
        <div class="event-box" id="box1" data-box="1">Box 1</div>
        <div class="event-box" id="box2" data-box="2">Box 2</div>
        <div class="event-box" id="box3" data-box="3">Box 3</div>
      </div>

      <div style="flex: 1;">
        <h3>Event Log</h3>
        <div id="event-log" class="log"></div>
      </div>
    </div>

    <div style="margin-top: 20px;">
      <h3>Keyboard Test Area</h3>
      <input
        type="text"
        id="keyboard-input"
        placeholder="Type here to test keyboard events"
      />
      <p>Try: Enter, Escape, Arrow keys, Ctrl+S, Shift+Click</p>
    </div>

    <div style="margin-top: 20px;">
      <h3>Scroll Test Area</h3>
      <div
        style="height: 300px; overflow-y: auto; border: 1px solid #ccc; padding: 20px;"
        id="scroll-area"
      >
        <div
          style="height: 800px; background: linear-gradient(to bottom, #f0f0f0, #d0d0d0);"
        >
          <p>Scroll in this area to test scroll events</p>
          <p style="margin-top: 400px;">Middle content</p>
          <p style="margin-top: 300px;">Bottom content</p>
        </div>
      </div>
    </div>

    <script src="event-practice.js"></script>
  </body>
</html>
```

### Tasks

1. **Basic Event Handling**

   - Log all mouse events (click, mouseenter, mouseleave, mousedown, mouseup) for the boxes
   - Implement double-click detection with custom timing
   - Add right-click (contextmenu) handling

2. **Keyboard Events**

   - Log all keyboard events for the input field
   - Implement special key combinations (Ctrl+S, Ctrl+A, etc.)
   - Create arrow key navigation between boxes

3. **Event Propagation**

   - Demonstrate event bubbling by adding listeners to parent elements
   - Implement event delegation for dynamically created elements
   - Show how to stop propagation selectively

4. **Custom Events**

   - Create custom events for box selection
   - Implement a simple pub/sub system
   - Dispatch events programmatically

5. **Advanced Features**
   - Implement event throttling for scroll events
   - Create a event replay system
   - Add event statistics (count by type)

### Expected Behavior

- All events should be logged with timestamps
- Boxes should provide visual feedback for interactions
- Keyboard navigation should work smoothly
- Event log should be searchable and filterable

---

## Exercise 2: Form Validation System

### Objective

Build a comprehensive form validation system with real-time feedback.

### Setup

Create a registration form with multiple validation requirements:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Advanced Form Validation</title>
    <style>
      .form-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }

      .form-group input,
      .form-group select,
      .form-group textarea {
        width: 100%;
        padding: 10px;
        border: 2px solid #ddd;
        border-radius: 4px;
        font-size: 16px;
      }

      .form-group input.valid {
        border-color: #27ae60;
      }

      .form-group input.invalid {
        border-color: #e74c3c;
      }

      .error-message {
        color: #e74c3c;
        font-size: 14px;
        margin-top: 5px;
      }

      .success-message {
        color: #27ae60;
        font-size: 14px;
        margin-top: 5px;
      }

      .password-strength {
        margin-top: 5px;
      }

      .strength-meter {
        height: 4px;
        background: #eee;
        border-radius: 2px;
        overflow: hidden;
      }

      .strength-fill {
        height: 100%;
        transition: all 0.3s ease;
        border-radius: 2px;
      }

      .checkbox-group {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .checkbox-item {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .form-summary {
        background: #f9f9f9;
        padding: 15px;
        border-radius: 4px;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="form-container">
      <h1>Registration Form</h1>

      <form id="registration-form" novalidate>
        <div class="form-group">
          <label for="username">Username *</label>
          <input type="text" id="username" name="username" required />
          <div class="validation-message"></div>
        </div>

        <div class="form-group">
          <label for="email">Email *</label>
          <input type="email" id="email" name="email" required />
          <div class="validation-message"></div>
        </div>

        <div class="form-group">
          <label for="password">Password *</label>
          <input type="password" id="password" name="password" required />
          <div class="password-strength">
            <div class="strength-meter">
              <div class="strength-fill"></div>
            </div>
            <div class="strength-text"></div>
          </div>
          <div class="validation-message"></div>
        </div>

        <div class="form-group">
          <label for="confirm-password">Confirm Password *</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmPassword"
            required
          />
          <div class="validation-message"></div>
        </div>

        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="(555) 123-4567"
          />
          <div class="validation-message"></div>
        </div>

        <div class="form-group">
          <label for="birthdate">Birth Date</label>
          <input type="date" id="birthdate" name="birthdate" />
          <div class="validation-message"></div>
        </div>

        <div class="form-group">
          <label for="country">Country *</label>
          <select id="country" name="country" required>
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="UK">United Kingdom</option>
            <option value="AU">Australia</option>
          </select>
          <div class="validation-message"></div>
        </div>

        <div class="form-group">
          <label>Interests (Select at least 2) *</label>
          <div class="checkbox-group">
            <div class="checkbox-item">
              <input
                type="checkbox"
                id="tech"
                name="interests"
                value="technology"
              />
              <label for="tech">Technology</label>
            </div>
            <div class="checkbox-item">
              <input
                type="checkbox"
                id="sports"
                name="interests"
                value="sports"
              />
              <label for="sports">Sports</label>
            </div>
            <div class="checkbox-item">
              <input
                type="checkbox"
                id="music"
                name="interests"
                value="music"
              />
              <label for="music">Music</label>
            </div>
            <div class="checkbox-item">
              <input
                type="checkbox"
                id="travel"
                name="interests"
                value="travel"
              />
              <label for="travel">Travel</label>
            </div>
          </div>
          <div class="validation-message"></div>
        </div>

        <div class="form-group">
          <label for="bio">Bio (Optional)</label>
          <textarea
            id="bio"
            name="bio"
            rows="4"
            placeholder="Tell us about yourself..."
          ></textarea>
          <div class="char-count">0 / 500 characters</div>
          <div class="validation-message"></div>
        </div>

        <div class="form-group">
          <div class="checkbox-item">
            <input type="checkbox" id="terms" name="terms" required />
            <label for="terms">I agree to the Terms of Service *</label>
          </div>
          <div class="validation-message"></div>
        </div>

        <div class="form-group">
          <div class="checkbox-item">
            <input type="checkbox" id="newsletter" name="newsletter" />
            <label for="newsletter">Subscribe to newsletter</label>
          </div>
        </div>

        <button type="submit">Register</button>
      </form>

      <div id="form-summary" class="form-summary" style="display: none;">
        <h3>Registration Summary</h3>
        <div id="summary-content"></div>
      </div>
    </div>

    <script src="form-validation.js"></script>
  </body>
</html>
```

### Tasks

1. **Real-time Validation**

   - Username: 3-20 characters, alphanumeric + underscore only
   - Email: Valid email format, check for common domains
   - Password: Minimum 8 characters, strength indicator
   - Phone: Format as user types (555) 123-4567
   - Age validation from birthdate

2. **Advanced Features**

   - Password strength meter with visual feedback
   - Character counter for bio field
   - Email domain suggestions
   - Real-time username availability check (simulate with timeout)
   - Cross-field validation (password confirmation)

3. **User Experience**

   - Show validation messages on blur, not on every keystroke
   - Clear errors when user starts typing
   - Disable submit button until form is valid
   - Show success indicators for valid fields
   - Form progress indicator

4. **Accessibility**
   - Proper ARIA attributes for error messages
   - Screen reader announcements for validation changes
   - Keyboard navigation support
   - Focus management

### Challenge Features

- Implement form auto-save with localStorage
- Add file upload with validation
- Create a multi-step wizard version
- Add internationalization for error messages

---

## Exercise 3: Interactive Component Library

### Objective

Build a collection of reusable interactive components.

### Components to Build

#### 1. Modal System

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Modal System</title>
    <style>
      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .modal-backdrop.show {
        opacity: 1;
        visibility: visible;
      }

      .modal {
        background: white;
        border-radius: 8px;
        max-width: 90%;
        max-height: 90%;
        overflow: hidden;
        transform: scale(0.7);
        transition: transform 0.3s ease;
      }

      .modal-backdrop.show .modal {
        transform: scale(1);
      }

      .modal-header {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .modal-body {
        padding: 20px;
        max-height: 400px;
        overflow-y: auto;
      }

      .modal-footer {
        padding: 20px;
        border-top: 1px solid #eee;
        text-align: right;
      }

      .modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
      }

      body.modal-open {
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <h1>Modal System Demo</h1>

    <button data-modal="simple">Simple Modal</button>
    <button data-modal="confirm">Confirmation Modal</button>
    <button data-modal="form">Form Modal</button>
    <button data-modal="image">Image Modal</button>

    <script src="modal-system.js"></script>
  </body>
</html>
```

#### 2. Tab System

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tab System</title>
    <style>
      .tab-container {
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }

      .tab-list {
        display: flex;
        background: #f5f5f5;
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .tab-list button {
        background: none;
        border: none;
        padding: 15px 20px;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        transition: all 0.3s ease;
      }

      .tab-list button:hover {
        background: #e9e9e9;
      }

      .tab-list button.active {
        background: white;
        border-bottom-color: #3498db;
      }

      .tab-content {
        padding: 20px;
      }

      .tab-panel {
        display: none;
      }

      .tab-panel.active {
        display: block;
      }
    </style>
  </head>
  <body>
    <h1>Tab System Demo</h1>

    <div class="tab-container">
      <div role="tablist" class="tab-list">
        <button role="tab" aria-selected="true" aria-controls="panel1">
          Profile
        </button>
        <button role="tab" aria-selected="false" aria-controls="panel2">
          Settings
        </button>
        <button role="tab" aria-selected="false" aria-controls="panel3">
          Notifications
        </button>
      </div>

      <div class="tab-content">
        <div role="tabpanel" id="panel1" class="tab-panel active">
          <h3>Profile Information</h3>
          <p>Manage your profile details here.</p>
        </div>
        <div role="tabpanel" id="panel2" class="tab-panel">
          <h3>Account Settings</h3>
          <p>Configure your account settings.</p>
        </div>
        <div role="tabpanel" id="panel3" class="tab-panel">
          <h3>Notification Preferences</h3>
          <p>Manage your notification settings.</p>
        </div>
      </div>
    </div>

    <script src="tab-system.js"></script>
  </body>
</html>
```

#### 3. Dropdown Component

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Dropdown Component</title>
    <style>
      .dropdown {
        position: relative;
        display: inline-block;
      }

      .dropdown-trigger {
        background: #3498db;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 4px;
        cursor: pointer;
      }

      .dropdown-content {
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        min-width: 200px;
        z-index: 1000;
      }

      .dropdown-item {
        padding: 10px 15px;
        cursor: pointer;
        border-bottom: 1px solid #eee;
      }

      .dropdown-item:hover {
        background: #f5f5f5;
      }

      .dropdown-item:last-child {
        border-bottom: none;
      }

      .dropdown-search {
        width: 100%;
        padding: 10px;
        border: none;
        border-bottom: 1px solid #eee;
      }
    </style>
  </head>
  <body>
    <h1>Dropdown Component Demo</h1>

    <div class="dropdown" data-searchable="true">
      <button class="dropdown-trigger">Select Country</button>
      <div class="dropdown-content" style="display: none;">
        <input
          type="text"
          class="dropdown-search"
          placeholder="Search countries..."
        />
        <div class="dropdown-item" data-value="US">United States</div>
        <div class="dropdown-item" data-value="CA">Canada</div>
        <div class="dropdown-item" data-value="UK">United Kingdom</div>
        <div class="dropdown-item" data-value="AU">Australia</div>
        <div class="dropdown-item" data-value="DE">Germany</div>
        <div class="dropdown-item" data-value="FR">France</div>
      </div>
    </div>

    <script src="dropdown.js"></script>
  </body>
</html>
```

### Tasks

1. **Modal Component**

   - Implement focus trapping
   - Add animation system
   - Support different modal types (alert, confirm, prompt)
   - Handle nested modals
   - Add keyboard navigation

2. **Tab Component**

   - Dynamic tab addition/removal
   - Tab content lazy loading
   - Keyboard navigation (arrow keys)
   - Vertical tab orientation
   - Tab state persistence

3. **Dropdown Component**

   - Multi-select capability
   - Keyboard navigation
   - Option grouping
   - Custom option templates
   - Virtual scrolling for large lists

4. **General Requirements**
   - Full accessibility support
   - Mobile-friendly responsive design
   - Event system for component communication
   - Theme support
   - Performance optimization

### Advanced Features

- Implement a component registry system
- Add unit tests for each component
- Create a documentation system
- Build a component playground
- Add TypeScript definitions

---

## Exercise 4: Real-time Dashboard

### Objective

Build an interactive dashboard with real-time updates and user interactions.

### Features to Implement

1. **Widget System**

   - Draggable and resizable widgets
   - Add/remove widgets dynamically
   - Widget configuration panels
   - Save/load dashboard layouts

2. **Data Visualization**

   - Real-time charts and graphs
   - Interactive data filtering
   - Export functionality
   - Responsive design

3. **User Interactions**
   - Context menus
   - Keyboard shortcuts
   - Undo/redo system
   - Search and filter

### Starter Template

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Interactive Dashboard</title>
    <style>
      .dashboard {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        padding: 20px;
      }

      .widget {
        background: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        position: relative;
      }

      .widget-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .widget-title {
        font-weight: bold;
        font-size: 18px;
      }

      .widget-controls {
        display: flex;
        gap: 10px;
      }

      .control-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
      }

      .widget-content {
        min-height: 200px;
      }

      .toolbar {
        background: #f5f5f5;
        padding: 15px;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    </style>
  </head>
  <body>
    <div class="toolbar">
      <h1>Interactive Dashboard</h1>
      <div>
        <button id="add-widget">Add Widget</button>
        <button id="save-layout">Save Layout</button>
        <button id="reset-layout">Reset Layout</button>
      </div>
    </div>

    <div id="dashboard" class="dashboard">
      <!-- Widgets will be added here -->
    </div>

    <script src="dashboard.js"></script>
  </body>
</html>
```

### Implementation Requirements

1. **Data Management**

   - Simulate real-time data feeds
   - Implement data caching
   - Handle data refresh rates
   - Error handling for data failures

2. **User Experience**

   - Smooth animations
   - Loading states
   - Error messages
   - Success notifications

3. **Performance**
   - Efficient DOM updates
   - Event delegation
   - Memory leak prevention
   - Throttled/debounced events

---

## Exercise 5: Mini Project - Interactive Game

### Objective

Combine all Week 6 concepts to build an interactive browser game.

### Game Options (Choose One)

#### Option 1: Memory Card Game

- Card flip animations
- Score tracking
- Timer functionality
- Difficulty levels
- High score persistence

#### Option 2: Drag & Drop Puzzle

- Puzzle piece dragging
- Snap-to-grid functionality
- Progress tracking
- Hint system
- Custom image support

#### Option 3: Interactive Quiz

- Multiple question types
- Progress indicators
- Score calculation
- Result sharing
- Question randomization

### Requirements

- Responsive design
- Keyboard accessibility
- Sound effects (optional)
- Social sharing
- Local storage for progress

---

## Submission Guidelines

For each exercise:

1. **Code Quality**

   - Clean, readable code with comments
   - Proper error handling
   - Performance considerations
   - Cross-browser compatibility

2. **Accessibility**

   - ARIA attributes where needed
   - Keyboard navigation
   - Screen reader compatibility
   - Focus management

3. **Documentation**

   - README with setup instructions
   - Code comments explaining complex logic
   - Usage examples
   - Known limitations

4. **Testing**
   - Test in multiple browsers
   - Test with keyboard only
   - Test on mobile devices
   - Test with screen readers (if possible)

## Assessment Criteria

- **Functionality** (40%): Does it work as expected?
- **Code Quality** (25%): Is the code well-organized and efficient?
- **Accessibility** (20%): Can everyone use it?
- **User Experience** (15%): Is it intuitive and responsive?

## Bonus Points

- Creative solutions to common problems
- Additional features beyond requirements
- Exceptional attention to accessibility
- Performance optimizations
- Cross-browser compatibility testing
