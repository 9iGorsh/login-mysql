'use strict';
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
const express =require('express');
const cors =require('cors');
const path =require('path');
const hbs =require('hbs');
const { v4: uuidv4 } = require('uuid'); //for CommonJS 
const session =require('express-session');
const FileStore =require('session-file-store')(session);
const bodyParser =require('body-parser');
const initializePassport =require('./middleware/passport-config');
const passport =require('passport');
const nocache = require('nocache');

// const flash =require('express-flash');

const app =express();

initializePassport(app);

app.use(nocache());
app.use(cors());
// app.set('etag', false);

//set global vars:
app.set('vars',{
  title:'',
  name:'',
  email:'',
  description:'',
  active:'',
  message:false,
  profile:false
});
const staticPath =(__dirname, './public');
app.use(express.static(staticPath));

const viewsPath =path.join(__dirname, './templates/views');
const partialsPath =path.join(__dirname, './templates/partials');
hbs.registerPartials(partialsPath);

app.set('view engine', 'hbs');
app.set('views', viewsPath);

// add & configure middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// app.use(flash());
app.use(session({
    genid: (req) => {
      console.log('Inside the session middleware genid f-n')
      console.log(`Request object sessionID from client: ${req.sessionID}`)
      return uuidv4() // use UUIDs for session IDs
    },
    // store: new FileStore(), //defaults to a new MemoryStore instance
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        // secure: true, //for https
        // domain: 'example.com',
        // Cookie will expire in 1 hour from when it's generated 
        expires: new Date( Date.now() + 60 * 60 * 1000 )
      }
  }))
app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/auth/login'));
app.use('/register', require('./routes/auth/register'));
app.use('/profile', require('./routes/auth/profile'));
app.use('/message', require('./routes/auth/message'));
app.use('/verify', require('./routes/auth/verify'));
app.use('/forgot', require('./routes/auth/forgot'));
app.use('/resetpass', require('./routes/auth/resetpass'));
app.use('/dashboard', require('./routes/user/dashboard'));

const PORT =process.env.PORT || 4000;
app.listen(PORT, () =>(
    console.log(`Server started on port ${PORT}`)
));