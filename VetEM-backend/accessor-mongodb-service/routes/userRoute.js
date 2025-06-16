const { getUserCtrl, getAllCustomersCtrl , addcustomertoVetCtrl , AccepetCustomerReqCtrl , DeleteCustomervetCtrl, getAllVetCustomersCtrl } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = require('express').Router();
// //user/customers
router.route("/customers")
 .get(getAllCustomersCtrl);

// //user/:userId
router.route("/:userId")
.get(verifyToken,getUserCtrl);

// //user/vetcustomers
router.route("/vet/customers")
.get(verifyToken,getAllVetCustomersCtrl);

// //user/vetcustomers/:customerId
router.route("/vet/customers/:customerId")
.post(verifyToken, addcustomertoVetCtrl)
.put(verifyToken, AccepetCustomerReqCtrl)
.delete(verifyToken, DeleteCustomervetCtrl);


module.exports = router;