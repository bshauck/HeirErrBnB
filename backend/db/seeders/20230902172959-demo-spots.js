'use strict';
const { Spot } = require('../models');
const {seederSpotNames, seederUserIds } = require('../../utils/seeder');

const options = {};
options.tableName = 'Spots';
if (process.env.NODE_ENV === 'production')
  options.schema = process.env.SCHEMA;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (_queryInterface, _Sequelize) {
    const userIds = await seederUserIds();
    await Spot.bulkCreate([
      {
        ownerId: userIds[0],
        address: "500 Pearl Street",
        city: "Denton",
        state: 'TX',
        lat: 33.2171896,
        lng: -97.1398609,
        name: seederSpotNames[0],
        description: 'Descript 1',
        price: 10
      },
      {
        ownerId: userIds[1],
        address: "500 Main",
        city: "Boulder",
        state: 'CO',
        lat: 40.0634304,
        lng: -105.4124487,
        name: seederSpotNames[1],
        description: 'Descript 2',
        price: 20
      },
      {
        ownerId: userIds[2],
        address: "345 Main",
        city: "Vail",
        state: 'CO',
        lat: 39.5861176,
        lng: -106.4324849,
        name: seederSpotNames[2],
        description: 'Descript 3',
        price: 30
      }
    ], { validate: true });
  },

  async down (queryInterface, _Sequelize) {
    return queryInterface.bulkDelete(
      options,
      { name: seederSpotNames },
      {});
  }
};
