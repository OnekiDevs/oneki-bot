const db = require('firebase-admin').firestore();
module.exports = {
    name: 'ready',
    run: async (client) => {
        const config = await db.collection('config').get();
        if (!config.empty) {
            config.forEach(c => {
                client.servers.set(c.id, {
                    prefix: c.data()?.prefix ?? '>'
                });
            });
        }
        client.guilds.cache.map(async guild => {
            if (!client.servers.get(guild.id)) client.servers.set(guild.id, {
                prefix: '>'
            });
        });
        console.log('\x1b[31m%s\x1b[0m', `${client.user.username} ${require('../../package.json').version} Listo y Atento!!!`);
    }
}