const {Sequelize,DataTypes }=require('sequelize');
const {sequelize}=require('../database/squelize') ;

const ExpenseTotalSum=sequelize.define('expensetotal',{
    total_Expense:DataTypes.INTEGER,

})

module.exports=ExpenseTotalSum;