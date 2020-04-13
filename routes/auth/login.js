const express =require('express');
const router =express.Router();
const { checkNotAuthenticated } =require('../../middleware/checkAuthenticated');
const passport =require('passport');

//login GET and POST routes:
router.get('/', checkNotAuthenticated, (req,res) =>{
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

router.post('/', checkNotAuthenticated, passport.authenticate('local', {
    // console.log('Inside login POST route CB function'); 
    successRedirect:'/dashboard',
    failureRedirect:'/message'
}));

module.exports = router;