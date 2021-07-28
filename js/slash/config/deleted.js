const db = require('firebase-admin').firestore();
module.exports = {
    channel: async (client, interact, options) => {
        const channel = options.get('channel');
        db.collection(channel.channel.guild.id).doc("deleted").update({ 
            channel: channel.value
        }).catch(err => {
            if (err.details.startsWith("No document to update")) db.collection(channel.channel.guild.id).doc("deleted").set({ 
                channel: channel.value
            })
        })
        interact.reply({
            content: `Canal \`${channel.channel.name}\` establecido para ver los mensajes eliminados`,
            ephemeral: true
        })
    }, 
    reset: async (client, interact, options) => {
        db.collection(channel.channel.guild.id).doc("deleted").delete()
        interact.reply({
            content: `Ver los mensajes eliminados desactivado`,
            ephemeral: true
        })
    }
}