const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const routerUser = require('./routes/userroute');
const routerExpence = require('./routes/expenceroute');
const routerPurchase = require('./routes/membershiprout');
const routerLeaderboard = require('./routes/leaderbordrout');
const routerForgetPassword = require('./routes/forgetPasswodroute');
const cors = require('cors');

const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/password', routerForgetPassword);
app.use('/get', routerLeaderboard);
app.use('/purchase', routerPurchase);
app.use('/', routerUser);
app.use('/user/expence', routerExpence);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    // Start the server after successful connection to MongoDB
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
