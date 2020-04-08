const express =require('express');
const router =express.Router();

router.get('/', (req,res) =>{

    console.log('Inside GET /dashboard callback')
    console.log('req.isAuthenticated ? ',req.isAuthenticated());
    // console.log('req.session.passport.userId:=======', req.session.passport.user)
    console.log('req.user' ,req.user)
    if(req.isAuthenticated()) {
        // console.log("req.app:", req.app.get('g_lobal'))
        // const{title, name, email, descr} =req.app.get('g_lobal');
        const{name, email, descr, active} =req.user;
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
        res.render('dashboard',{
            title:'Dashboard',
            name,
            email,
            descr
        });
    } else {
      res.redirect('/')
    }
 });

 module.exports = router;