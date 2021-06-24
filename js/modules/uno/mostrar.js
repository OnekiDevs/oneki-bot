const { MessageAttachment } = require('discord.js');
const fetch = require("node-fetch");
module.exports = async (client, interact) => {
    let partida = client.uno.get(interact.customID.slice(6));
    if (partida && partida[interact.user.id]) {
        interact.defer({ 
            ephemeral: true 
        })
        const maso = await require('./cartas')(partida[interact.user.id].cartas);
        const attachment = new MessageAttachment(maso, 'cartas.png')
        interact.editReply({
            content: 'Tus cartas',
            files: [attachment],
            ephemeral: true
        });
    } else {
        interact.deferUpdate();
    }
}