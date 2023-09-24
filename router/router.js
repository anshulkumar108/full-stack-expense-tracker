const express = require("express");
const router = express.Router();

const userController = require('../controller/User.js')
const expenditureController = require('../controller/expenseController');
const {userauthenticate} = require('../middleware/auth.js');



//user  signin and singup routes
router.post('/signup',userController.Usersignup);
// router.get('/signup',userController.Usersignup);
router.post('/signin',userController.Usersignin)

//expense controller routes
router.post('/users/addExpense',userauthenticate,expenditureController.addExpense)
router.get('/users/fetchExpenseDetails/',userauthenticate, expenditureController.fetchExpense)
router.delete('/users/deleteExpense/:id',userauthenticate,expenditureController.deleteExpense)

router.get('/expense/pagination',userauthenticate, expenditureController.getExpenseOnPage)

module.exports = router;