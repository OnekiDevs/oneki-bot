module.exports = class Rank extends classes.Command{

    constructor() {
        super({
            name: 'rank',
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
        message.reply('es con `<`')
    }

}
