'use strict';
const {
  Model
} = require('sequelize');
import bcrypt from 'bcryptjs';
import { async } from 'regenerator-runtime';
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Account, {
        foreignKey: 'user_id',
        allowNull: false,
        onDelete: 'CASCADE'
      })
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    hooks: {
      beforeCreate: async(user, options) => {
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(user.password, salt);
        user.password = hashedpassword;
      }
    },
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};