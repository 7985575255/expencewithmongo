const express = require("express");
const controler = require("../controler/leaderbordControler");
const userAuth=require("../util/auth")
const router = express.Router();


router.get("/leaderbordata",userAuth.authenticate, controler.getExpence);

module.exports = router;
