const { Collection } = require('discord.js')
const c = new Collection().set()
module.exports = class Players extends Array {
    constructor(...args) {
        super(...args)
        console.log('this', this);
    }

    /**
     * Agrega un nuevo jugador
     * @param {player: Player => void}
     */
    add(player) {
        this.push(player);
    }
    get(id){
        return this.find(p=>p.id==id);
    }
    has(id){
        return !!this.find(p=>p.id==id)
    }
    toString() {
        return this.map(p => `${p}`).join(', ');
    }
    get size(){
        return this.length
    }
    first() {
        return this[0]
    }

    rotate(direction) {
        if(direction) this.push(this.shift())
        else this.unshift(this.pop())
    }
}