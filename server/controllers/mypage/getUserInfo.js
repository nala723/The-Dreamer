const { User } = require('../../models');
const { isAuthorized, remakeToken } = require('../tokenFunctions')

module.exports = async (req, res) => {
  const authorization = req.headers['authorization'];

  try {
    if(!authorization){
      res.status(401).json({message : 'invalid token'})
    }else{
      let accessToken = authorization.split(' ')[1];
   
      function checkAuthorizaed() {
          if(isAuthorized(accessToken) === 'jwt expired'){
          accessToken = remakeToken(req)
          res.set('accessToken', accessToken); 
        return accessToken
        }
      }
      accessToken = await checkAuthorizaed();

      const userData = isAuthorized(accessToken);

      const userInfo = await User.findOne({attributes : ['username', 'profile', 'email'], where : { email : userData.email}});

      res.status(200).json({
        message : 'ok',
        username : userInfo.dataValues.username,
        profile : userInfo.dataValues.profile,
        email : userInfo.dataValues.email
      })
    }

  } catch (error) {
     res.status(500).send(error);
  }
};