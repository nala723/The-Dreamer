const models = require("../../models");
const { isAuthorized, remakeToken } = require("../tokenFunctions");

module.exports = async (req, res) => {
  try {
    const dreamId = req.params.dreamId;
    const authorization = req.headers["authorization"];

    if (!authorization) {
      res.status(401).json("invalid token");
    } else {
      const accessToken = authorization.split(" ")[1];
      if(isAuthorized(accessToken) === 'jwt expired'){
        res.set('accessToken', remakeToken(req));
      }
      const userData = isAuthorized(accessToken);
      const userId = userData.id;
      console.log(userData);
      if (!userId) {
        res.status(401).json("invalid user");
      } else {
        models.User_like_dream.create({
          user_id: userId,
          dream_id: dreamId,
        });
        res.send({ message: "like this dream" });
      }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};