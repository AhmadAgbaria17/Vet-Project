const mongoose = require('mongoose');
const Joi = require('joi');
const {Schema} = mongoose;

const QuestionSchema = new Schema(
  {
    questionText: {
      type: String,
      required: [true, 'Question is required'],
      minlength: 5,
      maxlength: 500,
    },
    answer: {
      type: String,
      required: false,
      minlength: 5,
      maxlength: 500,
    },
    petName:{
      type: String,
      required: false,
      minlength: 2,
      maxlength: 50,
    },
    petId: {
      type: Schema.Types.ObjectId,
      ref: 'Pet',
      required: false,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Customer is required'],
    },
    vetId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Vet is required'],
    },
    status: {
      type: String,
      enum: ['open', 'answered', 'closed'],
      default: 'open',
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);



const Question = mongoose.model('Question', QuestionSchema);


function validateQuestion(question) {
  const schema = Joi.object({
    questionText: Joi.string().min(5).max(500).required(),
    petName: Joi.string().min(2).max(50).allow('').optional(),
    petId: Joi.string().optional(),
    vetId: Joi.string().required(),
  });

  return schema.validate(question);
}



function validateUpdateQuestion(question) {
  const schema = Joi.object({
    questionText: Joi.string().min(5).max(500).required(),
    petName: Joi.string().min(2).max(50).allow('').optional(),
    petId: Joi.string().optional(),
  });

  return schema.validate(question);
}


function validateAnswer(answer){
  const schema = Joi.object({
    answer: Joi.string().min(5).max(500).required(),
  });
  return schema.validate(answer);
}

module.exports ={
  Question,
  validateQuestion,
  validateAnswer,
  validateUpdateQuestion,
}
