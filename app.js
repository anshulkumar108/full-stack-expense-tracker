const express = require('express');
const app = express();
var cors = require('cors')
app.use(cors())

const {sequelize} = require('./database/squelize');
const {Expense} = require('./model/expenditure');
const {User} = require('./model/login');
const {Order}=require('./model/orders.js')


const expenseRoutes = require('./router/router.js')
const purchaseRoute=require('./router/purchase.js')
const premium=require('./router/premium')
const forgotpassword=require('./router/forgetPassward');

const bodyParser = require('body-parser');
app.use(bodyParser.json({ extended: false }));

app.use(express.static('./frontEnd/expense'));
app.use('/', expenseRoutes)
app.use('/api',purchaseRoute)
app.use('/api/premium',premium)
app.use('/api',forgotpassword)

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)


sequelize.sync().then((result) => {
    app.listen(5000);
}).catch((err) => {
    console.log(err)
})
