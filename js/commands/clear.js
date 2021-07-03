const { Permissions, MessageButton } = require('discord.js');
module.exports = {
    name: "clear",
    botPermissions: [Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS],
    usersPermissions: [Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS],
    alias: [],
    run: async (client, message, args) => {
        const server = client.servers.get(message.guild.id);
        const lang = client.util.lang({lang:server.lang, route:'commands/moderation/clear'});
        const yes = new MessageButton().setLabel(lang.buttons.yes).setStyle('PRIMARY').setCustomID('clear_yes')
        const no = new MessageButton().setLabel(lang.buttons.no).setStyle('DANGER').setCustomID('clear_no')
        if (!args[0] || args[0] != "-y"){
            message.channel.send({
                content:lang.sure,
                components: [[yes, no]]
            });
        } else {
            const canal = await message.channel.clone();
            canal.setPosition(message.channel.position);
            message.channel.delete();
        }
    }
}