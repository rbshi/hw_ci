// basic dissector of vivado.log

const type = 'vivado_error';

const regex = /ERROR: (.+)/;
const map = {1: 'error'};

module.exports = {
    type: type
    , regex: regex
    , map: map
};