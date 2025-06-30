/**
 * Exercise 4-2: Enhanced Object Literals
 *
 * Practice modern object literal syntax and shorthand properties.
 */

console.log("Starting Exercise 4-2: Enhanced Object Literals");

// Variables for object creation
const name = "John Doe";
const age = 30;
const city = "New York";

// TODO: Create an object using property shorthand
const person = {
  // TODO: Use shorthand syntax for name, age, city

  // TODO: Add computed property names
  [`is${age}OrOlder`]: true,

  // TODO: Add method shorthand
  greet() {
    // TODO: Implement greeting method
  },

  // TODO: Add getter and setter
  get info() {
    // TODO: Return formatted person info
  },

  set location(newCity) {
    // TODO: Update city property
  }
};

// Computed property names example
const propertyName = "dynamicProp";
const value = "dynamicValue";

const dynamicObject = {
  // TODO: Use computed property name
  [propertyName]: value,
  ["computed" + "Property"]: "computed value"
};

console.log("Dynamic object:", dynamicObject);

// Method definitions and arrow functions in objects
const mathOperations = {
  // TODO: Traditional method
  add(a, b) {
    return a + b;
  },

  // TODO: Arrow function property (note: this won't have proper 'this' binding)
  multiply: (a, b) => a * b,

  // TODO: Method with complex logic
  calculate(operation, a, b) {
    switch (operation) {
      case "add":
        return this.add(a, b);
      case "multiply":
        return this.multiply(a, b);
      default:
        return 0;
    }
  }
};

console.log("Math operations test:");
console.log("Add:", mathOperations.add(5, 3));
console.log("Multiply:", mathOperations.multiply(4, 6));
console.log("Calculate add:", mathOperations.calculate("add", 10, 5));

// Object destructuring with enhanced literals
const coordinates = { x: 10, y: 20, z: 30 };
const color = "red";
const size = "large";

// TODO: Create an enhanced object that combines existing objects and new properties
const shape = {
  // TODO: Spread coordinates
  ...coordinates,

  // TODO: Add new properties with shorthand
  color,
  size,

  // TODO: Add computed properties
  [`${color}Shape`]: true,

  // TODO: Add methods
  getArea() {
    // TODO: Calculate area based on x and y
    return this.x * this.y;
  },

  getVolume() {
    // TODO: Calculate volume based on x, y, and z
    return this.x * this.y * this.z;
  },

  toString() {
    return `Shape: ${this.color} ${this.size} (${this.x}x${this.y}x${this.z})`;
  }
};

console.log("Shape object:", shape);
console.log("Shape area:", shape.getArea());
console.log("Shape volume:", shape.getVolume());
console.log("Shape string:", shape.toString());

// Advanced: Symbol properties
const secretProperty = Symbol("secret");
const advancedObject = {
  publicProperty: "visible",
  [secretProperty]: "hidden",

  getSecret() {
    return this[secretProperty];
  }
};

console.log("Advanced object:", advancedObject);
console.log("Secret value:", advancedObject.getSecret());

// Instructions:
// 1. Complete all TODO sections using enhanced object literal syntax
// 2. Test property shorthand, computed properties, and method definitions
// 3. Understand the difference between methods and arrow function properties
// 4. Practice object spreading and combining objects
// 5. Experiment with Symbol properties
