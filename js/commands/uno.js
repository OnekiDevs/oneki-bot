const { MessageEmbed, MessageButton } = require('discord.js');
const shortid = require('shortid');
const UNO = require('../modules/class/uno');
module.exports = {
    name: "uno",
    botPermissions: [],
    userPermissions: [],
    alias: [],
    run: async (client, message, args) => {
        const partida = new UNO(shortid.generate(), message.author.id);
        partida.maxPlayers = 4;
        partida.message = await message.reply(partida.embed);
        await partida.awaitPlayers();
    }
};
