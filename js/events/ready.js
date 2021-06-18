const db = require('firebase-admin').firestore();
module.exports = {
    name: 'ready',
    run: async (client) => {
        client.guilds.cache.map(async guild => {
            const config = await db.collection(guild.id).doc('config').get();
            client.servers.set(guild.id, {
                prefix: config.data()?.prefix ?? '>'
            })
        })
        console.log('\x1b[31m%s\x1b[0m', `${client.user.username} ${require('../../package.json').version} Listo y Atento!!!`);
    }
}