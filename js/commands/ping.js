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

    async run(message, args) {
        await message.reply('pong')
    }

}