'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('milestones', 'is_completed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('milestones', 'is_completed');
  }
};
