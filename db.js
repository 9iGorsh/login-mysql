const mysql =require('mysql');

// const conf ={
//     host:'s52.nska.net',
//     port:'3306',
//     user:'igorsh_boss',
//     password:'TtT2008',
//     database:'igorsh_account',
//     timeout: 60 * 60 * 1000,
//     acquireTimeout  : 60 * 60 * 1000,
//     connectTimeout  : 60 * 60 * 1000
// };
const conf ={
    host:'127.0.0.1',
    port:'3306',
    user:'root',
    password:'11igor#22!',
    database:'acme',
    timeout: 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    connectTimeout  : 60 * 60 * 1000
};

// const connection =mysql.createConnection(conf);

// connection.connect(err =>{
//     if(err){
//         console.error(err);
//         return err;
//     }
//     console.log('DB connection established.')
// })

const pool = mysql.createPool(conf);


module.exports={
    pool
};