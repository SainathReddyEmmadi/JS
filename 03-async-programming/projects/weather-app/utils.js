// Utility functions for the weather app
class WeatherUtils {
  constructor() {
    this.debounceTimers = new Map();
  }

  // Debounce function calls
  debounce(func, delay, key = "default") {
    return (...args) => {
      clearTimeout(this.debounceTimers.get(key));
      this.debounceTimers.set(
        key,
        setTimeout(() => func.apply(this, args), delay)
      );
    };
  }

  // Throttle function calls
  throttle(func, limit, key = "default") {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // Format temperature with unit
  formatTemperature(temp, unit = "C") {
    return `${Math.round(temp)}°${unit}`;
  }

  // Convert wind speed from m/s to km/h
  convertWindSpeed(speedMs) {
    return Math.round(speedMs * 3.6);
  }

  // Convert visibility from meters to kilometers
  convertVisibility(visibilityM) {
    return (visibilityM / 1000).toFixed(1);
  }

  // Get weather condition emoji
  getWeatherEmoji(iconCode) {
    const weatherEmojis = {
      "01d": "☀️",
      "01n": "🌙", // clear sky
      "02d": "⛅",
      "02n": "☁️", // few clouds
      "03d": "☁️",
      "03n": "☁️", // scattered clouds
      "04d": "☁️",
      "04n": "☁️", // broken clouds
      "09d": "🌧️",
      "09n": "🌧️", // shower rain
      "10d": "🌦️",
      "10n": "🌧️", // rain
      "11d": "⛈️",
      "11n": "⛈️", // thunderstorm
      "13d": "❄️",
      "13n": "❄️", // snow
      "50d": "🌫️",
      "50n": "🌫️" // mist
    };

    return weatherEmojis[iconCode] || "🌤️";
  }

  // Get time of day greeting
  getTimeGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  // Format date for display
  formatDate(date, options = {}) {
    const defaultOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };

    return new Date(date).toLocaleDateString("en-US", {
      ...defaultOptions,
      ...options
    });
  }

  // Get relative time (e.g., "2 hours ago")
  getRelativeTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  }

  // Generate random ID
  generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }

  // Validate city name
  isValidCityName(name) {
    if (!name || typeof name !== "string") return false;
    return /^[a-zA-Z\s\-'\.]+$/.test(name.trim()) && name.trim().length >= 2;
  }

  // Get device info
  getDeviceInfo() {
    return {
      isMobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ),
      isOnline: navigator.onLine,
      supportsGeolocation: "geolocation" in navigator,
      supportsLocalStorage: "localStorage" in window
    };
  }

  // Deep clone object
  deepClone(obj) {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map((item) => this.deepClone(item));
    if (typeof obj === "object") {
      const cloned = {};
      Object.keys(obj).forEach((key) => {
        cloned[key] = this.deepClone(obj[key]);
      });
      return cloned;
    }
  }

  // Sanitize HTML to prevent XSS
  sanitizeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Local storage helpers with error handling
  storage = {
    get: (key, defaultValue = null) => {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (error) {
        console.error("Error reading from localStorage:", error);
        return defaultValue;
      }
    },

    set: (key, value) => {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (error) {
        console.error("Error writing to localStorage:", error);
        return false;
      }
    },

    remove: (key) => {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (error) {
        console.error("Error removing from localStorage:", error);
        return false;
      }
    },

    clear: () => {
      try {
        localStorage.clear();
        return true;
      } catch (error) {
        console.error("Error clearing localStorage:", error);
        return false;
      }
    }
  };

  // URL helpers
  url = {
    isValid: (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },

    addParams: (baseUrl, params) => {
      const url = new URL(baseUrl);
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      return url.toString();
    }
  };

  // Performance helpers
  performance = {
    mark: (name) => {
      if ("performance" in window && "mark" in performance) {
        performance.mark(name);
      }
    },

    measure: (name, startMark, endMark) => {
      if ("performance" in window && "measure" in performance) {
        try {
          performance.measure(name, startMark, endMark);
          const measure = performance.getEntriesByName(name)[0];
          return measure ? measure.duration : null;
        } catch {
          return null;
        }
      }
      return null;
    }
  };

  // Error handling helpers
  error = {
    isNetworkError: (error) => {
      return error instanceof TypeError && error.message.includes("fetch");
    },

    isTimeoutError: (error) => {
      return error.message && error.message.includes("timeout");
    },

    getErrorMessage: (error) => {
      if (error.message) return error.message;
      if (typeof error === "string") return error;
      return "An unknown error occurred";
    }
  };

  // Animation helpers
  animation = {
    fadeIn: (element, duration = 300) => {
      element.style.opacity = "0";
      element.style.display = "block";

      const start = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        element.style.opacity = progress.toString();

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    },

    fadeOut: (element, duration = 300, callback) => {
      const start = performance.now();
      const initialOpacity = parseFloat(getComputedStyle(element).opacity);

      const animate = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        element.style.opacity = (initialOpacity * (1 - progress)).toString();

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          element.style.display = "none";
          if (callback) callback();
        }
      };

      requestAnimationFrame(animate);
    }
  };
}

// Export for use in other files
window.WeatherUtils = WeatherUtils;
