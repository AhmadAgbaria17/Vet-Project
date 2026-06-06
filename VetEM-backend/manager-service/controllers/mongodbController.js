const axios = require("axios");
const asyncHandler = require("express-async-handler");

const ACCESSOR_URL = process.env.ACCESSOR_MONGODB_URL || "http://localhost:5001";

const sendAccessorError = (res, error) => {
  const status = error.response?.status || 500;
  const message = error.response?.data?.message || "Backend service error";
  return res.status(status).json({ message });
};

/**
 * @desc send to mongodb accessor service to sign up user
 * @route mongodb/auth/signup
 * @method Post
 * @access public
 */
module.exports.mongoSignUpUserCtrl = asyncHandler(async (req, res) => {
  const { firstName, lastName, email,phone, password, userType } = req.body;

  try {
    const response = await axios.post(`${ACCESSOR_URL}/auth/signup`, {
      firstName,
      lastName,
      email,
      phone,
      password,
      userType,
    });
    console.log(response.data.message);
    res.status(200).json({
      message: response.data.message,
    });
  } catch (error) {
    sendAccessorError(res, error);
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
    const response = await axios.post(`${ACCESSOR_URL}/auth/login`, {
      email,
      password,
    });
    res.status(200).json({
      token: response.data.token,
      message: response.data.message,
    });
  } catch (error) {
    sendAccessorError(res, error);
  }
});




/**
 * @desc send to mongodb accessor service get user by id
 * @route mongodb/user/:userId
 * @method get
 * @access private
 */
module.exports.mongoGetUserCtrl = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const authToken = req.header("Authorization");
  try {
    const response = await axios.get(`${ACCESSOR_URL}/user/${userId}`, {
      headers: {
        Authorization: authToken,
      },
    });
    res.status(200).json({
      message: response.data.message,
      user: response.data.user,
    });
  } catch (error) {
    sendAccessorError(res, error);
  }
});




/**
 * @desc send to mongodb accessor service to get all customers 
 * @route mongodb/user/customers
 * @method get
 * @access public
 */
module.exports.mongoGetAllCustomersCtrl = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(`${ACCESSOR_URL}/user/customers`, {
      headers: {
        Authorization: req.header("Authorization"),
      },
      params: req.query,
    });
    res.status(200).json({
      message: response.data.message,
      customers: response.data.customers,
    });
  } catch (error) {
    sendAccessorError(res, error);
  }
});




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
      `${ACCESSOR_URL}/clinic`,
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
    sendAccessorError(res, error);
  }
});




/**
 * @desc get all the clinics of the user
 * @route mongodb/clinic
 * @method Get
 * @access private
 */
module.exports.mongoGetAllUserClinicsCtrl = asyncHandler(async (req, res) => {
  try {
    const respone = await axios.get(`${ACCESSOR_URL}/clinic`,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
        params: req.query,
      }
    );


    res.status(200).json({
      message: respone.data.message,
      UserClinics: respone.data.UserClinics,
      clinics: respone.data.clinics,
    });
  } catch (error) {
    sendAccessorError(res, error);
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
      `${ACCESSOR_URL}/clinic/${clinicId}`,
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
    sendAccessorError(res, error);
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
      `${ACCESSOR_URL}/clinic/${clinicId}`,
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
    sendAccessorError(res, error);
  }
});




/**
 * @desc get all the customers of the vet clinic
 * @route mongodb/user/vetcustomers
 * @method Get
 * @access private
 */
module.exports.mongoGetVetCustomersCtrl = asyncHandler(async (req, res) => {
  const authToken = req.header("Authorization");
  try {
    const respone = await axios.get(
      `${ACCESSOR_URL}/user/vet/customers`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    res.status(200).json({
      message: respone.data.message,
      customers: respone.data.customers,
    });
  } catch (error) {
    sendAccessorError(res, error);
  }
}); 





/**
 * @desc add a customer to the vet list of customers
 * @route mongodb/vetcustomers/:customerId
 * @method Post
 * @access private
 */
module.exports.mongoaddcustomertoVetCtrl = asyncHandler(async (req, res) => {
  const customerId = req.params.customerId;
  const authToken = req.header("Authorization");
  try {
    const respone = await axios.post(
      `${ACCESSOR_URL}/user/vet/customers/${customerId}`,
      {},
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
    sendAccessorError(res, error);
  }
});





/**
 * @desc access a vet customer
 * @route mongodb/vetcustomers/:customerId
 * @method Put
 * @access private
 */
module.exports.mongoAcceptVetCustomerCtrl = asyncHandler(async (req, res) => {
  const customerId = req.params.customerId;
  const authToken = req.header("Authorization");
  try {
    const respone = await axios.put(
      `${ACCESSOR_URL}/user/vet/customers/${customerId}`,
      {},
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
    sendAccessorError(res, error);
  }
});





/**
 * @desc delete a vet customer
 * @route mongodb/vetcustomers/:customerId
 * @method Delete
 * @access private
 */
module.exports.mongoDeleteVetCustomerCtrl = asyncHandler(async (req, res) => {
  const customerId = req.params.customerId;
  const authToken = req.header("Authorization");
  try {
    const respone = await axios.delete(
      `${ACCESSOR_URL}/user/vet/customers/${customerId}`,
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
    sendAccessorError(res, error);
  }
});


/**
 * @desc add a pet to the vet clinic
 * @route mongodb/pets
 * @method Post
 * @access private
 */
module.exports.mongoAddPetCtrl = asyncHandler(async (req, res) => {
  const { name, species, breed, age, birthDate, gender, image, notes } = req.body;
  const authToken = req.header("Authorization");
  try {
    const response = await axios.post(
      `${ACCESSOR_URL}/pets`,
      {
        name,
        species,
        breed,
        age,
        birthDate,
        gender,
        image,
        notes,
      },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    res.status(200).json({
      message: response.data.message,
      pet: response.data.pet,
    });
  } catch (error) {
    sendAccessorError(res, error);
  }
}
);

module.exports.mongoGetPetsCtrl = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(`${ACCESSOR_URL}/pets`, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(200).json({
      message: response.data.message,
      pets: response.data.pets,
    });
  } catch (error) {
    sendAccessorError(res, error);
  }
});

module.exports.mongoUpdatePetCtrl = asyncHandler(async (req, res) => {
  try {
    const response = await axios.put(`${ACCESSOR_URL}/pets/${req.params.petId}`, req.body, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(200).json({
      message: response.data.message,
      pet: response.data.pet,
    });
  } catch (error) {
    sendAccessorError(res, error);
  }
});

module.exports.mongoDeletePetCtrl = asyncHandler(async (req, res) => {
  try {
    const response = await axios.delete(`${ACCESSOR_URL}/pets/${req.params.petId}`, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(200).json({
      message: response.data.message,
    });
  } catch (error) {
    sendAccessorError(res, error);
  }
});


/**
 * @desc send to mongodb to Update the medical records (add a new one)
 * @route mongofb/pets/:petId/medical-records
 * @method Put 
 * @access private
 */
module.exports.mongoAddPetMedicalRecCtrl = asyncHandler(async (req,res)=>{
  const petId = req.params.petId;
  const authToken = req.header("Authorization");
  const medicalRecord = req.body;
  
  try {
    const respone = await axios.put(
      `${ACCESSOR_URL}/pets/${petId}/medical-records`,
      
      {medicalRecord}
      ,
      {
        headers:{
          Authorization: authToken
        }
      }
    )
    res.status(200).json({
      message: respone.data.message,
      updatedPet: respone.data.updatedPet,
    })
    
  } catch (error) {
    sendAccessorError(res, error);
  }
})




/**
 * @desc get all the questions of a user
 * @route mongodb/questions
 * @method Get
 * @access private
 */
module.exports.mongoGetAllQuestionsByUserCtrl = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(`${ACCESSOR_URL}/questions`, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(200).json({
      message: response.data.message,
      questions: response.data.questions,
    });
  } catch (error) {
    sendAccessorError(res, error);
  }
}
);

/**
 * @desc update a question answer by the vet
 * @route mongodb/questions/answer/:questionId
 * @method Put
 * @access private
 */ 
module.exports.mongoUpdtaerQuestionAnswerCtrl = asyncHandler(async (req, res) => {
  const questionId = req.params.questionId;
  const { answer } = req.body;
  const authToken = req.header("Authorization");
  try {
    const response = await axios.put(
      `${ACCESSOR_URL}/questions/answer/${questionId}`,
      { answer },
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    res.status(200).json({
      message: response.data.message,
      question: response.data.question,
    });
  }
  catch (error) {
    sendAccessorError(res, error);
  }
});



/**
 * @desc create a new question
 * @route mongodb/questions
 * @method Post
 * @access private
 */
module.exports.mongoCreateQuestionCtrl = asyncHandler(async (req, res) => {
  const { questionText, vetId, petName, petId } = req.body;
  try {
    const response = await axios.post(`${ACCESSOR_URL}/questions`, {
      questionText,
      vetId,
      petName,
      petId,
    }, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(201).json({
      message: response.data.message,
      question: response.data.question,
    });
  } catch (error) {
    sendAccessorError(res, error);
  }
});

/**
 * @desc update a question by the customer
 * @route mongodb/questions/:questionId
 * @method Put
 * @access private
 */
module.exports.mongoUpdateQuestionCtrl = asyncHandler(async (req, res) => {
  const questionId = req.params.questionId;
  const { questionText, petName, petId } = req.body;
  try {
    const response = await axios.put(`${ACCESSOR_URL}/questions/${questionId}`, {
      questionText,
      petName,
      petId,
    }, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(200).json({
      message: response.data.message,
      question: response.data.question,
    });
  } catch (error) {
    sendAccessorError(res, error);
  }
});

/**
 * @desc delete a question
 * @route mongodb/questions/:questionId
 * @method Delete
 * @access private
 */
module.exports.mongoDeleteQuestionCtrl = asyncHandler(async (req, res) => {
  const questionId = req.params.questionId;
  try {
    const response = await axios.delete(`${ACCESSOR_URL}/questions/${questionId}`, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(200).json({
      message: response.data.message,
    });
  } catch (error) {
    sendAccessorError(res, error);
  }
});

