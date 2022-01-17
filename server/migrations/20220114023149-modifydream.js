'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Dreams', "user_id")
    await queryInterface.removeColumn('Dreams', "keyword")
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Dreams', "user_id",{
      type: Sequelize.INTEGER
    })
    await queryInterface.addColumn('Dreams', "keyword", {
      type: Sequelize.STRING
    })
  }
};
