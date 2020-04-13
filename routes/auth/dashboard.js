const express =require('express');
const router =express.Router();
const { checkAuthenticated } =require('../../middleware/checkAuthenticated');

router.get('/', checkAuthenticated, (req,res) =>{

    console.log('Inside GET /dashboard callback')
    // console.log('req.session.passport.userId:=======', req.session.passport.user)
    // console.log('req.user' ,req.user)
        const{first_name, email, description, active} =req.user;
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
        res.render('dashboard',{
            title:'Dashboard',
            first_name,
            email,
            description
        });
 });

router.post('/', (req, res) =>{
    req.logout();
    res.redirect('/');
})

 module.exports = router;