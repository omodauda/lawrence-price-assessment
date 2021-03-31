'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaction_type: {
        type: Sequelize.ENUM('debit', 'credit'),
        allowNull: false
      },
      reference: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false
      },
      account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'accounts',
          key: 'id'
        }
      },
      balance_before: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false
      },
      balance_after: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: false
      },
      narration: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transactions');
  }
};