const { createAudioPlayer, createAudioResource } = require('@discordjs/voice')
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
        return;
        if(!(args[0] || message.attachments?.first())) return message.reply('Inserta un link, algun archivo o alguna cancion a buscar');
        if(message.attachments?.first() && !message.attachments?.first().contentType?.startsWith('audio')) return message.reply('El archivo debe ser un audio')
        let voiceConnection = null
        console.log(message.guild.voiceAdapterCreator)
        try {
            if(!message.guild.me.voice.channel) message.reply('conectando...').then(m=>util.joinVoice({message, adapterCreator:message.guild.voiceAdapterCreator}).then((vc)=>{
                m.edit('conectado')
                voiceConnection = vc
            }))
            if(!voiceConnection) voiceConnection = await util.joinVoice({message, adapterCreator:message.guild.voiceAdapterCreator})
        } catch (e) {
            console.log('***************************************************', e, '***************************************************')
            return message.reply('fallo al conectar')
        }
        const audioPlayer = createAudioPlayer();
        voiceConnection.subscribe(audioPlayer);
        let resource;
        if(message.attachments?.first() && message.attachments?.first().contentType?.startsWith('audio')) resource = createAudioResource(message.attachments.first().url);
        else {
            if((/(https?:\/\/(www\.)?)?youtu\.?be(\.com)?\/((watch\?v=.+)|(.+))/gi).test(args[0])) {
                resource = createAudioResource(await ytdld(args[0]))
            } else {
                const query = (await yts(args.join(' '), {
                    maxResults: 1,
                    key: process.env.TOKEN_GOOGLE,
                    type: "video",
                })).results[0].link
                console.log(query)
                resource = createAudioResource(await ytdld(query))
            }
        }
        audioPlayer.play(resource)
        message.reply('Reproduciendo')
    }

}