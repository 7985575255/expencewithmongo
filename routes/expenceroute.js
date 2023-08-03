const express=require('express');
const controler=require('../controler/expenceControler');
const router=express.Router();
const userAuth=require('../util/auth');


router.get('/get-data',userAuth.authenticate, controler.getData);
router.post('/add-data',userAuth.authenticate, controler.addData);
router.delete('/delete/:Id',userAuth.authenticate, controler.deleteData);

module.exports=router;