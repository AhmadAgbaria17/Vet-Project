const {User} = require('../models/User');
const asyncHandler = require('express-async-handler');

/**
 * @desc get all the customers of a vet from DB by vetId
 * @route /vetcustomers/:vetId
 * @method GET
 * @access private
 */
module.exports.getAllCustomersCtrl = asyncHandler(async (req, res)=> {
  const vetId = req.params.vetId;

  try {
    
    const vet = await User.findById(vetId)
    .populate("vetInfo.vetClients", "-password -__v -createdAt -updatedAt -vetInfo")
    .populate("vetInfo.vetClientRequests", "-password -__v -createdAt -updatedAt -vetInfo")
    .populate("vetInfo.vetClientWaitApproval", "-password -__v -createdAt -updatedAt -vetInfo")
    .select("-password -__v -createdAt -updatedAt");

    if (!vet) {
      return res.status(404).json({ message: "Vet not found" });
    }

    const vetCustomers = {
      vetClients: vet.vetInfo.vetClients,
      vetClientRequests: vet.vetInfo.vetClientRequests,
      vetClientWaitApproval: vet.vetInfo.vetClientWaitApproval,
    };
    

    res.status(200).json({message:"got all customers of user" , customers: vetCustomers });

  
  }catch (error) {
    console.error("Error fetching user", error);
    res.status(500).json({ message: "Error fetching user" });
  }

})