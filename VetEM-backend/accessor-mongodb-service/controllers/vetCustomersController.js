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
    .select("-password -__v -createdAt -updatedAt -clientInfo");


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
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    if (!vet) {
      return res.status(404).json({ message: "Vet not found" });
    }
    customer.clientInfo.clientVetRequests.push(vetId);

    vet.vetInfo.vetClientWaitApproval.push(customerId);
    await vet.save();
    await customer.save();
    res.status(200).json({message:"customer added to vet's customers list"});

  }catch (error){
    console.error("Error fetching user",error);
    return res.status(500).json({message:"Error fetching user"});
  }
})


/**
 * @desc accept a customer request to be added to the vet's customers list
 * @route /vetcustomers/:customerId
 * @method PUT
 * @access private
 */
module.exports.AccepetCustomerReqCtrl = asyncHandler(async(req, res) =>{
  const authToken = req.header("Authorization");
  if(!authToken){
    return res.status(401).send("Access denied. No token provided.");
  }
  const customerId = req.params.customerId;
  const vetId = req.user.userId;

  try{
    const vet = await User.findById(vetId);
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    if (!vet) {
      return res.status(404).json({ message: "Vet not found" });
    }

    // Remove the vet from the customer's wait approval list
    customer.clientInfo.clientVetWaitApproval.pull(vetId);
    // Add the vet to the customer's vets list
    customer.clientInfo.clientVet.push(vetId);
    
    // Remove the customer from wait approval list
    vet.vetInfo.vetClientRequests.pull(customerId);
    
    // Add the customer to the clients list
    vet.vetInfo.vetClients.push(customerId);
    
    await vet.save();
    await customer.save();
    
    res.status(200).json({message:"customer request accepted and added to vet's customers list"});

  }catch (error){
    console.error("Error fetching user",error);
    return res.status(500).json({message:"Error fetching user"});
  }
});

/**
 * @desc delete a customer from the vet's customers list
 * @route /vetcustomers/:customerId
 * @method DELETE
 * @access private
 */
module.exports.DeleteCustomervetCtrl = asyncHandler(async(req, res) =>{
  const authToken = req.header("Authorization");
  if(!authToken){
    return res.status(401).send("Access denied. No token provided.");
  }
  const customerId = req.params.customerId;
  const vetId = req.user.userId;

  try{
    const vet = await User.findById(vetId);
    const customer = await User.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    if (!vet) {
      return res.status(404).json({ message: "Vet not found" });
    }

    // Remove the customer from the vet's clients list
    vet.vetInfo.vetClients.pull(customerId);
    
    // Remove the vet from the customer's vets list
    customer.clientInfo.clientVet.pull(vetId);
    
    await vet.save();
    await customer.save();
    
    res.status(200).json({message:"customer deleted from vet's customers list"});

  }catch (error){
    console.error("Error fetching user",error);
    return res.status(500).json({message:"Error fetching user"});
  }
}
);









