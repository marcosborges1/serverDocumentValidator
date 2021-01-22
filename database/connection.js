require("dotenv-safe").config();

const knex = require("knex")({
    client: "mysql2",
    connection: {
        host : process.env.host_db,     
        user : process.env.user_db, 
        password : process.env.pass_db,
        database : process.env.db 
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