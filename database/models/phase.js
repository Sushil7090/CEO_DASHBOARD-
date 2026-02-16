'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Phase extends Model {
    static associate(models) {
      Phase.belongsTo(models.Project, {
        foreignKey: 'projectId',
        as: 'project',
      });
    }
  }

  Phase.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      phaseName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM('Not Started', 'In Progress', 'Completed'),
        defaultValue: 'Not Started',
      },

      budgetAllocated: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
      },

      tasks: {
        type: DataTypes.JSON,   // 👈 important
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Phase',
    }
  );

  return Phase;
};
