const FieldValue = require('firebase-admin').firestore.FieldValue;
const { Permissions } = require('discord.js');
module.exports = {
    channel: async (interact, options) => {
        const lang = util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).attachments.channel;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        const ch = options.getChannel('channel');
        interact.reply({
            content:  `${await util.replace(lang.reply, [{ match: "{channel}", replace: ch.name }])}`,
        });
        db.collection('config').doc(interact.guildId).update({
            attachments: ch.id
        }).catch((err) => {
            console.log(err);
            if (err.details.startsWith("No document to update")) db.collection('config').doc(interact.guildId).set({
                attachments: ch.id
            });
        });
    },
    reset: (interact) => {
        const lang = util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).attachments.reset;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        db.collection('config').doc(interact.guildId).update({
            attachments: FieldValue.delete()
        }).catch((err) => {});
        interact.reply({
            content: lang.reply
        });
    }
}