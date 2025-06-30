# Simple Class Project Template

A basic template for practicing fundamental OOP concepts in JavaScript.

## 🎯 Learning Objectives

- Practice creating classes with proper constructors
- Implement instance methods and static methods
- Use getters and setters for data access
- Apply basic encapsulation principles

## 📋 Project Requirements

Create a **Student Management System** with the following features:

### Core Classes

1. **Student Class**

   - Properties: name, id, email, courses (array)
   - Methods: addCourse(), removeCourse(), getCourses(), getGPA()
   - Getters/Setters: name, email (with validation)

2. **Course Class**

   - Properties: name, code, credits, grade
   - Methods: setGrade(), isCompleted()
   - Static method: validateGrade()

3. **StudentManager Class**
   - Properties: students (array)
   - Methods: addStudent(), removeStudent(), findStudent(), getStatistics()

## 🏗️ File Structure

```
simple-class-project/
├── README.md (this file)
├── index.html
├── src/
│   ├── Student.js
│   ├── Course.js
│   └── StudentManager.js
└── demo.js
```

## 🚀 Getting Started

1. Implement each class in its own file
2. Start with the Course class (simplest)
3. Then implement the Student class
4. Finally, create the StudentManager class
5. Test your implementation with the demo script

## ✅ Implementation Checklist

### Course Class

- [ ] Constructor with name, code, credits
- [ ] setGrade(grade) method
- [ ] isCompleted() method (returns true if grade is set)
- [ ] Static validateGrade(grade) method
- [ ] Proper getters for all properties

### Student Class

- [ ] Constructor with name, id, email
- [ ] addCourse(course) method
- [ ] removeCourse(courseCode) method
- [ ] getCourses() method
- [ ] getGPA() method (calculate from completed courses)
- [ ] Validation in setters (email format, non-empty name)

### StudentManager Class

- [ ] Constructor initializing empty students array
- [ ] addStudent(student) method
- [ ] removeStudent(studentId) method
- [ ] findStudent(studentId) method
- [ ] getStatistics() method (total students, average GPA, etc.)

## 🧪 Testing Your Implementation

Create test cases to verify:

1. **Course Creation and Grading**

   ```javascript
   const course = new Course("Mathematics", "MATH101", 3);
   course.setGrade("A");
   console.assert(course.isCompleted() === true);
   ```

2. **Student Course Management**

   ```javascript
   const student = new Student("John Doe", "S001", "john@email.com");
   student.addCourse(course);
   console.assert(student.getCourses().length === 1);
   ```

3. **GPA Calculation**
   ```javascript
   // Add multiple courses with grades and test GPA calculation
   ```

## 🎨 Enhancement Ideas

Once you complete the basic implementation, try adding:

- Course prerequisites system
- Student enrollment limits
- Grade history tracking
- Export/import functionality
- Search and filter capabilities

## 📚 Concepts Practiced

- ✅ Class constructors and initialization
- ✅ Instance methods and properties
- ✅ Static methods
- ✅ Getters and setters
- ✅ Array manipulation within objects
- ✅ Data validation
- ✅ Object composition (Student has Courses)

## 💡 Tips

1. **Start Simple** - Implement basic functionality first
2. **Validate Input** - Always check parameters in methods
3. **Use Descriptive Names** - Make your code self-documenting
4. **Test Incrementally** - Test each method as you implement it
5. **Consider Edge Cases** - What happens with invalid data?

Good luck with your implementation! 🚀
