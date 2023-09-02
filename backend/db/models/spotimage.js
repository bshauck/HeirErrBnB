'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    static associate(models) {
      this.belongsTo(models.Spot, {foreignKey: 'spotId'})
    }
  }
  SpotImage.init({
    spotId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING
    },
    preview: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN
      },
}, {
    sequelize,
    modelName: 'SpotImage',
    defaultScope: {
      attributes: {exclude: ['updatedAt', 'createdAt']}
    },
  });
  return SpotImage;
};
