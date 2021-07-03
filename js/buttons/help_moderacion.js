const  { MessageEmbed } = require('discord.js');
module.exports.run = async (client, interact, params) => {
    const embed = await require('../modules/help')(client, require('../../src/commands.json').Moderacion, 'de Moderacion', interact.guildID);
    interact.message.edit({ 
        embeds: [embed]
    });
    interact.deferUpdate();
}
module.exports.id = 'help_moderacion';