const { Sequelize, DataTypes } = require('sequelize');

const { sequelize } = require('../database/squelize')

const User = sequelize.define('userdetails', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allownull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allownull: false,

    },
    email: {
        type: DataTypes.STRING,
        allownull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allownull: false,
    },
    isPremimum:DataTypes.BOOLEAN,

})

module.exports={User};