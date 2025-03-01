const { signUpUserCtrl, verifyEmailCtrl, loginUserCtrl } = require('../controllers/authController');

const router = require('express').Router();

// /auth/signup
router.route("/signup")
.post(signUpUserCtrl);

// /auth/login
router.route("/login")
.post(loginUserCtrl);


// /auth/verify-email
router.route("/verify-email")
.get(verifyEmailCtrl);



module.exports = router;