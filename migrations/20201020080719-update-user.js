'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
          'Users',
          'role',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "User"
          }
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'role')
    ]);
  }
};
