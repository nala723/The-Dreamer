const { user } = require("../../models");
const bcrypt = require('bcrypt');
const { generateAccessToken, generateRefreshToken } = require('../tokenFunctions')

module.exports = async (req, res) => {
  try {
    const userInfo = await user.findOne({attributes: ['id', 'nickname', 'email', 'vegtype', 'password', 'profile'], where : {email: req.body.email}});
    const userProfile = userInfo.dataValues.profile;
    
    if(!userInfo){
      return res.status(401).json({message : "Invalid user or wrong password"});
    }else{
        bcrypt.compare(req.body.password, userInfo.dataValues.password).then((isMatch) => {
              if(!isMatch){
                return res.status(401).json({message : "Invalid user or wrong password"});
              }else{
                  delete userInfo.dataValues.password;
                  delete userInfo.dataValues.profile;
                  const access_token = generateAccessToken(userInfo.dataValues);
                  const refresh_token = generateRefreshToken(userInfo.dataValues);

                  res.cookie('RefreshToken', refresh_token, {httpOnly: true, sameSite: 'none', secure: true});
                  res.json({
                    message : 'ok',
                    accessToken : access_token,
                    profileblob : userProfile,
                    nickname : userInfo.dataValues.nickname,
                    email : userInfo.dataValues.email
                  })
              }
            })
    }

    

  } catch (error) {
    res.status(500).send(error);
  }
};
