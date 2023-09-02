'use strict';
const { Booking } = require('../models');
const { seederNextDate, seederSpotIds, seederUserIds } = require('../../utils/seeder');

const options = {};
options.tableName = 'Bookings';
if (process.env.NODE_ENV === 'production')
  options.schema = process.env.SCHEMA;

module.exports = {
  async up (_queryInterface, _Sequelize) {
    const spotIds = await seederSpotIds();
    const userIds = await seederUserIds();

    await Booking.bulkCreate([
      {
        spotId: spotIds[0],
        userId: userIds[0],
        startDate: seederNextDate(),
        endDate: seederNextDate(),
      },
      {
        spotId: spotIds[2],
        userId: userIds[1],
        startDate: seederNextDate(),
        endDate: seederNextDate(),
      },
      {
        spotId: spotIds[2],
        userId: userIds[2],
        startDate: seederNextDate(),
        endDate: seederNextDate(),
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