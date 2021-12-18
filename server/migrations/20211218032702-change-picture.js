'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Pictures', "picture",{
      type: Sequelize.BLOB('long'),
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Pictures', "picture",{
      type: Sequelize.BLOB,
    })
  }
};
