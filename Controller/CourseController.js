const Course = require('../Model/courseModel')

exports.createCourse = async (req, res) => {
  try {
    const { courseTitle, courseDescription, courseCategory, courseImage, courseDuration, courseSeat, courseAmount, courseVideoTitle, courseVideo, courseThumbnail, courseAttachment } = req.body;

    // Validate required fields
    if (!courseTitle || !courseDescription || !courseCategory || !courseImage || !courseDuration || !courseSeat || !courseAmount || !courseVideoTitle || !courseVideo || !courseThumbnail || !courseAttachment) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const newCourse = new Course({ courseTitle, courseDescription, courseCategory, courseImage, courseDuration, courseSeat, courseAmount, courseVideoTitle, courseVideo, courseThumbnail, courseAttachment });

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

exports.updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updates = req.body;

    // Validate if course exists before updating
    const existingCourse = await Course.findById(courseId);
    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    // Handle file uploads if present
    if (req.files && Object.keys(req.files).length > 0) {
      const fileTypes = ['courseImage', 'courseVideo', 'courseThumbnail', 'courseAttachment'];
      const uploadedFiles = {};

      for (const fileType of fileTypes) {
        if (req.files[fileType]) {
          const file = req.files[fileType][0];
          const result = await cloudinary.uploader.upload(file.path);
          updates[fileType] = result.secure_url;
          fs.unlinkSync(file.path);
        }
      }
    }

    const course = await Course.findByIdAndUpdate(
      courseId,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    console.error("Error updating course:", error.message);
    res.status(500).json({
      success: false,
      message: "Error updating course",
      error: error.message
    });
  }
};

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

exports.deleteAllCourses = async (req, res) => {
    try {
        // First count the existing courses
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
            message: "Error deleting all courses"
        });
    }
};




