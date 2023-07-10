const express=require('express');
const app=express();
var cors=require('cors')
app.use(cors())

const {sequelize}=require('./database/squelize');
const {Expense}=require('./model/expModel');
const expenseRoutes=require('./router/router')
const bodyParser = require('body-parser');
app.use(bodyParser.json({extended:false}));

app.use(express.static('./frontEnd/expense'));


app.use('/',expenseRoutes)
sequelize.sync().then((result)=>{
    app.listen(5000);
    
    }).catch((err)=>{
        console.log(err)
    })
    