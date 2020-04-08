const express =require('express');
const router =express.Router();

router.get('/', async(req,res) =>{
    const sessionDestroy =await new Promise((resolve, reject) =>{
      req.session.destroy((err) =>{
        console.log('Session destroy fired');
        if(err){
          return console.error(err);
        }
        resolve(true);
      })
    });

    if(sessionDestroy){
      console.log('After session destroy')
      res.render('logout',{
      });
    }
 });

 module.exports = router;