const { MessageEmbed } = require('discord.js');
module.exports = (partida) => {
    const embed = new MessageEmbed();
    embed.setTitle("UNO beta");
    if (partida.estado == 'curso') {
        embed.setDescription(`Partida en curso. Turno de <@${partida.jugadores[0]}>`);
        //console.log(partida);
        embed.setImage(require('../../../src/unoCards.json')[partida.jugadas].url);
        embed.addField(`jugadores ${partida.jugadores.length}`, `${partida.jugadores.map(j=>`<@${j}>`)}`, true);
    }
    else {
        embed.setDescription(`Esperando jugadores (se requieren minimo 2)`);
        embed.setThumbnail('https://cdn.discordapp.com/attachments/775746031458975824/854521694436589588/New_Project.jpg');
        embed.addField(`jugadores ${partida.jugadores.length}/8`, `${partida.jugadores.map(j=>`<@${j}>`)}`, true);
    }
    embed.addField(`Host`, `<@${partida.host}>`, true);
    return embed;
}