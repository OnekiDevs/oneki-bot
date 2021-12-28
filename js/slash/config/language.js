const db = require('firebase-admin').firestore();
const { Permissions } = require('discord.js');
module.exports = {
    set: async (interact, options) => {
        const lng = util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).language.set;
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
            content: `${await util.replace(lng.reply, [{ match: "{lang}", replace: `\`${lang}\`` }])}`,
        })
        ws.send(JSON.stringify({
            event: 'lang',
            server: interact.guildId,
            value: lang
        }))
    },
    reset: (interact, options) => {
        const lang = util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).language.reset;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        db.collection('config').doc(interact.guildId).update({
            lang: FieldValue.delete()
        }).catch(() => {});
        interact.reply({
            content: lang.reply
        })
        ws.send(JSON.stringify({
            event: 'lang',
            server: interact.guildId,
            value: 'en'
        }))
    }
}