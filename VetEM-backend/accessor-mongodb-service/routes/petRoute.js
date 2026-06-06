
const { addPet, getPets, updatePet, deletePet, AddPetMedicalRecCtrl } = require('../controllers/petController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');


const router = require('express').Router();

// /pets
router.route("")
.get(verifyToken, authorizeRoles("client"), getPets)
.post(verifyToken, authorizeRoles("client"), addPet);

// /pets/:petId
router.route("/:petId")
.put(verifyToken, authorizeRoles("client"), updatePet)
.delete(verifyToken, authorizeRoles("client"), deletePet);

// /pets/:petId/medical-records
router.route("/:petId/medical-records")
.put(verifyToken, authorizeRoles("vet"), AddPetMedicalRecCtrl)

module.exports = router;
