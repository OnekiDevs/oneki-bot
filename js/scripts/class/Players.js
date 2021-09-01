const { Collection } = require('discord.js')
const c = new Collection().set()
module.exports = class Players extends Collection {
    constructor(...args) {
        super(...args)
        console.log('this', this);
    }

    /**
     * Agrega un nuevo jugador
     * @param {(key: *, value: Player) => void}
     */
    add(key, value) {
        this.set(...args)
    }
    toString() {
        return this.map(p => `${p}`).join(', ');
    }

}