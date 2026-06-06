const mongoose = require('mongoose');
const Joi = require("joi");
const { Schema } = mongoose;


const PetSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    species: {
      type: String,
      required: true
    },
    breed: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: false
    },
    birthDate: {
      type: Date,
      required: false
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unknown'],
      default: 'unknown'
    },
    image: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    },
    medicalHistory:[{
      diagnosis:{
        type: String,
        required: true
      },
      treatment: {
        type: String,
        required: true
      },
      prescription:{
        type: String,
        required: false
      },
      vetId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
      },
      vetName: {
        type: String,
        required: false
      },
      notes: {
        type: String,
        required: false
    },
      date: {
        type: Date,
        default: Date.now
      }
  }],
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {timestamps: true,}
);

const Pet = mongoose.model('Pet',PetSchema);

function validatePet(pet) {
  const schema = Joi.object({
    name: Joi.string().required(),
    species: Joi.string().required(),
    breed: Joi.string().allow('').optional(),
    age: Joi.number().min(0).optional(),
    birthDate: Joi.date().optional(),
    gender: Joi.string().valid('male', 'female', 'unknown').optional(),
    image: Joi.string().allow('').optional(),
    notes: Joi.string().allow('').optional()
  });

  return schema.validate(pet);
}

function validatePetUpdate(pet) {
  const schema = Joi.object({
    name: Joi.string().optional(),
    species: Joi.string().optional(),
    breed: Joi.string().optional(),
    age: Joi.number().min(0).optional(),
    birthDate: Joi.date().optional(),
    gender: Joi.string().valid('male', 'female', 'unknown').optional(),
    image: Joi.string().allow('').optional(),
    notes: Joi.string().allow('').optional()
  });

  return schema.validate(pet);
}

module.exports = {
  Pet,
  validatePet,
  validatePetUpdate
};
