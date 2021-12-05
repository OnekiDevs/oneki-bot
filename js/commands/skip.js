const {OldCommand} = require("../scripts/exportClasses");
module.exports = class Ping extends OldCommand{

    constructor() {
        super({
            name: 'skip',
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
        client.servers.get(message.guild.id).voice.skipSong();
    }

}