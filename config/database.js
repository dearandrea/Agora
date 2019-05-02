const Sequelize = require('sequelize');


module.exports = new Sequelize('mydb', 'andrea', 'andrea123', {
  host: 'andrea.cxaiyh8cbt1j.us-west-2.rds.amazonaws.com',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: false
},
});