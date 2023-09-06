'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      this.belongsTo(models.User, {foreignKey: 'userId'}),
      this.belongsTo(models.Spot, {foreignKey: 'spotId'})
    }
  }
  Booking.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    spotId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    startDate: {
      allowNull: false,
      type: DataTypes.DATE,
      validate: {
        later(value) {
          this.startDate = new Date(value.toDateString())
          if (this.startDate.getTime() <= (new Date((new Date()).toDateString())).getTime())
            throw new Error('Start date must be in the future.')
        }
      }
    },
    endDate: {
      allowNull: false,
      type: DataTypes.DATE,
      validate: {
        laterThan(value) {
          this.endDate = new Date(value.toDateString())
          if (this.startDate.getTime() >= this.endDate.getTime())
            throw new Error('End date must be later than start date.')
        }
      }
    },
}, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
