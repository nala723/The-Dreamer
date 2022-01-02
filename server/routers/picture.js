const router = require("express").Router();

const controllers = require("../controllers");
const savepic = require('../middleware/save-pic');

router.post("/save-pic", savepic.single('picture'), controllers.savePicture);

module.exports = router;