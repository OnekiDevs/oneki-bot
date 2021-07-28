const db = require('firebase-admin').firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;
module.exports = {
    channel: async (client, interact, options) => {
        const channel = options.get('channel');
        const name = options.get('name');
        let obj = {}
        if (name) obj[name.value] = channel.value;
        else obj['predetermined'] = channel.value;
        db.collection(interact.guildId).doc('suggest').update(obj).catch(err => {
            if (err.details.startsWith("No document to update")) db.collection(interact.guildId).doc('suggest').set(obj);
        });
        interact.reply({
            content: `Canal \`${channel.channel.name}\` establecido como sugerencias${name?` de \`${name.value}\``:''}`,
            ephemeral: true
        });
        channel.channel.send(`Este canal ha sido configurado como canal para las sugerencias${name?` de \`${name.value}\``:''}\nPara hacer una sugerencia escribe el comando \`${client.servers.get(interact.guildId)?.prefix}suggest ${name?`${name.value} `:''}[tu sugerencia]\``)
    }, 
    delete: async (client, interact, options) => {
        const channel = options.get('channel');
        if (channel) {
            let obj = {}
            obj[channel.value] = FieldValue.delete()
            db.collection(interact.guildId).doc('suggest').update(obj).catch(err => {
                if (err.details.startsWith("No document to update")) db.collection(interact.guildId).doc('suggest').set(obj);
            });
            interact.reply({
                content: `El canal de sugerencias \`${channel.value}\` ha sido desestablecido`
            })
        } else {
            interact.deferUpdate();
        }
    }
}