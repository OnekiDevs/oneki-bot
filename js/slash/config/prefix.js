const db = require('firebase-admin').firestore();
module.exports = {
    set: async (client, interact, options) => {
        console.log(interact);
        const np = options.get('prefix').value;
        if (np.split(/ +/g)[1]) {
            interact.reply({
                content: 'El prefix no puede contener espacios',
                ephemeral: true
            }); 
            return;
        }
        const member = await client.guilds.cache.get(interact.guildId)?.members.fetch(interact.member.user.id);
        if (!member) {
            interact.reply({
                content: 'Nesesito estar en el server para ejecutar el comando',
                ephemeral: true
            }); 
            return;
        }
        if (!member.permissions.has("MANAGE_GUILD")) {
            interact.reply({
                content: 'No tienes los permisos para cambiar el prefix del bot',
                ephemeral: true
            })
            return;
        }
        interact.reply({
            content: `Prefix cambiado exitosamente a "**${np}**"`
        });
        db.collection('config').doc(interact.guildId).update({
            prefix: np
        }).catch((err) => {
            console.log(err);
            if (err.details.startsWith("No document to update")) db.collection('config').doc(interact.guildId).set({
                prefix: np
            });
        });
    },
    reset: (client, interact, options) => {
        
    }
}