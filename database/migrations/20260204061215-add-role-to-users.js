'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'manager', 'employee'),
      allowNull: false,
      defaultValue: 'employee'
    });
  },

  async down(queryInterface, Sequelize) {
    // First remove column
    await queryInterface.removeColumn('users', 'role');

    // Then drop enum type (PostgreSQL specific)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_role";'
    );
  }
};
