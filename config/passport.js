const LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
const Utente = require('../models/utente');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


module.exports=function(passport){

    passport.use(
        new LocalStrategy(
            { usernameField: 'email' }, (email, password, done) => {
            console.log("entro")
            Utente.findOne({ where: { Email: email }}).then(user=>{
                    if(!user){
                        return done(null,false,{message: "no email"})}
                    else{
                        let hash = user.Password;
                        bcrypt.compare(password,hash, function(err, res) {
                            if(err) throw err;
                            if(res){
                                return done(null,user);
                            }else{
                                return done(null,false,{message:'Invalid pass'})
                            }
                        });
                    }
                 })
    
                
        }));
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
        
    passport.deserializeUser(function(id, done) {
        Utente.findOne({ where: { id:id}}).then(user=>{
            if(user){done(null, user);}
        });
    });
};