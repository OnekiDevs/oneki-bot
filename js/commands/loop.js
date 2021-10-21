module.exports = class Ping extends classes.Command{

    constructor() {
        super({
            name: 'loop',
            aliases: ['l'],
            permissions: {
                bot: [],
                member: []
            },
            cooldown: 0,
            args: []
        })

    }

    run(message, args) {
        const guildVoice = client.servers.get(message.guild.id).voice
        guildVoice.loop.change(args[0])
        message.reply(`loop establecido en \`${guildVoice.loop}\``)
    }

}