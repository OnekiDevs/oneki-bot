const db = require('firebase-admin').firestore();
module.exports = {
    set: async (client, interact, options) => {
        const lng = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).language.set;
        const lang = options.get('language');
        db.collection('config').doc(interact.guildId).update({
            lang: lang.value
        }).catch((err) => {
            if(err.details.startsWith("No document to update")) db.collection('config').doc(interact.guildId).set({
                lang: lang.value
            })
        });
        interact.reply({
            content: `${await client.utiles.replace(lng.reply, [{ match: "lang", replace: `\`${lang.name}\`` }])}`,
        })
    },
    reset: (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).language.reset;
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