const { User } = require("../../models");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { isAuthorized, remakeToken } = require("../tokenFunctions");

module.exports = (req, res) => {
  const authorization = req.headers["authorization"];
  try {
    if (!authorization) {
      res.status(401).json({ message: "invalid token" });
    } else {
      let accessToken = authorization.split(" ")[1];

      function checkAuthorizaed() {
        if (isAuthorized(accessToken) === "jwt expired") {
          accessToken = remakeToken(req);
          res.set("accessToken", accessToken);
        }
        return accessToken;
      }
      accessToken = checkAuthorizaed();

      const userData = isAuthorized(accessToken);
      const modifyImage = fs.readFileSync(req.file.path);
      const modifyPW = req.body.password;

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(modifyPW, salt, async (err, hash) => {
          if (err) {
            throw err;
          } else {
            await User.update(
              {
                profile: modifyImage,
                password: hash,
              },
              {
                where: {
                  email: userData.email,
                },
              }
            );
          }
        });
      });

      res.status(200).json({ message: "ok" });
    }
  } catch (error) {
    res.status(500).send(error, "errrrrrrrrrrrrrrrrr");
  }
};
