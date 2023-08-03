const express=require('express');
const controler=require('../controler/forgetpassControler');
const router=express.Router();
const userAuth=require('../util/auth');


router.post('/forgot-password',controler.getForgetpassword);
router.get('/reset-password/:id',controler.resetPassword);
router.post('/reset-password/:id',controler.updatePassword)

module.exports=router;