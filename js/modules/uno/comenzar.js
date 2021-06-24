const { MessageEmbed } = require('discord.js');
module.exports = async (client, interact) => {
    let partida = client.uno.get(interact.customID.slice(6))
    if (!partida) {
        return interact.deferUpdate();
    }
    if (partida.host == interact.member.user.id) {
        if (partida.jugadores.length > 1 || true) {
            partida.estado = 'curso'
            let embed = require('./embedUno')(partida);
            partida = await require('../uno').repartir(partida);
            client.uno.set(interact.customID.slice(6), partida);
            interact.deferUpdate();
            client.api.channels(interact.channelID).messages(interact.message.id).patch({
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
        } else {
            interact.reply({
                content: "Se requieren minimo 2 jugadores para comenzar",
                ephemeral: true
            });
        }
    } else {
        interact.reply({
            content: "Solo el Host puede empezar la partida",
            ephemeral: true
        });
    }
}