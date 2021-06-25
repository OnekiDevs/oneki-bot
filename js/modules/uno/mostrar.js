const { MessageAttachment } = require('discord.js');
const fetch = require("node-fetch");
module.exports = async (client, interact) => {
    let partida = client.uno.get(interact.customID.slice(6));
    if (partida && partida[interact.user.id]) {
        interact.defer({ 
            ephemeral: true 
        })
        const maso = await require('./cartas')(partida[interact.user.id].cartas);
        const attachment = new MessageAttachment(maso, 'cartas.png');
        const msg = await client.channels.cache.get('857846193852907530').send({
            files: [attachment]
        });
        interact.editReply({
            content: msg.attachments.first().url,
            ephemeral: true
        });
        //TODO obtener el mensaje de la respuesta
        const res = await interact.fetchReply();
        console.log(res);
    } else {
        interact.deferUpdate();
    }
}