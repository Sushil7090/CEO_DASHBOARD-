'use strict';

module.exports = (sequelize, DataTypes) => {
  const Milestone = sequelize.define('Milestone', {
    milestone_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },

    project_id: {
      type: DataTypes.UUID,
      allowNull: false
    },

    milestone_name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },

    milestone_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    milestone_order: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    planned_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    actual_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    date_variance_days: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    base_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },

    tax_percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },

    tax_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },

    total_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },

    percentage_of_budget: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },

    payment_status: {
      type: DataTypes.ENUM('Pending', 'Paid', 'Overdue', 'Cancelled', 'Partial'),
      allowNull: false,
      defaultValue: 'Pending'
    },

    payment_due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    payment_received_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    days_overdue: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    payment_method: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    bank_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    account_last_4: {
      type: DataTypes.STRING(4),
      allowNull: true
    },

    transaction_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    processing_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },

    invoice_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    invoice_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    invoice_due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    payment_terms: {
      type: DataTypes.STRING(50),
      allowNull: true
    }

  }, {
    tableName: 'milestones',
    underscored: true,
    timestamps: true
  });

   Milestone.associate = (models) => {
    Milestone.belongsTo(models.Project, {
      foreignKey: 'project_id',
      as: 'project'
    });
  };

  return Milestone;
};
