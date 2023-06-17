const mysql =require("mysql2")

const sequelize=require("sequelize");

const sequelize=new ('expense','root','anshulme96@',{ dialect:'mysql',host:'localhost'});

const checkConnection=async ()=>{
    try{
      await sequelize.authentication();
      console.log("connected to db...");
    }catch(error){
    console.log("unable to connect",error);
    }
};

//checkConnection();

module.exports ={sequelize}; 