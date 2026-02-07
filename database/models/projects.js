'use strict';

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    'Project',
    {
     project_id: {
  type: DataTypes.UUID,
  primaryKey: true,
  defaultValue: DataTypes.UUIDV4, 
  allowNull: false,
  },

      project_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },

      client_name: {
      type: DataTypes.STRING,
      allowNull: false, 
      defaultValue: "Unknown Client" 
      },

      project_status: {
        type: DataTypes.ENUM(
          'In Progress',
          'Completed',
          'On Hold',
          'Cancelled',
        ),
        allowNull: false,
        defaultValue: 'In Progress',
      },

      category: {
        type: DataTypes.ENUM(
          'Digital Transformation',
          'AI & ML'
        ),
        allowNull: true,
      },

      sub_category: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      project_owner: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      start_date_planned: {
       type: DataTypes.DATE,
       allowNull: true,      
       defaultValue: null     
     },
     start_date_actual: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    end_date_planned: {
     type: DataTypes.DATE,
     allowNull: true,
     defaultValue: null
    },
   end_date_actual: {
     type: DataTypes.DATE,
     allowNull: true,
     defaultValue: null
    },
    total_budget: {
     type: DataTypes.DECIMAL(15, 2),
     allowNull: true,
    },

    total_cost_to_date: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      },

    total_revenue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      },

    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'INR',
      },

      progress_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0.0,
      },

      priority: {
        type: DataTypes.ENUM('High', 'Medium', 'Low'),
        allowNull: false,
        defaultValue: 'Medium',
      },

      geography: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: 'projects',
      timestamps: true,      
      underscored: true,     
    }
  );
    
  return Project;
};'use strict';

module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    'Project',
    {
     project_id: {
  type: DataTypes.UUID,
  primaryKey: true,
  defaultValue: DataTypes.UUIDV4, 
  allowNull: false,
  },

      project_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },

      client_name: {
      type: DataTypes.STRING,
      allowNull: false, 
      defaultValue: "Unknown Client" 
      },

      project_status: {
        type: DataTypes.ENUM(
          'In Progress',
          'Completed',
          'On Hold',
          'Cancelled',
        ),
        allowNull: false,
        defaultValue: 'In Progress',
      },

      category: {
        type: DataTypes.ENUM(
          'Digital Transformation',
          'AI & ML'
        ),
        allowNull: true,
      },

      sub_category: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      project_owner: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      start_date_planned: {
       type: DataTypes.DATE,
       allowNull: true,      
       defaultValue: null     
     },
     start_date_actual: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    end_date_planned: {
     type: DataTypes.DATE,
     allowNull: true,
     defaultValue: null
    },
   end_date_actual: {
     type: DataTypes.DATE,
     allowNull: true,
     defaultValue: null
    },
    total_budget: {
     type: DataTypes.DECIMAL(15, 2),
     allowNull: true,
    },

    total_cost_to_date: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      },

    total_revenue: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      },

    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'INR',
      },

      progress_percentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0.0,
      },

      priority: {
        type: DataTypes.ENUM('High', 'Medium', 'Low'),
        allowNull: false,
        defaultValue: 'Medium',
      },

      geography: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: 'projects',
      timestamps: true,      
      underscored: true,     
    }
  );
  
   Project.associate = (models) => {
   Project.hasMany(models.ProjectTeamMember, {
    foreignKey: 'project_id',
    sourceKey: 'project_id',
    as: 'team_members',
    });
  };

  return Project;
};