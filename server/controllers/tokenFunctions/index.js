require('dotenv').config();
const { sign, verify} = require('jsonwebtoken');

module.exports = {
    generateAccessToken: (data) => {
        const access_token = sign(data, process.env.ACCESS_SECRET, {expiresIn: 6000});
        return access_token;
    },

    generateRefreshToken: (data) => {
        const refresh_token = sign(data, process.env.REFRESH_SECRET, {expiresIn : 60*60*24*7});
        return refresh_token;
    },
    isAuthorized: (token) => {
        const data = verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
            if(err){
                return err.message;
            }else{
                return decoded;
            }
        })
        return data;
    },
    remakeToken: (req) => {
        let refresh_token = req.cookies.RefreshToken;
        //console.log(refresh_token);

        let data = verify(refresh_token, process.env.REFRESH_SECRET, (err, decoded) => {
            if(err){
                throw err;
            }else{
                return decoded;
            }
        });
        
        const access_token = sign(data, process.env.ACCESS_SECRET, {expiresIn: 6000});
        return access_token;
    }
}