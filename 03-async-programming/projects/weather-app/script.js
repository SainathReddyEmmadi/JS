// Main application script
class WeatherApp {
  constructor() {
    this.api = new WeatherAPI();
    this.ui = new WeatherUI();
    this.utils = new WeatherUtils();
    this.currentCity = null;
    this.favorites = this.loadFavorites();

    this.init();
  }

  // Initialize the application
  init() {
    this.bindEvents();
    this.ui.showWelcomeState();
    this.updateFavoritesDisplay();

    // Check if API key is configured
    if (!this.api.isConfigured()) {
      this.ui.showError(
        "Please configure your OpenWeatherMap API key in api.js"
      );
    }
  }

  // Bind event listeners
  bindEvents() {
    // Search functionality
    document.getElementById("searchBtn").addEventListener("click", () => {
      this.handleSearch();
    });

    document.getElementById("cityInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.handleSearch();
      }
    });

    // Input debouncing for suggestions
    let searchTimeout;
    document.getElementById("cityInput").addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();

      if (query.length >= 2) {
        searchTimeout = setTimeout(() => {
          this.showSuggestions(query);
        }, 300);
      } else {
        this.ui.hideSuggestions();
      }
    });

    // Geolocation
    document.getElementById("locationBtn").addEventListener("click", () => {
      this.handleGeolocation();
    });

    // Favorites
    document.getElementById("addFavoriteBtn").addEventListener("click", () => {
      this.addToFavorites();
    });

    // Error modal
    document.getElementById("closeModal").addEventListener("click", () => {
      this.ui.hideError();
    });

    document.getElementById("retryBtn").addEventListener("click", () => {
      this.ui.hideError();
      this.handleSearch();
    });

    document.getElementById("dismissBtn").addEventListener("click", () => {
      this.ui.hideError();
    });

    // Click outside to close suggestions
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-container")) {
        this.ui.hideSuggestions();
      }
    });
  }

  // Handle city search
  async handleSearch() {
    const cityName = document.getElementById("cityInput").value.trim();

    if (!cityName) {
      this.ui.showToast("Please enter a city name", "warning");
      return;
    }

    try {
      this.ui.showLoading();
      this.ui.hideSuggestions();

      // Get current weather
      const weatherData = await this.api.getCurrentWeather(cityName);
      this.currentCity = {
        name: weatherData.name,
        country: weatherData.sys.country,
        coords: {
          lat: weatherData.coord.lat,
          lon: weatherData.coord.lon
        }
      };

      // Display current weather
      this.ui.displayCurrentWeather(weatherData);

      // Get and display forecast
      await this.loadForecast(cityName);

      this.ui.showToast(`Weather loaded for ${weatherData.name}`, "success");
    } catch (error) {
      console.error("Search error:", error);
      this.handleError(error);
    }
  }

  // Handle geolocation request
  async handleGeolocation() {
    try {
      this.ui.showLoading();
      this.ui.showToast("Getting your location...", "info");

      const weatherData = await this.api.getWeatherByLocation();
      this.currentCity = {
        name: weatherData.name,
        country: weatherData.sys.country,
        coords: {
          lat: weatherData.coord.lat,
          lon: weatherData.coord.lon
        }
      };

      // Update search input
      document.getElementById("cityInput").value = weatherData.name;

      // Display current weather
      this.ui.displayCurrentWeather(weatherData);

      // Get and display forecast
      await this.loadForecastByCoords(
        weatherData.coord.lat,
        weatherData.coord.lon
      );

      this.ui.showToast(
        `Weather loaded for your location: ${weatherData.name}`,
        "success"
      );
    } catch (error) {
      console.error("Geolocation error:", error);
      this.handleError(error);
    }
  }

  // Load forecast data
  async loadForecast(cityName) {
    try {
      const forecastData = await this.api.getForecast(cityName);
      this.ui.displayForecast(forecastData);
    } catch (error) {
      console.error("Forecast error:", error);
      this.ui.showToast("Could not load forecast data", "warning");
    }
  }

  // Load forecast by coordinates
  async loadForecastByCoords(lat, lon) {
    try {
      const forecastData = await this.api.getForecastByCoords(lat, lon);
      this.ui.displayForecast(forecastData);
    } catch (error) {
      console.error("Forecast error:", error);
      this.ui.showToast("Could not load forecast data", "warning");
    }
  }

  // Show city suggestions
  async showSuggestions(query) {
    try {
      const cities = await this.api.searchCities(query);
      this.ui.showSuggestions(cities, (city) => {
        document.getElementById("cityInput").value = city.name;
        this.ui.hideSuggestions();
        this.handleSearch();
      });
    } catch (error) {
      this.ui.hideSuggestions();
    }
  }

  // Handle errors
  handleError(error) {
    this.ui.hideLoading();

    let message = "An unexpected error occurred.";

    if (error instanceof APIError) {
      switch (error.status) {
        case 401:
          message = "Invalid API key. Please check your configuration.";
          break;
        case 404:
          message = error.message;
          break;
        case 429:
          message = "API rate limit exceeded. Please try again later.";
          break;
        case 0:
          message = error.message;
          break;
        default:
          message = `API Error: ${error.message}`;
      }
    }

    this.ui.showError(message);
  }

  // Favorites management
  addToFavorites() {
    if (!this.currentCity) {
      this.ui.showToast("No city selected to add to favorites", "warning");
      return;
    }

    const favorite = {
      id: Date.now(),
      name: this.currentCity.name,
      country: this.currentCity.country,
      coords: this.currentCity.coords
    };

    // Check if already in favorites
    const exists = this.favorites.some(
      (fav) =>
        fav.name.toLowerCase() === favorite.name.toLowerCase() &&
        fav.country === favorite.country
    );

    if (exists) {
      this.ui.showToast("City is already in favorites", "info");
      return;
    }

    this.favorites.push(favorite);
    this.saveFavorites();
    this.updateFavoritesDisplay();
    this.ui.showToast(`${favorite.name} added to favorites`, "success");
  }

  removeFromFavorites(id) {
    this.favorites = this.favorites.filter((fav) => fav.id !== id);
    this.saveFavorites();
    this.updateFavoritesDisplay();
    this.ui.showToast("City removed from favorites", "info");
  }

  async loadFavoriteWeather(favorite) {
    try {
      this.ui.showLoading();
      document.getElementById("cityInput").value = favorite.name;

      const weatherData = await this.api.getCurrentWeatherByCoords(
        favorite.coords.lat,
        favorite.coords.lon
      );

      this.currentCity = favorite;
      this.ui.displayCurrentWeather(weatherData);
      await this.loadForecastByCoords(favorite.coords.lat, favorite.coords.lon);

      this.ui.showToast(`Weather loaded for ${favorite.name}`, "success");
    } catch (error) {
      console.error("Favorite weather error:", error);
      this.handleError(error);
    }
  }

  updateFavoritesDisplay() {
    this.ui.displayFavorites(this.favorites, {
      onLoad: (favorite) => this.loadFavoriteWeather(favorite),
      onRemove: (id) => this.removeFromFavorites(id)
    });
  }

  // Local storage management
  loadFavorites() {
    try {
      const saved = localStorage.getItem("weather-favorites");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading favorites:", error);
      return [];
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem("weather-favorites", JSON.stringify(this.favorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
      this.ui.showToast("Could not save favorites", "warning");
    }
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new WeatherApp();
});
