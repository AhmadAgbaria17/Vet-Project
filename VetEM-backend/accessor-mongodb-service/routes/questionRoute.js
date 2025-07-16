const { getAllQuestionsByVetCtrl, getAllQuestionsByCustomerCtrl, createQuestionCtrl, updateQuestionCtrl, deleteQuestionCtrl, getAllQuestionsByUserCtrl } = require('../controllers/questionController');
const { verifyToken } = require('../middlewares/authMiddleware');


const router = require('express').Router();

// get all the questions of a specific vet

// post a new question
//questions
router.route('/')
.post(verifyToken, createQuestionCtrl)
.get(verifyToken, getAllQuestionsByUserCtrl);


// edit a question
// /questions/:questionId
router.route('/:questionId')
.put(verifyToken, updateQuestionCtrl)
.delete(verifyToken, deleteQuestionCtrl);

// update question answer
router.route('/answer/:questionId')
.put(verifyToken, updateQuestionAnswerCtrl);


module.exports = router;