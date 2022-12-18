const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const axios = require('axios')
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const Transform = stream.Transform || require('readable-stream').Transform;

const watchDir = process.env.WATCH_DIR
const dissectors = require('./libs/dissectors').dissectors;

const cors = require("cors");


let app = express();

app.use(
    cors({
        origin: "*",
    }),
    express.json()
);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});


app.get('/build_coyote', function (req, res) {

    // process event array map
    let events = []

    async function parse_event(build_dirs) {
        for (const dir of build_dirs) {

            let event = {'vivado_base': [], 'vivado_error': [], 'coyote_base': []}

            let vivado_log_file = watchDir + "/" + dir + "/vivado.log"
            if (fs.existsSync(vivado_log_file)) {
                const logStrm = fs.createReadStream(vivado_log_file, {flags: 'r', encoding: 'utf-8', autoClose: true});
                logStrm.pipe(
                    new Transform({
                        transform(data, encoding, callback) {
                            for (const log_line of data.toString().split("\n")) {
                                dissectors.map(async dissector => {
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

                let end = new Promise(function (resolve, reject) {
                    logStrm.on('end', () => resolve());
                });

                await end
                events.push({dir, event})
            }
        }
    }

    const build_dirs = fs.readdirSync(watchDir)

    let p = new Promise(async (resolve, reject) => {
        await parse_event(build_dirs);
        resolve();
    }).then(
        () => {
            res.send(events)
        }
    )

});


app.put('/note', function requestHandler(req, res) {
    console.log("Get post request")

    let note_action = req.body['action']
    let note_dir = req.body['build_dir']

    switch (note_action) {
        case 'rd':
            //async read file stream
            //resp
            res.json({msg: note_dir + " from read"});
            break;
        case 'wr':
            //async write file stream
            let note_msg = req.body['msg']
            res.json({msg: note_msg + "  to write"});
            break;
        default:
            console.log(JSON.stringify(req.body) + "is not a proper note action")
            res.json({msg: "Inproper request action"});
    }
});


module.exports = app;
