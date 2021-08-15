const db = require('firebase-admin').firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;
const { Permissions } = require('discord.js');
module.exports = {
    channel: async (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: "slash/config" }).welcome.channel;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        const channel = options.getChannel('channel');
        db.collection(channel.channel.guild.id).doc('bienvenidas').update({ 
            channel: channel.id 
        }).catch(err => {
            if (err.details.startsWith("No document to update")) db.collection(channel.guild.id).doc('bienvenidas').set({
                channel: channel.id
            })
        })
        interact.reply({
            content: `${await client.utiles.replace(lang.reply, [
                { match: "channel", replace: channel.name },
            ])}`
        })
    }, 
    deactivate: async (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: "slash/config" }).welcome.deactivate;
        
        const func = options.getString('function');
        console.log(func);
        if (func == 'welcome') {
            if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
                content: lang.permissions,
                ephemeral: true
            });
            db.collection(interact.guildId).doc('bienvenidas').update({ 
                channel: FieldValue.delete()
            })
            interact.reply({
                content: lang.welcomes
            })
        } else {
            if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_ROLES])) return interact.reply({
                content: lang.permissions,
                ephemeral: true
            });
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
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_ROLES])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        const rol = options.getRole('rol');
        db.collection(rol.role.guild.id).doc('bienvenidas').update({ 
            roles: FieldValue.arrayUnion(rol.id)
        }).catch(err => {
            if (err.details.startsWith("No document to update")) db.collection(rol.guild.id).doc('bienvenidas').set({
                roles: [rol.id]
            })
        })
        interact.reply({
            content: `${await client.utiles.replace(lang.reply, [
                { match: "role", replace: rol.name },
            ])}`,
            ephemeral: true
        })
    }
}