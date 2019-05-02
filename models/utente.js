const Sequelize = require('sequelize');
const db = require('../config/database');

const Utente = db.define('utente',{
    id:{
        type: Sequelize.STRING,
        primaryKey: true
    },
    Nome:{
        type: Sequelize.STRING
    },
    Cognome:{
        type: Sequelize.STRING
    },
    DataNascita:{
        type: Sequelize.STRING
    },
    Professione:{
        type: Sequelize.STRING
    },
    Email:{
        type: Sequelize.STRING
    },
    Password:{
        type: Sequelize.STRING
    }
},
    {freezeTableName: true
})




module.exports =  Utente;