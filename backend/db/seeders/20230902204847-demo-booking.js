'use strict';
const { Spot, User, sequelize, Sequelize } = require('../models');
const { getRandomInt, seederBookingIds, seederSpotIds, seederUserIds } = require('../../utils/seeder');
const { addDays, dayDate, ymd } = require('../../utils/normalizeDate')
const Op = Sequelize.Op;
const options = {};
options.tableName = 'Bookings';
let specialSubqueryLiteralText =
`AND id NOT IN (SELECT "userId" FROM Bookings)`
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
  specialSubqueryLiteralText =
  `AND id NOT IN (SELECT "userId" FROM ${options.schema}."Bookings")`
}

module.exports = {
  async up (queryInterface, _Sequelize) {
    const userIds = await seederUserIds();
    const spotIds = await seederSpotIds();

    /* NOTE: wrong subquery; should only book spots
     * not owned by user in question
     */
    // BOOKING GENERATE
    // select random users with no bookings;
    // select unowned-by-user spots;
    // generate 2-4 bookings; 1-5 day stays;
    // 40% start in past 60 days;
    // 60% will start in next 60 days
    const expandUserIds = [...userIds].toString();
    let possibleBookingUserIds = await User.findAll({
      attributes: ['id'],
      where: sequelize.literal(`id IN (${expandUserIds}) ${specialSubqueryLiteralText}`)});
    possibleBookingUserIds = possibleBookingUserIds.map(e=>e.id)
    const totalPossible = possibleBookingUserIds.length;
    let numberOfBookingUserIds = getRandomInt(totalPossible/2, totalPossible/1.5);
    const bookingUserIds = [];
    while (numberOfBookingUserIds--)
      bookingUserIds.push(...(possibleBookingUserIds.splice(getRandomInt(0, possibleBookingUserIds.length-1), 1)));
    const generatedBookings = [];
    const today = dayDate(new Date());
    for (const nextUserId of bookingUserIds) {
      let possibleSpots = await Spot.findAll({
        attributes: ['id'],
        where: [{ownerId: {[Op.ne]: nextUserId}},
                {id: spotIds}]
      });
      possibleSpots = possibleSpots.map(e=>e.id)
      let numberOfPossibleSpots = possibleSpots.length;
      let bookingSpotIds = [];
      while (numberOfPossibleSpots--)
        bookingSpotIds.push(...(possibleSpots.splice(getRandomInt(0, possibleSpots.length-1), 1)));
      for (const nextBookingSpotId of bookingSpotIds) {
        let timeMultiplier = getRandomInt(1,1000) <= 400 ? -1 : 1;
        let startDate = new Date(today);
        addDays(startDate, timeMultiplier * getRandomInt(1,60));
        let endDate = new Date(startDate);
        addDays(endDate, getRandomInt(1,5));
        generatedBookings.push({
          spotId: nextBookingSpotId,
          userId: nextUserId,
          startDate: ymd(startDate),
          endDate: ymd(endDate)
        });
  }}
    // await Booking.bulkCreate([  // we are doing bulkInsert to avoid validations
    await queryInterface.bulkInsert(options.tableName, [
      {
        spotId: spotIds[2],
        userId: userIds[0],
        startDate: '2023-09-20',
        endDate: '2023-09-22',
      },
      {
        spotId: spotIds[2],
        userId: userIds[0],
        startDate: '2023-09-20',
        endDate: '2023-10-31',
      },
      ...generatedBookings
    ], { /* validate: true */ }); // we turn off validation to allow
    // generation of old Bookings to enable certain API testing
  },

  async down (queryInterface, _Sequelize) {
    return await queryInterface.bulkDelete(
      options,
      { id: await seederBookingIds() },
      {});
  }
};
