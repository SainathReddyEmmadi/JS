/**
 * EventBus - Implementation of Observer Pattern
 *
 * Provides event-driven communication between different components
 * of the library system without tight coupling.
 */

export class EventBus {
  #listeners;
  #onceListeners;
  #maxListeners;

  constructor(maxListeners = 100) {
    this.#listeners = new Map();
    this.#onceListeners = new Map();
    this.#maxListeners = maxListeners;
  }

  // Add an event listener
  on(eventName, callback) {
    this.#validateEventName(eventName);
    this.#validateCallback(callback);

    if (!this.#listeners.has(eventName)) {
      this.#listeners.set(eventName, []);
    }

    const eventListeners = this.#listeners.get(eventName);

    // Check max listeners limit
    if (eventListeners.length >= this.#maxListeners) {
      console.warn(
        `Maximum listeners (${
          this.#maxListeners
        }) reached for event: ${eventName}`
      );
      return this;
    }

    eventListeners.push(callback);
    return this;
  }

  // Add a one-time event listener
  once(eventName, callback) {
    this.#validateEventName(eventName);
    this.#validateCallback(callback);

    if (!this.#onceListeners.has(eventName)) {
      this.#onceListeners.set(eventName, []);
    }

    this.#onceListeners.get(eventName).push(callback);
    return this;
  }

  // Remove an event listener
  off(eventName, callback) {
    this.#validateEventName(eventName);

    if (callback) {
      this.#validateCallback(callback);

      // Remove from regular listeners
      if (this.#listeners.has(eventName)) {
        const eventListeners = this.#listeners.get(eventName);
        const index = eventListeners.indexOf(callback);
        if (index !== -1) {
          eventListeners.splice(index, 1);

          // Clean up empty arrays
          if (eventListeners.length === 0) {
            this.#listeners.delete(eventName);
          }
        }
      }

      // Remove from once listeners
      if (this.#onceListeners.has(eventName)) {
        const onceListeners = this.#onceListeners.get(eventName);
        const index = onceListeners.indexOf(callback);
        if (index !== -1) {
          onceListeners.splice(index, 1);

          if (onceListeners.length === 0) {
            this.#onceListeners.delete(eventName);
          }
        }
      }
    } else {
      // Remove all listeners for this event
      this.#listeners.delete(eventName);
      this.#onceListeners.delete(eventName);
    }

    return this;
  }

  // Emit an event
  emit(eventName, ...args) {
    this.#validateEventName(eventName);

    let hasListeners = false;

    // Call regular listeners
    if (this.#listeners.has(eventName)) {
      const eventListeners = [...this.#listeners.get(eventName)]; // Copy to avoid modification issues

      for (const callback of eventListeners) {
        try {
          callback(...args);
          hasListeners = true;
        } catch (error) {
          console.error(`Error in event listener for "${eventName}":`, error);

          // Emit error event if it's not already an error event (prevent recursion)
          if (eventName !== "error") {
            this.emit("error", error, eventName, callback);
          }
        }
      }
    }

    // Call once listeners and remove them
    if (this.#onceListeners.has(eventName)) {
      const onceListeners = [...this.#onceListeners.get(eventName)];
      this.#onceListeners.delete(eventName); // Remove all once listeners

      for (const callback of onceListeners) {
        try {
          callback(...args);
          hasListeners = true;
        } catch (error) {
          console.error(
            `Error in once event listener for "${eventName}":`,
            error
          );

          if (eventName !== "error") {
            this.emit("error", error, eventName, callback);
          }
        }
      }
    }

    return hasListeners;
  }

  // Get list of event names with active listeners
  eventNames() {
    const names = new Set();

    for (const eventName of this.#listeners.keys()) {
      names.add(eventName);
    }

    for (const eventName of this.#onceListeners.keys()) {
      names.add(eventName);
    }

    return Array.from(names);
  }

  // Get listener count for an event
  listenerCount(eventName) {
    this.#validateEventName(eventName);

    const regularCount = this.#listeners.has(eventName)
      ? this.#listeners.get(eventName).length
      : 0;
    const onceCount = this.#onceListeners.has(eventName)
      ? this.#onceListeners.get(eventName).length
      : 0;

    return regularCount + onceCount;
  }

  // Get all listeners for an event
  listeners(eventName) {
    this.#validateEventName(eventName);

    const regular = this.#listeners.has(eventName)
      ? [...this.#listeners.get(eventName)]
      : [];
    const once = this.#onceListeners.has(eventName)
      ? [...this.#onceListeners.get(eventName)]
      : [];

    return [...regular, ...once];
  }

  // Remove all listeners
  removeAllListeners(eventName = null) {
    if (eventName) {
      this.#validateEventName(eventName);
      this.#listeners.delete(eventName);
      this.#onceListeners.delete(eventName);
    } else {
      this.#listeners.clear();
      this.#onceListeners.clear();
    }

    return this;
  }

  // Set maximum listeners
  setMaxListeners(max) {
    if (typeof max !== "number" || max < 0) {
      throw new Error("Maximum listeners must be a non-negative number");
    }

    this.#maxListeners = max;
    return this;
  }

  // Get maximum listeners
  getMaxListeners() {
    return this.#maxListeners;
  }

  // Create a middleware system for events
  use(middleware) {
    if (typeof middleware !== "function") {
      throw new Error("Middleware must be a function");
    }

    // TODO: Implement middleware system
    // This would allow intercepting and modifying events before they reach listeners

    return this;
  }

  // Create a namespaced event bus
  namespace(prefix) {
    const namespacedBus = new EventBus(this.#maxListeners);

    // Proxy events with namespace prefix
    namespacedBus.emit = (eventName, ...args) => {
      return this.emit(`${prefix}.${eventName}`, ...args);
    };

    namespacedBus.on = (eventName, callback) => {
      return this.on(`${prefix}.${eventName}`, callback);
    };

    namespacedBus.once = (eventName, callback) => {
      return this.once(`${prefix}.${eventName}`, callback);
    };

    namespacedBus.off = (eventName, callback) => {
      return this.off(`${prefix}.${eventName}`, callback);
    };

    return namespacedBus;
  }

  // Async event emission with Promise support
  async emitAsync(eventName, ...args) {
    this.#validateEventName(eventName);

    const promises = [];

    // Collect all listeners
    const allListeners = [
      ...(this.#listeners.get(eventName) || []),
      ...(this.#onceListeners.get(eventName) || [])
    ];

    // Remove once listeners
    if (this.#onceListeners.has(eventName)) {
      this.#onceListeners.delete(eventName);
    }

    // Execute all listeners and collect promises
    for (const callback of allListeners) {
      try {
        const result = callback(...args);

        // If the result is a promise, add it to the collection
        if (result && typeof result.then === "function") {
          promises.push(result);
        }
      } catch (error) {
        console.error(
          `Error in async event listener for "${eventName}":`,
          error
        );

        if (eventName !== "error") {
          this.emit("error", error, eventName, callback);
        }
      }
    }

    // Wait for all promises to resolve
    if (promises.length > 0) {
      try {
        await Promise.all(promises);
      } catch (error) {
        console.error(
          `Error in async event handlers for "${eventName}":`,
          error
        );
        throw error;
      }
    }

    return allListeners.length > 0;
  }

  // Private validation methods
  #validateEventName(eventName) {
    if (typeof eventName !== "string" || eventName.length === 0) {
      throw new Error("Event name must be a non-empty string");
    }
  }

  #validateCallback(callback) {
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }
  }

  // Get statistics about the event bus
  getStats() {
    const eventNames = this.eventNames();
    const totalListeners = eventNames.reduce((sum, eventName) => {
      return sum + this.listenerCount(eventName);
    }, 0);

    return {
      totalEvents: eventNames.length,
      totalListeners,
      maxListeners: this.#maxListeners,
      events: eventNames.map((eventName) => ({
        name: eventName,
        listenerCount: this.listenerCount(eventName)
      }))
    };
  }

  // Debug method to inspect current state
  debug() {
    console.group("EventBus Debug Info");
    console.log("Stats:", this.getStats());
    console.log("Event Names:", this.eventNames());
    console.log("Regular Listeners:", this.#listeners);
    console.log("Once Listeners:", this.#onceListeners);
    console.groupEnd();
  }
}

export default EventBus;
