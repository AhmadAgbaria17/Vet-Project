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
      required: true
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
        required: true
      },
      notes: {
        type: String,
        required: false
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
    breed: Joi.string().required(),
    age: Joi.number().required(),
medicalHistory: Joi.array()
  .items(
    Joi.object({
      diagnosis: Joi.string().required(),
      treatment: Joi.string().required(),
      prescription: Joi.string().required(),
      notes: Joi.string().allow('').optional()
    })
  )
  .required(),
    ownerId: Joi.string().required()
  });

  return schema.validate(pet);
}

function validatePetUpdate(pet) {
  const schema = Joi.object({
    name: Joi.string().optional(),
    species: Joi.string().optional(),
    breed: Joi.string().optional(),
    age: Joi.number().optional(),
    medicalHistory: Joi.object({
      diagnosis: Joi.string().optional(),
      treatment: Joi.string().optional(),
      prescription: Joi.string().optional(),
      notes: Joi.string().optional()
    }).optional(),
    ownerId: Joi.string().optional()
  });

  return schema.validate(pet);
}

module.exports = {
  Pet,
  validatePet,
  validatePetUpdate
};