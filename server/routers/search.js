const express = require('express');
const router = express.Router();
const controller = require('../controllers');

router.get('/search', controller.search);
// router.get("/:placeId", controllers.select);
router.post("/like", controller.createFavorites);
router.delete("/dislike/:likeId", controller.cancelFavorites);

module.exports = router;