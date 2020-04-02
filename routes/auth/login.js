const express =require('express');
const router =express.Router();
const { passport } =require('../../middleware/passport');

//login GET and POST routes:
router.get('/', (req,res) =>{
    console.log('Inside login GET route CB function');
    console.log(req.sessionID);
    // const uniqueId = uuidv4();

    res.render('login',{
        title:`Welcome Back`,
        name:'Игорь'
    })
});
router.post('/', (req,res,next) =>{
    console.log('Inside login POST route CB function'); 
     passport.authenticate('local', (err, user, info) =>{
      console.log('INFO:',info)            
        if (err) { 
          console.log('Error triggered ',err)
          return next(err); }
        if (!user) {
          req.app.set('g_lobal',{
            title:'Error',
            name:'',
            email:'',
            descr:`${info.message}`
          });
           return res.redirect('/error'); 
          }
        req.logIn(user, (err) => {
          console.log('Inside req.login() callback')
          console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
          console.log(`req.user: ${JSON.stringify(req.user)}`)
          console.log('You were authenticated & logged in!\n');
          console.log('req.sesion:',req.session.views)

          if (err) { return next(err); }
          if(user.active==0){
              req.app.set('g_lobal',{
              title:'Welcome',
              name:user.first_name,
              email:user.email,
              descr:'Account is unverified, pls confirm your email by clicking on the email link sent to you .'
            });
          }else{
            req.app.set('g_lobal',{
            title:`Welcome back`,
            name:user.first_name,
            email:user.email,
            descr:'Glad to see you back!'
            });
          }
          return res.redirect('/profile');
        })
      })(req, res, next)
});

module.exports = router;