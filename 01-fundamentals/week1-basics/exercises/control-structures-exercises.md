# Control Structures Exercises 🎯

Complete these exercises to master if/else statements, switch statements, and ternary operators.

## 🚦 Exercise 1: Traffic Light Controller

```javascript
function trafficLightController(
  currentLight,
  isEmergency = false,
  timeElapsed = 0
) {
  // TODO: Implement a traffic light system
  //
  // Rules:
  // 1. If emergency, always return "EMERGENCY - ALL STOP"
  // 2. Normal flow: Red (30s) -> Green (25s) -> Yellow (5s) -> Red
  // 3. If timeElapsed >= duration, suggest next light
  // 4. Return an object: { action: string, nextLight: string, timeRemaining: number }
  //
  // Examples:
  // Red light, 10s elapsed -> { action: "STOP", nextLight: "red", timeRemaining: 20 }
  // Red light, 35s elapsed -> { action: "PREPARE FOR GREEN", nextLight: "green", timeRemaining: 0 }
  // Your code here
}

// Test cases
console.log(trafficLightController("red", false, 10));
console.log(trafficLightController("green", false, 30));
console.log(trafficLightController("yellow", true, 3));
console.log(trafficLightController("invalid", false, 0));
```

## 🎮 Exercise 2: Game Character Stats

```javascript
function determineCharacterClass(strength, intelligence, agility, charisma) {
  // TODO: Determine character class based on highest stat
  //
  // Classes and requirements:
  // - Warrior: strength >= 80
  // - Mage: intelligence >= 80
  // - Rogue: agility >= 80
  // - Bard: charisma >= 80
  // - Paladin: strength >= 70 AND charisma >= 70
  // - Ranger: agility >= 70 AND intelligence >= 70
  // - Jack of All Trades: all stats between 60-79
  // - Beginner: any stat < 60
  //
  // If multiple classes qualify, return the first match in order above
  // Return object: { class: string, description: string, recommendedWeapon: string }
  // Your code here
}

// Test cases
console.log(determineCharacterClass(85, 50, 60, 70)); // Should be Warrior
console.log(determineCharacterClass(75, 40, 55, 80)); // Should be Paladin
console.log(determineCharacterClass(65, 65, 65, 65)); // Should be Jack of All Trades
```

## 🏪 Exercise 3: Dynamic Pricing System

```javascript
function calculateDynamicPrice(
  basePrice,
  customerType,
  dayOfWeek,
  timeOfDay,
  itemCategory
) {
  // TODO: Implement dynamic pricing with multiple factors
  //
  // Customer discounts:
  // - "premium": 20% off
  // - "regular": 10% off
  // - "new": 5% off
  // - "student": 15% off (with valid ID)
  //
  // Day of week modifiers:
  // - Monday-Wednesday: 5% off (slow days)
  // - Thursday-Friday: regular price
  // - Saturday-Sunday: 10% markup (busy days)
  //
  // Time of day modifiers:
  // - "morning" (6-11): 5% off
  // - "afternoon" (12-17): regular price
  // - "evening" (18-21): 5% markup
  // - "night" (22-5): 10% off
  //
  // Category modifiers:
  // - "electronics": no extra modifier
  // - "clothing": 15% markup on weekends
  // - "food": 20% off if expiring (random 30% chance)
  //
  // Return: { finalPrice: number, discountsApplied: string[], totalSavings: number }
  // Your code here
}

// Test cases
console.log(
  calculateDynamicPrice(100, "premium", "monday", "morning", "electronics")
);
console.log(
  calculateDynamicPrice(50, "student", "saturday", "evening", "clothing")
);
```

## 🌦️ Exercise 4: Weather Advice System

```javascript
function getWeatherAdvice(
  temperature,
  humidity,
  windSpeed,
  precipitation,
  uvIndex
) {
  // TODO: Provide weather-based advice using nested conditionals
  //
  // Temperature advice:
  // - < 0°C: "Freezing - dress very warmly"
  // - 0-10°C: "Cold - wear layers"
  // - 11-20°C: "Cool - light jacket recommended"
  // - 21-30°C: "Comfortable - normal clothing"
  // - > 30°C: "Hot - dress lightly and stay hydrated"
  //
  // Additional conditions:
  // - High humidity (>80%) + hot temp: add "Heat index dangerous"
  // - High wind (>25 mph): add "Windy conditions - secure loose items"
  // - Precipitation: add appropriate rain/snow advice
  // - High UV (>7): add "High UV - wear sunscreen"
  //
  // Return object: {
  //   mainAdvice: string,
  //   additionalWarnings: string[],
  //   recommendedClothing: string[],
  //   safetyTips: string[]
  // }
  // Your code here
}

// Test cases
console.log(getWeatherAdvice(35, 85, 15, "none", 9));
console.log(getWeatherAdvice(-5, 60, 30, "snow", 2));
console.log(getWeatherAdvice(25, 40, 10, "light rain", 5));
```

## 🎯 Exercise 5: Grade Calculator with Curves

```javascript
function calculateFinalGrade(
  assignments,
  exams,
  participation,
  extraCredit = 0
) {
  // TODO: Calculate final grade with various grading schemes
  //
  // Grading weights:
  // - Assignments: 40% (array of scores 0-100)
  // - Exams: 50% (array of scores 0-100)
  // - Participation: 10% (single score 0-100)
  // - Extra credit: bonus points (0-10)
  //
  // Grading curves (apply in order):
  // 1. If assignment average < 70: add 5 points to final
  // 2. If exam average < 75: add 3 points to final
  // 3. If participation >= 95: add 2 points to final
  // 4. Add extra credit points
  // 5. Cap final grade at 100
  //
  // Letter grades:
  // A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: <60
  // +/- grades: top 3 points get +, bottom 3 points get -
  //
  // Return: {
  //   finalScore: number,
  //   letterGrade: string,
  //   breakdown: object,
  //   curvesApplied: string[]
  // }
  // Your code here
}

// Test cases
const assignments1 = [85, 90, 78, 92, 88];
const exams1 = [82, 89, 91];
console.log(calculateFinalGrade(assignments1, exams1, 96, 5));

const assignments2 = [65, 68, 72, 69];
const exams2 = [70, 73];
console.log(calculateFinalGrade(assignments2, exams2, 85, 0));
```

## 🎪 Exercise 6: Event Ticket Pricing

```javascript
function calculateTicketPrice(
  eventType,
  seatSection,
  purchaseDate,
  age,
  isGroupBooking = false
) {
  // TODO: Complex ticket pricing with multiple conditional factors
  //
  // Base prices by event type:
  // - "concert": { vip: 200, premium: 150, standard: 100, general: 75 }
  // - "sports": { vip: 300, premium: 200, standard: 120, general: 80 }
  // - "theater": { vip: 180, premium: 130, standard: 90, general: 60 }
  //
  // Age discounts:
  // - Under 12: 50% off
  // - 12-18 or 65+: 25% off
  // - Student (18-25): 15% off
  //
  // Purchase timing:
  // - More than 30 days early: 10% off
  // - 15-30 days early: 5% off
  // - Less than 7 days: 20% markup
  // - Day of event: 50% markup
  //
  // Group booking (5+ people): additional 15% off
  //
  // Special conditions:
  // - Tuesday shows: 25% off (except sports)
  // - Matinee theater (before 5 PM): additional 20% off
  //
  // Return: {
  //   basePrice: number,
  //   finalPrice: number,
  //   discounts: string[],
  //   surcharges: string[]
  // }
  // Your code here
}

// Test cases
const eventDate = new Date("2025-08-15");
const purchaseDate1 = new Date("2025-07-01"); // 45 days early
console.log(
  calculateTicketPrice("concert", "premium", purchaseDate1, 22, true)
);

const purchaseDate2 = new Date("2025-08-14"); // 1 day early
console.log(
  calculateTicketPrice("theater", "standard", purchaseDate2, 67, false)
);
```

## 🏆 Bonus Challenge: Smart Home Controller

```javascript
function smartHomeController(sensors, userPreferences, timeOfDay, season) {
  // TODO: Control smart home devices based on complex conditions
  //
  // Sensors object: { temperature, humidity, lightLevel, motion, doorStatus }
  // Preferences object: { targetTemp, maxHumidity, autoLights, securityMode }
  //
  // Logic to implement:
  // 1. Temperature control (heating/cooling)
  // 2. Humidity management (dehumidifier)
  // 3. Smart lighting based on time and motion
  // 4. Security system based on motion and door status
  // 5. Energy saving modes
  // 6. Seasonal adjustments
  //
  // Return object with device commands: {
  //   thermostat: { action, targetTemp },
  //   lights: { rooms: [], action, brightness },
  //   security: { armed, alerts },
  //   other: { dehumidifier, notifications }
  // }
  // Your code here
}

// Test case
const sensors = {
  temperature: 68,
  humidity: 75,
  lightLevel: 20,
  motion: ["living_room", "kitchen"],
  doorStatus: { front: "locked", back: "locked", windows: "closed" }
};

const preferences = {
  targetTemp: 72,
  maxHumidity: 60,
  autoLights: true,
  securityMode: "home"
};

console.log(smartHomeController(sensors, preferences, "evening", "winter"));
```

## 📝 Self-Assessment Questions

After completing the exercises, test your understanding:

1. **When should you use `switch` instead of `if/else`?**
2. **What are the dangers of deeply nested conditionals?**
3. **When is the ternary operator most appropriate?**
4. **How do you avoid the "assignment vs comparison" mistake?**
5. **What's the difference between `==` and `===` in conditionals?**

## 🎯 Challenge Yourself

Try to solve these without looking at solutions:

1. **Refactor nested conditionals** - Take a deeply nested if/else and refactor it using early returns
2. **Switch optimization** - Convert a long if/else chain to a switch statement
3. **Ternary practice** - Rewrite simple if/else statements using ternary operators
4. **Edge case handling** - Add proper validation and error handling to your solutions

## 🔗 Next Steps

After mastering these exercises:

1. Review your solutions for optimization opportunities
2. Practice explaining your logic to others
3. Move on to [Functions and Scope](../week2-functions/01-function-basics.md)
4. Build a mini-project combining all Week 1 concepts

## 🏅 Solutions

Solutions will be provided in a separate file. Challenge yourself to complete all exercises before checking the answers!
