const asyncHandler = require("express-async-handler");
const {Question, validateQuestion, validateUpdateQuestion, validateAnswer} = require("../models/Question");


/**
 * * @desc Get all questions by a specific user
 * * @route /questions
 * * @method Get
 * * @access private
 */
module.exports.getAllQuestionsByUserCtrl = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  try {
    var questions;
    if(req.user.userType === "vet") {
      questions = await Question.find({ vetId: userId }).populate("vetId","firstName lastName").populate('customerId','firstName lastName');
    }else{
      questions = await Question.find({ customerId: userId }).populate("vetId","firstName lastName").populate('customerId','firstName lastName');
    }
    res.status(200).json({
      message: "Questions fetched successfully",
      questions: questions});
  } catch (error) {
    console.error("Error fetching questions by vet", error);
    res.status(500).json({ message: "Error fetching questions", error: error.message });
  }
});


/**
 * * @desc Create a new question by a customer
 * * @route /questions
 * * @method Post
 * * @access private
 * */
module.exports.createQuestionCtrl = asyncHandler(async (req, res) => {
  const { error } = validateQuestion(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const newQuestion = await Question.create({
      ...req.body,
      customerId: req.user.userId, 
    });
    res.status(201).json({
      message: "Question created successfully",
      question: newQuestion,
    });
  } catch (error) {
    console.error("Error creating question", error);
    res.status(500).json({ message: "Error creating question", error: error.message });
  }
});



/**
 * * @desc Update the answer question by the vet
 * * @route /questions/answer/:questionId
 * * @method Put
 * * @access private
 */
module.exports.updateQuestionAnswerCtrl = asyncHandler(async (req, res) => {
  const questionId = req.params.questionId;
  const { answer } = req.body;
  const { error } = validateAnswer(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      { answer: answer, status: 'answered' },
      { new: true }
    );
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({
      message: "Question answer updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Error updating question answer", error);
    res.status(500).json({ message: "Error updating question answer", error: error.message });
  }
}
);


/**
 * * @desc Update a question by the customer 
 * * @route /questions/:questionId
 *  * @method Put
 * * @access private
 * */
module.exports.updateQuestionCtrl = asyncHandler(async (req, res) => {
  const questionId = req.params.questionId;
  const { error } = validateUpdateQuestion(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // check the status of the question if it is answered or not
  const question = await Question.findById(questionId);
  if(!question || question.status === 'answered'){
    return res.status(400).json({ message: "You cannot update an answered question" });
  }
  const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      req.body,
      { new: true }
    );
    try {
    if (!updatedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({
      message: "Question updated successfully",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error("Error updating question", error);
    res.status(500).json({ message: "Error updating question", error: error.message });
  }
});


/**
 * * @desc Delete a question by the customer
 * * @route /questions/:questionId
 * * @method Delete
 * * @access private
 */
module.exports.deleteQuestionCtrl = asyncHandler(async (req, res) => {
  const questionId = req.params.questionId;
  try {
    const deletedQuestion = await Question.findByIdAndDelete(questionId);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json({
      message: "Question deleted successfully",
      question: deletedQuestion,
    });
  } catch (error) {
    console.error("Error deleting question", error);
    res.status(500).json({ message: "Error deleting question", error: error.message });
  }
});






