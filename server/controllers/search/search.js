const axios = require("axios");
require('dotenv').config();

module.exports = async (req, res) => {
    let qu = req.query.query
    // let reqOptions = {
    //   headers: {
    //     'X-Naver-Client-Id': process.env.CLIENT_ID,
    //     'X-Naver-Client-Secret': process.env.CLIENT_SECRET,
    //     'Content-Type' : 'application/json; charset=utf-8'
    //   },
    //   params: {
    //     query: qu,
    //     display: 10
    //   }
    // };
    try {
      let sarchRes = await axios.get(
        'https://openapi.naver.com/v1/search/blog.json',
        {
          headers: {
            'X-Naver-Client-Id': process.env.CLIENT_ID,
            'X-Naver-Client-Secret': process.env.CLIENT_SECRET,
            'Content-Type' : 'application/json; charset=utf-8'
          },
          params: {
            query: qu,
            display: 10
          }
        }
      );
      return res.status(200).json(sarchRes.data);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    }
}   