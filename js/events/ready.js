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
                    lang: change.doc.data()?.lang ?? 'en',
                    blacklist: {
                        channels: change.doc.data()?.blacklistChannels ?? []
                    }
                });
            })
        })
        client.guilds.cache.map(async guild => {
            if (!client.servers.get(guild.id)) client.servers.set(guild.id, {
                prefix: '>',
                lang: 'en',
                blacklist: {
                    channels: []
                }
            });
        });
        //load slash commands
        for (const file of fs.readdirSync("./js/slash").filter((f) => f.endsWith(".js"))) {
            const slash = require("../slash/" + file);
            if (slash.servers[0])  for (const guildID of slash.servers) client.guilds.cache.get(guildID)?.commands.create(await slash.data({guild: guild.id})).then((command) => console.log(command.name, '|', guild.name)).catch(err => console.log(guild.name, 'error',))
            else client.guilds.cache.forEach(async guild => guild.commands.create(await slash.data({guild: guild.id})).then((command) => console.log(command.name, '|', guild.name)).catch(err => console.log(guild.name, 'error',)))
        }
        //load user menu
        // for (const file of fs.readdirSync("./js/user").filter((f) => f.endsWith(".js"))) {
        //     const user = require("../user/" + file);
        //     const guild = await client.guilds.cache.map(async g=>{
        //         g.commands.create(await user.data({guild:g.id}))
        //     })
        // }
        console.log('\x1b[31m%s\x1b[0m', `${client.user.username} ${require('../../package.json').version} Listo y Atento!!!`);
    }
}