const { MessageAttachment } = require('discord.js');
module.exports = async (client, interact) => {
    let partida = client.uno.get(interact.customID.slice(6));
    if (partida && partida[interact.user.id]) {
        interact.defer({ 
            ephemeral: true 
        })
        let cartas = ['0r', '1r', '2r', '3r', '4r', '5r', '6r', '7r', '8r', '9r', '0y', '1y', '2y', '3y', '4y', '5y', '6y', '7y', '8y', '9y', '0b', '1b', '2b', '3b', '4b', '5b', '6b', '7b', '8b', '9b', '0g', '1g', '2g', '3g', '4g', '5g', '6g', '7g', '8g', '9g', 'py', 'pb', 'pg', 'pr', 'cy', 'cb', 'cg', 'cr', 'ry', 'rb', 'rr', 'rg', 'cc', 'cb', 'cr', 'cg', 'cy'];
        console.log(partida[interact.user.id].cartas);
        partida[interact.user.id].cartas.push(cartas[Math.floor(Math.random() * cartas.length)]);
        const maso = await require('./cartas')(partida[interact.user.id].cartas);
        const attachment = new MessageAttachment(maso, 'cartas.png');
        const msg = await client.channels.cache.get('857846193852907530').send({
            files: [attachment]
        });
        client.uno.set(partida.id, partida)
        interact.editReply({
            content: msg.attachments.first().url,
            ephemeral: true
        });
    } else {
        interact.deferUpdate();
    }
}