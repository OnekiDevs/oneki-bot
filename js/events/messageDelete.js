const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "messageDelete",
    run: async (message) => {
        try {
            if (!['DEFAULT', 'REPLY'].includes(message.type)) console.log(message.type)
            if (!message.author || message.author?.bot) return;
            const server = client.servers.get(message.guild.id);
            const canal = client.channels.cache.get(server?.channels.messageDeleted);
            if (!canal) return;
            const lang = util.lang({lang:server.lang, route:'events/messageDelete'});
            const embed = new MessageEmbed()
                .setTitle(lang.embed.title[message.type]??lang.embed.fields.author.DEFAULT)
                .setURL(message.url)
                .setColor("RANDOM")
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .addField(lang.embed.fields.deletedIn[message.type]??lang.embed.fields.deletedIn.DEFAULT, `${message.channel} | ${message.channel.name}`, true)
                .setTimestamp()
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .addField(lang.embed.fields.write, `<t:${Math.round(message.createdTimestamp/1000)}>`, true)
                .setFooter(`${client.user.username} Bot ${require('../../package.json').version}`, client.user.avatarURL());
            if(message.content) embed.setDescription('```\n'+message.content+'\n```')
            canal.send({
                content: message.author.id,
                embeds: [embed],
                stickers: message.stickers.map(s=>s)
            });
        } catch (e) {
            util.error(e, __filename)
        }
    }
}