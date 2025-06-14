
const { addPet } = require('../controllers/petController');
const { verifyToken } = require('../middlewares/authMiddleware');


const router = require('express').Router();


router.route("")
.post(verifyToken,addPet);


module.exports = router;