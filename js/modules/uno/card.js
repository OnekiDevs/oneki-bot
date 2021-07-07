const { play } = require('./gameloop.js')
function main(client, interact) {
    // uno_card_2b
    // console.table(interact.customID.slice(9));
    // console.table(interact.message.components[0].components)
    play(interact.customID.slice(9), client, interact);
}

exports.main = main;