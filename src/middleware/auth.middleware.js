const jwt = require('jsonwebtoken');
const { User } = require('../../database/models');

const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token missing'
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.user_id);
    if (!user) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized'
      });
    }

    req.user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

module.exports = authenticateJWT;
