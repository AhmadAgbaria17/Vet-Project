const { User } = require("../models/User");
const asyncHandler = require("express-async-handler");

const publicClientSelect = "-password -__v -createdAt -updatedAt -vetInfo -accountVerificationToken";
const publicVetSelect = "-password -__v -createdAt -updatedAt -clientInfo -accountVerificationToken";

const asId = (value) => value.toString();

module.exports.getUserCtrl = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const requesterId = req.user.userId;

  if (userId !== requesterId && req.user.userType !== "vet") {
    return res.status(403).json({ message: "You can only view your own profile" });
  }

  const target = await User.findById(userId).select("userType");
  if (!target) {
    return res.status(404).json({ message: "User not found" });
  }

  if (req.user.userType === "vet" && target.userType === "client" && userId !== requesterId) {
    const vet = await User.findById(requesterId).select("vetInfo.vetClients");
    const isConnected = vet?.vetInfo?.vetClients?.some((id) => asId(id) === userId);
    if (!isConnected) {
      return res.status(403).json({ message: "You can only view connected clients" });
    }
  }

  const user =
    target.userType === "vet"
      ? await User.findById(userId).populate("vetInfo.clinics").select(publicVetSelect)
      : await User.findById(userId).populate("clientInfo.pets").select(publicClientSelect);

  res.status(200).json({ message: "User fetched successfully", user });
});

module.exports.getAllCustomersCtrl = asyncHandler(async (req, res) => {
  const search = req.query.search?.trim();
  const filter = { userType: "client" };

  if (search) {
    filter.$or = [
      { firstName: new RegExp(search, "i") },
      { lastName: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { phone: new RegExp(search, "i") },
    ];
  }

  const clients = await User.find(filter)
    .limit(50)
    .populate("clientInfo.pets")
    .select(publicClientSelect);

  res.status(200).json({ message: "Clients fetched successfully", customers: clients });
});

module.exports.getAllVetCustomersCtrl = asyncHandler(async (req, res) => {
  const vet = await User.findById(req.user.userId)
    .populate("vetInfo.vetClients", publicClientSelect)
    .populate("vetInfo.vetClientRequests", publicClientSelect)
    .populate("vetInfo.vetClientWaitApproval", publicClientSelect)
    .select(publicVetSelect);

  if (!vet) {
    return res.status(404).json({ message: "Vet not found" });
  }

  res.status(200).json({
    message: "Customers fetched successfully",
    customers: {
      vetClients: vet.vetInfo.vetClients,
      vetClientRequests: vet.vetInfo.vetClientRequests,
      vetClientWaitApproval: vet.vetInfo.vetClientWaitApproval,
    },
  });
});

module.exports.addcustomertoVetCtrl = asyncHandler(async (req, res) => {
  const customerId = req.params.customerId;
  const vetId = req.user.userId;

  const [vet, customer] = await Promise.all([
    User.findOne({ _id: vetId, userType: "vet" }),
    User.findOne({ _id: customerId, userType: "client" }),
  ]);

  if (!customer) return res.status(404).json({ message: "Customer not found" });
  if (!vet) return res.status(404).json({ message: "Vet not found" });

  if (vet.vetInfo.vetClients.some((id) => asId(id) === customerId)) {
    return res.status(409).json({ message: "Customer is already connected" });
  }

  await Promise.all([
    User.findByIdAndUpdate(vetId, { $addToSet: { "vetInfo.vetClientWaitApproval": customerId } }),
    User.findByIdAndUpdate(customerId, { $addToSet: { "clientInfo.clientVetRequests": vetId } }),
  ]);

  res.status(200).json({ message: "Customer invitation sent" });
});

module.exports.AccepetCustomerReqCtrl = asyncHandler(async (req, res) => {
  const customerId = req.params.customerId;
  const vetId = req.user.userId;

  const [vet, customer] = await Promise.all([
    User.findOne({ _id: vetId, userType: "vet" }),
    User.findOne({ _id: customerId, userType: "client" }),
  ]);

  if (!customer) return res.status(404).json({ message: "Customer not found" });
  if (!vet) return res.status(404).json({ message: "Vet not found" });

  await Promise.all([
    User.findByIdAndUpdate(vetId, {
      $pull: { "vetInfo.vetClientRequests": customerId, "vetInfo.vetClientWaitApproval": customerId },
      $addToSet: { "vetInfo.vetClients": customerId },
    }),
    User.findByIdAndUpdate(customerId, {
      $pull: { "clientInfo.clientVetWaitApproval": vetId, "clientInfo.clientVetRequests": vetId },
      $addToSet: { "clientInfo.clientVet": vetId },
    }),
  ]);

  res.status(200).json({ message: "Customer connected successfully" });
});

module.exports.DeleteCustomervetCtrl = asyncHandler(async (req, res) => {
  const customerId = req.params.customerId;
  const vetId = req.user.userId;

  await Promise.all([
    User.findByIdAndUpdate(vetId, {
      $pull: {
        "vetInfo.vetClients": customerId,
        "vetInfo.vetClientRequests": customerId,
        "vetInfo.vetClientWaitApproval": customerId,
      },
    }),
    User.findByIdAndUpdate(customerId, {
      $pull: {
        "clientInfo.clientVet": vetId,
        "clientInfo.clientVetRequests": vetId,
        "clientInfo.clientVetWaitApproval": vetId,
      },
    }),
  ]);

  res.status(200).json({ message: "Customer relationship removed" });
});
