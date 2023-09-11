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
        firstName: "Franco",
        lastName: "Portin",
        email: "franco@user.io",
        username: seederUserNames[0],
        hashedPassword: bcrypt.hashSync("francoportin")
      },
      {
        firstName: "Alec",
        lastName: "Keeler",
        email: "alec@user.io",
        username: seederUserNames[1],
        hashedPassword: bcrypt.hashSync('aleckeeler')
      },
      {
        firstName: "Anthony",
        lastName: "Lovern",
        email: "anthony@user.io",
        username: seederUserNames[2],
        hashedPassword: bcrypt.hashSync("anthonylovern")
      },
      {
        firstName: "Josh",
        lastName: "Goldberg",
        email: "josh@user.io",
        username: seederUserNames[3],
        hashedPassword: bcrypt.hashSync("joshgoldberg")
      },
      {
        firstName: "Adam",
        lastName: "Tifrit",
        email: "adam@user.io",
        username: seederUserNames[4],
        hashedPassword: bcrypt.hashSync('adamtifrit')
      },
      {
        firstName: "Elliot",
        lastName: "Starr",
        email: "elliot@user.io",
        username: seederUserNames[5],
        hashedPassword: bcrypt.hashSync('elliotstarr')
      },
      {
        firstName: "Hayden",
        lastName: "Gogan",
        email: "hayden@user.io",
        username: seederUserNames[6],
        hashedPassword: bcrypt.hashSync("haydengogan")
      },
      {
        firstName: "Jon",
        lastName: "Diez",
        email: "jon@user.io",
        username: seederUserNames[7],
        hashedPassword: bcrypt.hashSync("jondiez")
      },
      {
        firstName: "Mason",
        lastName: "Austin",
        email: "mason@user.io",
        username: seederUserNames[8],
        hashedPassword: bcrypt.hashSync("masonaustin")
      },
      {
        firstName: "Steve",
        lastName: "Nielson",
        email: "steve@user.io",
        username: seederUserNames[9],
        hashedPassword: bcrypt.hashSync("stevenielson")
      },
      {
        firstName: "Lan",
        lastName: "Oribello",
        email: "lan@user.io",
        username: seederUserNames[10],
        hashedPassword: bcrypt.hashSync("lanoribello")
      },
      {
        firstName: "Mira",
        lastName: "Borkowska",
        email: "mira@user.io",
        username: seederUserNames[11],
        hashedPassword: bcrypt.hashSync("miraborkowska")
      }
    ], { validate: true });
  },

  async down (queryInterface, _Sequelize) {
    return queryInterface.bulkDelete(options, {
      username: seederUserNames
    }, {});
  }
};
