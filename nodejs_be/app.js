const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const axios = require('axios')
const fs = require('fs');
const fsPromises = require('fs/promises');
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

            let vivado_log_file = watchDir + "/" + dir + "/vivado.log"
            let note_file = watchDir + "/" + dir + "/note.txt"

            let file_list = [vivado_log_file, note_file]

            let event = {
                'vivado_base': []
                , 'vivado_error': []
                , 'vivado_timing': []
                , 'coyote_base': []
                , 'note_desc': []
            }

            for (const f of file_list){

                if (fs.existsSync(f)) {
                    const logStrm = fs.createReadStream(f, {flags: 'r', encoding: 'utf-8', autoClose: true});
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
                }
            }
            const status = fs.statSync(vivado_log_file)
            events.push({dir, event, status })


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

function readFile(file_path) {
    if (fs.existsSync(file_path)) {
        return fs.readFileSync(file_path, 'utf8')
    }
    return ''
}


app.put('/note', function requestHandler(req, res) {
    
    let note_action = req.body['action']
    let build_dir = req.body['build_dir']
    let note_file = watchDir + "/" + build_dir + '/' + "note.txt"

    switch (note_action) {
        case 'rd':
            //async read file stream
            let rd_msg = readFile(note_file)
            //resp
            res.json({msg: rd_msg});
            break;
        case 'wr':
            //async write file stream
            let wr_msg = req.body['msg']
            fs.writeFile(note_file, wr_msg, {flag: 'w+'}, err => {
            });
            res.json({msg: "Done"});
            break;
        default:
            console.log(JSON.stringify(req.body) + "is not a proper note action")
            res.json({msg: "Inproper request action"});
    }
});


module.exports = app;
