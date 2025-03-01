const { mongoSignUpUserCtrl, mongoLoginUserCtrl } = require('../controllers/mongodbController');

const router = require('express').Router();

// /mongodb/auth/signup
router.route('/auth/signup')
.post(mongoSignUpUserCtrl)

// /mongodb/auth/login
router.route('/auth/login')
.post(mongoLoginUserCtrl)

// /mongodb/user/profile
router.route('/user/profile')
.get(mongoGetUserCtrl)


module.exports = router;