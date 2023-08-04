const {Sequelize,DataTypes }=require('sequelize');

const {sequelize}=require('../database/squelize')

const login=sequelize.define('Userdetails',{

    name:{
        type:Sequelize.STRING,
        allownull:false,
       
    },
   email:{
        type:Sequelize.STRING,
        allownull:false,
        unique: true,
    },
   password:{
        type: Sequelize.STRING,
        allownull:false,
    },

})

module.exports={login};