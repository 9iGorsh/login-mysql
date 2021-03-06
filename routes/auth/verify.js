const express =require('express');
const router =express.Router();
const { pool } =require('../../db');
const jwt =require('jsonwebtoken');
const EMAIL_SECRET ='catSecret';

router.get('/:token', async(req,res) =>{
  // const{email}=req.query; //changed to token -> req.params:
  console.log('PARAMS:', req.params.token)
  const{ email, resetpass } =jwt.verify(req.params.token, EMAIL_SECRET);
  console.log('EMAIL:', email);
  console.log('RESETPASS:', resetpass)
  console.log('Inside verify.js')
    pool.getConnection((err, connection) =>{
        if(err){
          return console.error(err);
        }
        console.log('email:========', email)
        connection.query(`UPDATE users SET active=1 WHERE email='${email}'`,

          async (err, result) =>{
          console.log('Query sent!')///////////
          connection.release();
          if(err){           
            return console.error(err);
          }  
          console.log('User is active now')   ///////////     
        }); 
   
        if(resetpass){
          req.app.set('vars',{
            title:`Reset your password!`,
            // name:`${first_name} ${last_name}`,
            email:email,
            description:''
            });
          res.redirect('/resetpass');
        }else{
          req.app.set('vars',{
            title:`Success!`,
            // name:`${first_name} ${last_name}`,
            email:email,
            description:`You are verified now`,
            profile:true
            });
            res.redirect('/profile');
        }
    })
 });

 module.exports = router;