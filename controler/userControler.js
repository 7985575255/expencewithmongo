const userModel = require('../model/usermodel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async function (req, res) {
  let { name, email, password } = req.body;
  try {
    const register = await userModel.findOne({ email: email });
    if (register) {
      res.status(500).json({ errormsg: "User already exists with this email Id" });
    } else {
      let saltRounds = 10;
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          await userModel.create({ name, email, password: hash });
        }
      });
      res.status(201).json({ succesMassage: "registeruser succesfully", userModel });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

const generateAccessToken = (id, name, ispremimumuser) => {
  return jwt.sign({ userId: id, name: name, ispremimumuser }, "secretkey");
};

const loginUser = async function (req, res) {
  const { email, password } = req.body;
  try {
    const registeruser = await userModel.findOne({ email: email });
    console.log(registeruser);
    if (!registeruser) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const isMatch = await bcrypt.compare(password, registeruser.password);
    if (isMatch) {
      res.status(200).json({ message: "login successfully", token: generateAccessToken(registeruser._id, registeruser.name, registeruser.ispremimumuser) });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to log in' });
  }
};

module.exports = { loginUser, registerUser, generateAccessToken };
