const db = require('firebase-admin').firestore();
const { Permissions } = require('discord.js');
module.exports = {
    channel: async (client, interact, options) => {
        const lang = util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).deleted.channel;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        const channel = options.getChannel('channel');
        db.collection(channel.guild.id).doc("deleted").update({
            channel: channel.id
        }).catch(err => {
            if (err.details.startsWith("No document to update")) db.collection(channel.guild.id).doc("deleted").set({
                channel: channel.id
            });
        });
        interact.reply({
            content: `${await util.replace(lang.reply, [{ match: "{channel}", replace: `\`${channel.name}\`` }])}`,
            ephemeral: true
        });
    },
    reset: async (client, interact, options) => {
        const lang = util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).deleted.reset;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        db.collection(interact.guildId).doc("deleted").delete();
        interact.reply({
            content: lang.reply,
            ephemeral: true
        });
    }
}