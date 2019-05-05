var express = require('express');
var app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const expressValidator = require('express-validator');
var flash = require('connect-flash');
var passport = require('passport');
const PORT = process.env.PORT || 7000;
const fs = require('fs');
const https = require('https');
let socketIO = require('./config/socket');

app.use('/' , express.static('./routes'));

const httpsOptions = {
    cert : fs.readFileSync('./ssl/server.crt'),
    key: fs.readFileSync('./ssl/server.key')
}

server = https.createServer(httpsOptions , app).listen(PORT);

//Set static folder
app.use(express.static(path.join(__dirname,'public')));
var cookieParser = require('cookie-parser');
app.use(cookieParser());

//BodyParser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));

//Express Session 
var session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//Passport init
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

//DB
const db = require('./config/database');
db.authenticate()
    .then(() => console.log('DB Connected!'))
    .catch(err => console.log('Error' + err))

//Handlebars
app.engine('handlebars', exphbs({
  defaultLayout:'layout',
  extname: '.handlebars',
  helpers: require('./config/handlebars-helpers')
}));
app.set('view engine', 'handlebars');

//Connect flash
app.use(flash());

// Global variables
app.use((req, res, next)=> {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

app.get('/', (req, res) => res.render('index',{layout:'layout'})); 
app.use('/users', require('./routes/users'));
app.get('/users/chat', (req, res) => res.sendFile('/chat')); 

//Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

//socket
var io = require('socket.io')(server);
socketIO(io);
  


