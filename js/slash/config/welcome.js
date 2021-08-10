const db = require('firebase-admin').firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;
module.exports = {
    channel: async (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: "slash/config" }).welcome.channel;
        const channel = options.get('channel');
        db.collection(channel.channel.guild.id).doc('bienvenidas').update({ 
            channel: channel.value 
        }).catch(err => {
            if (err.details.startsWith("No document to update")) db.collection(channel.channel.guild.id).doc('bienvenidas').set({
                channel: channel.value
            })
        })
        interact.reply({
            content: `${await client.utiles.replace(lang.reply, [
                { match: "channel", replace: channel.channel.name },
            ])}`
        })
    }, 
    deactivate: async (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: "slash/config" }).welcome.deactivate;
        const func = options.get('function');
        if (func.value == 'welcome') {
            db.collection(interact.guildId).doc('bienvenidas').update({ 
                channel: FieldValue.delete()
            })
            interact.reply({
                content: lang.welcomes
            })
        } else {
            db.collection(interact.guildId).doc('bienvenidas').update({ 
                roles: FieldValue.delete()
            })
            interact.reply({
                content: lang.roles
            })
        }
    }, 
    rols: async (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: "slash/config" }).welcome.rols;
        const rol = options.get('rol');
        db.collection(rol.role.guild.id).doc('bienvenidas').update({ 
            roles: FieldValue.arrayUnion(rol.value)
        }).catch(err => {
            if (err.details.startsWith("No document to update")) db.collection(rol.role.guild.id).doc('bienvenidas').set({
                roles: [rol.value]
            })
        })
        interact.reply({
            content: `${await client.utiles.replace(lang.reply, [
                { match: "role", replace: rol.role.name },
            ])}`,
            ephemeral: true
        })
    }
}