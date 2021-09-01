const { Collection } = require('discord.js')

module.exports = class Players extends Collection {
    constructor(...args) {
        super(...args)
        console.log(this);
    }

    
    
}