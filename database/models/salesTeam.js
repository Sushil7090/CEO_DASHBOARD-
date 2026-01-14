module.exports = (sequelize, DataTypes) => {
  const SalesTeam = sequelize.define(
    'SalesTeam',
    {
      employee_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },

      employee_name: {
        type: DataTypes.STRING(200),
        allowNull: false
      },

      email: {
        type: DataTypes.STRING(200),
        allowNull: false,
        unique: true
      },

      phone: {
        type: DataTypes.STRING(20)
      },

      role: {
        type: DataTypes.STRING(100)
      },

      team_name: {
        type: DataTypes.STRING(100)
      },

      team_lead_id: {
        type: DataTypes.UUID,
        allowNull: true
        // self-reference association added below
      },

      region: {
        type: DataTypes.STRING(100)
      },

      city: {
        type: DataTypes.STRING(100)
      },

      category_specialization: {
        type: DataTypes.STRING(100)
      },

      hire_date: {
        type: DataTypes.DATEONLY
      },

      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },

      sales_target_monthly: {
        type: DataTypes.DECIMAL(15, 2)
      },

      sales_target_quarterly: {
        type: DataTypes.DECIMAL(15, 2)
      },

      sales_target_yearly: {
        type: DataTypes.DECIMAL(15, 2)
      },

      commission_percentage: {
        type: DataTypes.DECIMAL(5, 2)
      }
    },
    {
      tableName: 'sales_team',
      freezeTableName: true,
      underscored: true,
      timestamps: true
    }
  );

  /* ==========================
     SELF REFERENCING RELATION
     ========================== */
  SalesTeam.associate = (models) => {
    SalesTeam.belongsTo(models.SalesTeam, {
      foreignKey: 'team_lead_id',
      as: 'teamLead'
    });

    SalesTeam.hasMany(models.SalesTeam, {
      foreignKey: 'team_lead_id',
      as: 'teamMembers'
    });
  };

  return SalesTeam;
};
