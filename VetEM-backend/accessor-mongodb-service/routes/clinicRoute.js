const { addClinic, getAllClincs } = require('../controllers/clinicController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = require('express').Router();

// /clinic/home
router.route("/home")
.post(verifyToken,addClinic);

// /clinics/home/:userId
router.route("/home/:userId")
.get(getAllClincs)





module.exports = router;