const express = require("express");
const router = express.Router();

const purchaseController=require('../controller/purschase.js')
const download=require('../controller/expenseController.js')
const  {userauthenticate}=require('../middleware/auth.js');

router.get('/purchaseMember', userauthenticate, purchaseController.purchaseMemberShip);
router.post('/updatetransactionstatus',userauthenticate,purchaseController.updatetransactionstatus)
router.route('/update').post(purchaseController.purchaseMemberShip);

router.get('/downloadFile/ExpenseDetails',userauthenticate,download.expensedownload);



module.exports = router;