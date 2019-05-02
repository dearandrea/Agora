const Sequelize = require('sequelize');
const db = require('../config/database');

const Job = db.define('jobs',{
    id:{
        type: Sequelize.STRING,
        primaryKey: true
    },
    Titolo:{
        type: Sequelize.STRING
    },
    Luogo:{
        type: Sequelize.STRING
    },
    Informazioni:{
        type: Sequelize.STRING
    },
    Creatore:{
        type: Sequelize.STRING
    }
},
    {freezeTableName: true
})

module.exports=Job;