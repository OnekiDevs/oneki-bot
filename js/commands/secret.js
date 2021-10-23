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
            case 'prueba':
                message.reply('esta')
                break;
            case 'say':
                if((/<#d{18}>/gi).test(args[0])) {
                    const ch = message.mentions.channels.cache.first();
                    args.shift()
                    ch.send(args.join(' '))
                } else message.channel.send(args.join(' '))
                break;
            default:
                message.reply('shh')
        }
    }

}
