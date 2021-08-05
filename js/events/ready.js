const db = require('firebase-admin').firestore();
const fs = require('fs');
// const { Permissions } = require('discord.js')
module.exports = {
    name: 'ready',
    run: async (client) => {
        //load configs
        db.collection('config').onSnapshot(snap => {
            snap.docChanges().forEach(change => {
                client.servers.set(change.doc.id, {
                    prefix: change.doc.data()?.prefix ?? '>',
                    lang: change.doc.data()?.lang ?? 'en'
                });
            })
        })
        client.guilds.cache.map(async guild => {
            if (!client.servers.get(guild.id)) client.servers.set(guild.id, {
                prefix: '>',
                lang: 'en'
            });
        });
        //load slash commands
        for (const file of fs.readdirSync("./js/slash").filter((f) => f.endsWith(".js"))) {
            const slash = require("../slash/" + file);
            if (slash.servers[0]) {
                for (const guildID of slash.servers) {
                    const guild = await client.guilds.fetch(guildID);
                    if (guild) {
                        const command = await guild.commands.create(await slash.data({guild: guild.id}));
                        console.log(command.name, '|', guild.name);
                    }
                }
            }
        }
        console.log('\x1b[31m%s\x1b[0m', `${client.user.username} ${require('../../package.json').version} Listo y Atento!!!`);
    }
}