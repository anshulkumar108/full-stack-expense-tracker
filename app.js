const express = require('express');
const app = express();
var cors = require('cors')
app.use(cors())
const fs=require('fs')
require('dotenv').config();
const path=require('path')
const {sequelize} = require('./database/squelize');
const {Expense} = require('./model/expenditure');
const {User} = require('./model/login');
const {Order}=require('./model/orders.js')
const ForgetPassword=require('./model/ForgotPasswordRequests.js')


const expenseRoutes = require('./router/router.js')
const purchaseRoute=require('./router/purchase.js')
const premium=require('./router/premium')
const forgotpassword=require('./router/forgetPassward');
const helmet=require('helmet')
const compression=require('compression');
const morgan=require('morgan')

const bodyParser = require('body-parser');
app.use(bodyParser.json({ extended: false }));

const accesslog_stream=fs.createWriteStream(path.join(__dirname,'access.log'),
{flag:'a'}
);
app.use(helmet())
app.use(compression())
app.use(morgan('combined',{stream:accesslog_stream}))

app.use(express.static('./frontEnd/expense'));
app.use('/', expenseRoutes)
app.use('/api',purchaseRoute)
app.use('/api/premium',premium)
app.use('/api',forgotpassword)

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgetPassword)
ForgetPassword.belongsTo(User);

sequelize.sync().then((result) => {
    app.listen(5000);
}).catch((err) => {
    console.log(err)
})
