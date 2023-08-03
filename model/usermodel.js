const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  ispremimumuser: {
    type: Boolean,
    default: false,
  },
  totalExpence: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
