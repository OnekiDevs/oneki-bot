const { MessageEmbed, Permissions } = require("discord.js");
const db = require('firebase-admin').firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;
const package = require('../../package.json');
module.exports = {
    name: "Sugerir",
    alias: ["sugerencia", "suggestion", "suggest"],
    botPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
    userPermissions: [],
    run: async (client, message, args, data) => {
        const snapshot = await db.collection(message.guild.id).doc("suggest").get();
        if (!snapshot.exists) return;
        const prefix = await client.servers.get(message.guild.id).prefix;
        if (args.length < 2) return message.inlineReply(`Uso: ${prefix}sugerir <canal> [Sugerencia]`);
        const channelid = snapshot.data()[args[0]];
        const channel = message.guild.channels.cache.get(channelid ?? snapshot.data().predetermined);
        if (!channel) return;
        message.delete();
        let obj = {}
        obj['lastId'] = snapshot.exists ? FieldValue.increment(1) : 1;
        const embed = new MessageEmbed();
        embed.setAuthor(message.author.username, message.author.displayAvatarURL());
        embed.setTitle(`Nueva Sugerencia`);
        embed.setColor(16313844);
        embed.setDescription(channelid ? args.slice(1).join(' ') : args.join(' '));
        embed.setFooter(`Kone Bot ${package.version} | Sugerencia Pendiente | ID ${snapshot.exists ? snapshot.data().lastId?? '1' : '1'}`, client.user.avatarURL());
        embed.setTimestamp();
        const m = await channel.send(embed);
        m.react("👍");
        m.react("👎");
        obj[snapshot.exists ? snapshot.data().lastId?? '1' : '1'] = {
            channel: m.channel.id,
            author: message.author.id,
            suggest: channelid ? args.slice(1).join(' ') : args.join(' ')
        }
        db.collection(`suggest`).doc(message.guild.id).update(obj).catch(err => {
            if (err.details.startsWith("No document to update")) db.collection(`suggest`).doc(message.guild.id).set(obj);
        });
    }   
}
