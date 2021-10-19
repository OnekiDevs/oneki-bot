const { createAudioPlayer, createAudioResource } = require('@discordjs/voice')
const GuildVoice = require('../classes/GuildVoice')
const QueueItem = require('../classes/QueueItem')
// const {raw} = require('youtube-dl-exec')
const yts = require("youtube-search");
const ytdld = require('ytdl-core-discord');
module.exports = class Play extends require('../classes/Command'){

    constructor() {
        super({
            name: 'play',
            aliases: ['p'],
            permissions: {
                bot: [],
                member: []
            },
            cooldown: 0,
            args: []
        });
    }

    async run(message, args = []) {
        if(!(args[0] || message.attachments?.first())) return message.reply('Inserta un link, algun archivo o alguna cancion a buscar');
        if(message.attachments?.first() && !message.attachments?.first().contentType?.startsWith('audio')) return message.reply('El archivo debe ser un audio')
        if(!client.voice.servers.has(message.guild.id)) client.voice.servers.set(message.guild.id, new GuildVoice(message.guild))
        const guildVoice = client.voice.servers.get(message.guild.id)
        if(!guildVoice.voiceConnection) {
            try {
                guildVoice.voiceConnection = await util.joinVoice({message});
            } catch (e) {
                return;
            }
        }
        let queueItem;
        if(message.attachments?.first() && message.attachments?.first().contentType?.startsWith('audio')) queueItem = new QueueItem({
            resource: createAudioResource(message.attachments.first().url)
        });
        else {
            if((/(https?:\/\/(www\.)?)?youtu\.?be(\.com)?\/((watch\?v=.+)|(.+))/gi).test(args[0])) {
                queueItem = new QueueItem({
                    resource: createAudioResource(await ytdld(args[0]))
                })
            } else {
                const query = (await yts(args.join(' '), {
                    maxResults: 1,
                    key: process.env.TOKEN_GOOGLE,
                    type: "video",
                })).results[0]
                console.log(query)
                queueItem = new QueueItem({
                    resource: createAudioResource(await ytdld(query.link)),
                    link: query.link,
                    title: query.title
                })
            }
        }
        // if(!client.voice.servers.has(message.guild.id)) client.voice.servers.set(message.guild.id, new GuildVoice(message.guild))
        // const guildVoice = client.voice.servers.get(message.guild.id)
        // guildVoice.voiceConnection = voiceConnection
        guildVoice.addToQueue(queueItem)
        message.reply('Agregado a la cola')
    }

}