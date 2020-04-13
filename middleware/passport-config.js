const LocalStrategy =require('passport-local').Strategy;
const passport =require('passport');
const bcrypt =require('bcrypt');
const { pool } =require('../db');

// const initialize =async(passport, getUserByEmail, getUserById)=>{
const initialize =(app)=>{
    const getUserByEmail =(email)=>{
    // return {id:22, active:1, email:'mail@mail', password:'$2b$10$.Lg0z5cQ0Kq9BaQOtjvDs.yjcswxiqzS1N3NygbU87z68QlWwQgd6'};
        return new Promise((resolve,reject) =>{
            pool.query(`SELECT * FROM users WHERE email='${email}'`,(err, result) =>{
                console.log('Query if user exists sent!') //--------------------
                if(err){
                    console.error(err);
                    return reject(err);
                }
                if (result) {
                    // console.log('USER:', result[0]);
                    return resolve(result[0]);
                }
            });
        })
    };

    const getUserById =(id) =>{
    // return {active:1, id:22, email:'mail@mail', password:'$2b$10$.Lg0z5cQ0Kq9BaQOtjvDs.yjcswxiqzS1N3NygbU87z68QlWwQgd6'}
        return new Promise((resolve,reject) =>{
            pool.query(`SELECT * FROM users WHERE id=${id}`, (err, result) =>{
                if(err){
                    console.error(err);
                    return reject(err);
                }
                if (result) {
                    // console.log('USER:', result[0]);
                    return resolve(result[0]);
                }
            });   
        })
    };

    const authenticateUser =async (email, password, done) =>{
        console.log('Inside local Strategy evaluate user==========');
        const user =await getUserByEmail(email);

        // console.log('USSSSSSSER:', user)
        if(user==null){
            console.log('No user with that email')
            app.set('vars',{
                title:'Error',
                name:'',
                email:'',
                description:'No user with that email',
                message:true
            });
            return done(null, false, {message:'No user with that email'});
        }
        try {
            const isMatch =await bcrypt.compare(password, user.password);
            if(isMatch){
                console.log('User returned')
                return done(null, user);
            }else{
                console.log('Password incorrect')
                app.set('vars',{
                    title:'Error',
                    name:'',
                    email:'',
                    description:'Password incorrect',
                    message:true
                });
                return done(null, false, {message:'Password incorrect'});
            }
        } catch (error) {
            app.set('vars',{
                title:'Error',
                name:'',
                email:'',
                description:'Error on Authentication',
                message:true
            });
            console.log('Error on Authentication')
            return done(error);
        }     
    };
    passport.use(new LocalStrategy(
        { usernameField: 'email' },
        authenticateUser
    ));

    passport.serializeUser((user, done)=>{
        console.log('Serializer fired')
        done(null, user.id);
    });
    passport.deserializeUser(async(id, done)=>{
        console.log('Deserializer fired')
        done(null, await getUserById(id));        
    });
    //the below works w/o promises:
    // passport.deserializeUser((id, done) => {
    //     console.log('Inside deserializeUser callback')
    //     console.log(`The user id passport saved in the session file store is: ${id}`);
    //       pool.query(`SELECT * FROM users WHERE id=${id}`, (err, result) =>{
    //         const user =result[0];
    //         // console.log('user:', user)
    //         if(err){
    //           console.error(err);
    //           return done(err);
    //         }
    //         if (user) {
    //           return done(null, user);
    //         }
    //       });
    //   });
};

module.exports =initialize;