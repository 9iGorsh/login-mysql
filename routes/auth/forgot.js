const express =require('express');
const router =express.Router();
const { pool } =require('../../db');
const { mail } =require('../../mailer/mail');
const { checkNotAuthenticated } =require('../../middleware/checkAuthenticated');

//login GET and POST routes:
router.get('/', checkNotAuthenticated, (req,res) =>{
    console.log('Inside login GET route CB function');
    console.log(req.sessionID);
    // const uniqueId = uuidv4();

    res.render('forgot',{
        title:'Password reset'
    })
});

router.post('/', checkNotAuthenticated, (req,res) =>{
    console.log('Inside forgot POST route CB function'); 
     
    const{email} =req.body;

    const makeConnection =() =>{
        pool.getConnection(async(err, connection) => {
            if(err){
                console.error("CONNECTION ERROR:",err);
            }
        //Check user exists
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
        }))
        console.log('USER exists ?:',user)
     
        if (!user) {
            console.log('User exists triggered!');///////////////
            req.app.set('vars',{
                title:'Error',
                name:'',
                email:'',
                description:`User ${email} does not exist.`,
                message:true
                });
            return res.redirect('/message');
        }else{
    //Send recover password email
        req.app.set('vars',{
            title:`Success`,
            name:`${user.first_name} ${user.last_name}`,
            email:email,
            description:`Reset password link sent to your email.`,
            profile:true
            });
        const confirmText ='Click link below to reset your password';
        mail(email,confirmText, true);
        return res.redirect('/profile');
        }
    })
    }
makeConnection();
})
module.exports = router;