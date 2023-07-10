const express = require("express");
const router=express.Router();
const expenseController=require('../controller/controller')

router.get('/getusers',expenseController.getUser)
router.post('/postusers',expenseController.addUser)
router.delete('/:id',expenseController.deleteUser)
router.put('/:id',expenseController.updateUser)

module.exports=router;