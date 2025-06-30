/**
 * Exercise 18: Method Chaining Patterns
 *
 * Method chaining allows you to call multiple methods on the same object
 * in a single statement. This exercise explores various chaining patterns
 * and how to implement fluent interfaces.
 *
 * Difficulty: 🟡 Intermediate
 */

// ==========================================
// EXERCISE 1: Basic Method Chaining
// ==========================================

/**
 * TODO: Create a simple calculator with method chaining
 *
 * Requirements:
 * - Support basic arithmetic operations
 * - Allow chaining multiple operations
 * - Return the result when needed
 */
class Calculator {
  constructor(value = 0) {
    this.value = value;
  }

  // TODO: Implement chainable arithmetic methods
  add(n) {
    // TODO: Add n to current value and return this for chaining
  }

  subtract(n) {
    // TODO: Subtract n from current value and return this for chaining
  }

  multiply(n) {
    // TODO: Multiply current value by n and return this for chaining
  }

  divide(n) {
    // TODO: Divide current value by n and return this for chaining
  }

  // TODO: Implement power method
  power(n) {
    // TODO: Raise current value to power n and return this for chaining
  }

  // TODO: Implement result method to get final value
  result() {
    // TODO: Return the current value
  }

  // TODO: Implement reset method
  reset() {
    // TODO: Reset value to 0 and return this for chaining
  }
}

// TODO: Test the calculator
// const result = new Calculator(10).add(5).multiply(2).subtract(3).result();

// ==========================================
// EXERCISE 2: Array Processing Chain
// ==========================================

/**
 * TODO: Create a fluent array processing interface
 *
 * Requirements:
 * - Wrap array operations in a chainable interface
 * - Support map, filter, reduce, and other operations
 * - Allow conversion back to regular array
 */
class FluentArray {
  constructor(array) {
    this.data = array;
  }

  // TODO: Implement chainable map
  map(fn) {
    // TODO: Apply map and return new FluentArray for chaining
  }

  // TODO: Implement chainable filter
  filter(predicate) {
    // TODO: Apply filter and return new FluentArray for chaining
  }

  // TODO: Implement chainable sort
  sort(compareFn) {
    // TODO: Apply sort and return new FluentArray for chaining
  }

  // TODO: Implement chainable reverse
  reverse() {
    // TODO: Apply reverse and return new FluentArray for chaining
  }

  // TODO: Implement chainable slice
  slice(start, end) {
    // TODO: Apply slice and return new FluentArray for chaining
  }

  // TODO: Implement terminal operations
  reduce(reducer, initial) {
    // TODO: Apply reduce and return result (not chainable)
  }

  find(predicate) {
    // TODO: Find element and return result (not chainable)
  }

  toArray() {
    // TODO: Return the underlying array
  }

  // TODO: Static factory method
  static from(array) {
    return new FluentArray(array);
  }
}

// TODO: Test the fluent array
// const result = FluentArray.from([1, 2, 3, 4, 5])
//     .map(x => x * 2)
//     .filter(x => x > 4)
//     .sort((a, b) => b - a)
//     .toArray();

// ==========================================
// EXERCISE 3: Query Builder Pattern
// ==========================================

/**
 * TODO: Create a SQL-like query builder with method chaining
 *
 * Requirements:
 * - Support SELECT, FROM, WHERE, ORDER BY, LIMIT
 * - Allow chaining of conditions
 * - Generate query string or execute against data
 */
class QueryBuilder {
  constructor() {
    this.query = {
      select: [],
      from: null,
      where: [],
      orderBy: [],
      limit: null
    };
  }

  // TODO: Implement SELECT clause
  select(...fields) {
    // TODO: Add fields to select and return this for chaining
  }

  // TODO: Implement FROM clause
  from(table) {
    // TODO: Set table name and return this for chaining
  }

  // TODO: Implement WHERE clause
  where(condition) {
    // TODO: Add where condition and return this for chaining
  }

  // TODO: Implement AND condition
  and(condition) {
    // TODO: Add AND condition and return this for chaining
  }

  // TODO: Implement OR condition
  or(condition) {
    // TODO: Add OR condition and return this for chaining
  }

  // TODO: Implement ORDER BY clause
  orderBy(field, direction = "ASC") {
    // TODO: Add order by clause and return this for chaining
  }

  // TODO: Implement LIMIT clause
  limit(count) {
    // TODO: Set limit and return this for chaining
  }

  // TODO: Build query string
  build() {
    // TODO: Generate SQL query string
  }

  // TODO: Execute against data
  execute(data) {
    // TODO: Execute query against provided data array
  }
}

// TODO: Test the query builder
// const query = new QueryBuilder()
//     .select('name', 'age')
//     .from('users')
//     .where('age > 18')
//     .and('active = true')
//     .orderBy('name')
//     .limit(10)
//     .build();

// ==========================================
// EXERCISE 4: Validation Chain
// ==========================================

/**
 * TODO: Create a validation system with method chaining
 *
 * Requirements:
 * - Chain multiple validation rules
 * - Collect all validation errors
 * - Support custom validation functions
 * - Provide fluent error reporting
 */
class Validator {
  constructor(value) {
    this.value = value;
    this.errors = [];
    this.fieldName = "value";
  }

  // TODO: Set field name for error messages
  field(name) {
    // TODO: Set field name and return this for chaining
  }

  // TODO: Required validation
  required(message = "is required") {
    // TODO: Check if value exists and add error if not
    return this;
  }

  // TODO: Minimum length validation
  minLength(min, message = `must be at least ${min} characters`) {
    // TODO: Check minimum length and add error if invalid
    return this;
  }

  // TODO: Maximum length validation
  maxLength(max, message = `must be no more than ${max} characters`) {
    // TODO: Check maximum length and add error if invalid
    return this;
  }

  // TODO: Pattern validation
  pattern(regex, message = "format is invalid") {
    // TODO: Check pattern and add error if invalid
    return this;
  }

  // TODO: Custom validation
  custom(fn, message = "is invalid") {
    // TODO: Run custom validation function and add error if invalid
    return this;
  }

  // TODO: Email validation
  email(message = "must be a valid email") {
    // TODO: Validate email format
    return this;
  }

  // TODO: Number validation
  isNumber(message = "must be a number") {
    // TODO: Check if value is a number
    return this;
  }

  // TODO: Range validation
  range(min, max, message = `must be between ${min} and ${max}`) {
    // TODO: Check if number is in range
    return this;
  }

  // TODO: Get validation results
  isValid() {
    return this.errors.length === 0;
  }

  getErrors() {
    return this.errors;
  }

  getFirstError() {
    return this.errors[0] || null;
  }
}

// TODO: Create validation factory
function validate(value) {
  return new Validator(value);
}

// TODO: Test validation chain
// const emailValidation = validate('user@example.com')
//     .field('email')
//     .required()
//     .email()
//     .maxLength(50);

// ==========================================
// EXERCISE 5: Promise Chain Enhancement
// ==========================================

/**
 * TODO: Create enhanced Promise chaining utilities
 *
 * Requirements:
 * - Add retry functionality
 * - Add timeout handling
 * - Add conditional execution
 * - Support parallel execution
 */
class EnhancedPromise {
  constructor(promise) {
    this.promise = promise;
  }

  // TODO: Add retry functionality
  retry(attempts = 3, delay = 1000) {
    // TODO: Retry promise on failure
    return this;
  }

  // TODO: Add timeout
  timeout(ms) {
    // TODO: Add timeout to promise
    return this;
  }

  // TODO: Conditional execution
  when(condition) {
    // TODO: Execute only when condition is true
    return this;
  }

  // TODO: Default value on rejection
  defaultTo(value) {
    // TODO: Return default value on promise rejection
    return this;
  }

  // TODO: Log progress
  log(message) {
    // TODO: Log message and pass through value
    return this;
  }

  // TODO: Transform result
  map(fn) {
    // TODO: Transform promise result
    return this;
  }

  // TODO: Execute and return underlying promise
  execute() {
    return this.promise;
  }

  // TODO: Static factory method
  static of(value) {
    return new EnhancedPromise(Promise.resolve(value));
  }

  static from(promise) {
    return new EnhancedPromise(promise);
  }
}

// TODO: Test enhanced promises
// EnhancedPromise.from(fetch('/api/data'))
//     .retry(3, 1000)
//     .timeout(5000)
//     .log('Fetching data...')
//     .map(response => response.json())
//     .defaultTo([])
//     .execute();

// ==========================================
// EXERCISE 6: HTTP Request Builder
// ==========================================

/**
 * TODO: Create an HTTP request builder with method chaining
 *
 * Requirements:
 * - Support different HTTP methods
 * - Allow setting headers, query parameters, body
 * - Support authentication
 * - Handle request/response transformations
 */
class HttpRequestBuilder {
  constructor(baseUrl = "") {
    this.config = {
      url: baseUrl,
      method: "GET",
      headers: {},
      params: {},
      body: null,
      timeout: 5000
    };
  }

  // TODO: Set HTTP method
  get(path = "") {
    // TODO: Set method to GET and optionally append path
    return this;
  }

  post(path = "") {
    // TODO: Set method to POST and optionally append path
    return this;
  }

  put(path = "") {
    // TODO: Set method to PUT and optionally append path
    return this;
  }

  delete(path = "") {
    // TODO: Set method to DELETE and optionally append path
    return this;
  }

  // TODO: Set headers
  header(name, value) {
    // TODO: Set single header and return this for chaining
    return this;
  }

  headers(headerObj) {
    // TODO: Set multiple headers and return this for chaining
    return this;
  }

  // TODO: Set query parameters
  param(name, value) {
    // TODO: Set single parameter and return this for chaining
    return this;
  }

  params(paramObj) {
    // TODO: Set multiple parameters and return this for chaining
    return this;
  }

  // TODO: Set request body
  body(data) {
    // TODO: Set request body and return this for chaining
    return this;
  }

  json(data) {
    // TODO: Set JSON body and content-type header
    return this;
  }

  // TODO: Set authentication
  auth(token) {
    // TODO: Set authorization header
    return this;
  }

  basicAuth(username, password) {
    // TODO: Set basic authentication
    return this;
  }

  // TODO: Set timeout
  timeout(ms) {
    // TODO: Set request timeout
    return this;
  }

  // TODO: Execute request
  send() {
    // TODO: Execute the HTTP request and return promise
  }

  // TODO: Static factory methods
  static create(baseUrl) {
    return new HttpRequestBuilder(baseUrl);
  }
}

// TODO: Test HTTP request builder
// HttpRequestBuilder.create('https://api.example.com')
//     .get('/users')
//     .param('page', 1)
//     .param('limit', 10)
//     .header('Accept', 'application/json')
//     .auth('bearer-token')
//     .timeout(3000)
//     .send();

// ==========================================
// EXERCISE 7: Data Transformation Pipeline
// ==========================================

/**
 * TODO: Create a data transformation pipeline with method chaining
 *
 * Requirements:
 * - Support various transformation operations
 * - Allow conditional transformations
 * - Support async transformations
 * - Provide debugging capabilities
 */
class DataPipeline {
  constructor(data) {
    this.data = data;
    this.steps = [];
  }

  // TODO: Transform data
  transform(fn) {
    // TODO: Add transformation function and return this for chaining
    return this;
  }

  // TODO: Filter data
  filter(predicate) {
    // TODO: Add filter operation and return this for chaining
    return this;
  }

  // TODO: Map data
  map(fn) {
    // TODO: Add map operation and return this for chaining
    return this;
  }

  // TODO: Conditional transformation
  when(condition, fn) {
    // TODO: Apply transformation only when condition is true
    return this;
  }

  // TODO: Async transformation
  async(fn) {
    // TODO: Add async transformation
    return this;
  }

  // TODO: Debug step
  debug(label) {
    // TODO: Log current data with label
    return this;
  }

  // TODO: Validate data
  validate(validator) {
    // TODO: Add validation step
    return this;
  }

  // TODO: Execute pipeline
  execute() {
    // TODO: Execute all transformation steps
  }

  async executeAsync() {
    // TODO: Execute all steps including async ones
  }

  // TODO: Static factory method
  static from(data) {
    return new DataPipeline(data);
  }
}

// TODO: Test data pipeline
// const result = DataPipeline.from(rawData)
//     .filter(item => item.active)
//     .map(item => ({ ...item, processed: true }))
//     .when(needsValidation, data => validate(data))
//     .debug('After processing')
//     .execute();

// ==========================================
// EXERCISE 8: Configuration Builder
// ==========================================

/**
 * TODO: Create a configuration builder with method chaining
 *
 * Requirements:
 * - Support nested configuration
 * - Allow environment-specific settings
 * - Support validation and defaults
 * - Generate final configuration object
 */
class ConfigBuilder {
  constructor() {
    this.config = {};
    this.environment = "development";
  }

  // TODO: Set environment
  env(environment) {
    // TODO: Set environment and return this for chaining
    return this;
  }

  // TODO: Set configuration value
  set(key, value) {
    // TODO: Set configuration value and return this for chaining
    return this;
  }

  // TODO: Set nested configuration
  nested(key, builderFn) {
    // TODO: Set nested configuration using builder function
    return this;
  }

  // TODO: Set default value
  default(key, value) {
    // TODO: Set default value if not already set
    return this;
  }

  // TODO: Environment-specific configuration
  when(env, builderFn) {
    // TODO: Apply configuration only for specific environment
    return this;
  }

  // TODO: Validate configuration
  validate(validator) {
    // TODO: Add validation function
    return this;
  }

  // TODO: Build final configuration
  build() {
    // TODO: Generate and validate final configuration object
  }

  // TODO: Static factory method
  static create() {
    return new ConfigBuilder();
  }
}

// TODO: Test configuration builder
// const config = ConfigBuilder.create()
//     .env('production')
//     .set('port', 3000)
//     .nested('database', db => db
//         .set('host', 'localhost')
//         .set('port', 5432)
//     )
//     .when('development', dev => dev
//         .set('debug', true)
//     )
//     .build();

// ==========================================
// EXERCISE 9: Animation Chain
// ==========================================

/**
 * TODO: Create an animation system with method chaining
 *
 * Requirements:
 * - Support sequential and parallel animations
 * - Allow easing functions
 * - Support delays and duration
 * - Provide playback controls
 */
class AnimationChain {
  constructor(element) {
    this.element = element;
    this.animations = [];
    this.currentIndex = 0;
  }

  // TODO: Animate to specific values
  to(properties, duration = 1000, easing = "ease") {
    // TODO: Add animation step and return this for chaining
    return this;
  }

  // TODO: Animate by relative values
  by(properties, duration = 1000, easing = "ease") {
    // TODO: Add relative animation step and return this for chaining
    return this;
  }

  // TODO: Add delay
  delay(ms) {
    // TODO: Add delay step and return this for chaining
    return this;
  }

  // TODO: Set easing function
  easing(easingFunction) {
    // TODO: Set easing for next animation and return this for chaining
    return this;
  }

  // TODO: Add callback
  then(callback) {
    // TODO: Add callback step and return this for chaining
    return this;
  }

  // TODO: Repeat animation
  repeat(count = 1) {
    // TODO: Set repeat count and return this for chaining
    return this;
  }

  // TODO: Play animation chain
  play() {
    // TODO: Start playing animation sequence
    return this;
  }

  // TODO: Pause animation
  pause() {
    // TODO: Pause current animation
    return this;
  }

  // TODO: Stop animation
  stop() {
    // TODO: Stop and reset animation
    return this;
  }

  // TODO: Static factory method
  static animate(element) {
    return new AnimationChain(element);
  }
}

// TODO: Test animation chain
// AnimationChain.animate(element)
//     .to({ opacity: 0 }, 500)
//     .delay(200)
//     .to({ transform: 'translateX(100px)' }, 800, 'ease-out')
//     .then(() => console.log('Animation complete'))
//     .play();

// ==========================================
// EXERCISE 10: Method Chaining Best Practices
// ==========================================

/**
 * TODO: Demonstrate best practices for method chaining
 *
 * 1. Immutability vs Mutability
 * 2. Error handling in chains
 * 3. Type safety with TypeScript
 * 4. Performance considerations
 * 5. Debugging chained operations
 */

// TODO: Create immutable chaining example
class ImmutableList {
  constructor(items = []) {
    this._items = [...items];
  }

  // TODO: All methods return new instances
  add(item) {
    // TODO: Return new ImmutableList with added item
  }

  remove(index) {
    // TODO: Return new ImmutableList with item removed
  }

  map(fn) {
    // TODO: Return new ImmutableList with mapped items
  }

  filter(predicate) {
    // TODO: Return new ImmutableList with filtered items
  }

  toArray() {
    return [...this._items];
  }
}

// TODO: Create error-handling chaining example
class SafeChain {
  constructor(value, error = null) {
    this.value = value;
    this.error = error;
  }

  // TODO: Chain operations safely
  map(fn) {
    // TODO: Apply function only if no error exists
  }

  flatMap(fn) {
    // TODO: Chain operations that might fail
  }

  recover(fn) {
    // TODO: Recover from error
  }

  getOrElse(defaultValue) {
    // TODO: Get value or default if error exists
  }
}

console.log("Method Chaining exercises loaded. Implement the TODOs above!");
