const  { User_like_dream } = require("../../models")
const { isAuthorized, remakeToken } = require("../tokenFunctions");

module.exports = async (req, res) => {
    // res.send('즐겨찾기 해제')
    try {const authorization = req.headers['authorization'];
    const likeId = req.params.likeId
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
        await User_like_dream.destroy({
        where: { id: likeId }
        }).then(re=>{
          res.send({ message : `dislike ${req.params.likeId} dream` })
        }).catch(err=>{
          console.log(err)
          res.status(500).send(error);
        })
      }
    }}
    catch (error) {
        res.status(500).send(error);
     }
}
  