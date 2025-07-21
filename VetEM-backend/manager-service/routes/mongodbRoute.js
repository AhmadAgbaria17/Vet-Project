const { mongoSignUpUserCtrl, mongoLoginUserCtrl, mongoAddClinicCtrl, mongoGetAllUserClinicsCtrl, mongoGetUserCtrl, mongoUpdateOneClinicCtrl, mongoDeleteOneClinicCrtl,mongoGetVetCustomersCtrl, mongoGetAllCustomersCtrl, mongoaddcustomertoVetCtrl, mongoAcceptVetCustomerCtrl, mongoDeleteVetCustomerCtrl, mongoAddPetCtrl, mongoAddPetMedicalRecCtrl, mongoCreateQuestionCtrl, mongoUpdateQuestionCtrl, mongoDeleteQuestionCtrl, mongoGetAllQuestionsByUserCtrl, mongoUpdtaerQuestionAnswerCtrl } = require('../controllers/mongodbController');

const router = require('express').Router();

// *****Login and Signup routes*****
// /mongodb/auth/signup
router.route('/auth/signup')
.post(mongoSignUpUserCtrl)

// /mongodb/auth/login
router.route('/auth/login')
.post(mongoLoginUserCtrl)



// *****USER routes*****
// /mongodb/user/customers
router.route('/user/customers')
.get(mongoGetAllCustomersCtrl)


// /mongodb/user/:userId
router.route('/user/:userId')
.get(mongoGetUserCtrl)


// /mongodb/user/vetcustomers
router.route('/user/vet/customers')
.get(mongoGetVetCustomersCtrl)

// /mongodb/user/vetcustomers/:customerId
router.route('/user/vet/customers/:customerId')
.post(mongoaddcustomertoVetCtrl)
.put(mongoAcceptVetCustomerCtrl)
.delete(mongoDeleteVetCustomerCtrl)





// *****Clinic routes*****
// /mongodb/clinic
router.route('/clinic')
.post(mongoAddClinicCtrl)

// /mongodb/clinics
router.route('/clinics')
.get(mongoGetAllUserClinicsCtrl)

// /mongodb/clinics/:clinicId
router.route('/clinics/:clinicId')
.put(mongoUpdateOneClinicCtrl)
.delete(mongoDeleteOneClinicCrtl)




// /mongodb/pets
router.route('/pets')
.post(mongoAddPetCtrl);

// /mongodb/pets/:petId/medical-records
router.route('/pets/:petId/medical-records')
.put(mongoAddPetMedicalRecCtrl);



// *****Questions routes*****

// /mongodb/questions
router.route('/questions')
.post(mongoCreateQuestionCtrl)
.get(mongoGetAllQuestionsByUserCtrl);

// /mongodb/questions/:questionId
router.route('/questions/:questionId')
.put(mongoUpdateQuestionCtrl)
.delete(mongoDeleteQuestionCtrl);

// /mongodb/questions/answer/:questionId
router.route('/questions/answer/:questionId')
.put(mongoUpdtaerQuestionAnswerCtrl);



module.exports = router;