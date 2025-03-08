const axios = require("axios");
const asyncHandler = require("express-async-handler");





/**
 * @desc send to mongodb accessor service to sign up user
 * @route mongodb/auth/signup
 * @method Post
 * @access public
 */
module.exports.mongoSignUpUserCtrl = asyncHandler(async (req,res)=>{

  const { firstName, lastName, email, password, userType } = req.body;
  
  try{
    const response = await axios.post('http://localhost:5001/auth/signup', {
      firstName,
      lastName,
      email,
      password,
      role: userType,
    });
    console.log(response.data.message);
    res.status(200).json({
      message: response.data.message,
    });
  } catch (error) {
    res.status(500).json({
      message: error.response.data.message,
    });
  }
})


/**
 * @desc send to mongodb accessor service to Login user
 * @route mongodb/auth/Login
 * @method Post
 * @access public
 */
module.exports.mongoLoginUserCtrl = asyncHandler(async (req,res)=>{
  
  const { email, password } = req.body;
  
  try{
    const response = await axios.post('http://localhost:5001/auth/login', {
      email,
      password,
    });
    res.status(200).json({
      token: response.data.token ,message: response.data.message,
    });
  } catch (error) {
    res.status(500).json({
      message: error.response.data.message,
    });
  }
});


module.exports.mongoGetUserCtrl = asyncHandler(async (req,res)=>{
  
})




/**
 * @desc send to mongodb accessor service to add clinic
 * @route mongodb/clinic/add
 * @method Post
 * @access public
 */
module.exports.mongoAddClinicCtrl = asyncHandler(async (req,res)=>{
  const {name, openTime, location, userId} = req.body;
  try {
    const respone = await axios.post('http://localhost:5001/clinic/add',{
      name,
      openTime,
      location,
      userId
    })
    res.status(200).json({
      message: respone.data.message
      })
    
  } catch (error) {
    res.status(500).json({
      message: error.response.data.message
      })
  }
})