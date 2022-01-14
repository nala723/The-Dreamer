const {  Dream, User_like_dream } = require("../../models");
const { isAuthorized, remakeToken } = require("../tokenFunctions");

module.exports = async (req, res) => {
  const { url,title,content } = req.body;
  try {
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
      if (!userId) {
        res.status(401).json("invalid user");
      } else {
        const dreamInfo = await Dream.findOne({where: {url: url}});
        if(!dreamInfo){ // db에 있는 정보인지 (없으면 새로 생성)
          Dream.create({
            url: url,
            title: title,
            content: content
          }) // 정보가 있다면 - 이미 같은 유저가 추가했는지
        } else { 
          const hasJoinId = await User_like_dream.findOne({where: {user_id: userId, dream_id: dreamInfo.id}})
            if(!hasJoinId) {
                User_like_dream.create({
                user_id: userId,
                dream_id: dreamInfo.id,
              }).then((re)=>{
                 res.status(200).json({
                  message : 'like this dream"',
                  likeId: re.dataValues.id,
                })
              }).catch((err)=> console.log(err))

          } else {
             res.send({ message: "already liked it" });
          }
        }
     }
    }
  } catch (error) {
    res.status(500).send(error);
  }
};