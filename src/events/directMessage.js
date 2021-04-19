module.exports = {
    name: 'directMessage',
    run: async (client, message) => {
        const guild = await client.guilds.cache.get('825936007449935903');
        const channel = await guild.channels.cache.get('832788680200028212');
        const webhookClient = (await channel.fetchWebhooks()).first() ?? await channel.createWebhook(client.user.username, {
            avatar: client.user.avatarURL(),
            reason: "Para funciones del bot"
        }).catch(e=>{
            console.log("ERROR!!!", e.toString())
        });
        webhookClient.send(message.content, {
            username: `${message.author.username}`,
            avatarURL: message.author.avatarURL()
        });
    }
}