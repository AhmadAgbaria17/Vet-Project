const axios = require("axios");
const { c } = require("docker/src/languages");
const asyncHandler = require("express-async-handler");

/**
 * @desc send to mongodb accessor service to sign up user
 * @route mongodb/auth/signup
 * @method Post
 * @access public
 */
module.exports.mongoSignUpUserCtrl = asyncHandler(async (req, res) => {
  const { firstName, lastName, email,phone, password, userType } = req.body;

  try {
    const response = await axios.post("http://localhost:5001/auth/signup", {
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
    const response = await axios.get(`http://localhost:5001/user/${userId}`, {
      headers: {
        Authorization: authToken,
      },
    });
    res.status(200).json({
      message: response.data.message,
      user: response.data.user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.response.data.message,
    });
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
    const response = await axios.get(`http://localhost:5001/user/customers`);
    res.status(200).json({
      message: response.data.message,
      customers: response.data.customers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.response.data.message,
    });
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
 * @route mongodb/clinic
 * @method Get
 * @access private
 */
module.exports.mongoGetAllUserClinicsCtrl = asyncHandler(async (req, res) => {
  try {
    const respone = await axios.get(`http://localhost:5001/clinic`,
      {
        headers: {
          Authorization: req.header("Authorization"),
        },
      }
    );


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
      `http://localhost:5001/clinic/${clinicId}`,
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
      `http://localhost:5001/clinic/${clinicId}`,
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
      `http://localhost:5001/user/vet/customers`,
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
    res.status(500).json({
      message: error.response.data.message,
    });
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
      `http://localhost:5001/user/vet/customers/${customerId}`,
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
    res.status(500).json({
      message: error.response.data.message,
    });
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
      `http://localhost:5001/user/vet/customers/${customerId}`,
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
    res.status(500).json({
      message: error.response.data.message,
    });
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
      `http://localhost:5001/user/vet/customers/${customerId}`,
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


/**
 * @desc add a pet to the vet clinic
 * @route mongodb/pets
 * @method Post
 * @access private
 */
module.exports.mongoAddPetCtrl = asyncHandler(async (req, res) => {
  const { name, species, breed, age, medicalHistory, ownerId } = req.body;
  const authToken = req.header("Authorization");
  try {
    const response = await axios.post(
      "http://localhost:5001/pets",
      {
        name,
        species,
        breed,
        age,
        medicalHistory,
        ownerId,
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
    res.status(500).json({
      message: error.response.data.message,
    });
  }
}
);


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
      `http://localhost:5001/pets/${petId}/medical-records`,
      
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
    res.status(500).json({
      message: "Error adding medical record",
    })
  }
})




/**
 * @desc get all the questions of a vet
 * @route mongodb/questions
 * @method Get
 * @access private
 */
module.exports.mongoGetAllQuestionsByUserCtrl = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(`http://localhost:5001/questions`, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(200).json({
      message: response.data.message,
      questions: response.data.questions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.response.data.message,
    });
  }
}
);

/**
 * @desc update a question answer
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
      `http://localhost:5001/question/answer/${questionId}`,
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
    res.status(500).json({
      message: error.response.data.message,
    });
  }
});



/**
 * @desc create a new question
 * @route mongodb/questions
 * @method Post
 * @access private
 */
module.exports.mongoCreateQuestionCtrl = asyncHandler(async (req, res) => {
  const { questionText, vetId , petName } = req.body;
  try {
    const response = await axios.post("http://localhost:5001/questions", {
      questionText,
      vetId,
      petName,
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
    res.status(500).json({
      message: error.response.data.message,
    });
  }
});

/**
 * @desc update a question
 * @route mongodb/questions/:questionId
 * @method Put
 * @access private
 */
module.exports.mongoUpdateQuestionCtrl = asyncHandler(async (req, res) => {
  const questionId = req.params.questionId;
  const { questionText } = req.body;
  try {
    const response = await axios.put(`http://localhost:5001/questions/${questionId}`, {
      questionText,
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
    res.status(500).json({
      message: error.response.data.message,
    });
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
    const response = await axios.delete(`http://localhost:5001/questions/${questionId}`, {
      headers: {
        Authorization: req.header("Authorization"),
      },
    });
    res.status(200).json({
      message: response.data.message,
    });
  } catch (error) {
    res.status(500).json({
      message: error.response.data.message,
    });
  }
});

