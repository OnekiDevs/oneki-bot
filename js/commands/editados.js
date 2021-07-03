const db = require('firebase-admin').firestore();
module.exports = {
    name: "Editados",
    alias: ["edited"],
    userPermissions: [],
    botPermissions: [],
    run: async (client, message, args) => {
        const server = client.servers.get(message.guild.id);
        const lang = client.util.lang({lang:server.lang, route:'commands/moderation/editados'});
        let canal = message.mentions.channels.first() || message.guild.channel.cache.get(args[0]);
        if (!canal) return message.channel.send(lang.mention);
        db.collection(message.guild.id).doc("edited").update({
            channel:canal.id
        }).catch(err => {
            if (err.details.startsWith("No document to update")) {
                db.collection(message.guild.id).doc("edited").set({
                    channel:canal.id
                })
            }
        });
        message.reply(`${await client.utiles.replace(lang.ready, [{match:"{channel}", replace:`<#${canal.id}>`}])}`);
        message.delete();
    }
}