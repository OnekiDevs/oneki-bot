// const db = require('firebase-admin').firestore();
const fs = require('fs');
const {channels} = require("../slash/config/blacklist");
const FieldValue = require('firebase-admin').firestore.FieldValue;
// const { Permissions } = require('discord.js')
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

            console.log('\x1b[31m%s\x1b[0m', `${client.user.username} ${require('../../package.json').version} Listo y Atento!!!`);


            setInterval(()=>{
                client.guilds.fetch('850338969135611924').then(g => {
                    const channelss = [
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
                    c = g.channels.cache.filter(c => c.type == 'GUILD_TEXT' && channelss.includes(c.id)).map(c => c.id);
                    const caza = c => {
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
                                obj[r.first().users.cache.first().id] = FieldValue.increment(point)
                                db.collection(g.id).doc('fantasmita').update(obj).catch(err=>{
                                    if (err.details.startsWith("No document to update")) {
                                        obj[r.first().users.cache.first().id] = point
                                        db.collection(g.id).doc('fantasmita').set(obj);
                                    }
                                })
                                m.guild.channels.cache.get('893297508128784425').send(`${r.first().users.cache.first()} Obtuviste ${point} puntos`);
                            })
                        }).catch(e => {
                            if(['DiscordAPIError: Missing Permissions', 'DiscordAPIError: Missing Access'].includes(e.toString())) caza(c)
                            else console.log(e)
                        })
                    }
                    caza(c)
                })
            }, 15*60000)

        }  catch (e) {
            util.error(e, __filename)
        }
    }
}