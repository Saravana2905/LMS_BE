const express = require('express');
const router = express.Router();
const upload = require('../Middleware/multerConfig');
const courseController = require('../Controller/CourseController');

// Route for creating a new course
router.post('/createCourse', upload.fields([
  { name: 'courseImage', maxCount: 1 },
  { name: 'courseVideo', maxCount: 1 },
  { name: 'courseThumbnail', maxCount: 1 },
  { name: 'courseAttachment', maxCount: 10 },
]), courseController.createCourse);

// Route for getting all courses
router.get('/getCourse', courseController.getCourse);

// Route for getting course by ID
router.get('/getCourseById/:id', courseController.getCourseById);

// Route for updating a course
router.put('/updateCourseById/:id', upload.fields([
  { name: 'courseVideo', maxCount: 1 },
  { name: 'courseThumbnail', maxCount: 1 },
  { name: 'courseAttachment', maxCount: 10 },
]), courseController.updateCourse);

// Route for deleting a course
router.delete('/deleteCourseById/:id', courseController.deleteCourse);

// Route for deleting all courses
router.delete('/deleteAllCourse', courseController.deleteAllCourses);

module.exports = router;
