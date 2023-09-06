'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.Review, {foreignKey: 'userId'}),
      this.hasMany(models.Booking, {foreignKey: 'userId'}),
      this.hasMany(models.Spot,
        {foreignKey: 'ownerId',
        as: 'Owner'}),
      this.belongsToMany(models.Spot, {
        through: models.Booking,
        foreignKey: 'userId',
        otherKey: 'spotId'}),
      this.belongsToMany(models.Spot, {
        through: models.Review,
        foreignKey: 'userId',
        otherKey: 'spotId'})}
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
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
    firstName: {
      allowNull: false,
      type: DataTypes.STRING(30)
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING(30)
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
    defaultScope: {
      attributes: {exclude: ['hashedPassword', 'email', 'updatedAt', 'createdAt']}
    },
    // scopes: {
    //   keyboards: {where: {type: 'keyboard'}},
    //   strings: {where: {type: 'string'}},
    //   woodwinds: {where: {type: 'woodwind'}},
    //   findByStoreId(storeId) {
    //     const {Store} = require('../models');
    //     return {
    //       include: { model:Store, where: { id: storeId }},
    //       order: [['name']]}
    //   }
    // }

  });
  return User;
};
