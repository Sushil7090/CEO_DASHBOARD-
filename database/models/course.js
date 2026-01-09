'use strict';
const { UUIDV4 } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define(
    'Course',
    {
      id: {
  type: DataTypes.UUID,
  defaultValue: DataTypes.UUIDV4,
  primaryKey: true
},
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'courses',
      freezeTableName: true,
      timestamps: true,
    }
  );

  return Course;
};
