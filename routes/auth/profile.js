const express =require('express');
const router =express.Router();

router.get('/', (req,res) =>{
    console.log("req.app:", req.app.get('g_lobal'))
    const{title, name, email, descr} =req.app.get('g_lobal');
    if(!email){
        return res.redirect('/');
    }   
    res.render('profile',{
        title,
        name,
        email,
        descr
    });
 });

 module.exports = router;