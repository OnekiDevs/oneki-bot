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
    notifications = {}
    voice = null
    guildId = null

    constructor(guildId) {
        super()

        this.guildId = guildId
        this.voice = new GuildVoice(guildId)

        db.collection('config').doc(guildId).get().then(config => {
            if (!config.exists) return
            if(config.data().prefix) this.prefix = config.data().prefix
            if(config.data().lang) this.lang = config.data().lang
            if(config.data().blacklistChannels) this.blacklist.channels = config.data().blacklistChannels
            if(config.data().attachments) this.channels.attachments = config.data().attachments
            if(config.data().channelDeletedMessages) this.channels.messageDeleted = config.data().channelDeletedMessages
            if(config.data().channelEditedMessages) this.channels.messageEdited = config.data().channelEditedMessages
            if(config.data().notifications) this.notifications = config.data().notifications
        })

        db.collection(guildId).doc('suggest').get().then(config => {
            if (config.exists) this.channels.suggest = Object.keys(config.data()).filter(k=>k!='lastId')?.map(k=>config.data()[k])??[]
        })

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

    getPrefix() {
        return [`<@${client.user.id}>`, `<@!${client.user.id}>`, this.prefix]
    }

    get prefix() {
        return [`<@${client.user.id}>`, `<@!${client.user.id}>`, this.prefix]
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