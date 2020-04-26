const express =require('express');
const router =express.Router();
const { pool } =require('../../db');
const bcrypt =require('bcrypt');
const mysql =require('mysql');
const { checkAuthenticated } =require('../../middleware/checkAuthenticated');

router.get('/', checkAuthenticated, (req,res) =>{

    console.log('Inside GET /dashboard callback')
    // console.log('req.session.passport.userId:=======', req.session.passport.user)
    // console.log('req.user' ,req.user)
        const{first_name, email, active} =req.user;
        if(!email){
            return res.redirect('/');
        }
        if(!active){
            req.app.set('vars',{
                title:'Unverified',
                first_name,
                email,
                description:'Account is unverified, pls confirm your email by clicking on the email link sent to you .'
              });
            return res.redirect('/profile')
        }  
        let description =req.app.get('vars').description;

        res.render('dashboard',{
            title:'Dashboard',
            first_name,
            email,
            description
        });
        req.app.set('vars',{
            title:'Dashboard',
            first_name,
            email,
            description:''});
 });

router.post('/', checkAuthenticated, (req,res) =>{
    console.log('Inside reset dashboard POST route CB function'); 
        
    const{password, password2} =req.body;
    const{first_name, email} =req.user;

    console.log('PASSW:', password);
    console.log('PASSW2:', password2)
     
    // const email =req.user;
    console.log('Reset email:', email)
    console.log('Reset password gotten:', password);

    if(password !==password2){
        console.log('PASS!==PASS2')
        req.app.set('vars',{
            first_name,
            email,
            description:'Your passwords do not match.'
        });
        return res.redirect('/dashboard');
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
                    description:`Your password is changed.`,
                    message:true
                });
                // req.logout();
                return res.redirect('/dashboard');
            });       
        })           
    }
    makeConnection();
});

//Logout handle
router.get('/logout', (req, res) =>{
    console.log('Inside logout');
    req.logout();
    res.redirect('/');
})

 module.exports = router;