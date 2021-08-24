const { MessageEmbed } = require('discord.js');
module.exports = async (client, interact) => {
    let partida = client.uno.get(interact.customID.slice(7));
    if (partida && !partida.jugadores.includes(interact.user.id)){
        partida.jugadores.push(interact.user.id);
        let botones = [];
        if (partida.jugadores.length == 8) {
            partida.estado = 'curso'
            partida = await require('../uno').repartir(partida);
            //TODO Partida en curso, desarrollar la logica, que ya no mande el boton de unirse o el de iniciar, cambiarlos por mostrar cartas
            botones.push({
                type: 2,
                style: 2,
                custom_id: `uno_mo_${partida.id}`,
                label: "Mostrar Cartas",
            },
            {
                type: 2,
                style: 3,
                custom_id: `uno_ea_${partida.id}`,
                label: "Comer",
            })
            //TODO agregar primera carta y repartir embed.setThumbnail()
            client.uno.set(interact.customID.slice(6), partida)
        } else {
            botones.push({
                type: 2,
                style: 1,
                custom_id: `uno_in_${partida.id}`,
                label: "Ingresar",
            },
            {
                type: 2,
                style: 3,
                custom_id: `uno_co_${partida.id}`,
                label: "Comenzar",
            })
        }
        const embed = require('./embedUno')(partida);
        client.api.channels(interact.channelID).messages(interact.message.id).patch({
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
    interact.deferUpdate();
}