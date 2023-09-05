const {Sequelize,DataTypes }=require('sequelize');

const {sequelize}=require('../database/squelize');
const fileUrls=sequelize.define('fileurl',{

    fileurl:{
        type: DataTypes.STRING,
        allownull:false,
    },
    userdetailId:{
        type: DataTypes.INTEGER,
        allownull:false,
       
    },
})

module.exports={fileUrls};