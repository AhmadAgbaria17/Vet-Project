const { addClinic, getAllClincs, updateClinic, deleteClinic } = require('../controllers/clinicController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

const router = require('express').Router();

// /clinic
router.route("")
.post(verifyToken, authorizeRoles("vet"), addClinic)
.get(verifyToken, getAllClincs);



// /clinic/:clinicId
router.route("/:clinicId")
.put(verifyToken, authorizeRoles("vet"), updateClinic)
.delete(verifyToken, authorizeRoles("vet"), deleteClinic)





module.exports = router;
