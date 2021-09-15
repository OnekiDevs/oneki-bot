// const client = require('../bot');
const db = require('firebase-admin').firestore();
const package = require('../../package.json');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "messageDelete",
    run: async (message) => {
        try {
            if (!message.author || message.author?.bot) return;
            if (!message.content) return;
            const snapshot = await db.collection(message.guild.id).doc("deleted").get();
            const canal = client.channels.cache.get(snapshot.data()?.channel);
            if (!canal) return;
            const server = client.servers.get(message.guild.id);
            const lang = client.util.lang({lang:server.lang, route:'events/messageDelete'});
            const embed = new MessageEmbed()
                .setTitle(lang.embed.title)
                .setURL(message.url)
                .setColor("RANDOM")
                .addField(lang.embed.fields.author, message.author.username, true)
                .addField(lang.embed.fields.deletedIn, message.channel, true)
                .setTimestamp()
                .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
                .addField(lang.embed.fields.write, `${new Date(message.createdTimestamp).toDateString()}`, true)
                .addField(lang.embed.fields.content, message.content)
                .setFooter(`Kone Bot ${package.version}`, client.user.avatarURL());
            canal.send({
                content: message.author.id,
                embeds: [embed]
            });
        } catch (e) {
            util.error(e, __dirname)
        }
    }
}