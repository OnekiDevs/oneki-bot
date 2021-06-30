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
        const server = client.servers.get(message.guild.id);
        const lang = client.util.lang({lang:server.lang, route:'commands/fun/ban'});
        const db = admin.firestore();
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            message.reply(lang.missing_permissions_user);
            return;
        }
        if (!message.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            message.reply(lang.missing_permissions_bot);
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
            message.reply(lang.banself);
            return;
        }

        let deleteDays = args[1] ?? 1
        let providedDeleteDays;
        console.log(user);
        if (args.length < 2) {
            providedDeleteDays = 1;
        }

        if (!user) {
            return message.reply(lang.mention_lose);
        }

        let reason = args.slice(3).join(' ');
        console.log(reason);
        let showMod = args[2] ?? '-i'

        if (args.length < 3) {
            showMod = '-1'
        }
        if (reason.length === 0) {
            reason = lang.without_reason
        }

        let member = message.guild.members.cache.get(user.id);
        let embed = new Discord.MessageEmbed()
            .setColor(member.displayHexColor)
            .setTitle(`${lang.embed.title} **${message.guild.name}**`)
            .setImage('https://media1.tenor.com/images/de413d89fff5502df7cff9f68b24dca5/tenor.gif?itemid=12850590')
            .setThumbnail(user.avatarURL())
            .addField('Razón:', reason, true)
            .setTimestamp()

        if (showMod == '-s') {
            embed.setAuthor(`Moderador responsable: ${message.author.tag}`, message.author.avatarURL(), 'https://discord.gg/laresistencia');
            embed.setDescription(`Parece que has sido baneado de **${message.guild.name}** por ${message.author.tag}`);
        }

        if (!member.bannable) {
            return message.reply('No puedes banear a este usuario!\nRevisa la jerarquia de los roles!')
        }
        if (member.bannable) {
            let informBan = `Se ha baneado correctamente al usuario **${user.tag}**`
            if (reason === 'No se ha dado razon.') {
                informBan = `Se ha baneado correctamente al usuario **${user.tag}**, sin razon.`
            }
            if (!providedDeleteDays) {
                informBan = `Se ha baneado correctamente al usuario **${user.tag}**, borrando ${deleteDays} dias de mensajes del usuario.`
            }
            user.send(embed).then(() => {
                message.guild.members.ban(user, { deleteDays: deleteDays, reason: reason })
                    .then(_ => message.reply(informBan))
                    .catch((error) => {
                        message.reply(`Failed to ban **${user.tag}**: ${error}`);
                    })
            })
        }

        // Save of ban in the DB

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
                    sanctionsRef.set({ numberOfBans: 1, bans: [{ reason: reason }] }).then(() => {
                        console.log(`Sanctions ref for user "${user.tag}" didn't existed, created.\nRegistered ban, and incremented number of bans by 1.`);
                        firstBan = true;
                        return null;
                    })
                }
                if (!canContinue) {
                    return;
                }

            } else {
                sanctionsRef.set({ numberOfBans: 1, bans: [{ reason: reason }] }).then(() => {
                    console.log(`Sanctions ref for user "${user.tag}" didn't existed, created.\nRegistered ban, and incremented number of bans by 1.`);
                    firstBan = true;
                    return null;
                })
            }
            if (doc.data().numberOfBans == undefined) {
                sanctionsRef.set({ numberOfBans: 1, bans: [{ reason: reason }] }).then(() => {
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
                sanctionsRef.set({ numberOfBans: 1, bans: [{ reason: reason }] }).then(() => {
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

                let obj = Array.from(setMap).reduce((obj, [key, value]) => (
                    Object.assign(obj, { [key]: value }) // Be careful! Maps can have non-String keys; object literals can't.
                ), {});
                const arrayUnion = admin.firestore.FieldValue.arrayUnion;
                userSanctionsRef.update(
                    { bans: arrayUnion(reason) }
                    // { bans: [{ reason: reason }] }, { merge: true } 
                ).then(() => {
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