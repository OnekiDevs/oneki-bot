const { play, get } = require('./gameloop.js')
function main(client, interact) {
    const info = get();
    const canPlay = play(interact.customID.slice(9), client, interact);
    let card = interact.customID.slice(9)
    let color;
    if (canPlay) {
        let cardLabel;
        if (/b/g.test(card) === true) cardLabel = card.replace("b", " 🟦");
        else if (/r/g.test(card) === true) cardLabel = card.replace("r", " 🟥");
        else if (/g/g.test(card) === true) cardLabel = card.replace("g", " 🟩");
        else if (/y/g.test(card) === true) cardLabel = card.replace("y", " 🟨");
        interact.reply(`Has jugado la carta ${cardLabel}`)
    } else {
        if (info.currentColor === 'blue') color = '🟦'
        else if (info.currentColor === 'red') color = '🟥'
        else if (info.currentColor === 'green') color = '🟩'
        else if (info.currentColor === 'yellow') color = '🟨'
        interact.reply({ content: `No puedes jugar esa carta, solo puedes jugar cartas de color ${color}`, ephemeral: true })
    }
}

exports.main = main;