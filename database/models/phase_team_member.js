module.exports = (sequelize, DataTypes) => {
  const PhaseTeamMember = sequelize.define(
    "PhaseTeamMember",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      phase_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      project_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      allocation: {
        type: DataTypes.FLOAT,
        defaultValue: 1.0,
      },

      hourly_rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },

      working_hours_per_month: {
        type: DataTypes.INTEGER,
        defaultValue: 160,
      },

      monthly_cost: {
        type: DataTypes.FLOAT,
      },
    },
    {
      tableName: "phase_team_members",
      timestamps: true,
    },
  );

  PhaseTeamMember.associate = (models) => {
    PhaseTeamMember.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    PhaseTeamMember.belongsTo(models.Phase, {
      foreignKey: "phase_id",
      as: "phase",
    });

    PhaseTeamMember.belongsTo(models.Project, {
      foreignKey: "project_id",
      as: "project",
    });
  };

  return PhaseTeamMember;
};
