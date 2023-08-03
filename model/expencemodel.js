const mongoose = require('mongoose');
const { Schema } = mongoose;

const expenceSchema = new Schema({
  product: {
    type: String,
    unique: true,
  },
  price: {
    type: Number,
  },
  option: {
    type: String,
  },
  user: { // Reference to the User model
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Expence = mongoose.model('Expence', expenceSchema);
module.exports = Expence;
