'use strict';
const { User } = require('../models');
const bcrypt = require("bcryptjs");
const {seederUserNames} = require('../../utils/seeder');

const options = {};
options.tableName = 'Users';
if (process.env.NODE_ENV === 'production')
  options.schema = process.env.SCHEMA;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (_queryInterface, _Sequelize) {
    await User.bulkCreate([
      {
        firstName: "Demo",
        lastName: "Lition",
        email: 'demo@user.io',
        username: seederUserNames[0],
        hashedPassword: bcrypt.hashSync('password1')
      },
      {
        firstName: "Fake",
        lastName: "User1",
        email: 'user1@user.io',
        username: seederUserNames[1],
        hashedPassword: bcrypt.hashSync('password2')
      },
      {
        firstName: "Fake",
        lastName: "User2",
        email: 'user2@user.io',
        username: seederUserNames[2],
        hashedPassword: bcrypt.hashSync('password3')
      }
    ], { validate: true });
  },

  async down (queryInterface, _Sequelize) {
    return queryInterface.bulkDelete(options, {
      username: seederUserNames
    }, {});
  }
};
