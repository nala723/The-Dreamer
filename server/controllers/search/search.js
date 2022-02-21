const path = require("path");
require("dotenv").config({ path: __dirname + "/./../../.env" });

const axios = require("axios");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

module.exports = async (req, res) => {
  let qu = req.query.query;
  let reqOptions = {
    headers: {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    },
    params: {
      query: qu,
      display: 9,
    },
  };
  try {
    let sarchRes = await axios.get(
      "https://openapi.naver.com/v1/search/blog.json",
      reqOptions
    );
    return res.status(200).json(sarchRes.data);
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // 요청 받고 서버는 200이 아닌 스태터스 응답
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // 요청 받았지만 응답을 받지 못함
      // `error.request`는 브라우저의 XMLHttpRequest 인스턴스, node.js의 http.ClientRequest의 인스턴스
      console.log(error.request);
    } else {
      // 요청 중에 에러 발생
      console.log("Error", error.message);
    }
    console.log(error.config);
    return res.send(error);
  }
};
