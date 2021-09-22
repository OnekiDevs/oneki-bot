const UNO = require("../classes/uno");
module.exports = class Uno extends require('../classes/Command'){

    constructor() {
        super({
            name: 'uno',
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
        return;
        const partida = new UNO(message.author.id);
        partida.maxPlayers = 4;
        partida.message = await message.reply(partida.embed);
        await partida.awaitPlayers();
        partida.play();
    }

}