const { Sequelize, DataTypes } = require('sequelize');

const { sequelize } = require('../database/squelize')

const User = sequelize.define('Userdetails', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allownull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allownull: false,

    },
    email: {
        type: Sequelize.STRING,
        allownull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allownull: false,
    },

})

module.exports={User};