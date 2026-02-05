'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('projects', 'project_team_members', {
      type: Sequelize.JSONB, // ✅ Postgres best choice
      allowNull: true,
      defaultValue: [],
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('projects', 'project_team_members');
  },
};
