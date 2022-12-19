// basic dissector of vivado.log

const type = 'vivado_base';

const regex_elab_s = /Starting RTL Elaboration (.+)/
const regex_elab_e = /Finished RTL Elaboration (.+)/
const regex_topt_s = /Start Timing Optimization (.+)/
const regex_topt_e = /Finished Timing Optimization (.+)/
const regex_map_s = /Start Technology Mapping (.+)/
const regex_map_e = /Finished Technology Mapping (.+)/

const regex = /Finished (.+?) : Time \(s\): cpu = (.+?) ; (.+)/;
const map = {1: 'process', 2: 'time', 3: 'tail'};

module.exports = {
    type: type
    , regex: regex
    , map: map
};