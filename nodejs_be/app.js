var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var axios = require('axios')

var app = express();

function setCorsHd(res, isJSON = true) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  res.setHeader('Access-Control-Allow-Credentials', true); // If needed
  if(isJSON) res.setHeader('Content-Type', 'application/json');
}

app.get('/', function (req, res) {
  setCorsHd(res);
  // res.send("helloworld")
  const car = {type:"Fiat", model:{main: "500", sub: "501"}, color:"white"};
  res.json(car)
  console.log("Get request on /")
})

var server = app.listen(3001, function () {
  var host = "localhost"
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})

module.exports = app;
