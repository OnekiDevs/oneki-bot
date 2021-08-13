const db = require('firebase-admin').firestore();
const { Permissions } = require('discord.js');
module.exports = {
    channel: async (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).deleted.channel;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        const channel = options.get('channel');
        db.collection(channel.channel.guild.id).doc("deleted").update({
            channel: channel.value
        }).catch(err => {
            if (err.details.startsWith("No document to update")) db.collection(channel.channel.guild.id).doc("deleted").set({
                channel: channel.value
            });
        });
        interact.reply({
            content: `${await client.utiles.replace(lang.reply, [{ match: "channel", replace: `\`${channel.channel.name}\`` }])}`,
            ephemeral: true
        });
    },
    reset: async (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).deleted.reset;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        db.collection(channel.channel.guild.id).doc("deleted").delete();
        interact.reply({
            content: lang.reply,
            ephemeral: true
        });
    }
}