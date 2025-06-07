const { mongoSignUpUserCtrl, mongoLoginUserCtrl, mongoAddClinicCtrl, mongoGetAllUserClinicsCtrl, mongoGetUserCtrl, mongoUpdateOneClinicCtrl, mongoDeleteOneClinicCrtl,mongoGetVetCustomersCtrl, mongoGetAllCustomersCtrl, mongoaddcustomertoVetCtrl, mongoAcceptVetCustomerCtrl, mongoDeleteVetCustomerCtrl } = require('../controllers/mongodbController');

const router = require('express').Router();

// *****Login and Signup routes*****
// /mongodb/auth/signup
router.route('/auth/signup')
.post(mongoSignUpUserCtrl)

// /mongodb/auth/login
router.route('/auth/login')
.post(mongoLoginUserCtrl)


// *****Clinic routes*****
// /mongodb/clinic
router.route('/clinic')
.post(mongoAddClinicCtrl)

// /mongodb/clinic
router.route('/clinics')
.get(mongoGetAllUserClinicsCtrl)

// /mongodb/clinics/:clinicId
router.route('/clinics/:clinicId')
.put(mongoUpdateOneClinicCtrl)
.delete(mongoDeleteOneClinicCrtl)

// /mongodb/vetcustomers
router.route('/vetcustomers')
.get(mongoGetVetCustomersCtrl)

// /mongodb/vetcustomers/:customerId
router.route('/vetcustomers/:customerId')
.post(mongoaddcustomertoVetCtrl)
.put(mongoAcceptVetCustomerCtrl)
.delete(mongoDeleteVetCustomerCtrl)



// /mongodb/user/customers
router.route('/user/customers')
.get(mongoGetAllCustomersCtrl)


// /mongodb/user/:userId
router.route('/user/:userId')
.get(mongoGetUserCtrl)

module.exports = router;