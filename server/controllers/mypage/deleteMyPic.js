require('dotenv').config();
const { Picture } = require('../../models');
const { isAuthorized, remakeToken } = require('../tokenFunctions')
const aws = require('aws-sdk');
aws.config.loadFromPath(__dirname + "/./../../s3.json" ); 
const s3 = new aws.S3();

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
      const picture_id = req.params.id;

        if(process.env.NODE_ENV === "production") {
            const PictureInfo = await Picture.findOne({attributes : ['picture'], where : {  id : picture_id }})
            if(PictureInfo){
              let url = result.dataValues.picture.split('/');
              url = url[url.length-1]

              s3.deleteObject({
                Bucket: 'the-dreamer-bucket/user-picture', // 사용자 버켓 이름
                Key: url // 버켓 내 경로
              }, (err, data) => {
                if (err) {  
                  console.log('err :', err, err.stack) }
                else if(data){
                  console.log('aws video delete success' + data)
                }
              })
            }  
          }

        await Picture.destroy({
          where : {
          id : picture_id
          }
        })
        res.status(200).json({message : '삭제 성공'})
    }
  } catch (error) {
    console.log(error);
     res.status(500).send(error);
  }
};