const Queue = require('./Queue')
module.exports = class HistoryManager extends Queue {

    constructor(...args) {
        super(...args)
    }

    toString() {
        return `\`\`\`\n${this.map((e) => `${e.title}`).join('\n')}\n\`\`\``
    }

}