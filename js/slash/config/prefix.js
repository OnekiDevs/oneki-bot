const db = require('firebase-admin').firestore();
module.exports = {
    set: async (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).prefix.set;
        const np = options.get('prefix').value;
        if (np.split(/ +/g)[1]) {
            interact.reply({
                content: lang.serverError,
                ephemeral: true
            });
            return;
        }
        const member = await client.guilds.cache.get(interact.guildId)?.members.fetch(interact.member.user.id);
        if (!member) {
            interact.reply({
                content: lang.serverError,
                ephemeral: true
            }); 
            return;
        }
        if (!member.permissions.has("MANAGE_GUILD")) {
            interact.reply({
                content: lang.permissionsError,
                ephemeral: true
            })
            return;
        }
        interact.reply({
            content:  `${await client.utiles.replace(lang.reply, [{ match: "prefix", replace: np }])}`,
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
    reset: (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).prefix.reset;
        db.collection('config').doc(interact.guildId).update({
            prefix: '>'
        }).catch((err) => {
            console.log(err);
            if (err.details.startsWith("No document to update")) db.collection('config').doc(interact.guildId).set({
                prefix: '>'
            });
        });
        interact.reply({
            content: lang.reply
        });
    }
}