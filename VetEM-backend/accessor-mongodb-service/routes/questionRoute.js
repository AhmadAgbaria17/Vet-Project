const { getAllQuestionsByVetCtrl, getAllQuestionsByCustomerCtrl, createQuestionCtrl, updateQuestionCtrl, deleteQuestionCtrl, getAllQuestionsByUserCtrl, updateQuestionAnswerCtrl } = require('../controllers/questionController');
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');


const router = require('express').Router();

// get all the questions of a specific vet

// post a new question
//questions
router.route('/')
.post(verifyToken, authorizeRoles("client"), createQuestionCtrl)
.get(verifyToken, getAllQuestionsByUserCtrl);


// edit a question
// /questions/:questionId
router.route('/:questionId')
.put(verifyToken, authorizeRoles("client"), updateQuestionCtrl)
.delete(verifyToken, authorizeRoles("client"), deleteQuestionCtrl);

// update question answer
// /questions/answer/:questionId
router.route('/answer/:questionId')
.put(verifyToken, authorizeRoles("vet"), updateQuestionAnswerCtrl);


module.exports = router;
