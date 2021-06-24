const  { MessageEmbed } = require('discord.js');
module.exports.run = async (client, interact, params) => {
    interact.deferUpdate();
    if (interact.user.id == interact.message.author.id) {
        let canal = await interact.message.channel.clone();
        canal.setPosition(channel.position);
        interact.message.channel.delete();
    }
}
module.exports.id = 'clear_yes';