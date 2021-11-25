const {Command} = require("../scripts/exportClasses");
module.exports = class Remove extends Command{

    constructor() {
        super({
            name: 'remove',
            aliases: [],
            permissions: {
                bot: [],
                member: []
            },
            cooldown: 0,
            args: []
        })

    }

    run(message, args) {
        if (!message.member.voice.channel) return message.reply('Conectate a un canal de voz primero')
        if(!args[0] || !Number(args[0])) return message.reply('Ingrese una pista')
        const guildVoice = client.servers.get(message.guild.id).voice
        if(guildVoice.queue.size < Number(args[0]) || Number(args[0]) < 1) return message.reply('Pista no encontrada, revise el comando `>queue`')
        guildVoice.removeSong(Number(args[0]))
    }

}