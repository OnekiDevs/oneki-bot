const admin = require('firebase-admin');
module.exports = {
    name: 'message',
    run: async (client, message) => {
        const db = admin.firestore();
        let localPrefix;
        let useDefaultPrefix = false;
        try {
            if (message.author.bot) return;
            if (message.channel.type == 'dm') return client.emit('directMessage', message);
            await db.collection('config').doc(message.guild.id).get().then((doc) => {
                if (doc.exists) {
                    localPrefix = doc.data().prefix;
                } else {
                    useDefaultPrefix = true;
                }
            })
            let args;
            if (useDefaultPrefix) {
                if (!message.content.toLowerCase().startsWith(client.settings.prefix)) return;
                args = message.content.slice(client.settings.prefix.length).trim().split(/ +/g);
            }
            if (!useDefaultPrefix) {
                if (!message.content.toLowerCase().startsWith(localPrefix)) return;
                args = message.content.slice(localPrefix.length).trim().split(/ +/g);
            }
            return client.emit('command', args.shift().toLowerCase(), message, args);
        } catch (error) {
            client.emit('error', client, error, `Channel: <#${message.channel.id}>\nServer: ${message.guild.name} / ${message.guild.id}${message.content}`)
        }
    }
}