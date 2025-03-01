const mongoose = require('mongoose');
const Joi = require("joi");


const UserSchema = new mongoose.Schema
(
  {
    firstName:{
      type: String,
      required: [true, 'Please provide your first name'],
    },
    lastName:{
      type: String,
      required: [true, 'Please provide your last name'],
    },
    email:{
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      match: [/\S+@\S+\.\S+/, "Invalid email format"],
    },
    password:{
      type: String,
      required: [true, 'Please provide your password'],
      minlength: 6,
    },
    userType:{
      type: String,
      enum: ['client', 'admin'],
    },
    isAccountVerified:{
      type: Boolean,
      default: false,
    },
    accountVerificationToken:{
      type: String,
    },
  },
  {timestamps: true,}
);




const User = mongoose.model("User", UserSchema);

// validate register user
function validateRegisterUser(user){
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(user);
}






module.exports = {
  User,
  validateRegisterUser,
};