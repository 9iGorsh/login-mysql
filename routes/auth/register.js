const express =require('express');
const router =express.Router();
const { pool } =require('../../db');
const bcrypt =require('bcrypt');
const { mail } =require('../../mailer/mail');

router.get('/', (req,res) =>{
    if(!req.user && !req.isAuthenticated()){
        return res.render('register',{
          title:`Sign Up for Free`,
          name:'Игорь'
        })
      }
    return res.redirect('/dashboard'); 
 });

 router.post('/', (req,res) =>{
    console.log('Inside register POST route CB function'); 
     
    const{first_name, last_name, email, password} =req.body;

    const makeConnection =() =>{
        pool.getConnection(async(err, connection) => {
            if(err){
                console.error("CONNECTION ERROR:",err);
            }
        
    //Check no such user already
        const user =await (new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM users WHERE email='${email}'`,
            (err, result) =>{

            console.log('Check user query sent!')////////////////           
            if(err){
                console.error(err);
                return reject(err);             
            }
            // console.log("user =result[0]:", user =result[0])
            return resolve(result[0]);
            });
        })
        )
        console.log('USER exists ?:',user)
     
        if (user) {
            console.log('User exists triggered!');///////////////
            req.app.set('g_lobal',{
                title:'Error',
                name:'',
                email:'',
                descr:`User ${email} already exists.`
                });
            return res.json({page:'error'});
        }else{
        //save new user to db
            const salt =await bcrypt.genSalt(10);
            const passwordHash =await bcrypt.hash(password, salt);
            const post  = {first_name, last_name, email, password:passwordHash};
            connection.query('INSERT INTO users SET ?', post,
            (err, result) =>{
                console.log('Insert user query sent!')//////////////////////
                connection.release();
                if(err){
                    return console.error(err);
                }
                req.app.set('g_lobal',{
                    title:``,
                    name:`${first_name} ${last_name}`,
                    email:email,
                    descr:`Confirmation link sent to your email.
                    Account not verified yet!`
                    });
                const confirmText ='Click link below to cofirm your email';
                    mail(email, confirmText);
                return res.json({page:'profile'});
            });      
        } 
    })           
    }
    makeConnection();
});
 
 module.exports = router;