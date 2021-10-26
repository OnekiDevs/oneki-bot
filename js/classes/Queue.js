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
        this.push(QueueItem)
    }

    get size() {
        return this.length
    }

}