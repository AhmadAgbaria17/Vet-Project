const {User} = require('../models/User');
const asyncHandler = require('express-async-handler');

/**
 * @desc get one user from DB by userId
 * @route /user/:userId
 * @method GET
 * @access private
 */
module.exports.getUserCtrl = asyncHandler(async (req, res)=> {
  const userId = req.params.userId;
  try {
    const userType = await User.findById(userId).select("userType");
    let user;
    if(userType.userType === "vet"){
      user = await User.findById(userId).populate("vetInfo.clinics").select("-password -__v -createdAt -updatedAt");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    }else if(userType.userType === "client"){
      user = await User.findById(userId).populate("clientInfo.pets").select("-password -__v -createdAt -updatedAt");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    }
    else if(userType.userType === "admin"){
      user = await User.findById(userId).select("-password -__v -createdAt -updatedAt");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
    }else{
      return res.status(400).json({ message: "User type not found" });
    }
    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  }catch (error) {
    console.error("Error fetching user", error);
    res.status(500).json({ message: "Error fetching user" });
  }

})