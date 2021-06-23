const { Permissions } = require('discord.js')
module.exports = {
    name: 'ban',
    userPermissions: [Permissions.FLAGS.BAN_MEMBERS],
    botPermissions: [Permissions.FLAGS.BAN_MEMBERS],
    description: 'Banea un miembro del servidor (Solo para gente con permiso "Administrador" o "Banear")!',
    guildOnly: true,
    usage: '[usuario] [Dias de eliminacion de historial de mensajes] [-s (Mostrar el nombre del moderador responsable al ban] [razón]',
    alias: [],
    run: async (client, message, args) => {
        const db = require('firebase-admin').firestore();
        if (!message.member.permissions.has(['BAN_MEMBERS'])) {
            message.reply('No tienes los suficientes permisos para hacer esto!');
            return;
        } 
        if (!message.guild.me.permissions.has(['BAN_MEMBERS'])) {
            message.reply('No tengo permisos para hacer esto!');
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
            message.reply('No puedes banearte a ti mismo.');
            return;
        }

        let deleteDays = args[1] ?? 1
        console.log(user);
        if (args.length < 2) {
            message.reply(`No se ha proporcionado cuantos dias de historial de mensajes del usuario eliminar, predeterminando a ${deleteDays}.`);
        }

        if (!user) {
            return message.reply('Por favor menciona a alguien.');
        }

        let reason = args.slice(3).join(' ');
        console.log(reason);
        let showMod = args[2] ?? '-i'

        if (args.length < 3) {
            message.reply(`No se ha proporcionado la bandera "-s", ban anonimo.`);
        } 
        if (reason.length === 0) {
            message.reply('No se ha proporcionado una razon, se mandara sin razon el informe.')
            reason = 'No se ha dado razon'
        }

        let member = message.guild.members.cache.get(user.id);
        let embed = new Discord.MessageEmbed()
            .setColor(member.displayHexColor)
            .setTitle(`Has sido baneado de **${message.guild.name}**`)
            .setImage('https://media1.tenor.com/images/de413d89fff5502df7cff9f68b24dca5/tenor.gif?itemid=12850590')
            .setThumbnail(user.avatarURL())
            .addField('Razón:', reason, true)
            .setTimestamp()

        if (showMod == '-s') {
            embed.setAuthor(`Moderador responsable: ${message.author.tag}`, message.author.avatarURL(), 'https://discord.gg/laresistencia');
            embed.setDescription(`Parece que has sido baneado de **${message.guild.name}** por ${message.author.tag}`);
        }

        // return message.inlineReply(embed)
        if (!member.bannable) {
            return message.reply('No puedes banear a este usuario!\nRevisa la jerarquia de los roles!')
        }
        if (member.bannable) {
            user.send(embed).then(() => {
                message.guild.members.ban(user, { deleteDays: deleteDays, reason: reason })
                    .then(_ => message.reply(`Successfully banned **${user.tag}** from the server!`))
                    .catch((error) => {
                        message.reply(`Failed to ban **${user.tag}**: ${error}`);
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