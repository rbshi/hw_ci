// basic dissector of vivado.log with coyote

var type = 'coyote_base';

var regex = /\*\*\*\* (.+)/;
var map = {1: 'process'};

module.exports = {
    type: type
    , regex: regex
    , map: map
};