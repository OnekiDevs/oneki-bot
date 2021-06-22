const { MessageEmbed } = require('discord.js');
module.exports = (partida) => {
    const embed = new MessageEmbed();
    embed.setTitle("UNO beta");
    if (partida.estado == 'curso') embed.setDescription(`Partida en curso. Turno de <@${partida.jugadores[0]}>`);
    else if (partida.estado == 'repartiendo') embed.setDescription(`Repartiendo cartas`);
    else embed.setDescription(`Esperando jugadores (se requieren minimo 2)`);
    embed.addField(`Host`, `<@${partida.host}>`, true);
    embed.addField(`jugadores ${partida.jugadores.length}/8`, `${partida.jugadores.map(j=>`<@${j}>`)}`, true);
    // embed.setFooter(`ID: ${partida.id} | `);
    embed.setThumbnail('https://www.uno-juego.es/wp-content/uploads/2020/01/retoure-karte.jpg')
    return embed;
}