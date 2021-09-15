const db = require('firebase-admin').firestore()
const { WebhookClient } = require('discord.js')
module.exports = {
    name: 'directMessage',
    run: async (message) => {
        try {
            const servers = {
                "832137212266283049": "850338969135611924",
                "849854224938696725": "825936007449935903"
            }
            if (!servers[client.user.id]) return;
            db.collection(servers[client.user.id]).doc('config').get().then(async (config) => {
                if (!config.exists) return;
                // console.log(config.data());
                if (!config.data().channelDM) return;
                const channel = client.channels.cache.get(config.data().channelDM);
                if (!channel) return;
                const webhook = (await channel.fetchWebhooks()).first() ?? await channel.createWebhook(client.user.username, {
                    avatar: client.user.avatarURL(),
                    reason: "Para funciones del bot"
                }).catch(e=>{
                    console.log("ERROR!!!", e.toString())
                });
                if (!webhook) return;
                const webhookClient = new WebhookClient({
                    id: webhook.id,
                    token: webhook.token
                }).send({
                    content: message.content,
                    username: message.author.username,
                    avatarURL: message.author.avatarURL(),
                    files: [message.attachments],
                    embeds: [message.embeds]
                })
            })
        } catch (e) {
            util.error(e, __dirname)
        }
    }
}