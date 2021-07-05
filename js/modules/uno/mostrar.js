const { MessageAttachment } = require('discord.js');
const fetch = require("node-fetch");
module.exports = async (client, interact) => {
    let partida = client.uno.get(interact.customID.slice(7));
    if (partida && partida[interact.user.id]) {
        interact.defer({ 
            ephemeral: true 
        })
        const maso = await require('./cartas')(partida[interact.user.id].cartas);
        const components = await require('./components')(partida[interact.user.id].cartas);
        const attachment = new MessageAttachment(maso, 'cartas.png');
        const msg = await client.channels.cache.get('857846193852907530').send({
            files: [attachment]
        });
        interact.editReply({
            content: msg.attachments.first().url,
            // components,
            ephemeral: true
        });
        partida[interact.user.id].interact = interact;
    } else {
        interact.deferUpdate();
    }
}