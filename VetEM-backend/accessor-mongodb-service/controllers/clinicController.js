const asyncHandler = require("express-async-handler");
const { Clinic, validateClinic, validateUpdateClinic } = require("../models/Clinic");
const { User } = require("../models/User");

const toRadians = (value) => (value * Math.PI) / 180;

const calculateDistanceKm = (from, to) => {
  if (!from || !to) return null;
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((earthRadiusKm * c).toFixed(2));
};

module.exports.addClinic = asyncHandler(async (req, res) => {
  const { error } = validateClinic(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const vet = await User.findById(req.user.userId);
  if (!vet || vet.userType !== "vet") {
    return res.status(403).json({ message: "Only veterinarians can manage clinics" });
  }

  const clinic = await Clinic.create({
    name: req.body.name,
    address: req.body.address || "",
    openTime: req.body.openTime,
    contactInfo: req.body.contactInfo || "",
    location: req.body.location,
    userId: vet._id,
  });

  await User.findByIdAndUpdate(vet._id, {
    $addToSet: { "vetInfo.clinics": clinic._id },
  });

  res.status(201).json({ message: "Clinic added successfully", clinic });
});

module.exports.updateClinic = asyncHandler(async (req, res) => {
  const { error } = validateUpdateClinic(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const clinic = await Clinic.findOne({
    _id: req.params.clinicId,
    userId: req.user.userId,
  });

  if (!clinic) {
    return res.status(404).json({ message: "Clinic not found" });
  }

  ["name", "address", "openTime", "contactInfo", "location"].forEach((field) => {
    if (req.body[field] !== undefined) {
      clinic[field] = req.body[field];
    }
  });

  await clinic.save();
  res.status(200).json({ message: "Clinic updated successfully", clinic });
});

module.exports.deleteClinic = asyncHandler(async (req, res) => {
  const clinic = await Clinic.findOneAndDelete({
    _id: req.params.clinicId,
    userId: req.user.userId,
  });

  if (!clinic) {
    return res.status(404).json({ message: "Clinic not found" });
  }

  await User.findByIdAndUpdate(req.user.userId, {
    $pull: { "vetInfo.clinics": clinic._id },
  });

  res.status(200).json({ message: "Clinic deleted successfully" });
});

module.exports.getAllClincs = asyncHandler(async (req, res) => {
  const latitude = req.query.latitude ? Number(req.query.latitude) : null;
  const longitude = req.query.longitude ? Number(req.query.longitude) : null;
  const origin =
    Number.isFinite(latitude) && Number.isFinite(longitude)
      ? { latitude, longitude }
      : null;

  let clinics;
  if (req.user.userType === "vet") {
    clinics = await Clinic.find({ userId: req.user.userId }).sort({ createdAt: -1 });
  } else {
    clinics = await Clinic.find({})
      .populate("userId", "firstName lastName email phone")
      .sort({ createdAt: -1 });
  }

  const clinicsWithDistance = clinics
    .map((clinic) => {
      const data = clinic.toObject();
      data.distanceKm = calculateDistanceKm(origin, data.location);
      return data;
    })
    .sort((a, b) => {
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      return a.distanceKm - b.distanceKm;
    });

  res.status(200).json({
    message: "Clinics fetched successfully",
    clinics: clinicsWithDistance,
    UserClinics: clinicsWithDistance,
  });
});
