const express= require("express");

const router=express.Router();
const bodyParser=require('body-parser');
const controler=require('../controler/userControler');
const auth=require('../util/auth');
const controlerexp=require('../controler/expenceControler')
router.use(bodyParser.urlencoded({extended:true}));
router.use(bodyParser.json());


router.post('/registeruser', controler.registerUser)
router.post('/loginuser',controler.loginUser)
router.get('/downloadexpense',auth.authenticate, controlerexp.downloadExp)
module.exports=router;