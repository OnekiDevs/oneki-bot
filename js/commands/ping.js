const {Command} = require("../scripts/exportClasses");
module.exports = class Ping extends Command{

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