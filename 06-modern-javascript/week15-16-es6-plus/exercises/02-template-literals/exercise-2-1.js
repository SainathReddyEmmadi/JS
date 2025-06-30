/**
 * Exercise 2-1: Basic Template Literals
 *
 * Practice template literal syntax, expression interpolation, and multiline strings.
 */

console.log("Starting Exercise 2-1: Basic Template Literals");

// Basic interpolation
const name = "Alice";
const age = 30;
const city = "New York";

// TODO: Convert these string concatenations to template literals
const greeting1 = "Hello, " + name + "!";
const greeting2 = `Hello, ${name}!`;

const info1 = name + " is " + age + " years old and lives in " + city + ".";
const info2 = `${name} is ${age} years old and lives in ${city}.`;

console.log("Concatenation:", greeting1);
console.log("Template literal:", greeting2);
console.log("Info concatenation:", info1);
console.log("Info template:", info2);

// Expression evaluation in template literals
const price = 29.99;
const quantity = 3;
const tax = 0.08;

// TODO: Create a receipt using template literals with calculations
const receipt = `
Order Summary:
=============
Item price: $${price}
Quantity: ${quantity}
Subtotal: $${(price * quantity).toFixed(2)}
Tax (${tax * 100}%): $${(price * quantity * tax).toFixed(2)}
Total: $${(price * quantity * (1 + tax)).toFixed(2)}
`;

console.log(receipt);

// Multiline strings
const poem = `
Roses are red,
Violets are blue,
Template literals
Make coding easy too!
`;

console.log("Poem:", poem);

// TODO: Create a formatted email template
function createEmailTemplate(recipient, subject, body, sender) {
  return `
To: ${recipient}
From: ${sender}
Subject: ${subject}

Dear ${recipient.split("@")[0]},

${body}

Best regards,
${sender}
    `.trim();
}

const email = createEmailTemplate(
  "john@example.com",
  "Welcome to our service!",
  "Thank you for signing up. We're excited to have you on board.",
  "support@company.com"
);

console.log("Email template:");
console.log(email);

// Conditional content in templates
const user = {
  name: "Bob",
  isPremium: true,
  loginCount: 5
};

// TODO: Create dynamic messages based on user properties
const welcomeMessage = `
Welcome back, ${user.name}!
${
  user.isPremium
    ? "Thank you for being a premium member!"
    : "Consider upgrading to premium!"
}
You have logged in ${user.loginCount} time${user.loginCount === 1 ? "" : "s"}.
`;

console.log("Welcome message:", welcomeMessage);

// Array interpolation
const fruits = ["apple", "banana", "orange"];
const colors = ["red", "green", "blue"];

// TODO: Create formatted lists using template literals
const fruitList = `
Available fruits:
${fruits.map((fruit) => `• ${fruit}`).join("\n")}
`;

const colorTable = `
Color Options:
${colors.map((color, index) => `${index + 1}. ${color}`).join("\n")}
`;

console.log(fruitList);
console.log(colorTable);

// Function calls in template literals
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(amount);
}

function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

const order = {
  id: "ORD-12345",
  amount: 99.99,
  date: new Date(),
  status: "shipped"
};

// TODO: Create an order confirmation using function calls in template literals
const orderConfirmation = `
Order Confirmation
==================
Order ID: ${order.id}
Amount: ${formatCurrency(order.amount)}
Date: ${formatDate(order.date)}
Status: ${order.status.toUpperCase()}

Thank you for your purchase!
`;

console.log("Order confirmation:", orderConfirmation);

// Nested template literals
const products = [
  { name: "Laptop", price: 999.99, category: "Electronics" },
  { name: "Book", price: 19.99, category: "Education" },
  { name: "Coffee Mug", price: 12.99, category: "Kitchen" }
];

// TODO: Create a product catalog with nested templates
const catalog = `
Product Catalog
===============
${products
  .map(
    (product) => `
Product: ${product.name}
Category: ${product.category}
Price: ${formatCurrency(product.price)}
${product.price > 50 ? "FREE SHIPPING!" : "Shipping: $5.99"}
---
`
  )
  .join("")}
`;

console.log("Product catalog:", catalog);

// Error handling in template literals
function safeFormat(value, formatter) {
  try {
    return formatter(value);
  } catch (error) {
    return `[Error: ${error.message}]`;
  }
}

const userData = {
  name: "Charlie",
  invalidDate: "not-a-date",
  salary: null
};

// TODO: Create safe template with error handling
const userProfile = `
User Profile
============
Name: ${userData.name}
Date: ${safeFormat(userData.invalidDate, (date) =>
  new Date(date).toISOString()
)}
Salary: ${safeFormat(userData.salary, (amount) => formatCurrency(amount))}
`;

console.log("User profile with error handling:", userProfile);

// Instructions:
// 1. Practice converting string concatenation to template literals
// 2. Use expressions and function calls within ${}
// 3. Create multiline strings without escape characters
// 4. Build dynamic content based on conditions
// 5. Format arrays and objects within template literals
// 6. Handle errors gracefully in template expressions
// 7. Practice nested template literals for complex formatting
