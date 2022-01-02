'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', "profile",{
      type: Sequelize.BLOB('long'),
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Users', "profile",{
      type: Sequelize.BLOB,
    })
  }
};

