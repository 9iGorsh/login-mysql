const mysql =require('mysql');

const conf ={
    host:'s52.nska.net',
    port:'3306',
    user:'igorsh_boss',
    password:'TtT2008',
    database:'igorsh_account',
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