const Sequelize = require('sequelize');
const db = require('../config/database');

const Collegamento = db.define('Collegamento',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    Userone:{
        type: Sequelize.STRING
    },
    Usertwo:{
        type: Sequelize.STRING
    }
},
    {freezeTableName: true
})
module.exports =  Collegamento;