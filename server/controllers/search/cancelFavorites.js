const  { User_like_dream } = require("../../models")
const { isAuthorized, remakeToken } = require("../tokenFunctions");

module.exports = async (req, res) => {
    // res.send('즐겨찾기 해제')
    try {const authorization = req.headers['authorization'];
    const dreamId = req.params.dreamId
    if(!authorization){
      res.status(401).json('invalid token')
    }
    else{
      let accessToken = authorization.split(' ')[1];
    
      function checkAuthorizaed() {
          if(isAuthorized(accessToken) === 'jwt expired'){
          accessToken = remakeToken(req)
          res.set('accessToken', accessToken); 
        return accessToken
        }
      }
      accessToken = checkAuthorizaed();
      const userData = isAuthorized(accessToken);
      const userId = userData.id;
      if(!userId){
          res.status(401).json('invalid user')
      }
      else{
        await User_like_dream.destroy({
        where: { dream_id: dreamId, user_id: userId }
        }).then(re=>{
          res.send({ message : `dislike ${req.params.dreamId} dream` })
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
  