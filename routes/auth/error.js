const express =require('express');
const router =express.Router();

router.get('/', (req,res) =>{
    const{title, name, email, descr} =req.app.get('g_lobal');
    res.render('error',{
        title,
        descr
    });
 });

 module.exports = router;