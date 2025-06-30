/**
 * Exercise 3-2: Default Exports and Mixed Imports
 *
 * Practice default exports, mixed imports, and namespace imports.
 */

// TODO: Create a User class and export it as default
// The User class should have:
// - constructor(name, email)
// - getName() method
// - getEmail() method
// - setEmail(newEmail) method

class User {
  // TODO: Implement the User class
}

// TODO: Export User as default and also export some utility functions
// export default User;
// export const validateEmail = (email) => { /* implementation */ };
// export const formatName = (name) => { /* implementation */ };

// TODO: In another file, practice different import styles:
// import User from './userModule.js';
// import User, { validateEmail, formatName } from './userModule.js';
// import * as UserModule from './userModule.js';

console.log("Starting Exercise 3-2: Default Exports and Mixed Imports");

// Example usage (uncomment once implemented):
/*
const user = new User('John Doe', 'john@example.com');
console.log('User name:', user.getName());
console.log('User email:', user.getEmail());

user.setEmail('john.doe@example.com');
console.log('Updated email:', user.getEmail());
*/

// Instructions:
// 1. Complete the User class implementation
// 2. Add validateEmail and formatName utility functions
// 3. Practice different import/export patterns
// 4. Test the functionality

export {};
