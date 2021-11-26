const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "messageUpdate",
    run: async (oldMessage, newMessage) => {
        try {
            if ((!oldMessage.author || oldMessage.author?.bot) || (oldMessage.content && oldMessage.content === newMessage.content)) return;
            // const snapshot = await db.collection(oldMessage.guild.id).doc("edited").get();
            const server = client.servers.get(oldMessage.guild.id);
            const canal = client.channels.cache.get(server?.channels.messageEdited);
            // console.log(canal.name, canal.permissionsFor(client.user.id).serialize());
            if (!canal || !canal.permissionsFor(client.user.id)?.has(['SEND_MESSAGES', 'VIEW_CHANNEL'])) return;
            const embed = new MessageEmbed()
            embed.setTitle("Mensaje Editado");
            embed.setURL(oldMessage.url);
            embed.setColor("RANDOM");
            embed.setAuthor(oldMessage.author.username, oldMessage.author.displayAvatarURL())
            // embed.addField("Autor del mensaje:", oldMessage.author.username, true);
            embed.addField("Editado En:", `${oldMessage.channel}`, true);
            embed.setTimestamp();
            embed.setThumbnail(oldMessage.author.displayAvatarURL({dynamic: true}));
            embed.addField("Escrito el:", `<t:${Math.round(oldMessage.createdTimestamp/1000)}>`, true);
            embed.addField("Editado el:", `<t:${Math.round(newMessage.editedTimestamp/1000)}>`, true);
            if (oldMessage.content) {
                embed.addField("Antes", '```\n'+oldMessage.content+'\n```', false);
            }
            if (newMessage.content) {
                embed.addField("Después", '```\n'+newMessage.content+'\n```', false);
            }
            embed.setFooter(`${client.user.username} Bot ${require('../../package.json').version}`, client.user.avatarURL());
            canal.send({
                content: oldMessage.author.id,
                embeds: [embed]
            });
        } catch (e) {
            util.error(e, __filename)
        }
    }
}
