const {Sequelize,DataTypes }=require('sequelize');

const {sequelize}=require('../database/squelize')

const Expense=sequelize.define('expense',{

    id:{
        type:DataTypes.INTEGER,
        allownull:false,
        autoIncrement:true,
        primaryKey:true
    },
    amount:{
        type:DataTypes.INTEGER,
        allownull:false,
    },
    description:{
        type: DataTypes.STRING,
        allownull:false,
    },
   category:{
        type: DataTypes.STRING,
        allownull:false,
       
    },
})

module.exports={Expense};