const db = require('firebase-admin').firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;
module.exports = {
    channel: async (client, interact, options) => {
        const channel = options.get('channel');
        db.collection(channel.channel.guild.id).doc('bienvenidas').update({ 
            channel: channel.value 
        }).catch(err => {
            if (err.details.startsWith("No document to update")) db.collection(channel.channel.guild.id).doc('bienvenidas').set({
                channel: channel.value
            })
        })
        interact.reply({
            content: `Bienvenidas establecido en \`${channel.channel.name}\``
        })
    }, 
    deactivate: async (client, interact, options) => {
        const func = options.get('function');
        if (func.value == 'welcome') {
            db.collection(interact.guildId).doc('bienvenidas').update({ 
                channel: FieldValue.delete()
            })
            interact.reply({
                content: `Bienvenidas eliminadas`
            })
        } else {
            db.collection(interact.guildId).doc('bienvenidas').update({ 
                roles: FieldValue.delete()
            })
            interact.reply({
                content: `Roles eliminados`
            })
        }
    }, 
    rols: async (client, interact, options) => {
        const rol = options.get('rol');
        db.collection(rol.role.guild.id).doc('bienvenidas').update({ 
            roles: FieldValue.arrayUnion(rol.value)
        }).catch(err => {
            if (err.details.startsWith("No document to update")) db.collection(rol.role.guild.id).doc('bienvenidas').set({
                roles: [rol.value]
            })
        })
        interact.reply({
            content: `Rol \`${rol.role.name}\` agregado`,
            ephemeral: true
        })
    }
}