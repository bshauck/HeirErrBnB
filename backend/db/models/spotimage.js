'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SpotImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Spot, {
        references: 'Spots',
        foreignKey: 'spotId'
      })
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
    },
}, {
    sequelize,
    modelName: 'SpotImage',
  });
  return SpotImage;
};
