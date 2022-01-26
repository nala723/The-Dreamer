"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_like_dream extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_like_dream.init(
    {
      user_id: DataTypes.INTEGER,
      dream_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User_like_dream",
    }
  );
  return User_like_dream;
};
