/**
 * Exercise 3-3: Module Re-exports and Barrel Exports
 *
 * Learn about re-exporting modules and creating index files.
 */

// TODO: Create multiple utility modules and practice re-exports
// Example structure:
// utils/
//   ├── index.js (barrel export file)
//   ├── stringUtils.js
//   ├── arrayUtils.js
//   └── dateUtils.js

// This file demonstrates how to use barrel exports

console.log("Starting Exercise 3-3: Module Re-exports and Barrel Exports");

// TODO: Create the following utility modules:

// stringUtils.js should export:
export const capitalize = (str) => {
  // TODO: Implement capitalize function
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const reverseString = (str) => {
  // TODO: Implement reverse function
  return str.split("").reverse().join("");
};

// arrayUtils.js should export:
export const removeDuplicates = (arr) => {
  // TODO: Implement remove duplicates function
  return [...new Set(arr)];
};

export const shuffleArray = (arr) => {
  // TODO: Implement array shuffle function
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// dateUtils.js should export:
export const formatDate = (date) => {
  // TODO: Implement date formatting
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

export const addDays = (date, days) => {
  // TODO: Implement add days function
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// TODO: Create an index.js file that re-exports all utilities
// export * from './stringUtils.js';
// export * from './arrayUtils.js';
// export * from './dateUtils.js';

// Example usage:
console.log("Capitalize test:", capitalize("hello world"));
console.log("Reverse string:", reverseString("hello"));
console.log("Remove duplicates:", removeDuplicates([1, 2, 2, 3, 3, 4]));
console.log("Format date:", formatDate(new Date()));

// Instructions:
// 1. Create separate utility files as described above
// 2. Create an index.js barrel export file
// 3. Practice importing from the barrel export
// 4. Test all utility functions

export {};
