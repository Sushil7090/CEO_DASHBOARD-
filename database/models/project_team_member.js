'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProjectTeamMember extends Model {
    static associate(models) {

      ProjectTeamMember.belongsTo(models.Project, {
        foreignKey: 'project_id',
        targetKey: 'project_id',
        as: 'project'
      });

      ProjectTeamMember.belongsTo(models.User, {
        foreignKey: 'user_id',
        targetKey: 'id',
        as: 'user'
      });
    }
  }

  ProjectTeamMember.init(
    {
      id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,   
      primaryKey: true,
      allowNull: false
},
     project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
      },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      member_role: {
        type: DataTypes.STRING,
        allowNull: true
      },
      allocation_percentage: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      rate_per_hour: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      assigned_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('NOW()')
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('NOW()')
      }
    },
    {
      sequelize,
      modelName: 'ProjectTeamMember',
      tableName: 'project_team_members',
      timestamps: false 
    }
  );

  return ProjectTeamMember;
};
