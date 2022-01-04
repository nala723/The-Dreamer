'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Picture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Picture.init({
    user_id: DataTypes.INTEGER,
    title: DataTypes.STRING,
    emotion: DataTypes.STRING,
    picture: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Picture',
  });
  return Picture;
};