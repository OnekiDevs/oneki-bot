const db = require('firebase-admin').firestore();
module.exports = {
    channel: async (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).edited.reset;
        const channel = options.get('channel');
        db.collection(channel.channel.guild.id).doc("edited").update({ 
            channel: channel.value
        }).catch(err => {
            if (err.details.startsWith("No document to update")) db.collection(channel.channel.guild.id).doc("edited").set({ 
                channel: channel.value
            })
        })
        interact.reply({
            content: `${await client.utiles.replace(lang.reply, [{ match: "channel", replace: `\`${channel.channel.name}\`` }])}`,
            ephemeral: true
        })
    }, 
    reset: async (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: 'slash/config' }).edited.reset;
        db.collection(interact.guildId).doc("edited").delete()
        interact.reply({
            content: lang.reply,
            ephemeral: true
        })
    }
}