'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ReviewImage extends Model {
    static associate(models) {
      this.belongsTo(models.Review, {foreignKey: 'reviewId', targetKey: 'id'})
    }
  }
  ReviewImage.init({
    // id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   primaryKey: true,
    //   autoIncrement: true
    // },
    reviewId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING
    },
}, {
    sequelize,
    modelName: 'ReviewImage',
    defaultScope: {
      attributes: {exclude: ['updatedAt', 'createdAt']}
    },
  });
  return ReviewImage;
};
