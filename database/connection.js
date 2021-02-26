require("dotenv-safe").config();
const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql';
const knex = require("knex")({
    client: "mysql2",
    connection: {
        host : process.env.host_db, 
        // socketPath: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
        user : process.env.user_db, 
        password : process.env.pass_db,
        database : process.env.db 
     },
     pool: { 
        min: 0, 
        max: 7
    }
});
module.exports = knex