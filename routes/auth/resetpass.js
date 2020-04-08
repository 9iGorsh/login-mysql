const express =require('express');
const router =express.Router();
const { pool } =require('../../db');
const bcrypt =require('bcrypt');
const { mail } =require('../../mailer/mail');
const mysql =require('mysql');

router.get('/', (req,res) =>{
    const{email} =req.app.get('g_lobal');
    res.render('resetPass',{
        title:'Reset your password',
        email
    })
 });

router.post('/', (req,res) =>{
    console.log('Inside reset POST route CB function'); 
        
    const{email, password} =req.body;
    console.log('Reset email:', email)
    console.log('Reset password gotten:', password);

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
                req.app.set('g_lobal',{
                    title:``,
                    // name:`${first_name} ${last_name}`,
                    email:email,
                    descr:`Your password is set.
                    You can log in now.`
                });
                return res.json({page:'profile'});
            });       
        })           
    }
    makeConnection();
});

 module.exports =router;