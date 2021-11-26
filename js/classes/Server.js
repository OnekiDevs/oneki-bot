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
        attachments: null,
        messageDeleted: null,
        messageEdited: null
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

    }

    setAttachmentsChannel(channel){
        this.channels.attachments = channel
    }

    setMessageDeleted(channel){
        this.channels.messageDeleted = channel
    }

    setMessageEdited(channel){
        this.channels.messageEdited = channel
    }

    addBlacklistChannel(channel){
        this.blacklist.channels.push(channel)
    }

    addSuggestChannel(channel){
        this.channels.suggest.push(channel)
    }

    removeSuggestChannel(channel){
        if(this.channels.suggest.includes(channel)) this.channels.suggest.splice(this.channels.suggest.indexOf(channel), 1)
    }

    removeBlacklistChannel(channel){
        if(this.blacklist.channels.includes(channel)) this.blacklist.channels.splice(this.blacklist.channels.indexOf(channel), 1)
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

    // get channels() {
    //     return this.channels
    // }
    //
    // set channels(channels) {
    //     this.channels = channels
    // }

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