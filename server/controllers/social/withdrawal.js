const { User } = require('../../models')

module.exports = async (req, res) => {
    const authorization = req.headers['authorization'];
    const email = req.body.email;

    try {
      const accessToken = authorization.split(' ')[1];
      //토큰 없으면 구글 로그인한 사람이 아니므로 유저 아니라는 메세지 보내기 
      if(!accessToken){
        res.status(401).json({message : "invalid user"});

      }else{
        await User.destroy({
          where : {
            email : email
          }
        })
        .then((result) => {
          res.status(200).json({message : "success"})
        })
      }
    } catch (error) {
      res.status(500).send(error);
    }
};
  