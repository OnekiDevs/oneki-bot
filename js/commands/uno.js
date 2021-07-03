const { MessageEmbed, MessageButton } = require('discord.js');
const shortid = require('shortid');
module.exports = {
    name: "uno",
    botPermissions: [],
    usersPermissions: [],
    alias: [],
    run: async (client, message, args) => {
        const partida = {
            id:shortid.generate(),
            jugadores: [message.author.id],
            host: message.author.id,
            estado: 'espera'
        };
        const embed = require('../modules/uno/embedUno')(partida);
        const ingresar = new MessageButton().setLabel('Ingresar').setCustomID(`uno_i_${partida.id}`).setStyle('PRIMARY');
        const comenzar = new MessageButton().setLabel('Comenzar').setCustomID(`uno_c_${partida.id}`).setStyle('PRIMARY');
        message.reply({
            data: {
                embeds: [embed],
                components: [[ingresar, comenzar]]
            },
        });
        client.uno.set(partida.id, partida);
    }
};
