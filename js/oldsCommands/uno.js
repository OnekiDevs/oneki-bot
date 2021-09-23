const { MessageEmbed, MessageButton } = require('discord.js');
const UNO = require('../classes/uno');
module.exports = {
    name: "uno",
    botPermissions: [],
    userPermissions: [],
    alias: [],
    run: async (message, args) => {
        // return;
        const partida = new UNO(message.author.id);
        partida.maxPlayers = 4;
        partida.message = await message.reply(partida.embed);
        await partida.awaitPlayers();
        partida.play(); 
    }
};