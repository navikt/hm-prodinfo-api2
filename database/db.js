//require('dotenv').config();
var sql = require("mssql/tedious")
const fetch = require("node-fetch")

var config = {
  server: process.env.DB_HOSTNAME,
  authentication: {
    type: "ntlm",
    options: {
      userName: process.env.DB_ADMIN_USERNAME,
      password: process.env.DB_ADMIN_PASSWORD,
      domain: process.env.DB_USER_DOMAIN,
    },
  },
  options: {
    encrypt: true,
    database: process.env.DB_DATABASENAME,
    enableArithAbort: true,
    requestTimeout: 1000, //default is 15000ms, you can set it to 0 for no timeout
  },
}

const poolPromise = connectDB()

async function connectDB() {
  return new sql.ConnectionPool(config)
      .connect()
      .then((pool) => {
        console.log("Connected to MSSQL")
        return pool
      })
      .catch((err) => console.log("Database Connection Failed! Bad Config: ", err))
}

module.exports = {
  sql,
  poolPromise,
}
