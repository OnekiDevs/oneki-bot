const db = require('firebase-admin').firestore();
module.exports = {
    name: "Editados",
    alias: ["edited"],
    userPermissions: ['ADMINISTRATOR'],
    botPermissions: [],
    bot: false,
    category:"Configuración",
    description: "establecec el canal donde se mostrarán los mensajes editados. Puede remplazar la mención del canal por el ID del canal",
    use:".editados [#canal]",
    example:".editados #mensajes-editados",
    run: async (client, message, args) => {
        let canal = message.mentions.channels.first() || message.guild.channel.cache.get(args[0]);
        if (!canal) return message.channel.send("Mencione un canal también");
        db.collection(`servers/${message.guild.id}/channels`).doc("edited").update({
            channel:canal.id
        }).catch(err => {
            if (err.details.startsWith("No document to update")) {
                db.collection(`servers/${message.guild.id}/channels`).doc("edited").set({
                    channel:canal.id
                })
            }
        });
        message.inlineReply(`Canal <#${canal.id}> establecido para los mensajes editados`);
        message.delete();
    }
}