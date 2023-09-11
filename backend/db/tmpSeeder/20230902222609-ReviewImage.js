'use strict';
const { ReviewImage } = require('../models');
const { seederReviewIds, seederImageURLs } = require('../../utils/seeder');

const options = {};
options.tableName = 'ReviewImages';
if (process.env.NODE_ENV === 'production')
  options.schema = process.env.SCHEMA;

module.exports = {
  async up (_queryInterface, _Sequelize) {
    const reviewIds = await seederReviewIds();
    const urls = seederImageURLs;

    await ReviewImage.bulkCreate([
      {
        reviewId: reviewIds[0],
        url: urls[0],
      },
      {
        reviewId: reviewIds[1],
        url: urls[0],
      },
      {
        reviewId: reviewIds[2],
        url: urls[0],
      },
      {
        reviewId: reviewIds[0],
        url: urls[1],
      },
      {
        reviewId: reviewIds[1],
        url: urls[1],
      },
      {
        reviewId: reviewIds[2],
        url: urls[1],
      }
    ], { validate: true });
  },

  async down (queryInterface, _Sequelize) {
    return await queryInterface.bulkDelete(
      options,
      { reviewId: await seederReviewIds() },
      {});
  }
};
