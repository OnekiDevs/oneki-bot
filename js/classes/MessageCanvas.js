const Players = require('./Players')
module.exports = class MessageCanvas {

    history = []
    players = new Players()

    constructor(players) {
        this.players = players
    }

}