module.exports = class Queue extends require('../classes/Command'){

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
        const guildVoice = client.voice.servers.get(message.guild.id)
        message.reply(guildVoice?guildVoice.queue.join('\n'):'No hay musica en la cola')
    }

}