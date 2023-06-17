const express=require('express');
const app=express();
var cors=require('cors')
app.use(cors())

const bodyParser = require('body-parser');
app.use(bodyParser.json({extended:true}));

const {sequelize}=require('./database/sequelize');
const {Expense}=require('./model/expModel');

sequelize.sync().then((result)=>{

    app.listen(4000);
    
    }).catch((err)=>{
        console.log(err)
    })
    