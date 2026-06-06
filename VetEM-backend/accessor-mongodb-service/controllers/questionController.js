const asyncHandler = require("express-async-handler");
const {
  Question,
  validateQuestion,
  validateUpdateQuestion,
  validateAnswer,
} = require("../models/Question");
const { User } = require("../models/User");
const { Pet } = require("../models/Pet");

const questionPopulate = [
  { path: "vetId", select: "firstName lastName email phone" },
  { path: "customerId", select: "firstName lastName email phone" },
  { path: "petId", select: "name species breed" },
];

module.exports.getAllQuestionsByUserCtrl = asyncHandler(async (req, res) => {
  const filter =
    req.user.userType === "vet"
      ? { vetId: req.user.userId }
      : { customerId: req.user.userId };

  const questions = await Question.find(filter)
    .populate(questionPopulate)
    .sort({ updatedAt: -1 });

  res.status(200).json({ message: "Questions fetched successfully", questions });
});

module.exports.createQuestionCtrl = asyncHandler(async (req, res) => {
  const { error } = validateQuestion(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const vet = await User.findOne({ _id: req.body.vetId, userType: "vet" });
  if (!vet) {
    return res.status(404).json({ message: "Veterinarian not found" });
  }

  if (req.body.petId) {
    const pet = await Pet.findOne({ _id: req.body.petId, ownerId: req.user.userId });
    if (!pet) {
      return res.status(403).json({ message: "You can only ask about your own pets" });
    }
  }

  const question = await Question.create({
    questionText: req.body.questionText,
    petName: req.body.petName || "",
    petId: req.body.petId,
    vetId: req.body.vetId,
    customerId: req.user.userId,
    status: "open",
  });

  res.status(201).json({ message: "Question created successfully", question });
});

module.exports.updateQuestionAnswerCtrl = asyncHandler(async (req, res) => {
  const { error } = validateAnswer(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const question = await Question.findOne({
    _id: req.params.questionId,
    vetId: req.user.userId,
  });

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }

  question.answer = req.body.answer;
  question.status = "answered";
  await question.save();

  res.status(200).json({ message: "Question answered successfully", question });
});

module.exports.updateQuestionCtrl = asyncHandler(async (req, res) => {
  const { error } = validateUpdateQuestion(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const question = await Question.findOne({
    _id: req.params.questionId,
    customerId: req.user.userId,
  });

  if (!question) {
    return res.status(404).json({ message: "Question not found" });
  }
  if (question.status !== "open") {
    return res.status(400).json({ message: "You cannot edit an answered or closed question" });
  }

  question.questionText = req.body.questionText;
  if (req.body.petName !== undefined) question.petName = req.body.petName;
  if (req.body.petId !== undefined) question.petId = req.body.petId;
  await question.save();

  res.status(200).json({ message: "Question updated successfully", question });
});

module.exports.deleteQuestionCtrl = asyncHandler(async (req, res) => {
  const question = await Question.findOneAndDelete({
    _id: req.params.questionId,
    customerId: req.user.userId,
    status: "open",
  });

  if (!question) {
    return res.status(404).json({ message: "Open question not found" });
  }

  res.status(200).json({ message: "Question deleted successfully", question });
});
