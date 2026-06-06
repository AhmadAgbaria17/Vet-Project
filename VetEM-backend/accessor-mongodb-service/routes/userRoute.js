const { getUserCtrl, getAllCustomersCtrl , addcustomertoVetCtrl , AccepetCustomerReqCtrl , DeleteCustomervetCtrl, getAllVetCustomersCtrl } = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = require('express').Router();
// //user/customers
router.route("/customers")
 .get(verifyToken, authorizeRoles("vet"), getAllCustomersCtrl);

// //user/:userId
router.route("/:userId")
.get(verifyToken,getUserCtrl);

// //user/vetcustomers
router.route("/vet/customers")
.get(verifyToken, authorizeRoles("vet"), getAllVetCustomersCtrl);

// //user/vetcustomers/:customerId
router.route("/vet/customers/:customerId")
.post(verifyToken, authorizeRoles("vet"), addcustomertoVetCtrl)
.put(verifyToken, authorizeRoles("vet"), AccepetCustomerReqCtrl)
.delete(verifyToken, authorizeRoles("vet"), DeleteCustomervetCtrl);


module.exports = router;
