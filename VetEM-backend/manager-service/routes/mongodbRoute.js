const { mongoSignUpUserCtrl, mongoLoginUserCtrl, mongoAddClinicCtrl, mongoGetAllClinicsCtrl, mongoGetAllUserClinicsCtrl, mongoGetUserCtrl } = require('../controllers/mongodbController');

const router = require('express').Router();

// /mongodb/auth/signup
router.route('/auth/signup')
.post(mongoSignUpUserCtrl)

// /mongodb/auth/login
router.route('/auth/login')
.post(mongoLoginUserCtrl)

// /mongodb/user
router.route('/user')
.get(mongoGetUserCtrl)

// /mongodb/clinic
router.route('/clinic')
.post(mongoAddClinicCtrl)

router.route('/clinic/:userId')
.get(mongoGetAllUserClinicsCtrl)

module.exports = router;