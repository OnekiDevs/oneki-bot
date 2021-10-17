const CERO = require("../classes/Cero");
module.exports = class Uno extends require('../classes/Command'){

    constructor() {
        super({
            name: 'cero',
            aliases: ['0', 'uno'],
            permissions: {
                bot: [],
                member: []
            },
            cooldown: 0,
            args: []
        })

    }

    async run(message) {
        const partida = new CERO(message.author.id);
        partida.maxPlayers = 4;
        partida.message = await message.reply(partida.embed);
        await partida.awaitPlayers();
        partida.play();
    }

}