const { createAudioPlayer, createAudioResource } = require('@discordjs/voice')
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
        let voiceConnection = null
        if(!message.guild.me.voice.channel) message.reply('conectando...').then(m=>util.joinVoice({message}).then((vc)=>{
            m.edit('conectado')
            voiceConnection = vc
        }))
        if(!voiceConnection) voiceConnection = await util.joinVoice({message})
        const audioPlayer = createAudioPlayer();
        voiceConnection.subscribe(audioPlayer);
        const resource = createAudioResource(message.attachments?.first().url);
        audioPlayer.play(resource)
    }

}