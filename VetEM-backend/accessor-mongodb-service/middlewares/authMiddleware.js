const jwt = require("jsonwebtoken");


const verifyToken = (req,res,next) =>{
  const authToken = req.header("Authorization");
  if(!authToken){
    return res.status(401).send("Access denied. No token provided.");
  }
  const token = authToken.split(' ')[1]
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({message:"Invalid token"})
  }
}

module.exports =
{
  verifyToken,
  
}