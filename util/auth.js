const jwt = require("jsonwebtoken");
const User = require("../model/usermodel");

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization");

  try {
    const user = jwt.verify(token, "secretkey");
    
    const getUser = await User.findOne({ _id: user.userId });
    
    req.user = getUser;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { authenticate };
