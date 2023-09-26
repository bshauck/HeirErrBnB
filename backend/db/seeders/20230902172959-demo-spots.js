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
        state: 'Texas',
        country:  "United States",
        lat: 33.2171896,
        lng: -97.1398609,
        name: seederSpotNames[0],
        description: 'Small TX House',
        price: 110
      },
      {
        ownerId: userIds[1],
        address: "500 Main",
        city: "Boulder",
        state: 'Colorado',
        country:  "United States",
        lat: 40.0634304,
        lng: -105.4124487,
        name: seederSpotNames[1],
        description: 'Boulder Fun!',
        price: 120
      },
      {
        ownerId: userIds[2],
        address: "345 Main",
        city: "Vail",
        state: 'Colorado',
        country:  "United States",
        lat: 39.5861176,
        lng: -106.4324849,
        name: seederSpotNames[2],
        description: 'Mountain Joy',
        price: 130
      },
      {
        ownerId: userIds[3],
        address:  "5403 Little Acres Ln",
        city:     "Jacksonville",
        state:    "Florida",
        country:  "United States",
        lat:      30.2482933,
        lng:      -81.7183706,
        name: seederSpotNames[3],
        description: 'Strange Place',
        price: 110
      },
      {
        ownerId: userIds[4],
        address:  "Rheinstrasse 76",
        city:     "München",
        state:    "Freistaat Bayern",
        country:  "Germany",
        lat:      48.1673572,
        lng:      11.5793442,
        name: seederSpotNames[4],
        description: 'Great Apartment',
        price: 80
      },
      {
        ownerId: userIds[5],
        address:  "1961 Oak Hollow Way",
        city:     "Lancaster",
        state:    "Ohio",
        country:  "United States",
        lat:      39.7378754,
        lng:      -82.6122789,
        name: seederSpotNames[5],
        description: 'Fuzzy Place',
        price: 130
      },
      {
        ownerId: userIds[6],
        address:  "81 Rue Descartes",
        city:     "Loos",
        state:    "Hauts-de-France",
        country:  "France",
        lat:      50.6107573,
        lng:      3.0056504,
        name: seederSpotNames[6],
        description: "Oblong Place",
        price: 110
      },
      {
        ownerId: userIds[7],
        address:  "1897 John Calvin Ave",
        city:     "College Park",
        state:    "Georgia",
        country:  "United States",
        lat:      33.6580514,
        lng:      -84.4510429,
        name: seederSpotNames[7],
        description: "Trapazoidal Place",
        price: 120
      },
      {
        ownerId: userIds[8],
        address:  "3131 W 44th Ave",
        city:     "Vancouver",
        state:    "British Columbia",
        country:  "Canada",
        lat:      49.2319167,
        lng:      -123.1747951,
        name: seederSpotNames[8],
        description: "Triangular Place",
        price: 130
      },
      {
        ownerId: userIds[9],
        address:  "608 Castle Rd",
        city:     "Mt. Juliet",
        state:    "Tennessee",
        country:  "United States",
        lat:      36.1527773,
        lng:      -86.4670017,
        name: seederSpotNames[9],
        description: "Scary Place",
        price: 110
      },
      {
        ownerId: userIds[10],
        address:  "3653 Fowler Ave",
        city:     "Omaha",
        state:    "Nebraska",
        country:  "United States",
        lat:      41.3013462,
        lng:      -95.968232,
        name: seederSpotNames[10],
        description: "Undersea Place",
        price: 120
      },
      {
        ownerId: userIds[11],
        address:  "ul. Traszka 50",
        city:     "Warszawa",
        state:    "Mazowieckie",
        country:  "Poland",
        lat:      52.3597517,
        lng:      21.0555689,
        name: seederSpotNames[11],
        description: "Heavenly Cottage",
        price: 130
      },
      {
        ownerId: userIds[0],
        address:  "3128 W 44th Ave",
        city:     "Denver",
        state:    "Colorado",
        country:  "United States",
        lat:      39.7766388,
        lng:      -105.0276076,
        name: seederSpotNames[12],
        description: "Devilish Place",
        price: 110
      },
      {
        ownerId: userIds[1],
        address:  "3534 Havana Street",
        city:     "Dallas",
        state:    "Texas",
        country:  "United States",
        lat:      32.7665397,
        lng:      -96.7617341,
        name: seederSpotNames[13],
        description: "Creepy Place",
        price: 120
      },
      {
        ownerId: userIds[2],
        address: "580 Spruce Street",
        city: "Aspen",
        state: 'Colorado',
        country:  "United States",
        lat: 39.1941738,
        lng: -106.8115862,
        name: seederSpotNames[14],
        description: "Woodsy Place",
        price: 230
      },
    ], { validate: true });
  },

  async down (queryInterface, _Sequelize) {
    return queryInterface.bulkDelete(
      options,
      { name: seederSpotNames },
      {});
  }
};
