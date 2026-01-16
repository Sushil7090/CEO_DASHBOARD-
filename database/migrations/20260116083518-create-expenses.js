'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('expenses', {
      expense_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'project_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      expense_category: {
        type: Sequelize.ENUM(
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
        type: Sequelize.TEXT,
        allowNull: true,
      },

      expense_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },

      currency: {
        type: Sequelize.STRING(10),
        defaultValue: 'INR',
      },

      vendor_name: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },

      payment_status: {
        type: Sequelize.ENUM(
          'Pending',
          'Paid',
          'Approved',
          'Rejected',
          'Reimbursed'
        ),
        defaultValue: 'Pending',
      },

      receipt_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      approved_by: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      approved_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      rejected_reason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      payment_method: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      payment_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      transaction_reference: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      submitted_by: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('expenses');
  },
};
