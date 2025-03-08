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

    const newClinic = new Clinic(req.body);
    await newClinic.save();

    await User.findByIdAndUpdate(req.body.userId, {
      $push: { clinics: newClinic, _id },
    });

    res.status(201).json({ message: "Clinic Added Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding clinic", error: error.message });
  }
});
