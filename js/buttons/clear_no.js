const { Permissions } = require('discord.js')
module.exports.run = async (client, interact, params) => {
    interact.deferUpdate();
    if (interact.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.MANAGE_MESSAGES])) interact.message.delete();
}
module.exports.id = 'clear_no';