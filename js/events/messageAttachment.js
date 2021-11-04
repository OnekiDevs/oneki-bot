const {MessageEmbed} = require("discord.js");
module.exports = {
    name: 'messageAttachment',
    run: async (message) => {
        try {
            if(!client.servers.get(message.guild.id)?.channels.attachments) return
            message.guild.channels.cache.get(client.servers.get(message.guild.id).channels.attachments).send({
                files: message.attachments.map(attachment => attachment),
                embeds: [new MessageEmbed().setTitle(`attachments send by ${message.member.displayName}`).setThumbnail(message.member.displayAvatarURL()).addField('Canal', `${message.channel} | ${message.channel.name}`).setURL(message.url)],
                content: message.author.id
            })
        } catch (e) {
            util.error(e, __filename)
        }
    }
}