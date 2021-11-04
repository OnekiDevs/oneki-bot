const { Collection } = require('discord.js')
const Players = require('./Players')
module.exports = class CeroPlayers extends Players {
    constructor(...args) {
        super(...args)
    }

    rotate(direction) {
        if(direction) this.push(this.shift())
        else this.unshift(this.pop())
    }
}