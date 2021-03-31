'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.belongsTo(models.User, {
        foreignKey: 'user_id',
        allowNull: false,
        onDelete: 'CASCADE'
      });

      Account.hasMany(models.Transaction, {
        foreignKey: 'account_id',
        allowNull: false,
        onDelete: 'CASCADE'
      });
    }
  };
  Account.init({
    balance: {
      type: DataTypes.DECIMAL(20, 2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'accounts',
    modelName: 'Account',
  });
  return Account;
};