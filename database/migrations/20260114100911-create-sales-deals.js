'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_deals', {
      deal_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },

      project_id: {
        type: Sequelize.UUID,
        allowNull: true
      },

      deal_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },

      client_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },

      client_contact_person: {
        type: Sequelize.STRING(200),
        allowNull: true
      },

      client_email: {
        type: Sequelize.STRING(200),
        allowNull: true
      },

      client_phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },

      deal_value: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },

      currency: {
        type: Sequelize.STRING(10),
        allowNull: false
      },

      category: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      sub_category: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      sales_rep_id: {
        type: Sequelize.UUID,
        allowNull: false
      },

      team_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      region: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      city: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      pipeline_stage: {
        type: Sequelize.ENUM(
          'Lead',
          'Qualified',
          'Proposal',
          'Negotiation',
          'Closed Won',
          'Closed Lost',
          'won',
          'lost'
        ),
        allowNull: false
      },

      probability_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },

      lead_source: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      first_contact_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      expected_close_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      actual_close_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      days_in_pipeline: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      proposal_sent_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },

      proposal_amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true
      },

      competitors: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      our_usp: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      lost_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      next_action: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      next_action_date: {
        type: Sequelize.DATEONLY,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sales_deals');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_sales_deals_pipeline_stage";'
    );
  }
};
