const FieldValue = require('firebase-admin').firestore.FieldValue;
const { Permissions } = require('discord.js');
module.exports = {
    channel: async (interact, options) => {
        const lang = util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).deleted.channel;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        const channel = options.getChannel('channel');
        db.collection('config').doc(channel.guild.id).update({
            channelDeletedMessages: channel.id
        }).catch(err => {
            if (err.details.startsWith("No document to update")) db.collection('config').doc(channel.guild.id).set({
                channelDeletedMessages: channel.id
            });
        });
        interact.reply({
            content: `${await util.replace(lang.reply, [{ match: "{channel}", replace: `\`${channel.name}\`` }])}`,
            ephemeral: true
        });
        client.servers.get(interact.guildId)?.setMessageDeleted(channel.id);
    },
    reset: async (interact, options) => {
        const lang = util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).deleted.reset;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES, Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        db.collection('config').doc(interact.guildId).update({
            channelDeletedMessages: FieldValue.delete()
        }).catch(()=>{})
        interact.reply({
            content: lang.reply,
            ephemeral: true
        });
        client.servers.get(interact.guildId)?.setMessageDeleted(null);
    }
}