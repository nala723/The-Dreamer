const axios = require("axios");
require('dotenv').config();

module.exports = async (req, res) => {
    let qu = req.query.query
    let reqOptions = {
      headers: {
        'X-Naver-Client-Id': process.env.CLIENT_ID,
        'X-Naver-Client-Secret': process.env.CLIENT_SECRET
      },
      params: {
        query: qu,
        display: 10
      }
    };
    try {
      let sarchRes = await axios.get(
        'https://openapi.naver.com/v1/search/blog.json',
        reqOptions
      );
      return res.status(200).json(sarchRes.data);
    } catch (error) {
        
        res.status(response.statusCode).end();
        console.log('Error', error.message, response.statusCode);
        console.log(error.config);
    }
}   