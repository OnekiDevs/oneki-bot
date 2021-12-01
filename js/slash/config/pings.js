const FieldValue = require('firebase-admin').firestore.FieldValue;
const ytch = require('yt-channel-info')

module.exports = {
    /**
     *
     * @param interact: Discord.CommandInteraction
     * @returns {Promise<void>}
     */
    add_youtube: async (interact) => {
        const ytChannel = interact.options.getString('yt_channel');
        ytch.getChannelInfo(ytChannel).then((response) => {
            // console.log(response)
            const channel = interact.options.getChannel('channel')
            console.log('these')
            let obj = {}; obj[ytChannel] = FieldValue.arrayUnion(channel.id)
            let obj2 = {}; obj2[`notifications.${ytChannel}`] = channel.id
            db.collection('notifications').doc('youtube').update(obj).catch(err => {
                if (err.details.startsWith("No document to update")) db.collection('config').doc(interact.guildId).set(obj);
            })
            db.collection('config').doc(interact.guildId).update(obj2).catch(err => {
                if (err.details.startsWith("No document to update")) db.collection('config').doc(interact.guildId).set(obj2);
            })
            interact.reply(`Pings de ${response.author} establecidos en ${channel.name}`)
        }).catch((err) => {
            console.log('this')
            interact.reply({
                content:'Canal de yt no encontrado',
                ephemeral: true
            })
        })
    }
}