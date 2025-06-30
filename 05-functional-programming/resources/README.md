# Functional Programming Resources

## Essential Reading

### Books

- **"Functional-Light JavaScript" by Kyle Simpson**

  - Accessible introduction to FP in JavaScript
  - Focus on practical application
  - Available free online

- **"Professor Frisby's Mostly Adequate Guide to Functional Programming"**

  - Comprehensive FP guide for JavaScript
  - Covers advanced concepts like monads
  - Available free on GitHub

- **"Eloquent JavaScript" by Marijn Haverbeke (Chapters 5-6)**
  - Higher-order functions chapter
  - Objects and classes comparison

### Online Articles

- [Master the JavaScript Interview: What is Functional Programming?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-functional-programming-7f218c68b3a0)
- [Curry and Function Composition](https://medium.com/javascript-scene/curry-and-function-composition-2c208d774983)
- [Functors, Applicatives, And Monads In Pictures](http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html)

## Libraries and Tools

### Functional Programming Libraries

#### Ramda.js

```javascript
// Installation
npm install ramda

// Usage examples
import { map, filter, compose, curry } from 'ramda';

const users = [
  { name: 'John', age: 25, active: true },
  { name: 'Jane', age: 30, active: false }
];

const getActiveUserNames = compose(
  map(prop('name')),
  filter(prop('active'))
);

console.log(getActiveUserNames(users)); // ['John']
```

#### Lodash/FP

```javascript
// Installation
npm install lodash

// Usage
import { flow, map, filter } from 'lodash/fp';

const processUsers = flow(
  filter('active'),
  map('name')
);
```

#### Immutable.js

```javascript
// Installation
npm install immutable

// Usage
import { Map, List } from 'immutable';

const state = Map({
  users: List([
    Map({ id: 1, name: 'John' }),
    Map({ id: 2, name: 'Jane' })
  ])
});

const newState = state.updateIn(['users', 0, 'name'], () => 'Johnny');
```

### Development Tools

#### Functional Linting Rules

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    "prefer-const": "error",
    "no-var": "error",
    "no-param-reassign": "error",
    "prefer-arrow-callback": "error",
    "functional/no-let": "error",
    "functional/no-mutation": "error"
  }
};
```

## Practice Platforms

### Coding Challenges

- **Codewars**: Filter by "Functional Programming" tag
- **HackerRank**: Functional Programming section
- **Exercism**: JavaScript track with FP emphasis
- **LeetCode**: Filter problems solvable with FP

### Interactive Learning

- **freeCodeCamp**: Functional Programming section
- **JavaScript.info**: Advanced functions chapter
- **MDN Web Docs**: Functional programming guide

## Advanced Topics

### Category Theory for Programmers

- **Bartosz Milewski's Blog**: Category theory concepts
- **"Category Theory for Programmers" Book**: Mathematical foundations
- **YouTube Lectures**: Visual explanations

### Type Theory

- **"Types and Programming Languages"**: Academic reference
- **TypeScript Handbook**: Practical type applications
- **Flow Documentation**: Facebook's type checker

## Community and Discussion

### Forums and Communities

- **Reddit r/functionalprogramming**
- **Stack Overflow**: [functional-programming] tag
- **Discord**: Functional Programming servers
- **Twitter**: #functionalprogramming hashtag

### Conferences and Meetups

- **LambdaConf**: Functional programming conference
- **Strange Loop**: Programming languages and paradigms
- **Local JavaScript Meetups**: Many focus on FP

## Cheat Sheets

### Array Methods Quick Reference

```javascript
// Transformation
map(fn, array); // Transform each element
filter(fn, array); // Keep elements matching predicate
reduce(fn, init, array); // Reduce to single value

// Searching
find(fn, array); // First element matching predicate
some(fn, array); // At least one element matches
every(fn, array); // All elements match

// Utility
forEach(fn, array); // Side effects only
flatMap(fn, array); // Map then flatten
```

### Function Composition Patterns

```javascript
// Pipe (left to right)
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((acc, fn) => fn(acc), x);

// Compose (right to left)
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((acc, fn) => fn(acc), x);

// Curry
const curry =
  (fn) =>
  (...args) =>
    args.length >= fn.length
      ? fn(...args)
      : (...nextArgs) => curry(fn)(...args, ...nextArgs);
```

### Common Functional Patterns

```javascript
// Maybe Pattern
const Maybe = {
  of: (value) => ({
    map: (fn) => (value ? Maybe.of(fn(value)) : Maybe.nothing())
  }),
  nothing: () => ({ map: () => Maybe.nothing() })
};

// Either Pattern
const Either = {
  right: (value) => ({ map: (fn) => Either.right(fn(value)) }),
  left: (error) => ({ map: () => Either.left(error) })
};
```

## Interview Preparation

### Common FP Interview Questions

1. **What is functional programming?**

   - Programming paradigm based on function composition
   - Emphasizes immutability and pure functions
   - Avoids side effects and state mutation

2. **Explain pure functions**

   - Same input always produces same output
   - No side effects
   - Easier to test and reason about

3. **What is function composition?**

   - Combining simple functions to create complex operations
   - Enables reusability and modularity
   - Mathematical concept applied to programming

4. **Difference between map, filter, and reduce?**
   - Map: transforms each element
   - Filter: selects elements based on criteria
   - Reduce: combines elements into single value

### Coding Interview Practice

```javascript
// Common FP interview problems

// 1. Implement curry function
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...nextArgs) => curried(...args, ...nextArgs);
  };
}

// 2. Implement compose function
function compose(...fns) {
  return (x) => fns.reduceRight((acc, fn) => fn(acc), x);
}

// 3. Flatten nested arrays functionally
const flatten = (arr) =>
  arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val),
    []
  );
```

## Performance Considerations

### When to Use FP

- **Good for**: Data transformation, validation, configuration
- **Consider carefully**: Performance-critical loops, real-time systems
- **Optimize with**: Memoization, lazy evaluation, tail recursion

### Benchmarking FP Code

```javascript
// Simple benchmarking
function benchmark(name, fn) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name}: ${end - start}ms`);
}

// Compare functional vs imperative
benchmark("Functional", () => {
  data
    .map((x) => x * 2)
    .filter((x) => x > 10)
    .reduce((a, b) => a + b, 0);
});

benchmark("Imperative", () => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const doubled = data[i] * 2;
    if (doubled > 10) sum += doubled;
  }
  return sum;
});
```

## Next Steps

### After Completing This Module

1. **Practice Daily**: Solve one FP problem daily
2. **Read Advanced Material**: Category theory, type theory
3. **Contribute to Open Source**: FP libraries and tools
4. **Learn Other FP Languages**: Haskell, Clojure, F#
5. **Apply at Work**: Introduce FP concepts gradually

### Advanced JavaScript FP

- **Async Functional Programming**: Working with Promises/async-await
- **Reactive Programming**: RxJS and functional reactive programming
- **Parser Combinators**: Building parsers functionally
- **Domain-Specific Languages**: Creating DSLs with FP

### Functional Languages to Explore

- **Haskell**: Pure functional programming
- **Clojure**: Lisp dialect with immutable data structures
- **F#**: .NET functional language
- **Elm**: Functional frontend programming
- **PureScript**: Haskell-inspired JavaScript alternative

Remember: Functional programming is a journey, not a destination. Start with small changes and gradually adopt more FP concepts as you become comfortable with them.
