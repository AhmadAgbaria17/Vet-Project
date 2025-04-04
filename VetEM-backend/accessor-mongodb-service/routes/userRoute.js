const { getUserCtrl } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = require('express').Router();

// //user/:userId
router.route("/:userId")
.get(verifyToken,getUserCtrl);

module.exports = router;