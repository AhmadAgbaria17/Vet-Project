const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {User} = require("../models/User");
const nodeMailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken")


// NodeMailer Transporter setup
const transport = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.APP_EMAIL_ADDRESS,
    pass: process.env.APP_EMAIL_PASSWORD,
  },
});





/**
 * @desc signUp user
 * @route /auth/signup
 * @method Post
 * @access public
 */
module.exports.signUpUserCtrl = asyncHandler(async (req,res)=>{
  try {
    const {firstName,lastName,email,phone,password, userType} = req.body;

    //checek if user exists
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message:"User already exists"});
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Generate verification token
    const accountVerificationToken = crypto.randomBytes(32).toString("hex");

    //change email to lower case 
    const emailLower = email.toLowerCase();

    //create user
    const newUser = new User({
      firstName,
      lastName,
      email:emailLower,
      phone,
      password:hashedPassword,
      userType,
      accountVerificationToken,
      isAccountVerified: false,
    });

    if(userType === "vet"){
      newUser.clientInfo = undefined;
    }
    if(userType === "client"){
      newUser.vetInfo = undefined;
    }


    await newUser.save()

    //send verification email
    const verificationLink = `http://localhost:5001/auth/verify-email?token=${accountVerificationToken}`;
    const mailOptions = {
      from: process.env.APP_EMAIL_ADDRESS,
      to: email,
      subject: "Account Verification",
      text: `Click on this link to verify your account: ${verificationLink}`,
    };

    await transport.sendMail(mailOptions);

    res.status(201).json({message: "Signup successful! Please verify your email before logging in."});

  } catch (error) {
    console.log("signup Error: ", error);
    res.status(500).json({message: "Something went wrong"});
  }
})


/**
 * @desc login user
 * @route /auth/login
 * @method Post
 * @access public
 */
module.exports.loginUserCtrl = asyncHandler(async (req, res) => {
  try {
    const {email, password} = req.body;

    //change email to lower case 
    const emailLower = email.toLowerCase();

    //check if user exists
    const user = await User.findOne({email:emailLower});

    if(!user){
      return res.status(400).json({message: "Invalid email or password"});
    }
    
    //check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid){
      return res.status(400).json({message: "Invalid email or password"});
    }
    
    // Check if email is verified
    if (!user.isAccountVerified) {
    return res.status(400).json({ message: "Please verify your email first" });
    }

    //Generate JWT Token
    const token = jwt.sign({userId: user._id, firstName:user.firstName ,userType:user.userType},process.env.JWT_SECRET,{
      expiresIn:"7d",
    })

  
    res.status(200).json({token,message: "Login successful!"});
    } catch (error) {
    console.log("login Error: ", error);
    res.status(500).json({message: "Something went wrong"});
  }
})





/**
 * @desc verify email
 * @route /auth/verify-email
 * @method get
 * @access public
 */
module.exports.verifyEmailCtrl = asyncHandler(async (req,res)=>{
  try {
    const {token} = req.query;

    const user = await User.findOne({accountVerificationToken: token});

    if(!user){
      return res.status(400).json({message: "Invalid or expired token"});
    }

    user.isAccountVerified = true;
    user.accountVerificationToken = undefined;
    await user.save();
    res.status(200).json({message: "Email verified successfully!"});
    
  } catch (error) {
    console.log("verifyEmail Error: ", error);
    res.status(500).json({message: "Something went wrong"});
  }
})