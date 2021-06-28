const db = require('firebase-admin').firestore();
module.exports = {
    name: "Eliminados",
    alias: ["deleted"],
    userPermissions: ['ADMINISTRATOR'],
    botPermissions: [],
    bot: false,
    category:"Configuración",
    description: "establecec el canal donde se mostrarán los mensajes eliminados. Puede remplazar la mención del canal por el ID del canal",
    use:".eliminados [#canal]",
    example:".eliminados #mensajes-eliminados",
    run: async (client, message, args) => {
        let canal = message.mentions.channels.first() || message.guild.channel.cache.get(args[0]);
        if (!canal) return message.channel.send("Mencione un canal también");
        db.collection(`servers/${message.guild.id}/channels`).doc("deleted").update({
            channel:canal.id
        }).catch(err => {
            if (err.details.startsWith("No document to update")) {
                db.collection(`servers/${message.guild.id}/channels`).doc("deleted").set({
                    channel:canal.id
                })
            }
        });
        message.inlineReply(`Canal <#${canal.id}> establecido para los mensajes eliminados`);
        message.delete();
    }
}