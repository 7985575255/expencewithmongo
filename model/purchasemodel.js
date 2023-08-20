const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  paymentid: {
    type: String,
    unique: true,
  },
  orderid: {
    type: String,
    unique: true,
  },
  status: {
    type: String,
  },
  user: { 
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
