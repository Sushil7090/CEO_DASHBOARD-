'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('projects', {
      project_id: {
  type: Sequelize.UUID,
  defaultValue: Sequelize.UUIDV4,
  primaryKey: true,
  allowNull: false,
},


      project_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },

      client_name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },

      project_status: {
        type: Sequelize.ENUM(
          'In Progress',
          'Completed',
          'On Hold',
          'Cancelled',
        ),
        allowNull: false,
        defaultValue: 'In Progress',
      },

      category: {
        type: Sequelize.ENUM(
          'Digital Transformation',
          'AI & ML'
        ),
        allowNull: true,
      },

      sub_category: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      project_owner: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      start_date_planned: {
  type: Sequelize.DATEONLY,
  allowNull: true,
  defaultValue: Sequelize.literal('CURRENT_DATE') // optional default today
},

start_date_actual: {
  type: Sequelize.DATEONLY,
  allowNull: true,
  defaultValue: null
},

end_date_planned: {
  type: Sequelize.DATEONLY,
  allowNull: true,
  defaultValue: null
},

end_date_actual: {
  type: Sequelize.DATEONLY,
  allowNull: true,
  defaultValue: null
},

      total_budget: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },

      total_cost_to_date: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },

      total_revenue: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: true,
      },

      currency: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'INR',
      },

      progress_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0.0,
      },

      priority: {
        type: Sequelize.ENUM('High', 'Medium', 'Low'),
        allowNull: false,
        defaultValue: 'Medium',
      },

      geography: {
        type: Sequelize.STRING(100),
        allowNull: true,
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
    await queryInterface.dropTable('projects');

    // IMPORTANT: Drop ENUMs manually (Postgres)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_projects_project_status";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_projects_category";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_projects_priority";'
    );
  },
};