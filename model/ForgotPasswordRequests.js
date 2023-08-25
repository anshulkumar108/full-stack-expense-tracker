const {Sequelize,DataTypes }=require('sequelize');

const {sequelize}=require('../database/squelize')

const Forgotpassword=sequelize.define('forgotpassword',{
id:{
    type:DataTypes.UUID,
    allownull:false,
    primaryKey:true,
},
isactive:{
    type:DataTypes.BOOLEAN
},
expiresby: DataTypes.DATE,
})

module.exports = Forgotpassword;