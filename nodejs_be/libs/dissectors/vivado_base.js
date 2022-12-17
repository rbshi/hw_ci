// basic dissector of vivado.log

var type = 'vivado_base';

var regex_elab_s = /Starting RTL Elaboration (.+)/
var regex_elab_e = /Finished RTL Elaboration (.+)/
var regex_topt_s = /Start Timing Optimization (.+)/
var regex_topt_e = /Finished Timing Optimization (.+)/
var regex_map_s = /Start Technology Mapping (.+)/
var regex_map_e = /Finished Technology Mapping (.+)/

var regex = /Finished (.+?) : Time \(s\): cpu = (.+?) ; (.+)/;
var map = {1: 'process', 2: 'time', 3: 'tail'};

module.exports = {
    type: type
    , regex: regex
    , map: map
};