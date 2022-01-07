const { Picture } = require('../../models');
const fs = require('fs');
const { isAuthorized, remakeToken } = require('../tokenFunctions')

module.exports = async(req, res) => {
    const authorization = req.headers['authorization'];
   try{
       if(!authorization){
        res.status(401).json({message : '유효한 회원이 아닙니다.'});
      }else{
        if(req.file === undefined){
            res.status(401).json({message : '그림이 없습니다.'});
        }else{        
            const accessToken = authorization.split(' ')[1];

            if(isAuthorized(accessToken) === 'jwt expired'){
              res.set('accessToken', remakeToken(req)); //엑세스 토큰 만기시 다시 만들어서 헤더에 담아서 보내기
            }

            const userData = isAuthorized(accessToken);
            const saveImage = fs.readFileSync(req.file.path);
            // const saveImage = req.file.location
            // console.log('있나~:', saveImage)
            await Picture.create({
                title : req.body.title,
                picture : saveImage,
                emotion: req.body.emotion,
                user_id : userData.id
            })
            .then(response=>{
                res.status(200).json({message : '업로드 성공'})
            })
            .catch(err=>{
                res.status(500).send(err);
            })
          }
        }
    } catch (error) {
        res.status(500).send(error);
    }
};