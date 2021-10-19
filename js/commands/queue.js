const { createAudioPlayer, createAudioResource } = require('@discordjs/voice')
const GuildVoice = require('../classes/GuildVoice')
const QueueItem = require('../classes/QueueItem')
// const {raw} = require('youtube-dl-exec')
const yts = require("youtube-search");
const ytdld = require('ytdl-core-discord');
module.exports = class Queue extends require('../classes/Command'){

    constructor() {
        super({
            name: 'queue',
            aliases: ['q'],
            permissions: {
                bot: [],
                member: []
            },
            cooldown: 0,
            args: []
        });
    }

    async run(message, args = []) {
        const guildVoice = client.voice.servers.get(message.guild.id)
        message.reply(guildVoice?guildVoice.queue.join('\n'):'No hay musica en la cola')
    }

}