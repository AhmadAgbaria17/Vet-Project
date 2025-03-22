const { addClinic, getAllClincs, updateClinic, deleteClinic } = require('../controllers/clinicController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = require('express').Router();

// /clinic
router.route("")
.post(verifyToken,addClinic);

// /clinic/:userId
router.route("/:userId")
.get(getAllClincs)

// /clinic/item/:clinicId
router.route("/item/:clinicId")
.put(verifyToken,updateClinic)
.delete(verifyToken,deleteClinic)





module.exports = router;