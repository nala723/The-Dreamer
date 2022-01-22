require('dotenv').config();
const multer = require("multer");

if(process.env.NODE_ENV === "production") {
  const multerS3 = require('multer-s3'); 
  const aws = require('aws-sdk');
  aws.config.loadFromPath(__dirname + '/../s3.json'); 
  const s3 = new aws.S3();  

  const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Please upload only images.", false);
    }
  };
  
  const uploadFile = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'the-dreamer-bucket/user-picture',
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
      },
    }),
    fileFilter: imageFilter,
    limits: { 
      fileSize: 1000 * 1000 * 10 
    }
  })

  module.exports = uploadFile;
}

else {
  const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Please upload only images.", false);
    }
  };

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __basedir + "/resources/pictures/");
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });

  const uploadFile = multer({ storage: storage, fileFilter: imageFilter });
  module.exports = uploadFile;
}

