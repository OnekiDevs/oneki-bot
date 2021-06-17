const admin = require('firebase-admin');
const serviceAccount = require("../../src/firebase-key.json");
module.exports = {
    name: 'ban',
    description: 'Banea un miembro del servidor (Solo para gente con permiso "Administrador" o "Banear")!',
    guildOnly: true,
    usage: '[usuario] [razón]',
    alias: [],
    run: async (client, message, args) => {
        const db = admin.firestore();
        if (!message.member.hasPermission(['BAN_MEMBERS'])) {
            message.inlineReply('No tienes los suficientes permisos para hacer esto!');
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
        console.log(user);
        if (args.length < 2) {
            return message.inlineReply('Tal vez no mencionaste a alguien, o no pusiste una razon.\nPor favor menciona al usuario que quieres banear, y proporciona una razón.');
        }

        if (!user) {
            return message.inlineReply('Por favor menciona a alguien.');
        }

        const reason = args.slice(1).join(' ');
        const deleteDays = args[3]
        if (user.id === message.author.id) {
            message.inlineReply('No puedes banearte a ti mismo.\n(De hecho si puedes pero estoy no te voy a dejar)');
            return;
        }

        let member = message.guild.members.cache.get(user.id);
        if (!member.bannable) {
            return message.inlineReply('No puedes banear a este usuario!\nRevisa la jerarquia de los roles!')
        }
        if (member.bannable) {
            user.send(`Has sido baneado de **${message.guild.name}**, razón: ${reason}`).then(() => {
                message.guild.members.ban(user, { deleteDays, reason })
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