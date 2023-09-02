'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User),
      this.belongsTo(models.Spots)
    }
  }
  Booking.init({
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
          if (value <= Date.now())
            throw new Error('Start date must be in the future.')
        }
      }
    },
    endDate: {
      allowNull: false,
      type: DataTypes.DATE,
      validate: {
        laterThan(value) {
          if (this.startDate > value)
            throw new Error('End date must be after start date.')
        }
      }
    },
}, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
