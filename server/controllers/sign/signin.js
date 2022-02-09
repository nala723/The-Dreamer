const { User } = require("../../models");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../tokenFunctions");

module.exports = async (req, res) => {
  try {
    const userInfo = await User.findOne({
      attributes: ["id", "username", "email", "password", "profile"],
      where: { email: req.body.email },
    });
    if (!userInfo) {
      return res.status(401).json({
        message: "존재하지 않는 계정이거나 이메일을 잘못 입력하셨습니다.",
      });
    } else {
      const userProfile = userInfo.dataValues.profile;
      bcrypt
        .compare(req.body.password, userInfo.dataValues.password)
        .then(isMatch => {
          if (!isMatch) {
            return res
              .status(401)
              .json({ message: "비밀번호를 다시 확인해주세요." });
          } else {
            delete userInfo.dataValues.password;
            delete userInfo.dataValues.profile;
            const access_token = generateAccessToken(userInfo.dataValues);
            const refresh_token = generateRefreshToken(userInfo.dataValues);

            res.cookie("RefreshToken", refresh_token, {
              httpOnly: true,
              sameSite: "none",
              secure: true,
            });
            res.json({
              message: "ok",
              accessToken: access_token,
              profile: userProfile,
              username: userInfo.dataValues.username,
              email: userInfo.dataValues.email,
            });
          }
        });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
