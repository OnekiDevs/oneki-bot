'use strict';
const EventEmitter = require('node:events');
const {createAudioPlayer} = require("@discordjs/voice");
module.exports = class GuildVoice extends EventEmitter {

    queue = [];
    voiceConnection = null;
    audioPlayer = createAudioPlayer();
    channel = null;

    constructor(){
        super();

        this.on('startQueue', () => {
            this.voiceConnection.subscribe(this.audioPlayer);
            this.audioPlayer.play(this.queue[0].resource)
            this.message?.channel.send(`Reproduciendo ${this.queue[0]}`).catch(()=>{})
        })
        this.audioPlayer.on('idle', () => {
            this.queue.shift()
            console.log(this.queue)
            if(this.queue.length > 0) this.emit('startQueue')
            else {
                this.voiceConnection.disconnect()
                this.voiceConnection = null;
            }
        })
    }

    addToQueue(queueItem) {
        this.queue.push(queueItem)
        if(this.queue.length == 1) this.emit('startQueue', null)
    }

    set voiceConnection(voiceConnection) {
        this.voiceConnection = voiceConnection
    }

    get voiceConnection() {
        return this.voiceConnection
    }

    set channel(channel) {
        this.channel = channel;
    }

    get channel() {
        return this.channel;
    }

}