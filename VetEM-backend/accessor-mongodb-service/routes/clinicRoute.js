const { addClinic, getAllClincs, updateClinic, deleteClinic } = require('../controllers/clinicController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = require('express').Router();

// /clinic
router.route("")
.post(verifyToken,addClinic)
.get(getAllClincs);



// /clinic/:clinicId
router.route("/:clinicId")
.put(verifyToken,updateClinic)
.delete(verifyToken,deleteClinic)





module.exports = router;