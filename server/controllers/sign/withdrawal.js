const { isAuthorized } = require("../tokenFunctions");
const { User, Dream, User_like_dream } = require("../../models");

module.exports = async (req, res) => {
  const authorization = req.headers["authorization"];

  try {
    if (!authorization) {
      res.status(401).json("invalid token");
    } else {
      const accessToken = authorization.split(" ")[1];
      const userData = isAuthorized(accessToken);
      const userid = userData.id;

      await User.destroy({
        where: {
          id: userid,
        },
      });

      await Dream.destroy({
        where: {
          id: userid,
        },
      });

      await User_like_dream.destroy({
        where: {
          id: userid,
        },
      });

      res.status(200).json({ message: "ok" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
