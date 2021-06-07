const { MessageEmbed } = require('discord.js');
module.exports = (client, interact) => {
    const partida = client.uno.get(interact.data.custom_id.slice(6))
    if (partida && !partida.jugadores.includes(interact.member.user.id)){
        partida.jugadores.push(interact.member.user.id);
        let botones = [];
        if (partida.jugadores.length == 8) {
            partida.estado = 'curso'
            //TODO Partida en curso, desarrollar la logica, que ya no mande el boton de unirse o el de iniciar, cambiarlos por mostrar cartas
            botones.push({
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
            })
            //TODO agregar primera carta y repartir embed.setThumbnail()
            client.uno.set(interact.data.custom_id.slice(6), partida)
        } else {
            botones.push({
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
            })
        }
        const embed = require('./embedUno')(partida);
        client.api.channels(interact.channel_id).messages(interact.message.id).patch({
            data: {
                embed: embed,
                components: [
                    {
                        type: 1,
                        components: botones
                    }
                ]
            }
        });
    } 
    client.api.interactions(interact.id, interact.token).callback.post({
        data: {
            type: 6
        }
    });
}