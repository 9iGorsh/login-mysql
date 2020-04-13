const express =require('express');
const router =express.Router();
const { pool } =require('../../db');
const bcrypt =require('bcrypt');
const { mail } =require('../../mailer/mail');
const mysql =require('mysql');

router.get('/', (req,res) =>{
    let email ='';
    let description =req.app.get('vars').description;
    if(description !=='Your passwords do not match.'){
        description ='';
    }
    if(req.isAuthenticated()){
        email =req.user.email
    }else{
        email =req.app.get('vars').email;
    } 
    if(!email){
        return res.redirect('/');
    }
    console.log('EMAIL, DESCR',email,description)
    res.render('resetPass',{
        title:'Reset your password',
        description,
        email
    })
 });

router.post('/', (req,res) =>{
    console.log('Inside reset POST route CB function'); 
        
    const{email, password, password2} =req.body;
    console.log('Reset email:', email)
    console.log('Reset password gotten:', password);

    if(password !==password2){
        req.app.set('vars',{
            email,
            description:'Your passwords do not match.'
        });
        return res.redirect('/resetpass');
    }

    const makeConnection =() =>{
        pool.getConnection(async(err, connection) => {
            if(err){
                console.error("CONNECTION ERROR:",err);
            }

            const salt =await bcrypt.genSalt(10);
            const passwordHash =await bcrypt.hash(password, salt);

            let sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
            const inserts = ['users', 'password', passwordHash, 'email', email];
            sql = mysql.format(sql, inserts);
            console.log('sql====', sql)

            // const post  = [{password:passwordHash}, {email:email}];
            connection.query(sql, (err, result) =>{
                console.log('Update user query sent!====')
                connection.release();
                if(err){
                    return console.error(err);
                }
                req.app.set('vars',{
                    title:``,
                    // name:`${first_name} ${last_name}`,
                    email:email,
                    description:`Your password is set.
                    You can log in now.`,
                    message:true
                });
                req.logout();
                return res.redirect('/message');
            });       
        })           
    }
    makeConnection();
});

 module.exports =router;