const express = require('express');
const bodyParser = require('body-parser');
const connectToDB = require('./config/connectToDB');
require("dotenv").config();




const app = express();
app.use(bodyParser.json());

// Connect to DB
connectToDB();



// /auth/signup
app.use('/auth', require('./routes/authRoute'));

// /clinic/
app.use('/clinic', require('./routes/clinicRoute'));

// /user/
app.use('/user', require('./routes/userRoute'));

// /pets
app.use('/pets', require('./routes/petRoute'));

// /questions
app.use('/questions', require('./routes/questionRoute'));





const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});