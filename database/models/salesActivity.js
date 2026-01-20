// database/models/salesActivity.js

module.exports = (sequelize, DataTypes) => {
  const SalesActivity = sequelize.define(
    'SalesActivity',
    {
      activity_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      deal_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      sales_rep_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      activity_type: {
        type: DataTypes.ENUM('Call', 'Meeting', 'Email', 'Demo', 'Proposal'),
        allowNull: false,
      },

      activity_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      outcome: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },

      next_follow_up: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      tableName: 'sales_activities',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true,
    }
  );
  return SalesActivity;
};
