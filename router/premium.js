const showLeaderBoard=require('../controller/premium.js')
const express = require("express");
const router = express.Router();

const premium=require('../controller/premium');
const  {userauthenticate}=require('../middleware/auth.js');

router.get('/usersLeaderBoard',userauthenticate,premium.showLeaderBoard);

module.exports=router;
