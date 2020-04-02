const express =require('express');
const router =express.Router();

router.get('/', (req,res) =>{
    req.session.destroy((err) =>{
        // cannot access session here
        if(err){console.error(err);}
      });
    res.render('logout',{
        title:'Error!',
        name:'Игорь'
    });
 });

 module.exports = router;