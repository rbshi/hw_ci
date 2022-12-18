var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var axios = require('axios')
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const Transform = stream.Transform || require('readable-stream').Transform;

const watchDir = process.env.WATCH_DIR
var dissectors = require('./libs/dissectors').dissectors

const cors = require("cors");


var app = express();

app.use(
    cors({
      origin: "*",
    })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});



app.get('/', function (req, res) {
  setCorsHd(res);
  // res.send("helloworld")
  const car = {type:"Fiat", model:{main: "500", sub: "501"}, color:"white"};

  const usersData = [
    { id: 0, name: 'John Doe', registered: '2022/01/01', role: 'Guest', status: 'Pending' },
    { id: 5, name: 'Friderik Dávid', registered: '2022/01/21', role: 'Staff', status: 'Active' },
    { id: 6, name: 'Yiorgos Avraamu', registered: '2022/01/01', role: 'Member', status: 'Active' },
    { id: 8, name: 'Quintin Ed', registered: '2022/02/07', role: 'Admin', status: 'Inactive' },
    { id: 9, name: 'Enéas Kwadwo', registered: '2022/03/19', role: 'Member', status: 'Pending' },
    { id: 10, name: 'Agapetus Tadeáš', registered: '2022/01/21', role: 'Staff', status: 'Active' },
    { id: 11, name: 'Carwyn Fachtna', registered: '2022/01/01', role: 'Member', status: 'Active' },
    { id: 12, name: 'Nehemiah Tatius', registered: '2022/02/07', role: 'Staff', status: 'Banned' },
    { id: 13, name: 'Ebbe Gemariah', registered: '2022/02/07', role: 'Admin', status: 'Inactive' },
    { id: 15, name: 'Leopold Gáspár', registered: '2022/01/21', role: 'Staff', status: 'Active' },
    { id: 16, name: 'Pompeius René', registered: '2022/01/01', role: 'Member', status: 'Active' },
    { id: 17, name: 'Paĉjo Jadon', registered: '2022/02/07', role: 'Staff', status: 'Banned' },
  ]

  res.json(usersData)
  console.log("Get request on /")
})


app.get('/build_coyote', function (req, res) {

  console.log("Get request on /build_coyote")

  // process event array map
  var events = []

  const parseStrm = new Transform({
    transform(data, encoding, callback) {
      for (const log_line of data.toString().split("\n")){
        dissectors.map( async dissector => {
          let parse_str = dissector.dissect(log_line)
          if (parse_str != null) {
            await event[parse_str.type].push(parse_str)
          }
        });
      }
      callback();
    },
    construct(event) {
      this.event = event
    }
  });

  async function parse_event(build_dirs) {
    for (const dir of build_dirs) {

      var event = { 'vivado_base': [], 'vivado_error': [], 'coyote_base': []}

      let vivado_log_file = watchDir + "/" + dir + "/vivado.log"
      if (fs.existsSync(vivado_log_file)) {
        const logStrm = fs.createReadStream(vivado_log_file, {flags: 'r', encoding: 'utf-8', autoClose: true});
        logStrm.pipe(
            new Transform({
              transform(data, encoding, callback) {
                for (const log_line of data.toString().split("\n")){
                  dissectors.map( async dissector => {
                    let parse_str = dissector.dissect(log_line)
                    if (parse_str != null) {
                      await event[parse_str.type].push(parse_str)
                    }
                  });
                }
                callback();
              }
            })
        )

        var end = new Promise(function(resolve, reject) {
          logStrm.on('end', () => resolve());
        });

        await end
        events.push({dir, event})
      }
    }
  }

  const build_dirs = fs.readdirSync(watchDir)

  var p = new Promise(async (resolve, reject) => {
    await parse_event(build_dirs);
    resolve();
  }).then(
      () => {
        console.log(events)
        res.send(events)
      }
  )

});


app.put('/', function requestHandler(req, res) {
  console.log("Get post request")
  res.end('Hello, World!');
});







module.exports = app;
