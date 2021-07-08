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
        const ingresar = new MessageButton().setLabel('Ingresar').setCustomID(`uno_i_${partida.id}`).setStyle('PRIMARY');
        const comenzar = new MessageButton().setLabel('Comenzar').setCustomID(`uno_c_${partida.id}`).setStyle('SUCCESS')/*.setDisabled(true);*/
        partida.message = await message.reply({
            embeds: [partida.embed],
            components: [[ingresar, comenzar]]
        });
        console.log(partida);
        client.uno.set(partida.id, partida);
    }
};
