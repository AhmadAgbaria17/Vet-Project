const express = require('express');
const bodyParser = require('body-parser');
require("dotenv").config();
const cors = require('cors');


const app = express();

app.use(cors());
app.use(bodyParser.json());



app.use('/mongodb', require('./routes/mongodbRoute'));







const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});