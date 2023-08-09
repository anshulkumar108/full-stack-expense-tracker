const express = require("express");
const router=express.Router();
const expenseController=require('../controller/controller')
const userController=require('../controller/User')
const expenditureController=require('../controller/expenseController')

router.get('/getusers',expenseController.getUser)
router.post('/postusers',expenseController.addUser)
router.delete('/:id',expenseController.deleteUser)
router.put('/:id',expenseController.updateUser)

// router.get('/user',expenseController.loginUserDetails)
router.post('/users/signup',userController.Usersignup)
router.post('/users/signin',userController.Usersignin)

router.post('/users/addExpense',expenditureController.addExpense)
router.get('/users/fetchExpenseDetails',expenditureController.fetchExpense)
router.delete('/users/deleteExpense/:id',expenditureController.deleteExpense)

module.exports=router;