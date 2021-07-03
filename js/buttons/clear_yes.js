const  { MessageEmbed, Permissions } = require('discord.js');
module.exports.run = async (client, interact, params) => {
    interact.deferUpdate();
    if (interact.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.MANAGE_MESSAGES])) {
        let canal = await interact.message.channel.clone();
        canal.setPosition(interact.message.channel.position);
        interact.message.channel.delete();
    }
}
module.exports.id = 'clear_yes';