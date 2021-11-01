const FieldValue = require('firebase-admin').firestore.FieldValue;
const fs = require('fs');
const { GuildVoice, Server } = classes
module.exports = {
    name: 'ready',
    run: async () => {
        try {
            //load configs
            await Promise.all(client.guilds.cache.map(async guild => {
                const sdb = await db.collection(guild.id).doc('suggest').get();
                let suggest = !sdb.exists ? [] : Object.keys(sdb.data()).filter(o => o != 'lastId').map(o => sdb.data()[o])
                client.servers.set(guild.id, new Server(guild.id, {
                    channels: {
                        suggest
                    }
                }));
            }))

            db.collection('config').onSnapshot(async snap => {
                for (const change of snap.docChanges()) {
                    if(change.doc.id == 'bot') return
                    // console.log(change.doc.id)
                    if(client.servers.has(change.doc.id)) client.servers.get(change.doc.id).emit('change', {
                        prefix: change.doc.data()?.prefix ?? '>',
                        lang: change.doc.data()?.lang ?? 'en',
                        blacklist: {
                            channels: change.doc.data()?.blacklistChannels ?? []
                        }
                    })
                    else client.guilds.fetch(change.doc.id).then(guild => {
                        client.servers.set(guild.id, new Server(guild.id, {
                            prefix: change.doc.data()?.prefix ?? '>',
                            lang: change.doc.data()?.lang ?? 'en',
                            blacklist: {
                                channels: change.doc.data()?.blacklistChannels ?? []
                            }
                        }))
                    }).catch(e => /*db.collection('config').doc(change.doc.id).delete()*/ {})
                }
            })

            //load slash commands
            for (const file of fs.readdirSync("./js/slash").filter((f) => f.endsWith(".js"))) {
                const slash = require("../slash/" + file);
                if (slash.servers[0]) await Promise.all(slash.servers.map(guildID => client.guilds.fetch(guildID).then(async guild => guild.commands.create(await slash.data({guild: guildID, client})).then((command) => console.log(command.name, '|', guild.name)).catch(err => {
                    if (!err.toString().endsWith('Missing Access')) console.log(err)
                })).catch((err) => {
                    if (!err.toString().endsWith('Missing Access')) console.log(err)
                })))
                else await Promise.all(client.guilds.cache.map(async guild => guild.commands.create(await slash.data({guild: guild.id, client})).then((command) => console.log(command.name, '|', guild.name)).catch(err => {
                    if (!err.toString().endsWith('Missing Access')) console.log(err)
                })))
            }
            // load user menu
            // for (const file of fs.readdirSync("./js/user").filter((f) => f.endsWith(".js"))) {
            //     const user = require("../user/" + file);
            //     const guild = await client.guilds.cache.map(async g=>{
            //         g.commands.create(await user.data({guild:g.id}))
            //     })
            // }
            console.log('\x1b[31m%s\x1b[0m', `${client.user.username} ${require('../../package.json').version} Listo y Atento!!!`);



            // let channel = () => {
            //     const c = [
            //         // '885674115615301650', //oneki
            //         '850338969135611926',
            //         '850373152943898644',
            //         '850471820493979648',
            //         '862907238673809430',
            //         '889697060037722172',
            //         '856576340115062785',
            //         '853131733918941205',
            //         '884185193324355594',
            //         '850374620321808416',
            //         '853126432305053716',
            //         '850460895053479936'
            //     ]
            //     return c[Math.floor(Math.random() * c.length)]
            // }
            // const caza = async () => {
            //     let ch = client.channels.cache.get(channel());
            //     if(ch){
            //         if(ch.id !== '850338969135611926' && (Math.floor(Math.random()*5)+1) > 3){
            //             const e = ch.guild.emojis.cache.filter(e=>e.available).map(e=>`<${e.animated?'a':''}:${e.name}:${e.id}>`)
            //             const msg = [
            //                 'se te perdió algo?',
            //                 'buscabas algo?',
            //                 `${e[Math.floor(Math.random()*e.length)]}`
            //             ]
            //             const m = await ch.send(msg[Math.floor(Math.random()*msg.length)])
            //             await util.sleep((Math.floor(Math.random()*30)+20)*1000)
            //             ch = client.channels.cache.get(channel())
            //             await m.delete()
            //         }
            //         ch.send('https://www.kindpng.com/picc/m/392-3922815_cute-kawaii-chibi-ghost-halloween-asthetic-tumblr-cartoon.png').then(m => m.awaitReactions({max: 1,time: 60000}).then(r=>{
            //             m.delete().catch(err => console.log('err', err));
            //             if(r.size < 1) return;
            //             const obj = {};
            //             const points = (xp, t) => Math.round(150-(t+Math.pow((Math.round((Math.sqrt(100*xp+25)+50)/100)-1),2)/2))
            //             // point = Math.floor((60000 - (new Date().getTime() - m.createdTimestamp))/1000);
            //             console.log(r.first().users.cache.first().username);
            //             db.collection(m.guild.id).doc('fantasmita').get().then(async s=> {
            //                 const pt = points(s.data()[r.first().users.cache.first().id]??0, Math.floor((new Date().getTime() - m.createdTimestamp)/1000))
            //                 obj[r.first().users.cache.first().id] = FieldValue.increment(pt);
            //                 db.collection(m.guild.id).doc('fantasmita').update(obj).catch(err=>{
            //                     if (err.details.startsWith("No document to update")) {
            //                         obj[r.first().users.cache.first().id] = pt;
            //                         db.collection(m.guild.id).doc('fantasmita').set(obj);
            //                     }
            //                 });
            //                 m.guild.channels.cache.get('893310001282678784').send(`${r.first().users.cache.first()} Obtuviste ${pt} puntos`);
            //             });
            //         }));
            //         util.sleep((Math.floor(Math.random()*15)+5)*60000).then(()=>caza());
            //     }
            // }
            // if(process.env.NODE_ENV==='production') caza();
        }  catch (e) {
            util.error(e, __filename)
        }
    }
}
