// https://github.com/adamvr/node-log-dissector/blob/master/index.js

var d_vivado_base = require('./vivado_base')
var d_vivado_error = require('./vivado_error')
var d_coyote = require('./coyote_base')

var dissectors = [d_vivado_base, d_vivado_error, d_coyote]

function parse(d_module) {
    var regex = d_module.regex
        , map = d_module.map
        , type = d_module.type;

    return function (string) {
        var matches = string.match(regex)
            , ret = {};

        if (!matches) return null;
        for (var k in map) {
            var v = map[k];
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