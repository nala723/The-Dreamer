const model = require("../../models");
const fs = require("fs");
const bcrypt = require("bcrypt");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../tokenFunctions");

module.exports = async (req, res) => {
  let { username, email, password } = req.body;

  let profile = fs.readFileSync(__basedir + "/resources/assets/bros_blank.jpg");

  let user = await model.User.findOne({ where: { email: email } });
  if (user) {
    res.status(409).json({ message: "이미 존재하는 이메일입니다" });
  } else {
    try {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            throw err;
          } else {
            const newUser = model.User.create({
              username: username,
              password: hash,
              email: email,
              profile: profile,
            });
            if (newUser) {
              const userInfo = {
                id: newUser.id,
                email: email,
                username: username,
              };
              const access_token = generateAccessToken(userInfo);
              const refresh_token = generateRefreshToken(userInfo);

              res.cookie("RefreshToken", refresh_token, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
              });
              res.status(200).json({
                message: "ok",
                accessToken: access_token,
                profile: profile,
                username: username,
                email: email,
              });
            }
          }
        });
      });
    } catch (error) {
      console.log("에러", error);
      res.status(500).send(error);
    }
  }
};
