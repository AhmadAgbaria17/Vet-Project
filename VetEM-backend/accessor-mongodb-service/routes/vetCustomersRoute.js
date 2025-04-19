const { getAllCustomersCtrl } = require('../controllers/vetCustomersController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = require('express').Router();

// /vetcustomers/:vetId
router.route("/:vetId")
.get(verifyToken,getAllCustomersCtrl);

module.exports = router;