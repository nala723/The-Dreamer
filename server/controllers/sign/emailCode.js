require("dotenv").config();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const smtpServerURL = "smtp.gmail.com";
const authUser = process.env.EMAIL_ID;
const authPass = process.env.EMAIL_PW;
const fromEmail = process.env.EMAIL_ID;
module.exports = (req, res) => {
  try {
    const email = req.body.email;
    const generateRandom = function (min, max) {
      let ranNum = Math.floor(Math.random() * (max - min + 1)) + min;
      return ranNum;
    };

    const number = generateRandom(1111, 9999);

    let transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      host: smtpServerURL,
      auth: {
        user: authUser,
        pass: authPass,
      },
    });

    let mailOptions = {
      from: fromEmail,
      to: email,
      subject: "The-Dreamer 본인인증 메일입니다",
      text: `아래 번호를 입력해 주세요
            ${number}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        //에러
        //console.log(error);
        console.log(error)
      }
      //전송 완료
      //console.log("Finish sending email : " + info.response);
      transporter.close();
    });
~
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(String(number), salt, (err, hash) => {
        if (err) {
          throw err;
        } else {
          res.status(200).json({
            data: { emailcode: hash },
            message: "ok",
          });
        }
      });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};