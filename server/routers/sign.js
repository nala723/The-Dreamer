const router = require("express").Router();

const controllers = require("../controllers");

router.post("/signup", controllers.signup);
router.post("/signin", controllers.signin);
// router.get("/signout", controllers.signout);
// router.delete("/withdrawal", controllers.withdrawal);
// router.post("/email-code", controllers.emailCode);
// router.post("/email-verification", controllers.emailVerification);

module.exports = router;