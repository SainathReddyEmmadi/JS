# Weather Dashboard Project 🌤️

## Overview

Build a responsive weather dashboard that fetches real-time weather data from the OpenWeatherMap API. This project will help you practice API integration, async/await patterns, error handling, and creating a polished user interface.

## Learning Objectives

- Integrate with external APIs using fetch()
- Handle API keys and authentication
- Implement loading states and error handling
- Create responsive UI with async data
- Cache API responses for better performance
- Handle different weather conditions and display appropriate icons

## Features to Implement

### Core Features (Required)

1. **Current Weather Display**

   - Temperature, description, humidity, wind speed
   - Weather icons based on conditions
   - Location-based weather (city name input)

2. **5-Day Forecast**

   - Daily temperature highs and lows
   - Weather conditions for each day
   - Responsive card layout

3. **Loading States**

   - Skeleton screens while loading
   - Loading spinners for API calls
   - Smooth transitions between states

4. **Error Handling**
   - Invalid city names
   - Network connectivity issues
   - API rate limit exceeded
   - Graceful fallbacks

### Advanced Features (Optional)

1. **Geolocation Integration**

   - Auto-detect user location
   - Request location permissions
   - Fallback to manual city input

2. **Data Caching**

   - Cache weather data for 10 minutes
   - Offline support with cached data
   - Smart cache invalidation

3. **Additional Metrics**

   - UV index and air quality
   - Sunrise/sunset times
   - Feels-like temperature

4. **Favorites System**
   - Save favorite cities
   - Quick access to saved locations
   - Local storage persistence

## Project Structure

```
weather-app/
├── README.md           # This file
├── index.html          # Main HTML structure
├── styles.css          # CSS styling
├── script.js           # Main JavaScript logic
├── api.js              # API interaction layer
├── ui.js               # UI manipulation functions
├── utils.js            # Utility functions
└── assets/
    ├── icons/          # Weather condition icons
    └── images/         # Background images
```

## API Setup

### Getting Your API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Create a free account
3. Generate an API key
4. Note: Free tier allows 1000 calls/day

### API Endpoints Used

- **Current Weather**: `https://api.openweathermap.org/data/2.5/weather`
- **5-Day Forecast**: `https://api.openweathermap.org/data/2.5/forecast`
- **Geocoding**: `https://api.openweathermap.org/geo/1.0/direct`

## Implementation Guide

### Phase 1: Basic Setup

1. Create HTML structure with search input and display areas
2. Set up basic CSS for responsive layout
3. Implement city search functionality
4. Display current weather data

### Phase 2: Enhanced Features

1. Add 5-day forecast display
2. Implement loading states and error handling
3. Add weather icons and visual improvements
4. Create responsive design for mobile devices

### Phase 3: Advanced Features

1. Add geolocation support
2. Implement data caching
3. Add favorites functionality
4. Performance optimizations

## Technical Requirements

### HTML Structure

- Semantic HTML5 elements
- Accessible form inputs
- Proper ARIA labels
- Meta tags for mobile responsiveness

### CSS Features

- CSS Grid/Flexbox for layout
- CSS custom properties for theming
- Responsive design (mobile-first)
- Smooth animations and transitions

### JavaScript Patterns

- ES6+ syntax (async/await, destructuring)
- Modular code organization
- Error handling with try/catch
- DOM manipulation best practices

## Starter Code

See the individual files in this directory for starter templates and implementation examples.

## Testing Scenarios

### Happy Path

1. Enter valid city name → Display weather data
2. Click forecast → Show 5-day forecast
3. Use geolocation → Auto-detect and display weather

### Error Scenarios

1. Enter invalid city → Show error message
2. Network offline → Show cached data or error
3. API key invalid → Show appropriate error
4. Rate limit exceeded → Show retry message

## Performance Considerations

- Debounce search input to avoid excessive API calls
- Cache API responses to reduce redundant requests
- Lazy load forecast data only when needed
- Optimize images and use appropriate formats

## Assessment Criteria

- **Functionality** (40%): All core features work correctly
- **Code Quality** (30%): Clean, readable, well-organized code
- **User Experience** (20%): Responsive, intuitive interface
- **Error Handling** (10%): Graceful handling of edge cases

## Extension Ideas

- Dark/light theme toggle
- Weather alerts and notifications
- Historical weather data
- Weather maps integration
- Social sharing features
- PWA (Progressive Web App) capabilities

Ready to build your weather dashboard? Start with the basic HTML structure and work your way up to the advanced features! 🚀
