// basic dissector of note.txt

const type = 'note_desc';

const regex = /Design: (.+)/;
const map = {1: 'design_desc'};

module.exports = {
    type: type
    , regex: regex
    , map: map
};