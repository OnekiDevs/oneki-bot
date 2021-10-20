'use strict';
const EventEmitter = require('node:events');
const {createAudioPlayer, createAudioResource} = require("@discordjs/voice");
const Queue = require('./Queue')
const MusicLoop = require('./MusicLoop')
module.exports = class GuildVoice extends EventEmitter {

    queue = new Queue()
    voiceConnection = null
    audioPlayer = createAudioPlayer()
    channel = null
    loop = new MusicLoop()

    constructor(){
        super();

        this.on('startQueue', () => {
            this.voiceConnection.subscribe(this.audioPlayer)
            this.audioPlayer.play(this.queue[0].resource)
            this.channel?.send(`Reproduciendo ${this.first}`).catch(()=>{})
        })
        this.audioPlayer.on('idle', () => {
            if(this.loop.mode == 0) this.queue.shift()
            else if(this.loop.mode == 1) this.queue.add((async ()=>{
                const t = this.queue.shift()
                return {
                    ...t,
                    resource: createAudioResource(t.type == 'file' ? t.link : await ytdld(t.link))
                }
            })())
            if(this.queue.size > 0) this.emit('startQueue')
            else {
                this.voiceConnection.disconnect()
                this.voiceConnection = null
            }
        })
    }

    addToQueue(queueItem) {
        this.queue.add(queueItem)
        if(this.queue.size == 1) this.emit('startQueue', null)
    }

    setChannel(channel) {
        this.channel = channel
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