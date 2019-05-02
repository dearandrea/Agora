const Sequelize = require('sequelize');
const db = require('../config/database');

const Skill=db.define('skill',{
        id:{
            type: Sequelize.STRING,
            primaryKey: true
        },
        Nome:{
            type: Sequelize.STRING
        },
        Categoria:{
            type: Sequelize.STRING
        },
        idUTENTE:{
            type: Sequelize.STRING
        }
    },
    {freezableTableName: true
})


module.exports= Skill;