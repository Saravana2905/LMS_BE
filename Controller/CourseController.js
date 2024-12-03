const Course = require('../Modules/courseModule')

exports.createCourse = async(req,res)=>{
    try {
        const { 
            courseTitle, courseDescription, courseCategory,courseImage, courseDuration, courseSeat, courseAmount, courseVideoTitle, courseVideo, courseThumbnail,courseAttachment} = req.body
            if (!courseTitle || !courseDescription || !courseCategory || !courseImage || !courseDuration || !courseSeat || !courseAmount || !courseVideoTitle || !courseVideo || !courseThumbnail || !courseAttachment) {
                return res.status(400).send('Please fill in all the fields');
            }

            const course = await Course.create({
                courseTitle,
        courseDescription,
        courseCategory,
        courseImage,
        courseDuration,
        courseSeat,
        courseAmount,
        courseVideoTitle,
        courseVideo,
        courseThumbnail,
        courseAttachment
            })

            res.status(200).json({
                success: true,
                course
            });
    } catch (error) {
        console.error("Error creating course:", error.message);
    res.status(500).json({
        success:false,
        message:"Error creating course"
    });
    }
}


exports.getCourse = async(req,res)=>{
    try{
        const course = await Course.find();
    const totalCourse = course.length;
    res.status(200).json({
        success: true,
        totalCourse,
        course
      });
    }
    catch(error){
        console.error("Error getting course:", error.message);
    res.status(500).json({
        success: false,
        message:"Error getting course"
    });
      }
    
}
exports.getCourseById = async(req,res)=>{
    try{
        const {id} = req.params
    const course = await Course.findById(id)
    if (!course) {
        return res.status(404).json({message: `cannot find by id ${id}`})}
    res.status(200).json({
        success: true,
        course
      });}
      catch(error){
        console.error("Error getting course by id:", error.message);
        res.status(500).json({
        success: false,
        message:"Error getting course by id:"
    });
      }
}

exports.updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const updates = req.body;

        const course = await Course.findByIdAndUpdate(
            courseId,
            updates,
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        res.status(200).json({
            success: true,
            course
        });
    } catch (error) {
        console.error("Error updating course:", error.message);
        res.status(500).json({
            success: false,
            message: "Error updating course"
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




