const express =require('express');
const router =express.Router();
const bcrypt =require('bcrypt');
const passport =require('passport');
const LocalStrategy =require('passport-local').Strategy;

router.get('/', (req, res) => {
    console.log('Inside GET /authrequired callback')
    console.log(`User authenticated? ${req.isAuthenticated()}`)
    if(req.isAuthenticated()) {
      res.send('you hit the authentication endpoint\n')
    } else {
      res.redirect('/')
    }
  })

  module.exports = router;