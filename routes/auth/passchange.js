const express =require('express');
const router =express.Router();

router.get('/', (req,res) =>{

    console.log('Inside GET /passchange callback')
    // console.log('req.isAuthenticated ? ',req.isAuthenticated());
    // console.log('req.user' ,req.user)
    if(req.isAuthenticated()) {
        // console.log("req.app:", req.app.get('g_lobal'))
        // const{title, name, email, descr} =req.app.get('g_lobal');
        const{title, name, email, descr, active} =req.user;
        if(!email){
            return res.redirect('/');
        }
        if(!active){
            req.app.set('g_lobal',{
                title:'Welcome',
                name,
                email,
                descr:'Account is unverified, pls confirm your email by clicking on the email link sent to you .'
              });
            res.redirect('/profile')
        }       
        res.render('passchange',{
            title,
            name,
            email,
            descr
        });
    } else {
      res.redirect('/')
    }
 });

 module.exports = router;