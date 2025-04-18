const mongoose = require('mongoose');
const Joi = require("joi");
const { Schema } = mongoose;

const UserSchema = new Schema
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
    phone:{
      type: String,
      required: [true, 'Please provide your phone number'],
      unique: true,
      match: [/^\d{10}$/, "Invalid phone number format"],
    },
    password:{
      type: String,
      required: [true, 'Please provide your password'],
      minlength: 6,
    },
    userType:{
      type: String,
      enum: ['client', 'vet' , 'admin'],
      required:true,
    },
    profileImg:{
      type: String,
      default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
    isAccountVerified:{
      type: Boolean,
      default: false,
    },
    accountVerificationToken:{
      type: String,
    },


    vetInfo:{
      clinics: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Clinic',
        },
      ],
      vetClients:[
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      vetClientRequests:[
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      vetClientWaitApproval:[
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },

    clientInfo:{
      pets: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Pet',
        },
      ],
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
    userType: Joi.string().valid('client', 'vet', 'admin').required(),
  });
  return schema.validate(user);
}






module.exports = {
  User,
  validateRegisterUser,
};