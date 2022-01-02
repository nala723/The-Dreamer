'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.addConstraint('Pictures', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'FK_user',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    })

  },

  down: async (queryInterface, Sequelize) => {
     await queryInterface.removeConstraint('Pictures', 'FK_user');
  }
};
