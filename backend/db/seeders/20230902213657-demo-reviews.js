'use strict';
const { Review } = require('../models');
const { seederSpotIds, seederUserIds } = require('../../utils/seeder');

const options = {};
options.tableName = 'Reviews';
if (process.env.NODE_ENV === 'production')
  options.schema = process.env.SCHEMA;

module.exports = {
  async up (_queryInterface, _Sequelize) {
    const spotIds = await seederSpotIds();
    const userIds = await seederUserIds();

    await Review.bulkCreate([
      {
        spotId: spotIds[0],
        userId: userIds[0],
        review: "Best place I've ever stayed at.",
        stars: 5,
      },
      {
        spotId: spotIds[2],
        userId: userIds[1],
        review: "Worst place I've ever stayed at.",
        stars: 1,
      },
      {
        spotId: spotIds[2],
        userId: userIds[2],
        review: "Most mediocre place I've ever stayed at.",
        stars: 3,
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
