const Sequelize = require('sequelize');
const db = require('../config/database');

const Userdata = db.define('userdata',{
    id:{
        type: Sequelize.STRING,
        primaryKey: true
    },
    Azienda:{
        type: Sequelize.STRING
    },
    UTENTE_id:{
        type: Sequelize.STRING
    },
    Facolta:{
        type: Sequelize.STRING
    },
    Lavoro:{
        type: Sequelize.STRING
    },
    Descrizione: {
        type: Sequelize.STRING
    }
},
    {freezeTableName: true
})

module.exports=Userdata;