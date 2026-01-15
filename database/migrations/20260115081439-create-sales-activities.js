'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_activities', {
      activity_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      deal_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      sales_rep_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      activity_type: {
        type: Sequelize.ENUM('Call', 'Meeting', 'Email', 'Demo', 'Proposal'),
        allowNull: false,
      },

      activity_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      duration_minutes: {
        type: Sequelize.INTEGER,
      },

      notes: {
        type: Sequelize.TEXT,
      },

      outcome: {
        type: Sequelize.STRING(200),
      },

      next_follow_up: {
        type: Sequelize.DATEONLY,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sales_activities');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_sales_activities_activity_type";'
    );
  },
};
