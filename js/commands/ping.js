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
        console.log('sssss')
        message.reply('pong').then(c => console.log(c.content)).catch(e=>console.log('22222', e))
        console.log('xxxxx')
    }

}