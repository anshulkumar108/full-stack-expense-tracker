const express = require("express");
const router=express.Router();
const ForgetPassword= require('../controller/forgetpassword.js')

router.post('/password/forgotpassword', ForgetPassword.forgotpassword);
router.get('/password/resetpassword/:id',ForgetPassword.resetpassword);
// router.get('/password/updatepassword/resetpasswordid',ForgetPassword.updatepassword);
router.post('/password/updatepassword/:resetpasswordid', ForgetPassword.updatepassword);

module.exports= router;