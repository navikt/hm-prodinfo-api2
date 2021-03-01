//const createError = require('http-errors');
const express = require("express")
const prom_client = require("prom-client")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")
const logger = require("morgan")
const mustacheExpress = require("mustache-express")
const router = require("./routes/route")
const viewsPath = "./views"
const partialsPath = viewsPath + "/partials"

console.log("Views Path = " + viewsPath + "\n")
console.log("Partials Path = " + partialsPath + "\n")
console.log(".")

// const fs = require("fs")

const indexRouter = require("./routes/index")

const app = express()

const setupMetrics = () => {
  const collectDefaultMetrics = prom_client.collectDefaultMetrics
  const Registry = prom_client.Registry
  const register = new Registry()

  collectDefaultMetrics({ register })
  return register
}
const prometheus = setupMetrics()

console.log("Starting")

app.get("/metrics", (req, res) => {
  res.set("Content-Type", prometheus.contentType)
  res.end(prometheus.metrics())
})

app.use(cors())

app.use(["/internal/isAlive", "/internal/isReady"], (req, res) => {
  res.send("OK")
})

app.all("*", function (req, res, next) {
  origin = req.get("Origin") || "*"
  res.set("Access-Control-Allow-Origin", origin)
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
  res.set("Access-Control-Expose-Headers", "Content-Length")
  res.set("Access-Control-Allow-Credentials", "true")
  res.set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type") // add the list of headers your site allows.
  if ("OPTIONS" == req.method) return res.send(200)
  next()
})

//Use and congigure Mustache Express engine

app.engine("mst", mustacheExpress(partialsPath, ".mst"))
app.set("view engine", "mst")
app.set("views", viewsPath)
/**
 * Pass the path for your partial directory and
 * the extension of the partials within the mustache-express method
 */

app.use(logger("dev"))

//app.use(router)
app.use("/", indexRouter)

app.use(express.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use("/", express.static(path.join(__dirname, "/public")))

app.use(router)

module.exports = app
