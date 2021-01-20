const knex = require("knex")({
    client: "mysql2",
    connection: {
        host : "localhost",     
        user : "root", 
        password : "root",
        database : "documentValidator" 
     }
});

module.exports = knex

// const knex = require("knex")({
//     client: "mysql2",
//     connection: {
//         host : "database-docval.csdotcesxtmd.us-east-1.rds.amazonaws.com",     
//         user : "admin", 
//         password : "y6ubAcfwe4ovBh8936eB",
//         database : "docval" 
//      }
// });

// module.exports = knex