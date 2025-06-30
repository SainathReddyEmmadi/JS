/**
 * Exercise 04: Function Factories
 *
 * Practice creating functions that return other functions, enabling
 * customizable behavior and function specialization.
 */

console.log("Starting Exercise 04: Function Factories");

// Basic function factory
console.log("\n=== Basic Function Factory ===");

// TODO: Create a function that returns functions
function createMultiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

// TODO: Create specialized functions using the factory
const double = createMultiplier(2);
const triple = createMultiplier(3);
const half = createMultiplier(0.5);

console.log("Double 5:", double(5));
console.log("Triple 4:", triple(4));
console.log("Half of 10:", half(10));

// Greeting factory with customizable behavior
console.log("\n=== Greeting Factory ===");

// TODO: Create a greeting function factory
function createGreeter(greeting, punctuation = "!") {
  return function (name) {
    return `${greeting}, ${name}${punctuation}`;
  };
}

// TODO: Create different greeting styles
const casualGreeter = createGreeter("Hey");
const formalGreeter = createGreeter("Good morning", ".");
const enthusiasticGreeter = createGreeter("Hello", "!!!");

console.log("Casual:", casualGreeter("Alice"));
console.log("Formal:", formalGreeter("Mr. Smith"));
console.log("Enthusiastic:", enthusiasticGreeter("Team"));

// Validator factory
console.log("\n=== Validator Factory ===");

// TODO: Create validation function factory
function createValidator(validationRule, errorMessage) {
  return function (value) {
    const isValid = validationRule(value);
    return {
      isValid,
      value,
      error: isValid ? null : errorMessage
    };
  };
}

// TODO: Create specific validators
const emailValidator = createValidator(
  (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  "Invalid email format"
);

const passwordValidator = createValidator(
  (password) =>
    password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password),
  "Password must be at least 8 characters with uppercase and number"
);

const ageValidator = createValidator(
  (age) => Number.isInteger(age) && age >= 0 && age <= 150,
  "Age must be a number between 0 and 150"
);

// TODO: Test validators
console.log("Email validation:", emailValidator("test@example.com"));
console.log("Invalid email:", emailValidator("invalid-email"));
console.log("Password validation:", passwordValidator("SecurePass123"));
console.log("Weak password:", passwordValidator("weak"));

// Converter factory
console.log("\n=== Unit Converter Factory ===");

// TODO: Create unit conversion factory
function createConverter(fromUnit, toUnit, conversionFactor) {
  return function (value) {
    const converted = value * conversionFactor;
    return {
      original: `${value} ${fromUnit}`,
      converted: `${converted} ${toUnit}`,
      value: converted
    };
  };
}

// TODO: Create specific converters
const celsiusToFahrenheit = createConverter("°C", "°F", 9 / 5);
const celsiusToFahrenheitAdjusted = function (celsius) {
  const result = celsiusToFahrenheit(celsius);
  result.value = result.value + 32;
  result.converted = `${result.value} °F`;
  return result;
};

const milesToKm = createConverter("miles", "km", 1.60934);
const poundsToKg = createConverter("lbs", "kg", 0.453592);

console.log("Temperature:", celsiusToFahrenheitAdjusted(25));
console.log("Distance:", milesToKm(10));
console.log("Weight:", poundsToKg(150));

// Timer factory
console.log("\n=== Timer Factory ===");

// TODO: Create timer function factory
function createTimer(interval, callback) {
  let timerId = null;
  let isRunning = false;
  let tickCount = 0;

  return {
    start() {
      if (!isRunning) {
        isRunning = true;
        timerId = setInterval(() => {
          tickCount++;
          callback(tickCount);
        }, interval);
        console.log(`Timer started with ${interval}ms interval`);
      }
    },

    stop() {
      if (isRunning) {
        clearInterval(timerId);
        isRunning = false;
        console.log(`Timer stopped after ${tickCount} ticks`);
      }
    },

    reset() {
      this.stop();
      tickCount = 0;
      console.log("Timer reset");
    },

    getTickCount() {
      return tickCount;
    },

    isRunning() {
      return isRunning;
    }
  };
}

// TODO: Create and test different timers
const clockTimer = createTimer(1000, (tick) => {
  console.log(`Clock tick: ${tick}`);
});

const fastTimer = createTimer(200, (tick) => {
  if (tick <= 3) console.log(`Fast timer: ${tick}`);
});

// Uncomment to test timers (they will run asynchronously)
// clockTimer.start();
// setTimeout(() => clockTimer.stop(), 3500);
// fastTimer.start();
// setTimeout(() => fastTimer.stop(), 1000);

// Throttle/Debounce factory
console.log("\n=== Throttle/Debounce Factory ===");

// TODO: Create throttle function factory
function createThrottle(func, delay) {
  let lastExecution = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastExecution >= delay) {
      lastExecution = now;
      return func.apply(this, args);
    }
  };
}

// TODO: Create debounce function factory
function createDebounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// TODO: Test throttle and debounce
const logMessage = (message) => console.log(`Log: ${message} at ${Date.now()}`);
const throttledLog = createThrottle(logMessage, 1000);
const debouncedLog = createDebounce(logMessage, 500);

console.log("Testing throttle (max once per second):");
throttledLog("First call");
throttledLog("Second call (should be ignored)");
setTimeout(() => throttledLog("Third call (should execute)"), 1100);

// Cache factory
console.log("\n=== Cache Factory ===");

// TODO: Create caching function factory
function createCache(maxSize = 100) {
  const cache = new Map();

  return function (key, computeFn) {
    // Check if value exists in cache
    if (cache.has(key)) {
      console.log(`Cache hit for key: ${key}`);
      return cache.get(key);
    }

    // Compute new value
    console.log(`Cache miss for key: ${key}, computing...`);
    const value = computeFn();

    // Manage cache size
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, value);
    return value;
  };
}

// TODO: Create cached computation functions
const fibonacciCache = createCache(50);

function fibonacci(n) {
  return fibonacciCache(`fib_${n}`, () => {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
  });
}

console.log("Fibonacci 10:", fibonacci(10));
console.log("Fibonacci 10 again:", fibonacci(10)); // Should use cache

// Event emitter factory
console.log("\n=== Event Emitter Factory ===");

// TODO: Create event emitter factory
function createEventEmitter() {
  const events = new Map();

  return {
    on(event, callback) {
      if (!events.has(event)) {
        events.set(event, []);
      }
      events.get(event).push(callback);
    },

    off(event, callback) {
      if (events.has(event)) {
        const callbacks = events.get(event);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    },

    emit(event, ...args) {
      if (events.has(event)) {
        events.get(event).forEach((callback) => {
          try {
            callback(...args);
          } catch (error) {
            console.error("Event callback error:", error);
          }
        });
      }
    },

    once(event, callback) {
      const wrapper = (...args) => {
        callback(...args);
        this.off(event, wrapper);
      };
      this.on(event, wrapper);
    }
  };
}

// TODO: Test event emitter
const emitter = createEventEmitter();

emitter.on("test", (data) => console.log("Test event:", data));
emitter.on("test", (data) => console.log("Another test listener:", data));
emitter.once("once-event", (data) =>
  console.log("This will only run once:", data)
);

emitter.emit("test", "Hello World");
emitter.emit("once-event", "First time");
emitter.emit("once-event", "Second time (should not trigger)");

// State machine factory
console.log("\n=== State Machine Factory ===");

// TODO: Create state machine factory
function createStateMachine(initialState, states) {
  let currentState = initialState;
  const history = [initialState];

  return {
    getCurrentState() {
      return currentState;
    },

    transition(newState) {
      if (states[currentState] && states[currentState].includes(newState)) {
        console.log(`Transitioning from ${currentState} to ${newState}`);
        currentState = newState;
        history.push(newState);
        return true;
      } else {
        console.log(`Invalid transition from ${currentState} to ${newState}`);
        return false;
      }
    },

    getHistory() {
      return [...history];
    },

    canTransitionTo(state) {
      return states[currentState] && states[currentState].includes(state);
    }
  };
}

// TODO: Create a simple state machine for a door
const doorStates = {
  closed: ["opening"],
  opening: ["open"],
  open: ["closing"],
  closing: ["closed"]
};

const door = createStateMachine("closed", doorStates);

console.log("Door state:", door.getCurrentState());
door.transition("opening");
door.transition("open");
door.transition("closing");
door.transition("closed");
console.log("Door history:", door.getHistory());

// Instructions:
// 1. Understand how function factories enable code reuse and customization
// 2. Practice creating specialized functions from general factories
// 3. Build validation, conversion, and timing utilities
// 4. Implement caching and throttling patterns
// 5. Create event systems and state machines
// 6. Compare function factories with class-based approaches
// 7. Use closures to maintain private state in factory functions
