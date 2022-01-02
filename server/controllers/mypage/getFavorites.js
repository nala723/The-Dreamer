const { Dream, User_like_dream } = require('../../models');
const { isAuthorized, remakeToken } = require('../tokenFunctions')

module.exports = async (req, res) => {
  const authorization = req.headers['authorization'];
  let sendArr = [];
  let obj = {};

  try {
    if(!authorization){
      res.status(401).json({message : 'invalid token'})
    }else{
        const accessToken = authorization.split(' ')[1];

        if(isAuthorized(accessToken) === 'jwt expired'){
          res.set('accessToken', remakeToken(req)); //엑세스 토큰 만기시 다시 만들어서 헤더에 담아서 보내기
        }

        const userData = isAuthorized(accessToken);

        const userId = userData.id;

        const likeList = await User_like_dream.findAll({
          include : [{
            model : Dream,
            required : true,
            attributes : ['id', 'title', 'url', 'keyword', 'content', 'createdAt']
          }],
          where : {
            user_id : userId
          }
        });

        for(let i=0; i<likeList.length; i++){
          obj['title'] = likeList[i].dataValues.Dream.dataValues.title;
          obj['dream_id'] = likeList[i].dataValues.Dream.dataValues.id;
          obj['url'] = likeList[i].dataValues.Dream.dataValues.url;
          obj['keyword'] = likeList[i].dataValues.Dream.dataValues.keyword;
          obj['content'] = likeList[i].dataValues.Dream.dataValues.content;
          obj['createdAt'] = likeList[i].dataValues.Dream.dataValues.createdAt;
          sendArr.push(obj);
          obj = {};
        }

        res.status(200).json({dream : sendArr});
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
  
  