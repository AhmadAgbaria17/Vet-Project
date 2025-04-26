const { getAllCustomersCtrl, addcustomertoVetCtrl } = require('../controllers/vetCustomersController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = require('express').Router();

// /vetcustomers
router.route("")
.get(verifyToken,getAllCustomersCtrl);

// /vetcustomers/:customerId
router.route("/:customerId")
.post(verifyToken, addcustomertoVetCtrl);

module.exports = router;