/**
 * Exercise 27: Validation Pattern
 *
 * Implement functional validation patterns that accumulate errors
 * instead of failing fast. This pattern is useful for form validation,
 * data processing, and API input validation.
 *
 * Difficulty: 🟡 Intermediate to 🔴 Advanced
 */

// ==========================================
// EXERCISE 1: Basic Validation Result Type
// ==========================================

/**
 * TODO: Create a Validation result type that can be either Success or Failure
 */

class ValidationResult {
  constructor(isSuccess, value, errors = []) {
    this.isSuccess = isSuccess;
    this.value = value;
    this.errors = errors;
  }

  // TODO: Create success result
  static success(value) {
    return new ValidationResult(true, value, []);
  }

  // TODO: Create failure result
  static failure(errors) {
    const errorArray = Array.isArray(errors) ? errors : [errors];
    return new ValidationResult(false, null, errorArray);
  }

  // TODO: Map over successful value
  map(fn) {
    if (this.isSuccess) {
      try {
        return ValidationResult.success(fn(this.value));
      } catch (error) {
        return ValidationResult.failure([error.message]);
      }
    }
    return this;
  }

  // TODO: Apply function in validation context
  apply(validationFn) {
    if (!this.isSuccess) {
      return this;
    }

    const result = validationFn(this.value);
    if (result.isSuccess) {
      return result;
    } else {
      return ValidationResult.failure([...this.errors, ...result.errors]);
    }
  }

  // TODO: Combine multiple validation results
  static combine(...validations) {
    const failures = validations.filter((v) => !v.isSuccess);

    if (failures.length > 0) {
      const allErrors = failures.reduce((acc, v) => [...acc, ...v.errors], []);
      return ValidationResult.failure(allErrors);
    }

    const values = validations.map((v) => v.value);
    return ValidationResult.success(values);
  }

  // TODO: Get value or throw errors
  get() {
    if (this.isSuccess) {
      return this.value;
    }
    throw new Error(`Validation failed: ${this.errors.join(", ")}`);
  }

  // TODO: Get value or default
  getOrElse(defaultValue) {
    return this.isSuccess ? this.value : defaultValue;
  }
}

// ==========================================
// EXERCISE 2: Basic Validation Functions
// ==========================================

/**
 * TODO: Create basic validation functions that return ValidationResult
 */

// TODO: Required field validation
const required = (fieldName) => (value) => {
  if (value === null || value === undefined || value === "") {
    return ValidationResult.failure([`${fieldName} is required`]);
  }
  return ValidationResult.success(value);
};

// TODO: String length validation
const minLength = (min, fieldName) => (value) => {
  if (typeof value !== "string" || value.length < min) {
    return ValidationResult.failure([
      `${fieldName} must be at least ${min} characters long`
    ]);
  }
  return ValidationResult.success(value);
};

const maxLength = (max, fieldName) => (value) => {
  if (typeof value !== "string" || value.length > max) {
    return ValidationResult.failure([
      `${fieldName} must be no more than ${max} characters long`
    ]);
  }
  return ValidationResult.success(value);
};

// TODO: Pattern validation
const pattern = (regex, fieldName, message) => (value) => {
  if (typeof value !== "string" || !regex.test(value)) {
    return ValidationResult.failure([
      message || `${fieldName} format is invalid`
    ]);
  }
  return ValidationResult.success(value);
};

// TODO: Email validation
const email = (fieldName) =>
  pattern(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    fieldName,
    `${fieldName} must be a valid email address`
  );

// TODO: Number validation
const isNumber = (fieldName) => (value) => {
  const num = Number(value);
  if (isNaN(num)) {
    return ValidationResult.failure([`${fieldName} must be a valid number`]);
  }
  return ValidationResult.success(num);
};

// TODO: Range validation
const range = (min, max, fieldName) => (value) => {
  const num = Number(value);
  if (isNaN(num) || num < min || num > max) {
    return ValidationResult.failure([
      `${fieldName} must be between ${min} and ${max}`
    ]);
  }
  return ValidationResult.success(num);
};

// TODO: Custom validation
const custom = (validationFn, fieldName, message) => (value) => {
  try {
    if (validationFn(value)) {
      return ValidationResult.success(value);
    } else {
      return ValidationResult.failure([message || `${fieldName} is invalid`]);
    }
  } catch (error) {
    return ValidationResult.failure([
      `${fieldName} validation error: ${error.message}`
    ]);
  }
};

// ==========================================
// EXERCISE 3: Validation Combinators
// ==========================================

/**
 * TODO: Create validation combinators for complex validation logic
 */

// TODO: Combine multiple validations for a single field (all must pass)
const all =
  (...validations) =>
  (value) => {
    const results = validations.map((validation) => validation(value));
    const failures = results.filter((r) => !r.isSuccess);

    if (failures.length > 0) {
      const allErrors = failures.reduce((acc, r) => [...acc, ...r.errors], []);
      return ValidationResult.failure(allErrors);
    }

    return ValidationResult.success(value);
  };

// TODO: Any validation must pass (at least one must succeed)
const any =
  (...validations) =>
  (value) => {
    const results = validations.map((validation) => validation(value));
    const successes = results.filter((r) => r.isSuccess);

    if (successes.length > 0) {
      return ValidationResult.success(value);
    }

    const allErrors = results.reduce((acc, r) => [...acc, ...r.errors], []);
    return ValidationResult.failure(allErrors);
  };

// TODO: Optional field validation (only validate if value exists)
const optional = (validation) => (value) => {
  if (value === null || value === undefined || value === "") {
    return ValidationResult.success(value);
  }
  return validation(value);
};

// TODO: Conditional validation
const when = (condition, validation) => (value) => {
  if (condition(value)) {
    return validation(value);
  }
  return ValidationResult.success(value);
};

// ==========================================
// EXERCISE 4: Object Validation
// ==========================================

/**
 * TODO: Create object validation functions
 */

// TODO: Validate object field
const field = (fieldName, validation) => (obj) => {
  const value = obj[fieldName];
  const result = validation(value);

  if (result.isSuccess) {
    return ValidationResult.success({ [fieldName]: result.value });
  } else {
    return ValidationResult.failure(result.errors);
  }
};

// TODO: Validate multiple object fields
const object = (fieldValidations) => (obj) => {
  const results = Object.entries(fieldValidations).map(
    ([fieldName, validation]) => {
      return field(fieldName, validation)(obj);
    }
  );

  const failures = results.filter((r) => !r.isSuccess);

  if (failures.length > 0) {
    const allErrors = failures.reduce((acc, r) => [...acc, ...r.errors], []);
    return ValidationResult.failure(allErrors);
  }

  const validatedObject = results.reduce(
    (acc, r) => ({ ...acc, ...r.value }),
    {}
  );
  return ValidationResult.success(validatedObject);
};

// TODO: Validate nested objects
const nested = (fieldName, objectValidation) => (obj) => {
  const nestedObj = obj[fieldName];
  if (!nestedObj || typeof nestedObj !== "object") {
    return ValidationResult.failure([`${fieldName} must be an object`]);
  }

  const result = objectValidation(nestedObj);
  if (result.isSuccess) {
    return ValidationResult.success({ [fieldName]: result.value });
  } else {
    const prefixedErrors = result.errors.map(
      (error) => `${fieldName}.${error}`
    );
    return ValidationResult.failure(prefixedErrors);
  }
};

// ==========================================
// EXERCISE 5: Array Validation
// ==========================================

/**
 * TODO: Create array validation functions
 */

// TODO: Validate array elements
const arrayOf = (elementValidation) => (fieldName) => (value) => {
  if (!Array.isArray(value)) {
    return ValidationResult.failure([`${fieldName} must be an array`]);
  }

  const results = value.map((item, index) => {
    const result = elementValidation(item);
    if (!result.isSuccess) {
      const prefixedErrors = result.errors.map(
        (error) => `${fieldName}[${index}]: ${error}`
      );
      return ValidationResult.failure(prefixedErrors);
    }
    return result;
  });

  const failures = results.filter((r) => !r.isSuccess);

  if (failures.length > 0) {
    const allErrors = failures.reduce((acc, r) => [...acc, ...r.errors], []);
    return ValidationResult.failure(allErrors);
  }

  const validatedArray = results.map((r) => r.value);
  return ValidationResult.success(validatedArray);
};

// TODO: Validate array length
const arrayLength = (min, max, fieldName) => (value) => {
  if (!Array.isArray(value)) {
    return ValidationResult.failure([`${fieldName} must be an array`]);
  }

  if (value.length < min || value.length > max) {
    return ValidationResult.failure([
      `${fieldName} must have between ${min} and ${max} items`
    ]);
  }

  return ValidationResult.success(value);
};

// TODO: Validate non-empty array
const nonEmptyArray = (fieldName) => (value) => {
  if (!Array.isArray(value) || value.length === 0) {
    return ValidationResult.failure([`${fieldName} must be a non-empty array`]);
  }
  return ValidationResult.success(value);
};

// ==========================================
// EXERCISE 6: Real-world Examples
// ==========================================

/**
 * TODO: Create real-world validation examples
 */

// TODO: User registration validation
const validateUserRegistration = object({
  username: all(
    required("Username"),
    minLength(3, "Username"),
    maxLength(20, "Username"),
    pattern(
      /^[a-zA-Z0-9_]+$/,
      "Username",
      "Username can only contain letters, numbers, and underscores"
    )
  ),
  email: all(required("Email"), email("Email")),
  password: all(
    required("Password"),
    minLength(8, "Password"),
    custom(
      (value) => /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value),
      "Password",
      "Password must contain at least one lowercase letter, one uppercase letter, and one digit"
    )
  ),
  confirmPassword: custom(
    (value, obj) => value === obj.password,
    "Confirm Password",
    "Passwords do not match"
  ),
  age: all(required("Age"), isNumber("Age"), range(13, 120, "Age")),
  terms: custom(
    (value) => value === true,
    "Terms",
    "You must accept the terms and conditions"
  )
});

// TODO: Product validation
const validateProduct = object({
  name: all(
    required("Product Name"),
    minLength(2, "Product Name"),
    maxLength(100, "Product Name")
  ),
  description: all(
    required("Description"),
    minLength(10, "Description"),
    maxLength(1000, "Description")
  ),
  price: all(
    required("Price"),
    isNumber("Price"),
    custom((value) => value > 0, "Price", "Price must be positive")
  ),
  category: all(
    required("Category"),
    custom(
      (value) => ["electronics", "clothing", "books", "home"].includes(value),
      "Category",
      "Category must be one of: electronics, clothing, books, home"
    )
  ),
  tags: optional(
    all(
      arrayOf(all(required("Tag"), minLength(2, "Tag"), maxLength(20, "Tag")))(
        "Tags"
      ),
      arrayLength(0, 10, "Tags")
    )
  ),
  specifications: optional(
    object({
      weight: optional(
        all(
          isNumber("Weight"),
          custom((value) => value > 0, "Weight", "Weight must be positive")
        )
      ),
      dimensions: optional(
        object({
          width: all(
            isNumber("Width"),
            custom((value) => value > 0, "Width", "Width must be positive")
          ),
          height: all(
            isNumber("Height"),
            custom((value) => value > 0, "Height", "Height must be positive")
          ),
          depth: all(
            isNumber("Depth"),
            custom((value) => value > 0, "Depth", "Depth must be positive")
          )
        })
      )
    })
  )
});

// TODO: Order validation
const validateOrder = object({
  customerId: all(
    required("Customer ID"),
    isNumber("Customer ID"),
    custom((value) => value > 0, "Customer ID", "Customer ID must be positive")
  ),
  items: all(
    required("Items"),
    nonEmptyArray("Items"),
    arrayOf(
      object({
        productId: all(
          required("Product ID"),
          isNumber("Product ID"),
          custom(
            (value) => value > 0,
            "Product ID",
            "Product ID must be positive"
          )
        ),
        quantity: all(
          required("Quantity"),
          isNumber("Quantity"),
          custom((value) => value > 0, "Quantity", "Quantity must be positive"),
          custom(
            (value) => Number.isInteger(value),
            "Quantity",
            "Quantity must be a whole number"
          )
        ),
        price: all(
          required("Price"),
          isNumber("Price"),
          custom((value) => value > 0, "Price", "Price must be positive")
        )
      })
    )("Items")
  ),
  shippingAddress: object({
    street: all(
      required("Street"),
      minLength(5, "Street"),
      maxLength(100, "Street")
    ),
    city: all(required("City"), minLength(2, "City"), maxLength(50, "City")),
    state: all(
      required("State"),
      minLength(2, "State"),
      maxLength(50, "State")
    ),
    zipCode: all(
      required("Zip Code"),
      pattern(
        /^\d{5}(-\d{4})?$/,
        "Zip Code",
        "Zip Code must be in format 12345 or 12345-6789"
      )
    ),
    country: all(
      required("Country"),
      minLength(2, "Country"),
      maxLength(50, "Country")
    )
  }),
  paymentMethod: all(
    required("Payment Method"),
    custom(
      (value) =>
        ["credit_card", "debit_card", "paypal", "bank_transfer"].includes(
          value
        ),
      "Payment Method",
      "Payment Method must be one of: credit_card, debit_card, paypal, bank_transfer"
    )
  )
});

// ==========================================
// EXERCISE 7: Validation Middleware
// ==========================================

/**
 * TODO: Create validation middleware for different contexts
 */

// TODO: Express.js validation middleware
const createValidationMiddleware = (validator) => (req, res, next) => {
  const result = validator(req.body);

  if (result.isSuccess) {
    req.validatedData = result.value;
    next();
  } else {
    res.status(400).json({
      error: "Validation failed",
      details: result.errors
    });
  }
};

// TODO: Form validation helper
const createFormValidator = (validator) => (formData) => {
  const result = validator(formData);

  return {
    isValid: result.isSuccess,
    data: result.value,
    errors: result.errors,
    getFieldErrors: (fieldName) => {
      return result.errors.filter((error) => error.startsWith(fieldName));
    }
  };
};

// TODO: Async validation (for database checks, etc.)
const createAsyncValidator =
  (syncValidator, asyncChecks = []) =>
  async (data) => {
    // First run synchronous validation
    const syncResult = syncValidator(data);
    if (!syncResult.isSuccess) {
      return syncResult;
    }

    // Then run asynchronous checks
    const asyncResults = await Promise.all(
      asyncChecks.map((check) => check(syncResult.value))
    );

    const asyncErrors = asyncResults
      .filter((result) => !result.isSuccess)
      .reduce((acc, result) => [...acc, ...result.errors], []);

    if (asyncErrors.length > 0) {
      return ValidationResult.failure([...syncResult.errors, ...asyncErrors]);
    }

    return syncResult;
  };

// ==========================================
// EXERCISE 8: Testing the Validation System
// ==========================================

/**
 * TODO: Test all validation functions
 */

// Test data
const validUser = {
  username: "alice_123",
  email: "alice@example.com",
  password: "SecurePass123",
  confirmPassword: "SecurePass123",
  age: 25,
  terms: true
};

const invalidUser = {
  username: "al", // Too short
  email: "invalid-email", // Invalid format
  password: "123", // Too short, no uppercase/lowercase
  confirmPassword: "different", // Doesn't match
  age: "not-a-number", // Invalid number
  terms: false // Not accepted
};

const validProduct = {
  name: "Wireless Headphones",
  description: "High-quality wireless headphones with noise cancellation",
  price: 99.99,
  category: "electronics",
  tags: ["wireless", "audio", "headphones"],
  specifications: {
    weight: 0.25,
    dimensions: {
      width: 15,
      height: 18,
      depth: 8
    }
  }
};

// TODO: Run tests
function runValidationTests() {
  console.log("Running validation tests...");

  // Test valid user
  const validUserResult = validateUserRegistration(validUser);
  console.log("Valid user result:", validUserResult);

  // Test invalid user
  const invalidUserResult = validateUserRegistration(invalidUser);
  console.log("Invalid user result:", invalidUserResult);

  // Test valid product
  const validProductResult = validateProduct(validProduct);
  console.log("Valid product result:", validProductResult);

  console.log("Validation tests completed!");
}

// TODO: Uncomment to run tests
// runValidationTests();

console.log("Validation Pattern exercises loaded. Implement the TODOs above!");
