'use strict';
const {
  Model, UUIDV4
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Account, {
        foreignKey: 'account_id',
        allowNull: false,
        onDelete: 'CASCADE'
      })
    }
  };
  Transaction.init({
    transaction_type: {
      type: DataTypes.ENUM('debit', 'credit'),
      allowNull: false
    },
    reference: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      unique: true,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    },
    balance_before: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    },
    balance_after: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    },
    narration: {
      type: DataTypes.TEXT
    }
  }, {
    sequelize,
    tableName: 'transactions',
    modelName: 'Transaction',
  });
  return Transaction;
};