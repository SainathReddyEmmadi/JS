# Form Handling and Validation

## Learning Objectives

By the end of this lesson, you should be able to:

- Handle form submissions and input events
- Implement client-side form validation
- Work with different form controls
- Provide user feedback for form interactions
- Handle form data efficiently

## Form Events

### Form Submission

```javascript
const form = document.getElementById("myForm");

form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default browser submission

  // Get form data
  const formData = new FormData(form);

  // Process form data
  handleFormSubmission(formData);
});

function handleFormSubmission(formData) {
  // Convert FormData to object
  const data = Object.fromEntries(formData);
  console.log("Form data:", data);

  // Validate data
  if (validateFormData(data)) {
    // Submit to server or process data
    submitData(data);
  }
}
```

### Input Events

```javascript
const input = document.getElementById("username");

// Real-time input validation
input.addEventListener("input", function (event) {
  const value = event.target.value;
  validateUsername(value);
});

// Validation when user leaves field
input.addEventListener("blur", function (event) {
  const value = event.target.value;
  validateUsernameComplete(value);
});

// Clear errors when user focuses
input.addEventListener("focus", function (event) {
  clearFieldError(event.target);
});
```

## Working with Form Controls

### Text Inputs

```javascript
const textInput = document.getElementById("text-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");

// Text input validation
textInput.addEventListener("input", function () {
  const value = this.value.trim();

  if (value.length < 3) {
    showError(this, "Must be at least 3 characters");
  } else if (value.length > 50) {
    showError(this, "Must be less than 50 characters");
  } else {
    clearError(this);
  }
});

// Email validation
emailInput.addEventListener("blur", function () {
  const email = this.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email && !emailRegex.test(email)) {
    showError(this, "Please enter a valid email address");
  } else {
    clearError(this);
  }
});

// Password strength validation
passwordInput.addEventListener("input", function () {
  const password = this.value;
  const strength = checkPasswordStrength(password);
  updatePasswordStrengthIndicator(strength);
});

function checkPasswordStrength(password) {
  let score = 0;
  let feedback = [];

  if (password.length >= 8) score++;
  else feedback.push("At least 8 characters");

  if (/[a-z]/.test(password)) score++;
  else feedback.push("Include lowercase letters");

  if (/[A-Z]/.test(password)) score++;
  else feedback.push("Include uppercase letters");

  if (/\d/.test(password)) score++;
  else feedback.push("Include numbers");

  if (/[^a-zA-Z\d]/.test(password)) score++;
  else feedback.push("Include special characters");

  return { score, feedback };
}

function updatePasswordStrengthIndicator(strength) {
  const indicator = document.getElementById("password-strength");
  const strengthLevels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = [
    "#e74c3c",
    "#e67e22",
    "#f39c12",
    "#27ae60",
    "#2ecc71"
  ];

  indicator.textContent = strengthLevels[strength.score] || "Very Weak";
  indicator.style.color = strengthColors[strength.score] || "#e74c3c";

  // Show feedback
  const feedback = document.getElementById("password-feedback");
  feedback.innerHTML = strength.feedback
    .map((tip) => `<li>${tip}</li>`)
    .join("");
}
```

### Select Dropdowns

```javascript
const countrySelect = document.getElementById("country");
const stateSelect = document.getElementById("state");

countrySelect.addEventListener("change", function () {
  const selectedCountry = this.value;
  updateStateOptions(selectedCountry);
});

function updateStateOptions(country) {
  // Clear existing options
  stateSelect.innerHTML = '<option value="">Select State</option>';

  // Add new options based on country
  const states = getStatesByCountry(country);
  states.forEach((state) => {
    const option = document.createElement("option");
    option.value = state.code;
    option.textContent = state.name;
    stateSelect.appendChild(option);
  });

  // Enable/disable state select
  stateSelect.disabled = states.length === 0;
}

function getStatesByCountry(country) {
  const stateData = {
    US: [
      { code: "CA", name: "California" },
      { code: "NY", name: "New York" },
      { code: "TX", name: "Texas" }
    ],
    CA: [
      { code: "ON", name: "Ontario" },
      { code: "BC", name: "British Columbia" },
      { code: "QC", name: "Quebec" }
    ]
  };

  return stateData[country] || [];
}
```

### Checkboxes and Radio Buttons

```javascript
// Checkbox handling
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const selectAllCheckbox = document.getElementById("select-all");

selectAllCheckbox.addEventListener("change", function () {
  checkboxes.forEach((checkbox) => {
    if (checkbox !== this) {
      checkbox.checked = this.checked;
    }
  });
});

// Individual checkbox handling
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    updateSelectAllState();
    validateCheckboxGroup();
  });
});

function updateSelectAllState() {
  const regularCheckboxes = document.querySelectorAll(
    'input[type="checkbox"]:not(#select-all)'
  );
  const checkedBoxes = document.querySelectorAll(
    'input[type="checkbox"]:not(#select-all):checked'
  );

  selectAllCheckbox.checked = regularCheckboxes.length === checkedBoxes.length;
  selectAllCheckbox.indeterminate =
    checkedBoxes.length > 0 && checkedBoxes.length < regularCheckboxes.length;
}

function validateCheckboxGroup() {
  const checkedBoxes = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  const errorContainer = document.getElementById("checkbox-error");

  if (checkedBoxes.length === 0) {
    errorContainer.textContent = "Please select at least one option";
    errorContainer.style.display = "block";
  } else {
    errorContainer.style.display = "none";
  }
}

// Radio button handling
const radioButtons = document.querySelectorAll('input[name="payment-method"]');

radioButtons.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (this.checked) {
      handlePaymentMethodChange(this.value);
    }
  });
});

function handlePaymentMethodChange(method) {
  // Show/hide relevant form sections
  const creditCardSection = document.getElementById("credit-card-section");
  const paypalSection = document.getElementById("paypal-section");

  creditCardSection.style.display = method === "credit-card" ? "block" : "none";
  paypalSection.style.display = method === "paypal" ? "block" : "none";
}
```

## Form Validation

### Real-time Validation

```javascript
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.rules = {};
    this.init();
  }

  init() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    // Add real-time validation to all inputs
    const inputs = this.form.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearErrors(input));
    });
  }

  addRule(fieldName, validator, message) {
    if (!this.rules[fieldName]) {
      this.rules[fieldName] = [];
    }
    this.rules[fieldName].push({ validator, message });
    return this;
  }

  validateField(field) {
    const fieldName = field.name;
    const fieldRules = this.rules[fieldName] || [];

    this.clearErrors(field);

    for (let rule of fieldRules) {
      if (!rule.validator(field.value, field)) {
        this.showError(field, rule.message);
        return false;
      }
    }

    this.showSuccess(field);
    return true;
  }

  validateForm() {
    const inputs = this.form.querySelectorAll("input, select, textarea");
    let isValid = true;

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.validateForm()) {
      const formData = new FormData(this.form);
      this.onValidSubmit(Object.fromEntries(formData));
    }
  }

  onValidSubmit(data) {
    console.log("Form is valid:", data);
    // Override this method to handle valid submissions
  }

  showError(field, message) {
    field.classList.add("error");

    let errorElement = field.parentNode.querySelector(".error-message");
    if (!errorElement) {
      errorElement = document.createElement("span");
      errorElement.classList.add("error-message");
      field.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = message;
  }

  showSuccess(field) {
    field.classList.remove("error");
    field.classList.add("success");
  }

  clearErrors(field) {
    field.classList.remove("error", "success");
    const errorElement = field.parentNode.querySelector(".error-message");
    if (errorElement) {
      errorElement.remove();
    }
  }
}

// Usage
const validator = new FormValidator("registration-form");

validator
  .addRule(
    "username",
    (value) => value.length >= 3,
    "Username must be at least 3 characters"
  )
  .addRule(
    "username",
    (value) => /^[a-zA-Z0-9_]+$/.test(value),
    "Username can only contain letters, numbers, and underscores"
  )
  .addRule(
    "email",
    (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    "Please enter a valid email"
  )
  .addRule(
    "password",
    (value) => value.length >= 8,
    "Password must be at least 8 characters"
  )
  .addRule(
    "password",
    (value) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value),
    "Password must contain uppercase, lowercase, and numbers"
  )
  .addRule(
    "confirmPassword",
    (value, field) => {
      const password = document.getElementById("password").value;
      return value === password;
    },
    "Passwords do not match"
  );

validator.onValidSubmit = function (data) {
  // Handle valid form submission
  console.log("Submitting:", data);
  submitToServer(data);
};
```

### Custom Validation Messages

```javascript
// Set custom validation messages
const emailInput = document.getElementById("email");

emailInput.addEventListener("invalid", function (event) {
  if (this.validity.valueMissing) {
    this.setCustomValidity("Please enter your email address");
  } else if (this.validity.typeMismatch) {
    this.setCustomValidity("Please enter a valid email address");
  }
});

emailInput.addEventListener("input", function () {
  this.setCustomValidity(""); // Clear custom message
});
```

## Advanced Form Handling

### Dynamic Form Fields

```javascript
class DynamicForm {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.fieldCount = 0;
  }

  addField(type, label, name, options = {}) {
    const fieldId = `${name}_${++this.fieldCount}`;
    const fieldContainer = document.createElement("div");
    fieldContainer.classList.add("field-container");
    fieldContainer.dataset.fieldId = fieldId;

    const labelElement = document.createElement("label");
    labelElement.textContent = label;
    labelElement.setAttribute("for", fieldId);

    const input = this.createInput(type, fieldId, name, options);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.textContent = "Remove";
    removeButton.classList.add("remove-field");
    removeButton.addEventListener("click", () => this.removeField(fieldId));

    fieldContainer.appendChild(labelElement);
    fieldContainer.appendChild(input);
    fieldContainer.appendChild(removeButton);

    this.container.appendChild(fieldContainer);

    return fieldId;
  }

  createInput(type, id, name, options) {
    let input;

    switch (type) {
      case "select":
        input = document.createElement("select");
        if (options.options) {
          options.options.forEach((option) => {
            const optionElement = document.createElement("option");
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            input.appendChild(optionElement);
          });
        }
        break;
      case "textarea":
        input = document.createElement("textarea");
        if (options.rows) input.rows = options.rows;
        break;
      default:
        input = document.createElement("input");
        input.type = type;
        if (options.placeholder) input.placeholder = options.placeholder;
        if (options.required) input.required = true;
    }

    input.id = id;
    input.name = name;

    return input;
  }

  removeField(fieldId) {
    const fieldContainer = this.container.querySelector(
      `[data-field-id="${fieldId}"]`
    );
    if (fieldContainer) {
      fieldContainer.remove();
    }
  }

  getFormData() {
    const formData = new FormData();
    const inputs = this.container.querySelectorAll("input, select, textarea");

    inputs.forEach((input) => {
      if (input.type === "checkbox" || input.type === "radio") {
        if (input.checked) {
          formData.append(input.name, input.value);
        }
      } else {
        formData.append(input.name, input.value);
      }
    });

    return formData;
  }
}

// Usage
const dynamicForm = new DynamicForm("dynamic-form-container");

document.getElementById("add-text-field").addEventListener("click", () => {
  dynamicForm.addField("text", "Text Field", "text_field", {
    placeholder: "Enter text",
    required: true
  });
});

document.getElementById("add-select-field").addEventListener("click", () => {
  dynamicForm.addField("select", "Select Field", "select_field", {
    options: [
      { value: "", text: "Choose option" },
      { value: "option1", text: "Option 1" },
      { value: "option2", text: "Option 2" }
    ]
  });
});
```

### Form Auto-Save

```javascript
class FormAutoSave {
  constructor(formId, saveKey) {
    this.form = document.getElementById(formId);
    this.saveKey = saveKey;
    this.saveDelay = 1000; // Save after 1 second of inactivity
    this.saveTimeout = null;

    this.init();
    this.loadSavedData();
  }

  init() {
    const inputs = this.form.querySelectorAll("input, select, textarea");

    inputs.forEach((input) => {
      input.addEventListener("input", () => this.scheduleSave());
      input.addEventListener("change", () => this.scheduleSave());
    });

    // Save on form submit
    this.form.addEventListener("submit", () => this.clearSavedData());

    // Save on page unload
    window.addEventListener("beforeunload", () => this.saveFormData());
  }

  scheduleSave() {
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => this.saveFormData(), this.saveDelay);
  }

  saveFormData() {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    localStorage.setItem(
      this.saveKey,
      JSON.stringify({
        data: data,
        timestamp: Date.now()
      })
    );

    this.showSaveIndicator();
  }

  loadSavedData() {
    const saved = localStorage.getItem(this.saveKey);
    if (!saved) return;

    try {
      const { data, timestamp } = JSON.parse(saved);

      // Check if data is not too old (e.g., 1 day)
      if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
        this.clearSavedData();
        return;
      }

      // Restore form data
      Object.keys(data).forEach((key) => {
        const input = this.form.querySelector(`[name="${key}"]`);
        if (input) {
          if (input.type === "checkbox" || input.type === "radio") {
            input.checked = input.value === data[key];
          } else {
            input.value = data[key];
          }
        }
      });

      this.showRestoreNotification();
    } catch (error) {
      console.error("Error loading saved form data:", error);
      this.clearSavedData();
    }
  }

  clearSavedData() {
    localStorage.removeItem(this.saveKey);
  }

  showSaveIndicator() {
    const indicator = document.getElementById("save-indicator");
    if (indicator) {
      indicator.textContent = "Draft saved";
      indicator.style.opacity = "1";
      setTimeout(() => {
        indicator.style.opacity = "0";
      }, 2000);
    }
  }

  showRestoreNotification() {
    const notification = document.createElement("div");
    notification.classList.add("restore-notification");
    notification.innerHTML = `
            <p>We restored your previous draft.</p>
            <button onclick="this.parentNode.remove()">Dismiss</button>
        `;
    document.body.insertBefore(notification, document.body.firstChild);
  }
}

// Usage
const autoSave = new FormAutoSave("contact-form", "contact_form_draft");
```

## Best Practices

### 1. Provide Immediate Feedback

```javascript
// Show loading state during submission
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const submitButton = this.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = "Submitting...";

  submitForm(new FormData(this))
    .then((response) => {
      showSuccessMessage("Form submitted successfully!");
    })
    .catch((error) => {
      showErrorMessage("Submission failed. Please try again.");
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    });
});
```

### 2. Accessible Form Validation

```javascript
function showError(field, message) {
  // Set ARIA attributes for accessibility
  field.setAttribute("aria-invalid", "true");
  field.setAttribute("aria-describedby", field.id + "-error");

  const errorElement = document.createElement("div");
  errorElement.id = field.id + "-error";
  errorElement.classList.add("error-message");
  errorElement.setAttribute("role", "alert");
  errorElement.textContent = message;

  field.parentNode.appendChild(errorElement);
}
```

### 3. Progressive Enhancement

```javascript
// Enhance forms that work without JavaScript
if (typeof FormData !== "undefined") {
  // Add JavaScript enhancements
  enhanceFormWithJS();
} else {
  // Fallback for older browsers
  useBasicFormSubmission();
}
```

## Self-Check Questions

1. What's the difference between the `input` and `change` events?
2. How do you prevent a form from submitting?
3. What are the benefits of client-side validation?
4. How do you handle multiple checkboxes as a group?
5. What's the proper way to show validation errors accessibly?

## Practice Exercises

1. Build a registration form with real-time validation
2. Create a survey form with conditional fields
3. Implement a form with file upload and progress indicator
4. Build a dynamic form builder interface
5. Create a multi-step form wizard

## Key Takeaways

- Always prevent default form submission when handling with JavaScript
- Provide immediate feedback for user interactions
- Use real-time validation to improve user experience
- Handle all types of form controls appropriately
- Make forms accessible with proper ARIA attributes
- Consider progressive enhancement for broader compatibility
