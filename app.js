// Import necessary modules and packages
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
require('dotenv').config();

// Import database models and routes
const { sequelize } = require('./database/squelize');
const { Expense } = require('./model/expenditure');
const { User } = require('./model/login');
const { Order } = require('./model/orders.js');
const ForgetPassword = require('./model/ForgotPasswordRequests.js');
const expenseRoutes = require('./router/router.js');
const purchaseRoute = require('./router/purchase.js');
const premium = require('./router/premium');
const forgotpassword = require('./router/forgetPassward');

// Create Express app
const app = express();
const Port = process.env.PORT || 5001;



// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: false }));
app.use(express.static(path.join(__dirname,'view')));
app.use(cors());
app.use(compression());


// Routes
app.get('/',(req,res,next)=>{
  res.sendFile(path.join(__dirname,'view/signin.html'))
})

app.use('/user', expenseRoutes);
app.use('/api', purchaseRoute);
app.use('/api/premium', premium);
app.use('/api', forgotpassword);

// Associations
User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgetPassword);
ForgetPassword.belongsTo(User);

// Database synchronization and server start
sequelize.sync().then((result) => {
  app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
  });
}).catch((err) => {
  console.error('Database synchronization error:', err);
});

