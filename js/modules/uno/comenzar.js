const { MessageEmbed } = require('discord.js');
module.exports = (client, interact) => {
    const partida = client.uno.get(interact.data.custom_id.slice(6))
    if (!partida) {
        return client.api.interactions(interact.id, interact.token).callback.post({
            data: {
                type: 6
            }
        });
    }
    if (partida.host == interact.member.user.id) {
        if (partida.jugadores.length > 1) {
            partida.estado = 'curso'
            const embed = require('./embedUno')(partida);
            client.uno.set(interact.data.custom_id.slice(6), partida)
            client.api.channels(interact.channel_id).messages(interact.message.id).patch({
                data: {
                    embed: embed,
                    components: [
                        {
                            type: 1,
                            components: [
                                {
                                    type: 2,
                                    style: 2,
                                    custom_id: `uno_m_${partida.id}`,
                                    label: "Mostrar Cartas",
                                },
                                {
                                    type: 2,
                                    style: 3,
                                    custom_id: `uno_e_${partida.id}`,
                                    label: "Comer",
                                }
                            ]
                        }
                    ]
                }
            });
            client.api.interactions(interact.id, interact.token).callback.post({
                data: {
                    type: 6
                }
            });
        } else {
            client.api.interactions(interact.id, interact.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: "Se requieren minimo 2 jugadores para comenzar",
                        flags: 1 << 6
                    }
                }
            });
        }
    } else {
        client.api.interactions(interact.id, interact.token).callback.post({
            data: {
                type: 4,
                data: {
                    content: "Solo el Host puede empezar la partida",
                    flags: 1 << 6
                }
            }
        });
    }
}