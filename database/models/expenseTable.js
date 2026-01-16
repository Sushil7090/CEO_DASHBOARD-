module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define(
    'Expense',
    {
      expense_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      project_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      expense_category: {
        type: DataTypes.ENUM(
          'Software Licenses',
          'Travel',
          'Contractor Fees',
          'Hardware',
          'Office Supplies',
          'Other'
        ),
        allowNull: false,
      },

      expense_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      expense_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },

      currency: {
        type: DataTypes.STRING(10),
        defaultValue: 'INR',
      },

      vendor_name: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },

      payment_status: {
        type: DataTypes.ENUM(
          'Pending',
          'Paid',
          'Approved',
          'Rejected',
          'Reimbursed'
        ),
        defaultValue: 'Pending',
      },

      receipt_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      approved_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      approved_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      rejected_reason: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      payment_method: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      payment_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      transaction_reference: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      submitted_by: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: 'expenses',
      timestamps: true,
      underscored: true,
    }
  );

  return Expense;
};
