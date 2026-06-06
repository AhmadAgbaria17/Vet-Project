const express = require('express');
const bodyParser = require('body-parser');
const connectToDB = require('./config/connectToDB');
const cors = require('cors');
require("dotenv").config();




const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

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

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal server error" });
});


const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
