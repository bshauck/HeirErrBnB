'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.SpotImage),
      this.belongsTo(models.User, {
        foreignKey: 'ownerId'},
      this.belongsToMany(models.User, {
        through: models.Booking,
        foreignKey: 'spotId',
        otherKey: 'userId'}))
    }
  }
  Spot.init({
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
      type: DataTypes.STRING
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    price: {
      type: DataTypes.DECIMAL(4,2)
    },
}, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
