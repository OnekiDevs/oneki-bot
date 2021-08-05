let colors = ["red", "blue", "yellow", "green"];
let currentColor = colors[Math.round(Math.random() * (1 - 4) + 4) - 1];
let currentFlow = "right";
let currentTurn;
let canPlay;
let playerCards;

function main(client, interact, partida, buttons) {
    let starterPlayer = partida.jugadores[0];
    playerCards = partida[interact.user.id].cartas
    // console.table(partida[interact.user.id].cartas);
    console.log(currentColor);

    currentColor = currentColor.slice(0);

    currentTurn = starterPlayer;

    console.log(currentColor);
    let play = `2${currentColor}`.slice(1);
    if (play === currentColor) canPlay = true;
    console.assert(canPlay, "You can't play that card!")
    console.table(buttons);
    // if (currentTurn != starterPlayer) { 
    //     buttons[1].setDisabled(false);
    // }
}

function get() {
    return { currentTurn, currentFlow, currentColor, canPlay, playerCards }
}

function play(card, client, interact) {
    let cardColor;
    let cardNumber;
    let isWildcard = false;

    cardColor = colors.find(color => color.match(card.slice(1)));
    console.log(cardColor);
    console.log(/\d/.test(card));
    if (/\d/.test(card) === false) isWildcard = true;
    if (isWildcard == true) {
        cardNumber = null;
    } else {
        cardNumber = card.match(/\d/)[0];
    }
    console.table({cardColor, cardNumber, isWildcard});
}

// Function Exports

exports.play = play;
exports.get = get;
exports.main = main;