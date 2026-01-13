'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('milestones', {
      milestone_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4
      },

      project_id: {
        type: Sequelize.UUID, // ✅ UPDATED
        allowNull: false,
        references: {
          model: 'projects',
          key: 'project_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      milestone_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },

      milestone_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      milestone_order: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      planned_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      actual_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      date_variance_days: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      base_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },

      tax_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },

      tax_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },

      total_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },

      percentage_of_budget: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },

      payment_status: {
        type: Sequelize.ENUM('Pending', 'Paid', 'Overdue', 'Cancelled', 'Partial'),
        allowNull: false,
        defaultValue: 'Pending'
      },

      payment_due_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      payment_received_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      days_overdue: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      payment_method: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      bank_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      account_last_4: {
        type: Sequelize.STRING(4),
        allowNull: true
      },

      transaction_id: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      processing_fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },

      invoice_number: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      invoice_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      invoice_due_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      payment_terms: {
        type: Sequelize.STRING(50),
        allowNull: true
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('milestones');
  }
};
