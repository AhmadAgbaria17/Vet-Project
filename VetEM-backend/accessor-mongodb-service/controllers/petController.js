const asyncHandler = require("express-async-handler");
const { Pet, validatePet } = require("../models/Pet");
const { User } = require("../models/User");

/**
 * @desc add pet to DB
 * @route /pets
 * @method Post
 * @access private
 */
module.exports.addPet = asyncHandler(async (req, res) => {
  try {
    const { error } = validatePet(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { name, age, species, breed, medicalHistory , ownerId } = req.body;
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Owner not found" });
    }
    const newPet = await Pet.create({
      name,
      age,
      species,
      breed,
      medicalHistory,
      ownerId
    });
    await User.findByIdAndUpdate(ownerId, 
      { $push: { 'clientInfo.pets': newPet._id } },
      { new: true },
    );
    res.status(201).json({
      message: "Pet Added Successfully",
      pet: newPet,
    });
  } catch (error) {
    console.error("Error adding pet", error);
    res
      .status(500)
      .json({ message: "Error adding pet", error: error.message });
  }
}
);