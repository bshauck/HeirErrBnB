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
        email: "demo@user.io",
        username: seederUserNames[0],
        hashedPassword: bcrypt.hashSync("password")
      },
      {
        firstName: "Franco",
        lastName: "Portin",
        email: "franco@user.io",
        username: seederUserNames[1],
        hashedPassword: bcrypt.hashSync(seederUserNames[1])
      },
      {
        firstName: "Alec",
        lastName: "Keeler",
        email: "alec@user.io",
        username: seederUserNames[2],
        hashedPassword: bcrypt.hashSync(seederUserNames[2])
      },
      {
        firstName: "Anthony",
        lastName: "Lovern",
        email: "anthony@user.io",
        username: seederUserNames[3],
        hashedPassword: bcrypt.hashSync(seederUserNames[3])
      },
      {
        firstName: "Josh",
        lastName: "Goldberg",
        email: "josh@user.io",
        username: seederUserNames[4],
        hashedPassword: bcrypt.hashSync(seederUserNames[4])
      },
      {
        firstName: "Adam",
        lastName: "Tifrit",
        email: "adam@user.io",
        username: seederUserNames[5],
        hashedPassword: bcrypt.hashSync(seederUserNames[5])
      },
      {
        firstName: "Elliot",
        lastName: "Starr",
        email: "elliot@user.io",
        username: seederUserNames[6],
        hashedPassword: bcrypt.hashSync(seederUserNames[6])
      },
      {
        firstName: "Hayden",
        lastName: "Gogan",
        email: "hayden@user.io",
        username: seederUserNames[7],
        hashedPassword: bcrypt.hashSync(seederUserNames[7])
      },
      {
        firstName: "Jon",
        lastName: "Diez",
        email: "jon@user.io",
        username: seederUserNames[8],
        hashedPassword: bcrypt.hashSync(seederUserNames[8])
      },
      {
        firstName: "Mason",
        lastName: "Austin",
        email: "mason@user.io",
        username: seederUserNames[9],
        hashedPassword: bcrypt.hashSync(seederUserNames[9])
      },
      {
        firstName: "Steve",
        lastName: "Nielson",
        email: "steve@user.io",
        username: seederUserNames[10],
        hashedPassword: bcrypt.hashSync(seederUserNames[10])
      },
      {
        firstName: "Lan",
        lastName: "Oribello",
        email: "lan@user.io",
        username: seederUserNames[11],
        hashedPassword: bcrypt.hashSync(seederUserNames[11])
      },
      {
        firstName: "Mira",
        lastName: "Borkowska",
        email: "mira@user.io",
        username: seederUserNames[12],
        hashedPassword: bcrypt.hashSync(seederUserNames[12])
      }
    ], { validate: true });
  },

  async down (queryInterface, _Sequelize) {
    return queryInterface.bulkDelete(options, {
      username: seederUserNames
    }, {});
  }
};
