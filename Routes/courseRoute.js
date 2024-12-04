const express = require('express')
const router = express.Router()
const { getCourse, getCourseById, deleteAllCourses, createCourse } = require('../Controller/CourseController');

// Define the exact field names you're expecting from the frontend
router.post('/create',createCourse)
router.get('/getCourse', getCourse)
router.get('/getCourseByID/:id', getCourseById)
router.delete('/deleteAllCourse', deleteAllCourses)

module.exports = router