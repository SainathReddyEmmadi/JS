# Functional Programming Exercises

## Overview

This directory contains comprehensive exercises for mastering functional programming concepts in JavaScript. Each exercise is designed to reinforce the theory learned in the corresponding lessons.

## Exercise Structure

### Week 13-14: Functional Programming Fundamentals

#### 01. Function Fundamentals

- **01-function-types.js** - Practice different function declaration styles
- **02-first-class-functions.js** - Functions as values, arguments, and return values
- **03-iife-patterns.js** - Immediately Invoked Function Expressions
- **04-function-factories.js** - Creating functions that return functions

#### 02. Higher-Order Functions

- **05-array-hofs.js** - Built-in higher-order functions (map, filter, reduce)
- **06-custom-hofs.js** - Creating your own higher-order functions
- **07-function-decorators.js** - Function decoration patterns
- **08-combinators.js** - Function combinators and utilities

#### 03. Closures and Practical Applications

- **09-closure-basics.js** - Understanding closure mechanics
- **10-module-pattern.js** - Module pattern with closures
- **11-event-handlers.js** - Closures in event handling
- **12-memoization.js** - Implementing memoization with closures

#### 04. Pure Functions and Immutability

- **13-pure-functions.js** - Writing and identifying pure functions
- **14-immutable-updates.js** - Immutable data structure updates
- **15-side-effects.js** - Managing and avoiding side effects
- **16-testing-pure-functions.js** - Testing strategies for pure functions

#### 05. Functional Array Methods

- **17-map-filter-reduce.js** - Mastering basic array methods
- **18-method-chaining.js** - Chaining array operations
- **19-custom-array-utils.js** - Building custom array utilities
- **20-async-array-processing.js** - Async operations with arrays

#### 06. Currying and Composition

- **21-basic-currying.js** - Understanding currying fundamentals
- **22-partial-application.js** - Partial application techniques
- **23-function-composition.js** - Composing functions effectively
- **24-real-world-currying.js** - Practical currying applications

#### 07. Functional Patterns

- **25-maybe-pattern.js** - Maybe/Option pattern implementation
- **26-either-pattern.js** - Either pattern for error handling
- **27-validation-pattern.js** - Validation with error accumulation
- **28-lens-pattern.js** - Lens pattern for data manipulation

## Exercise Guidelines

### Difficulty Levels

- 🟢 **Beginner**: Basic concept application
- 🟡 **Intermediate**: Combining multiple concepts
- 🔴 **Advanced**: Complex real-world scenarios

### How to Use These Exercises

1. **Read the Theory First**: Complete the corresponding theory file before attempting exercises
2. **Start Simple**: Begin with beginner exercises and progress gradually
3. **Test Your Solutions**: Each exercise includes test cases to verify correctness
4. **Understand, Don't Memorize**: Focus on understanding the underlying concepts
5. **Experiment**: Try different approaches to solve the same problem

### Running the Exercises

```bash
# Navigate to the exercises directory
cd exercises

# Run a specific exercise
node 01-function-types.js

# Run all exercises (if you have a test runner setup)
npm test
```

### Common Patterns You'll Practice

1. **Function Composition**: Building complex operations from simple functions
2. **Data Transformation**: Converting data using functional techniques
3. **Error Handling**: Managing errors functionally without exceptions
4. **State Management**: Handling state immutably
5. **Async Operations**: Functional approaches to asynchronous code

### Tips for Success

- **Think in Terms of Transformations**: View problems as data transformations
- **Start with Pure Functions**: Always prefer pure functions when possible
- **Use Immutable Data**: Avoid mutating existing data structures
- **Compose Small Functions**: Build complexity through composition
- **Test Incrementally**: Test each function in isolation

### Additional Resources

- **MDN Array Methods**: [Array.prototype methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
- **Functional Programming Guide**: [Professor Frisby's Mostly Adequate Guide](https://mostly-adequate.gitbooks.io/mostly-adequate-guide/)
- **Practice Platform**: [Codewars Functional Programming](https://www.codewars.com/)

### Getting Help

If you're stuck on an exercise:

1. Review the theory material again
2. Break the problem into smaller parts
3. Start with the simplest possible solution
4. Look at the test cases for hints about expected behavior
5. Don't hesitate to research functional programming concepts online

### Progress Tracking

Track your progress through the exercises:

- [ ] Function Fundamentals (01-04)
- [ ] Higher-Order Functions (05-08)
- [ ] Closures (09-12)
- [ ] Pure Functions & Immutability (13-16)
- [ ] Array Methods (17-20)
- [ ] Currying & Composition (21-24)
- [ ] Functional Patterns (25-28)

---

Happy coding! Remember, functional programming is a different way of thinking about problems. Be patient with yourself as you develop this new mindset.
