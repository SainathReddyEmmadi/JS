# Interactive UI Components

## Learning Objectives

By the end of this lesson, you should be able to:

- Build interactive UI components from scratch
- Handle complex user interactions
- Manage component state effectively
- Create reusable and accessible components
- Implement common UI patterns

## Modal/Dialog Components

### Basic Modal Implementation

```javascript
class Modal {
  constructor(options = {}) {
    this.options = {
      closeOnBackdrop: true,
      closeOnEscape: true,
      showCloseButton: true,
      ...options
    };

    this.isOpen = false;
    this.modal = null;
    this.backdrop = null;
    this.focusedElementBeforeModal = null;

    this.init();
  }

  init() {
    this.createModal();
    this.bindEvents();
  }

  createModal() {
    // Create backdrop
    this.backdrop = document.createElement("div");
    this.backdrop.classList.add("modal-backdrop");

    // Create modal container
    this.modal = document.createElement("div");
    this.modal.classList.add("modal");
    this.modal.setAttribute("role", "dialog");
    this.modal.setAttribute("aria-modal", "true");

    // Create modal content
    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    // Create header if title provided
    if (this.options.title) {
      const header = document.createElement("div");
      header.classList.add("modal-header");

      const title = document.createElement("h2");
      title.textContent = this.options.title;
      title.id = "modal-title";
      header.appendChild(title);

      this.modal.setAttribute("aria-labelledby", "modal-title");

      if (this.options.showCloseButton) {
        const closeButton = document.createElement("button");
        closeButton.classList.add("modal-close");
        closeButton.innerHTML = "&times;";
        closeButton.setAttribute("aria-label", "Close modal");
        header.appendChild(closeButton);
      }

      modalContent.appendChild(header);
    }

    // Create body
    const body = document.createElement("div");
    body.classList.add("modal-body");
    modalContent.appendChild(body);

    // Create footer if actions provided
    if (this.options.actions) {
      const footer = document.createElement("div");
      footer.classList.add("modal-footer");

      this.options.actions.forEach((action) => {
        const button = document.createElement("button");
        button.textContent = action.text;
        button.classList.add("btn", action.class || "btn-primary");
        button.addEventListener("click", action.handler);
        footer.appendChild(button);
      });

      modalContent.appendChild(footer);
    }

    this.modal.appendChild(modalContent);
    this.backdrop.appendChild(this.modal);
  }

  bindEvents() {
    // Close on backdrop click
    if (this.options.closeOnBackdrop) {
      this.backdrop.addEventListener("click", (e) => {
        if (e.target === this.backdrop) {
          this.close();
        }
      });
    }

    // Close on escape key
    if (this.options.closeOnEscape) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.close();
        }
      });
    }

    // Close button
    const closeButton = this.modal.querySelector(".modal-close");
    if (closeButton) {
      closeButton.addEventListener("click", () => this.close());
    }

    // Trap focus within modal
    this.modal.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        this.trapFocus(e);
      }
    });
  }

  open(content) {
    if (this.isOpen) return;

    // Store currently focused element
    this.focusedElementBeforeModal = document.activeElement;

    // Set content
    const body = this.modal.querySelector(".modal-body");
    if (typeof content === "string") {
      body.innerHTML = content;
    } else if (content instanceof Element) {
      body.appendChild(content);
    }

    // Add to DOM
    document.body.appendChild(this.backdrop);
    document.body.classList.add("modal-open");

    // Trigger animation
    requestAnimationFrame(() => {
      this.backdrop.classList.add("show");
    });

    // Focus management
    const firstFocusableElement = this.getFirstFocusableElement();
    if (firstFocusableElement) {
      firstFocusableElement.focus();
    }

    this.isOpen = true;

    // Emit event
    this.emit("open");
  }

  close() {
    if (!this.isOpen) return;

    this.backdrop.classList.remove("show");

    // Wait for animation to complete
    setTimeout(() => {
      if (this.backdrop.parentNode) {
        document.body.removeChild(this.backdrop);
      }
      document.body.classList.remove("modal-open");

      // Restore focus
      if (this.focusedElementBeforeModal) {
        this.focusedElementBeforeModal.focus();
      }

      this.isOpen = false;

      // Emit event
      this.emit("close");
    }, 300); // Match CSS transition duration
  }

  trapFocus(event) {
    const focusableElements = this.getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  getFocusableElements() {
    const focusableSelectors = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])'
    ];

    return Array.from(
      this.modal.querySelectorAll(focusableSelectors.join(", "))
    );
  }

  getFirstFocusableElement() {
    const focusableElements = this.getFocusableElements();
    return focusableElements[0] || this.modal.querySelector(".modal-close");
  }

  emit(eventName) {
    const event = new CustomEvent(`modal:${eventName}`, {
      detail: { modal: this }
    });
    document.dispatchEvent(event);
  }
}

// Usage
const modal = new Modal({
  title: "Confirm Action",
  closeOnBackdrop: true,
  actions: [
    {
      text: "Cancel",
      class: "btn-secondary",
      handler: () => modal.close()
    },
    {
      text: "Confirm",
      class: "btn-primary",
      handler: () => {
        console.log("Action confirmed");
        modal.close();
      }
    }
  ]
});

// Open modal
document.getElementById("open-modal").addEventListener("click", () => {
  modal.open("<p>Are you sure you want to perform this action?</p>");
});
```

## Dropdown/Select Components

### Custom Dropdown

```javascript
class CustomDropdown {
  constructor(element) {
    this.element = element;
    this.trigger = null;
    this.dropdown = null;
    this.options = [];
    this.selectedOption = null;
    this.isOpen = false;
    this.searchable = element.dataset.searchable === "true";

    this.init();
  }

  init() {
    this.createDropdown();
    this.bindEvents();
    this.populateOptions();
  }

  createDropdown() {
    // Hide original select
    this.element.style.display = "none";

    // Create custom dropdown container
    const container = document.createElement("div");
    container.classList.add("custom-dropdown");

    // Create trigger button
    this.trigger = document.createElement("button");
    this.trigger.type = "button";
    this.trigger.classList.add("dropdown-trigger");
    this.trigger.setAttribute("aria-expanded", "false");
    this.trigger.setAttribute("aria-haspopup", "listbox");

    // Create dropdown content
    this.dropdown = document.createElement("div");
    this.dropdown.classList.add("dropdown-content");
    this.dropdown.setAttribute("role", "listbox");
    this.dropdown.style.display = "none";

    // Add search input if searchable
    if (this.searchable) {
      const searchInput = document.createElement("input");
      searchInput.type = "text";
      searchInput.classList.add("dropdown-search");
      searchInput.placeholder = "Search options...";
      this.dropdown.appendChild(searchInput);
    }

    // Create options container
    this.optionsContainer = document.createElement("div");
    this.optionsContainer.classList.add("dropdown-options");
    this.dropdown.appendChild(this.optionsContainer);

    container.appendChild(this.trigger);
    container.appendChild(this.dropdown);

    // Insert after original select
    this.element.parentNode.insertBefore(container, this.element.nextSibling);
  }

  populateOptions() {
    const options = Array.from(this.element.options);

    options.forEach((option, index) => {
      if (option.value === "") return; // Skip placeholder option

      const optionElement = document.createElement("div");
      optionElement.classList.add("dropdown-option");
      optionElement.textContent = option.textContent;
      optionElement.dataset.value = option.value;
      optionElement.dataset.index = index;
      optionElement.setAttribute("role", "option");
      optionElement.setAttribute("tabindex", "-1");

      if (option.selected) {
        this.selectOption(optionElement);
      }

      this.optionsContainer.appendChild(optionElement);
      this.options.push(optionElement);
    });

    // Set default trigger text
    if (!this.selectedOption) {
      this.trigger.textContent =
        this.element.options[0]?.textContent || "Select an option";
    }
  }

  bindEvents() {
    // Toggle dropdown
    this.trigger.addEventListener("click", () => this.toggle());

    // Option selection
    this.optionsContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("dropdown-option")) {
        this.selectOption(e.target);
        this.close();
      }
    });

    // Search functionality
    if (this.searchable) {
      const searchInput = this.dropdown.querySelector(".dropdown-search");
      searchInput.addEventListener("input", (e) =>
        this.filterOptions(e.target.value)
      );
    }

    // Keyboard navigation
    this.trigger.addEventListener("keydown", (e) =>
      this.handleTriggerKeydown(e)
    );
    this.dropdown.addEventListener("keydown", (e) =>
      this.handleDropdownKeydown(e)
    );

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (
        !this.trigger.contains(e.target) &&
        !this.dropdown.contains(e.target)
      ) {
        this.close();
      }
    });

    // Close on escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
        this.trigger.focus();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    if (this.isOpen) return;

    this.dropdown.style.display = "block";
    this.trigger.setAttribute("aria-expanded", "true");
    this.isOpen = true;

    // Position dropdown
    this.positionDropdown();

    // Focus first option or search input
    const searchInput = this.dropdown.querySelector(".dropdown-search");
    if (searchInput) {
      searchInput.focus();
    } else if (this.selectedOption) {
      this.selectedOption.focus();
    } else if (this.options.length > 0) {
      this.options[0].focus();
    }
  }

  close() {
    if (!this.isOpen) return;

    this.dropdown.style.display = "none";
    this.trigger.setAttribute("aria-expanded", "false");
    this.isOpen = false;

    // Clear search
    const searchInput = this.dropdown.querySelector(".dropdown-search");
    if (searchInput) {
      searchInput.value = "";
      this.filterOptions("");
    }
  }

  selectOption(optionElement) {
    // Remove previous selection
    if (this.selectedOption) {
      this.selectedOption.classList.remove("selected");
      this.selectedOption.setAttribute("aria-selected", "false");
    }

    // Set new selection
    this.selectedOption = optionElement;
    optionElement.classList.add("selected");
    optionElement.setAttribute("aria-selected", "true");

    // Update trigger text
    this.trigger.textContent = optionElement.textContent;

    // Update original select
    this.element.value = optionElement.dataset.value;

    // Trigger change event
    const changeEvent = new Event("change", { bubbles: true });
    this.element.dispatchEvent(changeEvent);
  }

  filterOptions(searchTerm) {
    const term = searchTerm.toLowerCase();

    this.options.forEach((option) => {
      const text = option.textContent.toLowerCase();
      const matches = text.includes(term);
      option.style.display = matches ? "block" : "none";
    });
  }

  positionDropdown() {
    const triggerRect = this.trigger.getBoundingClientRect();
    const dropdownRect = this.dropdown.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Position below trigger by default
    this.dropdown.style.top = "100%";
    this.dropdown.style.left = "0";

    // Check if dropdown would go below viewport
    if (triggerRect.bottom + dropdownRect.height > viewportHeight) {
      // Position above trigger instead
      this.dropdown.style.top = "auto";
      this.dropdown.style.bottom = "100%";
    }
  }

  handleTriggerKeydown(event) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
      case " ":
        event.preventDefault();
        this.open();
        break;
    }
  }

  handleDropdownKeydown(event) {
    const focusedElement = document.activeElement;
    const currentIndex = this.options.indexOf(focusedElement);

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.focusNextOption(currentIndex);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.focusPreviousOption(currentIndex);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (focusedElement.classList.contains("dropdown-option")) {
          this.selectOption(focusedElement);
          this.close();
          this.trigger.focus();
        }
        break;
    }
  }

  focusNextOption(currentIndex) {
    const visibleOptions = this.options.filter(
      (option) => option.style.display !== "none"
    );
    const currentVisibleIndex = visibleOptions.indexOf(document.activeElement);
    const nextIndex = (currentVisibleIndex + 1) % visibleOptions.length;
    visibleOptions[nextIndex].focus();
  }

  focusPreviousOption(currentIndex) {
    const visibleOptions = this.options.filter(
      (option) => option.style.display !== "none"
    );
    const currentVisibleIndex = visibleOptions.indexOf(document.activeElement);
    const prevIndex =
      currentVisibleIndex === 0
        ? visibleOptions.length - 1
        : currentVisibleIndex - 1;
    visibleOptions[prevIndex].focus();
  }
}

// Initialize all custom dropdowns
document.addEventListener("DOMContentLoaded", () => {
  const selects = document.querySelectorAll(".custom-select");
  selects.forEach((select) => new CustomDropdown(select));
});
```

## Tab Component

### Accessible Tab System

```javascript
class TabSystem {
  constructor(container) {
    this.container = container;
    this.tabList = container.querySelector('[role="tablist"]');
    this.tabs = Array.from(container.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(container.querySelectorAll('[role="tabpanel"]'));
    this.currentTab = 0;

    this.init();
  }

  init() {
    this.setupTabs();
    this.bindEvents();
    this.showTab(0);
  }

  setupTabs() {
    // Set up ARIA attributes
    this.tabs.forEach((tab, index) => {
      tab.setAttribute("tabindex", index === 0 ? "0" : "-1");
      tab.setAttribute("aria-selected", index === 0 ? "true" : "false");
      tab.id = tab.id || `tab-${index}`;

      const panelId = tab.getAttribute("aria-controls") || `panel-${index}`;
      tab.setAttribute("aria-controls", panelId);

      if (this.panels[index]) {
        this.panels[index].id = panelId;
        this.panels[index].setAttribute("aria-labelledby", tab.id);
        this.panels[index].setAttribute("tabindex", "0");
      }
    });
  }

  bindEvents() {
    // Click events
    this.tabs.forEach((tab, index) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        this.showTab(index);
      });
    });

    // Keyboard navigation
    this.tabList.addEventListener("keydown", (e) => {
      let targetTab = null;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          targetTab =
            this.currentTab === 0 ? this.tabs.length - 1 : this.currentTab - 1;
          break;
        case "ArrowRight":
          e.preventDefault();
          targetTab =
            this.currentTab === this.tabs.length - 1 ? 0 : this.currentTab + 1;
          break;
        case "Home":
          e.preventDefault();
          targetTab = 0;
          break;
        case "End":
          e.preventDefault();
          targetTab = this.tabs.length - 1;
          break;
      }

      if (targetTab !== null) {
        this.showTab(targetTab);
        this.tabs[targetTab].focus();
      }
    });
  }

  showTab(index) {
    if (index < 0 || index >= this.tabs.length) return;

    // Hide current tab/panel
    this.tabs[this.currentTab].setAttribute("aria-selected", "false");
    this.tabs[this.currentTab].setAttribute("tabindex", "-1");
    this.tabs[this.currentTab].classList.remove("active");

    if (this.panels[this.currentTab]) {
      this.panels[this.currentTab].hidden = true;
      this.panels[this.currentTab].classList.remove("active");
    }

    // Show new tab/panel
    this.currentTab = index;
    this.tabs[this.currentTab].setAttribute("aria-selected", "true");
    this.tabs[this.currentTab].setAttribute("tabindex", "0");
    this.tabs[this.currentTab].classList.add("active");

    if (this.panels[this.currentTab]) {
      this.panels[this.currentTab].hidden = false;
      this.panels[this.currentTab].classList.add("active");
    }

    // Emit custom event
    const event = new CustomEvent("tabChange", {
      detail: {
        tabIndex: index,
        tab: this.tabs[index],
        panel: this.panels[index]
      }
    });
    this.container.dispatchEvent(event);
  }

  addTab(tabContent, panelContent, index = -1) {
    const tabId = `tab-${Date.now()}`;
    const panelId = `panel-${Date.now()}`;

    // Create tab
    const tab = document.createElement("button");
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", panelId);
    tab.setAttribute("tabindex", "-1");
    tab.setAttribute("aria-selected", "false");
    tab.id = tabId;
    tab.innerHTML = tabContent;

    // Create panel
    const panel = document.createElement("div");
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tabId);
    panel.setAttribute("tabindex", "0");
    panel.id = panelId;
    panel.innerHTML = panelContent;
    panel.hidden = true;

    // Insert tab and panel
    if (index === -1 || index >= this.tabs.length) {
      this.tabList.appendChild(tab);
      this.container.appendChild(panel);
    } else {
      this.tabList.insertBefore(tab, this.tabs[index]);
      this.container.insertBefore(panel, this.panels[index]);
    }

    // Update arrays
    this.tabs = Array.from(this.container.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(
      this.container.querySelectorAll('[role="tabpanel"]')
    );

    // Bind events for new tab
    const newIndex = this.tabs.indexOf(tab);
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      this.showTab(newIndex);
    });

    return { tab, panel, index: newIndex };
  }

  removeTab(index) {
    if (index < 0 || index >= this.tabs.length) return;

    const tab = this.tabs[index];
    const panel = this.panels[index];

    // Remove from DOM
    tab.remove();
    if (panel) panel.remove();

    // Update arrays
    this.tabs = Array.from(this.container.querySelectorAll('[role="tab"]'));
    this.panels = Array.from(
      this.container.querySelectorAll('[role="tabpanel"]')
    );

    // Adjust current tab if necessary
    if (index === this.currentTab) {
      const newIndex = Math.min(this.currentTab, this.tabs.length - 1);
      this.showTab(newIndex);
    } else if (index < this.currentTab) {
      this.currentTab--;
    }
  }
}

// Initialize tab systems
document.addEventListener("DOMContentLoaded", () => {
  const tabContainers = document.querySelectorAll(".tab-container");
  tabContainers.forEach((container) => new TabSystem(container));
});
```

## Accordion Component

### Accessible Accordion

```javascript
class Accordion {
  constructor(element) {
    this.accordion = element;
    this.items = Array.from(element.querySelectorAll(".accordion-item"));
    this.allowMultiple = element.dataset.allowMultiple === "true";

    this.init();
  }

  init() {
    this.setupItems();
    this.bindEvents();
  }

  setupItems() {
    this.items.forEach((item, index) => {
      const header = item.querySelector(".accordion-header");
      const button =
        header.querySelector("button") || this.createButton(header);
      const content = item.querySelector(".accordion-content");

      // Set up IDs and ARIA attributes
      const buttonId = `accordion-button-${index}`;
      const contentId = `accordion-content-${index}`;

      button.id = buttonId;
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", contentId);

      content.id = contentId;
      content.setAttribute("aria-labelledby", buttonId);
      content.setAttribute("role", "region");

      // Initially close all items
      this.closeItem(item);
    });
  }

  createButton(header) {
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("accordion-button");
    button.innerHTML = header.innerHTML;
    header.innerHTML = "";
    header.appendChild(button);
    return button;
  }

  bindEvents() {
    this.accordion.addEventListener("click", (e) => {
      const button = e.target.closest(".accordion-button");
      if (!button) return;

      const item = button.closest(".accordion-item");
      const isOpen = button.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        this.closeItem(item);
      } else {
        if (!this.allowMultiple) {
          // Close all other items
          this.items.forEach((otherItem) => {
            if (otherItem !== item) {
              this.closeItem(otherItem);
            }
          });
        }
        this.openItem(item);
      }
    });

    // Keyboard navigation
    this.accordion.addEventListener("keydown", (e) => {
      const button = e.target.closest(".accordion-button");
      if (!button) return;

      const currentIndex = this.items.findIndex(
        (item) => item.querySelector(".accordion-button") === button
      );

      let targetIndex = null;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          targetIndex = (currentIndex + 1) % this.items.length;
          break;
        case "ArrowUp":
          e.preventDefault();
          targetIndex =
            currentIndex === 0 ? this.items.length - 1 : currentIndex - 1;
          break;
        case "Home":
          e.preventDefault();
          targetIndex = 0;
          break;
        case "End":
          e.preventDefault();
          targetIndex = this.items.length - 1;
          break;
      }

      if (targetIndex !== null) {
        this.items[targetIndex].querySelector(".accordion-button").focus();
      }
    });
  }

  openItem(item) {
    const button = item.querySelector(".accordion-button");
    const content = item.querySelector(".accordion-content");

    button.setAttribute("aria-expanded", "true");
    item.classList.add("open");

    // Animate opening
    content.style.height = "auto";
    const height = content.offsetHeight;
    content.style.height = "0";
    content.offsetHeight; // Trigger reflow
    content.style.height = height + "px";

    // Clean up after animation
    content.addEventListener("transitionend", function handler() {
      content.style.height = "auto";
      content.removeEventListener("transitionend", handler);
    });

    // Emit event
    const event = new CustomEvent("accordionOpen", {
      detail: { item, button, content }
    });
    this.accordion.dispatchEvent(event);
  }

  closeItem(item) {
    const button = item.querySelector(".accordion-button");
    const content = item.querySelector(".accordion-content");

    button.setAttribute("aria-expanded", "false");
    item.classList.remove("open");

    // Animate closing
    const height = content.offsetHeight;
    content.style.height = height + "px";
    content.offsetHeight; // Trigger reflow
    content.style.height = "0";

    // Emit event
    const event = new CustomEvent("accordionClose", {
      detail: { item, button, content }
    });
    this.accordion.dispatchEvent(event);
  }

  openAll() {
    if (this.allowMultiple) {
      this.items.forEach((item) => this.openItem(item));
    }
  }

  closeAll() {
    this.items.forEach((item) => this.closeItem(item));
  }
}

// Initialize accordions
document.addEventListener("DOMContentLoaded", () => {
  const accordions = document.querySelectorAll(".accordion");
  accordions.forEach((accordion) => new Accordion(accordion));
});
```

## Best Practices for Interactive Components

### 1. Accessibility First

```javascript
// Always include proper ARIA attributes
element.setAttribute("role", "button");
element.setAttribute("aria-expanded", "false");
element.setAttribute("aria-controls", "target-id");

// Handle keyboard navigation
element.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    handleAction();
  }
});
```

### 2. Progressive Enhancement

```javascript
// Check for JavaScript support
if (typeof document.querySelector !== "undefined") {
  // Enhance with JavaScript
  initializeComponents();
} else {
  // Provide fallback functionality
  useFallbackBehavior();
}
```

### 3. State Management

```javascript
class ComponentState {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.listeners = [];
  }

  setState(newState) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };

    this.listeners.forEach((listener) => {
      listener(this.state, prevState);
    });
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}
```

## Self-Check Questions

1. What ARIA attributes are essential for modal dialogs?
2. How do you implement keyboard navigation for custom components?
3. What's the difference between `aria-expanded` and `aria-selected`?
4. How do you handle focus management in interactive components?
5. What are the benefits of using custom events in components?

## Practice Exercises

1. Build a tooltip component with positioning logic
2. Create a carousel/slider with touch support
3. Implement a searchable multi-select component
4. Build a drag-and-drop sortable list
5. Create a date picker component

## Key Takeaways

- Always prioritize accessibility in interactive components
- Use proper ARIA attributes and keyboard navigation
- Implement smooth animations and transitions
- Manage component state effectively
- Emit custom events for component communication
- Test components with keyboard-only navigation
- Provide fallbacks for JavaScript-disabled environments
