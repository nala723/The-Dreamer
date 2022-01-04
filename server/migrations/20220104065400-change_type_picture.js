'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Pictures', "picture",{
      type: Sequelize.TEXT
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Pictures', "picture",{
      type: Sequelize.BLOB('long'),
    })
  }
};
