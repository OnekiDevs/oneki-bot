const db = require('firebase-admin').firestore();
module.exports = {
    set: async (client, interact, options) => {
        console.log(options);
        const lang = options.get('language');
        db.collection('config').doc(interact.guildId).update({
            lang: lang.value
        }).catch((err) => {
            if(err.details.startsWith("No document to update")) db.collection('config').doc(interact.guildId).set({
                lang: lang.value
            })
        });
        interact.reply({
            content: `Idioma cambiado a \`${lang.name}\``
        })
    },
    reset: (client, interact, options) => {
        db.collection('config').doc(interact.guildId).update({
            lang: 'en'
        }).catch((err) => {
            if(err.details.startsWith("No document to update")) db.collection('config').doc(interact.guildId).set({
                lang: 'en'
            })
        });
        interact.reply({
            content: `Idioma cambiado a \`english\``
        })
    }
}