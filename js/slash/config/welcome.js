const db = require('firebase-admin').firestore();
// const d = require('firebase-admn').firestore
module.exports = {
    set: async (client, interact, options) => {
        const channel = options.get('channel');
        console.log(channel.channel.guild.id);
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
    delete: async (client, interact, options) => { 
        db.collection(channel.channel.guild.id).doc('bienvenidas').delete()
        interact.reply({
            content: `Bienvenidas eliminadas`
        })
    }
}