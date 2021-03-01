//require('dotenv').config();
const sql = require("mssql/tedious")
const fetch = require("node-fetch")

const config = {
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
  console.log("Waiting for istio proxy")

  await waitForIstioProxy()
  console.log("Istio proxy should be ready")

  return new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
      console.log("Connected to MSSQL")
      return pool
    })
    .catch((err) => console.log("Database Connection Failed! Bad Config: ", err))
}

async function waitForIstioProxy() {
  const errors = []
  for (let i = 0; i < 30; i++) {
    console.log("Waiting " + i)

    try {
      const result = await fetch("http://127.0.0.1:15000/ready")
      if (result.ok) {
        console.log("Got ok from istio proxy")

        return
      }
    } catch (error) {
      errors.push(error)
    }

    await sleep(1000)
  }

  throw new Error(errors)
}

function sleep(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration))
}

module.exports = {
  sql,
  poolPromise,
}
