/**
 * Exercise 14: Immutable Data Updates
 *
 * Practice updating data structures without mutation, maintaining immutability
 * while transforming arrays, objects, and nested structures.
 */

console.log("Starting Exercise 14: Immutable Data Updates");

// Array immutable updates
console.log("\n=== Array Immutable Updates ===");

const originalArray = [1, 2, 3, 4, 5];

// TODO: Adding elements immutably
const addToEnd = (arr, item) => [...arr, item];
const addToStart = (arr, item) => [item, ...arr];
const addAtIndex = (arr, index, item) => [
  ...arr.slice(0, index),
  item,
  ...arr.slice(index)
];

console.log("Original array:", originalArray);
console.log("Add to end:", addToEnd(originalArray, 6));
console.log("Add to start:", addToStart(originalArray, 0));
console.log("Add at index 2:", addAtIndex(originalArray, 2, 2.5));
console.log("Original unchanged:", originalArray);

// TODO: Removing elements immutably
const removeFromEnd = (arr) => arr.slice(0, -1);
const removeFromStart = (arr) => arr.slice(1);
const removeAtIndex = (arr, index) => [
  ...arr.slice(0, index),
  ...arr.slice(index + 1)
];
const removeByValue = (arr, value) => arr.filter((item) => item !== value);

console.log("Remove from end:", removeFromEnd(originalArray));
console.log("Remove from start:", removeFromStart(originalArray));
console.log("Remove at index 2:", removeAtIndex(originalArray, 2));
console.log("Remove value 3:", removeByValue(originalArray, 3));

// TODO: Updating elements immutably
const updateAtIndex = (arr, index, newValue) => [
  ...arr.slice(0, index),
  newValue,
  ...arr.slice(index + 1)
];

const updateByCondition = (arr, predicate, updater) =>
  arr.map((item) => (predicate(item) ? updater(item) : item));

console.log("Update at index 2:", updateAtIndex(originalArray, 2, 99));
console.log(
  "Double even numbers:",
  updateByCondition(
    originalArray,
    (x) => x % 2 === 0,
    (x) => x * 2
  )
);

// Object immutable updates
console.log("\n=== Object Immutable Updates ===");

const originalUser = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  preferences: {
    theme: "dark",
    language: "en",
    notifications: {
      email: true,
      push: false
    }
  }
};

// TODO: Adding/updating properties immutably
const updateUser = (user, updates) => ({ ...user, ...updates });

const addProperty = (obj, key, value) => ({ ...obj, [key]: value });

console.log("Original user:", originalUser);
console.log("Update name:", updateUser(originalUser, { name: "Alice Smith" }));
console.log("Add age property:", addProperty(originalUser, "age", 30));
console.log("Original unchanged:", originalUser);

// TODO: Removing properties immutably
const removeProperty = (obj, key) => {
  const { [key]: removed, ...rest } = obj;
  return rest;
};

const removeProperties = (obj, keys) => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};

console.log("Remove email:", removeProperty(originalUser, "email"));
console.log(
  "Remove multiple:",
  removeProperties(originalUser, ["email", "id"])
);

// TODO: Nested object updates
const updateNested = (obj, path, value) => {
  const [head, ...tail] = path;

  if (tail.length === 0) {
    return { ...obj, [head]: value };
  }

  return {
    ...obj,
    [head]: updateNested(obj[head] || {}, tail, value)
  };
};

console.log(
  "Update nested theme:",
  updateNested(originalUser, ["preferences", "theme"], "light")
);
console.log(
  "Update deep notification:",
  updateNested(originalUser, ["preferences", "notifications", "push"], true)
);

// TODO: Helper for deep updates
function setIn(obj, path, value) {
  if (path.length === 0) return value;

  const [head, ...tail] = path;
  const currentValue = obj && typeof obj === "object" ? obj[head] : undefined;

  return {
    ...obj,
    [head]: setIn(currentValue, tail, value)
  };
}

function updateIn(obj, path, updater) {
  const currentValue = getIn(obj, path);
  const newValue = updater(currentValue);
  return setIn(obj, path, newValue);
}

function getIn(obj, path) {
  return path.reduce((current, key) => current && current[key], obj);
}

console.log(
  "SetIn theme:",
  setIn(originalUser, ["preferences", "theme"], "auto")
);
console.log(
  "UpdateIn email count:",
  updateIn(originalUser, ["preferences", "notifications", "email"], (x) => !x)
);

// Array of objects immutable updates
console.log("\n=== Array of Objects Updates ===");

const users = [
  { id: 1, name: "Alice", active: true, score: 85 },
  { id: 2, name: "Bob", active: false, score: 92 },
  { id: 3, name: "Charlie", active: true, score: 78 }
];

// TODO: Update specific object in array
const updateUserById = (users, id, updates) =>
  users.map((user) => (user.id === id ? { ...user, ...updates } : user));

const updateUsersByCondition = (users, predicate, updates) =>
  users.map((user) => (predicate(user) ? { ...user, ...updates } : user));

console.log("Original users:", users);
console.log(
  "Update user 2:",
  updateUserById(users, 2, { active: true, score: 95 })
);
console.log(
  "Activate all users:",
  updateUsersByCondition(users, (user) => !user.active, { active: true })
);

// TODO: Add/remove users from array
const addUser = (users, newUser) => [...users, newUser];
const removeUserById = (users, id) => users.filter((user) => user.id !== id);
const removeUsersByCondition = (users, predicate) =>
  users.filter((user) => !predicate(user));

console.log(
  "Add user:",
  addUser(users, { id: 4, name: "Diana", active: true, score: 88 })
);
console.log("Remove user 2:", removeUserById(users, 2));
console.log(
  "Remove inactive users:",
  removeUsersByCondition(users, (user) => !user.active)
);

// TODO: Sort and transform arrays immutably
const sortUsersByScore = (users) =>
  [...users].sort((a, b) => b.score - a.score);
const addRanking = (users) =>
  sortUsersByScore(users).map((user, index) => ({ ...user, rank: index + 1 }));

console.log("Sorted by score:", sortUsersByScore(users));
console.log("With ranking:", addRanking(users));

// Complex nested structure updates
console.log("\n=== Complex Nested Updates ===");

const complexData = {
  company: {
    name: "TechCorp",
    departments: [
      {
        id: 1,
        name: "Engineering",
        employees: [
          { id: 101, name: "Alice", skills: ["JavaScript", "React"] },
          { id: 102, name: "Bob", skills: ["Python", "Django"] }
        ]
      },
      {
        id: 2,
        name: "Marketing",
        employees: [{ id: 201, name: "Charlie", skills: ["SEO", "Content"] }]
      }
    ]
  },
  metadata: {
    lastUpdated: "2023-01-01",
    version: "1.0"
  }
};

// TODO: Add skill to specific employee
function addSkillToEmployee(data, deptId, empId, skill) {
  return {
    ...data,
    company: {
      ...data.company,
      departments: data.company.departments.map((dept) =>
        dept.id === deptId
          ? {
              ...dept,
              employees: dept.employees.map((emp) =>
                emp.id === empId
                  ? { ...emp, skills: [...emp.skills, skill] }
                  : emp
              )
            }
          : dept
      )
    }
  };
}

// TODO: Add new employee to department
function addEmployeeToDepartment(data, deptId, employee) {
  return {
    ...data,
    company: {
      ...data.company,
      departments: data.company.departments.map((dept) =>
        dept.id === deptId
          ? { ...dept, employees: [...dept.employees, employee] }
          : dept
      )
    }
  };
}

console.log(
  "Original complex data departments:",
  complexData.company.departments.length
);

const updatedData1 = addSkillToEmployee(complexData, 1, 101, "TypeScript");
console.log(
  "After adding skill:",
  getIn(updatedData1, ["company", "departments", 0, "employees", 0, "skills"])
);

const updatedData2 = addEmployeeToDepartment(complexData, 1, {
  id: 103,
  name: "Diana",
  skills: ["Vue.js", "Node.js"]
});
console.log(
  "After adding employee:",
  updatedData2.company.departments[0].employees.length
);

// Immutable utility functions
console.log("\n=== Immutable Utility Functions ===");

// TODO: Generic immutable update utilities
function assoc(obj, key, value) {
  return { ...obj, [key]: value };
}

function dissoc(obj, key) {
  const { [key]: removed, ...rest } = obj;
  return rest;
}

function update(obj, key, updater) {
  return { ...obj, [key]: updater(obj[key]) };
}

function merge(obj1, obj2) {
  return { ...obj1, ...obj2 };
}

function pick(obj, keys) {
  const result = {};
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

const testObj = { a: 1, b: 2, c: 3, d: 4 };

console.log("Original object:", testObj);
console.log("Assoc e: 5:", assoc(testObj, "e", 5));
console.log("Dissoc b:", dissoc(testObj, "b"));
console.log(
  "Update a (double):",
  update(testObj, "a", (x) => x * 2)
);
console.log("Merge with {x: 10}:", merge(testObj, { x: 10 }));
console.log("Pick a, c:", pick(testObj, ["a", "c"]));
console.log("Omit b, d:", omit(testObj, ["b", "d"]));

// Performance considerations
console.log("\n=== Performance Considerations ===");

// TODO: Compare performance of immutable vs mutable operations
const largeArray = Array.from({ length: 10000 }, (_, i) => i);

console.time("Mutable push");
for (let i = 0; i < 1000; i++) {
  const temp = [...largeArray];
  temp.push(i);
}
console.timeEnd("Mutable push");

console.time("Immutable concat");
for (let i = 0; i < 1000; i++) {
  const temp = [...largeArray, i];
}
console.timeEnd("Immutable concat");

// TODO: Structural sharing example (conceptual)
console.log("\nStructural sharing concept:");
const original = { a: 1, b: { c: 2, d: 3 }, e: 4 };
const updated = { ...original, a: 10 };

console.log("Objects share b reference:", original.b === updated.b);
console.log("But are different objects:", original !== updated);

// Instructions:
// 1. Always create new objects/arrays instead of modifying existing ones
// 2. Use spread operator for shallow updates
// 3. Build helper functions for deep nested updates
// 4. Practice updating arrays of objects immutably
// 5. Understand the performance implications of immutability
// 6. Use utility functions for common immutable operations
// 7. Consider structural sharing for optimization
// 8. Test that original data remains unchanged after updates
