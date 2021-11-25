const {Command} = require("../scripts/exportClasses");
module.exports = class Leave extends Command{

    constructor() {
        super({
            name: 'leave',
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
        client.servers.get(message.guild.id).voice.leaveVoiceConnection()
    }

}