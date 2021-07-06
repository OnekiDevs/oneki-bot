let colors = ["red", "blue", "yellow", "green"];
let currentColor = colors[Math.round(Math.random() * (1 - 4) + 4) - 1];
let currentFlow = "right";
let currentTurn;
let canPlay;

function main(client, interact, partida, buttons) {
    let starterPlayer = partida.jugadores[0];
    let playerCards = partida[interact.user.id].cartas;
    console.table(partida[interact.user.id].cartas);
    console.log(currentColor);

    switch (currentColor) {
        case "yellow":
            currentColor = "y"
            break;

        case "red":
            currentColor = "r"
            break;

        case "blue":
            currentColor = "b"
            break;

        case "green":
            currentColor = "g"
            break;
        default:
            break;
    }

    currentTurn = starterPlayer;

    console.log(currentColor);
    let play = `2${currentColor}`.slice(1);
    if (play === currentColor) canPlay = true;
    console.assert(canPlay, "You can't play that card!")
    console.table(buttons);
    if (currentTurn = starterPlayer) buttons[1].setDisabled(false);


}

exports.main = main;

function get() {
    return { currentTurn: currentTurn, currentFlow: currentFlow, currentColor: currentColor, canPlay: canPlay }
}

exports.get = get;