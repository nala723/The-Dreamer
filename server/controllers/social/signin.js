const { User } = require('../../models');
const { generateAccessToken, generateRefreshToken } = require('../tokenFunctions');

module.exports = async (req, res) => {
  const { email, username } = req.body;

  try {
    const userInfo = await User.findOne({where : {email: email}});
    if(!userInfo){
       //유저 정보가 없을 경우 처음 구글 로그인한 사람이므로 db에 정보 넣어주기
       const users = User.create({
         username :  username,
         email : email,
       })
       return users
       .then((users) => {
         const socialUserInfo = {id: users.id, email: email, username: username }
         const access_token = generateAccessToken(socialUserInfo);
         const refresh_token = generateRefreshToken(socialUserInfo);

         res.cookie('RefreshToken', refresh_token, {httpOnly: true, sameSite: 'none', secure: true});
         res.status(200).json({
           message : 'Successfully Social Signup',
           accessToken : access_token,
           username: username,
           email : email
          });
       })
    }else{
      //이미 구글 로그인 한 적 있으면 바로 메시지 보내주기
        delete userInfo.dataValues.password;
        delete userInfo.dataValues.profile;
        const access_token = generateAccessToken(userInfo.dataValues);
        const refresh_token = generateRefreshToken(userInfo.dataValues);

        res.cookie('RefreshToken', refresh_token, {httpOnly: true, sameSite: 'none', secure: true});
        res.status(200).json({
          message : "Successfully Social Signin",
          accessToken : access_token,
          username : userInfo.dataValues.username,
          email : userInfo.dataValues.email
        });
    }
  } catch (error) {
        res.status(500).send(error);
  }
};