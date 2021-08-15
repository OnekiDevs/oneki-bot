const db = require('firebase-admin').firestore();
const { Permissions } = require('discord.js');
module.exports = {
    set: async (client, interact, options) => {
        const lng = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).language.set;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD])) return interact.reply({
            content: lng.permissions,
            ephemeral: true
        });
        const lang = options.getString('language');
        db.collection('config').doc(interact.guildId).update({
            lang: lang
        }).catch((err) => {
            if(err.details.startsWith("No document to update")) db.collection('config').doc(interact.guildId).set({
                lang: lang
            })
        });
        interact.reply({
            content: `${await client.util.replace(lng.reply, [{ match: "lang", replace: `\`${lang}\`` }])}`,
        })
    },
    reset: (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).language.reset;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        db.collection('config').doc(interact.guildId).update({
            lang: 'en'
        }).catch((err) => {
            if(err.details.startsWith("No document to update")) db.collection('config').doc(interact.guildId).set({
                lang: 'en'
            })
        });
        interact.reply({
            content: lang.reply
        })
    }
}