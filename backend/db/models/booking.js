'use strict';
const { Model } = require('sequelize');
const { dayDate, dayLTE, dayGTE } = require('../../utils/normalizeDate')

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
          this.startDate = dayDate(value);
          if (dayLTE(this.startDate, dayDate(new Date())))
            throw new Error('Start date must be in the future.')
        }
      }
    },
    endDate: {
      allowNull: false,
      type: DataTypes.DATE,
      validate: {
        laterThan(value) {
          this.endDate = dayDate(value);
          if (dayGTE(this.startDate, this.endDate))
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
