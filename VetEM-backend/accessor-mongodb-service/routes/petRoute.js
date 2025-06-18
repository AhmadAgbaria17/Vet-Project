
const { addPet, AddPetMedicalRecCtrl } = require('../controllers/petController');
const { verifyToken } = require('../middlewares/authMiddleware');


const router = require('express').Router();

// /pets
router.route("")
.post(verifyToken,addPet);

// /pets/:petId/medical-records
router.route("/:petId/medical-records")
.put(verifyToken,AddPetMedicalRecCtrl)

module.exports = router;