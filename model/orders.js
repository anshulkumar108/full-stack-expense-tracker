const {Sequelize,DataTypes, DATEONLY}=require('sequelize');
const { sequelize } = require('../database/squelize');

const Order=sequelize.define('order',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        allownull: false,
        primaryKey: true
    },
    paymentId:DataTypes.STRING,
    orderId:DataTypes.STRING,
    status:DataTypes.STRING

})

module.exports={Order}