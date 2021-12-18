const { Picture } = require('../../models');
const { isAuthorized, remakeToken } = require('../tokenFunctions')

module.exports = async (req, res) => {
  const authorization = req.headers['authorization'];
  try {
    if(!authorization){
      res.status(401).json({message : 'invalid token'})
    }else{
      const accessToken = authorization.split(' ')[1];
      if(isAuthorized(accessToken) === 'jwt expired'){
        res.set('accessToken', remakeToken(req)); //엑세스 토큰 만기시 다시 만들어서 헤더에 담아서 보내기
      }
      const picture_id = req.body.picture_id;
      console.log('오디까지왔나')
      await Picture.destroy({
        where : {
       id : picture_id
       }
      }).then((result)=> {
        res.status(200).json({message : '삭제 성공'})
      }).catch(err=>{
        res.status(500).send(err);
        console.log('에러러러러',err)
      })
    }
  } catch (error) {
     res.status(500).send(error);
  }
};