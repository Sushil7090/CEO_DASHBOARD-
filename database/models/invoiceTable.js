// database/models/invoiceTable.js

module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define(
    'Invoice',
    {
      invoice_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      invoice_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },

      milestone_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },

      project_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      invoice_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      payment_terms: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      subtotal: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },

      tax_rate: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },

      tax_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },

      total_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
      },

      currency: {
        type: DataTypes.STRING(10),
        defaultValue: 'INR',
      },

      invoice_status: {
        type: DataTypes.ENUM(
          'Draft',
          'Sent',
          'Viewed',
          'Paid',
          'Overdue',
          'Cancelled'
        ),
        defaultValue: 'Draft',
      },

      sent_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      viewed_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      payment_received_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },

      payment_method: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      invoice_file_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      amount_paid: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.0,
      },
    },
    {
      tableName: 'invoices',
      timestamps: true,
      underscored: true,
    }
  );

  return Invoice;
};
