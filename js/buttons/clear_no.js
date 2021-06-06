const  { MessageEmbed } = require('discord.js');
module.exports.run = async (client, interact, params) => {
    const guild = client.guilds.cache.get(interact.guild_id);
    // console.log(interact.member.user.id);
    const member = guild.members.cache.get(interact.member.user.id);
    if (!member.permissions.has(['MANAGE_MESSAGES', 'MANAGE_CHANNELS'])) {
        client.api.interactions(interact.id, interact.token).callback.post({
            data: {
                type: 4, 
                data: {
                    content: `No tienes permisos suficientes para interactuar`,
                    flags: 1 << 6
                }
            }
        });
    } else {
        const channel = guild.channels.cache.get(interact.message.channel_id);
        let canal = await channel.clone();
        canal.setPosition(channel.position);
        channel.delete();
        client.api.interactions(interact.id, interact.token).callback.post({
            data: {
                type: 6
            }
        });
    }
}
module.exports.id = 'clear_no';