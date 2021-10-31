module.exports = class Queue extends Array {

    constructor(...args) {
        super(...args)
    }

    toString() {
        return `\`\`\`\n${this.map((e, i) => `${i+1}.- ${e.title}`).join('\n')}\n\`\`\``
    }

    first() {
        return this[0]
    }

    /**
     * Almacena el item
     * @param QueueItem
     */
    add(QueueItem) {
        if(QueueItem.constructor.name == 'QueueItem') this.push(QueueItem)
        else throw new Error('Requiere a QueueItem')
    }

    delete(position) {
        this.splice(position, 1)
    }

    get size() {
        return this.length
    }

}