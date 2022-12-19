// basic dissector of vivado.log with coyote

const type = 'coyote_base';

const regex = /\*\*\*\* (.+)/;
const map = {1: 'process'};

module.exports = {
    type: type
    , regex: regex
    , map: map
};