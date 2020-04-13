const express =require('express');
const router =express.Router();
const { checkNotAuthenticated } =require('../../middleware/checkAuthenticated');

router.get('/', checkNotAuthenticated, (req,res) =>{
    // console.log("req.app:", req.app.get('vars'))
    const{title, name, email, description, profile} =req.app.get('vars');
    if(!email &&!profile){
        return res.redirect('/');
    }   
    res.render('profile',{
        title,
        name,
        email,
        description
    });
 });

 module.exports = router;