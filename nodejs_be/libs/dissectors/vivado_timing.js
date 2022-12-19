// basic dissector of vivado.log

const type = 'vivado_timing';

const regex = /Current Timing Summary \| WNS=(.+?) \|(.+)/;
const map = {1: 'wns'};

module.exports = {
    type: type
    , regex: regex
    , map: map
};