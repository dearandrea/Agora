const Sequelize = require('sequelize');
const db = require('../config/database');

const Messaggio = db.define('Messaggio',{
    id:{
        type: Sequelize.STRING,
        primaryKey: true
    },
    Testo:{
        type: Sequelize.STRING
    },
    MITTENTE_id:{
        type: Sequelize.STRING
    },
    Data:{
        type: Sequelize.STRING
    },
    COLLEGAMENTO_id:{
        type: Sequelize.INTEGER
    }
},
    {freezeTableName: true
})
module.exports =  Messaggio;