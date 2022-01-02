const { User } = require('../../models');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { isAuthorized, remakeToken } = require('../tokenFunctions')

module.exports = (req, res) => {
   const authorization = req.headers['authorization'];
   try {
     if(!authorization){
        res.status(401).json({message : 'invalid token'})
     }else{
        const accessToken = authorization.split(' ')[1];

        if(isAuthorized(accessToken) === 'jwt expired'){
          res.set('accessToken', remakeToken(req)); //엑세스 토큰 만기시 다시 만들어서 헤더에 담아서 보내기
        }
        //전체 다 입력한 상태에서 보내도록 해야함.
        const userData = isAuthorized(accessToken);
        const modifyImage = fs.readFileSync(req.file.path);
        const modifyPW = req.body.password;

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(modifyPW, salt, async (err, hash) => {
            if(err){
              throw err;
            }else{
              await User.update({
                profile : modifyImage,
                password : hash
              }, {
                where : {
                  email: userData.email
                }
              })
            }
          })
        })

        res.status(200).json({message : 'ok'})
     }
   } catch (error) {
      res.status(500).send(error, 'errrrrrrrrrrrrrrrrr');
   }
};