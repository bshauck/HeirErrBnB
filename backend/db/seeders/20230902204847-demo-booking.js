'use strict';
const { Booking } = require('../models');
const { seederNextDate, seederSpotIdAndOwners, seederUserIds } = require('../../utils/seeder');

const options = {};
options.tableName = 'Bookings';
if (process.env.NODE_ENV === 'production')
  options.schema = process.env.SCHEMA;

module.exports = {
  async up (queryInterface, _Sequelize) {
    const userIds = await seederUserIds();
    const spotIdAndOwners = await seederSpotIdAndOwners();
    const spotIds = spotIdAndOwners.map(e=>e.id);
    // const spotOwnerIds = spotIdAndOwners.map(e=>e.ownerId);

    // await Booking.bulkCreate([  // we are doing bulkInsert to avoid validations
    await queryInterface.bulkInsert(options.tableName, [
      {
        spotId: spotIds[0],
        userId: userIds[2],
        startDate: seederNextDate(),
        endDate: seederNextDate(),
      },
      {
        spotId: spotIds[2],
        userId: userIds[1],
        startDate: new Date('2023-09-01'),
        endDate: new Date('2023-09-02'),
      },
      {
        spotId: spotIds[2],
        userId: userIds[1],
        startDate: new Date('2023-09-06'),
        endDate: new Date('2023-09-30'),
      },
      {
        spotId: spotIds[2],
        userId: userIds[0],
        startDate: seederNextDate(),
        endDate: seederNextDate(),
      },
      {
        spotId: spotIds[0],
        userId: userIds[1],
        startDate: seederNextDate(),
        endDate: seederNextDate(),
      },
      {
        spotId: spotIds[2],
        userId: userIds[0],
        startDate: seederNextDate(),
        endDate: seederNextDate(),
      },
      {
        spotId: spotIds[2],
        userId: userIds[1],
        startDate: seederNextDate(),
        endDate: seederNextDate(),
      }
    ], { /* validate: true */ }); // we turn off validation to allow
    // generation of old Bookings to enable certain API testing
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
