const { createAudioResource } = require('@discordjs/voice')
const { Command } = classes;
const yts = require("youtube-search");
const ytdl = require('ytdl-core');
module.exports = class Play extends Command {

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
        const guildVoice = client.servers.get(message.guild.id).voice
        if(!guildVoice.voiceConnection) {
            try {
                guildVoice.voiceConnection = await util.joinVoice({message});
            } catch (e) {
                return;
            }
        }
        let queueItem;
        if(message.attachments?.first() && message.attachments?.first().contentType?.startsWith('audio')) queueItem = guildVoice.createQueueItem({
            resource: createAudioResource(message.attachments.first().url),
            type: 'file',
            link: message.attachments.first().url
        });
        else {
            if ((/(https?:\/\/(www\.)?)?youtu\.?be(\.com)?\/((watch\?v=.+)|(.+))/gi).test(args[0])) {
                queueItem = guildVoice.createQueueItem({
                    resource: createAudioResource(await ytdl(args[0], { highWaterMark: 1<<25, filter: 'audioonly' })),
                    type: 'yt',
                    link: args[0]
                })
            } else {
                const query = (await yts(args.join(' '), {
                    maxResults: 1,
                    key: process.env.TOKEN_GOOGLE,
                    type: "video",
                })).results[0]
                queueItem = guildVoice.createQueueItem({
                    resource: createAudioResource(await ytdl(query.link, { highWaterMark: 1<<25, filter: 'audioonly' })),
                    link: query.link,
                    title: query.title,
                    type: 'yt'
                })
            }
        }
        guildVoice.channel = message.channel
        guildVoice.addToQueue(queueItem)
        message.reply('Agregado a la cola')
    }

}