'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      this.hasMany(models.ReviewImage, {foreignKey: 'reviewId', sourceKey:'id'}),
      this.belongsTo(models.User, {foreignKey: 'userId'}),
      this.belongsTo(models.Spot, {foreignKey: 'spotId'})
    }
  }
  Review.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    spotId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    commentary: {
      allowNull: false,
      type: DataTypes.TEXT
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
