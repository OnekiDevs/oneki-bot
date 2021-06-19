const admin = require('firebase-admin');
const serviceAccount = require("../../src/firebase-key.json");
const Discord = require('discord.js')
module.exports = {
    name: 'ban',
    description: 'Banea un miembro del servidor (Solo para gente con permiso "Administrador" o "Banear")!',
    guildOnly: true,
    usage: '[usuario] [Dias de eliminacion de historial de mensajes] [-s|-i (Mostrar el nombre del moderador responsable al baneado)] [razón]',
    alias: [],
    run: async (client, message, args) => {
        const db = admin.firestore();
        if (!message.member.hasPermission(['BAN_MEMBERS'])) {
            message.inlineReply('No tienes los suficientes permisos para hacer esto!');
            return;
        } else if (!message.guild.me.hasPermission(['BAN_MEMBERS'])) {
            message.inlineReply('No tengo permisos para hacer esto!');
            return;
        }

        function getUserFromMention(mention) {
            if (!mention) return;

            if (mention.startsWith('<@') && mention.endsWith('>')) {
                mention = mention.slice(2, -1);

                if (mention.startsWith('!')) {
                    mention = mention.slice(1);
                }

                return client.users.cache.get(mention);
            } else {
                return client.users.cache.get(mention);
            }
        }

        const user = getUserFromMention(args[0]);

        if (user.id === message.author.id) {
            message.inlineReply('No puedes banearte a ti mismo.');
            return;
        }

        let deleteDays = args[1] ?? 1
        console.log(user);
        if (args.length < 2) {
            message.inlineReply(`No se ha proporcionado cuantos dias de historial de mensajes del usuario eliminar, predeterminando a ${deleteDays}. Continuar? (Proporcionar/Continuar, 10 secs para responder)`);
            const filter = m => m.author.id === message.author.id
            await message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
                .then(collected => {
                    if (collected.first().content.toLowerCase() === 'proporcionar') {
                        collected.first().inlineReply('Escuchando... (Por favor pon un numero entre 0 y 7)').then(() => {
                            const filter2 = m => m.author.id === message.author.id
                            message.channel.awaitMessages(filter2, { max: 1, time: 10000, errors: ['time'] })
                                .then(collected => {
                                    if (collected.first().content.length == 1 && parseInt(collected.first().content) < 8) {
                                        deleteDays = parseInt(collected.first().content);
                                        message.channel.send(`Continuando con ${deleteDays}!`)
                                    } else {
                                        collected.first().inlineReply('Por favor empieza de nuevo y proporciona un numero entre 0 y 7.')
                                    }
                                })
                                .catch(() => {
                                    message.channel.send(`Continuando con ${deleteDays}!`)
                                })
                        })
                    }
                    if (collected.first().content.toLowerCase() === 'continuar') {
                        collected.first().inlineReply(`Esta bien, continuando con ${deleteDays}!`)
                    }
                    if (collected.first().content.toLowerCase() != 'continuar' || collected.first().content.toLowerCase() != 'proporcionar') {
                        message.channel.send(`Continuando con ${deleteDays}!`)
                    }
                })
                .catch(() => {
                    message.channel.send(`Continuando con ${deleteDays}.`)
                })
        }

        if (!user) {
            return message.inlineReply('Por favor menciona a alguien.');
        }

        let reason = args.slice(3).join(' ');
        let showMod = args[2] ?? '-i'

        if (args.length < 3) {
            message.inlineReply(`No se ha proporcionado el anonimato del moderador, predeterminando a ${showMod}. Continuar? (Proporcionar/Continuar, 10 secs para responder)`);
            const filter = m => m.author.id === message.author.id
            await message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ['time'] })
                .then(collected => {
                    if (collected.first().content.toLowerCase() === 'proporcionar') {
                        collected.first().inlineReply('Escuchando... (Por favor pon la bandera -s o -i)').then(() => {
                            const filter2 = m => m.author.id === message.author.id
                            message.channel.awaitMessages(filter2, { max: 1, time: 10000, errors: ['time'] })
                                .then(collected => {
                                    if (collected.first().content.length == 2 && collected.first().content == '-s' || collected.first().content == '-i') {
                                        deleteDays = parseInt(collected.first().content);
                                        message.channel.send(`Continuando con ${showMod}!`)
                                    } else {
                                        collected.first().inlineReply('Por favor empieza de nuevo y proporciona una bandera valida.')
                                    }
                                })
                                .catch(() => {
                                    message.channel.send(`Continuando con ${showMod}!`)
                                })
                        })
                    }
                    if (collected.first().content.toLowerCase() === 'continuar') {
                        collected.first().inlineReply(`Esta bien, continuando con ${showMod}!`)
                    }
                    if (collected.first().content.toLowerCase() != 'continuar' || collected.first().content.toLowerCase() != 'proporcionar') {
                        message.channel.send(`Continuando con ${showMod}!`)
                    }
                })
                .catch(() => {
                    message.channel.send(`Continuando con ${showMod}.`)
                })
        } 
        if (reason.length === 0) {
            message.inlineReply('Por favor proporciona una razón, escuchando...')
            const filter = m => m.author.id === message.author.id
            await message.channel.awaitMessages(filter, { max: 1, time: 15000, errors: ['time'] })
                .then(collected => {
                    reason = collected.first().content;
                })
                .catch(() => {
                    message.inlineReply('Empieza de nuevo por favor.')
                })
        }

        let member = message.guild.members.cache.get(user.id);
        let embed = new Discord.MessageEmbed()
            .setColor(member.displayHexColor)
            .setTitle(`Has sido baneado de **${message.guild.name}**`)
            .setDescription(`Parece que has sido baneado de **${message.guild.name}**, abajo la razon.`)
            .setImage('https://media1.tenor.com/images/de413d89fff5502df7cff9f68b24dca5/tenor.gif?itemid=12850590')
            .setThumbnail(user.avatarURL())
            .addField('Razón:', reason, true)
            .setTimestamp()

        if (showMod == '-s') {
            embed.setAuthor(`Moderador responsable: ${message.author.tag}`, message.author.avatarURL(), 'https://discord.gg/laresistencia')
        }

        // return message.inlineReply(embed)
        if (!member.bannable) {
            return message.inlineReply('No puedes banear a este usuario!\nRevisa la jerarquia de los roles!')
        }
        if (member.bannable) {
            user.send(embed).then(() => {
                message.guild.members.ban(user, { deleteDays: deleteDays, reason })
                    .then(_ => message.inlineReply(`Successfully banned **${user.tag}** from the server!`))
                    .catch((error) => {
                        message.inlineReply(`Failed to ban **${user.tag}**: ${error}`);
                    })
            })
        }

        let firstBan = true;
        let canContinue = true;
        let sanctionsRef = db.collection(message.guild.id).doc('users').collection(user.id).doc('sanctions')
        await sanctionsRef.get().then(doc => {
            if (doc.exists) {
                sanctionsRef.get().then(doc => {
                    if (doc.data().numberOfBans > 0) {
                        canContinue = false;
                        firstBan = false;
                        return
                    }
                })
                if (doc.data().numberOfBans == undefined) {
                    console.log(doc.data().numberOfBans);
                    sanctionsRef.set({ numberOfBans: 1, ban1: { banId: 1, banReason: reason } }).then(() => {
                        console.log(`Sanctions ref for user "${user.tag}" didn't existed, created.\nRegistered ban, and incremented number of bans by 1.`);
                        firstBan = true;
                        return null;
                    })
                }
                if (!canContinue) {
                    return;
                }

            } else {
                sanctionsRef.set({ numberOfBans: 1, ban1: { banId: 1, banReason: reason } }).then(() => {
                    console.log(`Sanctions ref for user "${user.tag}" didn't existed, created.\nRegistered ban, and incremented number of bans by 1.`);
                    firstBan = true;
                    return null;
                })
            }
            if (doc.data().numberOfBans == undefined) {
                sanctionsRef.set({ numberOfBans: 1, ban1: { banId: 1, banReason: reason } }).then(() => {
                    console.log(`Sanctions ref for user "${user.tag}" didn't existed, created.\nRegistered ban, and incremented number of bans by 1.`);
                    firstBan = true;
                    return null;
                })
            }
        })
        await new Promise(r => setTimeout(r, 7000));
        await db.collection(message.guild.id).doc('users').collection(user.id).doc('sanctions').get().then(doc => {
            if (firstBan) return
            if (doc.data().numberOfBans == undefined) {
                sanctionsRef.set({ numberOfBans: 1, ban1: { banId: 1, banReason: reason } }).then(() => {
                    console.log(`Sanctions ref for user "${user.tag}" didn't existed, created.\nRegistered ban, and incremented number of bans by 1.`);
                    firstBan = true;
                    return null;
                })
            }
            let userSanctionsRef = db.collection(message.guild.id).doc('users').collection(user.id).doc('sanctions')
            userSanctionsRef.get().then(doc => {
                let previousBans = doc.data().numberOfBans;
                let setMap = new Map()
                setMap.set('numberOfBans', previousBans + 1)
                setMap.set(`ban${previousBans + 1}`, { banId: previousBans + 1, banReason: reason })

                let obj = Array.from(setMap).reduce((obj, [key, value]) => (
                    Object.assign(obj, { [key]: value }) // Be careful! Maps can have non-String keys; object literals can't.
                ), {});
                userSanctionsRef.set(obj, { merge: true }).then(() => {
                    console.log(`New ban for user "${user.tag} registered.`);
                })
                userSanctionsRef.update({ numberOfBans: previousBans + 1 }).then(() => {
                    console.log(`Number of bans for user "${user.tag}" incremented by 1.`);
                })
            })

        })
        return;
    },
};