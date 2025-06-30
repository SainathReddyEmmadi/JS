// UI manipulation functions
class WeatherUI {
  constructor() {
    this.elements = {
      weatherCard: document.getElementById("weatherCard"),
      weatherContent: document.getElementById("weatherContent"),
      cityName: document.getElementById("cityName"),
      currentDate: document.getElementById("currentDate"),
      temperature: document.getElementById("temperature"),
      feelsLike: document.getElementById("feelsLike"),
      description: document.getElementById("description"),
      iconImage: document.getElementById("iconImage"),
      humidity: document.getElementById("humidity"),
      windSpeed: document.getElementById("windSpeed"),
      pressure: document.getElementById("pressure"),
      visibility: document.getElementById("visibility"),
      forecastContainer: document.getElementById("forecastContainer"),
      favoritesContainer: document.getElementById("favoritesContainer"),
      suggestions: document.getElementById("suggestions"),
      errorModal: document.getElementById("errorModal"),
      errorMessage: document.getElementById("errorMessage"),
      toastContainer: document.getElementById("toastContainer")
    };
  }

  // Show loading state
  showLoading() {
    this.elements.weatherCard.classList.add("loading");
    this.elements.weatherContent.classList.add("hidden");

    // Show forecast loading
    this.elements.forecastContainer.innerHTML = `
            <div class="forecast-loading">
                <div class="loading-spinner"></div>
                <p>Loading forecast...</p>
            </div>
        `;
  }

  // Hide loading state
  hideLoading() {
    this.elements.weatherCard.classList.remove("loading");
    this.elements.weatherContent.classList.remove("hidden");
  }

  // Show welcome state
  showWelcomeState() {
    this.elements.weatherCard.classList.remove("loading");
    this.elements.weatherContent.innerHTML = `
            <div class="welcome-state">
                <div class="welcome-icon">🌍</div>
                <h2>Welcome to Weather Dashboard</h2>
                <p>Search for a city or use your current location to get started</p>
                <div class="welcome-features">
                    <div class="feature">
                        <span class="feature-icon">🔍</span>
                        <span>Search any city worldwide</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">📍</span>
                        <span>Use your current location</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">📊</span>
                        <span>View 5-day forecast</span>
                    </div>
                    <div class="feature">
                        <span class="feature-icon">⭐</span>
                        <span>Save favorite cities</span>
                    </div>
                </div>
            </div>
        `;
    this.elements.weatherContent.classList.remove("hidden");
  }

  // Display current weather data
  displayCurrentWeather(data) {
    this.hideLoading();

    // Reset content structure
    this.elements.weatherContent.innerHTML = `
            <div class="weather-header">
                <h2 class="city-name" id="cityName"></h2>
                <p class="date" id="currentDate"></p>
            </div>

            <div class="weather-main">
                <div class="weather-icon" id="weatherIcon">
                    <img src="" alt="" id="iconImage">
                </div>
                <div class="temperature-section">
                    <span class="temperature" id="temperature"></span>
                    <div class="feels-like">
                        Feels like <span id="feelsLike"></span>
                    </div>
                </div>
            </div>

            <p class="weather-description" id="description"></p>

            <div class="weather-details">
                <div class="detail-item">
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value" id="humidity"></span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Wind Speed</span>
                    <span class="detail-value" id="windSpeed"></span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Pressure</span>
                    <span class="detail-value" id="pressure"></span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Visibility</span>
                    <span class="detail-value" id="visibility"></span>
                </div>
            </div>
        `;

    // Update elements references
    this.elements.cityName = document.getElementById("cityName");
    this.elements.currentDate = document.getElementById("currentDate");
    this.elements.temperature = document.getElementById("temperature");
    this.elements.feelsLike = document.getElementById("feelsLike");
    this.elements.description = document.getElementById("description");
    this.elements.iconImage = document.getElementById("iconImage");
    this.elements.humidity = document.getElementById("humidity");
    this.elements.windSpeed = document.getElementById("windSpeed");
    this.elements.pressure = document.getElementById("pressure");
    this.elements.visibility = document.getElementById("visibility");

    // Populate with data
    this.elements.cityName.textContent = `${data.name}, ${data.sys.country}`;
    this.elements.currentDate.textContent = new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );

    this.elements.temperature.textContent = `${Math.round(data.main.temp)}°C`;
    this.elements.feelsLike.textContent = `${Math.round(
      data.main.feels_like
    )}°C`;
    this.elements.description.textContent = this.capitalize(
      data.weather[0].description
    );

    // Weather icon
    const iconCode = data.weather[0].icon;
    this.elements.iconImage.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    this.elements.iconImage.alt = data.weather[0].description;

    // Weather details
    this.elements.humidity.textContent = `${data.main.humidity}%`;
    this.elements.windSpeed.textContent = `${Math.round(
      data.wind.speed * 3.6
    )} km/h`;
    this.elements.pressure.textContent = `${data.main.pressure} hPa`;
    this.elements.visibility.textContent = `${(data.visibility / 1000).toFixed(
      1
    )} km`;
  }

  // Display 5-day forecast
  displayForecast(data) {
    const dailyForecasts = this.processForecastData(data.list);

    this.elements.forecastContainer.innerHTML = dailyForecasts
      .map(
        (day) => `
            <div class="forecast-card">
                <div class="forecast-date">${day.date}</div>
                <div class="forecast-icon">
                    <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.description}">
                </div>
                <div class="forecast-temps">
                    <span class="temp-high">${day.tempHigh}°</span>
                    <span class="temp-low">${day.tempLow}°</span>
                </div>
                <div class="forecast-description">${day.description}</div>
                <div class="forecast-details">
                    <div class="detail">
                        <span class="icon">💧</span>
                        <span>${day.humidity}%</span>
                    </div>
                    <div class="detail">
                        <span class="icon">💨</span>
                        <span>${day.windSpeed} km/h</span>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  // Process forecast data to get daily summaries
  processForecastData(forecastList) {
    const dailyData = {};

    forecastList.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric"
          }),
          temps: [],
          descriptions: [],
          icons: [],
          humidity: [],
          windSpeed: []
        };
      }

      dailyData[dateKey].temps.push(item.main.temp);
      dailyData[dateKey].descriptions.push(item.weather[0].description);
      dailyData[dateKey].icons.push(item.weather[0].icon);
      dailyData[dateKey].humidity.push(item.main.humidity);
      dailyData[dateKey].windSpeed.push(item.wind.speed * 3.6);
    });

    return Object.values(dailyData)
      .slice(0, 5)
      .map((day) => ({
        date: day.date,
        tempHigh: Math.round(Math.max(...day.temps)),
        tempLow: Math.round(Math.min(...day.temps)),
        description: this.capitalize(day.descriptions[0]),
        icon: day.icons[0],
        humidity: Math.round(
          day.humidity.reduce((a, b) => a + b) / day.humidity.length
        ),
        windSpeed: Math.round(
          day.windSpeed.reduce((a, b) => a + b) / day.windSpeed.length
        )
      }));
  }

  // Show city suggestions
  showSuggestions(cities, onSelect) {
    if (cities.length === 0) {
      this.hideSuggestions();
      return;
    }

    this.elements.suggestions.innerHTML = cities
      .map(
        (city) => `
            <div class="suggestion-item" data-city='${JSON.stringify(city)}'>
                <div class="suggestion-name">${city.name}</div>
                <div class="suggestion-location">${
                  city.state ? city.state + ", " : ""
                }${city.country}</div>
            </div>
        `
      )
      .join("");

    // Add click handlers
    this.elements.suggestions
      .querySelectorAll(".suggestion-item")
      .forEach((item) => {
        item.addEventListener("click", () => {
          const city = JSON.parse(item.dataset.city);
          onSelect(city);
        });
      });

    this.elements.suggestions.classList.remove("hidden");
  }

  // Hide suggestions
  hideSuggestions() {
    this.elements.suggestions.classList.add("hidden");
  }

  // Display favorites
  displayFavorites(favorites, handlers) {
    if (favorites.length === 0) {
      this.elements.favoritesContainer.innerHTML = `
                <p class="no-favorites">No favorite cities yet. Search for a city and add it to your favorites!</p>
            `;
      return;
    }

    this.elements.favoritesContainer.innerHTML = favorites
      .map(
        (favorite) => `
            <div class="favorite-item">
                <div class="favorite-info">
                    <div class="favorite-name">${favorite.name}</div>
                    <div class="favorite-country">${favorite.country}</div>
                </div>
                <div class="favorite-actions">
                    <button class="btn btn-small btn-primary" onclick="loadFavorite(${favorite.id})">
                        View Weather
                    </button>
                    <button class="btn btn-small btn-danger" onclick="removeFavorite(${favorite.id})">
                        Remove
                    </button>
                </div>
            </div>
        `
      )
      .join("");

    // Add global handlers
    window.loadFavorite = (id) => {
      const favorite = favorites.find((f) => f.id === id);
      if (favorite) handlers.onLoad(favorite);
    };

    window.removeFavorite = (id) => {
      handlers.onRemove(id);
    };
  }

  // Show error modal
  showError(message) {
    this.elements.errorMessage.textContent = message;
    this.elements.errorModal.classList.remove("hidden");
  }

  // Hide error modal
  hideError() {
    this.elements.errorModal.classList.add("hidden");
  }

  // Show toast notification
  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icon =
      {
        success: "✅",
        error: "❌",
        warning: "⚠️",
        info: "ℹ️"
      }[type] || "ℹ️";

    toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        `;

    this.elements.toastContainer.appendChild(toast);

    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
      this.removeToast(toast);
    }, 5000);

    // Manual close
    toast.querySelector(".toast-close").addEventListener("click", () => {
      clearTimeout(autoRemove);
      this.removeToast(toast);
    });

    // Trigger show animation
    setTimeout(() => toast.classList.add("show"), 100);
  }

  // Remove toast notification
  removeToast(toast) {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }

  // Utility function to capitalize text
  capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}

// Export for use in other files
window.WeatherUI = WeatherUI;
