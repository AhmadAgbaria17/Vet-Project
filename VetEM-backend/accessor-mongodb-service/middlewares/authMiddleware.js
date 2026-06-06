const jwt = require("jsonwebtoken");


const verifyToken = (req,res,next) =>{
  const authToken = req.header("Authorization") || "";
  if(!authToken.startsWith("Bearer ")){
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  const token = authToken.split(" ")[1];
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({message:"Invalid token"})
  }
}

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.userType)) {
    return res.status(403).json({ message: "You are not allowed to perform this action" });
  }
  next();
};

module.exports =
{
  verifyToken,
  authorizeRoles,
}
