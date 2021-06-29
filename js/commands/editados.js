const db = require('firebase-admin').firestore();
module.exports = {
    name: "Editados",
    alias: ["edited"],
    userPermissions: [],
    botPermissions: [],
    run: async (client, message, args) => {
        let canal = message.mentions.channels.first() || message.guild.channel.cache.get(args[0]);
        if (!canal) return message.channel.send("Mencione un canal también");
        db.collection(message.guild.id).doc("edited").update({
            channel:canal.id
        }).catch(err => {
            if (err.details.startsWith("No document to update")) {
                db.collection(message.guild.id).doc("edited").set({
                    channel:canal.id
                })
            }
        });
        message.inlineReply(`Canal <#${canal.id}> establecido para los mensajes editados`);
        message.delete();
    }
}