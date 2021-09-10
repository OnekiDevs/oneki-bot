const db = require('firebase-admin').firestore();
const fs = require('fs');
// const { Permissions } = require('discord.js')
module.exports = {
    name: 'ready',
    run: async (client) => {
        try {
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
                if (slash.servers[0])  for (const guildID of slash.servers) client.guilds.fetch(guildID).then(async guild => guild.commands.create(await slash.data({guild: guildID, client})).then((command) => console.log(command.name, '|', guild.name)).catch(err => {
                    if (!err.toString().endsWith('Missing Access')) console.log(err)
                })).catch((err) => {
                    if (!err.toString().endsWith('Missing Access')) console.log(err)
                })
                else client.guilds.cache.forEach(async guild => guild.commands.create(await slash.data({guild: guild.id, client})).then((command) => console.log(command.name, '|', guild.name)).catch(err => {
                    if (!err.toString().endsWith('Missing Access')) console.log(err)
                }))
            }
            //load user menu
            // for (const file of fs.readdirSync("./js/user").filter((f) => f.endsWith(".js"))) {
            //     const user = require("../user/" + file);
            //     const guild = await client.guilds.cache.map(async g=>{
            //         g.commands.create(await user.data({guild:g.id}))
            //     })
            // }
            console.log('\x1b[31m%s\x1b[0m', `${client.user.username} ${require('../../package.json').version} Listo y Atento!!!`);
        } catch (error) {
            console.log(
                "\x1b[31m%s\x1b[0m",
                "**********************************************************************"
            );
            console.log(error);
            console.log(
                "\x1b[31m%s\x1b[0m",
                "**********************************************************************"
            );
            (await client.channels.fetch("833780614712131616")).send({
                content: process.env.NODE_ENV!='production'?process.env.DEVELOPER_ID?`<@${process.env.DEVELOPER_ID}>`:null:'<@&832657759081463848>',
                embeds: [
                    new MessageEmbed()
                        .setColor("YELLOW")
                        .setTitle("New Error Detected")
                        .addField("Error Type", "```cmd\n" + error.name + "\n```", true)
                        .addField("Error Message", "```cmd\n" + error.message + "\n```", true)
                        .addField("Error In", `\`\`\`cmd\nevent ready\n\`\`\``, true),
                    new MessageEmbed()
                        .setColor("YELLOW")
                        .setTitle("Error Stack")
                        .setDescription(`\`\`\`cmd\n${error.stack}\n\`\`\``),
                ],
            });
        }
    }
}