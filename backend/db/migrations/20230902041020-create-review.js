'use strict';
const options = {};
options.tableName = 'Reviews';
if (process.env.NODE_ENV === 'production')
  options.schema = process.env.SCHEMA;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model: 'Users'},
        onDelete: 'CASCADE'
      },
      spotId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model: 'Spots'},
        onDelete: 'CASCADE'
      },
      commentary: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      stars: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        type: Sequelize.DATE
      }
    }, options);
  },
  async down(queryInterface, _Sequelize) {
    await queryInterface.dropTable(options);
  }
};
