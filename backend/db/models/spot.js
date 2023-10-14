'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      this.hasMany(models.SpotImage,
        {foreignKey: 'spotId'}),
      this.hasMany(models.Review, {foreignKey: 'spotId'}),
      this.hasMany(models.Booking, {foreignKey: 'spotId'}),
      this.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'Owner'}),
      this.belongsToMany(models.User, {
        through: models.Booking,
        foreignKey: 'spotId',
        otherKey: 'userId'}),
      this.belongsToMany(models.User, {
        through: models.Review,
        foreignKey: 'spotId',
        otherKey: 'userId'})
    }
  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ownerId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    address: {
      allowNull: false,
      type: DataTypes.STRING
    },
    city: {
      allowNull: false,
      type: DataTypes.STRING
    },
    state: {
      allowNull: false,
      type: DataTypes.STRING
    },
    country: {
      allowNull: false,
      defaultValue: 'USA',
      type: DataTypes.STRING
    },
    lat: {
      type: DataTypes.DECIMAL(10,6)
    },
    lng: {
      type: DataTypes.DECIMAL(10,6)
    },
    name: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(49)
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    price: {
      allowNull: false,
      type: DataTypes.DECIMAL(4,2)
    },
    previewUrl: {
      allowNull: false,
      type: DataTypes.STRING
    },

}, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
