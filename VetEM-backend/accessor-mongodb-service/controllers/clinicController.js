const asyncHandler = require("express-async-handler");
const { Clinic, validateClinic, validateUpdateClinic } = require("../models/Clinic");
const { User } = require("../models/User");
const mongoose = require('mongoose');


/**
 * @desc add clinic to DB
 * @route /clinic
 * @method Post
 * @access private
 */
module.exports.addClinic = asyncHandler(async (req, res) => {
  try {
    const { error } = validateClinic(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const {name, openTime,location,userId} = req.body;
    console.log("Open Time:", openTime);
    const user= await User.findById(userId);
    if(!user){
      return res.status(404).json({ message: "User not found" });
    }
    const newClinic = await Clinic.create({
      name,
      openTime,
      location,
      userId,
    })
    await User.findByIdAndUpdate(userId, 
      {$push: {clinics: newClinic._id }},
      {new: true},
    );
    res.status(201).json({
       message: "Clinic Added Successfully",
       clinic: newClinic,
  
      });
  } catch (error) {
    console.error("Error adding clinic", error);
    res
      .status(500)
      .json({ message: "Error adding clinic", error: error.message });
  }
});

/**
 * @desc update clinic to DB
 * @route /clinic/item/:clinicId
 * @method Put
 * @access private
 */
module.exports.updateClinic = asyncHandler(async (req, res) => {
  try {
    const {name, openTime,location} = req.body;
    const clinicId = req.params.clinicId;
    const { error } = validateUpdateClinic(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const clinic = await Clinic.findById(clinicId);
    if(!clinic){
      return res.status(404).json({ message: "Clinic not found" });
      }
  
    // update clinic
    const updatedClinic = await Clinic.findByIdAndUpdate(
      clinicId,
      { name , openTime , location},
      { new: true , runValidators:true }
    );
    res.status(200).json({
       message: "Clinic Updated Successfully",
       clinic: updatedClinic,
      });
  } catch (error) {
    console.error("Error adding clinic", error);
    res
      .status(500)
      .json({ message: "Error adding clinic", error: error.message });
  }
});

/**
 * @desc Delete clinic from DB
 * @route /clinic/item/:clinicId
 * @method Delete
 * @access Private
 */
module.exports.deleteClinic = asyncHandler(async (req, res) => {
  try {
    const clinicId = req.params.clinicId;
    const clinic = await Clinic.findById(clinicId);
    if(!clinic){
      return res.status(404).json({ message: "Clinic not found" });
      }
      const userId = clinic.userId.toString();
      await Clinic.findByIdAndDelete(clinicId);
      await User.findByIdAndUpdate(
        userId,
        {$pull: {clinics: clinicId}},
        {new : true}
      );
      res.status(200).json({ message: "Clinic deleted successfully" });
    }catch(error){
      console.error("Error deleting clinic", error);
      res.status(500).json({ message: "Error deleting clinic" });
    }
 })


/**
 * @desc get all user Clinics
 * @route /clinic/home/:id
 * @method Get
 * @access private
 */
module.exports.getAllClincs = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;

    if(!mongoose.Types.ObjectId.isValid(userId)){
      return res.status(400).json({message:"invalid id"})
  }

    const user = await User.findById(userId).populate("clinics");

    res.status(201).json({
       message: "got all the clinics Successfully",
       UserClinics:user.clinics,
  
      });
  } catch (error) {
    console.error("Error get all the clinic", error);
    res
      .status(500)
      .json({ message: "Error adding clinic", error: error.message });
  }
});

