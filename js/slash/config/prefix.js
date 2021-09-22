const db = require('firebase-admin').firestore();
const { Permissions } = require('discord.js');
module.exports = {
    set: async (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).prefix.set;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        const np = options.getString('prefix');
        if (np.split(/ +/g)[1]) {
            interact.reply({
                content: lang.serverError,
                ephemeral: true
            });
            return;
        }
        if (!interact.member) return interact.reply({
            content: lang.serverError,
            ephemeral: true
        }); 
        if (!interact.member.permissions.has("MANAGE_GUILD")) return interact.reply({
            content: lang.permissionsError,
            ephemeral: true
        });
        interact.reply({
            content:  `${await client.util.replace(lang.reply, [{ match: "{prefix}", replace: np }])}`,
        });
        db.collection('config').doc(interact.guildId).update({
            prefix: np
        }).catch((err) => {
            console.log(err);
            if (err.details.startsWith("No document to update")) db.collection('config').doc(interact.guildId).set({
                prefix: np
            });
        });
    },
    reset: (client, interact) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).prefix.reset;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        db.collection('config').doc(interact.guildId).update({
            prefix: '>'
        }).catch((err) => {
            if (err.details.startsWith("No document to update")) db.collection('config').doc(interact.guildId).set({
                prefix: '>'
            });
            else console.log(err);
        });
        interact.reply({
            content: lang.reply
        });
    }
}