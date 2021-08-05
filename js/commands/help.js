const { MessageButton, MessageActionRow } = require('discord.js')
module.exports = {
    name: 'help',
    botPermissions: [],
    userPermissions: [],
    alias: [],
    run: async (client, message, args) => {
        const server = client.servers.get(message.guild.id);
        const lang = client.util.lang({lang:server.lang, route:'commands/help'}).buttons;
        const embed = await require('../scripts/help')(client, require('../../src/commands.json').Entretenimiento, 'de Entretenimento', message.guild.id);
        const entretenimiento = new MessageButton().setLabel(lang.entertainment).setStyle('PRIMARY').setCustomId('help_entretenimiento');
        const ayuda = new MessageButton().setLabel(lang.help).setStyle('PRIMARY').setCustomId('help_ayuda');
        const moderacion = new MessageButton().setLabel(lang.moderation).setStyle('PRIMARY').setCustomId('help_moderacion');
        const extra = new MessageButton().setLabel(lang.extra).setStyle('PRIMARY').setCustomId('help_extra');
        message.reply({
            embeds: [embed],
            components: [new MessageActionRow().addComponents([entretenimiento, ayuda, moderacion, extra])]
        });
    }
}