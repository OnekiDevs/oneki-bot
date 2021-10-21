'use strict';
const EventEmitter = require('node:events');
const {createAudioPlayer} = require("@discordjs/voice");
const { Queue } = classes.Queue
module.exports = class GuildVoice extends EventEmitter {

    queue = new Queue()
    voiceConnection = null
    audioPlayer = createAudioPlayer()
    channel = null

    constructor(){
        super();

        this.on('startQueue', () => {
            this.voiceConnection.subscribe(this.audioPlayer)
            this.audioPlayer.play(this.queue[0].resource)
            this.channel?.send(`Reproduciendo ${this.first}`).catch(()=>{})
        })
        this.audioPlayer.on('idle', () => {
            this.queue.shift()
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