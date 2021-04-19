module.exports = {
    name: 'directMessage',
    run: async (client, message) => {
        const guild = await client.guilds.cache.get(client.guild);
        const channel = await guild.channels.cache.get(client.dmChannel);
        if (!channel) return;
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