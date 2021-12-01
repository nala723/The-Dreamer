const bcrypt = require('bcrypt')

module.exports = async (req, res) => {

  try {
    const { code } = req.query; //해시된 상태로
    const { emailCode } = req.body; //해시 안된 상태로 

    bcrypt.compare(emailCode, code)
    .then((isMatch) => {
      if(!isMatch){
        res.status(401).json({message : "invalid email Code"})
      }else{
        res.status(200).json({message : "ok"});
      }
    })
    
  } catch (error) {

    res.status(500).send(error);

  }

  
};
  