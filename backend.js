const express = require('express')
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express()
const port = 3000

//configuring body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//fix cors
app.use(cors());

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'ugmarket.ugent.be',
  port     : 13306,
  user     : 'wwelvaer',
  password : '0000',
  database : 'w3schools'
});

connection.connect();

let getTime = () => new Date().toTimeString().split(' ')[0];

app.post('/', (req, res) => {
  if (!req.body['query'])
    res.status(500).send({error: 'ERROR: couldn\'t find any query to be executed'});
  else {
  connection.query(req.body['query'], function (error, results, fields) {
    if (error) {
      res.status(500).send({error: error['sqlMessage']})
      console.log(getTime(), 'Error while executing query \'' + req.body['query'] + '\': ' + error['sqlMessage'])
    } else {
      res.send({data: results});
      console.log(getTime(), 'Executed query: \'' + req.body['query'] + '\'');
    }
  });
}})

app.listen(port, () => {
  console.log(getTime(), `Backend is running on http://localhost:${port}`)
})
