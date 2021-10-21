module.exports = class Ping extends require('../classes/Command'){

    constructor() {
        super({
            name: 'secret',
            aliases: [],
            permissions: {
                bot: [],
                member: []
            },
            cooldown: 0,
            args: []
        })
    }

    run(message) {
        if(!DEVELOPERS.includes(message.author.id)) return;
        if(!args[0]) return;
        switch (args.shift()) {
            case 'say':
                message.channel.send(args.join(' '))
                break;
            default:
                message.reply('shh')
        }
    }

}