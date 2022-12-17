// basic dissector of vivado.log

var type = 'vivado_error';

var regex = /ERROR: (.+)/;
var map = {1: 'error'};

module.exports = {
    type: type
    , regex: regex
    , map: map
};