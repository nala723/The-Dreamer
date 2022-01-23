const {  Dream, User_like_dream } = require("../../models");
const { isAuthorized, remakeToken } = require("../tokenFunctions");

module.exports = async (req, res) => {
  const { url,title,content } = req.body;
  try {
    const authorization = req.headers["authorization"];
    if (!authorization) {
      res.status(401).json("invalid token");
    } else {
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
      if (!userId) {
        res.status(401).json("invalid user");
      } else {
        const dreamInfo = await Dream.findOne({where: {url: url}});
        if(!dreamInfo){ // db에 있는 정보인지 (없으면 새로 생성)
          const createDream = await Dream.create({
            url: url,
            title: title,
            content: content
          }) // 정보가 있다면 - 이미 같은 유저가 추가했는지 
          if(createDream){
            const userLikeDream = await User_like_dream.create({ // dream 레코드 추가했다면 userlikedrea 조인레코드 추가
                user_id: userId,
                dream_id: createDream.id,
              })
            if(userLikeDream){
              return res.status(200).json({ message : 'like this dream', likeId: createDream.id })
            }      
          }
        } else { 
          const hasJoinId = await User_like_dream.findOne({where: {user_id: userId, dream_id: dreamInfo.id}})
            if(!hasJoinId) {
              const userLikeDream = await User_like_dream.create({
                  user_id: userId,
                  dream_id: dreamInfo.id,
                })
              if(userLikeDream){
                return res.status(200).json({ message : 'like this dream', likeId: dreamInfo.id })
              }        
          } else {
              return res.status(200).json({ message: "already liked it", likeId: dreamInfo.id })
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};