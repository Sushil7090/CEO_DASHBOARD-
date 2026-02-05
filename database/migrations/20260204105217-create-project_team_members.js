'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('project_team_members', {
     id: {
  type: Sequelize.UUID,
  defaultValue: Sequelize.UUIDV4,  
  primaryKey: true,
  allowNull: false
},
  project_id: {
      type: Sequelize.UUID,               
      allowNull: false,
      references: {
        model: 'projects',
        key: 'project_id'
      },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
 },
  user_id: {
      type: Sequelize.UUID,               
      allowNull: false,
      references: {
       model: 'users',
      key: 'id'
    },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
      member_role: {
        type: Sequelize.STRING,
        allowNull: true
    },
      allocation_percentage: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      rate_per_hour: {
        type: Sequelize.FLOAT,
        allowNull: true
      },
      assigned_date: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('project_team_members');
  }
};
