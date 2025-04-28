'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      user_id: {
        type: sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: sequelize.STRING,
        allowNull: false
      },
      email: {
        type: sequelize.STRING,
        allowNull: false
      },
      password: {
        type: sequelize.STRING,
        allowNull: false
      },
      profile_picture_path: {
        type: sequelize.STRING,
        allowNull: true
      },
      full_name: {
        type: sequelize.STRING,
        allowNull: true
      },
      bio: {
        type: sequelize.STRING,
        allowNull: true
      },
      country: {
        type: sequelize.STRING,
        allowNull: true
      },
      birthdate: {
        type: sequelize.DATE,
        allowNull: true
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
