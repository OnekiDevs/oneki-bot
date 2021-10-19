const {joinVoiceChannel} = require("@discordjs/voice");
module.exports = class Join extends require('../classes/Command'){

    constructor() {
        super({
            name: 'join',
            aliases: ['connect'],
            permissions: {
                bot: [],
                member: []
            },
            cooldown: 0,
            args: []
        });
    }

    async run(message, args = []) {
        // message.reply('conectado...').then(m=>util.joinVoice({message})
        //     .then(vc=>m.edit('conectado'))
        //     .catch(e=>{
        //         if(`${e}` == 'bot ocupped') {
        //             m.edit('Estoy ocupado');
        //         } else {
        //             m.edit(`${e}`)
        //         }
        //     }))
        util.joinVoice({message})
            .then(vc=>{})
            .catch(e=>{
                // if(`${e}` == 'bot ocupped') {
                //     m.edit('Estoy ocupado');
                // } else {
                //     m.edit(`${e}`)
                // }
            })
        // if(!message.member.voice.channel) return message.reply("No estas en un canal de voz");
        // const voiceConnection = joinVoiceChannel({
        //     channelId: message.member.voice.channel.id,
        //     guildId: message.guild.id,
        //     adapterCreator: message.guild.voiceAdapterCreator
        // })
    }

}