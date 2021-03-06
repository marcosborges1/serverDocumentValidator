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