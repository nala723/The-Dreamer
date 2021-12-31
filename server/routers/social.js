const router = require("express").Router();

const controllers = require("../controllers");

router.post("/signin", controllers.socialSignin);

router.delete("/withdrawal", controllers.socialWithdrawl);

module.exports = router;