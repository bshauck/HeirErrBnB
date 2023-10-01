'use strict';
const { SpotImage } = require('../models');
const { seederSpotIds, seederSpotImageIds, getFullImages } = require('../../utils/seeder');

const options = {};
options.tableName = 'SpotImages';
if (process.env.NODE_ENV === 'production')
  options.schema = process.env.SCHEMA;

module.exports = {
  async up (_queryInterface, _Sequelize) {
    const spotIds = await seederSpotIds();
    const generatedImages = [];

    for (const spotId of spotIds) {
      getFullImages().forEach((url, i) =>
        generatedImages.push({
          spotId,
          url,
          preview: i === 0
        })
      )
    }
    await SpotImage.bulkCreate(generatedImages, { validate: true });
  },

  async down (queryInterface, _Sequelize) {
    return await queryInterface.bulkDelete(
      options,
      { id: await seederSpotImageIds() },
      {});
  }
};
