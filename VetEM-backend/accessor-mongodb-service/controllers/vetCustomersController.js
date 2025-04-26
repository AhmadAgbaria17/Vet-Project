const {User} = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require("jsonwebtoken");



/**
 * @desc get all the customers of a vet from DB by vetId
 * @route /vetcustomers
 * @method GET
 * @access private
 */
module.exports.getAllCustomersCtrl = asyncHandler(async (req, res)=> {
  // Get the vetId from the request parameters
  const authToken = req.header("Authorization");
  if(!authToken){
    return res.status(401).send("Access denied. No token provided.");
  }

  const vetId = req.user.userId;

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

/**
 * @desc add a customer to the vet's customers list
 * @route /vetcustomers/:customerId
 * @method POST
 * @access private
 */
module.exports.addcustomertoVetCtrl = asyncHandler(async(req, res) =>{
  const authToken = req.header("Authorization");
  if(!authToken){
    return res.status(401).send("Access denied. No token provided.");
  }
  const customerId = req.params.customerId;
  const vetId = req.user.userId;

  try{
    const vet = await User.findById(vetId);
    if (!vet) {
      return res.status(404).json({ message: "Vet not found" });
    }
    vet.vetInfo.vetClientWaitApproval.push(customerId);
    await vet.save();
    res.status(200).json({message:"customer added to vet's customers list"});

  }catch (error){
    console.error("Error fetching user",error);
    return res.status(500).json({message:"Error fetching user"});
  }
})



