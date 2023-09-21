const {Sequelize,DataTypes }=require('sequelize');

const {sequelize}=require('../database/squelize');
const fileUrls=sequelize.define('fileurl',{

    fileurl:{
        type:DataTypes.STRING(1000),
        allownull:false,
    },
    userdetailId:{
        type: DataTypes.INTEGER,
        allownull:false,
       
    },
})

module.exports={fileUrls};