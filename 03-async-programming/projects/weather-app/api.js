// API Configuration and functions
class WeatherAPI {
  constructor() {
    // Replace with your OpenWeatherMap API key
    this.API_KEY = "YOUR_API_KEY_HERE";
    this.BASE_URL = "https://api.openweathermap.org/data/2.5";
    this.GEO_URL = "https://api.openweathermap.org/geo/1.0";
    this.ICON_URL = "https://openweathermap.org/img/wn";

    // Cache configuration
    this.cache = new Map();
    this.CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  }

  // Check if API key is configured
  isConfigured() {
    return this.API_KEY && this.API_KEY !== "YOUR_API_KEY_HERE";
  }

  // Get cached data if available and not expired
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }
    return null;
  }

  // Cache data with timestamp
  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Build API URL with parameters
  buildURL(endpoint, params = {}) {
    const url = new URL(`${this.BASE_URL}/${endpoint}`);
    url.searchParams.append("appid", this.API_KEY);
    url.searchParams.append("units", "metric");

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    return url.toString();
  }

  // Generic API request with error handling
  async makeRequest(url, cacheKey = null) {
    try {
      // Check cache first
      if (cacheKey) {
        const cached = this.getCachedData(cacheKey);
        if (cached) {
          return cached;
        }
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new APIError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();

      // Cache successful responses
      if (cacheKey) {
        this.setCachedData(cacheKey, data);
      }

      return data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError("Network error: Please check your connection", 0);
    }
  }

  // Get current weather by city name
  async getCurrentWeather(cityName) {
    if (!this.isConfigured()) {
      throw new APIError(
        "API key not configured. Please add your OpenWeatherMap API key.",
        401
      );
    }

    const url = this.buildURL("weather", { q: cityName });
    const cacheKey = `weather_${cityName.toLowerCase()}`;

    return await this.makeRequest(url, cacheKey);
  }

  // Get current weather by coordinates
  async getCurrentWeatherByCoords(lat, lon) {
    if (!this.isConfigured()) {
      throw new APIError(
        "API key not configured. Please add your OpenWeatherMap API key.",
        401
      );
    }

    const url = this.buildURL("weather", { lat, lon });
    const cacheKey = `weather_${lat}_${lon}`;

    return await this.makeRequest(url, cacheKey);
  }

  // Get 5-day forecast
  async getForecast(cityName) {
    if (!this.isConfigured()) {
      throw new APIError(
        "API key not configured. Please add your OpenWeatherMap API key.",
        401
      );
    }

    const url = this.buildURL("forecast", { q: cityName });
    const cacheKey = `forecast_${cityName.toLowerCase()}`;

    return await this.makeRequest(url, cacheKey);
  }

  // Get 5-day forecast by coordinates
  async getForecastByCoords(lat, lon) {
    if (!this.isConfigured()) {
      throw new APIError(
        "API key not configured. Please add your OpenWeatherMap API key.",
        401
      );
    }

    const url = this.buildURL("forecast", { lat, lon });
    const cacheKey = `forecast_${lat}_${lon}`;

    return await this.makeRequest(url, cacheKey);
  }

  // Geocoding - get coordinates from city name
  async getCoordinates(cityName) {
    if (!this.isConfigured()) {
      throw new APIError(
        "API key not configured. Please add your OpenWeatherMap API key.",
        401
      );
    }

    const url = `${this.GEO_URL}/direct?q=${encodeURIComponent(
      cityName
    )}&limit=5&appid=${this.API_KEY}`;
    const cacheKey = `geo_${cityName.toLowerCase()}`;

    const data = await this.makeRequest(url, cacheKey);

    if (!data || data.length === 0) {
      throw new APIError(
        `City "${cityName}" not found. Please check the spelling.`,
        404
      );
    }

    return data;
  }

  // Get weather icon URL
  getIconURL(iconCode, size = "2x") {
    return `${this.ICON_URL}/${iconCode}@${size}.png`;
  }

  // Search cities for autocomplete
  async searchCities(query) {
    try {
      const data = await this.getCoordinates(query);
      return data.map((item) => ({
        name: item.name,
        country: item.country,
        state: item.state || "",
        lat: item.lat,
        lon: item.lon,
        displayName: `${item.name}${item.state ? ", " + item.state : ""}, ${
          item.country
        }`
      }));
    } catch (error) {
      return [];
    }
  }

  // Get weather data with geolocation
  async getWeatherByLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new APIError("Geolocation is not supported by this browser.", 0)
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const weather = await this.getCurrentWeatherByCoords(
              latitude,
              longitude
            );
            resolve(weather);
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          let message = "Unable to retrieve your location.";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "Location access denied by user.";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              message = "Location request timed out.";
              break;
          }
          reject(new APIError(message, error.code));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }
}

// Custom error class for API errors
class APIError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "APIError";
    this.status = status;
  }
}

// Export for use in other files
window.WeatherAPI = WeatherAPI;
window.APIError = APIError;
