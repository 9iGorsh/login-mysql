const checkAuthenticated =(req,res,next) =>{
    console.log('req.isAuthenticated ? ',req.isAuthenticated());
    if(req.isAuthenticated()) {
        return next(); //proceed
    }
    res.redirect('/');
};

const checkNotAuthenticated =(req,res,next) =>{
    if(req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    return next(); 
};

module.exports ={
    checkAuthenticated,
    checkNotAuthenticated
}