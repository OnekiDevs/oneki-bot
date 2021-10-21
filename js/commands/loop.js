module.exports = class loop extends classes.Command{

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
        message.reply(guildVoice.loop.mode != 0 ? `loop establecido en \`${guildVoice.loop}\`` : 'Loop desactivado')
    }

}