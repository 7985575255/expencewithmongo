const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define your MongoDB schema (example: ForgetPassword schema)
const forgetPasswordSchema = new Schema({
  id: {
    type: String, // In Mongoose, we can use String type for UUID values
    default: () => uuidv4(), // Generate UUID values using a UUID library
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

// Create the ForgetPassword model
const ForgetPassword = mongoose.model('ForgetPassword', forgetPasswordSchema);

// Export the model
module.exports = ForgetPassword;

