'use strict';
const { ReviewImage } = require('../models');
const { getRandomInteriorImageUrl, seederReviewIds, seederReviewImageIds } = require('../../utils/seeder');

const options = {};
options.tableName = 'ReviewImages';
if (process.env.NODE_ENV === 'production')
  options.schema = process.env.SCHEMA;

module.exports = {
  async up (_queryInterface, _Sequelize) {
    const reviewIds = await seederReviewIds();
    const generatedImages = [];
    for (const reviewId of reviewIds) {
      generatedImages.push({
        reviewId,
        url: getRandomInteriorImageUrl()
      })
    }
    await ReviewImage.bulkCreate(generatedImages, { validate: true });
  },

  async down (queryInterface, _Sequelize) {
    return await queryInterface.bulkDelete(
      options,
      { id: await seederReviewImageIds() },
      {});
  }
};
