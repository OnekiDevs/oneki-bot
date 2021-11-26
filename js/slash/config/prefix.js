const FieldValue = require('firebase-admin').firestore.FieldValue;
const { Permissions } = require('discord.js');
module.exports = {
    set: async (interact, options) => {
        const lang = util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).prefix.set;
        if(!interact.member.permissions.has(['MANAGE_GUILD'])) return interact.reply({
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
            content:  `${await util.replace(lang.reply, [{ match: "{prefix}", replace: np }])}`,
        });
        db.collection('config').doc(interact.guildId).update({
            prefix: np
        }).catch((err) => {
            console.log(err);
            if (err.details.startsWith("No document to update")) db.collection('config').doc(interact.guildId).set({
                prefix: np
            });
        });

        ws.send(JSON.stringify({
            event: 'prefix',
            server: interact.guildId,
            value: np
        }))
    },
    reset: (interact) => {
        const lang = util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).prefix.reset;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_GUILD])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        db.collection('config').doc(interact.guildId).update({
            prefix: FieldValue.delete()
        }).catch(() => {});
        interact.reply({
            content: lang.reply
        });
        ws.send(JSON.stringify({
            event: 'prefix',
            server: interact.guildId,
            value: '>'
        }))
    }
}