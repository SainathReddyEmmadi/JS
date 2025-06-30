/**
 * Exercise 4-3: Advanced Object Patterns and Proxy
 *
 * Explore advanced object manipulation patterns and Proxy objects.
 */

console.log("Starting Exercise 4-3: Advanced Object Patterns and Proxy");

// Object.assign and object merging
const defaults = {
  theme: "light",
  language: "en",
  notifications: true
};

const userPreferences = {
  theme: "dark",
  fontSize: 14
};

// TODO: Merge objects using Object.assign
const settings = Object.assign({}, defaults, userPreferences);
console.log("Merged settings:", settings);

// TODO: Use spread operator for object merging
const settingsSpread = {
  ...defaults,
  ...userPreferences,
  // TODO: Add additional properties
  lastModified: new Date()
};
console.log("Settings with spread:", settingsSpread);

// Object property descriptors
const configurableObject = {};

// TODO: Define properties with descriptors
Object.defineProperty(configurableObject, "readOnlyProp", {
  value: "Cannot change this",
  writable: false,
  enumerable: true,
  configurable: false
});

Object.defineProperty(configurableObject, "hiddenProp", {
  value: "Not enumerable",
  writable: true,
  enumerable: false,
  configurable: true
});

console.log("Configurable object:", configurableObject);
console.log("Keys:", Object.keys(configurableObject));

// Proxy object for advanced behavior
const targetObject = {
  name: "Alice",
  age: 25
};

// TODO: Create a proxy with custom behavior
const proxyObject = new Proxy(targetObject, {
  get(target, property) {
    console.log(`Getting property: ${property}`);

    // TODO: Add custom behavior for specific properties
    if (property === "age") {
      return `${target[property]} years old`;
    }

    return target[property];
  },

  set(target, property, value) {
    console.log(`Setting ${property} to ${value}`);

    // TODO: Add validation
    if (property === "age" && (typeof value !== "number" || value < 0)) {
      throw new Error("Age must be a positive number");
    }

    target[property] = value;
    return true;
  },

  has(target, property) {
    console.log(`Checking if property ${property} exists`);
    return property in target;
  }
});

console.log("\nProxy demonstrations:");
console.log("Name:", proxyObject.name);
console.log("Age:", proxyObject.age);
console.log("Has name:", "name" in proxyObject);

// TODO: Try setting values through proxy
try {
  proxyObject.age = 30;
  console.log("Updated age:", proxyObject.age);

  // This should throw an error
  // proxyObject.age = -5;
} catch (error) {
  console.log("Error:", error.message);
}

// Advanced: Creating a validation proxy
function createValidatedObject(schema) {
  return new Proxy(
    {},
    {
      set(target, property, value) {
        const validator = schema[property];

        if (validator && !validator(value)) {
          throw new Error(`Invalid value for ${property}: ${value}`);
        }

        target[property] = value;
        return true;
      }
    }
  );
}

// TODO: Create a user object with validation
const userSchema = {
  name: (value) => typeof value === "string" && value.length > 0,
  email: (value) => typeof value === "string" && value.includes("@"),
  age: (value) => typeof value === "number" && value >= 0 && value <= 150
};

const validatedUser = createValidatedObject(userSchema);

try {
  validatedUser.name = "John Doe";
  validatedUser.email = "john@example.com";
  validatedUser.age = 30;

  console.log("Validated user:", validatedUser);

  // TODO: Try invalid values
  // validatedUser.age = -5; // Should throw error
  // validatedUser.email = 'invalid-email'; // Should throw error
} catch (error) {
  console.log("Validation error:", error.message);
}

// Object freezing and sealing
const mutableObject = { a: 1, b: 2 };
const frozenObject = Object.freeze({ ...mutableObject });
const sealedObject = Object.seal({ ...mutableObject });

console.log("\nObject immutability:");
console.log("Original:", mutableObject);

// TODO: Try modifying each object type
try {
  mutableObject.c = 3; // Should work
  console.log("Mutable after modification:", mutableObject);

  frozenObject.c = 3; // Should not work
  console.log("Frozen after modification:", frozenObject);

  sealedObject.a = 10; // Should work (existing property)
  sealedObject.c = 3; // Should not work (new property)
  console.log("Sealed after modification:", sealedObject);
} catch (error) {
  console.log("Modification error:", error.message);
}

// Instructions:
// 1. Complete all TODO sections and test the object merging patterns
// 2. Experiment with property descriptors and their effects
// 3. Create and test proxy objects with custom behavior
// 4. Implement the validation proxy and test with valid/invalid data
// 5. Understand the differences between frozen, sealed, and mutable objects
