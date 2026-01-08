const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: parseInt(process.env.DB_PORT, 10),
    logging: false,
  }
);

const db = {};

// Sequelize reference
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.User = require('./user')(sequelize, DataTypes);
db.Course = require('./course')(sequelize, DataTypes);
db.UserCourse = require('./userCourses')(sequelize, DataTypes); // ✅ singular

/* =====================================================
   Associations
   Many-to-Many (Users <-> Courses through UserCourse)
===================================================== */

db.User.belongsToMany(db.Course, {
  through: db.UserCourse,
  foreignKey: 'userId',   // the column in UserCourse
  otherKey: 'courseId',
});

db.Course.belongsToMany(db.User, {
  through: db.UserCourse,
  foreignKey: 'courseId', // the column in UserCourse
  otherKey: 'userId',
});

module.exports = db;
