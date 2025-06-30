# Functional Programming Patterns

## Learning Objectives

- Master essential functional programming patterns
- Understand monads, functors, and applicatives
- Learn error handling in functional style
- Apply functional patterns to real-world scenarios
- Build robust applications using functional techniques

## Maybe/Option Pattern

The Maybe pattern represents values that might be null or undefined, allowing for safe chaining of operations.

### Basic Maybe Implementation

```javascript
class Maybe {
  constructor(value) {
    this.value = value;
  }

  static of(value) {
    return new Maybe(value);
  }

  static nothing() {
    return new Maybe(null);
  }

  isNothing() {
    return this.value === null || this.value === undefined;
  }

  map(fn) {
    return this.isNothing() ? Maybe.nothing() : Maybe.of(fn(this.value));
  }

  flatMap(fn) {
    return this.isNothing() ? Maybe.nothing() : fn(this.value);
  }

  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this.value;
  }

  filter(predicate) {
    return this.isNothing() || !predicate(this.value) ? Maybe.nothing() : this;
  }
}

// Usage example
const users = [
  { id: 1, name: "John", email: "john@example.com" },
  { id: 2, name: "Jane", email: null }
];

function findUser(id) {
  const user = users.find((u) => u.id === id);
  return user ? Maybe.of(user) : Maybe.nothing();
}

// Safe chaining without null checks
const result = findUser(1)
  .map((user) => user.email)
  .map((email) => email.toUpperCase())
  .filter((email) => email.includes("@"))
  .getOrElse("No email found");

console.log(result); // "JOHN@EXAMPLE.COM"

const result2 = findUser(2)
  .map((user) => user.email)
  .map((email) => email.toUpperCase()) // Won't execute due to null email
  .getOrElse("No email found");

console.log(result2); // "No email found"
```

## Either Pattern (Result/Error Handling)

The Either pattern represents values that can be either a success (Right) or an error (Left).

```javascript
class Either {
  constructor(value, isLeft = false) {
    this.value = value;
    this.isLeft = isLeft;
  }

  static left(value) {
    return new Either(value, true);
  }

  static right(value) {
    return new Either(value, false);
  }

  map(fn) {
    return this.isLeft ? this : Either.right(fn(this.value));
  }

  flatMap(fn) {
    return this.isLeft ? this : fn(this.value);
  }

  mapLeft(fn) {
    return this.isLeft ? Either.left(fn(this.value)) : this;
  }

  fold(leftFn, rightFn) {
    return this.isLeft ? leftFn(this.value) : rightFn(this.value);
  }

  getOrElse(defaultValue) {
    return this.isLeft ? defaultValue : this.value;
  }
}

// Safe division function
function safeDivide(a, b) {
  return b === 0 ? Either.left("Division by zero") : Either.right(a / b);
}

// Safe parsing
function safeParseInt(str) {
  const num = parseInt(str, 10);
  return isNaN(num)
    ? Either.left(`Cannot parse "${str}" as integer`)
    : Either.right(num);
}

// Chaining operations
const result = safeParseInt("10")
  .flatMap((a) => safeParseInt("5").map((b) => [a, b]))
  .flatMap(([a, b]) => safeDivide(a, b))
  .map((result) => result * 2);

console.log(result.getOrElse(0)); // 4

// Error case
const errorResult = safeParseInt("abc")
  .flatMap((a) => safeParseInt("5").map((b) => [a, b]))
  .flatMap(([a, b]) => safeDivide(a, b));

console.log(
  errorResult.fold(
    (error) => `Error: ${error}`,
    (value) => `Success: ${value}`
  )
); // "Error: Cannot parse "abc" as integer"
```

## IO Monad Pattern

The IO monad represents computations that perform I/O operations, allowing for pure functional composition of side effects.

```javascript
class IO {
  constructor(fn) {
    this.fn = fn;
  }

  static of(value) {
    return new IO(() => value);
  }

  map(fn) {
    return new IO(() => fn(this.fn()));
  }

  flatMap(fn) {
    return new IO(() => fn(this.fn()).fn());
  }

  run() {
    return this.fn();
  }
}

// IO operations
const readFile = (filename) =>
  new IO(() => {
    console.log(`Reading file: ${filename}`);
    return `Contents of ${filename}`;
  });

const writeFile = (filename, content) =>
  new IO(() => {
    console.log(`Writing to file: ${filename}`);
    console.log(`Content: ${content}`);
    return "Write successful";
  });

const processContent = (content) => content.toUpperCase();

// Compose IO operations (pure, no side effects yet)
const program = readFile("input.txt")
  .map(processContent)
  .flatMap((content) => writeFile("output.txt", content));

// Execute the program (side effects occur here)
program.run();
```

## State Monad Pattern

The State monad manages stateful computations in a pure functional way.

```javascript
class State {
  constructor(runState) {
    this.runState = runState;
  }

  static of(value) {
    return new State((state) => [value, state]);
  }

  static get() {
    return new State((state) => [state, state]);
  }

  static put(newState) {
    return new State(() => [undefined, newState]);
  }

  map(fn) {
    return new State((state) => {
      const [value, newState] = this.runState(state);
      return [fn(value), newState];
    });
  }

  flatMap(fn) {
    return new State((state) => {
      const [value, newState] = this.runState(state);
      return fn(value).runState(newState);
    });
  }

  run(initialState) {
    return this.runState(initialState);
  }
}

// Counter example
const increment = State.get().flatMap((count) =>
  State.put(count + 1).map(() => count + 1)
);

const decrement = State.get().flatMap((count) =>
  State.put(count - 1).map(() => count - 1)
);

const program = increment
  .flatMap(() => increment)
  .flatMap(() => decrement)
  .flatMap(() => State.get());

const [finalValue, finalState] = program.run(0);
console.log({ finalValue, finalState }); // { finalValue: 1, finalState: 1 }
```

## Lens Pattern

Lenses provide a functional way to access and update nested data structures immutably.

```javascript
class Lens {
  constructor(getter, setter) {
    this.getter = getter;
    this.setter = setter;
  }

  static of(getter, setter) {
    return new Lens(getter, setter);
  }

  view(obj) {
    return this.getter(obj);
  }

  set(value, obj) {
    return this.setter(value, obj);
  }

  over(fn, obj) {
    return this.set(fn(this.view(obj)), obj);
  }

  compose(otherLens) {
    return new Lens(
      (obj) => otherLens.view(this.view(obj)),
      (value, obj) => this.over((subObj) => otherLens.set(value, subObj), obj)
    );
  }
}

// Property lens factory
const prop = (key) =>
  new Lens(
    (obj) => obj[key],
    (value, obj) => ({ ...obj, [key]: value })
  );

// Index lens factory
const index = (i) =>
  new Lens(
    (arr) => arr[i],
    (value, arr) => [...arr.slice(0, i), value, ...arr.slice(i + 1)]
  );

// Example usage
const person = {
  name: "John",
  address: {
    street: "123 Main St",
    city: "Anytown"
  },
  hobbies: ["reading", "coding", "hiking"]
};

// Create lenses
const nameLens = prop("name");
const addressLens = prop("address");
const streetLens = prop("street");
const hobbiesLens = prop("hobbies");

// Compose lenses
const addressStreetLens = addressLens.compose(streetLens);
const firstHobbyLens = hobbiesLens.compose(index(0));

// Usage
console.log(addressStreetLens.view(person)); // "123 Main St"

const updatedPerson = addressStreetLens.set("456 Oak Ave", person);
console.log(updatedPerson.address.street); // "456 Oak Ave"
console.log(person.address.street); // "123 Main St" (original unchanged)

const updatedHobby = firstHobbyLens.over(
  (hobby) => hobby.toUpperCase(),
  person
);
console.log(updatedHobby.hobbies[0]); // "READING"
```

## Observer Pattern (Functional Style)

```javascript
// Functional observer with immutable state
function createObservable(initialValue) {
  let value = initialValue;
  let observers = [];

  return {
    subscribe(observer) {
      observers = [...observers, observer];
      return () => {
        observers = observers.filter((obs) => obs !== observer);
      };
    },

    getValue() {
      return value;
    },

    setValue(newValue) {
      value = newValue;
      observers.forEach((observer) => observer(value));
    },

    map(fn) {
      const mapped = createObservable(fn(value));
      this.subscribe((val) => mapped.setValue(fn(val)));
      return mapped;
    },

    filter(predicate) {
      const filtered = createObservable(predicate(value) ? value : undefined);
      this.subscribe((val) => {
        if (predicate(val)) {
          filtered.setValue(val);
        }
      });
      return filtered;
    }
  };
}

// Usage
const counter = createObservable(0);
const doubledCounter = counter.map((x) => x * 2);
const evenCounter = counter.filter((x) => x % 2 === 0);

counter.subscribe((val) => console.log(`Counter: ${val}`));
doubledCounter.subscribe((val) => console.log(`Doubled: ${val}`));
evenCounter.subscribe((val) => console.log(`Even: ${val}`));

counter.setValue(1); // Counter: 1, Doubled: 2
counter.setValue(2); // Counter: 2, Doubled: 4, Even: 2
counter.setValue(3); // Counter: 3, Doubled: 6
```

## Validation Pattern

```javascript
// Validation with accumulating errors
class Validation {
  constructor(value, errors = []) {
    this.value = value;
    this.errors = errors;
    this.isValid = errors.length === 0;
  }

  static success(value) {
    return new Validation(value, []);
  }

  static failure(errors) {
    return new Validation(null, Array.isArray(errors) ? errors : [errors]);
  }

  map(fn) {
    return this.isValid ? Validation.success(fn(this.value)) : this;
  }

  flatMap(fn) {
    return this.isValid ? fn(this.value) : this;
  }

  combine(other) {
    if (this.isValid && other.isValid) {
      return Validation.success([this.value, other.value]);
    }
    return Validation.failure([...this.errors, ...other.errors]);
  }

  mapErrors(fn) {
    return new Validation(this.value, this.errors.map(fn));
  }
}

// Validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email)
    ? Validation.success(email)
    : Validation.failure("Invalid email format");
};

const validatePassword = (password) => {
  const errors = [];
  if (password.length < 8)
    errors.push("Password must be at least 8 characters");
  if (!/[A-Z]/.test(password))
    errors.push("Password must contain uppercase letter");
  if (!/[0-9]/.test(password)) errors.push("Password must contain a number");

  return errors.length === 0
    ? Validation.success(password)
    : Validation.failure(errors);
};

const validateAge = (age) => {
  const numAge = parseInt(age, 10);
  if (isNaN(numAge)) return Validation.failure("Age must be a number");
  if (numAge < 18) return Validation.failure("Must be at least 18 years old");
  if (numAge > 120) return Validation.failure("Age must be realistic");

  return Validation.success(numAge);
};

// Combine validations
function validateUser(userData) {
  const emailValidation = validateEmail(userData.email);
  const passwordValidation = validatePassword(userData.password);
  const ageValidation = validateAge(userData.age);

  // Combine all validations
  return emailValidation
    .combine(passwordValidation)
    .combine(ageValidation)
    .map(([email, [password, age]]) => ({
      email,
      password,
      age
    }));
}

// Usage
const userData1 = {
  email: "john@example.com",
  password: "SecurePass123",
  age: "25"
};

const result1 = validateUser(userData1);
console.log(result1); // Valid user object

const userData2 = {
  email: "invalid-email",
  password: "weak",
  age: "not-a-number"
};

const result2 = validateUser(userData2);
console.log(result2.errors);
// ["Invalid email format", "Password must be at least 8 characters", ...]
```

## Pipeline Pattern for Async Operations

```javascript
// Async pipeline pattern
class AsyncPipeline {
  constructor(value) {
    this.value = Promise.resolve(value);
  }

  static of(value) {
    return new AsyncPipeline(value);
  }

  map(fn) {
    return new AsyncPipeline(this.value.then(fn));
  }

  flatMap(fn) {
    return new AsyncPipeline(this.value.then((val) => fn(val).value));
  }

  filter(predicate) {
    return new AsyncPipeline(
      this.value.then((val) =>
        predicate(val) ? val : Promise.reject(new Error("Filter failed"))
      )
    );
  }

  catch(handler) {
    return new AsyncPipeline(this.value.catch(handler));
  }

  finally(handler) {
    return new AsyncPipeline(this.value.finally(handler));
  }

  run() {
    return this.value;
  }
}

// Example: API data processing pipeline
const processUserData = (userId) =>
  AsyncPipeline.of(userId)
    .flatMap((id) => AsyncPipeline.of(fetchUser(id)))
    .map((user) => ({
      ...user,
      displayName: `${user.firstName} ${user.lastName}`
    }))
    .filter((user) => user.active)
    .flatMap((user) =>
      AsyncPipeline.of(fetchUserPosts(user.id)).map((posts) => ({
        ...user,
        posts
      }))
    )
    .catch((error) => ({ error: error.message }));

// Mock API functions
async function fetchUser(id) {
  return { id, firstName: "John", lastName: "Doe", active: true };
}

async function fetchUserPosts(userId) {
  return [{ id: 1, title: "Hello World", userId }];
}

// Usage
processUserData(123)
  .run()
  .then((result) => console.log(result));
```

## Best Practices

### 1. Start Simple

```javascript
// Start with basic patterns before complex monads
const safeGet = (obj, path) => {
  try {
    return path.split(".").reduce((acc, key) => acc[key], obj);
  } catch {
    return undefined;
  }
};

// Gradually introduce Maybe for safety
const safeGetMaybe = (obj, path) =>
  Maybe.of(obj)
    .map((o) => path.split(".").reduce((acc, key) => acc && acc[key], o))
    .filter((val) => val !== undefined);
```

### 2. Use Composition Over Complex Monads

```javascript
// Often, simple composition is better than complex patterns
const processData = pipe(
  (data) => data.filter((item) => item.active),
  (data) => data.map((item) => ({ ...item, processed: true })),
  (data) => data.sort((a, b) => a.name.localeCompare(b.name))
);
```

### 3. Handle Errors Consistently

```javascript
// Consistent error handling pattern
const safeOperation =
  (operation, errorHandler = (x) => x) =>
  (...args) => {
    try {
      const result = operation(...args);
      return result instanceof Promise ? result.catch(errorHandler) : result;
    } catch (error) {
      return errorHandler(error);
    }
  };
```

## Self-Check Questions

1. When would you use the Maybe pattern over regular null checks?
2. How does the Either pattern help with error handling?
3. What are the benefits of using lenses for data manipulation?
4. How do functional patterns improve code maintainability?
5. When should you prefer simple composition over complex monads?

## Practice Exercises

### Exercise 1: Maybe Implementation

Implement a complete Maybe monad with methods for `map`, `flatMap`, `filter`, `getOrElse`, and `orElse`.

### Exercise 2: Form Validation

Create a form validation system using the Validation pattern that accumulates all errors.

### Exercise 3: State Management

Build a simple state management system using functional patterns for a todo application.

### Exercise 4: Async Pipeline

Create an async pipeline for processing API data that handles errors gracefully.

### Exercise 5: Lens Library

Build a lens library that can handle nested object and array updates immutably.

## Further Reading

- [Fantasy Land Specification](https://github.com/fantasyland/fantasy-land)
- [Folktale.js](https://folktale.origamitower.com/) - Functional programming library
- [Functional Programming Patterns](https://fsharpforfunandprofit.com/fppatterns/)
- [Monad Design Patterns](https://blog.ploeh.dk/2022/03/28/monads/)
