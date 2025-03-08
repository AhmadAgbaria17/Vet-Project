const { addClinic } = require('../controllers/clinicController');

const router = require('express').Router();

// /clinic/add
router.route("/add")
.post(addClinic);





module.exports = router;