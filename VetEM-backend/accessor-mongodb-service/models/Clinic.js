const mongoose = require('mongoose');
const Joi = require("joi");
const { Schema } = mongoose;




const ClinicSchema = new Schema
(
  {
  name: {
    type: String,
    required: true
  },
  openTime: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^\d{2}:\d{2}-\d{2}:\d{2}$/.test(value);
      },
      message: "Invalid openTime format. Use HH:MM-HH:MM (e.g., 14:00-19:00)"
    }
  },
  location: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},
{timestamps: true,}
);

const Clinic = mongoose.model('Clinic', ClinicSchema);

function validateClinic(clinic) {
  const schema = Joi.object({
    name: Joi.string().required(),
    openTime: Joi.string()
      .pattern(/^\d{2}:\d{2}-\d{2}:\d{2}$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid openTime format. Use HH:MM-HH:MM (e.g., 14:00-19:00)"
      }),
    location: Joi.object()
      .keys({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
      })
      .required(),
    userId: Joi.string().required()
  });
  
  return schema.validate(clinic);
}


function validateUpdateClinic(clinic) {
  const schema = Joi.object({
    name: Joi.string(),
    openTime: Joi.string()
      .pattern(/^\d{2}:\d{2}-\d{2}:\d{2}$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid openTime format. Use HH:MM-HH:MM (e.g., 14:00-19:00)"
      }),
    location: Joi.object()
      .keys({
        latitude: Joi.number(),
        longitude: Joi.number()
      })
      ,
    userId: Joi.string()
  });
  
  return schema.validate(clinic);
}

module.exports = {
  Clinic,
  validateClinic,
  validateUpdateClinic
}