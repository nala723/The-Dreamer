const models = require("../../models")
const { isAuthorized, remakeToken } = require("../tokenFunctions");

module.exports = async (req, res) => {
    // res.send('즐겨찾기 해제')
    try {const authorization = req.headers['authorization'];
    const dreamId = req.params.dreamId
    console.log(authorization)
    if(!authorization){
      res.status(401).json('invalid token')
    }
    else{
      const accessToken = authorization.split(' ')[1];
      if(isAuthorized(accessToken) === 'jwt expired'){
        res.set('accessToken', remakeToken(req));
      }
      const userData = isAuthorized(accessToken);
      const userId = userData.id;
      if(!userId){
          res.status(401).json('invalid user')
      }
      else{
        models.User_like_dream.destroy({
        where: { user_id: userId, dream_id: dreamId }
        })
    res.send({ message : `dislike ${req.params.dreamId} dream` })
}
    }}
    catch (error) {
        res.status(500).send(error);
     }
}
  