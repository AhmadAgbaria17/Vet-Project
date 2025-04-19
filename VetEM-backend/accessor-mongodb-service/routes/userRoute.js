const { getUserCtrl, getAllCustomersCtrl } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = require('express').Router();
// //user/customers
router.route("/customers")
 .get(getAllCustomersCtrl);

// //user/:userId
router.route("/:userId")
.get(verifyToken,getUserCtrl);


module.exports = router;