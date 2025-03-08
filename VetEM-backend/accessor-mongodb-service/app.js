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

// /clinic/add
app.use('/clinic', require('./routes/clinicRoute'));





const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});