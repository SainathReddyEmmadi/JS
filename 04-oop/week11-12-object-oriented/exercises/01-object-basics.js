/**
 * Exercise 1: Object Creation and Manipulation
 *
 * Learn the fundamentals of working with objects in JavaScript
 */

console.log("=== Exercise 1: Object Creation and Manipulation ===\n");

// PART 1: Basic Object Creation
console.log("PART 1: Basic Object Creation");

/*
 * TODO 1.1: Create a person object with the following properties:
 * - name: "John Doe"
 * - age: 30
 * - city: "New York"
 * - email: "john@example.com"
 */

// Your code here:
const person = {
    // Add properties here
};

console.log("Person object:", person);

/*
 * TODO 1.2: Add a method called 'introduce' to the person object
 * that returns a string: "Hi, I'm [name] and I'm [age] years old."
 */

// Your code here:


console.log("Introduction:", person.introduce());

// PART 2: Object Property Manipulation
console.log("\nPART 2: Object Property Manipulation");

/*
 * TODO 2.1: Create a car object and demonstrate different ways to access properties
 */

const car = {
    brand: "Toyota",
    model: "Camry",
    year: 2022,
    "fuel-type": "Gasoline"
};

// Access properties using dot notation
console.log("Brand (dot notation):", /* Your code here */);

// Access properties using bracket notation
console.log("Model (bracket notation):", /* Your code here */);

// Access property with special characters
console.log("Fuel type:", /* Your code here */);

/*
 * TODO 2.2: Modify object properties
 */

// Change the year to 2023
// Your code here

// Add a new property 'color' with value 'Blue'
// Your code here

// Delete the 'fuel-type' property
// Your code here

console.log("Modified car:", car);

// PART 3: Object Methods and 'this' keyword
console.log("\nPART 3: Object Methods and 'this' keyword");

/*
 * TODO 3.1: Create a calculator object with methods
 */

const calculator = {
    result: 0,

    add: function(num) {
        // Your code here
        // Add num to result and return this for chaining
    },

    subtract: function(num) {
        // Your code here
        // Subtract num from result and return this for chaining
    },

    multiply: function(num) {
        // Your code here
        // Multiply result by num and return this for chaining
    },

    divide: function(num) {
        // Your code here
        // Divide result by num (check for division by zero) and return this for chaining
    },

    clear: function() {
        // Your code here
        // Reset result to 0 and return this for chaining
    },

    getResult: function() {
        // Your code here
        // Return the current result
    }
};

// Test method chaining
console.log("Calculator test:");
const result = calculator
    .clear()
    .add(10)
    .multiply(2)
    .subtract(5)
    .divide(3)
    .getResult();

console.log("Result:", result); // Should be 5

// PART 4: Object.keys(), Object.values(), Object.entries()
console.log("\nPART 4: Object Utility Methods");

const student = {
    name: "Alice Smith",
    grade: "A",
    subjects: ["Math", "Science", "English"],
    gpa: 3.8
};

/*
 * TODO 4.1: Use Object.keys() to get all property names
 */
const propertyNames = /* Your code here */;
console.log("Property names:", propertyNames);

/*
 * TODO 4.2: Use Object.values() to get all property values
 */
const propertyValues = /* Your code here */;
console.log("Property values:", propertyValues);

/*
 * TODO 4.3: Use Object.entries() to get key-value pairs
 */
const keyValuePairs = /* Your code here */;
console.log("Key-value pairs:", keyValuePairs);

/*
 * TODO 4.4: Iterate through the object using for...in loop
 */
console.log("Using for...in loop:");
// Your code here


// PART 5: Nested Objects
console.log("\nPART 5: Nested Objects");

/*
 * TODO 5.1: Create a company object with nested structure
 */

const company = {
    name: "TechCorp",
    founded: 2010,
    headquarters: {
        address: "123 Tech Street",
        city: "San Francisco",
        country: "USA"
    },
    departments: {
        engineering: {
            employees: 50,
            budget: 2000000
        },
        marketing: {
            employees: 20,
            budget: 800000
        },
        hr: {
            employees: 10,
            budget: 400000
        }
    }
};

/*
 * TODO 5.2: Access nested properties
 */
console.log("Company headquarters city:", /* Your code here */);
console.log("Engineering department employees:", /* Your code here */);

/*
 * TODO 5.3: Add a new department
 */
// Add a 'sales' department with 15 employees and 600000 budget
// Your code here

/*
 * TODO 5.4: Calculate total employees across all departments
 */
function getTotalEmployees(company) {
    // Your code here
    // Return the sum of employees in all departments
}

console.log("Total employees:", getTotalEmployees(company));

// PART 6: Object Copying and Comparison
console.log("\nPART 6: Object Copying and Comparison");

const original = {
    name: "Original",
    data: {
        numbers: [1, 2, 3],
        info: "test"
    }
};

/*
 * TODO 6.1: Create a shallow copy using Object.assign()
 */
const shallowCopy = /* Your code here */;

/*
 * TODO 6.2: Create a shallow copy using spread operator
 */
const spreadCopy = /* Your code here */;

/*
 * TODO 6.3: Create a deep copy using JSON methods
 */
const deepCopy = /* Your code here */;

// Test the copies
original.name = "Modified";
original.data.numbers.push(4);

console.log("Original:", original);
console.log("Shallow copy:", shallowCopy);
console.log("Spread copy:", spreadCopy);
console.log("Deep copy:", deepCopy);

/*
 * TODO 6.4: Compare objects
 */
function areObjectsEqual(obj1, obj2) {
    // Your code here
    // Implement a function to check if two objects are equal (shallow comparison)
}

console.log("Objects equal?", areObjectsEqual(shallowCopy, spreadCopy));

// BONUS CHALLENGES
console.log("\n=== BONUS CHALLENGES ===");

/*
 * BONUS 1: Create a function that merges multiple objects
 */
function mergeObjects(...objects) {
    // Your code here
    // Merge all objects into one, with later objects overriding earlier ones
}

const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const obj3 = { c: 5, d: 6 };

console.log("Merged objects:", mergeObjects(obj1, obj2, obj3));

/*
 * BONUS 2: Create a function that flattens nested objects
 */
function flattenObject(obj, prefix = '') {
    // Your code here
    // Convert nested object to flat object with dot notation keys
    // Example: {a: {b: {c: 1}}} becomes {'a.b.c': 1}
}

const nestedObj = {
    user: {
        personal: {
            name: "John",
            age: 30
        },
        preferences: {
            theme: "dark",
            language: "en"
        }
    },
    settings: {
        notifications: true
    }
};

console.log("Flattened object:", flattenObject(nestedObj));

/*
 * BONUS 3: Object property validation
 */
function validateObject(obj, schema) {
    // Your code here
    // Validate if object has all required properties and correct types
    // Schema format: { propertyName: 'expectedType' }
}

const userSchema = {
    name: 'string',
    age: 'number',
    email: 'string',
    isActive: 'boolean'
};

const validUser = {
    name: "Jane Doe",
    age: 25,
    email: "jane@example.com",
    isActive: true
};

const invalidUser = {
    name: "John",
    age: "thirty", // Wrong type
    email: "john@example.com"
    // Missing isActive
};

console.log("Valid user?", validateObject(validUser, userSchema));
console.log("Invalid user?", validateObject(invalidUser, userSchema));

console.log("\n=== Exercise 1 Complete! ===");

/*
 * SELF-CHECK QUESTIONS:
 * 1. What's the difference between dot notation and bracket notation?
 * 2. When would you use bracket notation over dot notation?
 * 3. What does the 'this' keyword refer to in object methods?
 * 4. What's the difference between Object.keys(), Object.values(), and Object.entries()?
 * 5. What's the difference between shallow and deep copying?
 * 6. How do you check if a property exists in an object?
 * 7. What are the different ways to iterate over object properties?
 */
