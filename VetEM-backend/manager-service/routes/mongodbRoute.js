const { mongoSignUpUserCtrl, mongoLoginUserCtrl, mongoAddClinicCtrl, mongoGetAllUserClinicsCtrl, mongoGetUserCtrl, mongoUpdateOneClinicCtrl, mongoDeleteOneClinicCrtl,mongoGetVetCustomersCtrl, mongoGetAllCustomersCtrl, mongoaddcustomertoVetCtrl } = require('../controllers/mongodbController');

const router = require('express').Router();

// /mongodb/auth/signup
router.route('/auth/signup')
.post(mongoSignUpUserCtrl)

// /mongodb/auth/login
router.route('/auth/login')
.post(mongoLoginUserCtrl)

// /mongodb/user/customers
router.route('/user/customers')
.get(mongoGetAllCustomersCtrl)


// /mongodb/user/:userId
router.route('/user/:userId')
.get(mongoGetUserCtrl)


// /mongodb/clinic
router.route('/clinic')
.post(mongoAddClinicCtrl)

// /mongodb/clinic/:userId
router.route('/clinic/:userId')
.get(mongoGetAllUserClinicsCtrl)

// /mongodb/clinic/item/:clinicId
router.route('/clinic/item/:clinicId')
.put(mongoUpdateOneClinicCtrl)
.delete(mongoDeleteOneClinicCrtl)

// /mongodb/vetcustomers
router.route('/vetcustomers')
.get(mongoGetVetCustomersCtrl)

// /mongodb/vetcustomers/:customerId
router.route('/vetcustomers/:customerId')
.post(mongoaddcustomertoVetCtrl)

module.exports = router;