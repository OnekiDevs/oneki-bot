module.exports = {
    name: 'message',
    run: async (client, message) => {
        try {
            if (message.author.bot) return;
            if (message.channel.type == 'dm') return client.emit('directMessage', message);
            const prefix = client.servers.get(message.guild.id)?.prefix;
            if (!message.content.toLowerCase().startsWith(prefix)) return;
            args = message.content.slice(prefix.length).trim().split(/ +/g);
            return client.emit('command', args.shift().toLowerCase(), message, args);
        } catch (error) {
            console.log(error);
            const channelError = await client.channels.cache.get('833780614712131616');
            channelError.send(`Error en **events/message.js**\n${error} <@&832657759081463848>\nChannel: <#${message.channel.id}>\nServer: ${message.guild.name} / ${message.guild.id}${message.content}`);
        }
    }
}