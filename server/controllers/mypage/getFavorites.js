const { Dream, User_like_dream } = require("../../models");
const { isAuthorized, remakeToken } = require("../tokenFunctions");

module.exports = async (req, res) => {
  const authorization = req.headers["authorization"];
  let sendArr = [];
  let obj = {};
  try {
    if (!authorization) {
      return res.status(401).json({ message: "invalid token" });
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
      const likeList = await User_like_dream.findAll({
        include: [
          {
            model: Dream,
            required: true,
            attributes: ["id", "title", "url", "content", "createdAt"],
          },
        ],
        where: {
          user_id: userId,
        },
      });

      for (let i = 0; i < likeList.length; i++) {
        obj["title"] = likeList[i].dataValues.Dream.dataValues.title;
        obj["dream_id"] = likeList[i].dataValues.Dream.dataValues.id;
        obj["url"] = likeList[i].dataValues.Dream.dataValues.url;
        obj["content"] = likeList[i].dataValues.Dream.dataValues.content;
        obj["createdAt"] = likeList[i].dataValues.Dream.dataValues.createdAt;
        sendArr.push(obj);
        obj = {};
      }

      res.status(200).json({ dream: sendArr });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
