const express = require("express");
const router = express.Router();

const userController = require('../controller/User')
const expenditureController = require('../controller/expenseController');
const authenticate = require('../middleware/auth.js');



//user  signin and singup routes
router.post('/users/signup',userController.Usersignup)
router.post('/users/signin',userController.Usersignin)

//expense controller routes
router.post('/users/addExpense',authenticate,expenditureController.addExpense)
router.get('/users/fetchExpenseDetails/',authenticate, expenditureController.fetchExpense)
router.delete('/users/deleteExpense/:id',authenticate,expenditureController.deleteExpense)

module.exports = router;