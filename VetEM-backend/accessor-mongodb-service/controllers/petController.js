const asyncHandler = require("express-async-handler");
const { Pet, validatePet, validatePetUpdate } = require("../models/Pet");
const { User } = require("../models/User");

const isConnectedVet = async (vetId, clientId) => {
  const vet = await User.findOne({
    _id: vetId,
    userType: "vet",
    "vetInfo.vetClients": clientId,
  });
  return Boolean(vet);
};

module.exports.getPets = asyncHandler(async (req, res) => {
  const ownerId = req.user.userId;
  const pets = await Pet.find({ ownerId }).sort({ createdAt: -1 });
  res.status(200).json({ message: "Pets fetched successfully", pets });
});

module.exports.addPet = asyncHandler(async (req, res) => {
  const { error } = validatePet(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const owner = await User.findById(req.user.userId);
  if (!owner || owner.userType !== "client") {
    return res.status(403).json({ message: "Only clients can add pets" });
  }

  const pet = await Pet.create({
    name: req.body.name,
    age: req.body.age,
    birthDate: req.body.birthDate,
    species: req.body.species,
    breed: req.body.breed || "",
    gender: req.body.gender || "unknown",
    image: req.body.image || "",
    notes: req.body.notes || "",
    medicalHistory: [],
    ownerId: owner._id,
  });

  await User.findByIdAndUpdate(owner._id, {
    $addToSet: { "clientInfo.pets": pet._id },
  });

  res.status(201).json({ message: "Pet added successfully", pet });
});

module.exports.updatePet = asyncHandler(async (req, res) => {
  const { error } = validatePetUpdate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const pet = await Pet.findOne({ _id: req.params.petId, ownerId: req.user.userId });
  if (!pet) {
    return res.status(404).json({ message: "Pet not found" });
  }

  ["name", "species", "breed", "age", "birthDate", "gender", "image", "notes"].forEach((field) => {
    if (req.body[field] !== undefined) {
      pet[field] = req.body[field];
    }
  });

  await pet.save();
  res.status(200).json({ message: "Pet updated successfully", pet });
});

module.exports.deletePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findOneAndDelete({ _id: req.params.petId, ownerId: req.user.userId });
  if (!pet) {
    return res.status(404).json({ message: "Pet not found" });
  }

  await User.findByIdAndUpdate(req.user.userId, {
    $pull: { "clientInfo.pets": pet._id },
  });

  res.status(200).json({ message: "Pet deleted successfully" });
});

module.exports.AddPetMedicalRecCtrl = asyncHandler(async (req, res) => {
  const { medicalRecord } = req.body;
  if (!medicalRecord?.diagnosis || !medicalRecord?.treatment) {
    return res.status(400).json({ message: "Diagnosis and treatment are required" });
  }

  const pet = await Pet.findById(req.params.petId);
  if (!pet) {
    return res.status(404).json({ message: "Pet not found" });
  }

  const allowed = await isConnectedVet(req.user.userId, pet.ownerId);
  if (!allowed) {
    return res.status(403).json({ message: "You can only update pets for connected clients" });
  }

  pet.medicalHistory.push({
    diagnosis: medicalRecord.diagnosis,
    treatment: medicalRecord.treatment,
    prescription: medicalRecord.prescription || "",
    notes: medicalRecord.notes || "",
    date: medicalRecord.date || new Date(),
    vetId: req.user.userId,
    vetName: req.user.firstName || "Veterinarian",
  });

  await pet.save();
  res.status(200).json({ message: "Medical record added successfully", updatedPet: pet });
});
