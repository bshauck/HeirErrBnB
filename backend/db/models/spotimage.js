'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    static associate(models) {
      this.belongsTo(models.Spot, {foreignKey: 'spotId'})
    }
  }
  SpotImage.init({
    // id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   primaryKey: true,
    //   autoIncrement: true
    // },
    spotId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING
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
