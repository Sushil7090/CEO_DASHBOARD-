// controllers/userController.js

const { User, Course } = require('../database/models');  // ✅ important

exports.createAndEnroll = async (req, res) => {
  try {
    const { userId, title } = req.body;

    // validate
    if (!userId || !title) {
      return res.status(400).json({
        success: false,
        message: "userId and title are required"
      });
    }

    // check user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // create course
    const course = await Course.create({
      title,
      userId
    });

    res.status(201).json({
      success: true,
      message: "Course enrolled successfully",
      course
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
