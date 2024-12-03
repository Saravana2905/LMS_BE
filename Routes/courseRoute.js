const express = require('express')
const { createCourse, getCourse, getCourseById, updateCourse, deleteCourse, deleteAllCourses } = require('../Controller/CourseController')
const router = express.Router()


//routes
router.post('/createCourse', createCourse)
router.get('/getCourse', getCourse)
router.get('/getCourseById/:id', getCourseById)
router.put('/updateCourse/:id', updateCourse)
router.delete('/deleteCourse/:id', deleteCourse)
router.delete('/deleteAllCourses', deleteAllCourses)

module.exports = router