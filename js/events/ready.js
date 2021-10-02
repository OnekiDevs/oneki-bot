const FieldValue = require('firebase-admin').firestore.FieldValue;
const fs = require('fs');
module.exports = {
    name: 'ready',
    run: async () => {
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


                    c = [
                        // '885674115615301650', //oneki
                        '850338969135611926',
                        '850373152943898644',
                        '850471820493979648',
                        '862907238673809430',
                        '889697060037722172',
                        '850477640833564732',
                        '856576340115062785',
                        '853131733918941205',
                        '884185193324355594',
                        '850374620321808416',
                        '853126432305053716',
                        '850460895053479936'
                    ]
                    const caza = async c => {
                        const channel = c[Math.floor(Math.random()*c.length)]
                        client.channels.cache.get(channel).send('https://www.kindpng.com/picc/m/392-3922815_cute-kawaii-chibi-ghost-halloween-asthetic-tumblr-cartoon.png').then(m => {
                            m.awaitReactions({
                                max: 1,
                                time: 60000
                            }).then(r=>{
                                m.delete().catch(err => console.log('err', err));
                                if(r.size < 1) return;
                                const obj = {}
                                point = Math.floor((60000 - (new Date().getTime() - m.createdTimestamp))/1000);
                                console.log(r.first().users.cache.first().username)
                                obj[r.first().users.cache.first().id] = FieldValue.increment(point);
                                db.collection(m.guild.id).doc('fantasmita').update(obj).catch(err=>{
                                    if (err.details.startsWith("No document to update")) {
                                        obj[r.first().users.cache.first().id] = point
                                        db.collection(m.guild.id).doc('fantasmita').set(obj);
                                    }
                                })
                                m.guild.channels.cache.get('893310001282678784').send(`${r.first().users.cache.first()} Obtuviste ${point} puntos`);
                            })
                        }).catch(e => {
                            if(['DiscordAPIError: Missing Permissions', 'DiscordAPIError: Missing Access'].includes(e.toString())) caza(c)
                            else console.log(e)
                        })
                        const ms = (Math.floor(Math.random()*25)+5)*60000
                        console.log(ms)
                        await util.sleep(ms)
                        caza(c)
                    }
                    caza(c)

        }  catch (e) {
            util.error(e, __filename)
        }
    }
}