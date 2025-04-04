const axios = require("axios");
const asyncHandler = require("express-async-handler");

/**
 * @desc send to mongodb accessor service to sign up user
 * @route mongodb/auth/signup
 * @method Post
 * @access public
 */
module.exports.mongoSignUpUserCtrl = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, userType } = req.body;

  try {
    const response = await axios.post("http://localhost:5001/auth/signup", {
      firstName,
      lastName,
      email,
      password,
      userType,
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
});

/**
 * @desc send to mongodb accessor service to Login user
 * @route mongodb/auth/Login
 * @method Post
 * @access public
 */
module.exports.mongoLoginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await axios.post("http://localhost:5001/auth/login", {
      email,
      password,
    });
    res.status(200).json({
      token: response.data.token,
      message: response.data.message,
    });
  } catch (error) {
    res.status(500).json({
      message: error.response.data.message,
    });
  }
});

module.exports.mongoGetUserCtrl = asyncHandler(async (req, res) => {});

/**
 * @desc send to mongodb accessor service to add clinic
 * @route mongodb/clinic
 * @method Post
 * @access private
 */
module.exports.mongoAddClinicCtrl = asyncHandler(async (req, res) => {
  const { name, openTime, location, userId } = req.body;
  const authToken = req.header("Authorization");
  try {
    const respone = await axios.post(
      "http://localhost:5001/clinic",
      {
        name,
        openTime,
        location,
        userId,
      },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    res.status(200).json({
      message: respone.data.message,
      clinic: respone.data.clinic,
    });
  } catch (error) {
    res.status(500).json({
      message: error.response.data.message,
    });
  }
});

/**
 * @desc get all the clinics of the user
 * @route mongodb/clinic/:userId
 * @method Get
 * @access private
 */
module.exports.mongoGetAllUserClinicsCtrl = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;

    const respone = await axios.get(`http://localhost:5001/clinic/${userId}`);
    res.status(200).json({
      message: respone.data.message,
      UserClinics: respone.data.UserClinics,
    });
  } catch (error) {
    res.status(500).json({
      message: error.response.data.message,
    });
  }
});



/**
 * @desc update one vet clinic
 * @route mongodb/clinic/item/:clinicId
 * @method Put
 * @access private
 */
module.exports.mongoUpdateOneClinicCtrl = asyncHandler(async (req, res) => {
  const clinicId = req.params.clinicId;
  const { name, openTime, location, userId } = req.body;
  const authToken = req.header("Authorization");
  try {
    const respone = await axios.put(
      `http://localhost:5001/clinic/item/${clinicId}`,
      {
        name,
        openTime,
        location,
        userId,
      },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    res.status(200).json({
      message: respone.data.message,
      clinic: respone.data.clinic,
    });
  } catch (error) {
    res.status(500).json({
      message: error.response.data.message,
    });
  }
});

/**
 * @desc Delete one vet clinic
 * @route mongodb/clinic/item/:clinicId
 * @method Delete
 * @access private
 */
module.exports.mongoDeleteOneClinicCrtl = asyncHandler(async (req, res) => {
  const clinicId = req.params.clinicId;
  const authToken = req.header("Authorization");
  try {
    const respone = await axios.delete(
      `http://localhost:5001/clinic/item/${clinicId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    res.status(200).json({
      message: respone.data.message,
    });
  } catch (error) {
    res.status(500).json({
      message: error.response.data.message,
    });
  }
});
