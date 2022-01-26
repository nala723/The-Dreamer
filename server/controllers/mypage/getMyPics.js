const { Picture } = require("../../models");
const { isAuthorized, remakeToken } = require("../tokenFunctions");

module.exports = async (req, res) => {
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

      const userId = userData.id;
      const arr = [];
      let obj = {};

      await Picture.findAll({
        attributes: ["id", "title", "picture", "emotion", "createdAt"],
        where: {
          user_id: userId,
        },
      })
        .then(result => {
          for (let i = 0; i < result.length; i++) {
            obj["id"] = result[i].dataValues.id;
            obj["title"] = result[i].dataValues.title;
            obj["picture"] = result[i].dataValues.picture;
            obj["createdAt"] = result[i].dataValues.createdAt;
            obj["emotion"] = result[i].dataValues.emotion;
            arr.push(obj);
            obj = {};
          }
          res.status(200).json({ arr });
        })
        .catch(err => {
          res.status(500).send(err);
          console.log("에러러러러", err);
        });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
