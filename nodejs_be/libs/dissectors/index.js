// https://github.com/adamvr/node-log-dissector/blob/master/index.js

const d_vivado_base = require('./vivado_base')
const d_vivado_error = require('./vivado_error')
const d_vivado_timing = require('./vivado_timing')
const d_coyote = require('./coyote_base')
const d_note_desc = require('./note_desc')

const dissectors = [d_vivado_base, d_vivado_error, d_vivado_timing, d_coyote, d_note_desc]

function parse(d_module) {
    const regex = d_module.regex
        , map = d_module.map
        , type = d_module.type;

    return function (string) {
        const matches = string.match(regex)
            , ret = {};

        if (!matches) return null;
        for (let k in map) {
            const v = map[k];
            ret[v] = matches[k];
        }

        ret.type = type;
        return ret;
    }
}

for (const d_module of dissectors) {
    if (!d_module || !d_module.regex || !d_module.map || !d_module.type) continue;
    d_module.dissect = parse(d_module)
}

exports.dissectors = dissectors;