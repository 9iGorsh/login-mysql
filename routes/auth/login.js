const express =require('express');
const router =express.Router();
const { passport } =require('../../middleware/passport');

//login GET and POST routes:
router.get('/', (req,res) =>{
    console.log('Inside login GET route CB function');
    console.log(req.sessionID);
    // const uniqueId = uuidv4();
      if(!req.user && !req.isAuthenticated()){
        return res.render('login',{
          title:`Welcome Back`,
          name:'Игорь'
        })
      }
      return res.redirect('/dashboard');  
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
        req.login(user, (err) => {
          console.log('Inside req.login() callback')
          console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`)
          console.log(`req.user: ${JSON.stringify(req.user)}`)
          console.log('You were authenticated & logged in!\n');
          console.log('req.session.views:',req.session.views)
          console.log('req.isAuthenticated ? ',req.isAuthenticated());

          if (err) { return next(err); }
          if (user) {
            req.user = user;
            delete req.user.password; // delete the password from the session
            // req.session.user = user;  //refresh the session value
            res.locals.user = user;
            req.session.isAuthenticated =req.isAuthenticated();
          }
          // console.log('UUUSSSSEEEERRR', req.session.user)
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
          console.log('REQ.Passport ? ',req.session.passport);
          return res.redirect('/dashboard');
        })
      })(req, res, next)    
});

module.exports = router;