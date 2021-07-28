const db = require('firebase-admin').firestore();
const fs = require('fs');
const { Permissions } = require('discord.js')
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
                // console.log(change.doc.id, change.doc.data());
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
            if (slash.servers == 'all') {
                client.guilds.cache.forEach(async g => {
                    const command = await g.commands.create(await slash.data({guild: g.id}));
                    console.log(command.name, '|', g.name);
                })
            } else {
                // console.log(slash);
            }
        }
        console.log('\x1b[31m%s\x1b[0m', `${client.user.username} ${require('../../package.json').version} Listo y Atento!!!`);
    }
}