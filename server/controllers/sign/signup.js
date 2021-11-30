const model = require('../../models');
const fs = require('fs');
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../tokenFunctions');

module.exports = async (req, res) => {
    let {nickname, email, password} = req.body;

    let profile = fs.readFileSync(
      __basedir + "/resources/assets/tmp/bros_blank.jpg"
    )

    let user = await model.user.findOne({where : {email : email}});
    if(user){
      res.status(409).json({message : '이미 존재하는 이메일입니다'});
    }else{
      try {

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if(err){
              throw err;
            }else{
              const users = model.user.create({
                 nickname : nickname,
                 password : hash,
                 email : email,
                 profile : profile,
                 social : 0
              })
              return users
              .then((users) => {
                const userInfo = {id: users.id, email: email, nickName: nickname, vegtype:users.vegtype}
                console.log(userInfo)
                const access_token = generateAccessToken(userInfo);
                const refresh_token = generateRefreshToken(userInfo);
                
                res.cookie('RefreshToken', refresh_token, {httpOnly: true, sameSite: 'none', secure: true});
                res.status(200).json({
                  message : 'ok',
                  accessToken : access_token,
                  profileblob : profile,
                  nickname : nickname,
                  email : email
                })
              })
            }
          })
        })

      } catch (error) { 
        res.status(500).send(error)
      }
    }
};
  