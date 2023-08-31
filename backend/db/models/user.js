'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(30),
      validate: {
        len: [4, 30],
        isNotEmail(value) {
          if (Validator.isEmail(value)) {
            throw new Error("Cannot be an email.");
          }
        }
      }

    },
    email: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(255),
      validate: {
        len: [3, 255],
        isEmail: true
      }

    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING(60).BINARY,
      validate: {
        len: [60, 60]
      }

    },
}, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
