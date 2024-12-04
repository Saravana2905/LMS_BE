const Course = require('../Model/courseModel');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Create Course
exports.createCourse = async (req, res) => {
  try {
    const { courseTitle, courseDescription, courseCategory, courseDuration, courseSeat, courseAmount, courseVideoTitle } = req.body;

    // Validate required fields
    if (!courseTitle || !courseDescription || !courseCategory || !courseDuration || !courseSeat || !courseAmount || !courseVideoTitle) {
      return res.status(400).json({
        success: false,
        message: "All fields are required except file uploads"
      });
    }

    // Upload files to Cloudinary if present
    const courseVideo = req.files['courseVideo'] ? await cloudinary.uploader.upload(req.files['courseVideo'][0].path) : null;
    const courseThumbnail = req.files['courseThumbnail'] ? await cloudinary.uploader.upload(req.files['courseThumbnail'][0].path) : null;
    const courseAttachments = req.files['courseAttachment'] ? await Promise.all(req.files['courseAttachment'].map(file => cloudinary.uploader.upload(file.path))) : [];
    const courseAttachmentUrls = courseAttachments.map(attachment => attachment.secure_url);

    // Create course object
    const newCourse = new Course({
      courseTitle,
      courseDescription,
      courseCategory,
      courseDuration,
      courseSeat,
      courseAmount,
      courseVideoTitle,
      courseVideo: courseVideo ? courseVideo.secure_url : '',
      courseThumbnail: courseThumbnail ? courseThumbnail.secure_url : '',
      courseAttachment: courseAttachmentUrls
    });

    await newCourse.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse
    });
  } catch (error) {
    console.error("Error creating course:", error.message);
    res.status(500).json({
      success: false,
      message: "Error creating course",
      error: error.message
    });
  }
};

// Get all courses
exports.getCourse = async (req, res) => {
  try {
    const courses = await Course.find();
    const totalCourses = courses.length;

    res.status(200).json({
      success: true,
      totalCourses,
      courses
    });
  } catch (error) {
    console.error("Error getting courses:", error.message);
    res.status(500).json({
      success: false,
      message: "Error getting courses",
      error: error.message
    });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course not found with id: ${id}`
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    console.error("Error getting course by id:", error.message);
    res.status(500).json({
      success: false,
      message: "Error getting course by id",
      error: error.message
    });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const courseData = req.body;

    // Assuming you have the public IDs of the images/videos to delete
    const publicIdsToDelete = [courseData.oldImagePublicId, courseData.oldVideoPublicId].filter(Boolean);

    // Check if there are public IDs to delete
    if (publicIdsToDelete.length > 0) {
      // Delete files from Cloudinary
      await Promise.all(publicIdsToDelete.map(publicId => {
        if (!publicId) {
          throw new Error('Missing required parameter - public_id');
        }
        return cloudinary.uploader.destroy(publicId);
      }));
    }

    // Update course logic here
    // ...

    res.status(200).json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    
    const course = await Course.findByIdAndDelete(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting course:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting course"
    });
  }
};

// Delete all courses
exports.deleteAllCourses = async (req, res) => {
  try {
    const countBefore = await Course.countDocuments();
    const result = await Course.deleteMany({});

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No courses found to delete",
        totalDeleted: 0
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} courses`,
      totalDeleted: result.deletedCount,
      previousCount: countBefore,
      remainingCount: 0
    });
  } catch (error) {
    console.error("Error deleting all courses:", error.message);
    res.status(500).json({
      success: false,
      message: "Error deleting all courses",
      error: error.message
    });
  }
};
