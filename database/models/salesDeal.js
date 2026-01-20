// models/salesDeal.js

module.exports = (sequelize, DataTypes) => {
  const SalesDeal = sequelize.define(
    'SalesDeal',
    {
      deal_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },

      project_id: {
        type: DataTypes.UUID,
        allowNull: true
      },

      deal_name: {
        type: DataTypes.STRING(200),
        allowNull: false
      },

      client_name: {
        type: DataTypes.STRING(200),
        allowNull: false
      },

      client_contact_person: {
        type: DataTypes.STRING(200),
        allowNull: true
      },

      client_email: {
        type: DataTypes.STRING(200),
        allowNull: true
      },

      client_phone: {
        type: DataTypes.STRING(20),
        allowNull: true
      },

      deal_value: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
      },

      currency: {
        type: DataTypes.STRING(10),
        allowNull: false
      },

      category: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      sub_category: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      sales_rep_id: {
        type: DataTypes.UUID,
        allowNull: false
      },

      team_name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      region: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      city: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      pipeline_stage: {
        type: DataTypes.ENUM(
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
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true
      },

      lead_source: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      first_contact_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },

      expected_close_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },

      actual_close_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },

      days_in_pipeline: {
        type: DataTypes.INTEGER,
        allowNull: true
      },

      proposal_sent_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },

      proposal_amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true
      },

      competitors: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      our_usp: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      lost_reason: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      next_action: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      next_action_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      tableName: 'sales_deals',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  );

  return SalesDeal;
};
