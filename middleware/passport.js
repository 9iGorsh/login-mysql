const passport =require('passport');
const LocalStrategy =require('passport-local').Strategy;
const { pool } =require('../db');
const bcrypt =require('bcrypt');

// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
    { usernameField: 'email' },
    (email, password, done) =>{
      console.log('Inside local strategy callback')
      pool.getConnection((err, connection) =>{
        if(err){
          console.error(err);
          return done(err);
        }
        connection.query(`SELECT * FROM users WHERE email='${email}'`,
        async (err, result) =>{
          console.log('Query sent!')
          connection.release();
          if(err){
            console.error(err);
            return done(err);
          }
          // console.log('user:', result); //result is array
          const user =result[0];
          if (!user) {
            console.log('No user triggered!')
            return done(null, false, { message: 'Invalid credentials.\n' });
          }
          const isMatch =await bcrypt.compare(password, (user.password)); //async!!!!
          if (!isMatch) {
            console.log('Password is wrong!')
            return done(null, false, { message: 'Invalid credentials.\n' });
          }else{
            return done(null, user);
          }         
        }); 
    });      
    }
  ));

  // tell passport how to serialize the user
  passport.serializeUser((user, done) => {
    console.log('Inside serializeUser callback. User id is save to the session file store here')
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done) => {
    console.log('Inside deserializeUser callback')
    console.log(`The user id passport saved in the session file store is: ${id}`);
      pool.query(`SELECT * FROM users WHERE id=${id}`, (err, result) =>{
        const user =result[0];
        // console.log('user:', user)
        if(err){
          console.error(err);
          return done(err);
        }
        if (user) {
          return done(null, user);
        }
      });
  });

  module.exports={
      passport
  };