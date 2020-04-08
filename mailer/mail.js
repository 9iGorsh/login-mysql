"use strict";
const nodemailer = require("nodemailer");
const jwt =require('jsonwebtoken');

const EMAIL_SECRET ='catSecret';

// async..await is not allowed in global scope, must use a wrapper
const mail =async (email, confirmText, resetpass=false) =>{
  const emailToken =jwt.sign(
    {
    email:email,
    resetpass
    }, 
    EMAIL_SECRET,
    { 
      expiresIn: '1d' 
    });
  console.log('TOKEN===========',emailToken);
    try{
// create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'mail.ru',
    auth: {
           user: 'mail-19-mail@mail.ru',
           pass: 'start/90/**'
       },
       tls: {
        rejectUnauthorized: false
    }
  });
  
  // var url = encodeURIComponent(`https://localhost:4000/verify?${email}`);
  const url = `http://localhost:4000/verify/${emailToken}`;
  
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: "mail-19-mail@mail.ru", // sender address should be u s e r
    to: `${email}`, // list of receivers
    subject: "Confirm your email", // Subject line
    html: `<p>${confirmText}: \n.
    <a href="${url}">${url}</a></p> `// html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    }catch(err){
        console.error(err);
    }
}

// main().catch(console.error);
module.exports={
    mail
}