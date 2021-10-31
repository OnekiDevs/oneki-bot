'use strict';
const EventEmitter = require('node:events');
const {createAudioPlayer, createAudioResource} = require("@discordjs/voice");
const Queue = require('./Queue')
const QueueItem = require('./QueueItem')
const History = require('./History')
const MusicLoop = require('./MusicLoop')
module.exports = class GuildVoice extends EventEmitter {

    queue = new Queue()
    voiceConnection = null
    audioPlayer = createAudioPlayer()
    channel = null
    loop = new MusicLoop()
    history = null
    guildId = null

    constructor(guildId){
        super();

        this.guildId = guildId
        this.history = new History(guildId)

        this.on('startQueue', queue => {
            this.voiceConnection.subscribe(this.audioPlayer)
            this.audioPlayer.play(this.queue.first().resource)
            this.channel?.send(`Reproduciendo ${this.queue.first()}`).catch(()=>{})
        })

        this.audioPlayer.on('idle', async () => {
            this.history.add(this.queue.first())
            if(this.loop.mode == 0) this.queue.shift()
            else if(this.loop.mode == 1) this.queue.add(await this.queue.shift().restore())
            if(this.queue.size > 0) this.emit('startQueue', this.queue)
            else {
                this.voiceConnection.disconnect()
                this.voiceConnection = null
            }
        })

        this.on('skipSong', async () => {
            if(this.loop.mode == 0 || this.loop.mode == 2) this.queue.shift()
            else if(this.loop.mode == 1) this.queue.add(await this.queue.shift().restore())

            this.audioPlayer.stop()
            this.audioPlayer.play(this.queue.first().resource)
        })

        this.on('deletedSong', song => {
            this.channel?.send(`${song.title} removida de la cola`).catch(()=>{})
        })
    }

    addToQueue(queueItem) {
        this.queue.add(queueItem)
        if(this.queue.size == 1) this.emit('startQueue', this.queue)
    }

    removeSong(position){
        const deleted = this.queue[position-1]
        this.queue.delete(position-1)
        this.emit('deletedSong', deleted)
        if(position == 1) {
            this.audioPlayer.stop()
            this.history.add(deleted)
            if(this.queue.size > 0) this.emit('startQueue', this.queue)
        }
        if(this.queue.size == 0) {
            this.voiceConnection.disconnect()
            this.voiceConnection = null
        }
    }

    createQueueItem({resource, link, title}){
        return new QueueItem({
            resource, link, title,
            guildId: this.guildId
        })
    }

    async skipSong(){
        this.emit('skipSong', this.queue.first(), this.queue[1])
    }

    leaveVoiceConnection(){
        if(this.voiceConnection) this.voiceConnection.disconnect()
        this.voiceConnection = null
    }

    set voiceConnection(voiceConnection) {
        this.voiceConnection = voiceConnection
    }

    get voiceConnection() {
        return this.voiceConnection
    }

    set channel(channel) {
        this.channel = channel
    }

    get channel() {
        return this.channel
    }

}