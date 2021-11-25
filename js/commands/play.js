const { createAudioResource } = require('@discordjs/voice')
const yts = require("youtube-search");
const {stream} = require("play-dl");
const {Command} = require("../scripts/exportClasses");
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
        try {
            if(!(args[0] || message.attachments?.first())) return message.reply('Inserta un link, algun archivo o alguna cancion a buscar');
            if(message.attachments?.first() && !message.attachments?.first().contentType?.startsWith('audio')) return message.reply('El archivo debe ser un audio')
            if(!message.member.voice.channel) return message.reply('Conectate a un canal de voz primero')
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
                    const str = await stream(args[0])
                    queueItem = guildVoice.createQueueItem({
                        resource: createAudioResource(str.stream, {inputType: str.type}),
                        type: 'yt',
                        link: args[0]
                    })
                } else {

                    const {link, title} = (await yts(args.join(' '), {
                        maxResults: 1,
                        key: process.env.TOKEN_GOOGLE,
                        type: "video",
                    })).results[0]
                    const str = await stream(link)
                    queueItem = guildVoice.createQueueItem({
                        resource: createAudioResource(str.stream, {inputType: str.type}),
                        link: link,
                        title: title,
                        type: 'yt'
                    })
                }
            }
            guildVoice.channel = message.channel
            guildVoice.addToQueue(queueItem)
            message.reply('Agregado a la cola')
        } catch (e) {
            throw e
        }
    }

}