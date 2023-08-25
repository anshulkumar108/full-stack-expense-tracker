const express = require("express");
const router=express.Router();
const ForgetPassword= require('../controller/forgetpassword.js')

router.post('/password/forgotpassword', ForgetPassword.forgotpassword);


module.exports= router;