module.exports = class Ping extends require('../classes/Command'){

    constructor() {
        super({
            name: 'ping',
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
        message.reply('pong')
    }

}