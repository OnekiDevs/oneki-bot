const db = require('firebase-admin').firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;
const { Permissions } = require('discord.js');
module.exports = {
    channels: async (client, interact, options) => {
        const lang = client.util.lang({ lang: client.servers.get(interact.guildId).lang, route: "slash/config" }).blacklist.channels;
        if(!interact.member.permissions.has([Permissions.FLAGS.MANAGE_CHANNELS])) return interact.reply({
            content: lang.permissions,
            ephemeral: true
        });
        const add = options.getChannel('add');
        const remove = options.getString('remove');
        if (add) {
            db.collection('config').doc(channel.guild.id).update({ 
                blacklistChannels: FieldValue.arrayUnion(channel.id)
            }).catch(err => {
                if (err.details.startsWith("No document to update")) db.collection(channel.guild.id).doc('blacklist').set({
                    blacklistChannels: [channel.id]
                })
            })
            interact.reply({
            content: `${await client.util.replace(lang.replyAdd, [
                { match: "{channel}", replace: channel.name }
            ])}`,
            ephemeral: true
        })
        } 
        if (remove) {
            const channel = client.channels.cache.get(remove)
            db.collection('config').doc(channel.guild.id).update({
                blacklistChannels: FieldValue.arrayRemove(channel.id)
            }).catch(err => {})
            interact.reply({
                content: `${await client.util.replace(lang.replyRemove, [
                    { match: "{channel}", replace: channel.name }
                ])}`,
                ephemeral: true
            })
        } 
        if (!add && !remove) {
            //get the
            interact.deferUpdate();
        }
    }
}