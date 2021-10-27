const QueueItem = require('./QueueItem')
const EventEmitter = require('node:events')
const HistoryManager = require('./HistoryManager')
const FieldValue = require('firebase-admin').firestore.FieldValue;
module.exports = class History extends EventEmitter {

    cache = new HistoryManager()
    last = 1
    guildId = null

    constructor(guildId) {
        super()

        this.guildId = guildId

        db.collection(guildId).doc('voice').get().then(doc => {
            if(doc.exists && doc.data().last) this.last = doc.data().last
        })

        this.on('historyCreated', QueueItem => {
            this.cache.add(QueueItem)
            db.collection(QueueItem.guildId).doc('voice').update({
                musicHistory: FieldValue.arrayUnion({
                    link: QueueItem.link
                })
            }).catch(err => {
                if (err.details.startsWith("No document to update")) db.collection(QueueItem.guildId).doc("deleted").set({
                    musicHistory: [{
                        link: QueueItem.link
                    }]
                });
            })
        })
    }

    add(QueueItem) {
        if(QueueItem.constructor.name != 'QueueItem') throw new Error('Requiere a QueueItem')
        QueueItem.reproducedTimestamp = Date.now()
        this.emit('historyCreated', QueueItem)
    }

    getHistory() {
        return this.cache.map(e=>({link:e.link}));
    }

}