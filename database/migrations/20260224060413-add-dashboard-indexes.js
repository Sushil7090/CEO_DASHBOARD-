'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    //  MILESTONES 
    const milestoneIndexes = await queryInterface.showIndex('milestones');
    const milestoneIndexNames = milestoneIndexes.map(i => i.name);

    // Single-column indexes
    if (!milestoneIndexNames.includes('idx_milestones_payment_status')) {
      await queryInterface.addIndex('milestones', ['payment_status'], {
        name: 'idx_milestones_payment_status'
      });
    }
    if (!milestoneIndexNames.includes('idx_milestones_project_id')) {
      await queryInterface.addIndex('milestones', ['project_id'], {
        name: 'idx_milestones_project_id'
      });
    }
    if (!milestoneIndexNames.includes('idx_milestones_created_at')) {
      await queryInterface.addIndex('milestones', ['created_at'], {
        name: 'idx_milestones_created_at'
      });
    }

    // Composite index for analytics: filter + sort
    if (!milestoneIndexNames.includes('idx_milestones_project_payment_created')) {
      await queryInterface.addIndex('milestones', ['project_id', 'payment_status', 'created_at'], {
        name: 'idx_milestones_project_payment_created'
      });
    }

    //  PROJECTS 
    const projectIndexes = await queryInterface.showIndex('projects');
    const projectIndexNames = projectIndexes.map(i => i.name);
    if (!projectIndexNames.includes('idx_projects_project_status')) {
      await queryInterface.addIndex('projects', ['project_status'], {
        name: 'idx_projects_project_status'
      });
    }

    //  SALES DEALS 
    const salesIndexes = await queryInterface.showIndex('sales_deals');
    const salesIndexNames = salesIndexes.map(i => i.name);
    if (!salesIndexNames.includes('idx_sales_deals_pipeline_stage')) {
      await queryInterface.addIndex('sales_deals', ['pipeline_stage'], {
        name: 'idx_sales_deals_pipeline_stage'
      });
    }

    // PROJECT TEAM MEMBERS 
    const teamIndexes = await queryInterface.showIndex('project_team_members');
    const teamIndexNames = teamIndexes.map(i => i.name);
    if (!teamIndexNames.includes('idx_project_team_members_project_id')) {
      await queryInterface.addIndex('project_team_members', ['project_id'], {
        name: 'idx_project_team_members_project_id'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('milestones', 'idx_milestones_payment_status').catch(() => {});
    await queryInterface.removeIndex('milestones', 'idx_milestones_project_id').catch(() => {});
    await queryInterface.removeIndex('milestones', 'idx_milestones_created_at').catch(() => {});
    await queryInterface.removeIndex('milestones', 'idx_milestones_project_payment_created').catch(() => {});

    await queryInterface.removeIndex('projects', 'idx_projects_project_status').catch(() => {});

    await queryInterface.removeIndex('sales_deals', 'idx_sales_deals_pipeline_stage').catch(() => {});

    await queryInterface.removeIndex('project_team_members', 'idx_project_team_members_project_id').catch(() => {});
  }
};