const router = require("express").Router();

const controllers = require("../controllers");
const upload = require('../middleware/upload');

router.patch("/user-info", upload.single('profile'), controllers.updateUserInfo);
router.get("/user-info", controllers.getUserInfo);
router.get("/like", controllers.getFavorites);
router.get("/mypics", controllers.getMyPics);
router.delete("/delete-pic/:id", controllers.deleteMyPic);

module.exports = router;