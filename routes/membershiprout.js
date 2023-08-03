
const express = require('express');
const controler = require('../controler/membershipControler');
const router = express.Router();
const auth = require('../util/auth');

router.get("/premiumfeatures", auth.authenticate, controler.purchasepremium);
router.post("/updatetransactionstatus", auth.authenticate, controler.updateTransactionStatus);
module.exports = router;
