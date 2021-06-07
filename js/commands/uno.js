const { MessageEmbed } = require('discord.js');
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
        client.api.channels(message.channel.id).messages.post({
            data: {
                embed: embed,
                components: [
                    {
                        type: 1,
                        components: [
                            {
                                type: 2,
                                style: 1,
                                custom_id: `uno_i_${partida.id}`,
                                label: "Ingresar",
                            },
                            {
                                type: 2,
                                style: 3,
                                custom_id: `uno_c_${partida.id}`,
                                label: "Comenzar",
                            }
                        ],
                    },
                ],
                message_reference: {
                    message_id: message.id,
                },
            },
        });
        client.uno.set(partida.id, partida);
    }
};
