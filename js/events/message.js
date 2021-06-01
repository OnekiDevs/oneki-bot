module.exports = {
    name: 'message',
    run: async (client, message) => {
        try {
            if (message.author.bot) return;
            if (message.channel.type == 'dm') return client.emit('directMessage', message);
            if (!message.content.toLowerCase().startsWith(client.settings.prefix)) return;
            const args = message.content.slice(client.settings.prefix.length).trim().split(/ +/g);
            return client.emit('command', args.shift().toLowerCase(), message, args.slice(1));
        } catch (error) {
            client.emit('error', client, error, `Channel: <#${message.channel.id}>\nServer: ${message.guild.name} / ${message.guild.id}${message.content}`)
        }
    }
}