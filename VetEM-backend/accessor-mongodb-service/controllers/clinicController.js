const asyncHandler = require("express-async-handler");
const { Clinic, validateClinic } = require("../models/Clinic");
const { User } = require("../models/User");

/**
 * @desc add clinic to DB
 * @route /clinic/add
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
 * @desc add clinic to DB
 * @route /clinic/home/:id
 * @method Post
 * @access private
 */
module.exports.getAllClincs = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).populate("clinics");

    res.status(201).json({
       message: "got all the clinics Successfully",
       UserClinics:user.clinics,
  
      });
  } catch (error) {
    console.error("Error adding clinic", error);
    res
      .status(500)
      .json({ message: "Error adding clinic", error: error.message });
  }
});

