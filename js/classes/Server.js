const GuildVoice = require('./GuildVoice')
const EventEmitter = require('node:events')
module.exports = class Server extends EventEmitter {

    prefix = '>'
    lang = 'en'
    blacklist = {
        channels: []
    }
    channels = {
        suggest: [],
        attachments: null
    }
    voice = null
    guildId = null

    constructor(guildId) {
        super()

        this.guildId = guildId
        this.voice = new GuildVoice(guildId)

        // (async () => {
        //     const snap = await db.collection('config').doc(guildId).get()
        //     if(snap.exists) {
        //         const {prefix, lang, blacklist, channels, voice} = snap.data();
        //         //TODO emitir evento "set"
        //     }
        // })()

        // this.emit('change', {prefix, lang, blacklist, channels, voice})

        this.on('set', ({prefix, lang, blacklist, channels, voice}) => {
            if(prefix) this.prefix = prefix
            if(lang) this.lang = lang
            if(blacklist) {
                const {channels: blChannels} = blacklist
                if(blChannels) this.blacklist.channels = blChannels
            }
            if(channels) {
                const {suggest, attachments} = channels
                console.log(attachments)
                if(attachments) this.channels.attachments = attachments
            }
            if(voice) this.voice = voice
        })
    }

    get prefix() {
        return this.prefix
    }

    set prefix(prefix) {
        this.prefix = prefix
    }

    get lang() {
        return this.lang
    }

    set lang(lang) {
        this.lang = lang
    }

    get blacklist() {
        return this.blacklist
    }

    set blacklist(blacklist) {
        this.blacklist = blacklist
    }

    get channels() {
        return this.channels
    }

    set channels(channels) {
        this.channels = channels
    }

    get voice() {
        return this.voice
    }

    set voice(voice) {
        this.voice = voice
    }

    get guild() {
        return client.guilds.cache.get(this.guildId)
    }

}