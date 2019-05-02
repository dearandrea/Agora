const Sequelize = require('sequelize');
const db = require('../config/database');

const Applier=db.define('appliers',{
        id:{
            type: Sequelize.STRING,
            primaryKey: true
        },
        idUtente:{
            type: Sequelize.STRING
        },
        idJob:{
            type: Sequelize.STRING
        }
    },
    {freezableTableName: true
})


module.exports= Applier;