const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Connect to MongoDB Atlas
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = {
  connectToMongoDB,
};
