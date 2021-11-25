const {Command} = require("../scripts/exportClasses");
module.exports = class Queue extends Command{

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
        const guildVoice = client.servers.get(message.guild.id).voice
        message.reply(`${guildVoice.queue}`)
    }

}