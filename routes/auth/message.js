const express =require('express');
const router =express.Router();

router.get('/', (req,res) =>{
    const{title, description, message} =req.app.get('vars');
    // console.log('req.app:', req.app)
    if(!message){
        return res.redirect('/');
    }   
    console.log('Title, descr:',title, description)
    res.render('message',{
        title,
        description
    });
    req.app.set('vars',{
        title:'',
        name:'',
        email:'',
        description:'',
        message:false
    });
 });

 module.exports = router;