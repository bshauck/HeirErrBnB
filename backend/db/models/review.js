'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      this.hasMany(models.ReviewImage, {foreignKey: 'reviewId'}),
      this.belongsTo(models.User, {foreignKey: 'userId'}),
      this.belongsTo(models.Spot, {foreignKey: 'spotId'})
    }
  }
  Review.init({
    spotId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    review: {
      allowNull: false,
      type: DataTypes.STRING
    },
    stars: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
}, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
