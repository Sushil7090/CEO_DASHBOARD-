'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('invoices', {
      invoice_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      invoice_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },

      milestone_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'milestones',
          key: 'milestone_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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

      invoice_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      due_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      payment_terms: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },

      subtotal: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },

      tax_rate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
      },

      tax_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },

      total_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },

      currency: {
        type: Sequelize.STRING(10),
        defaultValue: 'INR',
      },

      invoice_status: {
        type: Sequelize.ENUM(
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
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      viewed_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      payment_received_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },

      payment_method: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      transaction_id: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      invoice_file_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      amount_paid: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0.0,
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
    await queryInterface.dropTable('invoices');
  },
};
