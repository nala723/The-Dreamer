'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('User_like_dreams', {
      fields: ['dream_id'],
      type: 'foreign key',
      name: 'FK_likes_dream',
      references: {
        table: 'Dreams',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
    await queryInterface.addConstraint('User_like_dreams', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'FK_likes_user',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('User_like_dreams', 'FK_likes_dream');
    await queryInterface.removeConstraint('User_like_dreams', 'FK_likes_user');
  }
};
