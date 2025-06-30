# Week 2: Functions and Scope Exercises 🎯

Master functions, scope, and the `this` keyword with these comprehensive exercises.

## 🎮 Exercise 1: Function Factory Challenge

Create a function factory that produces customized calculator functions.

```javascript
// TODO: Create a function that returns different types of calculators
function createCalculator(type) {
  // Your function should return different calculator objects based on 'type':
  //
  // "basic" - addition, subtraction, multiplication, division
  // "scientific" - includes basic + power, square root, trigonometric functions
  // "financial" - includes basic + compound interest, loan payments, depreciation
  //
  // Each calculator should:
  // 1. Maintain internal state (current value)
  // 2. Support method chaining
  // 3. Have a getValue() method to get current value
  // 4. Have a clear() method to reset to 0
  // 5. Handle error cases (division by zero, invalid inputs)
  // Your code here
}

// Test cases
const basicCalc = createCalculator("basic");
console.log(basicCalc.add(10).multiply(2).subtract(5).getValue()); // Should be 15

const sciCalc = createCalculator("scientific");
console.log(sciCalc.add(9).sqrt().getValue()); // Should be 3

const finCalc = createCalculator("financial");
console.log(finCalc.clear().add(1000).compoundInterest(0.05, 2).getValue()); // Calculate compound interest
```

## 🌟 Exercise 2: Scope Simulation Game

Create a text-based adventure game that demonstrates different scope concepts.

```javascript
// TODO: Build a game system with proper scope management
function createAdventureGame() {
  // Game should have:
  // - Private game state (player stats, inventory, current location)
  // - Public methods to interact with the game
  // - Nested functions that can access parent scope
  // - Proper 'this' context management

  // Private variables (use closure to hide these)
  // - player: { name, health, mana, level, experience }
  // - inventory: array of items
  // - currentLocation: string
  // - gameLog: array of game events

  // Your code here

  // Return public API
  return {
    // Player management
    createPlayer: function (name) {
      // Initialize player
    },

    getPlayerStats: function () {
      // Return player information
    },

    // Inventory management
    addItem: function (item) {
      // Add item to inventory
    },

    useItem: function (itemName) {
      // Use item from inventory
    },

    // Game actions
    explore: function () {
      // Move to random location, encounter events
    },

    battle: function (enemy) {
      // Battle system with 'this' context
    },

    rest: function () {
      // Restore health/mana
    },

    // Game utilities
    getGameLog: function () {
      // Return copy of game events
    },

    saveGame: function () {
      // Return game state as object
    },

    loadGame: function (gameState) {
      // Restore game from saved state
    }
  };
}

// Test the game
const game = createAdventureGame();
game.createPlayer("Hero");
game.addItem({ name: "Health Potion", effect: "heal", value: 50 });
game.explore();
console.log(game.getPlayerStats());
```

## 🔄 Exercise 3: Function Type Converter

Create utilities that convert between different function types while preserving behavior.

```javascript
// TODO: Implement function converters
const FunctionConverter = {
  // Convert function declaration to arrow function (as string)
  declarationToArrow: function (funcDeclaration) {
    // Take a function declaration and return equivalent arrow function
    // Handle different cases: no params, one param, multiple params, etc.
    // Your code here
  },

  // Convert arrow function to regular function
  arrowToRegular: function (arrowFunction) {
    // Convert arrow function to regular function expression
    // Your code here
  },

  // Create a curried version of any function
  curry: function (func) {
    // Convert a function to its curried equivalent
    // Example: add(a, b) becomes add(a)(b)
    // Your code here
  },

  // Create a memoized version of a function
  memoize: function (func) {
    // Cache function results for same inputs
    // Your code here
  },

  // Convert callback-style function to promise-based
  promisify: function (callbackFunc) {
    // Convert function that uses callbacks to return promises
    // Your code here
  }
};

// Test cases
function add(a, b) {
  return a + b;
}

const curriedAdd = FunctionConverter.curry(add);
console.log(curriedAdd(5)(3)); // Should be 8

const memoizedAdd = FunctionConverter.memoize(add);
console.log(memoizedAdd(5, 3)); // Calculated result
console.log(memoizedAdd(5, 3)); // Cached result
```

## 🎯 Exercise 4: Context Binding Playground

Master the `this` keyword with various binding scenarios.

```javascript
// TODO: Fix the context issues in these objects and functions

// Problem 1: Method binding
const userProfile = {
  name: "Alice",
  email: "alice@email.com",
  preferences: {
    theme: "dark",
    language: "en"
  },

  // Fix this method to work correctly when assigned to variables
  getDisplayName: function () {
    return `${this.name} (${this.email})`;
  },

  // Fix this arrow function method
  updateEmail: (newEmail) => {
    this.email = newEmail;
    console.log(`Email updated to: ${this.email}`);
  },

  // Fix the context loss in this method
  updatePreferences: function (newPrefs) {
    Object.keys(newPrefs).forEach(function (key) {
      this.preferences[key] = newPrefs[key]; // 'this' context lost
    });
  },

  // Create a method that returns a function maintaining 'this' context
  createEmailValidator: function () {
    // Return a function that validates if an email belongs to this user
    // The returned function should have access to this.email
    // Your code here
  }
};

// Problem 2: Event simulation
function createButton(label, clickHandler) {
  // Simulate a button object
  const button = {
    label: label,
    clicked: false,
    clickCount: 0,

    click: function () {
      this.clicked = true;
      this.clickCount++;

      // Fix the context when calling the handler
      clickHandler.call(/* fix this */);
    },

    reset: function () {
      this.clicked = false;
      this.clickCount = 0;
    }
  };

  return button;
}

// Problem 3: Class-like constructor
function MediaPlayer(playlist) {
  this.playlist = playlist || [];
  this.currentIndex = 0;
  this.isPlaying = false;

  // Fix these methods to maintain proper 'this' context
  this.play = function () {
    if (this.playlist.length > 0) {
      this.isPlaying = true;
      console.log(`Playing: ${this.playlist[this.currentIndex]}`);

      // Simulate auto-advance after 3 seconds
      setTimeout(function () {
        this.next(); // Fix context loss
      }, 3000);
    }
  };

  this.next = function () {
    this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
    if (this.isPlaying) {
      this.play();
    }
  };

  // Create a method that returns bound methods
  this.getControls = function () {
    // Return an object with bound methods that can be called independently
    // Your code here
  };
}

// Test cases - make these work:
const profile = userProfile;
const getName = profile.getDisplayName; // Should work when called independently
// console.log(getName()); // Should print "Alice (alice@email.com)"

const player = new MediaPlayer(["Song 1", "Song 2", "Song 3"]);
const controls = player.getControls();
// controls.play(); // Should work independently
```

## 🧩 Exercise 5: Hoisting Detective

Predict and explain the behavior of these hoisting scenarios.

```javascript
// TODO: For each code block, predict the output and explain why

// Scenario 1: Variable hoisting mix
function scenario1() {
  console.log("a:", a); // Prediction: ?
  console.log("b:", b); // Prediction: ?
  // console.log("c:", c); // Prediction: ?

  var a = 1;
  let b = 2;
  const c = 3;

  if (true) {
    console.log("inner a:", a); // Prediction: ?
    var a = 4; // What happens here?
    let b = 5;
    console.log("inner b:", b); // Prediction: ?
  }

  console.log("final a:", a); // Prediction: ?
  console.log("final b:", b); // Prediction: ?
}

// Scenario 2: Function hoisting
function scenario2() {
  console.log("func1:", func1()); // Prediction: ?
  // console.log("func2:", func2()); // Prediction: ?
  // console.log("func3:", func3()); // Prediction: ?

  function func1() {
    return "I'm func1";
  }

  var func2 = function () {
    return "I'm func2";
  };

  let func3 = () => {
    return "I'm func3";
  };

  console.log("func1:", func1()); // Prediction: ?
  console.log("func2:", func2()); // Prediction: ?
  console.log("func3:", func3()); // Prediction: ?
}

// Scenario 3: Complex hoisting with nested functions
function scenario3() {
  console.log("outer x:", x); // Prediction: ?

  function inner() {
    console.log("inner x:", x); // Prediction: ?
    var x = "inner value";
    console.log("inner x after:", x); // Prediction: ?
  }

  var x = "outer value";
  inner();
  console.log("outer x final:", x); // Prediction: ?
}

// Your task: Write explanations for each prediction
// Example:
// scenario1() predictions:
// a: undefined - because var declarations are hoisted but not assignments
// b: ReferenceError - because let is in temporal dead zone
// etc.
```

## 🏗️ Exercise 6: Closure Workshop

Build practical applications using closures.

```javascript
// TODO: Implement these closure-based utilities

// 1. Private Counter with Multiple Instances
function createPrivateCounter(initialValue = 0, step = 1) {
  // Create a counter that:
  // - Maintains private state
  // - Allows increment/decrement by custom step
  // - Provides readonly access to current value
  // - Can be reset to initial value
  // - Each instance is independent
  // Your code here
}

// 2. Function Cache with TTL (Time To Live)
function createCache(ttl = 5000) {
  // Create a cache that:
  // - Stores function results with timestamps
  // - Automatically expires entries after TTL
  // - Provides cache statistics (hits, misses, size)
  // - Can be manually cleared
  // Your code here
}

// 3. Event Emitter with Closure
function createEventEmitter() {
  // Create an event system that:
  // - Maintains private list of listeners
  // - Supports on/off/emit methods
  // - Supports once() for one-time listeners
  // - Returns unsubscribe functions
  // - Prevents external access to listener list
  // Your code here
}

// 4. Debounce Function Factory
function createDebouncer() {
  // Create a debounce utility that:
  // - Can debounce multiple functions independently
  // - Maintains separate timers for each function
  // - Allows cancellation of pending calls
  // - Provides immediate execution option
  // Your code here
}

// Test cases
const counter1 = createPrivateCounter(10, 2);
const counter2 = createPrivateCounter(0, 1);

const cache = createCache(3000);
const cachedExpensiveFunction = cache.wrap(function (x) {
  console.log("Calculating...");
  return x * x;
});

const emitter = createEventEmitter();
const unsubscribe = emitter.on("test", (data) => console.log("Event:", data));
emitter.emit("test", "Hello World");

const debouncer = createDebouncer();
const debouncedLog = debouncer.debounce(console.log, 1000);
```

## 🎪 Exercise 7: Advanced Function Patterns

Implement advanced function patterns and concepts.

```javascript
// TODO: Implement these advanced patterns

// 1. Function Composition Pipeline
function createPipeline(...functions) {
  // Create a pipeline that:
  // - Executes functions in sequence
  // - Passes result of each function to the next
  // - Handles async functions
  // - Provides error handling
  // - Supports branching (conditional execution)
  // Your code here
}

// 2. Partial Application System
function createPartializer() {
  // Create a system that:
  // - Supports partial application of any function
  // - Allows placeholders for arguments
  // - Maintains function arity information
  // - Supports multiple levels of partial application
  // Your code here
}

// 3. Function Overloading Simulator
function createOverloader() {
  // Create a system that:
  // - Allows multiple function implementations based on argument types/count
  // - Automatically dispatches to correct implementation
  // - Provides fallback for unmatched signatures
  // - Maintains performance for common cases
  // Your code here
}

// 4. Async Function Queue with Concurrency Control
function createAsyncQueue(concurrency = 1) {
  // Create a queue that:
  // - Executes async functions with controlled concurrency
  // - Maintains order of results (optional)
  // - Provides progress callbacks
  // - Supports priority queuing
  // - Handles errors gracefully
  // Your code here
}

// Test examples
const pipeline = createPipeline(
  (x) => x * 2,
  (x) => x + 1,
  (x) => x.toString()
);
console.log(pipeline(5)); // Should output "11"

const partializer = createPartializer();
const add = (a, b, c) => a + b + c;
const addFive = partializer.partial(add, 5);
console.log(addFive(3, 2)); // Should output 10

const overloader = createOverloader();
overloader.addImplementation("number", (x) => x * 2);
overloader.addImplementation("string", (x) => x.toUpperCase());
const polymorphic = overloader.create();
console.log(polymorphic(5)); // 10
console.log(polymorphic("hello")); // "HELLO"
```

## 🏆 Bonus Challenge: Meta-Programming with Functions

```javascript
// TODO: Create a function analysis and manipulation toolkit
const FunctionToolkit = {
  // Analyze function properties
  analyze: function (func) {
    // Return object with:
    // - parameter names
    // - function body (as string)
    // - whether it's arrow function
    // - whether it uses 'this'
    // - complexity metrics
    // Your code here
  },

  // Create function decorators
  decorate: function (func, ...decorators) {
    // Apply multiple decorators to a function
    // Decorators might include: logging, timing, validation, caching
    // Your code here
  },

  // Function transformation utilities
  transform: function (func, transformations) {
    // Apply transformations like:
    // - add parameter validation
    // - add return type checking
    // - add automatic retry logic
    // - add rate limiting
    // Your code here
  },

  // Create function variations
  createVariations: function (func) {
    // Return object with different versions:
    // - async version
    // - memoized version
    // - curried version
    // - promisified version
    // Your code here
  }
};

// Example usage
function divide(a, b) {
  return a / b;
}

const analysis = FunctionToolkit.analyze(divide);
console.log(analysis);

const decoratedDivide = FunctionToolkit.decorate(
  divide,
  "validate", // Ensure b !== 0
  "log", // Log calls
  "time" // Measure execution time
);

const variations = FunctionToolkit.createVariations(divide);
console.log(variations.async(10, 2)); // Promise-based version
```

## 📝 Self-Assessment Checklist

After completing these exercises, you should be able to:

- [ ] Create and use function declarations, expressions, and arrow functions appropriately
- [ ] Understand and predict variable hoisting behavior
- [ ] Correctly use the `this` keyword in different contexts
- [ ] Implement closures for data privacy and state management
- [ ] Fix common scope and context-related bugs
- [ ] Use `call`, `apply`, and `bind` effectively
- [ ] Create higher-order functions and function factories
- [ ] Understand the differences between function types and when to use each

## 🎯 Learning Outcomes

By completing these exercises, you will have:

1. **Mastered Function Types** - Know when and how to use each type of function
2. **Understood Scope Deeply** - Can predict and control variable access
3. **Tamed the `this` Keyword** - Can debug and fix context issues
4. **Leveraged Closures** - Can create powerful patterns with private state
5. **Built Complex Systems** - Can architect applications using proper scope management

## 🔗 Next Steps

After mastering these concepts:

1. Review your solutions and optimize them
2. Build a small project combining all Week 2 concepts
3. Move on to [Arrays and Objects](../week3-data-structures/)
4. Practice explaining these concepts to others

## 💡 Pro Tips

- **Use strict mode** to catch common mistakes
- **Practice with debugger** to see scope and context in action
- **Read other people's code** to see different patterns
- **Build real projects** to apply these concepts practically
