'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_team', {
      employee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },

      employee_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },

      email: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true
      },

      phone: {
        type: Sequelize.STRING(20)
      },

      role: {
        type: Sequelize.STRING(100)
      },

      team_name: {
        type: Sequelize.STRING(100)
      },

      team_lead_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'sales_team',
          key: 'employee_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      region: {
        type: Sequelize.STRING(100)
      },

      city: {
        type: Sequelize.STRING(100)
      },

      category_specialization: {
        type: Sequelize.STRING(100)
      },

      hire_date: {
        type: Sequelize.DATEONLY
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      sales_target_monthly: {
        type: Sequelize.DECIMAL(15, 2)
      },

      sales_target_quarterly: {
        type: Sequelize.DECIMAL(15, 2)
      },

      sales_target_yearly: {
        type: Sequelize.DECIMAL(15, 2)
      },

      commission_percentage: {
        type: Sequelize.DECIMAL(5, 2)
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sales_team');
  }
};
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sales_team', {
      employee_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
      },

      employee_name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },

      email: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true
      },

      phone: {
        type: Sequelize.STRING(20)
      },

      role: {
        type: Sequelize.STRING(100)
      },

      team_name: {
        type: Sequelize.STRING(100)
      },

      team_lead_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'sales_team',
          key: 'employee_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },

      region: {
        type: Sequelize.STRING(100)
      },

      city: {
        type: Sequelize.STRING(100)
      },

      category_specialization: {
        type: Sequelize.STRING(100)
      },

      hire_date: {
        type: Sequelize.DATEONLY
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },

      sales_target_monthly: {
        type: Sequelize.DECIMAL(15, 2)
      },

      sales_target_quarterly: {
        type: Sequelize.DECIMAL(15, 2)
      },

      sales_target_yearly: {
        type: Sequelize.DECIMAL(15, 2)
      },

      commission_percentage: {
        type: Sequelize.DECIMAL(5, 2)
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sales_team');
  }
};
