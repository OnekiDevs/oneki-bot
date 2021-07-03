const { MessageButton } = require('discord.js')
module.exports = {
    name: 'help',
    botPermissions: [],
    usersPermissions: [],
    alias: [],
    run: async (client, message, args) => {
        const server = client.servers.get(message.guild.id);
        const lang = client.util.lang({lang:server.lang, route:'commands/help/help'}).buttons;
        const embed = await require('../modules/help')(client, require('../../src/commands.json').Entretenimiento, 'de Entretenimento', message.guild.id);
        const entretenimiento = new MessageButton().setLabel(lang.entertainment).setStyle('PRIMARY').setCustomID('help_entretenimiento');
        const ayuda = new MessageButton().setLabel(lang.help).setStyle('PRIMARY').setCustomID('help_ayuda');
        const moderacion = new MessageButton().setLabel(lang.moderation).setStyle('PRIMARY').setCustomID('help_moderacion');
        const extra = new MessageButton().setLabel(lang.extra).setStyle('PRIMARY').setCustomID('help_extra');
        message.reply({
            embeds: [embed],
            components: [[entretenimiento, ayuda, moderacion, extra]]
        });
    }
}