const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid'); 

const forgetPasswordSchema = new Schema({
  id: {
    type: String, 
    default: () => uuidv4(), 
    index: true,
    unique: true,
  },
  UserId: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const ForgetPassword = mongoose.model('ForgetPassword', forgetPasswordSchema);

module.exports = ForgetPassword;
