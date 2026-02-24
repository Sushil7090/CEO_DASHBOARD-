"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("phase_team_members", {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },

      phase_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Phases",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      project_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "projects",
          key: "project_id",
        },
        onDelete: "CASCADE",
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      allocation: {
        type: Sequelize.FLOAT,
        defaultValue: 1.0,
      },

      hourly_rate: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },

      working_hours_per_month: {
        type: Sequelize.INTEGER,
        defaultValue: 160,
      },

      monthly_cost: {
        type: Sequelize.FLOAT,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("phase_team_members");
  },
};
