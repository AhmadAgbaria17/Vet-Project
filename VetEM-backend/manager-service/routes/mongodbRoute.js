const { mongoSignUpUserCtrl, mongoLoginUserCtrl, mongoAddClinicCtrl, mongoGetAllUserClinicsCtrl, mongoGetUserCtrl, mongoUpdateOneClinicCtrl, mongoDeleteOneClinicCrtl } = require('../controllers/mongodbController');

const router = require('express').Router();

// /mongodb/auth/signup
router.route('/auth/signup')
.post(mongoSignUpUserCtrl)

// /mongodb/auth/login
router.route('/auth/login')
.post(mongoLoginUserCtrl)

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

module.exports = router;