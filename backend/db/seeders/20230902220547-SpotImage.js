'use strict';
const { SpotImage } = require('../models');
const { seederSpotIds, seederImageURLs } = require('../../utils/seeder');

const options = {};
options.tableName = 'SpotImages';
if (process.env.NODE_ENV === 'production')
  options.schema = process.env.SCHEMA;


module.exports = {
  async up (_queryInterface, _Sequelize) {
    const spotIds = await seederSpotIds();
    const urls = seederImageURLs;

    await SpotImage.bulkCreate([
      {
        spotId: spotIds[0],
        url: urls[0],
        preview: true,
      },
      {
        spotId: spotIds[1],
        url: urls[0],
        preview: true,
      },
      {
        spotId: spotIds[2],
        url: urls[0],
        preview: true,
      },
      {
        spotId: spotIds[0],
        url: urls[1],
      },
      {
        spotId: spotIds[1],
        url: urls[1],
      },
      {
        spotId: spotIds[2],
        url: urls[1],
      }
    ], { validate: true });
  },

  async down (queryInterface, _Sequelize) {
    return await queryInterface.bulkDelete(
      options,
      { spotId: await seederSpotIds() },
      {});
  }
};
