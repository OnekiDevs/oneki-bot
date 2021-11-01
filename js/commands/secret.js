const FieldValue = require('firebase-admin').firestore.FieldValue;
module.exports = class Secret extends require('../classes/Command'){

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

    async run(message) {
        if(!client.constants.developers.includes(message.author.id)) return;
        if(!args[0]) return;
        switch (args.shift()) {
            case 'prueba':
                message.reply('esta')
                break;
            case 'say':
                if((/<#\d{18}>/gi).test(args[0])) {
                    const ch = message.mentions.channels.cache.first();
                    args.shift()
                    ch.send(args.join(' '))
                } else message.channel.send(args.join(' '))
                break;
            case 'ap':
                const mention = await client.users.cache.get(message.mentions.members.first()?.id??args[0])
                if (!mention) return message.reply('Menciona a alguien');
                if (!args[1] || !Number(args[1])) return message.reply('Ingrese una cantidad')
                let obj = {}
                obj[mention.id] = FieldValue.increment(Number(args[1]))
                db.collection(message.guild.id).doc('fantasmita').update(obj)
                client.channels.cache.get('893310001282678784')?.send(`${Number(args[1])} puntos agregados a ${mention}`)
                break;
            default:
                message.reply('shh')
        }
    }

}
