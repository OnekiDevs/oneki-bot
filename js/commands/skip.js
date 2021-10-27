module.exports = class Ping extends classes.Command{

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
        client.servers.get(message.guild.id).voice.skipSong();
    }

}