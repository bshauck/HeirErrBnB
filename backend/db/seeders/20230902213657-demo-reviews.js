'use strict';
const { Review, Spot } = require('../models');
const { getRandomInt, getReviewInfo, seederReviewIds, seederSpotIds, seederUserIds } = require('../../utils/seeder');

const options = {};
options.tableName = 'Reviews';
if (process.env.NODE_ENV === 'production')
  options.schema = process.env.SCHEMA;

module.exports = {
  async up (queryInterface, _Sequelize) {
    const userIds = await seederUserIds();
    const spotIds = await seederSpotIds();
    const spots = await Spot.findAll({
      where: {id: spotIds}
    });

    /* ideally reviews would go by users with bookings */
    // REVIEW GENERATE
    // select all seeded spots;
    // select unowned-by-given-user spots;
    // generate 1-10 reviews by non-owners;
    const generatedReviews = [];
    for (const spot of spots) {
      const numReviews = getRandomInt(1,3); /* TODO change back to 10 */
      const filteredIds = userIds.filter(id => id !== spot.ownerId);
      const startIndex = getRandomInt(0, filteredIds.length-(numReviews+1));
      const spotId = spot.id;
      for (let i=0; i < numReviews; i++) {
        const [commentary, stars] = getReviewInfo();
        let userId = filteredIds[startIndex+i];
        generatedReviews.push({
          userId,
          spotId,
          commentary,
          stars
        });
      }}
    await Review.bulkCreate(generatedReviews, {validate:true})
  },

  async down (queryInterface, _Sequelize) {
    return await queryInterface.bulkDelete(
      options,
      { id: await seederReviewIds() },
      {});
  }
};
