'use strict';
const { Review } = require('../models');
const { seederSpotIdAndOwners, seederUserIds } = require('../../utils/seeder');

const options = {};
options.tableName = 'Reviews';
if (process.env.NODE_ENV === 'production')
  options.schema = process.env.SCHEMA;

module.exports = {
  async up (_queryInterface, _Sequelize) {
    const spotIdsAndOwners = await seederSpotIdAndOwners();
    const spotIds = spotIdsAndOwners.map(e=>e.id);
    const spotOwners = spotIdsAndOwners.map(e=>e.ownerId);
    const userIds = await seederUserIds();

    await Review.bulkCreate([
      {
        userId: userIds[0],
        spotId: spotIds[0],
        review: "Best place I've ever stayed at.",
        stars: 5,
      },
      {
        userId: userIds[1],
        spotId: spotIds[2],
        review: "Worst place I've ever stayed at.",
        stars: 1,
      },
      {
        userId: userIds[2],
        spotId: spotIds[2],
        review: "Most mediocre place I've ever stayed at.",
        stars: 3,
      }
    ], { validate: true });
  },

  async down (queryInterface, _Sequelize) {
    const spotIdAndOwners = await seederSpotIdAndOwners();
    const spotIds = spotIdAndOwners.map(e=>e.id);
    return await queryInterface.bulkDelete(
      options,
      { spotId: spotIds },
      {});
  }
};
