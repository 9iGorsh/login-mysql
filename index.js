const express =require('express');
const cors =require('cors');
const path =require('path');
const hbs =require('hbs');
// const { pool, connection } =require('./db');
// const uuidv4 =require('uuid/v4'); //now deprecated
const { v4: uuidv4 } = require('uuid'); //for CommonJS 
const session =require('express-session');
const FileStore =require('session-file-store')(session);
const bodyParser =require('body-parser');
const { passport } =require('./middleware/passport');
// const mysql =require('mysql');

const app =express();
app.use(cors());

//set global vars:
app.set('g_lobal',{g_title:'',g_name:'',g_email:'',g_descr:''});

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
app.use(session({
    genid: (req) => {
      console.log('Inside the session middleware genid f-n')
      console.log(`Request object sessionID from client: ${req.sessionID}`)
      return uuidv4() // use UUIDs for session IDs
    },
    // store: new FileStore(), //defaults to a new MemoryStore instance
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
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
// app.use('/authrequired', require('./routes/auth/authrequired'));
app.use('/profile', require('./routes/auth/profile'));
app.use('/error', require('./routes/auth/error'));
app.use('/logout', require('./routes/auth/logout'));
app.use('/verify', require('./routes/auth/verify'));
app.use('/forgot', require('./routes/auth/forgot'));
app.use('/resetpass', require('./routes/auth/resetpass'));
app.use('/dashboard', require('./routes/auth/dashboard'));
app.use('/passchange', require('./routes/auth/passchange'));

 app.get('/success', (req,res) =>{
    res.render('success',{
        title:'Success!',
        name:'Игорь'
    })
 });

const PORT =process.env.PORT || 4000;
app.listen(PORT, () =>(
    console.log(`Server started on port ${PORT}`)
));