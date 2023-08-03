const Expence = require('../model/expencemodel');
const User = require('../model/usermodel');
const mongoose = require('mongoose');
const S3Service = require('../service/s3service');

const downloadExp = async (req, res) => {
  try {
    const getExpen = await Expence.find({ user: req.user._id });
    const userId = req.user._id;

    const stingfideexpence = JSON.stringify(getExpen);
    const fileName = `Expence${userId}/${new Date()}.txt`;
    const fileUrl = await S3Service.uploadToS3(stingfideexpence, fileName);
    res.status(200).json({ fileUrl });
  } catch (err) {
    console.log("Something went wrong and this is a catch block", err);
    res.status(500).json({ fileUrl: "", err: err });
  }
};

const getData = async (req, res) => {
  try {
    const data = await Expence.find({ user: req.user._id });
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

const addData = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { product, price, option } = req.body;
    const data = await Expence.create(
      [{ product: product, price: price, option: option, user: req.user._id }],
      { session: session }
    );
    const totalExpence = Number(req.user.totalExpence) + Number(price);
    await User.updateOne(
      { _id: req.user._id },
      { $set: { totalExpence: totalExpence } },
      { session: session }
    );
    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ newData: data[0] });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    res.status(500).json({ error: 'Failed to add data' });
  }
};


const deleteData = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const price = req.query.price;
    const user_id = req.params.Id;
    if (!user_id) {
      res.status(400).json({ error: 'Id is missing' });
    }
    await Expence.deleteOne({ _id: user_id, user: req.user._id }, { session: session });
    const user = await User.findById(req.user._id).session(session);
    const totalExpence = user.totalExpence - price;
    await User.updateOne(
      { _id: req.user._id },
      { $set: { totalExpence: totalExpence } },
      { session: session }
    );
    await session.commitTransaction();
    session.endSession();
    res.sendStatus(200);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.log(err);
    res.status(500).json({ error: 'Failed to delete data' });
  }
};

module.exports = { getData, downloadExp, deleteData, addData };
