const db = require('firebase-admin').firestore();
module.exports = {
    name: 'ready',
    run: async (client) => {
        db.collection('config').onSnapshot(snap => {
            snap.docChanges().forEach(change => {
                client.servers.set(change.doc.id, {
                    prefix: change.doc.data()?.prefix ?? '>',
                    lang: change.doc.data()?.lang ?? 'en'
                });
                // console.log(change.doc.id, change.doc.data());
            })
        })
        client.guilds.cache.map(async guild => {
            if (!client.servers.get(guild.id)) client.servers.set(guild.id, {
                prefix: '>',
                lang: 'en'
            });
        });
        console.log('\x1b[31m%s\x1b[0m', `${client.user.username} ${require('../../package.json').version} Listo y Atento!!!`);
    }
}