//const { sql, poolPromise } = require("../database/db");
const {poolPromise } = require("../database/db");
const fs = require("fs");
//const mustacheExpress = require("mustache-express");
var rawdata = fs.readFileSync("./query/queries.json");
var queries = JSON.parse(rawdata);
let query = "";
let enkelSide= false;
let viseAllQueryResultat = false;

class MainController {
  async produkter(req, res) {
    try {
      console.log("req.url = " + req.url + "\n");

      switch (req.url) {
        case "/api/produkter/alle":
          enkelSide= false;
          viseAllQueryResultat = true;
          console.log("/api/produkter/alle - valid request");
          query = queries.produkterAlle;

          break;

        case "/api/produkter/alle-aktive":
          enkelSide= false;
          viseAllQueryResultat = true;
          console.log("/api/produkter/alle-aktive - valid request");
          query = queries.produkterAlleAktive;
          break;

        case "/api/produkter/alle-aktive-med-nav-avtale":
          enkelSide= false;
          viseAllQueryResultat= true;
          console.log("/api/produkter/alle-aktive-med-nav-avtale - valid request");
          query = queries.produkterAlleAktiveMedNAVAvtale;

          break;

          case "/api/produkter/alle-aktive-med-nav-avtale-techdata":
          enkelSide= false;
          viseAllQueryResultat = false;
          console.log("/api/produkter/alle-aktive-techdata - valid request");
          query = queries.produkterAlleAktiveNAVAVtaleTechData;

          break;

          case "/api/produkter/test":
          enkelSide= false;
          viseAllQueryResultat = true;
          console.log("/api/produkter/test - valid request");
          query = queries.produktTest;
          break;

          case `/api/produkter/${req.params.id}`:
          let id = "";
          enkelSide= true;
          viseAllQueryResultat = true;
          console.log("/api/produkter/:id - valid request");
          id = req.params.id;
          console.log("id after  =" + JSON.stringify(id));
          query = queries.produktX.replace("hmsartnr", id);
          break;

          default:
          console.log("/api/produkter/...not valid request");
      }
      //pool.close();
      const pool = await poolPromise;
      const result = await pool.request().query(query);
      console.log(query);
      console.log("Enkel side: ", enkelSide);
      console.log("Vise All Query Resultat: ", viseAllQueryResultat);
      if (!enkelSide && viseAllQueryResultat) {
        res.json(result.recordset);        
      }
      else if (!enkelSide && !viseAllQueryResultat) {        
        res.json(result.recordset)       
    }
      else if (enkelSide && viseAllQueryResultat) {
        res.json(result.recordset[0]);
        
     } 
     
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  }

  async produktSider(req, res) {
    let id = req.params.id;
    console.log("/api/produkter/side/:id - valid request");

    try {

      query = queries.produktX.replace("hmsartnr", id);
      const pool = await poolPromise;
      const result = await pool
        .request()
        .query(query);
      console.log(result.recordset[0]);
      const url1 =
        "https://www.hjelpemiddeldatabasen.no/blobs/snet/" +
        `${result.recordset[0].prodid}` +
        ".jpg";
      console.log(url1);
      res.render("produktsider", {
        prodname: result.recordset[0].prodname,
        pshortdesc: result.recordset[0].pshortdesc,
        url2: url1,
        prodid: result.recordset[0].prodid,
        stockid: result.recordset[0].stockid,
        isocode: result.recordset[0].isocode,
        isotitle: result.recordset[0].isotitle,
        adressnamn1: result.recordset[0].adressnamn1,
      });
      //res.json(result.parse)
    } catch (error) {
      res.status(500);
      res.send(error.message);
    }
  }
}

const controller = new MainController();
module.exports = controller;
