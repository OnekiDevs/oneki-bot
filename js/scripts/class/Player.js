
module.exports = class Player {

    id = null
    cards = []
    interact = null

    constructor(id) {
        this.id = id;
    }

    addCard(card) {
        this.cards.push(card);
    }

    toString() {
        return `<@${this.id}>`
    }

    get cards() {return this.cards}
    set interact(interact) {this.interact = interact}

}