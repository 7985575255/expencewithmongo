const razorpay = require('razorpay');
const Order = require('../model/purchasemodel');
const User = require('../model/usermodel');
const userController = require('./userControler');

exports.purchasepremium = async (req, res) => {
  try {
    var rzp = new razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    const amount = 2500;

    let order = await rzp.orders.create({ amount, currency: "INR" });
    if (!order) {
      throw new Error('Failed to create order');
    }

    let premiumOrder = await Order.create({ orderid: order.id, status: "PENDING", user: req.user._id });

    res.status(201).json({ order, key_id: rzp.key_id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to process purchase' });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const id = req.user._id;
    const { payment_id, order_id } = req.body;

    const order = await Order.findOne({ orderid: order_id });
    if (!order) {
      throw new Error('Invalid order ID');
    }

    const promise1 = Order.updateOne({ _id: order._id }, { paymentid: payment_id, status: "SUCCESSFUL" });
    const promise2 = User.updateOne({ _id: id }, { ispremimumuser: true });

    Promise.all([promise1, promise2]).then(() => {
      const token = userController.generateAccessToken(id, undefined, true);
      return res.status(201).json({ success: true, message: "Transaction Successful", token });
    }).catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Failed to update transaction status' });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "Something went wrong" });
  }
};
